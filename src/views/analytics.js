import { supabase } from '../supabaseClient.js';

export function render(state) {
    return `
    <div class="app-container">
      <!-- Sidebar Navigation (Same as Dashboard) -->
      <aside class="sidebar">
        <div class="sidebar-header">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
           </svg>
           <h2>EcoTrek</h2>
        </div>
        <nav class="sidebar-nav">
          <a href="/dashboard" class="nav-item" data-link>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
             Dashboard
          </a>
          <a href="/profile" class="nav-item" data-link>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
             My Profile
          </a>
          <a href="/analytics" class="nav-item active" data-link>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
             Analytics
          </a>
          <a href="/" class="nav-item" data-link style="margin-top: auto;">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
             Sign Out
          </a>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <header class="topbar">
          <div class="page-title">
            <h1>Analytics & Reports</h1>
            <p>Dive deep into your emission trends.</p>
          </div>
          <div class="header-actions" style="display: flex; gap: 1rem;">
             <button class="btn btn-sm export-btn" style="background-color: white; border: 1px solid var(--color-text-muted); color: var(--color-text-main);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export CSV
             </button>
             <button class="btn btn-primary btn-sm export-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Download PDF
             </button>
          </div>
        </header>

        <div class="analytics-grid">
           <!-- Time-Series Chart -->
           <div class="card glass trend-chart-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                 <h3>12-Month Emission Trend</h3>
                  <select class="form-input" id="vehicle-filter" style="width: auto; padding: 0.4rem 2rem 0.4rem 1rem;">
                     <option value="all">All Vehicles</option>
                  </select>
              </div>
              <div class="chart-container" style="position: relative; height: 300px; width: 100%;">
                 <canvas id="trendChart"></canvas>
              </div>
           </div>

           <!-- Vehicle Comparison Chart -->
           <div class="card glass comparison-chart-card">
              <h3>Vehicle Comparison</h3>
              <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">Average emissions per 100 miles</p>
              <div class="chart-container" style="position: relative; height: 250px; width: 100%;">
                 <canvas id="comparisonChart"></canvas>
              </div>
           </div>
        </div>
      </main>
    </div>
  `;
}

export async function init(state) {
    if (!window.Chart || !state.user) return;

    // Fetch Trips
    const { data: trips } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', state.user.id);

    // Fetch Vehicles
    const { data: vehicles } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', state.user.id);

    // 1. Process Data for Monthly Trend (Current Year)
    const currentYear = new Date().getFullYear();
    const monthlyEmissions = new Array(12).fill(0);

    if (trips && trips.length > 0) {
        trips.forEach(t => {
            const date = new Date(t.log_date);
            if (date.getFullYear() === currentYear) {
                monthlyEmissions[date.getMonth()] += Number(t.co2_kg);
            }
        });
    }

    // Time-Series Trend Line Chart
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'CO₂ Emissions (kg)',
                    data: monthlyEmissions,
                    borderColor: '#004D4D', // Deep Teal
                    backgroundColor: 'rgba(0, 77, 77, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#004D4D',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#2C3E50',
                        bodyColor: '#6C757D',
                        borderColor: '#E2E8F0',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)', borderDash: [5, 5] },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                }
            }
        });
    }

    // 2. Process Data for Vehicle Comparison (kg CO2 per 100mi)
    let compLabels = [];
    let compData = [];
    let compColors = [];

    if (vehicles && vehicles.length > 0) {
        vehicles.forEach(v => {
            compLabels.push(`${v.make} ${v.model}`);
            // Calculate avg co2 per 100 miles
            // Gather all trips for this vehicle
            const vTrips = trips ? trips.filter(t => t.vehicle_id === v.id) : [];

            let dist = 0;
            let co2 = 0;
            vTrips.forEach(t => { dist += Number(t.distance_miles); co2 += Number(t.co2_kg); });

            let avg100 = 0;
            if (dist > 0) {
                avg100 = (co2 / dist) * 100;
            } else {
                // fallback estimate based on MPG if no trips
                if (v.avg_mpg) {
                    // 19.6 lbs CO2 / gallon = 8.89 kg CO2 / gallon
                    const galsPer100 = 100 / v.avg_mpg;
                    avg100 = galsPer100 * 8.89;
                } else {
                    avg100 = 25; // arbitrary fallback
                }
            }

            compData.push(Number(avg100.toFixed(1)));
            compColors.push(avg100 < 20 ? '#93C572' : (avg100 > 35 ? '#D48C00' : '#A7C7B0'));
        });
    } else {
        compLabels = ['No Vehicles'];
        compData = [0];
        compColors = ['#E2E8F0'];
    }

    // Vehicle Comparison Bar Chart
    const compCtx = document.getElementById('comparisonChart');
    if (compCtx) {
        new Chart(compCtx, {
            type: 'bar',
            data: {
                labels: compLabels,
                datasets: [{
                    label: 'kg CO₂ per 100m',
                    data: compData,
                    backgroundColor: compColors,
                    borderRadius: 8,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                }
            }
        });
    }

    // Populate Vehicle Filter Dropdown
    const filterSelect = document.getElementById('vehicle-filter');
    if (filterSelect && vehicles) {
        let options = '<option value="all">All Vehicles</option>';
        vehicles.forEach(v => {
            options += `<option value="${v.id}">${v.year || ''} ${v.make} ${v.model}</option>`;
        });
        filterSelect.innerHTML = options;
    }

    // Mock Export button functionality
    document.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Generating...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                alert('Report generated and downloaded successfully!');
            }, 1000);
        });
    });
}
