import './style.css';
import { supabase } from './supabaseClient.js';

// Simple Router
const routes = {
  '/': 'login',
  '/dashboard': 'dashboard',
  '/logger': 'logger',
  '/analytics': 'analytics',
  '/profile': 'profile'
};

const appState = {
  user: null, // Replace with actual user object on login
  ecoStreak: Math.floor(Math.random() * 10), // Mock data for leaf animation
};

async function loadView(path) {
  let viewName = routes[path] || 'login';
  const appElement = document.getElementById('app');

  // Check auth status
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && path !== '/') {
    // If not logged in and trying to access protected route, redirect to login
    window.history.pushState(null, '', '/');
    viewName = 'login';
    path = '/';
  } else if (session && path === '/') {
    // If logged in and trying to access login, redirect to dashboard
    window.history.pushState(null, '', '/dashboard');
    viewName = 'dashboard';
    path = '/dashboard';
  }

  // Set user state
  appState.user = session ? session.user : null;

  // Sync user profile if logged in
  if (appState.user) {
    await syncUserProfile(appState.user);
  }

  // Transition effect
  appElement.style.opacity = '0';

  setTimeout(async () => {
    try {
      // Dynamic import of the view module
      const viewModule = await import(`./views/${viewName}.js`);
      appElement.innerHTML = viewModule.render(appState);

      // Initialize view logic if it exists
      if (typeof viewModule.init === 'function') {
        viewModule.init(appState);
      }

      appElement.style.opacity = '1';
      appElement.style.transition = 'opacity var(--transition-normal)';

      // Setup navigation links in the new view
      setupNavigation();

    } catch (error) {
      console.error(`Error loading view: ${viewName}`, error);
      appElement.innerHTML = '<h2>Error loading view.</h2>';
      appElement.style.opacity = '1';
    }
  }, 150); // Small delay to allow fade out
}

async function syncUserProfile(user) {
  // Check if profile exists in public.users
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    // Profile missing, create it
    console.log('Syncing user profile...');
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'EcoTrek User',
        role: 'driver'
      });

    if (insertError) console.error('Error syncing profile:', insertError.message);
  } else if (error) {
    console.error('Profile check error:', error.message);
  }
}

function handleNavigation(e) {
  // Find closest anchor tag
  const link = e.target.closest('[data-link]');

  if (link) {
    e.preventDefault();
    const href = link.getAttribute('href');

    // Check if it's the sign out link
    if (href === '/') {
      supabase.auth.signOut().then(() => {
        window.history.pushState(null, '', '/');
        loadView('/');
      });
      return;
    }

    window.history.pushState(null, '', href);
    loadView(href);
  }
}

function setupNavigation() {
  const links = document.querySelectorAll('[data-link]');
  links.forEach(link => {
    // Remove old listeners to prevent duplicates
    link.removeEventListener('click', handleNavigation);
    link.addEventListener('click', handleNavigation);
  });
}

// Global UI Elements
function renderGlobalUI() {
  // Only render FAB if logged in (not on login page)
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    const existingFab = document.getElementById('global-fab');
    if (!existingFab) {
      const fab = document.createElement('button');
      fab.id = 'global-fab';
      fab.className = 'fab';
      fab.innerHTML = '+';
      fab.title = 'Log a Trip';
      fab.onclick = () => {
        window.history.pushState(null, '', '/logger');
        loadView('/logger');
      };
      document.body.appendChild(fab);
    }
  } else {
    const existingFab = document.getElementById('global-fab');
    if (existingFab) existingFab.remove();
  }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  renderGlobalUI();
  loadView(window.location.pathname);
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Normalize root path for GitHub Pages/local environments
  const path = window.location.pathname === '/index.html' ? '/' : window.location.pathname;
  renderGlobalUI();
  loadView(path);
});

// Watch for path changes to update Global UI
let currentPath = window.location.pathname;
setInterval(() => {
  if (currentPath !== window.location.pathname) {
    currentPath = window.location.pathname;
    renderGlobalUI();
  }
}, 100);
