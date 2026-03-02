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
          <!-- Added Logger Link to Sidebar -->
          <a href="/logger" class="nav-item active" data-link>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
             Log Trip
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
        <header class="topbar">
          <div class="page-title">
            <h1>Log a Trip</h1>
            <p>Select your entry method to log emissions.</p>
          </div>
        </header>

        <div class="logger-container">
           <div class="card glass logger-card">
              <!-- Tabs -->
              <div class="logger-tabs">
                 <button class="tab-btn active" data-tab="manual">Manual Entry</button>
                 <button class="tab-btn" data-tab="odometer">Odometer Sync</button>
                 <button class="tab-btn" data-tab="map">Map Route (BETA)</button>
              </div>

              <!-- Manual Entry Form -->
              <div id="tab-manual" class="tab-content active">
                 <form class="logger-form">
                    <div class="form-group">
                       <label class="form-label">Select Vehicle</label>
                       <select id="vehicle-select-manual" class="form-input" required>
                          <option value="">Loading vehicles...</option>
                       </select>
                    </div>
                    <div class="form-row">
                       <div class="form-group flex-1">
                          <label class="form-label">Distance</label>
                          <div class="input-with-suffix">
                             <input type="number" id="manual-distance" class="form-input" placeholder="e.g. 72" required step="any">
                             <span class="suffix">km</span>
                          </div>
                       </div>
                       <div class="form-group flex-1">
                          <label class="form-label">Fuel Used (Optional)</label>
                          <div class="input-with-suffix">
                             <input type="number" class="form-input" placeholder="e.g. 8">
                             <span class="suffix">Litres</span>
                          </div>
                       </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block" style="width: 100%;">Save Trip</button>
                 </form>
              </div>

              <!-- Odometer Sync Form -->
              <div id="tab-odometer" class="tab-content">
                 <form class="logger-form" id="odometer-form">
                    <div class="form-group">
                       <label class="form-label">Select Vehicle</label>
                       <select id="vehicle-select-odometer" class="form-input" required>
                          <option value="">Loading vehicles...</option>
                       </select>
                    </div>
                    <div class="form-row">
                       <div class="form-group flex-1">
                          <label class="form-label">Start Odometer</label>
                          <input type="number" id="odo-start" class="form-input" placeholder="e.g. 45120" required>
                       </div>
                       <div class="form-group flex-1">
                          <label class="form-label">End Odometer</label>
                          <input type="number" id="odo-end" class="form-input" placeholder="e.g. 45165" required>
                       </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block" style="width: 100%;">Sync & Save</button>
                 </form>
              </div>

              <!-- Map Route Form -->
              <div id="tab-map" class="tab-content">
                 <form class="logger-form">
                    <div class="form-group">
                       <label class="form-label">Start Point</label>
                       <input type="text" class="form-input" placeholder="Search address or drop pin">
                    </div>
                    <div class="form-group">
                       <label class="form-label">End Point</label>
                       <input type="text" class="form-input" placeholder="Search address or drop pin">
                    </div>
                    
                    <!-- Mock Map Area -->
                    <div class="mock-map">
                       <div class="map-placeholder">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          <p>Google Maps Preview</p>
                       </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block" style="width: 100%;">Calculate UI & Save</button>
                 </form>
              </div>
           </div>
        </div>
      </main>
    </div>
  `;
}

export async function init(state) {
   if (!state.user) return;

   // Tab Switching Logic
   const tabs = document.querySelectorAll('.tab-btn');
   const contents = document.querySelectorAll('.tab-content');

   tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
         e.preventDefault();
         tabs.forEach(t => t.classList.remove('active'));
         contents.forEach(c => c.classList.remove('active'));

         tab.classList.add('active');
         const targetId = `tab-${tab.getAttribute('data-tab')}`;
         document.getElementById(targetId).classList.add('active');
      });
   });

   // Fetch user vehicles to populate dropdowns
   const { data: vehicles } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', state.user.id);

   let vehicleOptions = '<option value="">Select a vehicle...</option>';
   if (vehicles && vehicles.length > 0) {
      vehicles.forEach(v => {
         vehicleOptions += `<option value="${v.id}" data-fuel="${v.fuel_type}" data-l100km="${v.avg_l_100km || 8.0}">${v.year || ''} ${v.make} ${v.model}</option>`;
      });
   } else {
      vehicleOptions = '<option value="">No vehicles found (Add one in Profile!)</option>';
   }

   const selectManual = document.getElementById('vehicle-select-manual');
   const selectOdo = document.getElementById('vehicle-select-odometer');

   if (selectManual) selectManual.innerHTML = vehicleOptions;
   if (selectOdo) selectOdo.innerHTML = vehicleOptions;

   // Calculation helper (Metric)
   function calculateCO2(distance, fuelType, avgL100km) {
      // Emission factors (kg CO2 per Liter)
      const factors = {
         'Petrol': 2.31,
         'Diesel': 2.68,
         'Hybrid': 2.31,
         'EV': 0.0 // Simplified
      };

      const factor = factors[fuelType] || 2.31;
      if (fuelType === 'EV') return (distance * 0.03).toFixed(2); // 0.03 kg/km for EV grid impact

      const liters = (distance / 100) * (avgL100km || 8.0);
      return (liters * factor).toFixed(2);
   }

   // Handle Manual Form Submission
   const manualForm = document.querySelector('#tab-manual .logger-form');
   if (manualForm) {
      manualForm.addEventListener('submit', async (e) => {
         e.preventDefault();
         const btn = manualForm.querySelector('button[type="submit"]');
         btn.innerHTML = 'Saving...';
         btn.disabled = true;

         const vehicleId = selectManual.value;
         const distance = parseFloat(document.getElementById('manual-distance').value);

         if (!vehicleId) {
            alert('Please select a vehicle!');
            btn.innerHTML = 'Save Trip';
            btn.disabled = false;
            return;
         }

         const selectedOption = selectManual.options[selectManual.selectedIndex];
         const fuelType = selectedOption.getAttribute('data-fuel') || 'Petrol';
         const avgL100km = parseFloat(selectedOption.getAttribute('data-l100km'));

         const co2_kg = calculateCO2(distance, fuelType, avgL100km);

         const tripData = {
            user_id: state.user.id,
            vehicle_id: vehicleId,
            distance_km: Number(distance),
            co2_kg: Number(co2_kg),
            fuel_type: fuelType
         };

         console.log('Logging trip:', tripData);
         const { error } = await supabase.from('trips').insert(tripData);

         if (error) {
            console.error('Supabase Trip Error:', error);
            alert('Error logging trip: ' + (error.message || 'Unknown database error'));
            btn.innerHTML = 'Save Trip';
            btn.disabled = false;
         } else {
            alert('Trip logged successfully!');
            window.history.pushState(null, '', '/dashboard');
            window.dispatchEvent(new Event('popstate'));
         }
      });
   }

   // Handle Odometer Form Submission
   const odoForm = document.getElementById('odometer-form');
   if (odoForm) {
      odoForm.addEventListener('submit', async (e) => {
         e.preventDefault();
         const btn = odoForm.querySelector('button[type="submit"]');
         btn.innerHTML = 'Saving...';
         btn.disabled = true;

         const vehicleId = selectOdo.value;
         const startOdo = parseFloat(document.getElementById('odo-start').value);
         const endOdo = parseFloat(document.getElementById('odo-end').value);

         if (!vehicleId) {
            alert('Please select a vehicle!');
            btn.innerHTML = 'Sync & Save';
            btn.disabled = false;
            return;
         }

         if (endOdo <= startOdo) {
            alert('End odometer must be greater than start odometer.');
            btn.innerHTML = 'Sync & Save';
            btn.disabled = false;
            return;
         }

         const distance = endOdo - startOdo;
         const selectedOption = selectOdo.options[selectOdo.selectedIndex];
         const fuelType = selectedOption.getAttribute('data-fuel') || 'Petrol';
         const avgL100km = parseFloat(selectedOption.getAttribute('data-l100km'));

         const co2_kg = calculateCO2(distance, fuelType, avgL100km);

         const tripData = {
            user_id: state.user.id,
            vehicle_id: vehicleId,
            distance_km: Number(distance),
            co2_kg: Number(co2_kg),
            fuel_type: fuelType
         };

         console.log('Syncing trip:', tripData);
         const { error } = await supabase.from('trips').insert(tripData);

         if (error) {
            console.error('Supabase Sync Error:', error);
            alert('Error syncing trip: ' + (error.message || 'Unknown database error'));
            btn.innerHTML = 'Sync & Save';
            btn.disabled = false;
         } else {
            alert('Trip logged successfully!');
            window.history.pushState(null, '', '/dashboard');
            window.dispatchEvent(new Event('popstate'));
         }
      });
   }
}
