// --- DATA STATE ---
let drivers = [];
let teams = [];
let wdc = [];
let wcc = [];
let grandsprix = [];

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
  console.log('Data drivers disimpan:', drivers);
  console.log('Data teams disimpan:', teams);
}
function loadAllFromLocal() {
  drivers = JSON.parse(localStorage.getItem('f1_drivers')||'null') || [];
  teams = JSON.parse(localStorage.getItem('f1_teams')||'null') || [];
  grandsprix = JSON.parse(localStorage.getItem('f1_grandsprix')||'null') || [];
  wdc = JSON.parse(localStorage.getItem('f1_wdc')||'null') || [];
  wcc = JSON.parse(localStorage.getItem('f1_wcc')||'null') || [];
  console.log('loadAllFromLocal() - drivers:', drivers);
  console.log('loadAllFromLocal() - teams:', teams);
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
      statistik: {
        kemenangan: Number(f.kemenangan.value),
        podium: Number(f.podium.value),
        pole_position: Number(f.pole_position.value)
      }
    };
    if (idx === null) drivers.push(data);
    else drivers[idx] = data;
    console.log('submitDriver - drivers setelah tambah:', drivers);
    saveAllToLocal();
    hideFormLoading(form);
    showFormSuccess(form);
    setTimeout(() => {
      closeModal();
      renderDrivers();
      renderTeams();
    }, 300);
  }, 500);
}

function renderDrivers() {
  console.log('renderDrivers() - drivers:', drivers);
  const el = document.getElementById('drivers-list');
  if (!drivers || drivers.length === 0) {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Belum ada data driver.</div>';
    return;
  }
  el.innerHTML = drivers.map((d, i) => {
    // Bendera negara
    const flagCode = countryFlagMap[d.negara] || "";
    const flagImg = flagCode
      ? `<img src="https://flagcdn.com/24x18/${flagCode}.png" alt="${d.negara}" style="vertical-align:middle;margin-right:6px;border-radius:2px;">`
      : "";
    // Hapus logo team, hanya tampilkan nama team
    return `
      <div class="card">
        <div class="card-title"><strong>${d.nama}</strong> <span style='color:#888;font-size:0.95em;'>#${d.nomor_balap||'-'}</span></div>
        <div class="card-detail">
          Negara: ${flagImg}${d.negara}<br>
          Team: ${d.team||'-'}<br>
          <span class="stat">Kemenangan: ${d.statistik.kemenangan}, Podium: ${d.statistik.podium}, Pole: ${d.statistik.pole_position}</span><br>
          <button class="crud-action edit" onclick="editDriver(${i})">Edit</button>
          <button class="crud-action delete" onclick="deleteDriver(${i})">Hapus</button>
        </div>
      </div>
    `;
  }).join('');
}

function addDriverForm(editIdx = null, prefill = {}) {
  const d = editIdx !== null ? drivers[editIdx] : {nama:prefill.nama||'', nomor_balap:prefill.nomor_balap||'', negara:prefill.negara||'', team:prefill.team||'', statistik:{kemenangan:'',podium:'',pole_position:''}};
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} Driver</h3>
    <form onsubmit="submitDriver(event,${editIdx!==null?editIdx:'null'})">
      <div class="form-grid">
        <div class="form-group">
          <label class="required">Nama Driver</label>
          <input name="nama" value="${d.nama}" required placeholder="Masukkan nama driver">
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label class="required">Nomor Balap</label>
          <input name="nomor_balap" value="${d.nomor_balap||''}" required placeholder="Contoh: 44" type="number" min="1" max="99">
          <div class="error-message"></div>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="required">Negara</label>
          <input name="negara" value="${d.negara}" required placeholder="Negara asal driver">
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label>Team</label>
          <select name="team">
            <option value="">Pilih Team</option>
            ${teams.map(t => `<option value="${t.nama}"${d.team===t.nama?' selected':''}>${t.nama}</option>`).join('')}
          </select>
          <div class="error-message"></div>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="required">Kemenangan</label>
          <input name="kemenangan" type="number" value="${d.statistik.kemenangan}" required placeholder="0" min="0">
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label class="required">Podium</label>
          <input name="podium" type="number" value="${d.statistik.podium}" required placeholder="0" min="0">
          <div class="error-message"></div>
        </div>
      </div>
      <div class="form-group">
        <label class="required">Pole Position</label>
        <input name="pole_position" type="number" value="${d.statistik.pole_position}" required placeholder="0" min="0">
        <div class="error-message"></div>
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
  console.log('renderTeams() - teams:', teams);
  const el = document.getElementById('teams-list');
  if (!teams || teams.length === 0) {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Belum ada data team.</div>';
    return;
  }
  el.innerHTML = teams.map((t, i) => {
    // Bendera negara
    const flagCode = countryFlagMap[t.negara] || "";
    const flagImg = flagCode
      ? `<img src="https://flagcdn.com/24x18/${flagCode}.png" alt="${t.negara}" style="vertical-align:middle;margin-right:6px;border-radius:2px;">`
      : "";
    return `
      <div class="card">
        <div class="card-title"><strong>${t.nama}</strong></div>
        <div class="card-detail">
          Negara: ${flagImg}${t.negara}<br>
          Driver 1: ${t.driver1 ? t.driver1.nama + ' <span style=\'color:#888\'>#' + t.driver1.nomor_balap + '</span>' : '-'}<br>
          Driver 2: ${t.driver2 ? t.driver2.nama + ' <span style=\'color:#888\'>#' + t.driver2.nomor_balap + '</span>' : '-'}<br>
          <span class="stat">Kemenangan: ${t.statistik.kemenangan}, Podium: ${t.statistik.podium}, Gelar Konstruktor: ${t.statistik.gelar_konstruktor}</span><br>
          <button class="crud-action edit" data-idx="${i}" onclick="editTeam(${i})">Edit</button>
          <button class="crud-action delete" data-idx="${i}" onclick="deleteTeam(${i})">Hapus</button>
        </div>
      </div>
    `;
  }).join('');
}
function addTeamForm(editIdx = null, formState = null) {
  const t = editIdx !== null ? teams[editIdx] : {nama:'', negara:'', daftar_driver:[], statistik:{kemenangan:'',podium:'',gelar_konstruktor:''}, driver1:{nama:'',nomor_balap:''}, driver2:{nama:'',nomor_balap:''}};
  // Gunakan formState jika ada (agar data tetap setelah tambah driver baru)
  const state = formState || t;
  
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} Team</h3>
    <form onsubmit="submitTeam(event,${editIdx!==null?editIdx:'null'})">
      <div class="form-grid">
        <div class="form-group">
          <label class="required">Nama Team</label>
          <input name="nama" value="${state.nama}" required placeholder="Masukkan nama team">
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label class="required">Negara</label>
          <input name="negara" value="${state.negara}" required placeholder="Negara asal team">
          <div class="error-message"></div>
        </div>
      </div>
      
      <div class="form-group">
        <label class="required">Driver 1</label>
        <div class="form-grid">
          <div class="form-group">
            <input name="driver1_nama" placeholder="Nama Driver 1" value="${state.driver1?.nama||''}" required>
            <div class="error-message"></div>
          </div>
          <div class="form-group">
            <input name="driver1_nomor" placeholder="Nomor Balap" value="${state.driver1?.nomor_balap||''}" required type="number" min="1" max="99">
            <div class="error-message"></div>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <label class="required">Driver 2</label>
        <div class="form-grid">
          <div class="form-group">
            <input name="driver2_nama" placeholder="Nama Driver 2" value="${state.driver2?.nama||''}" required>
            <div class="error-message"></div>
          </div>
          <div class="form-group">
            <input name="driver2_nomor" placeholder="Nomor Balap" value="${state.driver2?.nomor_balap||''}" required type="number" min="1" max="99">
            <div class="error-message"></div>
          </div>
        </div>
      </div>
      
      <div class="form-grid">
        <div class="form-group">
          <label class="required">Kemenangan</label>
          <input name="kemenangan" type="number" value="${state.statistik.kemenangan}" required placeholder="0" min="0">
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label class="required">Podium</label>
          <input name="podium" type="number" value="${state.statistik.podium}" required placeholder="0" min="0">
          <div class="error-message"></div>
        </div>
      </div>
      
      <div class="form-group">
        <label class="required">Gelar Konstruktor</label>
        <input name="gelar_konstruktor" type="number" value="${state.statistik.gelar_konstruktor}" required placeholder="0" min="0">
        <div class="error-message"></div>
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
  
  if (!validateForm(form)) {
    return false;
  }
  
  showFormLoading(form);
  
  setTimeout(() => {
  const f = e.target;
  const data = {
    nama: f.nama.value,
    negara: f.negara.value,
    driver1: { nama: f.driver1_nama.value, nomor_balap: f.driver1_nomor.value },
    driver2: { nama: f.driver2_nama.value, nomor_balap: f.driver2_nomor.value },
    daftar_driver: [], // legacy, not used
    statistik: {
      kemenangan: Number(f.kemenangan.value),
      podium: Number(f.podium.value),
      gelar_konstruktor: Number(f.gelar_konstruktor.value)
    }
  };
    
  if (idx === null) teams.push(data);
  else teams[idx] = data;
    
  saveAllToLocal();
    hideFormLoading(form);
    showFormSuccess(form);
    
    setTimeout(() => {
  closeModal();
  renderTeams();
      renderDrivers(); // pastikan driver juga update
    }, 300);
  }, 500);
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
  el.innerHTML = wdc.map((item, i) => `
    <div class="card">
      <div class="card-title"><strong>${item.tahun}</strong></div>
      <div class="card-detail">
        <span class="wdc-badge driver">${item.driver}</span>
        <span class="wdc-badge team">${item.team}</span><br>
        <button class="crud-action edit" onclick="editWDC(${i})">Edit</button>
        <button class="crud-action delete" onclick="deleteWDC(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}
function addWDCForm(editIdx = null) {
  const item = editIdx !== null ? wdc[editIdx] : {tahun:'', driver:'', team:''};
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
  showFormLoading(form);
  setTimeout(() => {
    const f = e.target;
    const data = {
      tahun: Number(f.tahun.value),
      driver: f.driver.value,
      team: f.team.value
    };
    if (idx === null) wdc.push(data);
    else wdc[idx] = data;
    saveAllToLocal();
    hideFormLoading(form);
    showFormSuccess(form);
    setTimeout(() => {
      closeModal();
      renderWDC();
    }, 300);
  }, 500);
}
function editWDC(idx) { addWDCForm(idx); }
function deleteWDC(idx) {
  if (confirm('Hapus data ini?')) {
    wdc.splice(idx,1);
    saveAllToLocal();
    renderWDC();
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
  el.innerHTML = wcc.map((item, i) => `
    <div class="card">
      <div class="card-title"><strong>${item.tahun}</strong></div>
      <div class="card-detail">
        <span class="wcc-badge team">${item.team}</span><br>
        <button class="crud-action edit" onclick="editWCC(${i})">Edit</button>
        <button class="crud-action delete" onclick="deleteWCC(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}
function addWCCForm(editIdx = null) {
  const item = editIdx !== null ? wcc[editIdx] : {tahun:'', team:''};
  const teamOptions = teams.map(t => `<option value="${t.nama}"${item.team===t.nama?' selected':''}>${t.nama}</option>`).join('');
  
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} World Constructor Champion</h3>
    <form onsubmit="submitWCC(event,${editIdx!==null?editIdx:'null'})">
      <div class="form-group">
        <label class="required">Tahun</label>
        <input name="tahun" type="number" value="${item.tahun}" required placeholder="Contoh: 2024" min="1950" max="2030">
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
  showFormLoading(form);
  setTimeout(() => {
    const f = e.target;
    const data = {
      tahun: Number(f.tahun.value),
      team: f.team.value
    };
    if (idx === null) wcc.push(data);
    else wcc[idx] = data;
    saveAllToLocal();
    hideFormLoading(form);
    showFormSuccess(form);
    setTimeout(() => {
      closeModal();
      renderWCC();
    }, 300);
  }, 500);
}
function editWCC(idx) { addWCCForm(idx); }
function deleteWCC(idx) {
  if (confirm('Hapus data ini?')) {
    wcc.splice(idx,1);
    saveAllToLocal();
    renderWCC();
  }
}
document.getElementById('add-wcc-btn').onclick = () => addWCCForm();

// --- CRUD GRAND PRIX ---
function renderGrandPrix() {
  console.log('renderGrandPrix() - grandsprix:', grandsprix);
  const el = document.getElementById('grandsprix-list');
  if (!grandsprix || grandsprix.length === 0) {
    el.innerHTML = '<div style="color:#888;text-align:center;margin:32px 0;">Belum ada data Grand Prix.</div>';
    return;
  }
  el.innerHTML = grandsprix.map((gp, i) => `
    <div class="card">
      <div class="card-title"><strong>${gp.nama}</strong></div>
      <div class="card-detail">
        Tahun: ${gp.tahun}<br>
        Pemenang: ${gp.pemenang}<br>
        Podium: ${gp.podium ? gp.podium : '-'}<br>
        <button class="crud-action edit" onclick="editGrandPrix(${i})">Edit</button>
        <button class="crud-action delete" onclick="deleteGrandPrix(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}
function addGrandPrixForm(editIdx = null) {
  const gp = editIdx !== null ? grandsprix[editIdx] : {nama:'', tahun:'', pemenang:'', podium:[]};
  const driverOptions = drivers.map(d => `
    <div class="checkbox-item">
      <input type="checkbox" name="podium" value="${d.nama}" id="podium_${d.nama.replace(/\s+/g, '_')}"${gp.podium && gp.podium.includes(d.nama)?' checked':''}>
      <label for="podium_${d.nama.replace(/\s+/g, '_')}">${d.nama} #${d.nomor_balap||'-'}</label>
    </div>
  `).join('');
  
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
        <label class="required">Podium (Pilih minimal 3 pembalap)</label>
        <div class="checkbox-group">
          ${driverOptions}
        </div>
        <div class="error-message" id="gp-podium-error"></div>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
        <button type="submit" class="crud-btn">${editIdx!==null?'Update':'Simpan'} Grand Prix</button>
      </div>
    </form>
  `);
}
function submitGrandPrix(e, idx) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) {
    return false;
  }
  // Validate podium selection
  const podium = Array.from(form.querySelectorAll('input[name=podium]:checked')).map(cb=>cb.value);
  if (podium.length < 3) {
    document.getElementById('gp-podium-error').textContent = `Pilih minimal 3 pembalap untuk podium! (${podium.length}/3)`;
    document.getElementById('gp-podium-error').classList.add('show');
    return false;
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
    hideFormLoading(form);
    showFormSuccess(form);
    setTimeout(() => {
      closeModal();
      renderGrandPrix();
    }, 300);
  }, 500);
}
function editGrandPrix(idx) { addGrandPrixForm(idx); }
function deleteGrandPrix(idx) {
  if (confirm('Hapus Grand Prix ini?')) {
    grandsprix.splice(idx,1);
    saveAllToLocal();
    renderGrandPrix();
  }
}
document.getElementById('add-gp-btn').onclick = () => addGrandPrixForm();

// --- NAVBAR SECTION SWITCHER ---
const navLinks = [
  {id: 'nav-drivers', section: 'drivers'},
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
      editWDC(idx);
    } else if (e.target.classList.contains('delete')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      deleteWDC(idx);
    }
  };
  // WCC
  document.getElementById('wcc-list').onclick = function(e) {
    if (e.target.classList.contains('edit')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      editWCC(idx);
    } else if (e.target.classList.contains('delete')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      deleteWCC(idx);
    }
  };
  // GRAND PRIX
  document.getElementById('grandsprix-list').onclick = function(e) {
    if (e.target.classList.contains('edit')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      editGrandPrix(idx);
    } else if (e.target.classList.contains('delete')) {
      const idx = Array.from(this.children).indexOf(e.target.closest('.card'));
      deleteGrandPrix(idx);
    }
  };
}

// --- INIT LOAD ---
async function loadData() {
  // Cek apakah LocalStorage sudah ada data
  const hasLocal = localStorage.getItem('f1_drivers') || localStorage.getItem('f1_teams') || localStorage.getItem('f1_grandsprix') || localStorage.getItem('f1_wdc') || localStorage.getItem('f1_wcc');
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
    saveAllToLocal();
    console.log('Data diambil dari file JSON dan disimpan ke LocalStorage');
  }
  renderDrivers();
  renderTeams();
  renderWDC();
  renderWCC();
  renderGrandPrix();
}
document.addEventListener('DOMContentLoaded', () => {
loadData();
setupCrudDelegation();
}); 

document.getElementById('reset-data-btn').onclick = function() {
  if (confirm('Yakin ingin menghapus semua data?')) {
    localStorage.removeItem('f1_drivers');
    localStorage.removeItem('f1_teams');
    localStorage.removeItem('f1_grandsprix');
    localStorage.removeItem('f1_wdc');
    localStorage.removeItem('f1_wcc');
    location.reload();
  }
}; 