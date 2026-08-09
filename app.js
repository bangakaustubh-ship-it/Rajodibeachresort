/* ==========================================================================
   RAJODI C BEACH RESORT - ADMIN MANAGEMENT SYSTEM v2
   Features: Auth Gate, Live Clock, Room Status Management, Multi-Step Check-In,
   GST Tax Invoice, Activity Log, Staff Notes, Charts, Toast Notifications
   ========================================================================== */

// ─── INITIAL ROOM INVENTORY ─────────────────────────────────────────────────
const INITIAL_ROOMS = [
  // Deluxe Rooms (₹3,000 + GST)
  { id: '101', number: '101', category: 'Deluxe Room',                  typeKey: 'deluxe',       price: 3000, image: 'images/deluxe.png',       status: 'free',     guestDetails: null, notes: '' },
  { id: '102', number: '102', category: 'Deluxe Room',                  typeKey: 'deluxe',       price: 3000, image: 'images/deluxe.png',       status: 'booked',   guestDetails: { guestName: 'Amit Sharma',  phone: '+91 98112 34567', idType: 'Aadhaar Card',    idNo: '4532-8910-1123',  checkInDate: new Date(Date.now() - 86400000).toISOString().slice(0, 16), checkOutDate: new Date().toISOString().slice(0, 16), advancePaid: 1000, notes: '' }, notes: '' },
  { id: '103', number: '103', category: 'Deluxe Room',                  typeKey: 'deluxe',       price: 3000, image: 'images/deluxe.png',       status: 'free',     guestDetails: null, notes: '' },
  { id: '104', number: '104', category: 'Deluxe Room',                  typeKey: 'deluxe',       price: 3000, image: 'images/deluxe.png',       status: 'free',     guestDetails: null, notes: '' },
  { id: '105', number: '105', category: 'Deluxe Room',                  typeKey: 'deluxe',       price: 3000, image: 'images/deluxe.png',       status: 'cleaning', guestDetails: null, notes: 'Deep cleaning required after previous guest.' },
  // Super Deluxe Rooms (₹3,500 + GST)
  { id: '201', number: '201', category: 'Super Deluxe Room',            typeKey: 'super-deluxe', price: 3500, image: 'images/super_deluxe.png', status: 'free',     guestDetails: null, notes: '' },
  { id: '202', number: '202', category: 'Super Deluxe Room',            typeKey: 'super-deluxe', price: 3500, image: 'images/super_deluxe.png', status: 'booked',   guestDetails: { guestName: 'Priya Verma',  phone: '+91 98765 12345', idType: 'Driving License', idNo: 'DL-0420210098',   checkInDate: new Date().toISOString().slice(0, 16),              checkOutDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16), advancePaid: 2000, notes: '' }, notes: '' },
  { id: '203', number: '203', category: 'Super Deluxe Room',            typeKey: 'super-deluxe', price: 3500, image: 'images/super_deluxe.png', status: 'free',     guestDetails: null, notes: '' },
  { id: '204', number: '204', category: 'Super Deluxe Room',            typeKey: 'super-deluxe', price: 3500, image: 'images/super_deluxe.png', status: 'free',     guestDetails: null, notes: '' },
  { id: '205', number: '205', category: 'Super Deluxe Room',            typeKey: 'super-deluxe', price: 3500, image: 'images/super_deluxe.png', status: 'free',     guestDetails: null, notes: '' },
  // Executive Rooms with Balcony (₹5,000 + GST)
  { id: '301', number: '301', category: 'Executive Room with Balcony',  typeKey: 'executive',    price: 5000, image: 'images/executive.png',    status: 'free',     guestDetails: null, notes: '' },
  { id: '302', number: '302', category: 'Executive Room with Balcony',  typeKey: 'executive',    price: 5000, image: 'images/executive.png',    status: 'free',     guestDetails: null, notes: '' },
  { id: '303', number: '303', category: 'Executive Room with Balcony',  typeKey: 'executive',    price: 5000, image: 'images/executive.png',    status: 'booked',   guestDetails: { guestName: 'Rohan Mehta',  phone: '+91 99887 76655', idType: 'Passport',        idNo: 'Z9876543',        checkInDate: new Date(Date.now() - 43200000).toISOString().slice(0, 16), checkOutDate: new Date(Date.now() + 43200000).toISOString().slice(0, 16), advancePaid: 3000, notes: 'VIP Guest. Complimentary welcome drink arranged.' }, notes: 'VIP Guest' },
  { id: '304', number: '304', category: 'Executive Room with Balcony',  typeKey: 'executive',    price: 5000, image: 'images/executive.png',    status: 'free',     guestDetails: null, notes: '' },
  { id: '305', number: '305', category: 'Executive Room with Balcony',  typeKey: 'executive',    price: 5000, image: 'images/executive.png',    status: 'free',     guestDetails: null, notes: '' },
];

// ─── STATE ───────────────────────────────────────────────────────────────────
let rooms             = [];
let isAdminUnlocked   = false;
let currentFilter     = 'all';
let selectedCheckoutRoomId = null;
let activityLog       = [];
let dailyTransactions = [];
let occupancyChartInst = null;
let revenueChartInst   = null;

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadRoomsState();
  loadActivityLog();
  checkAdminSession();
  startLiveClock();
});

// ─── LIVE CLOCK ──────────────────────────────────────────────────────────────
function startLiveClock() {
  function tick() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    const clockEl = document.getElementById('liveClock');
    const dateEl  = document.getElementById('liveDate');
    if (clockEl) clockEl.textContent = timeStr;
    if (dateEl)  dateEl.textContent  = dateStr;
  }
  tick();
  setInterval(tick, 1000);
}

// ─── PERSISTENCE ─────────────────────────────────────────────────────────────
function loadRoomsState() {
  const saved = localStorage.getItem('resort_rooms_data_v2');
  if (saved) {
    try {
      rooms = JSON.parse(saved);
      rooms.forEach(r => {
        if (!r.image || r.image.trim() === '') r.image = getImagePath(r.typeKey);
        if (r.typeKey === 'executive') r.category = 'Executive Room with Balcony';
        if (r.notes === undefined) r.notes = '';
      });
    } catch (e) {
      rooms = deepCopy(INITIAL_ROOMS);
    }
  } else {
    rooms = deepCopy(INITIAL_ROOMS);
  }

  const savedTx = localStorage.getItem('resort_daily_transactions');
  if (savedTx) {
    try { dailyTransactions = JSON.parse(savedTx); } catch (e) { dailyTransactions = []; }
  } else {
    dailyTransactions = [];
  }

  if (!saved) saveRoomsState();
}

function saveRoomsState() {
  localStorage.setItem('resort_rooms_data_v2', JSON.stringify(rooms));
  localStorage.setItem('resort_daily_transactions', JSON.stringify(dailyTransactions));
  if (isAdminUnlocked) {
    renderRoomMatrix();
    updateDashboardStats();
    updateCharts();
    updateTabCounts();
  }
}

function loadActivityLog() {
  const saved = localStorage.getItem('resort_activity_log');
  if (saved) {
    try { activityLog = JSON.parse(saved); } catch (e) { activityLog = []; }
  }
}

function saveActivityLog() {
  localStorage.setItem('resort_activity_log', JSON.stringify(activityLog.slice(0, 100)));
}

function logActivity(message, type = 'info') {
  activityLog.unshift({
    message,
    type,
    time: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
  });
  saveActivityLog();
}

function resetToInitialState() {
  if (confirm('Reset ALL rooms and guest bookings to initial demo state?')) {
    rooms = deepCopy(INITIAL_ROOMS);
    saveRoomsState();
    logActivity('System reset to initial demo state.', 'warning');
    showToast('Demo data reset successfully!', 'warning');
  }
}

function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }

function getImagePath(typeKey) {
  if (typeKey === 'deluxe')       return 'images/deluxe.png';
  if (typeKey === 'super-deluxe') return 'images/super_deluxe.png';
  if (typeKey === 'executive')    return 'images/executive.png';
  return 'images/deluxe.png';
}

// ─── ADMIN AUTH ───────────────────────────────────────────────────────────────
function checkAdminSession() {
  if (sessionStorage.getItem('resort_admin_session') === 'true') {
    unlockAdminSystem();
  } else {
    lockAdminSystem();
  }
}

function handleAdminAuth(event) {
  event.preventDefault();
  const pin = document.getElementById('loginPinInput').value.trim();
  if (pin === '1234' || pin.toLowerCase() === 'admin') {
    sessionStorage.setItem('resort_admin_session', 'true');
    unlockAdminSystem();
  } else {
    document.getElementById('authErrorMsg').style.display = 'block';
    document.getElementById('loginPinInput').value = '';
  }
}

function unlockAdminSystem() {
  isAdminUnlocked = true;
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminMainDashboard').style.display = 'block';

  const badge = document.getElementById('accessStatusBadge');
  badge.className = 'status-badge badge-free';
  badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Admin Unlocked';

  document.getElementById('logoutNavBtn').style.display = 'inline-flex';

  renderRoomMatrix();
  updateDashboardStats();
  initCharts();
  updateCharts();
  updateTabCounts();
  logActivity('Admin console unlocked.', 'success');
}

function lockAdminSystem() {
  isAdminUnlocked = false;
  sessionStorage.removeItem('resort_admin_session');
  document.getElementById('adminMainDashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';

  const badge = document.getElementById('accessStatusBadge');
  badge.className = 'status-badge badge-booked';
  badge.innerHTML = '<i class="fa-solid fa-lock"></i> System Locked';

  document.getElementById('logoutNavBtn').style.display = 'none';
  document.getElementById('loginPinInput').value = '';
  document.getElementById('authErrorMsg').style.display = 'none';
  showToast('Console locked. Stay safe!', 'info');
}

// ─── METRICS ─────────────────────────────────────────────────────────────────
function updateDashboardStats() {
  const total   = rooms.length;
  const free    = rooms.filter(r => r.status === 'free').length;
  const booked  = rooms.filter(r => r.status === 'booked').length;

  let activeRevenue = 0;
  rooms.filter(r => r.status === 'booked').forEach(r => {
    activeRevenue += r.price * 1.18;
  });

  animateCounter('dashTotalRooms',  total);
  animateCounter('dashFreeRooms',   free);
  animateCounter('dashBookedRooms', booked);
  document.getElementById('dashActiveRevenue').textContent = `₹ ${activeRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  const duration = 600;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * ease);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function updateTabCounts() {
  document.getElementById('countAll').textContent      = rooms.length;
  document.getElementById('countFree').textContent     = rooms.filter(r => r.status === 'free').length;
  document.getElementById('countBooked').textContent   = rooms.filter(r => r.status === 'booked').length;
  document.getElementById('countCleaning').textContent = rooms.filter(r => r.status === 'cleaning').length;
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────
function initCharts() {
  // Occupancy Doughnut
  const octx = document.getElementById('occupancyChart');
  if (octx && !occupancyChartInst) {
    occupancyChartInst = new Chart(octx, {
      type: 'doughnut',
      data: { labels: ['Booked', 'Free', 'Cleaning'], datasets: [{ data: [0, 15, 0], backgroundColor: ['rgba(244,63,94,0.85)', 'rgba(16,185,129,0.85)', 'rgba(251,191,36,0.85)'], borderColor: ['#f43f5e', '#10b981', '#fbbf24'], borderWidth: 2, hoverOffset: 8 }] },
      options: {
        cutout: '72%',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} rooms` } } },
        animation: { animateRotate: true, duration: 900 }
      }
    });
  }

  // Revenue Bar
  const rctx = document.getElementById('revenueChart');
  if (rctx && !revenueChartInst) {
    revenueChartInst = new Chart(rctx, {
      type: 'bar',
      data: {
        labels: ['Deluxe', 'Super Deluxe', 'Executive'],
        datasets: [{
          label: 'Active Revenue (₹)',
          data: [0, 0, 0],
          backgroundColor: ['rgba(59,130,246,0.7)', 'rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)'],
          borderColor:      ['#3b82f6', '#10b981', '#f59e0b'],
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: ['rgba(59,130,246,0.9)', 'rgba(16,185,129,0.9)', 'rgba(245,158,11,0.9)']
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => `₹${(v/1000).toFixed(0)}k` } }
        },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ₹ ${ctx.raw.toLocaleString('en-IN')}` } } },
        animation: { duration: 700 }
      }
    });
  }
}

function updateCharts() {
  if (!occupancyChartInst || !revenueChartInst) return;

  const booked   = rooms.filter(r => r.status === 'booked').length;
  const free     = rooms.filter(r => r.status === 'free').length;
  const cleaning = rooms.filter(r => r.status === 'cleaning').length;

  occupancyChartInst.data.datasets[0].data = [booked, free, cleaning];
  occupancyChartInst.update();

  const pct = rooms.length ? Math.round((booked / rooms.length) * 100) : 0;
  document.getElementById('occupancyPercent').textContent = pct + '%';

  const deluxeRev      = rooms.filter(r => r.status === 'booked' && r.typeKey === 'deluxe').reduce((s, r)      => s + r.price * 1.18, 0);
  const superDeluxeRev = rooms.filter(r => r.status === 'booked' && r.typeKey === 'super-deluxe').reduce((s, r) => s + r.price * 1.18, 0);
  const execRev        = rooms.filter(r => r.status === 'booked' && r.typeKey === 'executive').reduce((s, r)    => s + r.price * 1.18, 0);

  revenueChartInst.data.datasets[0].data = [deluxeRev, superDeluxeRev, execRev];
  revenueChartInst.update();
}

// ─── ROOM FILTER & RENDER ─────────────────────────────────────────────────────
function filterRooms(status, btnEl) {
  currentFilter = status;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderRoomMatrix();
}

function renderRoomMatrix() {
  const container = document.getElementById('adminRoomGrid');
  if (!container) return;

  const query = (document.getElementById('adminSearchInput')?.value || '').toLowerCase();

  const filtered = rooms.filter(room => {
    const matchFilter = currentFilter === 'all' || room.status === currentFilter;
    const matchSearch = room.number.includes(query) ||
                        room.category.toLowerCase().includes(query) ||
                        (room.guestDetails && room.guestDetails.guestName.toLowerCase().includes(query));
    return matchFilter && matchSearch;
  });

  if (!filtered.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid fa-folder-open"></i></div>
        <p>No rooms match your current filter or search query.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map((room, idx) => buildRoomCard(room, idx)).join('');
}

function buildRoomCard(room, idx) {
  const statusClass  = `status-${room.status}`;
  const badgeClass   = `badge-${room.status}`;
  const statusText   = room.status === 'free' ? 'FREE – Available' : room.status === 'booked' ? 'BOOKED – Occupied' : 'CLEANING';
  const badgeIcon    = room.status === 'free' ? 'fa-circle-check' : room.status === 'booked' ? 'fa-user-check' : 'fa-broom';
  const imgSrc       = room.image || getImagePath(room.typeKey);
  const delay        = Math.min(idx * 0.05, 0.4);

  let guestHtml = '';
  if (room.status === 'booked' && room.guestDetails) {
    const g = room.guestDetails;
    const ciFormatted = new Date(g.checkInDate).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    const coFormatted = g.checkOutDate ? new Date(g.checkOutDate).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—';
    guestHtml = `
      <div class="guest-info-card">
        <div class="g-name"><i class="fa-solid fa-user text-gold"></i> ${g.guestName}</div>
        <div class="g-detail"><i class="fa-solid fa-phone"></i> ${g.phone}</div>
        <div class="g-detail"><i class="fa-solid fa-right-to-bracket"></i> In: ${ciFormatted}</div>
        <div class="g-detail"><i class="fa-solid fa-right-from-bracket"></i> Out: ${coFormatted}</div>
        ${g.advancePaid > 0 ? `<div class="g-detail" style="color:#34d399;font-weight:600;"><i class="fa-solid fa-money-bill-wave"></i> Advance: ₹ ${g.advancePaid.toLocaleString('en-IN')}</div>` : ''}
        ${g.notes ? `<div class="g-detail" style="color:#fbbf24;font-style:italic;"><i class="fa-solid fa-note-sticky"></i> ${g.notes}</div>` : ''}
      </div>`;
  }

  let actions = '';
  if (room.status === 'free') {
    actions = `
      <button class="btn btn-gold btn-sm" style="flex:1;" onclick="openCheckInModal('${room.id}')"><i class="fa-solid fa-key"></i> Check In</button>
      <button class="btn btn-outline btn-sm" onclick="setRoomStatus('${room.id}', 'cleaning')" title="Mark Cleaning"><i class="fa-solid fa-broom"></i></button>
      <button class="btn btn-outline btn-sm" onclick="openNotesModal('${room.id}')" title="Staff Notes"><i class="fa-solid fa-note-sticky"></i></button>`;
  } else if (room.status === 'booked') {
    actions = `<button class="btn btn-success btn-sm" style="width:100%;" onclick="openCheckOutModal('${room.id}')"><i class="fa-solid fa-receipt"></i> Check Out &amp; Bill (Set Free)</button>`;
  } else if (room.status === 'cleaning') {
    actions = `
      <button class="btn btn-success btn-sm" style="flex:1;" onclick="setRoomStatus('${room.id}', 'free')"><i class="fa-solid fa-circle-check"></i> Set Free (Ready)</button>
      <button class="btn btn-outline btn-sm" onclick="openNotesModal('${room.id}')" title="Staff Notes"><i class="fa-solid fa-note-sticky"></i></button>`;
  }

  const extras = [];
  if (room.typeKey === 'deluxe')       extras.push(`<div style="font-size:0.76rem;color:#fca5a5;margin-top:0.2rem;"><i class="fa-solid fa-circle-info"></i> Food Not Included</div>`);
  if (room.typeKey === 'executive')    extras.push(`<div style="font-size:0.76rem;color:#34d399;margin-top:0.2rem;"><i class="fa-solid fa-mountain-sun"></i> Private Balcony View</div>`);
  if (room.notes && room.status !== 'booked') extras.push(`<div class="room-notes-chip" onclick="openNotesModal('${room.id}')"><i class="fa-solid fa-note-sticky"></i> ${room.notes.substring(0, 40)}${room.notes.length > 40 ? '…' : ''}</div>`);

  return `
    <div class="admin-room-card ${statusClass}" style="animation-delay: ${delay}s;">
      <div>
        <div class="card-img-wrap">
          <img src="${imgSrc}" alt="${room.category}" class="card-img" onerror="this.src='images/deluxe.png'">
          <div class="room-number-pill">Room ${room.number}</div>
          <div class="price-tag-pill">₹ ${room.price.toLocaleString('en-IN')} + GST</div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;">
          <div>
            <strong style="color:#fff;font-size:1rem;">${room.category}</strong>
            ${extras.join('')}
          </div>
          <span class="status-badge ${badgeClass}"><i class="fa-solid ${badgeIcon}"></i> ${statusText}</span>
        </div>

        ${guestHtml}
      </div>

      <div style="margin-top:1.1rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
        ${actions}
      </div>
    </div>`;
}

// ─── ROOM STATUS QUICK-CHANGE ─────────────────────────────────────────────────
function setRoomStatus(roomId, newStatus) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;
  const old = room.status;
  room.status = newStatus;
  if (newStatus === 'free' || newStatus === 'cleaning') room.guestDetails = null;
  saveRoomsState();
  logActivity(`Room ${room.number} status changed: ${old} → ${newStatus}.`, 'info');
  showToast(`Room ${room.number} is now ${newStatus.toUpperCase()}.`, newStatus === 'free' ? 'success' : 'warning');
}

// ─── CHECK-IN (MULTI-STEP) ────────────────────────────────────────────────────
let currentStep = 1;

function openCheckInModal(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;

  document.getElementById('ciRoomId').value = room.id;
  document.getElementById('ciRoomDisplay').textContent = `Room ${room.number} – ${room.category}`;
  document.getElementById('ciRateDisplay').textContent = `Base Rate: ₹ ${room.price.toLocaleString('en-IN')} / night + 18% GST`;

  // Prefill dates
  const now = new Date();
  const nowStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(11, 0, 0, 0);
  const tomStr = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  document.getElementById('ciGuestName').value   = '';
  document.getElementById('ciPhone').value        = '';
  document.getElementById('ciAdvance').value      = '0';
  document.getElementById('ciIdNo').value         = '';
  document.getElementById('ciNotes').value        = '';
  document.getElementById('ciCheckInDate').value  = nowStr;
  document.getElementById('ciCheckOutDate').value = tomStr;
  document.getElementById('estimatedBillText').textContent = 'Select dates to see estimate';

  goStep(1);
  openModal('checkInModal');
}

function goStep(n) {
  currentStep = n;
  [1, 2, 3].forEach(i => {
    const stepEl = document.getElementById(`formStep${i}`);
    const dotEl  = document.getElementById(`step${i}Dot`);
    if (stepEl) stepEl.style.display = (i === n) ? 'block' : 'none';
    if (dotEl) {
      dotEl.className = 'step';
      if (i < n)  dotEl.classList.add('done');
      if (i === n) dotEl.classList.add('active');
    }
  });
  if (n === 3) updateBillEstimate();
}

function updateBillEstimate() {
  const roomId  = document.getElementById('ciRoomId').value;
  const room    = rooms.find(r => r.id === roomId);
  const inVal   = document.getElementById('ciCheckInDate').value;
  const outVal  = document.getElementById('ciCheckOutDate').value;
  const preview = document.getElementById('estimatedBillText');
  if (!room || !inVal || !outVal) { if (preview) preview.textContent = 'Select dates to see estimate'; return; }
  const diffMs  = new Date(outVal) - new Date(inVal);
  const nights  = Math.max(1, Math.ceil(diffMs / 86400000));
  const subtotal = room.price * nights;
  const gst      = subtotal * 0.18;
  const total    = subtotal + gst;
  if (preview) preview.textContent = `Estimated Bill: ₹ ${subtotal.toLocaleString('en-IN')} + GST ₹ ${gst.toLocaleString('en-IN', {maximumFractionDigits:0})} = ₹ ${total.toLocaleString('en-IN', {maximumFractionDigits:0})} for ${nights} night(s)`;
}

function submitCheckIn(event) {
  event.preventDefault();
  const roomId = document.getElementById('ciRoomId').value;
  const room   = rooms.find(r => r.id === roomId);
  if (!room) return;

  room.status = 'booked';
  room.guestDetails = {
    guestName:    document.getElementById('ciGuestName').value.trim(),
    phone:        document.getElementById('ciPhone').value.trim(),
    idType:       document.getElementById('ciIdType').value,
    idNo:         document.getElementById('ciIdNo').value.trim(),
    checkInDate:  document.getElementById('ciCheckInDate').value,
    checkOutDate: document.getElementById('ciCheckOutDate').value,
    advancePaid:  parseFloat(document.getElementById('ciAdvance').value) || 0,
    notes:        document.getElementById('ciNotes').value.trim(),
  };

  if (room.guestDetails.advancePaid > 0) {
    dailyTransactions.push({
      date: new Date().toISOString(),
      type: 'Advance (Check-In)',
      guestName: room.guestDetails.guestName,
      roomNumber: room.number,
      amount: room.guestDetails.advancePaid
    });
  }

  saveRoomsState();
  closeModal('checkInModal');
  logActivity(`Check-In: ${room.guestDetails.guestName} → Room ${room.number}.`, 'success');
  showToast(`✔ ${room.guestDetails.guestName} checked into Room ${room.number}!`, 'success');
}

// ─── CHECK-OUT & GST INVOICE ──────────────────────────────────────────────────
function openCheckOutModal(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room || !room.guestDetails) return;
  selectedCheckoutRoomId = roomId;

  const g           = room.guestDetails;
  const checkInTime = new Date(g.checkInDate).getTime();
  const nowTime     = Date.now();
  const stayDays    = Math.max(1, Math.ceil((nowTime - checkInTime) / 86400000));
  const subtotal    = room.price * stayDays;
  const cgst        = subtotal * 0.09;
  const sgst        = subtotal * 0.09;
  const grossTotal  = subtotal + cgst + sgst;
  const advance     = g.advancePaid || 0;
  const netPayable  = grossTotal - advance;

  const invoiceNo   = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
  const today       = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  document.getElementById('checkOutBillContainer').innerHTML = `
    <div class="invoice-paper" id="invoicePaper">
      <div class="invoice-header">
        <div class="invoice-resort-brand">
          <h2>RAJODI C BEACH RESORT</h2>
          <p>Last Stop, Rajodi Beach, OAC N Rd, Rajodi, Nalasopara West, Maharashtra 401304</p>
          <p>📞 +91 90222 87501 &nbsp;|&nbsp; +91 88063 07706 &nbsp;|&nbsp; ✉ rajodibresort@gmail.com</p>
        </div>
        <div class="invoice-badge">
          <h4>TAX INVOICE</h4>
          <p><strong>${invoiceNo}</strong></p>
          <p>Date: ${today}</p>
        </div>
      </div>

      <div class="invoice-meta-grid">
        <div class="invoice-meta-col">
          <h5>Guest Details</h5>
          <p><strong>Name:</strong> ${g.guestName}</p>
          <p><strong>Mobile:</strong> ${g.phone}</p>
          <p><strong>ID Proof:</strong> ${g.idType} (${g.idNo || 'N/A'})</p>
          ${g.notes ? `<p><strong>Notes:</strong> ${g.notes}</p>` : ''}
        </div>
        <div class="invoice-meta-col">
          <h5>Stay Details</h5>
          <p><strong>Room:</strong> ${room.number} – ${room.category}</p>
          <p><strong>Check-In:</strong> ${new Date(g.checkInDate).toLocaleString('en-IN')}</p>
          <p><strong>Check-Out:</strong> ${new Date().toLocaleString('en-IN')}</p>
          <p><strong>Duration:</strong> ${stayDays} Night(s)</p>
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Rate / Night</th>
            <th>Nights</th>
            <th style="text-align:right;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${room.category} Package</strong><br>
              <span style="font-size:0.8rem;color:#64748b;">AC · WiFi · Swimming Pool · Morning Tea/Coffee</span>
            </td>
            <td>₹ ${room.price.toLocaleString('en-IN')}</td>
            <td>${stayDays}</td>
            <td style="text-align:right;">₹ ${subtotal.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>

      <div class="invoice-totals">
        <div class="invoice-total-row"><span>Room Subtotal:</span><span>₹ ${subtotal.toLocaleString('en-IN')}</span></div>
        <div class="invoice-total-row"><span>CGST (9%):</span><span>₹ ${cgst.toLocaleString('en-IN', {maximumFractionDigits:2})}</span></div>
        <div class="invoice-total-row"><span>SGST (9%):</span><span>₹ ${sgst.toLocaleString('en-IN', {maximumFractionDigits:2})}</span></div>
        <div class="invoice-total-row" style="border-top:1px solid #cbd5e1;font-weight:600;"><span>Gross Total (incl. GST):</span><span>₹ ${grossTotal.toLocaleString('en-IN', {maximumFractionDigits:2})}</span></div>
        ${advance > 0 ? `<div class="invoice-total-row" style="color:#059669;"><span>Less Advance Paid:</span><span>– ₹ ${advance.toLocaleString('en-IN')}</span></div>` : ''}
        <div class="invoice-total-row grand-total"><span>Net Payable Balance:</span><span style="color:#d97706;">₹ ${netPayable.toLocaleString('en-IN', {maximumFractionDigits:2})}</span></div>
      </div>

      <div style="margin-top:1.5rem;border-top:1px solid #e2e8f0;padding-top:1rem;font-size:0.8rem;color:#64748b;text-align:center;">
        Thank you for staying at Rajodi C Beach Resort! We hope to see you again.
      </div>
    </div>`;

  openModal('checkOutModal');
}

function confirmCheckOutAndFreeRoom() {
  if (!selectedCheckoutRoomId) return;
  const room = rooms.find(r => r.id === selectedCheckoutRoomId);
  if (!room) return;

  const guestName = room.guestDetails?.guestName || 'Guest';

  // Calculate net payable to record transaction
  const checkInTime = new Date(room.guestDetails.checkInDate).getTime();
  const nowTime     = Date.now();
  const stayDays    = Math.max(1, Math.ceil((nowTime - checkInTime) / 86400000));
  const subtotal    = room.price * stayDays;
  const cgst        = subtotal * 0.09;
  const sgst        = subtotal * 0.09;
  const grossTotal  = subtotal + cgst + sgst;
  const advance     = room.guestDetails.advancePaid || 0;
  const netPayable  = grossTotal - advance;

  if (netPayable > 0) {
    dailyTransactions.push({
      date: new Date().toISOString(),
      type: 'Final Payment (Check-Out)',
      guestName: guestName,
      roomNumber: room.number,
      amount: netPayable
    });
  } else if (netPayable < 0) {
    dailyTransactions.push({
      date: new Date().toISOString(),
      type: 'Refund (Check-Out)',
      guestName: guestName,
      roomNumber: room.number,
      amount: netPayable // Will be negative
    });
  }

  room.status = 'free';
  room.guestDetails = null;

  saveRoomsState();
  closeModal('checkOutModal');
  selectedCheckoutRoomId = null;

  logActivity(`Check-Out: ${guestName} from Room ${room.number}. Room set FREE.`, 'success');
  showToast(`✔ ${guestName} checked out. Room ${room.number} is now FREE.`, 'success');
}

function printInvoice() { window.print(); }

function downloadInvoicePDF() {
  const element = document.getElementById('invoicePaper');
  if (!element) return;
  
  const opt = {
    margin:       [0.5, 0.5, 0.5, 0.5],
    filename:     `Invoice_${new Date().getTime()}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}

// ─── ACTIVITY LOG ─────────────────────────────────────────────────────────────
function openActivityLog() {
  const list = document.getElementById('activityLogList');
  if (!list) return;

  if (!activityLog.length) {
    list.innerHTML = `<div class="log-empty"><i class="fa-solid fa-list-check" style="font-size:2rem;opacity:0.3;margin-bottom:0.75rem;display:block;"></i>No activity recorded yet.</div>`;
  } else {
    const iconMap  = { success: { icon: 'fa-circle-check',  bg: 'rgba(16,185,129,0.15)', color: '#34d399' }, error: { icon: 'fa-circle-xmark', bg: 'rgba(244,63,94,0.15)', color: '#fb7185' }, warning: { icon: 'fa-triangle-exclamation', bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' }, info: { icon: 'fa-circle-info', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' } };
    list.innerHTML = activityLog.map(entry => {
      const cfg = iconMap[entry.type] || iconMap.info;
      return `
        <div class="activity-log-item">
          <div class="activity-log-icon" style="background:${cfg.bg};color:${cfg.color};">
            <i class="fa-solid ${cfg.icon}"></i>
          </div>
          <div class="activity-log-content">
            <strong>${entry.message}</strong>
            <span>${entry.time}</span>
          </div>
        </div>`;
    }).join('');
  }
  openModal('activityLogModal');
}

function clearActivityLog() {
  activityLog = [];
  saveActivityLog();
  openActivityLog();
  showToast('Activity log cleared.', 'warning');
}

// ─── ROOM NOTES ───────────────────────────────────────────────────────────────
function openNotesModal(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;
  document.getElementById('notesRoomId').value     = roomId;
  document.getElementById('notesRoomNumber').textContent = room.number;
  document.getElementById('roomNotesTextarea').value     = room.notes || '';
  openModal('roomNotesModal');
}

function saveRoomNotes() {
  const roomId = document.getElementById('notesRoomId').value;
  const room   = rooms.find(r => r.id === roomId);
  if (!room) return;
  room.notes = document.getElementById('roomNotesTextarea').value.trim();
  saveRoomsState();
  closeModal('roomNotesModal');
  logActivity(`Staff notes updated for Room ${room.number}.`, 'info');
  showToast(`Notes saved for Room ${room.number}.`, 'success');
}

// ─── MODAL HELPERS ────────────────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

// Close modals on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('active');
  }
});

// ─── TOAST NOTIFICATIONS ──────────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const iconMap = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${iconMap[type] || iconMap.info}"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ─── DAY END SUMMARY REPORT ───────────────────────────────────────────────────
function openDayEndSummary() {
  const container = document.getElementById('dayEndSummaryContent');
  if (!container) return;

  if (!dailyTransactions || dailyTransactions.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No transactions recorded today.</p></div>`;
  } else {
    let totalRevenue = 0;
    const rows = dailyTransactions.map(tx => {
      totalRevenue += tx.amount;
      const dateStr = new Date(tx.date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
      return `<tr>
        <td>${dateStr}</td>
        <td>${tx.roomNumber}</td>
        <td>${tx.guestName}</td>
        <td>${tx.type}</td>
        <td style="text-align:right;">₹ ${tx.amount.toLocaleString('en-IN', {maximumFractionDigits:2})}</td>
      </tr>`;
    }).join('');

    container.innerHTML = `
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Room</th>
            <th>Guest Name</th>
            <th>Type</th>
            <th style="text-align:right;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <div class="invoice-totals">
        <div class="invoice-total-row grand-total">
          <span>Total Collected:</span>
          <span style="color:#059669;">₹ ${totalRevenue.toLocaleString('en-IN', {maximumFractionDigits:2})}</span>
        </div>
      </div>
    `;
  }
  openModal('dayEndSummaryModal');
}

function clearDailyTransactions() {
  if (confirm("Are you sure you want to clear the transaction history? This is usually done at the end of the day.")) {
    dailyTransactions = [];
    saveRoomsState();
    openDayEndSummary(); // Refresh modal
    showToast('Daily transactions cleared.', 'warning');
  }
}

function confirmLockSystem() {
  closeModal('dayEndSummaryModal');
  lockAdminSystem();
}
