// --- DATA STATE ---
let drivers = [];
let teams = [];
let wdc = [];
let wcc = [];
let grandsprix = [];

// --- LOCAL STORAGE UTILS ---
function saveAllToLocal() {
  localStorage.setItem('f1_drivers', JSON.stringify(drivers));
  localStorage.setItem('f1_teams', JSON.stringify(teams));
  localStorage.setItem('f1_grandsprix', JSON.stringify(grandsprix));
  localStorage.setItem('f1_wdc', JSON.stringify(wdc));
  localStorage.setItem('f1_wcc', JSON.stringify(wcc));
}
function loadAllFromLocal() {
  drivers = JSON.parse(localStorage.getItem('f1_drivers')||'null') || drivers;
  teams = JSON.parse(localStorage.getItem('f1_teams')||'null') || teams;
  grandsprix = JSON.parse(localStorage.getItem('f1_grandsprix')||'null') || grandsprix;
  wdc = JSON.parse(localStorage.getItem('f1_wdc')||'null') || wdc;
  wcc = JSON.parse(localStorage.getItem('f1_wcc')||'null') || wcc;
}

// --- MODAL HANDLER ---
function showModal(html) {
  document.getElementById('modal').innerHTML = html;
  document.getElementById('modal-bg').style.display = 'flex';
}
function closeModal() {
  document.getElementById('modal-bg').style.display = 'none';
}
document.getElementById('modal-bg').onclick = function(e) {
  if (e.target === this) closeModal();
};

// --- CRUD DRIVER ---
function renderDrivers() {
  const el = document.getElementById('drivers-list');
  el.innerHTML = drivers.map((d, i) => `
    <div class="card">
      <div class="card-title"><strong>${d.nama}</strong> <span style='color:#888;font-size:0.95em;'>#${d.nomor_balap||'-'}</span></div>
      <div class="card-detail">
        Negara: ${d.negara}<br>
        Team: ${d.team||'-'}<br>
        <span class="stat">Kemenangan: ${d.statistik.kemenangan}, Podium: ${d.statistik.podium}, Pole: ${d.statistik.pole_position}</span><br>
        <button class="crud-action edit" onclick="editDriver(${i})">Edit</button>
        <button class="crud-action delete" onclick="deleteDriver(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}
function addDriverForm(editIdx = null, prefill = {}) {
  const d = editIdx !== null ? drivers[editIdx] : {nama:prefill.nama||'', nomor_balap:prefill.nomor_balap||'', negara:prefill.negara||'', team:prefill.team||'', statistik:{kemenangan:'',podium:'',pole_position:''}};
  const teamOptions = [''].concat(teams.map(t => t.nama)).map(t => `<option value="${t}"${d.team===t?' selected':''}>${t||'-'}</option>`).join('');
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} Driver</h3>
    <form onsubmit="submitDriver(event,${editIdx!==null?editIdx:'null'})">
      <label>Nama:<input name="nama" value="${d.nama}" required></label>
      <label>Nomor Balap:<input name="nomor_balap" value="${d.nomor_balap||''}" required></label>
      <label>Negara:<input name="negara" value="${d.negara}" required></label>
      <label>Team:<select name="team">${teamOptions}</select></label>
      <label>Kemenangan:<input name="kemenangan" type="number" value="${d.statistik.kemenangan}" required></label>
      <label>Podium:<input name="podium" type="number" value="${d.statistik.podium}" required></label>
      <label>Pole Position:<input name="pole_position" type="number" value="${d.statistik.pole_position}" required></label>
      <div class="modal-actions">
        <button type="submit" class="crud-btn">Simpan</button>
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
      </div>
    </form>
  `);
}
function submitDriver(e, idx) {
  e.preventDefault();
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
  saveAllToLocal();
  closeModal();
  renderDrivers();
  renderTeams();
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
  el.innerHTML = teams.map((t, i) => `
    <div class="card">
      <div class="card-title"><strong>${t.nama}</strong></div>
      <div class="card-detail">
        Negara: ${t.negara}<br>
        Driver 1: ${t.driver1 ? t.driver1.nama + ' <span style=\'color:#888\'>#' + t.driver1.nomor_balap + '</span>' : '-'}<br>
        Driver 2: ${t.driver2 ? t.driver2.nama + ' <span style=\'color:#888\'>#' + t.driver2.nomor_balap + '</span>' : '-'}<br>
        <span class="stat">Kemenangan: ${t.statistik.kemenangan}, Podium: ${t.statistik.podium}, Gelar Konstruktor: ${t.statistik.gelar_konstruktor}</span><br>
        <button class="crud-action edit" data-idx="${i}" onclick="editTeam(${i})">Edit</button>
        <button class="crud-action delete" data-idx="${i}" onclick="deleteTeam(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}
function addTeamForm(editIdx = null, formState = null) {
  const t = editIdx !== null ? teams[editIdx] : {nama:'', negara:'', daftar_driver:[], statistik:{kemenangan:'',podium:'',gelar_konstruktor:''}, driver1:{nama:'',nomor_balap:''}, driver2:{nama:'',nomor_balap:''}};
  // Gunakan formState jika ada (agar data tetap setelah tambah driver baru)
  const state = formState || t;
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} Team</h3>
    <form onsubmit="submitTeam(event,${editIdx!==null?editIdx:'null'})">
      <label>Nama:<input name="nama" value="${state.nama}" required></label>
      <label>Negara:<input name="negara" value="${state.negara}" required></label>
      <div style="margin-bottom:8px;"><b>Driver 1:</b><br>
        <input name="driver1_nama" placeholder="Nama Driver 1" value="${state.driver1?.nama||''}" required style="margin-bottom:4px;">
        <input name="driver1_nomor" placeholder="Nomor Balap" value="${state.driver1?.nomor_balap||''}" required style="width:80px;">
      </div>
      <div style="margin-bottom:8px;"><b>Driver 2:</b><br>
        <input name="driver2_nama" placeholder="Nama Driver 2" value="${state.driver2?.nama||''}" required style="margin-bottom:4px;">
        <input name="driver2_nomor" placeholder="Nomor Balap" value="${state.driver2?.nomor_balap||''}" required style="width:80px;">
      </div>
      <label>Kemenangan:<input name="kemenangan" type="number" value="${state.statistik.kemenangan}" required></label>
      <label>Podium:<input name="podium" type="number" value="${state.statistik.podium}" required></label>
      <label>Gelar Konstruktor:<input name="gelar_konstruktor" type="number" value="${state.statistik.gelar_konstruktor}" required></label>
      <div class="modal-actions">
        <button type="submit" class="crud-btn">Simpan</button>
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
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
  closeModal();
  renderTeams();
  renderDrivers();
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
  const el = document.getElementById('wdc-list');
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
      <label>Tahun:<input name="tahun" type="number" value="${item.tahun}" required></label>
      <label>Driver:<select name="driver" required>${driverOptions}</select></label>
      <label>Team:<select name="team" required>${teamOptions}</select></label>
      <div class="modal-actions">
        <button type="submit" class="crud-btn">Simpan</button>
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
      </div>
    </form>
  `);
}
function submitWDC(e, idx) {
  e.preventDefault();
  const f = e.target;
  const data = {
    tahun: Number(f.tahun.value),
    driver: f.driver.value,
    team: f.team.value
  };
  if (idx === null) wdc.push(data);
  else wdc[idx] = data;
  saveAllToLocal();
  closeModal();
  renderWDC();
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
  const el = document.getElementById('wcc-list');
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
      <label>Tahun:<input name="tahun" type="number" value="${item.tahun}" required></label>
      <label>Team:<select name="team" required>${teamOptions}</select></label>
      <div class="modal-actions">
        <button type="submit" class="crud-btn">Simpan</button>
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
      </div>
    </form>
  `);
}
function submitWCC(e, idx) {
  e.preventDefault();
  const f = e.target;
  const data = {
    tahun: Number(f.tahun.value),
    team: f.team.value
  };
  if (idx === null) wcc.push(data);
  else wcc[idx] = data;
  saveAllToLocal();
  closeModal();
  renderWCC();
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
  const el = document.getElementById('grandsprix-list');
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
    <label style='display:block;margin-bottom:4px;'>
      <input type='checkbox' name='podium' value='${d.nama}'${gp.podium && gp.podium.includes(d.nama)?' checked':''}>
      ${d.nama} #${d.nomor_balap||'-'}
    </label>
  `).join('');
  showModal(`
    <button class='close-modal' onclick='closeModal()'>&times;</button>
    <h3>${editIdx!==null?'Edit':'Tambah'} Grand Prix</h3>
    <form id="gp-form" onsubmit="submitGrandPrix(event,${editIdx!==null?editIdx:'null'})">
      <label>Nama:<input name="nama" value="${gp.nama}" required></label>
      <label>Tahun:<input name="tahun" type="number" value="${gp.tahun}" required></label>
      <label>Pemenang:<select name="pemenang" required>${drivers.map(d => `<option value='${d.nama}'${gp.pemenang===d.nama?' selected':''}>${d.nama} #${d.nomor_balap||'-'}</option>`).join('')}</select></label>
      <div style='margin-bottom:6px;'><b>Podium (Pilih minimal 3):</b><br>${driverOptions}</div>
      <div id="gp-podium-error" style="color:#e53935;font-size:0.98em;"></div>
      <div class="modal-actions">
        <button type="submit" class="crud-btn">Simpan</button>
        <button type="button" class="crud-btn" onclick="closeModal()">Batal</button>
      </div>
    </form>
  `);
}
function submitGrandPrix(e, idx) {
  e.preventDefault();
  const f = e.target;
  const podium = Array.from(f.querySelectorAll('input[name=podium]:checked')).map(cb=>cb.value);
  if (podium.length < 3) {
    document.getElementById('gp-podium-error').textContent = 'Pilih minimal 3 pembalap untuk podium!';
    return false;
  }
  const data = {
    nama: f.nama.value,
    tahun: Number(f.tahun.value),
    pemenang: f.pemenang.value,
    podium
  };
  if (idx === null) grandsprix.push(data);
  else grandsprix[idx] = data;
  saveAllToLocal();
  closeModal();
  renderGrandPrix();
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
  } else {
    drivers = await (await fetch('data/drivers.json')).json();
    drivers.forEach(d=>{if(!('nomor_balap' in d))d.nomor_balap='';});
    teams = await (await fetch('data/teams.json')).json();
    wdc = await (await fetch('data/wdc.json')).json();
    wcc = await (await fetch('data/wcc.json')).json();
    grandsprix = await (await fetch('data/grandsprix.json')).json();
    saveAllToLocal();
  }
  renderDrivers();
  renderTeams();
  renderWDC();
  renderWCC();
  renderGrandPrix();
}
loadData();
setupCrudDelegation();

// --- ABAIKAN RENDER LAINNYA (GRAND PRIX, WDC, WCC) UNTUK SAAT INI --- 