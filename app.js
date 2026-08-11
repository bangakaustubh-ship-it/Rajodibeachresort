/* ==========================================================================
   RAJODI C BEACH RESORT — UNIFIED APP JS
   Public Website + Admin Portal
   ========================================================================== */

// ─── PUBLIC WEBSITE JS ───────────────────────────────────────────────────────

// Navbar scroll effect + active link
(function() {
  const navbar = document.getElementById('pubNavbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active nav link highlight
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.pub-nav-links .nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('pubNavLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.innerHTML = navLinks.classList.contains('open')
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });
    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ─── REVEAL ON SCROLL ────────────────────────────────────────────────────────
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ─── STAT COUNTERS ───────────────────────────────────────────────────────────
(function() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const suffix = target === 4 ? '.5★' : (target >= 100 ? '+' : '+');
      let start = 0;
      const step = () => {
        start += Math.ceil(target / 50);
        if (start >= target) { el.textContent = target + suffix; return; }
        el.textContent = start + suffix;
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

// ─── GALLERY FILTER + LIGHTBOX ───────────────────────────────────────────────
(function() {
  const filters = document.querySelectorAll('.gal-filter');
  if (!filters.length) return;
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      document.querySelectorAll('.gal-item').forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) item.classList.remove('hidden');
        else item.classList.add('hidden');
      });
    });
  });
})();

function openLightbox(el) {
  const img = el.querySelector('img');
  const lb  = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  if (!lb || !lbImg || !img) return;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ─── REVIEW CAROUSEL ─────────────────────────────────────────────────────────
(function() {
  const cards = document.querySelectorAll('.review-card');
  const dots  = document.querySelectorAll('.rev-dot');
  if (!cards.length) return;
  let current = 0;

  function showReview(n) {
    cards.forEach(c => c.classList.remove('active-review'));
    dots.forEach(d => d.classList.remove('active'));
    current = (n + cards.length) % cards.length;
    cards[current].classList.add('active-review');
    if (dots[current]) dots[current].classList.add('active');
  }

  document.getElementById('revPrev')?.addEventListener('click', () => showReview(current - 1));
  document.getElementById('revNext')?.addEventListener('click', () => showReview(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => showReview(i)));

  // Auto-play every 5s
  setInterval(() => showReview(current + 1), 5000);
})();

// ─── ROOM IMAGE SLIDER ───────────────────────────────────────────────────────
const sliderState = {};

function slideRoom(dir, sliderId) {
  const wrap   = document.getElementById(sliderId);
  if (!wrap) return;
  const slides = wrap.querySelectorAll('.room-slide');
  const dotsEl = document.getElementById(sliderId.replace('Slider', 'Dots'));
  if (!sliderState[sliderId]) sliderState[sliderId] = 0;
  sliderState[sliderId] = (sliderState[sliderId] + dir + slides.length) % slides.length;
  goSlide(sliderState[sliderId], sliderId);
}

function goSlide(idx, sliderId) {
  const wrap   = document.getElementById(sliderId);
  if (!wrap) return;
  const slides = wrap.querySelectorAll('.room-slide');
  const dotsEl = document.getElementById(sliderId.replace('Slider', 'Dots'));
  sliderState[sliderId] = idx;
  slides.forEach((s, i) => {
    s.classList.toggle('active-slide', i === idx);
    s.style.position = i === idx ? 'relative' : 'absolute';
  });
  if (dotsEl) dotsEl.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

// ─── CONTACT WHATSAPP ────────────────────────────────────────────────────────
function sendContactWA() {
  const name = document.getElementById('cName')?.value.trim() || '';
  const phone = document.getElementById('cPhone')?.value.trim() || '';
  const msg   = document.getElementById('cMsg')?.value.trim() || '';
  if (!name && !msg) { alert('Please fill in your name or message.'); return; }
  const text = encodeURIComponent(`Hi, I'm ${name}${phone ? ' (' + phone + ')' : ''}.\n\n${msg}`);
  window.open('https://wa.me/919022287501?text=' + text, '_blank');
}


// ==========================================================================
// ADMIN PORTAL JS (active only on admin.html)
// ==========================================================================

const INITIAL_ROOMS = [
  { id:'101',number:'101',category:'Deluxe Room',typeKey:'deluxe',price:3000,image:'images/deluxe.png',status:'free',guestDetails:null,notes:'' },
  { id:'102',number:'102',category:'Deluxe Room',typeKey:'deluxe',price:3000,image:'images/deluxe.png',status:'booked',guestDetails:{guestName:'Amit Sharma',phone:'+91 98112 34567',idType:'Aadhaar Card',idNo:'4532-8910-1123',checkInDate:new Date(Date.now()-86400000).toISOString().slice(0,16),checkOutDate:new Date().toISOString().slice(0,16),advancePaid:1000,notes:''},notes:'' },
  { id:'103',number:'103',category:'Deluxe Room',typeKey:'deluxe',price:3000,image:'images/deluxe.png',status:'free',guestDetails:null,notes:'' },
  { id:'104',number:'104',category:'Deluxe Room',typeKey:'deluxe',price:3000,image:'images/deluxe.png',status:'free',guestDetails:null,notes:'' },
  { id:'105',number:'105',category:'Deluxe Room',typeKey:'deluxe',price:3000,image:'images/deluxe.png',status:'cleaning',guestDetails:null,notes:'Deep cleaning required.' },
  { id:'201',number:'201',category:'Super Deluxe Room',typeKey:'super-deluxe',price:3500,image:'images/super_deluxe.png',status:'free',guestDetails:null,notes:'' },
  { id:'202',number:'202',category:'Super Deluxe Room',typeKey:'super-deluxe',price:3500,image:'images/super_deluxe.png',status:'booked',guestDetails:{guestName:'Priya Verma',phone:'+91 98765 12345',idType:'Driving License',idNo:'DL-0420210098',checkInDate:new Date().toISOString().slice(0,16),checkOutDate:new Date(Date.now()+86400000).toISOString().slice(0,16),advancePaid:2000,notes:''},notes:'' },
  { id:'203',number:'203',category:'Super Deluxe Room',typeKey:'super-deluxe',price:3500,image:'images/super_deluxe.png',status:'free',guestDetails:null,notes:'' },
  { id:'204',number:'204',category:'Super Deluxe Room',typeKey:'super-deluxe',price:3500,image:'images/super_deluxe.png',status:'free',guestDetails:null,notes:'' },
  { id:'205',number:'205',category:'Super Deluxe Room',typeKey:'super-deluxe',price:3500,image:'images/super_deluxe.png',status:'free',guestDetails:null,notes:'' },
  { id:'301',number:'301',category:'Executive Room with Balcony',typeKey:'executive',price:5000,image:'images/executive.png',status:'free',guestDetails:null,notes:'' },
  { id:'302',number:'302',category:'Executive Room with Balcony',typeKey:'executive',price:5000,image:'images/executive.png',status:'free',guestDetails:null,notes:'' },
  { id:'303',number:'303',category:'Executive Room with Balcony',typeKey:'executive',price:5000,image:'images/executive.png',status:'booked',guestDetails:{guestName:'Rohan Mehta',phone:'+91 99887 76655',idType:'Passport',idNo:'Z9876543',checkInDate:new Date(Date.now()-43200000).toISOString().slice(0,16),checkOutDate:new Date(Date.now()+43200000).toISOString().slice(0,16),advancePaid:3000,notes:'VIP Guest. Complimentary welcome drink arranged.'},notes:'VIP Guest' },
  { id:'304',number:'304',category:'Executive Room with Balcony',typeKey:'executive',price:5000,image:'images/executive.png',status:'free',guestDetails:null,notes:'' },
  { id:'305',number:'305',category:'Executive Room with Balcony',typeKey:'executive',price:5000,image:'images/executive.png',status:'free',guestDetails:null,notes:'' },
];

let rooms=[],isAdminUnlocked=false,currentFilter='all',selectedCheckoutRoomId=null,activityLog=[],dailyTransactions=[],occupancyChartInst=null,revenueChartInst=null;

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('adminMainDashboard')) return; // not admin page
  loadRoomsState();
  loadActivityLog();
  checkAdminSession();
  startLiveClock();
});

function startLiveClock() {
  function tick() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
    const dateStr = now.toLocaleDateString('en-IN',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
    const c=document.getElementById('liveClock'),d=document.getElementById('liveDate');
    if(c)c.textContent=timeStr;if(d)d.textContent=dateStr;
  }
  tick();setInterval(tick,1000);
}

function loadRoomsState() {
  const saved=localStorage.getItem('resort_rooms_data_v2');
  if(saved){try{rooms=JSON.parse(saved);rooms.forEach(r=>{if(!r.image)r.image=getImagePath(r.typeKey);if(r.typeKey==='executive')r.category='Executive Room with Balcony';if(r.notes===undefined)r.notes='';});}catch(e){rooms=deepCopy(INITIAL_ROOMS);}}
  else rooms=deepCopy(INITIAL_ROOMS);
  const savedTx=localStorage.getItem('resort_daily_transactions');
  if(savedTx){try{dailyTransactions=JSON.parse(savedTx);}catch(e){dailyTransactions=[];}}
  else dailyTransactions=[];
  if(!saved)saveRoomsState();
}

function saveRoomsState() {
  localStorage.setItem('resort_rooms_data_v2',JSON.stringify(rooms));
  localStorage.setItem('resort_daily_transactions',JSON.stringify(dailyTransactions));
  if(isAdminUnlocked){renderRoomMatrix();updateDashboardStats();updateCharts();updateTabCounts();}
}

function loadActivityLog(){const s=localStorage.getItem('resort_activity_log');if(s){try{activityLog=JSON.parse(s);}catch(e){activityLog=[];}}}
function saveActivityLog(){localStorage.setItem('resort_activity_log',JSON.stringify(activityLog.slice(0,100)));}
function logActivity(msg,type='info'){activityLog.unshift({message:msg,type,time:new Date().toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'})});saveActivityLog();}
function resetToInitialState(){if(confirm('Reset ALL rooms to initial demo state?')){rooms=deepCopy(INITIAL_ROOMS);saveRoomsState();logActivity('System reset to initial demo state.','warning');showToast('Demo data reset!','warning');}}
function deepCopy(obj){return JSON.parse(JSON.stringify(obj));}
function getImagePath(t){if(t==='deluxe')return'images/deluxe.png';if(t==='super-deluxe')return'images/super_deluxe.png';if(t==='executive')return'images/executive.png';return'images/deluxe.png';}

function checkAdminSession(){if(sessionStorage.getItem('resort_admin_session')==='true')unlockAdminSystem();else lockAdminSystem();}

function handleAdminAuth(event){
  event.preventDefault();
  const pin=document.getElementById('loginPinInput').value.trim();
  if(pin==='1234'||pin.toLowerCase()==='admin'){sessionStorage.setItem('resort_admin_session','true');unlockAdminSystem();}
  else{document.getElementById('authErrorMsg').style.display='block';document.getElementById('loginPinInput').value='';}
}

function unlockAdminSystem(){
  isAdminUnlocked=true;
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('adminMainDashboard').style.display='block';
  const badge=document.getElementById('accessStatusBadge');
  badge.className='status-badge badge-free';
  badge.innerHTML='<i class="fa-solid fa-circle-check"></i> Admin Unlocked';
  document.getElementById('logoutNavBtn').style.display='inline-flex';
  renderRoomMatrix();updateDashboardStats();initCharts();updateCharts();updateTabCounts();
  logActivity('Admin console unlocked.','success');
}

function lockAdminSystem(){
  isAdminUnlocked=false;sessionStorage.removeItem('resort_admin_session');
  document.getElementById('adminMainDashboard').style.display='none';
  document.getElementById('loginScreen').style.display='flex';
  const badge=document.getElementById('accessStatusBadge');
  badge.className='status-badge badge-booked';badge.innerHTML='<i class="fa-solid fa-lock"></i> System Locked';
  document.getElementById('logoutNavBtn').style.display='none';
  document.getElementById('loginPinInput').value='';
  document.getElementById('authErrorMsg').style.display='none';
  showToast('Console locked. Stay safe!','info');
}

function updateDashboardStats(){
  const total=rooms.length,free=rooms.filter(r=>r.status==='free').length,booked=rooms.filter(r=>r.status==='booked').length;
  let rev=0;rooms.filter(r=>r.status==='booked').forEach(r=>rev+=r.price*1.18);
  animateCounter('dashTotalRooms',total);animateCounter('dashFreeRooms',free);animateCounter('dashBookedRooms',booked);
  const el=document.getElementById('dashActiveRevenue');if(el)el.textContent='₹ '+rev.toLocaleString('en-IN',{maximumFractionDigits:0});
}

function animateCounter(id,target){
  const el=document.getElementById(id);if(!el)return;
  const start=parseInt(el.textContent)||0,duration=600,startTime=performance.now();
  function step(now){const p=Math.min((now-startTime)/duration,1),ease=1-Math.pow(1-p,3);el.textContent=Math.round(start+(target-start)*ease);if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}

function updateTabCounts(){
  document.getElementById('countAll').textContent=rooms.length;
  document.getElementById('countFree').textContent=rooms.filter(r=>r.status==='free').length;
  document.getElementById('countBooked').textContent=rooms.filter(r=>r.status==='booked').length;
  document.getElementById('countCleaning').textContent=rooms.filter(r=>r.status==='cleaning').length;
}

function initCharts(){
  const octx=document.getElementById('occupancyChart');
  if(octx&&!occupancyChartInst){occupancyChartInst=new Chart(octx,{type:'doughnut',data:{labels:['Booked','Free','Cleaning'],datasets:[{data:[0,15,0],backgroundColor:['rgba(244,63,94,0.85)','rgba(16,185,129,0.85)','rgba(251,191,36,0.85)'],borderColor:['#f43f5e','#10b981','#fbbf24'],borderWidth:2,hoverOffset:8}]},options:{cutout:'72%',plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${ctx.label}: ${ctx.raw} rooms`}}},animation:{animateRotate:true,duration:900}}});}
  const rctx=document.getElementById('revenueChart');
  if(rctx&&!revenueChartInst){revenueChartInst=new Chart(rctx,{type:'bar',data:{labels:['Deluxe','Super Deluxe','Executive'],datasets:[{label:'Active Revenue (₹)',data:[0,0,0],backgroundColor:['rgba(59,130,246,0.7)','rgba(16,185,129,0.7)','rgba(245,158,11,0.7)'],borderColor:['#3b82f6','#10b981','#f59e0b'],borderWidth:2,borderRadius:8}]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#94a3b8'}},y:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#94a3b8',callback:v=>`₹${(v/1000).toFixed(0)}k`}}},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ₹ ${ctx.raw.toLocaleString('en-IN')}`}}},animation:{duration:700}}});}
}

function updateCharts(){
  if(!occupancyChartInst||!revenueChartInst)return;
  const booked=rooms.filter(r=>r.status==='booked').length,free=rooms.filter(r=>r.status==='free').length,cleaning=rooms.filter(r=>r.status==='cleaning').length;
  occupancyChartInst.data.datasets[0].data=[booked,free,cleaning];occupancyChartInst.update();
  const pct=rooms.length?Math.round((booked/rooms.length)*100):0;
  const oEl=document.getElementById('occupancyPercent');if(oEl)oEl.textContent=pct+'%';
  const dr=rooms.filter(r=>r.status==='booked'&&r.typeKey==='deluxe').reduce((s,r)=>s+r.price*1.18,0);
  const sr=rooms.filter(r=>r.status==='booked'&&r.typeKey==='super-deluxe').reduce((s,r)=>s+r.price*1.18,0);
  const er=rooms.filter(r=>r.status==='booked'&&r.typeKey==='executive').reduce((s,r)=>s+r.price*1.18,0);
  revenueChartInst.data.datasets[0].data=[dr,sr,er];revenueChartInst.update();
}

function filterRooms(status,btnEl){
  currentFilter=status;
  document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
  if(btnEl)btnEl.classList.add('active');
  renderRoomMatrix();
}

function renderRoomMatrix(){
  const container=document.getElementById('adminRoomGrid');if(!container)return;
  const query=(document.getElementById('adminSearchInput')?.value||'').toLowerCase();
  const filtered=rooms.filter(room=>{
    const mf=currentFilter==='all'||room.status===currentFilter;
    const ms=room.number.includes(query)||room.category.toLowerCase().includes(query)||(room.guestDetails&&room.guestDetails.guestName.toLowerCase().includes(query));
    return mf&&ms;
  });
  if(!filtered.length){container.innerHTML=`<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-folder-open"></i></div><p>No rooms match your filter or search query.</p></div>`;return;}
  container.innerHTML=filtered.map((room,idx)=>buildRoomCard(room,idx)).join('');
}

function buildRoomCard(room,idx){
  const sc=`status-${room.status}`,bc=`badge-${room.status}`;
  const st=room.status==='free'?'FREE – Available':room.status==='booked'?'BOOKED – Occupied':'CLEANING';
  const bi=room.status==='free'?'fa-circle-check':room.status==='booked'?'fa-user-check':'fa-broom';
  const imgSrc=room.image||getImagePath(room.typeKey);
  const delay=Math.min(idx*0.05,0.4);
  let guestHtml='';
  if(room.status==='booked'&&room.guestDetails){
    const g=room.guestDetails;
    const cif=new Date(g.checkInDate).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'});
    const cof=g.checkOutDate?new Date(g.checkOutDate).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'}):'—';
    guestHtml=`<div class="guest-info-card"><div class="g-name"><i class="fa-solid fa-user text-gold"></i> ${g.guestName}</div><div class="g-detail"><i class="fa-solid fa-phone"></i> ${g.phone}</div><div class="g-detail"><i class="fa-solid fa-right-to-bracket"></i> In: ${cif}</div><div class="g-detail"><i class="fa-solid fa-right-from-bracket"></i> Out: ${cof}</div>${g.advancePaid>0?`<div class="g-detail" style="color:#34d399;font-weight:600;"><i class="fa-solid fa-money-bill-wave"></i> Advance: ₹ ${g.advancePaid.toLocaleString('en-IN')}</div>`:''} ${g.notes?`<div class="g-detail" style="color:#fbbf24;font-style:italic;"><i class="fa-solid fa-note-sticky"></i> ${g.notes}</div>`:''}</div>`;
  }
  let actions='';
  if(room.status==='free')actions=`<button class="btn btn-gold btn-sm" style="flex:1;" onclick="openCheckInModal('${room.id}')"><i class="fa-solid fa-key"></i> Check In</button><button class="btn btn-outline btn-sm" onclick="setRoomStatus('${room.id}','cleaning')" title="Mark Cleaning"><i class="fa-solid fa-broom"></i></button><button class="btn btn-outline btn-sm" onclick="openNotesModal('${room.id}')" title="Staff Notes"><i class="fa-solid fa-note-sticky"></i></button>`;
  else if(room.status==='booked')actions=`<button class="btn btn-success btn-sm" style="width:100%;" onclick="openCheckOutModal('${room.id}')"><i class="fa-solid fa-receipt"></i> Check Out &amp; Bill</button>`;
  else if(room.status==='cleaning')actions=`<button class="btn btn-success btn-sm" style="flex:1;" onclick="setRoomStatus('${room.id}','free')"><i class="fa-solid fa-circle-check"></i> Set Free</button><button class="btn btn-outline btn-sm" onclick="openNotesModal('${room.id}')"><i class="fa-solid fa-note-sticky"></i></button>`;
  const extras=[];
  if(room.typeKey==='deluxe')extras.push(`<div style="font-size:0.76rem;color:#fca5a5;margin-top:0.2rem;"><i class="fa-solid fa-circle-info"></i> Food Not Included</div>`);
  if(room.typeKey==='executive')extras.push(`<div style="font-size:0.76rem;color:#34d399;margin-top:0.2rem;"><i class="fa-solid fa-mountain-sun"></i> Private Balcony View</div>`);
  if(room.notes&&room.status!=='booked')extras.push(`<div class="room-notes-chip" onclick="openNotesModal('${room.id}')"><i class="fa-solid fa-note-sticky"></i> ${room.notes.substring(0,40)}${room.notes.length>40?'…':''}</div>`);
  return `<div class="admin-room-card ${sc}" style="animation-delay:${delay}s;"><div><div class="card-img-wrap"><img src="${imgSrc}" alt="${room.category}" class="card-img" onerror="this.src='images/deluxe.png'"><div class="room-number-pill">Room ${room.number}</div><div class="price-tag-pill">₹ ${room.price.toLocaleString('en-IN')} + GST</div></div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;"><div><strong style="color:#fff;font-size:1rem;">${room.category}</strong>${extras.join('')}</div><span class="status-badge ${bc}"><i class="fa-solid ${bi}"></i> ${st}</span></div>${guestHtml}</div><div style="margin-top:1.1rem;display:flex;gap:0.5rem;flex-wrap:wrap;">${actions}</div></div>`;
}

function setRoomStatus(roomId,newStatus){
  const room=rooms.find(r=>r.id===roomId);if(!room)return;
  const old=room.status;room.status=newStatus;
  if(newStatus==='free'||newStatus==='cleaning')room.guestDetails=null;
  saveRoomsState();logActivity(`Room ${room.number} status changed: ${old} → ${newStatus}.`,'info');
  showToast(`Room ${room.number} is now ${newStatus.toUpperCase()}.`,newStatus==='free'?'success':'warning');
}

let currentStep=1;

function openCheckInModal(roomId){
  const room=rooms.find(r=>r.id===roomId);if(!room)return;
  document.getElementById('ciRoomId').value=room.id;
  document.getElementById('ciRoomDisplay').textContent=`Room ${room.number} – ${room.category}`;
  document.getElementById('ciRateDisplay').textContent=`Base Rate: ₹ ${room.price.toLocaleString('en-IN')} / night + 18% GST`;
  const now=new Date(),nowStr=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);
  const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);tomorrow.setHours(11,0,0,0);
  const tomStr=new Date(tomorrow.getTime()-tomorrow.getTimezoneOffset()*60000).toISOString().slice(0,16);
  document.getElementById('ciGuestName').value='';document.getElementById('ciPhone').value='';document.getElementById('ciAdvance').value='0';
  document.getElementById('ciIdNo').value='';document.getElementById('ciNotes').value='';
  document.getElementById('ciCheckInDate').value=nowStr;document.getElementById('ciCheckOutDate').value=tomStr;
  document.getElementById('estimatedBillText').textContent='Select dates to see estimate';
  goStep(1);openModal('checkInModal');
}

function goStep(n){
  currentStep=n;
  [1,2,3].forEach(i=>{
    const stepEl=document.getElementById(`formStep${i}`),dotEl=document.getElementById(`step${i}Dot`);
    if(stepEl)stepEl.style.display=(i===n)?'block':'none';
    if(dotEl){dotEl.className='step';if(i<n)dotEl.classList.add('done');if(i===n)dotEl.classList.add('active');}
  });
  if(n===3)updateBillEstimate();
}

function updateBillEstimate(){
  const roomId=document.getElementById('ciRoomId').value,room=rooms.find(r=>r.id===roomId);
  const inVal=document.getElementById('ciCheckInDate').value,outVal=document.getElementById('ciCheckOutDate').value;
  const preview=document.getElementById('estimatedBillText');
  if(!room||!inVal||!outVal){if(preview)preview.textContent='Select dates to see estimate';return;}
  const nights=Math.max(1,Math.ceil((new Date(outVal)-new Date(inVal))/86400000));
  const subtotal=room.price*nights,gst=subtotal*0.18,total=subtotal+gst;
  if(preview)preview.textContent=`Estimated Bill: ₹ ${subtotal.toLocaleString('en-IN')} + GST ₹ ${gst.toLocaleString('en-IN',{maximumFractionDigits:0})} = ₹ ${total.toLocaleString('en-IN',{maximumFractionDigits:0})} for ${nights} night(s)`;
}

function submitCheckIn(event){
  event.preventDefault();
  const roomId=document.getElementById('ciRoomId').value,room=rooms.find(r=>r.id===roomId);if(!room)return;
  room.status='booked';
  room.guestDetails={guestName:document.getElementById('ciGuestName').value.trim(),phone:document.getElementById('ciPhone').value.trim(),idType:document.getElementById('ciIdType').value,idNo:document.getElementById('ciIdNo').value.trim(),checkInDate:document.getElementById('ciCheckInDate').value,checkOutDate:document.getElementById('ciCheckOutDate').value,advancePaid:parseFloat(document.getElementById('ciAdvance').value)||0,notes:document.getElementById('ciNotes').value.trim()};
  if(room.guestDetails.advancePaid>0)dailyTransactions.push({date:new Date().toISOString(),type:'Advance (Check-In)',guestName:room.guestDetails.guestName,roomNumber:room.number,amount:room.guestDetails.advancePaid});
  saveRoomsState();closeModal('checkInModal');
  logActivity(`Check-In: ${room.guestDetails.guestName} → Room ${room.number}.`,'success');
  showToast(`✔ ${room.guestDetails.guestName} checked into Room ${room.number}!`,'success');
}

function openCheckOutModal(roomId){
  const room=rooms.find(r=>r.id===roomId);if(!room||!room.guestDetails)return;
  selectedCheckoutRoomId=roomId;
  const g=room.guestDetails;
  const stayDays=Math.max(1,Math.ceil((Date.now()-new Date(g.checkInDate).getTime())/86400000));
  const subtotal=room.price*stayDays,cgst=subtotal*0.09,sgst=subtotal*0.09,gross=subtotal+cgst+sgst,advance=g.advancePaid||0,net=gross-advance;
  const invNo=`INV-${Math.floor(100000+Math.random()*900000)}`,today=new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
  document.getElementById('checkOutBillContainer').innerHTML=`<div class="invoice-paper" id="invoicePaper"><div class="invoice-header"><div class="invoice-resort-brand"><h2>RAJODI C BEACH RESORT</h2><p>Last Stop, Rajodi Beach, OAC N Rd, Rajodi, Nalasopara West, Maharashtra 401304</p><p>📞 +91 90222 87501 | +91 88063 07706 | ✉ rajodibresort@gmail.com</p></div><div class="invoice-badge"><h4>TAX INVOICE</h4><p><strong>${invNo}</strong></p><p>Date: ${today}</p></div></div><div class="invoice-meta-grid"><div class="invoice-meta-col"><h5>Guest Details</h5><p><strong>Name:</strong> ${g.guestName}</p><p><strong>Mobile:</strong> ${g.phone}</p><p><strong>ID Proof:</strong> ${g.idType} (${g.idNo||'N/A'})</p>${g.notes?`<p><strong>Notes:</strong> ${g.notes}</p>`:''}</div><div class="invoice-meta-col"><h5>Stay Details</h5><p><strong>Room:</strong> ${room.number} – ${room.category}</p><p><strong>Check-In:</strong> ${new Date(g.checkInDate).toLocaleString('en-IN')}</p><p><strong>Check-Out:</strong> ${new Date().toLocaleString('en-IN')}</p><p><strong>Duration:</strong> ${stayDays} Night(s)</p></div></div><table class="invoice-table"><thead><tr><th>Description</th><th>Rate/Night</th><th>Nights</th><th style="text-align:right;">Amount (₹)</th></tr></thead><tbody><tr><td><strong>${room.category} Package</strong><br><span style="font-size:0.8rem;color:#64748b;">AC · WiFi · Swimming Pool · Morning Tea/Coffee</span></td><td>₹ ${room.price.toLocaleString('en-IN')}</td><td>${stayDays}</td><td style="text-align:right;">₹ ${subtotal.toLocaleString('en-IN')}</td></tr></tbody></table><div class="invoice-totals"><div class="invoice-total-row"><span>Room Subtotal:</span><span>₹ ${subtotal.toLocaleString('en-IN')}</span></div><div class="invoice-total-row"><span>CGST (9%):</span><span>₹ ${cgst.toLocaleString('en-IN',{maximumFractionDigits:2})}</span></div><div class="invoice-total-row"><span>SGST (9%):</span><span>₹ ${sgst.toLocaleString('en-IN',{maximumFractionDigits:2})}</span></div><div class="invoice-total-row" style="border-top:1px solid #cbd5e1;font-weight:600;"><span>Gross Total (incl. GST):</span><span>₹ ${gross.toLocaleString('en-IN',{maximumFractionDigits:2})}</span></div>${advance>0?`<div class="invoice-total-row" style="color:#059669;"><span>Less Advance Paid:</span><span>– ₹ ${advance.toLocaleString('en-IN')}</span></div>`:''}<div class="invoice-total-row grand-total"><span>Net Payable Balance:</span><span style="color:#d97706;">₹ ${net.toLocaleString('en-IN',{maximumFractionDigits:2})}</span></div></div><div style="margin-top:1.5rem;border-top:1px solid #e2e8f0;padding-top:1rem;font-size:0.8rem;color:#64748b;text-align:center;">Thank you for staying at Rajodi C Beach Resort! We hope to see you again.</div></div>`;
  openModal('checkOutModal');
}

function confirmCheckOutAndFreeRoom(){
  if(!selectedCheckoutRoomId)return;
  const room=rooms.find(r=>r.id===selectedCheckoutRoomId);if(!room)return;
  const guestName=room.guestDetails?.guestName||'Guest';
  const stayDays=Math.max(1,Math.ceil((Date.now()-new Date(room.guestDetails.checkInDate).getTime())/86400000));
  const subtotal=room.price*stayDays,cgst=subtotal*0.09,sgst=subtotal*0.09,gross=subtotal+cgst+sgst,advance=room.guestDetails.advancePaid||0,net=gross-advance;
  if(net!==0)dailyTransactions.push({date:new Date().toISOString(),type:net>0?'Final Payment (Check-Out)':'Refund (Check-Out)',guestName,roomNumber:room.number,amount:net});
  room.status='free';room.guestDetails=null;
  saveRoomsState();closeModal('checkOutModal');selectedCheckoutRoomId=null;
  logActivity(`Check-Out: ${guestName} from Room ${room.number}. Room set FREE.`,'success');
  showToast(`✔ ${guestName} checked out. Room ${room.number} is now FREE.`,'success');
}

function printInvoice(){window.print();}

function downloadInvoicePDF(){
  const element=document.getElementById('invoicePaper');if(!element)return;
  html2pdf().set({margin:[0.5,0.5,0.5,0.5],filename:`Invoice_${Date.now()}.pdf`,image:{type:'jpeg',quality:0.98},html2canvas:{scale:2},jsPDF:{unit:'in',format:'a4',orientation:'portrait'}}).from(element).save();
}

function openActivityLog(){
  const list=document.getElementById('activityLogList');if(!list)return;
  if(!activityLog.length){list.innerHTML=`<div class="log-empty"><i class="fa-solid fa-list-check" style="font-size:2rem;opacity:0.3;margin-bottom:0.75rem;display:block;"></i>No activity recorded yet.</div>`;}
  else{
    const iconMap={success:{icon:'fa-circle-check',bg:'rgba(16,185,129,0.15)',color:'#34d399'},error:{icon:'fa-circle-xmark',bg:'rgba(244,63,94,0.15)',color:'#fb7185'},warning:{icon:'fa-triangle-exclamation',bg:'rgba(251,191,36,0.15)',color:'#fbbf24'},info:{icon:'fa-circle-info',bg:'rgba(59,130,246,0.15)',color:'#60a5fa'}};
    list.innerHTML=activityLog.map(e=>{const c=iconMap[e.type]||iconMap.info;return`<div class="activity-log-item"><div class="activity-log-icon" style="background:${c.bg};color:${c.color};"><i class="fa-solid ${c.icon}"></i></div><div class="activity-log-content"><strong>${e.message}</strong><span>${e.time}</span></div></div>`;}).join('');
  }
  openModal('activityLogModal');
}

function clearActivityLog(){activityLog=[];saveActivityLog();openActivityLog();showToast('Activity log cleared.','warning');}

function openNotesModal(roomId){
  const room=rooms.find(r=>r.id===roomId);if(!room)return;
  document.getElementById('notesRoomId').value=roomId;
  document.getElementById('notesRoomNumber').textContent=room.number;
  document.getElementById('roomNotesTextarea').value=room.notes||'';
  openModal('roomNotesModal');
}

function saveRoomNotes(){
  const roomId=document.getElementById('notesRoomId').value,room=rooms.find(r=>r.id===roomId);if(!room)return;
  room.notes=document.getElementById('roomNotesTextarea').value.trim();
  saveRoomsState();closeModal('roomNotesModal');
  logActivity(`Staff notes updated for Room ${room.number}.`,'info');
  showToast(`Notes saved for Room ${room.number}.`,'success');
}

function openModal(id){const el=document.getElementById(id);if(el)el.classList.add('active');}
function closeModal(id){const el=document.getElementById(id);if(el)el.classList.remove('active');}
document.addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop'))e.target.classList.remove('active');});

function showToast(message,type='info',duration=3500){
  const container=document.getElementById('toastContainer');if(!container)return;
  const iconMap={success:'fa-circle-check',error:'fa-circle-xmark',info:'fa-circle-info',warning:'fa-triangle-exclamation'};
  const toast=document.createElement('div');toast.className=`toast toast-${type}`;
  toast.innerHTML=`<i class="fa-solid ${iconMap[type]||iconMap.info}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(()=>{toast.classList.add('toast-out');setTimeout(()=>toast.remove(),400);},duration);
}

function openDayEndSummary(){
  const container=document.getElementById('dayEndSummaryContent');if(!container)return;
  if(!dailyTransactions||!dailyTransactions.length){container.innerHTML=`<div class="empty-state"><p>No transactions recorded today.</p></div>`;}
  else{
    let total=0;
    const rows=dailyTransactions.map(tx=>{total+=tx.amount;const d=new Date(tx.date).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'});return`<tr><td>${d}</td><td>${tx.roomNumber}</td><td>${tx.guestName}</td><td>${tx.type}</td><td style="text-align:right;">₹ ${tx.amount.toLocaleString('en-IN',{maximumFractionDigits:2})}</td></tr>`;}).join('');
    container.innerHTML=`<table class="invoice-table"><thead><tr><th>Date & Time</th><th>Room</th><th>Guest Name</th><th>Type</th><th style="text-align:right;">Amount (₹)</th></tr></thead><tbody>${rows}</tbody></table><div class="invoice-totals"><div class="invoice-total-row grand-total"><span>Total Collected:</span><span style="color:#059669;">₹ ${total.toLocaleString('en-IN',{maximumFractionDigits:2})}</span></div></div>`;
  }
  openModal('dayEndSummaryModal');
}

function clearDailyTransactions(){
  if(confirm('Clear transaction history? Usually done at end of day.')){
    dailyTransactions=[];saveRoomsState();openDayEndSummary();showToast('Daily transactions cleared.','warning');
  }
}

function confirmLockSystem(){closeModal('dayEndSummaryModal');lockAdminSystem();}
