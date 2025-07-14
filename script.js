// --- DATA STATE ---
let drivers = [];
let teams = [];
let wdc = [];
let wdcIndexMap = [];
let wcc = [];
let wccIndexMap = [];
let grandsprix = [];
let driversStandings = [];

// Mapping negara ke kode bendera (ISO 3166-1 alpha-2)
const countryFlagMap = {
  "Australia": "au",
  "United Kingdom": "gb",
  "Netherlands": "nl",
  "Monaco": "mc",
  "Spain": "es",
  "Germany": "de",
  "France": "fr",
  "Italy": "it",
  "Finland": "fi",
  "Japan": "jp",
  "Canada": "ca",
  "Brazil": "br",
  "Mexico": "mx",
  "China": "cn",
  "USA": "us",
  "United States": "us",
  "United States of America": "us",
  "Amerika Serikat": "us",
  "Amerika": "us",
  "Thailand": "th",
  "Selandia Baru": "nz",
  "New Zealand": "nz",
  "Argentina": "ar",
  "Austria": "at",
  "Switzerland": "ch",
  // ... tambahkan sesuai kebutuhan
};

// Mapping nama team ke logo (CDN)
const teamLogoMap = {
  "Red Bull Racing": "https://upload.wikimedia.org/wikipedia/en/6/6e/Red_Bull_Racing_logo.png",
  "Mercedes": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Mercedes-Benz_logo_2010.svg",
  "Ferrari": "https://upload.wikimedia.org/wikipedia/en/d/d2/Scuderia_Ferrari_Logo.png",
  "McLaren F1 Team": "https://upload.wikimedia.org/wikipedia/en/6/6f/McLaren_Racing_logo.png",
  "Aston Martin": "https://upload.wikimedia.org/wikipedia/en/6/6b/Aston_Martin_F1_Logo.png",
  "Alpine": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Alpine_F1_Team_Logo.png",
  "Williams": "https://upload.wikimedia.org/wikipedia/en/3/3e/Williams_Grand_Prix_Engineering_logo.png",
  "Alfa Romeo": "https://upload.wikimedia.org/wikipedia/en/2/2e/Alfa_Romeo_F1_Team_Orlen_logo.png",
  "Haas": "https://upload.wikimedia.org/wikipedia/en/4/4b/Haas_F1_Team_logo.png",
  "AlphaTauri": "https://upload.wikimedia.org/wikipedia/en/2/2e/Scuderia_AlphaTauri_logo.png",
  // ... tambahkan sesuai kebutuhan
};

// --- LOCAL STORAGE UTILS ---
function saveAllToLocal() {
  localStorage.setItem('f1_drivers', JSON.stringify(drivers));
  localStorage.setItem('f1_teams', JSON.stringify(teams));
  localStorage.setItem('f1_grandsprix', JSON.stringify(grandsprix));
  localStorage.setItem('f1_wdc', JSON.stringify(wdc));
  localStorage.setItem('f1_wcc', JSON.stringify(wcc));
  localStorage.setItem('f1_drivers_standings', JSON.stringify(driversStandings));
  console.log('Data drivers disimpan:', drivers);
  console.log('Data teams disimpan:', teams);
  console.log('Data standings disimpan:', driversStandings);
}
function loadAllFromLocal() {
  drivers = JSON.parse(localStorage.getItem('f1_drivers')||'null') || [];
  teams = JSON.parse(localStorage.getItem('f1_teams')||'null') || [];
  grandsprix = JSON.parse(localStorage.getItem('f1_grandsprix')||'null') || [];
  wdc = JSON.parse(localStorage.getItem('f1_wdc')||'null') || [];
  wcc = JSON.parse(localStorage.getItem('f1_wcc')||'null') || [];
  driversStandings = JSON.parse(localStorage.getItem('f1_drivers_standings')||'null') || [];
  console.log('loadAllFromLocal() - drivers:', drivers);
  console.log('loadAllFromLocal() - teams:', teams);
  console.log('loadAllFromLocal() - standings:', driversStandings);
}

// --- MODAL HANDLER ---
function showModal(html) {
  document.getElementById('modal').innerHTML = html;
  document.getElementById('modal-bg').style.display = 'flex';
  
  // Add form validation and interactions
  setTimeout(() => {
    setupFormValidation();
    setupFormAnimations();
    setupFormInteractions();
  }, 100);
}

// Enhanced real-time validation
function setupRealTimeValidation() {
  const form = document.querySelector('.modal form');
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', handleRealTimeValidation);
    input.addEventListener('blur', handleRealTimeValidation);
  });
}

function handleRealTimeValidation(e) {
  const field = e.target;
  const formGroup = field.closest('.form-group');
  const errorElement = formGroup.querySelector('.error-message');
  
  // Clear previous error
  field.classList.remove('error');
  if (errorElement) {
    errorElement.classList.remove('show');
  }
  
  // Real-time validation
  let isValid = true;
  let errorMessage = '';
  
  if (field.hasAttribute('required') && !field.value.trim()) {
    isValid = false;
    errorMessage = 'Field ini wajib diisi';
  } else if (field.type === 'number') {
    if (field.value && isNaN(field.value)) {
      isValid = false;
      errorMessage = 'Masukkan angka yang valid';
    } else if (field.hasAttribute('min') && Number(field.value) < Number(field.getAttribute('min'))) {
      isValid = false;
      errorMessage = `Nilai minimal adalah ${field.getAttribute('min')}`;
    } else if (field.hasAttribute('max') && Number(field.value) > Number(field.getAttribute('max'))) {
      isValid = false;
      errorMessage = `Nilai maksimal adalah ${field.getAttribute('max')}`;
    }
  } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
    isValid = false;
    errorMessage = 'Masukkan email yang valid';
  }
  
  // Show/hide error message
  if (!isValid) {
    field.classList.add('error');
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
    }
  } else {
    // Show success indicator
    field.classList.add('valid');
    setTimeout(() => field.classList.remove('valid'), 2000);
  }
}

// Enhanced form setup
function setupFormValidation() {
  const form = document.querySelector('.modal form');
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearError);
    input.addEventListener('focus', highlightField);
  });
  
  // Add real-time validation
  setupRealTimeValidation();
}

// Enhanced checkbox interactions for Grand Prix
function setupCheckboxInteractions() {
  const checkboxes = document.querySelectorAll('input[name="podium"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', validatePodiumSelection);
  });
}

function validatePodiumSelection() {
  const checkedBoxes = document.querySelectorAll('input[name="podium"]:checked');
  const errorElement = document.getElementById('gp-podium-error');
  
  if (checkedBoxes.length < 3) {
    if (errorElement) {
      errorElement.textContent = `Pilih minimal 3 pembalap untuk podium! (${checkedBoxes.length}/3)`;
      errorElement.classList.add('show');
    }
  } else {
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }
}

// Enhanced form animations
function setupFormAnimations() {
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach((group, index) => {
    group.style.opacity = '0';
    group.style.transform = 'translateY(20px)';
    setTimeout(() => {
      group.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      group.style.opacity = '1';
      group.style.transform = 'translateY(0)';
    }, index * 100);
  });
  
  // Setup checkbox interactions for Grand Prix form
  setTimeout(() => {
    setupCheckboxInteractions();
  }, 500);
}

function validateField(e) {
  const field = e.target;
  const formGroup = field.closest('.form-group');
  const errorElement = formGroup.querySelector('.error-message');
  
  // Clear previous error
  field.classList.remove('error');
  if (errorElement) {
    errorElement.classList.remove('show');
  }
  
  // Validate based on field type
  let isValid = true;
  let errorMessage = '';
  
  if (field.hasAttribute('required') && !field.value.trim()) {
    isValid = false;
    errorMessage = 'Field ini wajib diisi';
  } else if (field.type === 'number' && field.value && isNaN(field.value)) {
    isValid = false;
    errorMessage = 'Masukkan angka yang valid';
  } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
    isValid = false;
    errorMessage = 'Masukkan email yang valid';
  }
  
  if (!isValid) {
    field.classList.add('error');
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
    }
  }
}

function clearError(e) {
  const field = e.target;
  const formGroup = field.closest('.form-group');
  const errorElement = formGroup.querySelector('.error-message');
  
  field.classList.remove('error');
  if (errorElement) {
    errorElement.classList.remove('show');
  }
}

function highlightField(e) {
  const field = e.target;
  field.style.transform = 'translateY(-1px)';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function closeModal() {
  document.getElementById('modal-bg').style.display = 'none';
}
document.getElementById('modal-bg').onclick = function(e) {
  if (e.target === this) closeModal();
};

// Enhanced form submission with loading and success states
function showFormLoading(form) {
  form.classList.add('form-loading');
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menyimpan...';
  }
}

function hideFormLoading(form) {
  form.classList.remove('form-loading');
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.textContent.replace('Menyimpan...', 'Simpan');
  }
}

function showFormSuccess(form) {
  form.classList.add('form-success');
  setTimeout(() => {
    form.classList.remove('form-success');
  }, 600);
}

// Enhanced keyboard shortcuts
function handleFormKeyboard(e) {
  const modal = document.getElementById('modal');
  if (!modal || modal.style.display === 'none') return;
  
  // Escape to close modal
  if (e.key === 'Escape') {
    closeModal();
  }
  
  // Enter to submit form (if not in textarea)
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
    const form = modal.querySelector('form');
    if (form) {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.click();
      }
    }
  }
  
  // Tab navigation enhancement
  if (e.key === 'Tab') {
    const inputs = modal.querySelectorAll('input, select, textarea, button');
    const firstInput = inputs[0];
    const lastInput = inputs[inputs.length - 1];
    
    if (e.shiftKey && e.target === firstInput) {
      e.preventDefault();
      lastInput.focus();
    } else if (!e.shiftKey && e.target === lastInput) {
      e.preventDefault();
      firstInput.focus();
    }
  }
}

// Enhanced form interactions with better feedback
function setupFormInteractions() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  
  // Auto-focus first input
  const firstInput = modal.querySelector('input, select');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 200);
  }
  
  // Add visual feedback for form interactions
  const inputs = modal.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group').classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.closest('.form-group').classList.remove('focused');
    });
  });
  
  // Enhanced checkbox interactions
  const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const item = e.target.closest('.checkbox-item');
      if (e.target.checked) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleFormKeyboard);
}

// Enhanced form validation with better UX
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], select[required]');
  let isValid = true;
  let firstError = null;
  
  inputs.forEach(input => {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    // Clear previous errors
    input.classList.remove('error');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
    
    // Validate field
    if (!input.value.trim()) {
      input.classList.add('error');
      if (errorElement) {
        errorElement.textContent = 'Field ini wajib diisi';
        errorElement.classList.add('show');
      }
      isValid = false;
      if (!firstError) firstError = input;
    }
  });
  
  // Focus first error if any
  if (firstError) {
    firstError.focus();
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  return isValid;
}

function submitDriver(e, idx) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) {
    return false;
  }
  showFormLoading(form);
  setTimeout(() => {
    const f = e.target;
    const data = {
      nama: f.nama.value,
      nomor_balap: f.nomor_balap.value,
      negara: f.negara.value,
      team: f.team.value,
      gelar: Number(f.gelar.value||0),
      foto: f.foto.value || ''
    };
    if (idx === null) drivers.push(data);
    else drivers[idx] = data;
    saveAllToLocal();
    hideFormLoading(form);
    showFormSuccess(form);
    setTimeout(() => {
      closeModal();
      renderDrivers();
    }, 300);
  }, 500);
}

function renderDrivers() {
  const el = document.getElementById('drivers-list');
  if (!drivers || drivers.length === 0) {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Belum ada data driver.</div>';
    return;
  }
  el.innerHTML = drivers.map((d, i) => {
    const flagImg = countryFlagMap[d.negara] ? `<img class='driver-flag-inline' src="https://flagcdn.com/40x30/${countryFlagMap[d.negara]}.png" alt="${d.negara}">` : '';
    return `
      <div class="card driver-card driver-flex-card">
        <div class="driver-photo-col">
          <div class="driver-photo-wrap">
            ${d.foto ? `<img class="driver-photo" src="${d.foto}" alt="${d.nama}" onerror="this.style.display='none'">` : '<div class="driver-photo-placeholder"><i class="driver-icon">🏁</i></div>'}
          </div>
        </div>
        <div class="driver-info-col">
          <div class="driver-name-row">
            ${flagImg}
            <span class="driver-name">${d.nama}</span> <span class="driver-num">#${d.nomor_balap}</span>
          </div>
          <div class="driver-team">${d.team ? `<span>${d.team}</span>` : '-'}</div>
          <div class="driver-stats">
            <span class="driver-stat-badge">Win: ${typeof d.kemenangan === 'number' ? d.kemenangan : 0}</span>
            <span class="driver-stat-badge podium">Podium: ${typeof d.podium === 'number' ? d.podium : 0}</span>
            <span class="driver-stat-badge gelar">WDC: ${d.gelar||0}</span>
          </div>
          <div class="driver-actions">
          <button class="crud-action edit" onclick="editDriver(${i})">Edit</button>
          <button class="crud-action delete" onclick="deleteDriver(${i})">Hapus</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function addDriverForm(editIdx = null, prefill = {}) {
  const item = editIdx !== null ? drivers[editIdx] : {nama:'', nomor_balap:'', negara:'', team:'', kemenangan:0, podium:0, gelar:0, foto:''};
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} Driver</h3>
    <form id="driver-form" onsubmit="submitDriver(event,${editIdx!==null?editIdx:'null'})">
        <div class="form-group">
        <label class="required">Nama</label>
        <input name="nama" value="${item.nama||prefill.nama||''}" required placeholder="Contoh: Oscar Piastri">
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label class="required">Nomor Balap</label>
        <input name="nomor_balap" value="${item.nomor_balap||prefill.nomor_balap||''}" required placeholder="Contoh: 81">
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label class="required">Negara</label>
        <input name="negara" value="${item.negara||prefill.negara||''}" required placeholder="Contoh: Australia">
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label>Team</label>
        <input name="team" value="${item.team||prefill.team||''}" placeholder="Contoh: McLaren F1 Team">
        </div>
      <div class="form-group">
        <label>Gelar Juara Dunia</label>
        <input name="gelar" type="number" value="${item.gelar||0}" min="0">
      </div>
        <div class="form-group">
        <label>Foto (URL)</label>
        <input name="foto" value="${item.foto||''}" placeholder="https://example.com/foto.jpg">
      </div>
      <div class="modal-actions">
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
        <button type="submit" class="crud-btn">${editIdx!==null?'Update':'Simpan'} Driver</button>
      </div>
    </form>
  `);
}

function editDriver(idx) { addDriverForm(idx); }
function deleteDriver(idx) {
  if (confirm('Hapus driver ini?')) {
    drivers.splice(idx,1);
    saveAllToLocal();
    renderDrivers();
    renderTeams();
  }
}
document.getElementById('add-driver-btn').onclick = () => addDriverForm();

// --- CRUD TEAMS ---
function renderTeams() {
  const el = document.getElementById('teams-list');
  if (!teams || teams.length === 0) {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Belum ada data team.</div>';
    return;
  }
  // Mapping warna khas team
  const teamColors = {
    'McLaren F1 Team': '#ff8700',
    'Ferrari': '#d40000',
    'Mercedes': '#00c3e0',
    'Red Bull Racing': '#1e2247',
    'Aston Martin': '#00665e',
    'Williams': '#005aff',
    'Alpine': '#0051a2',
    'Haas': '#b6babd',
    'Kick Sauber': '#00e676',
    'Racing Bulls': '#2e2d88',
  };
  // Mapping logo team
  const teamLogoMap = {
    'McLaren F1 Team': 'https://upload.wikimedia.org/wikipedia/en/6/6f/McLaren_Racing_logo.png',
    'Ferrari': 'https://upload.wikimedia.org/wikipedia/en/d/d2/Scuderia_Ferrari_Logo.png',
    'Mercedes': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Mercedes-Benz_logo_2010.svg',
    'Red Bull Racing': 'https://upload.wikimedia.org/wikipedia/en/6/6e/Red_Bull_Racing_logo.png',
    'Aston Martin': 'https://upload.wikimedia.org/wikipedia/en/6/6b/Aston_Martin_F1_Logo.png',
    'Williams': 'https://upload.wikimedia.org/wikipedia/en/3/3e/Williams_Grand_Prix_Engineering_logo.png',
    'Alpine': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Alpine_F1_Team_Logo.png',
    'Haas': 'https://upload.wikimedia.org/wikipedia/en/4/4b/Haas_F1_Team_logo.png',
    'Kick Sauber': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Stake_F1_Team_Kick_Sauber_logo.png',
    'Racing Bulls': 'https://upload.wikimedia.org/wikipedia/en/2/2e/Scuderia_AlphaTauri_logo.png',
  };
  // Mapping gambar mobil
  const carImgMap = {
    'McLaren F1 Team': 'car/2025mclarencarright.jpg',
    'Ferrari': 'car/2025ferraricarright.jpg',
    'Mercedes': 'car/2025mercedescarright.jpg',
    'Red Bull Racing': 'car/2025redbullracingcarright.jpg',
    'Aston Martin': 'car/2025astonmartincarright.jpg',
    'Williams': 'car/2025williamscarright.jpg',
    'Alpine': 'car/2025alpinecarright.jpg',
    'Haas': 'car/2025haascarright.jpg',
    'Kick Sauber': 'car/2025kicksaubercarright.jpg',
    'Racing Bulls': 'car/2025racingbullscarright.jpg',
  };
  el.innerHTML = teams.map((t, i) => {
    const color = teamColors[t.nama] || '#1a237e';
    const logo = t.logo ? `<img class='team-logo' src='${t.logo}' alt='${t.nama}'>` : '';
    const carImg = carImgMap[t.nama] ? `<img class='team-car-img' src='${carImgMap[t.nama]}' alt='${t.nama} car'>` : '';
    const flagImg = countryFlagMap[t.negara] ? `<img class='team-flag' src="https://flagcdn.com/32x24/${countryFlagMap[t.negara]}.png" alt="${t.negara}">` : '';
    // Ambil data driver dari global drivers
    function getDriverInfo(name) {
      if (!name) return {nama: '-', nomor_balap: '', foto: ''};
      const d = drivers.find(dr => dr.nama === name);
      return d ? {nama: d.nama, nomor_balap: d.nomor_balap, foto: d.foto} : {nama: name, nomor_balap: '', foto: ''};
    }
    const d1 = getDriverInfo(t.driver1);
    const d2 = getDriverInfo(t.driver2);
    // Ambil statistik dari field langsung atau nested
    const win = t.kemenangan != null ? t.kemenangan : (t.statistik && t.statistik.kemenangan != null ? t.statistik.kemenangan : 0);
    const podium = t.podium != null ? t.podium : (t.statistik && t.statistik.podium != null ? t.statistik.podium : 0);
    const gelar = t.gelar != null ? t.gelar : (t.statistik && t.statistik.gelar_konstruktor != null ? t.statistik.gelar_konstruktor : 0);
    return `
      <div class="card team-card team-flex-card" style="border-left:8px solid ${color};">
        <div class="team-card-header">
          <div class="team-logo-wrap">${logo}</div>
          <div class="team-title-wrap">
            <span class="team-name" style="color:${color}">${t.nama}</span>
            <span class="team-flag-wrap">${flagImg}</span>
          </div>
          <div class="team-car-wrap">${carImg}</div>
        </div>
        <div class="team-card-body">
          <div class="team-drivers-row">
            <div class="team-driver">
              ${d1.foto ? `<img class='team-driver-photo' src='${d1.foto}' alt='${d1.nama}'>` : ''}
              <span class="team-driver-name">${d1.nama}</span> <span class="team-driver-num">${d1.nomor_balap ? '#' + d1.nomor_balap : ''}</span>
            </div>
            <div class="team-driver">
              ${d2.foto ? `<img class='team-driver-photo' src='${d2.foto}' alt='${d2.nama}'>` : ''}
              <span class="team-driver-name">${d2.nama}</span> <span class="team-driver-num">${d2.nomor_balap ? '#' + d2.nomor_balap : ''}</span>
            </div>
          </div>
          <div class="team-stats-row">
            <span class="team-stat-badge">Win: ${win}</span>
            <span class="team-stat-badge podium">Podium: ${podium}</span>
            <span class="team-stat-badge gelar">WCC: ${gelar}</span>
          </div>
          <div class="team-actions-row">
            <button class="crud-action edit" onclick="editTeam(${i})">Edit</button>
            <button class="crud-action delete" onclick="deleteTeam(${i})">Hapus</button>
          </div>
      </div>
    </div>
    `;
  }).join('');
}
function addTeamForm(editIdx = null, formState = null) {
  const item = editIdx !== null ? teams[editIdx] : {nama:'', negara:'', driver1:'', driver2:'', kemenangan:0, podium:0, gelar:0, logo:''};
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} Team</h3>
    <form onsubmit="submitTeam(event,${editIdx!==null?editIdx:'null'})">
        <div class="form-group">
          <label class="required">Nama Team</label>
        <input name="nama" value="${item.nama}" required placeholder="Contoh: McLaren F1 Team">
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label class="required">Negara</label>
        <input name="negara" value="${item.negara}" required placeholder="Contoh: United Kingdom">
          <div class="error-message"></div>
        </div>
      <div class="form-group">
        <label>Logo Team (URL)</label>
        <input name="logo" type="url" value="${item.logo || ''}" placeholder="https://example.com/team-logo.png">
            <div class="error-message"></div>
        <small style="color:#666;font-size:0.85rem;">Opsional: Masukkan URL logo team</small>
          </div>
          <div class="form-group">
        <label>Driver 1</label>
        <input name="driver1" value="${item.driver1||''}" placeholder="Contoh: Oscar Piastri">
          </div>
      <div class="form-group">
        <label>Driver 2</label>
        <input name="driver2" value="${item.driver2||''}" placeholder="Contoh: Lando Norris">
          </div>
      <div class="form-grid">
      <div class="form-group">
          <label>Gelar Konstruktor</label>
          <input name="gelar" type="number" value="${item.gelar||0}" min="0">
      </div>
      <div class="form-group">
        <label>Kemenangan</label>
        <input name="kemenangan" type="number" value="${item.kemenangan||0}" min="0">
      </div>
      <div class="form-group">
        <label>Podium</label>
        <input name="podium" type="number" value="${item.podium||0}" min="0">
      </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
        <button type="submit" class="crud-btn">${editIdx!==null?'Update':'Simpan'} Team</button>
      </div>
    </form>
  `);
}

function showAddDriverInlineTeam(form) {
  // Simpan state form sebelum menambah driver
  const state = {
    nama: form.nama.value,
    negara: form.negara.value,
    daftar_driver: Array.from(form.daftar_driver.selectedOptions).map(opt=>opt.value),
    statistik: {
      kemenangan: form.kemenangan.value,
      podium: form.podium.value,
      gelar_konstruktor: form.gelar_konstruktor.value
    }
  };
  document.getElementById('inline-add-driver').innerHTML = `
    <form onsubmit="submitInlineDriverTeam(event, ${encodeURIComponent(JSON.stringify(state))})">
      <h4>Tambah Driver Baru</h4>
      <label>Nama:<input name="nama" required></label>
      <label>Nomor Balap:<input name="nomor_balap" required></label>
      <label>Negara:<input name="negara" required></label>
      <div class="modal-actions">
        <button type="submit" class="crud-btn">Tambah</button>
      </div>
    </form>
  `;
}

function submitInlineDriverTeam(e, stateStr) {
  e.preventDefault();
  const f = e.target;
  const state = JSON.parse(decodeURIComponent(stateStr));
  const data = {
    nama: f.nama.value,
    nomor_balap: f.nomor_balap.value,
    negara: f.negara.value,
    team: '',
    statistik: {kemenangan:0,podium:0,pole_position:0}
  };
  drivers.push(data);
  // Tambahkan driver baru ke daftar_driver yang sedang dipilih
  if (!state.daftar_driver.includes(data.nama)) state.daftar_driver.push(data.nama);
  renderDrivers();
  addTeamForm(null, state); // buka ulang form dengan state yang sudah diisi dan driver baru terpilih
}
function submitTeam(e, idx) {
  e.preventDefault();
  const form = e.target;
  try {
    if (!validateForm(form)) {
      hideFormLoading(form);
      return false;
    }
    showFormLoading(form);
    // Proses langsung tanpa delay
    const f = e.target;
    const data = {
      nama: f.nama.value,
      negara: f.negara.value,
      logo: f.logo.value || '',
      driver1: f.driver1.value,
      driver2: f.driver2.value,
      kemenangan: Number(f.kemenangan.value||0),
      podium: Number(f.podium.value||0),
      gelar: Number(f.gelar.value||0)
    };
    if (!data.nama || !data.negara) {
      alert('Nama dan Negara wajib diisi!');
      hideFormLoading(form);
      return false;
    }
    if (idx === null) teams.push(data);
    else teams[idx] = data;
    saveAllToLocal();
    hideFormLoading(form);
    showFormSuccess(form);
    closeModal();
    renderTeams();
    renderDrivers(); // pastikan driver juga update
  } catch (err) {
    hideFormLoading(form);
    alert('Terjadi error saat menyimpan data team: ' + err);
    console.error('Error submitTeam:', err);
  }
}
function editTeam(idx) { addTeamForm(idx); }
function deleteTeam(idx) {
  if (confirm('Hapus team ini?')) {
    teams.splice(idx,1);
    saveAllToLocal();
    renderTeams();
    renderDrivers();
  }
}
document.getElementById('add-team-btn').onclick = () => addTeamForm();

// --- CRUD WDC ---
function renderWDC() {
  console.log('renderWDC() - wdc:', wdc);
  const el = document.getElementById('wdc-list');
  if (!wdc || wdc.length === 0) {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Belum ada data WDC.</div>';
    return;
  }
  // Urutkan berdasarkan tahun menurun
  const sortedWdc = [...wdc].map((item, idx) => ({item, idx})).sort((a, b) => b.item.tahun - a.item.tahun);
  wdcIndexMap = sortedWdc.map(obj => obj.idx);
  el.innerHTML = sortedWdc.map(({item}, i) => `
    <div class="card champion-card">
      <div class="champion-header">
        <div class="champion-year">${item.tahun}</div>
        ${item.foto ? `<div class="champion-photo"><img src="${item.foto}" alt="${item.driver}" onerror="this.style.display='none'"></div>` : '<div class="champion-photo-placeholder"><i class="champion-icon">🏆</i></div>'}
      </div>
      <div class="champion-info">
        <div class="champion-name">${item.driver}</div>
        <div class="champion-team">${item.team}</div>
        <div class="champion-badges">
          <span class="wdc-badge driver">World Driver Champion</span>
        </div>
      </div>
      <div class="champion-actions">
        <button class="crud-action edit" onclick="editWDC(${i})">Edit</button>
        <button class="crud-action delete" onclick="deleteWDC(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}
function addWDCForm(editIdx = null) {
  const item = editIdx !== null ? wdc[editIdx] : {tahun:'', driver:'', team:'', foto:''};
  const driverOptions = drivers.map(d => `<option value="${d.nama}"${item.driver===d.nama?' selected':''}>${d.nama} #${d.nomor_balap||'-'}</option>`).join('');
  const teamOptions = teams.map(t => `<option value="${t.nama}"${item.team===t.nama?' selected':''}>${t.nama}</option>`).join('');
  
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} World Driver Champion</h3>
    <form onsubmit="submitWDC(event,${editIdx!==null?editIdx:'null'})">
      <div class="form-group">
        <label class="required">Tahun</label>
        <input name="tahun" type="number" value="${item.tahun}" required placeholder="Contoh: 2024" min="1950" max="2030">
        <div class="error-message"></div>
      </div>
      
      <div class="form-grid">
        <div class="form-group">
          <label class="required">Driver</label>
          <select name="driver" required>
            <option value="">Pilih Driver</option>
            ${driverOptions}
          </select>
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label class="required">Team</label>
          <select name="team" required>
            <option value="">Pilih Team</option>
            ${teamOptions}
          </select>
          <div class="error-message"></div>
        </div>
      </div>
      
      <div class="form-group">
        <label>Foto Driver (URL)</label>
        <input name="foto" type="url" value="${item.foto || ''}" placeholder="https://example.com/driver-photo.jpg">
        <div class="error-message"></div>
        <small style="color:#666;font-size:0.85rem;">Opsional: Masukkan URL foto driver champion</small>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
        <button type="submit" class="crud-btn">${editIdx!==null?'Update':'Simpan'} WDC</button>
      </div>
    </form>
  `);
}
function submitWDC(e, idx) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) {
    return false;
  }
  const f = form;
  let foto = f.foto.value;
  if (!foto) {
    // Ambil otomatis dari data drivers
    const driver = drivers.find(d => d.nama === f.driver.value);
    if (driver && driver.foto) foto = driver.foto;
  }
  const data = {
    tahun: Number(f.tahun.value),
    driver: f.driver.value,
    team: f.team.value,
    foto
  };
  if (idx === null) wdc.push(data);
  else wdc[idx] = data;
  saveAllToLocal();
  hideFormLoading(form);
  showFormSuccess(form);
  updateGelarFromWDCWCC();
  setTimeout(() => {
    closeModal();
    renderWDC();
    renderDrivers();
    renderTeams();
  }, 300);
}
function editWDC(idx) { addWDCForm(idx); }
function deleteWDC(idx) {
  if (confirm('Hapus data ini?')) {
    wdc.splice(idx,1);
    saveAllToLocal();
    updateGelarFromWDCWCC();
    renderWDC();
    renderDrivers();
    renderTeams();
  }
}
document.getElementById('add-wdc-btn').onclick = () => addWDCForm();

// --- CRUD WCC ---
function renderWCC() {
  console.log('renderWCC() - wcc:', wcc);
  const el = document.getElementById('wcc-list');
  if (!wcc || wcc.length === 0) {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Belum ada data WCC.</div>';
    return;
  }
  // Urutkan berdasarkan tahun menurun
  const sortedWcc = [...wcc].map((item, idx) => ({item, idx})).sort((a, b) => b.item.tahun - a.item.tahun);
  wccIndexMap = sortedWcc.map(obj => obj.idx);
  el.innerHTML = sortedWcc.map(({item}, i) => `
    <div class="card champion-card">
      <div class="champion-header">
        <div class="champion-year">${item.tahun}</div>
        ${item.foto ? `<div class="champion-photo"><img src="${item.foto}" alt="${item.team}" class="champion-logo" onerror="this.style.display='none'"></div>` : '<div class="champion-photo-placeholder"><i class="champion-icon">🏁</i></div>'}
      </div>
      <div class="champion-info">
        <div class="champion-name">${item.team}</div>
        <div class="champion-badges">
          <span class="wcc-badge team">World Constructor Champion</span>
        </div>
      </div>
      <div class="champion-actions">
        <button class="crud-action edit" onclick="editWCC(${i})">Edit</button>
        <button class="crud-action delete" onclick="deleteWCC(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}
function addWCCForm(editIdx = null) {
  const wccItem = editIdx !== null ? wcc[editIdx] : {tahun:'', team:'', foto:''};
  const teamOptions = teams.map(t => `<option value="${t.nama}"${wccItem.team===t.nama?' selected':''}>${t.nama}</option>`).join('');
  
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} World Constructor Champion</h3>
    <form onsubmit="submitWCC(event,${editIdx!==null?editIdx:'null'})">
      <div class="form-group">
        <label class="required">Tahun</label>
        <input name="tahun" type="number" value="${wccItem.tahun}" required placeholder="Contoh: 2024" min="1950" max="2030">
        <div class="error-message"></div>
      </div>
      
      <div class="form-group">
        <label class="required">Team</label>
        <select name="team" required>
          <option value="">Pilih Team</option>
          ${teamOptions}
        </select>
        <div class="error-message"></div>
      </div>
      
      <div class="form-group">
        <label>Foto Team (URL)</label>
        <input name="foto" type="url" value="${wccItem.foto || ''}" placeholder="https://example.com/team-photo.jpg">
        <div class="error-message"></div>
        <small style="color:#666;font-size:0.85rem;">Opsional: Masukkan URL foto team champion</small>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
        <button type="submit" class="crud-btn">${editIdx!==null?'Update':'Simpan'} WCC</button>
      </div>
    </form>
  `);
}
function submitWCC(e, idx) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) {
    return false;
  }
  const f = form;
  let foto = f.foto.value;
  if (!foto) {
    // Ambil otomatis dari data teams
    const team = teams.find(t => t.nama === f.team.value);
    if (team && team.logo) foto = team.logo;
  }
  const data = {
    tahun: Number(f.tahun.value),
    team: f.team.value,
    foto
  };
  if (idx === null) wcc.push(data);
  else wcc[idx] = data;
  saveAllToLocal();
  hideFormLoading(form);
  showFormSuccess(form);
  updateGelarFromWDCWCC();
  setTimeout(() => {
    closeModal();
    renderWCC();
    renderTeams();
  }, 300);
}
function editWCC(idx) { addWCCForm(idx); }
function deleteWCC(idx) {
  if (confirm('Hapus data ini?')) {
    wcc.splice(idx,1);
    saveAllToLocal();
    updateGelarFromWDCWCC();
    renderWCC();
    renderTeams();
  }
}
document.getElementById('add-wcc-btn').onclick = () => addWCCForm();

// --- GRAND PRIX ---
let grandPrixIndexMap = [];
function renderGrandPrix(filterTahun = null) {
  const el = document.getElementById('grandsprix-list');
  // Jika filter tahun kosong, tampilkan pesan saja
  if (!filterTahun || filterTahun === "") {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Pilih tahun untuk melihat Grand Prix.</div>';
    grandPrixIndexMap = [];
    return;
  }
  let data = grandsprix;
  grandPrixIndexMap = [];
  if (filterTahun && filterTahun !== '') {
    data = grandsprix.map((gp, idx) => ({gp, idx})).filter(obj => String(obj.gp.tahun) === String(filterTahun));
    grandPrixIndexMap = data.map(obj => obj.idx);
    data = data.map(obj => obj.gp);
  } else {
    grandPrixIndexMap = grandsprix.map((_, idx) => idx);
  }
  if (!data || data.length === 0) {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Belum ada data Grand Prix.</div>';
    return;
  }
  // Mapping bendera negara GP (manual, contoh)
  const gpFlagMap = {
    'Australian Grand Prix': 'au',
    'Australia Grand Prix': 'au',
    'Chinese Grand Prix': 'cn',
    'China Grand Prix': 'cn',
    'Japanese Grand Prix': 'jp',
    'Japan Grand Prix': 'jp',
    'Bahrain Grand Prix': 'bh',
    'Saudi Arabian Grand Prix': 'sa',
    'Saudi Arabia Grand Prix': 'sa',
    'Miami Grand Prix': 'us',
    'Emilia Romagna Grand Prix': 'it',
    'Italy Grand Prix': 'it',
    'Italian Grand Prix': 'it',
    'Monaco Grand Prix': 'mc',
    'Spanish Grand Prix': 'es',
    'Spain Grand Prix': 'es',
    'Canadian Grand Prix': 'ca',
    'Canada Grand Prix': 'ca',
    'Austrian Grand Prix': 'at',
    'Austria Grand Prix': 'at',
    'British Grand Prix': 'gb',
    'United Kingdom Grand Prix': 'gb',
    'Belgian Grand Prix': 'be',
    'Belgium Grand Prix': 'be',
    'Hungarian Grand Prix': 'hu',
    'Hungary Grand Prix': 'hu',
    'Dutch Grand Prix': 'nl',
    'Netherlands Grand Prix': 'nl',
    'Azerbaijan Grand Prix': 'az',
    'Singapore Grand Prix': 'sg',
    'United States Grand Prix': 'us',
    'Americas Grand Prix': 'us',
    'Mexican Grand Prix': 'mx',
    'Mexico Grand Prix': 'mx',
    'Brazilian Grand Prix': 'br',
    'Brazil Grand Prix': 'br',
    'Qatar Grand Prix': 'qa',
    'Abu Dhabi Grand Prix': 'ae',
    'Las Vegas Grand Prix': 'us',
    // Tambahan
    'Turkish Grand Prix': 'tr',
    'Turkey Grand Prix': 'tr',
    'Portugese Grand Prix': 'pt',
    'Portugal Grand Prix': 'pt',
    'German Grand Prix': 'de',
    'Germany Grand Prix': 'de',
    'Russian Grand Prix': 'ru',
    'Russia Grand Prix': 'ru',
    'Malaysian Grand Prix': 'my',
    'Malaysia Grand Prix': 'my',
    'French Grand Prix': 'fr',
    'France Grand Prix': 'fr',
    'Tuscany Grand Prix': 'it',
  };
  // Mapping gambar sirkuit (jika ada)
  const circuitImgMap = {
    'Miami Grand Prix': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Miami_GP_Circuit_2022.png',
    'Monaco Grand Prix': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Monte_Carlo_Formula_1_track_map.png',
    // tambahkan sesuai kebutuhan
  };
  function getDriverInfo(name) {
    if (!name) return {nama: '-', foto: ''};
    const d = drivers.find(dr => dr.nama === name);
    return d ? {nama: d.nama, foto: d.foto} : {nama: name, foto: ''};
  }
  el.innerHTML = data.map((gp, i) => {
    const flag = gpFlagMap[gp.nama] ? `<img class='gp-flag' src='https://flagcdn.com/32x24/${gpFlagMap[gp.nama]}.png' alt='flag'>` : '';
    const yearBadge = `<span class='gp-year-badge'>${gp.tahun}</span>`;
    // const circuitImg = circuitImgMap[gp.nama] ? `<img class='gp-circuit-img' src='${circuitImgMap[gp.nama]}' alt='circuit'>` : '';
    // Ganti circuitImg dengan hashtag otomatis
    const hashtag = `<div class='gp-hashtag'>#${gp.nama.toLowerCase().replace(/ grand prix/i,'gp').replace(/\s+/g,'')}</div>`;
    // Pemenang
    const winner = getDriverInfo(gp.pemenang);
    const winnerPhoto = winner.foto ? `<img class='gp-winner-photo' src='${winner.foto}' alt='${winner.nama}'>` : '';
    // Podium
    const podium = (gp.podium||[]).slice(0,3).map((name, idx) => {
      const info = getDriverInfo(name);
      const emoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
      const photo = info.foto ? `<img class='gp-podium-photo' src='${info.foto}' alt='${info.nama}'>` : '';
      return `<span class='gp-podium-badge'>${emoji} ${photo}<span>${info.nama}</span></span>`;
    }).join(' ');
    return `
      <div class="card gp-card">
        <div class="gp-card-header">
          <div class="gp-header-flag">${flag}</div>
          <div class="gp-round">Round ${i+1}</div>
          <div class="gp-header-title">${gp.nama}</div>
          <div class="gp-header-year">${yearBadge}</div>
        </div>
        ${hashtag}
        <div class="gp-winner-row">🏆 ${winnerPhoto}<span class='gp-winner-name'>${winner.nama}</span></div>
        <div class="gp-podium-row">${podium}</div>
        <div class="gp-actions-row">
        <button class="crud-action edit" onclick="editGrandPrix(${i})">Edit</button>
        <button class="crud-action delete" onclick="deleteGrandPrix(${i})">Hapus</button>
      </div>
    </div>
    `;
  }).join('');
}

function updateGrandPrixYearFilterOptions() {
  const select = document.getElementById('filter-gp-tahun');
  if (!select) return;
  // Ambil semua tahun unik dari grandsprix
  const tahunSet = new Set(grandsprix.map(gp => gp.tahun));
  const tahunArr = Array.from(tahunSet).sort((a,b)=>b-a);
  select.innerHTML = '<option value="">Pilih Tahun</option>' + tahunArr.map(t => `<option value="${t}">${t}</option>`).join('');
}

function addGrandPrixForm(editIdx = null) {
  const gp = editIdx !== null ? grandsprix[editIdx] : {nama:'', tahun:'', pemenang:'', podium:[]};
  // Dropdown podium
  function podiumDropdown(selected, excludeList, podiumIdx) {
    return `<select name="podium${podiumIdx+1}" required>
      <option value="">Pilih Pembalap</option>
      ${drivers.filter(d => !excludeList.includes(d.nama) || d.nama === selected).map(d => `<option value='${d.nama}'${selected===d.nama?' selected':''}>${d.nama} #${d.nomor_balap||'-'}</option>`).join('')}
    </select>`;
  }
  const podium1 = gp.podium?.[0] || '';
  const podium2 = gp.podium?.[1] || '';
  const podium3 = gp.podium?.[2] || '';
  // Exclude yang sudah dipilih di podium sebelumnya
  const podium1List = [];
  const podium2List = [podium1].filter(Boolean);
  const podium3List = [podium1, podium2].filter(Boolean);
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} Grand Prix</h3>
    <form id="gp-form" onsubmit="submitGrandPrix(event,${editIdx!==null?editIdx:'null'})">
      <div class="form-grid">
        <div class="form-group">
          <label class="required">Nama Grand Prix</label>
          <input name="nama" value="${gp.nama}" required placeholder="Contoh: Monaco Grand Prix">
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label class="required">Tahun</label>
          <input name="tahun" type="number" value="${gp.tahun}" required placeholder="Contoh: 2024" min="1950" max="2030">
          <div class="error-message"></div>
        </div>
      </div>
      <div class="form-group">
        <label class="required">Pemenang</label>
        <select name="pemenang" required>
          <option value="">Pilih Pemenang</option>
          ${drivers.map(d => `<option value='${d.nama}'${gp.pemenang===d.nama?' selected':''}>${d.nama} #${d.nomor_balap||'-'}</option>`).join('')}
        </select>
        <div class="error-message"></div>
      </div>
      <div class="form-group">
        <label class="required">Podium 1</label>
        ${podiumDropdown(podium1, podium1List, 0)}
        <label class="required">Podium 2</label>
        ${podiumDropdown(podium2, podium2List, 1)}
        <label class="required">Podium 3</label>
        ${podiumDropdown(podium3, podium3List, 2)}
        <div class="error-message" id="gp-podium-error"></div>
      </div>
      <div class="modal-actions">
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
        <button type="submit" class="crud-btn">${editIdx!==null?'Update':'Simpan'} Grand Prix</button>
      </div>
    </form>
  `);
  // Tambahkan event listener untuk update dropdown agar tidak dobel
  const form = document.getElementById('gp-form');
  function updateDropdowns() {
    const p1 = form.podium1.value;
    const p2 = form.podium2.value;
    // Update podium2
    form.podium2.innerHTML = `<option value="">Pilih Pembalap</option>` +
      drivers.filter(d => ![p1].includes(d.nama) || d.nama === p2).map(d => `<option value='${d.nama}'${p2===d.nama?' selected':''}>${d.nama} #${d.nomor_balap||'-'}</option>`).join('');
    // Update podium3
    const p3 = form.podium3.value;
    form.podium3.innerHTML = `<option value="">Pilih Pembalap</option>` +
      drivers.filter(d => ![p1,p2].includes(d.nama) || d.nama === p3).map(d => `<option value='${d.nama}'${p3===d.nama?' selected':''}>${d.nama} #${d.nomor_balap||'-'}</option>`).join('');
  }
  form.podium1.addEventListener('change', updateDropdowns);
  form.podium2.addEventListener('change', updateDropdowns);
}

// Update statistik driver dan team dari data Grand Prix
function updateStatsFromGrandPrix() {
  // Pastikan semua driver yang muncul di Grand Prix ada di drivers
  grandsprix.forEach(gp => {
    [gp.pemenang, ...(gp.podium||[])].forEach(driverName => {
      if (driverName && !drivers.find(d => d.nama === driverName)) {
        drivers.push({nama: driverName, nomor_balap: '', negara: '', team: '', kemenangan: 0, podium: 0, gelar: 0, foto: ''});
      }
    });
  });
  // Reset statistik
  drivers.forEach(d => { d.kemenangan = 0; d.podium = 0; });
  teams.forEach(t => {
    t.kemenangan = 0; t.podium = 0; t.gelar = t.gelar || 0;
    if (t.statistik) {
      t.statistik.kemenangan = 0;
      t.statistik.podium = 0;
      t.statistik.gelar_konstruktor = t.statistik.gelar_konstruktor || 0;
    }
  });
  // Helper: cari team dari nama driver
  function getTeamOfDriver(driverName) {
    const d = drivers.find(dr => dr.nama === driverName);
    return d ? d.team : null;
  }
  // Helper: cari team dengan nama toleran
  function findTeamByName(name) {
    if (!name) return null;
    const norm = n => n.toLowerCase().trim();
    return teams.find(t => norm(t.nama) === norm(name));
  }
  grandsprix.forEach(gp => {
    // Pemenang (juara 1)
    const winner = gp.pemenang;
    const winnerDriver = drivers.find(d => d.nama === winner);
    if (winnerDriver) winnerDriver.kemenangan++;
    const winnerTeamName = getTeamOfDriver(winner);
    const winnerTeam = findTeamByName(winnerTeamName);
    if (winnerTeam) {
      winnerTeam.kemenangan++;
      if (winnerTeam.statistik) winnerTeam.statistik.kemenangan++;
    } else if (winnerTeamName) console.warn('Team tidak ditemukan untuk pemenang:', winnerTeamName);
    // Podium 1,2,3
    (gp.podium||[]).slice(0,3).forEach(driverName => {
      const drv = drivers.find(d => d.nama === driverName);
      if (drv) drv.podium++;
      const teamName = getTeamOfDriver(driverName);
      const team = findTeamByName(teamName);
      if (team) {
        team.podium++;
        if (team.statistik) team.statistik.podium++;
      } else if (teamName) console.warn('Team tidak ditemukan untuk podium:', teamName);
    });
  });
  saveAllToLocal();
  renderDrivers();
  renderTeams();
  updateGelarFromWDCWCC();
}

function updateGelarFromWDCWCC() {
  // Reset gelar pada drivers dan teams
  drivers.forEach(d => { d.gelar = 0; });
  teams.forEach(t => { t.gelar = 0; if (t.statistik) t.statistik.gelar_konstruktor = 0; });
  // Tambah gelar dari WDC
  wdc.forEach(w => {
    const driver = drivers.find(d => d.nama === w.driver);
    if (driver) driver.gelar = (driver.gelar || 0) + 1;
  });
  // Tambah gelar dari WCC
  wcc.forEach(w => {
    // Cari team dengan nama toleran
    const norm = n => n.toLowerCase().trim();
    const team = teams.find(t => norm(t.nama) === norm(w.team));
    if (team) {
      team.gelar = (team.gelar || 0) + 1;
      if (team.statistik) team.statistik.gelar_konstruktor = (team.statistik.gelar_konstruktor || 0) + 1;
    }
  });
}

function submitGrandPrix(e, idx) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) {
    return false;
  }
  // Ambil podium dari dropdown
  const podium = [form.podium1.value, form.podium2.value, form.podium3.value];
  if (new Set(podium).size < 3 || podium.includes('')) {
    document.getElementById('gp-podium-error').textContent = `Pilih 3 pembalap berbeda untuk podium!`;
    document.getElementById('gp-podium-error').classList.add('show');
    return false;
  }
  // Pastikan podium[0] = pemenang
  const winner = form.pemenang.value;
  if (podium[0] !== winner) {
    const idxWinner = podium.indexOf(winner);
    if (idxWinner !== -1) {
      podium.splice(idxWinner, 1);
    podium.unshift(winner);
    } else {
      podium[0] = winner;
    }
  }
  showFormLoading(form);
  setTimeout(() => {
    const f = e.target;
  const data = {
    nama: f.nama.value,
    tahun: Number(f.tahun.value),
    pemenang: f.pemenang.value,
    podium
  };
  if (idx === null) grandsprix.push(data);
  else grandsprix[idx] = data;
  saveAllToLocal();
  updateStatsFromGrandPrix();
    hideFormLoading(form);
    showFormSuccess(form);
    setTimeout(() => {
  closeModal();
  // Re-render dengan filter yang sedang aktif
  const currentFilter = document.getElementById('filter-gp-tahun')?.value || '';
  renderGrandPrix(currentFilter);
  updateGrandPrixYearFilterOptions();
    }, 300);
  }, 500);
}
function editGrandPrix(idx) { 
  addGrandPrixForm(idx); 
}

function editGrandPrixFiltered(filteredIdx) {
  const tahunFilter = document.getElementById('filter-gp-tahun')?.value || '';
  let filtered = grandsprix;
  if (tahunFilter && tahunFilter !== '') {
    filtered = grandsprix.filter(gp => String(gp.tahun) === String(tahunFilter));
  }
  const entry = filtered[filteredIdx];
  if (!entry) return;
  
  // Cari index asli di array utama
  const idx = grandsprix.findIndex(gp => gp.nama === entry.nama && String(gp.tahun) === String(entry.tahun));
  if (idx !== -1) {
    addGrandPrixForm(idx);
  }
}

function deleteGrandPrix(idx) { 
  if (confirm('Hapus Grand Prix ini?')) {
    grandsprix.splice(idx,1);
    saveAllToLocal();
    updateStatsFromGrandPrix();
    renderGrandPrix();
    updateGrandPrixYearFilterOptions();
  }
}

function deleteGrandPrixFiltered(filteredIdx) {
  const tahunFilter = document.getElementById('filter-gp-tahun')?.value || '';
  let filtered = grandsprix;
  if (tahunFilter && tahunFilter !== '') {
    filtered = grandsprix.filter(gp => String(gp.tahun) === String(tahunFilter));
  }
  const entry = filtered[filteredIdx];
  if (!entry) return;
  
  if (confirm('Hapus Grand Prix ini?')) {
    // Cari index asli di array utama
    const idx = grandsprix.findIndex(gp => gp.nama === entry.nama && String(gp.tahun) === String(entry.tahun));
    if (idx !== -1) {
      grandsprix.splice(idx, 1);
      saveAllToLocal();
      updateStatsFromGrandPrix();
      // Re-render dengan filter yang sedang aktif
      renderGrandPrix(tahunFilter);
      updateGrandPrixYearFilterOptions();
    }
  }
}
document.getElementById('add-gp-btn').onclick = () => addGrandPrixForm();

// --- CRUD STANDINGS ---
function renderDriversStandings() {
  const el = document.getElementById('standings-list');
  if (!driversStandings || driversStandings.length === 0) {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Belum ada data standings.</div>';
    updateStandingsYearFilter();
    return;
  }
  // Ambil tahun filter (wajib pilih tahun)
  updateStandingsYearFilter();
  const tahunFilter = document.getElementById('filter-standings-tahun')?.value || '';
  if (!tahunFilter) {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Pilih tahun untuk melihat standings.</div>';
    return;
  }
  // Filter data
  let filtered = driversStandings.filter(s => String(s.tahun) === String(tahunFilter));
  // Urutkan berdasarkan point menurun
  const sorted = [...filtered].sort((a, b) => b.point - a.point);
  el.innerHTML = sorted.map((s, i) => {
    // Ambil data driver dari drivers
    const d = drivers.find(dr => dr.nama === s.nama) || {};
    const nama = d.nama || s.nama;
    const nomor_balap = d.nomor_balap || s.nomor_balap || '';
    const negara = d.negara || s.negara || '';
    const team = d.team || s.team || '';
    const foto = d.foto || s.foto || '';
    const flagImg = countryFlagMap[negara] ? `<img class='driver-flag-inline' src=\"https://flagcdn.com/40x30/${countryFlagMap[negara]}.png\" alt=\"${negara}\">` : '';
    // Badge tahun
    const tahunBadge = s.tahun ? `<span class='standings-tahun-badge'>${s.tahun}</span>` : '';
    return `
      <div class=\"card driver-card driver-flex-card\">
        <div class=\"driver-photo-col\">
          <div class=\"driver-photo-wrap\">
            ${foto ? `<img class=\"driver-photo\" src=\"${foto}\" alt=\"${nama}\" onerror=\"this.style.display='none'\">` : '<div class=\"driver-photo-placeholder\"><i class=\"driver-icon\">🏁</i></div>'}
          </div>
        </div>
        <div class=\"driver-info-col\">
          <div class=\"driver-name-row\">
            ${flagImg}
            <span class=\"driver-name\">${nama}</span> <span class=\"driver-num\">#${nomor_balap}</span> ${tahunBadge}
          </div>
          <div class=\"driver-team\">${team ? `<span>${team}</span>` : '-'}</div>
          <div class=\"driver-standings-point-row\">
            <span class=\"standings-point-badge\">
              <i class=\"fas fa-trophy\"></i>
              <span class=\"standings-point-value\">${s.point||0}</span>
              <span class=\"standings-point-label\">POINTS</span>
            </span>
          </div>
          <div class=\"driver-actions\">
          <button class=\"crud-action edit\" onclick=\"editStandingsFiltered(${i})\">Edit</button>
          <button class=\"crud-action delete\" onclick=\"deleteStandingsFiltered(${i})\">Hapus</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
function addStandingsForm(editIdx = null, prefill = {}) {
  const item = editIdx !== null ? driversStandings[editIdx] : {nama:'', point:0, tahun:''};
  const driverOptions = drivers.map(d => `<option value="${d.nama}"${item.nama===d.nama?' selected':''}>${d.nama} #${d.nomor_balap||''}</option>`).join('');
  // Tahun: jika edit, pakai tahun data, jika tambah, default tahun terbaru di data atau tahun sekarang
  let tahunDefault = item.tahun || (driversStandings.length > 0 ? (Math.max(...driversStandings.map(s=>Number(s.tahun)||0))||new Date().getFullYear()) : new Date().getFullYear());
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} Standings</h3>
    <form id="standings-form" onsubmit="submitStandings(event,${editIdx!==null?editIdx:'null'})">
      <div class="form-group">
        <label class="required">Tahun</label>
        <input name="tahun" type="number" min="1950" max="2100" value="${tahunDefault}" required placeholder="Contoh: 2025">
        <div class="error-message"></div>
      </div>
      <div class="form-group">
        <label class="required">Nama</label>
        <select name="nama" id="standings-nama" required>
          <option value="">Pilih Driver</option>
          ${driverOptions}
        </select>
        <div class="error-message"></div>
      </div>
      <div class="form-group">
        <label class="required">Point</label>
        <input name="point" type="number" value="${item.point||0}" min="0" required>
        <div class="error-message"></div>
      </div>
      <div class="modal-actions">
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
        <button type="submit" class="crud-btn">${editIdx!==null?'Update':'Simpan'} Standings</button>
      </div>
    </form>
  `);
}
// --- Filtering & Render Standings ---
function updateStandingsYearFilter() {
  const select = document.getElementById('filter-standings-tahun');
  if (!select) return;
  const tahunList = Array.from(new Set(driversStandings.map(s => s.tahun).filter(Boolean))).sort((a,b)=>b-a);
  const current = select.value;
  select.innerHTML = tahunList.map(t => `<option value="${t}">${t}</option>`).join('');
  // Pilih tahun terbaru jika belum ada yang dipilih
  if (!tahunList.includes(current)) {
    select.value = tahunList[0] || '';
  } else {
    select.value = current;
  }
}
// Event listener filter tahun
const filterTahunSelect = document.getElementById('filter-standings-tahun');
if (filterTahunSelect) {
  filterTahunSelect.addEventListener('change', renderDriversStandings);
}
function submitStandings(e, idx) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) {
    return false;
  }
  showFormLoading(form);
  const f = e.target;
  const data = {
    nama: f.nama.value,
    point: Number(f.point.value||0),
    tahun: f.tahun.value
  };
  if (idx === null) driversStandings.push(data);
  else driversStandings[idx] = data;
  saveAllToLocal();
  hideFormLoading(form);
  showFormSuccess(form);
  closeModal();
  renderDriversStandings();
}
function editStandingsFiltered(filteredIdx) {
  const tahunFilter = document.getElementById('filter-standings-tahun')?.value || '';
  let filtered = driversStandings;
  if (tahunFilter) filtered = filtered.filter(s => String(s.tahun) === String(tahunFilter));
  filtered = [...filtered].sort((a, b) => b.point - a.point);
  const entry = filtered[filteredIdx];
  if (!entry) return;
  // Cari index asli di array utama
  const idx = driversStandings.findIndex(s => s.nama === entry.nama && String(s.tahun) === String(entry.tahun));
  if (idx !== -1) addStandingsForm(idx);
}
// Fungsi hapus/edit berdasarkan index data yang sudah difilter
function deleteStandingsFiltered(filteredIdx) {
  const tahunFilter = document.getElementById('filter-standings-tahun')?.value || '';
  let filtered = driversStandings;
  if (tahunFilter) filtered = filtered.filter(s => String(s.tahun) === String(tahunFilter));
  // Urutkan sama seperti render
  filtered = [...filtered].sort((a, b) => b.point - a.point);
  const entry = filtered[filteredIdx];
  if (!entry) return;
  if (confirm('Hapus standings ini?')) {
    // Cari index asli di array utama
    const idx = driversStandings.findIndex(s => s.nama === entry.nama && String(s.tahun) === String(entry.tahun));
    if (idx !== -1) {
      driversStandings.splice(idx,1);
      saveAllToLocal();
      renderDriversStandings();
    }
  }
}

// --- NAVBAR SECTION SWITCHER ---
const navLinks = [
  {id: 'nav-drivers', section: 'drivers'},
  {id: 'nav-drivers-standings', section: 'drivers-standings'},
  {id: 'nav-teams', section: 'teams'},
  {id: 'nav-grandsprix', section: 'grandsprix'},
  {id: 'nav-wdc', section: 'wdc'},
  {id: 'nav-wcc', section: 'wcc'}
];
function showSection(sectionId) {
  document.querySelectorAll('.f1-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  navLinks.forEach(link => {
    const nav = document.getElementById(link.id);
    if (link.section === sectionId) nav.classList.add('active');
    else nav.classList.remove('active');
  });
}
navLinks.forEach(link => {
  document.getElementById(link.id).onclick = function(e) {
    e.preventDefault();
    showSection(link.section);
  };
});
// Tampilkan section pertama secara default
showSection('drivers');

// --- EVENT DELEGATION UNTUK EDIT/DELETE ---
function setupCrudDelegation() {
  // DRIVERS
  document.getElementById('drivers-list').onclick = function(e) {
    if (e.target.classList.contains('edit')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      editDriver(idx);
    } else if (e.target.classList.contains('delete')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      deleteDriver(idx);
    }
  };
  // TEAMS
  document.getElementById('teams-list').onclick = function(e) {
    if (e.target.classList.contains('edit')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      editTeam(idx);
    } else if (e.target.classList.contains('delete')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      deleteTeam(idx);
    }
  };
  // WDC
  document.getElementById('wdc-list').onclick = function(e) {
    if (e.target.classList.contains('edit')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      editWDC(wdcIndexMap[idx]);
    } else if (e.target.classList.contains('delete')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      deleteWDC(wdcIndexMap[idx]);
    }
  };
  // WCC
  document.getElementById('wcc-list').onclick = function(e) {
    if (e.target.classList.contains('edit')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      editWCC(wccIndexMap[idx]);
    } else if (e.target.classList.contains('delete')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      deleteWCC(wccIndexMap[idx]);
    }
  };
  // GRAND PRIX
  document.getElementById('grandsprix-list').onclick = function(e) {
    if (e.target.classList.contains('edit')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      editGrandPrixFiltered(idx);
    } else if (e.target.classList.contains('delete')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      deleteGrandPrixFiltered(idx);
    }
  };
  // STANDINGS
  document.getElementById('standings-list').onclick = function(e) {
    if (e.target.classList.contains('edit')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      editStandingsFiltered(idx);
    } else if (e.target.classList.contains('delete')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      deleteStandingsFiltered(idx);
    }
  };
}

// --- RESET DATA ---
function showResetNotification() {
  // Buat notifikasi visual di pojok atas
  let notif = document.createElement('div');
  notif.textContent = 'Data berhasil direset! Data diambil ulang dari file JSON.';
  notif.style.position = 'fixed';
  notif.style.top = '24px';
  notif.style.left = '50%';
  notif.style.transform = 'translateX(-50%)';
  notif.style.background = '#1a237e';
  notif.style.color = '#fff';
  notif.style.padding = '12px 28px';
  notif.style.borderRadius = '8px';
  notif.style.fontSize = '1.05rem';
  notif.style.boxShadow = '0 2px 12px rgba(26,35,126,0.13)';
  notif.style.zIndex = 9999;
  notif.style.opacity = '0.98';
  notif.style.transition = 'opacity 0.4s';
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 600);
  }, 1800);
}

// Ganti handler reset data
const resetBtn = document.getElementById('reset-data-btn');
if (resetBtn) {
  resetBtn.onclick = function() {
    if (confirm('Yakin ingin reset semua data? Data akan diambil ulang dari file JSON.')) {
      localStorage.clear();
      showResetNotification();
      setTimeout(() => {
        location.reload();
      }, 1200);
    }
  };
}

// --- INIT LOAD ---
async function loadData() {
  // Cek apakah LocalStorage sudah ada data
  // Jika tidak ada, ambil dari file JSON dan simpan ke LocalStorage
  const hasLocal = localStorage.getItem('f1_drivers') || localStorage.getItem('f1_teams') || localStorage.getItem('f1_grandsprix') || localStorage.getItem('f1_wdc') || localStorage.getItem('f1_wcc') || localStorage.getItem('f1_drivers_standings');
  if (hasLocal) {
    loadAllFromLocal();
    console.log('Data diambil dari LocalStorage:', localStorage.getItem('f1_drivers'));
  } else {
    drivers = await (await fetch('data/drivers.json')).json();
    drivers.forEach(d=>{if(!('nomor_balap' in d))d.nomor_balap='';});
    teams = await (await fetch('data/teams.json')).json();
    wdc = await (await fetch('data/wdc.json')).json();
    wcc = await (await fetch('data/wcc.json')).json();
    grandsprix = await (await fetch('data/grandsprix.json')).json();
    driversStandings = await (await fetch('data/standings.json')).json();
    saveAllToLocal();
    console.log('Data diambil dari file JSON dan disimpan ke LocalStorage');
  }
  updateStatsFromGrandPrix();
  renderDrivers();
  renderTeams();
  renderWDC();
  renderWCC();
  renderGrandPrix(null);
  renderDriversStandings();
  updateGrandPrixYearFilterOptions && updateGrandPrixYearFilterOptions();
  updateGelarFromWDCWCC();
}
document.addEventListener('DOMContentLoaded', () => {
loadData();
setupCrudDelegation();
const tahunSelect = document.getElementById('filter-gp-tahun');
if (tahunSelect) {
  tahunSelect.addEventListener('change', function() {
    renderGrandPrix(this.value);
  });
}
}); 

document.getElementById('add-standings-btn').onclick = () => addStandingsForm();