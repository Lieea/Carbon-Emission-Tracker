import { supabase } from '../supabaseClient.js';

export function render(state) {
  return `
    <div class="login-wrapper">
      <div class="login-split image-side">
        <div class="brand-overlay">
          <div class="logo">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
             </svg>
             <h2>EcoTrek</h2>
          </div>
          <p class="tagline">Track your footprint.<br>Drive a greener future.</p>
        </div>
      </div>
      <div class="login-split form-side">
        <div class="login-container card glass">
          <div class="login-header">
            <h1>Welcome Back</h1>
            <p>Enter your details to access your dashboard.</p>
          </div>
          
          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="email">Email address</label>
              <input type="email" id="email" class="form-input" placeholder="name@example.com" required>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input type="password" id="password" class="form-input" placeholder="••••••••" required>
              <div class="forgot-password">
                <a href="#">Forgot password?</a>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" style="width: 100%; margin-top: 1rem;">
              Sign In
            </button>
          </form>
          
          <div class="login-footer">
            <p>Access your EcoTrek dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(state) {
  const form = document.getElementById('login-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const btn = form.querySelector('button');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Authenticating...';
      btn.style.opacity = '0.8';

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        alert(error.message);
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
      } else {
        // Navigate to dashboard
        window.history.pushState(null, '', '/dashboard');
        window.dispatchEvent(new Event('popstate'));
      }
    });
  }
}
