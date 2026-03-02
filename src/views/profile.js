import { supabase } from '../supabaseClient.js';

export function render(state) {
   return `
    <div class="app-container">
      <!-- Sidebar Navigation -->
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
          <a href="/profile" class="nav-item active" data-link>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
             My Profile
          </a>
          <a href="/analytics" class="nav-item" data-link>
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
        <header class="topbar" style="border-bottom: none; background: transparent;">
           <!-- Header moved inside grid for prominence -->
        </header>

        <div class="dashboard-grid">
           <!-- New Prominent User Header -->
           <div class="profile-header-prominent" id="profile-header-container" style="grid-column: span 12; margin-bottom: 2rem; display: flex; gap: 1.5rem; align-items: center; padding: 1.5rem; background: var(--color-background-card); border-radius: 20px; box-shadow: var(--shadow-sm);">
              <div class="avatar skeleton-text" style="width: 80px; height: 80px; border-radius: 50%;"></div>
              <div>
                 <h1 class="skeleton-text" style="width: 200px; height: 32px; margin-bottom: 0.5rem;"></h1>
                 <p class="skeleton-text" style="width: 250px; height: 16px;"></p>
              </div>
           </div>

           <!-- The Carbon Pulse (Hero Section) -->
           <div class="card glass carbon-pulse-card" style="grid-column: span 12; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem; background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,250,245,0.8));">
              <h2 style="margin-bottom: 1.5rem; color: var(--color-primary);">The Carbon Pulse</h2>
              <div class="pulse-container" style="position: relative; width: 250px; height: 125px; overflow: hidden;">
                 <canvas id="carbonPulseGauge" width="250" height="250"></canvas>
                 <div style="position: absolute; bottom: 0; width: 100%; text-align: center;">
                    <span style="font-size: 2.5rem; font-weight: 800; color: var(--color-text-main); line-height: 1;" id="efficiency-score-value">0</span><span style="font-size: 1rem; color: var(--color-text-muted);">%</span>
                    <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">Weekly Efficiency Score</p>
                 </div>
              </div>
              <p style="margin-top: 1.5rem; text-align: center; color: var(--color-text-main); font-weight: 50; max-width: 400px;" id="efficiency-message">Calculating your impact...</p>
           </div>

           <!-- My Vehicles (Merged from Garage) -->
           <div class="card glass my-vehicles-card" style="grid-column: span 12;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                 <h3>My Vehicles</h3>
                 <button class="btn btn-sm btn-primary" id="add-vehicle-trigger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">+ Add Vehicle</button>
              </div>
              
              <div id="vehicles-list-container" style="display: flex; flex-direction: column; gap: 1.5rem;">
                 <!-- Skeleton Loading State -->
                 <div class="skeleton-text" style="height: 150px; border-radius: 12px; width: 100%;"></div>
              </div>
           </div>

           <!-- Activity Feed -->
           <div class="card glass activity-feed-card" style="grid-column: span 12; display: flex; flex-direction: column;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                 <h3>Recent Activity</h3>
                 <a href="/logger" class="btn btn-sm btn-primary" data-link style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">+ Log Trip</a>
              </div>
              
              <div class="table-container" style="overflow-x: auto; flex: 1;">
                 <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                       <tr style="border-bottom: 2px solid rgba(0,0,0,0.05);">
                          <th style="padding: 0.75rem 0.5rem; color: var(--color-text-muted); font-size: 0.85rem; font-weight: 500;">Date</th>
                          <th style="padding: 0.75rem 0.5rem; color: var(--color-text-muted); font-size: 0.85rem; font-weight: 500;">Distance</th>
                          <th style="padding: 0.75rem 0.5rem; color: var(--color-text-muted); font-size: 0.85rem; font-weight: 500;">CO₂ Impact</th>
                          <th style="padding: 0.75rem 0.5rem; color: var(--color-text-muted); font-size: 0.85rem; font-weight: 500; text-align: right;">Actions</th>
                       </tr>
                    </thead>
                    <tbody id="activity-list">
                       <tr>
                          <td colspan="4" style="text-align: center; padding: 2rem;">Loading Activity...</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
            </div>
         </div>
       </main>

       <!-- Add Vehicle Modal -->
       <div class="modal-overlay" id="add-vehicle-modal">
          <div class="modal-container">
             <div class="modal-header">
                <h2>Add New Vehicle</h2>
                <button class="close-modal" id="close-vehicle-modal">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
             </div>
             <form id="add-vehicle-form">
                <div class="form-grid">
                   <div class="form-group">
                      <label class="form-label">Make</label>
                      <input type="text" id="v-make" class="form-input" placeholder="e.g. Toyota" required>
                   </div>
                   <div class="form-group">
                      <label class="form-label">Model</label>
                      <input type="text" id="v-model" class="form-input" placeholder="e.g. Prius" required>
                   </div>
                   <div class="form-group">
                      <label class="form-label">Year</label>
                      <input type="number" id="v-year" class="form-input" placeholder="e.g. 2022" required>
                   </div>
                   <div class="form-group">
                      <label class="form-label">Fuel Type</label>
                      <select id="v-fuel" class="form-input" required>
                         <option value="Petrol">Petrol</option>
                         <option value="Diesel">Diesel</option>
                         <option value="Hybrid">Hybrid</option>
                         <option value="EV">EV</option>
                      </select>
                   </div>
                    <div class="form-group">
                       <label class="form-label">Avg. L/100km</label>
                       <input type="number" id="v-l100km" class="form-input" placeholder="e.g. 6.5" step="any" required>
                    </div>
                   <div class="form-group">
                      <label class="form-label">Plate / ID (Opt)</label>
                      <input type="text" id="v-number" class="form-input" placeholder="e.g. ABC-123">
                   </div>
                </div>
                <div class="modal-footer">
                   <button type="button" class="btn btn-secondary" id="cancel-vehicle">Cancel</button>
                   <button type="submit" class="btn btn-primary">Add Vehicle</button>
                </div>
             </form>
          </div>
       </div>
    </div>
   `;
}

export async function init(state) {
   if (!state.user) return;

   // Fetch User Info
   const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', state.user.id)
      .single();

   if (userData) {
      const headerDate = new Date(userData.joined_at || userData.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const shortId = userData.id.substring(0, 8).toUpperCase();
      const initials = userData.full_name ? userData.full_name.substring(0, 2).toUpperCase() : 'US';

      const headerContainer = document.getElementById('profile-header-container');
      if (headerContainer) {
         headerContainer.innerHTML = `
           <div class="avatar" style="width: 80px; height: 80px; font-size: 2rem; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 8px 16px rgba(0,77,77,0.1);">${initials}</div>
           <div>
              <h1 style="font-size: 2rem; margin: 0; color: var(--color-text-main);">${userData.full_name || 'User'}</h1>
              <p style="margin: 0.25rem 0 0; color: var(--color-text-muted);">Joined ${headerDate} • #EC-${shortId}</p>
           </div>
         `;
      }
   }

   // Fetch and Render User Vehicles (Garage Integration)
   const vehiclesContainer = document.getElementById('vehicles-list-container');

   async function fetchUserVehicles() {
      const { data: vehicles, error } = await supabase
         .from('vehicles')
         .select('*')
         .eq('user_id', state.user.id);

      if (error || !vehicles || vehicles.length === 0) {
         if (vehiclesContainer) {
            vehiclesContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); padding: 2rem;">No vehicles found. Add one to start tracking!</p>';
         }
         return;
      }

      const vehicleCards = await Promise.all(vehicles.map(async v => {
         // Fetch stats for this specific vehicle
         const { data: tripStats } = await supabase
            .from('trips')
            .select('distance_km, co2_kg')
            .eq('vehicle_id', v.id);

         const totalDistance = tripStats ? tripStats.reduce((sum, t) => sum + Number(t.distance_km), 0) : 0;
         const totalCO2 = tripStats ? tripStats.reduce((sum, t) => sum + Number(t.co2_kg), 0) : 0;

         // Baseline Calculation (Efficiency Bar)
         let tonYearly = 4.6;
         if (v.avg_l_100km) {
            // Approx 15,000 km per year. CO2 = (Total Liters * 2.31)
            const liters = (15000 / 100) * v.avg_l_100km;
            tonYearly = (liters * 2.31) / 1000;
         }

         const progressWidth = Math.min(100, (tonYearly / 8) * 100);
         const progColor = tonYearly < 4.0 ? 'var(--color-alert-success)' : 'var(--color-alert-danger)';
         const badgeClass = v.fuel_type === 'Hybrid' ? 'badge-hybrid' : (v.fuel_type === 'EV' ? 'badge-ev' : 'badge-petrol');

         return `
            <div class="vehicle-stats-card" style="background: var(--color-background-card); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.5); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: var(--shadow-sm);">
               <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                     <div style="width: 48px; height: 48px; border-radius: 12px; background-color: rgba(0,77,77,0.05); display: flex; align-items: center; justify-content: center; color: var(--color-primary);">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a3 3 0 1 1-6 0m10 0a3 3 0 1 1-6 0"></path></svg>
                     </div>
                     <div>
                        <h4 style="font-size: 1.25rem; margin-bottom: 0.2rem; margin-top: 0; color: var(--color-text-main); font-family: var(--font-family-heading);">${v.year || ''} ${v.make} ${v.model}</h4>
                        <span class="badge ${badgeClass}">${v.fuel_type}</span>
                     </div>
                  </div>
                  <button class="btn-icon" title="Edit Vehicle" onclick="alert('Edit vehicle \\'${v.id}\\'')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
               </div>

               <!-- Quick Stats mini-grid -->
               <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; background: rgba(0,0,0,0.02); padding: 1.25rem; border-radius: 14px;">
                  <div>
                     <p style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: 0.25rem;">Distance Tracked</p>
                     <p style="font-weight: 700; font-family: var(--font-family-mono); font-size: 1.1rem; color: var(--color-primary);">${totalDistance.toLocaleString()} <small style="font-size: 0.7rem; font-weight: 500; color: var(--color-text-muted);">km</small></p>
                  </div>
                  <div>
                     <p style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: 0.25rem;">Total CO₂</p>
                     <p style="font-weight: 700; font-family: var(--font-family-mono); font-size: 1.1rem; color: var(--color-alert-danger);">${totalCO2.toFixed(1)} <small style="font-size: 0.7rem; font-weight: 500; color: var(--color-text-muted);">kg</small></p>
                  </div>
               </div>

               <!-- Bottom Row: Real-time Efficiency Bar -->
               <div style="margin-top: 0.25rem;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; align-items: baseline;">
                     <p style="font-size: 0.8rem; color: var(--color-text-main); font-weight: 600;">Efficiency <span style="font-weight: normal; color: var(--color-text-muted); font-size: 0.7rem;">(${v.avg_l_100km || '--'} L/100km)</span></p>
                     <span style="font-size: 0.75rem; font-weight: 700; color: ${progColor};">${tonYearly.toFixed(1)} <small style="font-size: 0.65rem; font-weight: 500; opacity: 0.8;">tons/yr</small></span>
                  </div>
                  <div style="height: 10px; background-color: rgba(0,0,0,0.05); border-radius: 6px; overflow: hidden; position: relative;">
                     <div style="height: 100%; border-radius: 6px; width: ${progressWidth}%; background: linear-gradient(90deg, ${progColor}, var(--color-primary-light)); transition: width 1.5s cubic-bezier(0.19, 1, 0.22, 1);"></div>
                  </div>
               </div>
            </div>
         `;
      }));

      if (vehiclesContainer) {
         vehiclesContainer.innerHTML = vehicleCards.join('');
      }
   }

   fetchUserVehicles();

   // Fetch and Render Activity Feed
   const tableBody = document.getElementById('activity-list');

   async function loadTrips() {
      const { data: trips } = await supabase
         .from('trips')
         .select('*, vehicles(make, model)')
         .eq('user_id', state.user.id)
         .order('log_date', { ascending: false })
         .limit(10);

      if (!trips || trips.length === 0) {
         if (tableBody) tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">No trips logged yet.</td></tr>';
         return;
      }

      if (tableBody) {
         tableBody.innerHTML = trips.map(t => {
            const date = new Date(t.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            const co2 = Number(t.co2_kg);
            const co2Color = co2 > 5 ? 'var(--color-alert-danger)' : 'var(--color-alert-success)';

            return `
               <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);" data-id="${t.id}">
                  <td style="padding: 1rem 0.5rem; font-weight: 500; font-size: 0.85rem;">${date}</td>
                  <td style="padding: 1rem 0.5rem;">${t.distance_miles} mi</td>
                  <td style="padding: 1rem 0.5rem;"><span style="color: ${co2Color}; font-weight: 600;">${co2.toFixed(1)} kg</span></td>
                  <td style="padding: 1rem 0.5rem; text-align: right;">
                     <div class="action-buttons" style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                        <button class="btn-icon delete-btn" title="Delete Trip" style="color: var(--color-alert-danger);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                     </div>
                  </td>
               </tr>
            `;
         }).join('');
      }
   }

   loadTrips();

   // Determine the primary color from CSS variables or fallback
   const root = getComputedStyle(document.documentElement);
   const primaryColor = root.getPropertyValue('--color-primary').trim() || '#2D5A27';

   // Dynamic Carbon Pulse Calculation
   async function updateCarbonPulse() {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: weeklyTrips } = await supabase
         .from('trips')
         .select('co2_kg')
         .eq('user_id', state.user.id)
         .gte('log_date', oneWeekAgo.toISOString());

      const totalWeeklyCO2 = weeklyTrips ? weeklyTrips.reduce((sum, t) => sum + Number(t.co2_kg), 0) : 0;
      const weeklyGoal = 50; // kg CO2 per week goal

      // Calculate score: 100% means 0 emissions, 0% means >= weeklyGoal
      let score = Math.max(0, 100 - (totalWeeklyCO2 / weeklyGoal) * 100);
      score = Math.round(score);

      const scoreEl = document.getElementById('efficiency-score-value');
      const messageEl = document.getElementById('efficiency-message');

      if (scoreEl) scoreEl.innerText = score;
      if (messageEl) {
         if (totalWeeklyCO2 === 0) {
            messageEl.innerText = 'Log your first trip of the week to activate your pulse!';
         } else if (score > 80) {
            messageEl.innerText = `Excellent! You've only emitted ${totalWeeklyCO2.toFixed(1)}kg this week. You're well on target.`;
         } else if (score > 50) {
            messageEl.innerText = `Good progress. ${totalWeeklyCO2.toFixed(1)}kg emitted so far. Keep an eye on your travel choices.`;
         } else {
            messageEl.innerText = `Heads up! You've reached ${totalWeeklyCO2.toFixed(1)}kg this week. Try to find greener alternatives.`;
         }
      }

      // Update Gauge
      const ctx = document.getElementById('carbonPulseGauge');
      if (ctx && window.Chart) {
         new Chart(ctx, {
            type: 'doughnut',
            data: {
               labels: ['Efficiency Score', 'Remaining'],
               datasets: [{
                  data: [score, 100 - score],
                  backgroundColor: [
                     primaryColor,
                     '#E2E8F0'
                  ],
                  borderWidth: 0,
                  cutout: '75%',
                  borderRadius: 10,
                  circumference: 180,
                  rotation: 270,
               }]
            },
            options: {
               responsive: true,
               maintainAspectRatio: false,
               plugins: {
                  legend: { display: false },
                  tooltip: { enabled: false }
               },
               animation: {
                  animateScale: false,
                  animateRotate: true,
                  duration: 1500,
                  easing: 'easeOutQuart'
               }
            }
         });
      }
   }

   updateCarbonPulse();

   // Activity Feed Actions logic (Real-time DB connection)
   if (tableBody) {
      tableBody.addEventListener('click', async (e) => {
         const deleteBtn = e.target.closest('.delete-btn');
         if (deleteBtn) {
            const row = deleteBtn.closest('tr');
            const tripId = row.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this trip record?')) {
               // Delete from DB
               const { error } = await supabase.from('trips').delete().eq('id', tripId);
               if (error) {
                  alert('Failed to delete trip: ' + error.message);
                  return;
               }

               row.style.transition = 'opacity 0.3s, transform 0.3s';
               row.style.opacity = '0';
               row.style.transform = 'translateX(20px)';
               setTimeout(() => row.remove(), 300);
            }
         }
      });
   }

   // Add pulse animation effect to hero gauge
   const gaugeCanvas = document.getElementById('carbonPulseGauge');
   if (gaugeCanvas) {
      setInterval(() => {
         gaugeCanvas.style.transform = 'scale(1.02)';
         gaugeCanvas.style.transition = 'transform 0.5s ease-in-out';
         setTimeout(() => {
            gaugeCanvas.style.transform = 'scale(1)';
         }, 500);
      }, 3000);
   }

   // Add Vehicle Modal Logic
   const modal = document.getElementById('add-vehicle-modal');
   const trigger = document.getElementById('add-vehicle-trigger');
   const closeBtn = document.getElementById('close-vehicle-modal');
   const cancelBtn = document.getElementById('cancel-vehicle');
   const form = document.getElementById('add-vehicle-form');

   if (modal && trigger) {
      trigger.addEventListener('click', () => modal.classList.add('active'));
      [closeBtn, cancelBtn].forEach(btn => {
         if (btn) btn.addEventListener('click', () => modal.classList.remove('active'));
      });

      if (form) {
         form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Adding...';
            submitBtn.disabled = true;

            const vehicleData = {
               user_id: state.user.id,
               make: document.getElementById('v-make').value.trim(),
               model: document.getElementById('v-model').value.trim(),
               year: parseInt(document.getElementById('v-year').value) || new Date().getFullYear(),
               fuel_type: document.getElementById('v-fuel').value,
               avg_l_100km: Number(document.getElementById('v-l100km').value) || 8.0,
               vehicle_number: document.getElementById('v-number').value.trim() || null
            };

            console.log('Inserting vehicle:', vehicleData);
            const { error } = await supabase.from('vehicles').insert(vehicleData);

            if (error) {
               console.error('Supabase Insert Error:', error);
               alert('Error adding vehicle: ' + (error.message || 'Unknown database error'));
               submitBtn.innerHTML = 'Add Vehicle';
               submitBtn.disabled = false;
            } else {
               modal.classList.remove('active');
               form.reset();
               submitBtn.innerHTML = 'Add Vehicle';
               submitBtn.disabled = false;
               alert('Vehicle added successfully!');
               fetchUserVehicles(); // Refresh the list
            }
         });
      }
   }
}
