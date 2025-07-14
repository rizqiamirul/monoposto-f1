# Monoposto Formula One

Aplikasi web modern untuk mengelola data Formula One: pembalap, tim, Grand Prix, juara dunia pembalap (WDC), dan juara dunia konstruktor (WCC) dengan tampilan interaktif dan responsif.

## Fitur Utama

- **Manajemen Drivers**: Tambah, edit, hapus data pembalap lengkap dengan foto, negara, nomor balap, statistik kemenangan, podium, pole, dan afiliasi tim.
- **Manajemen Teams**: Tambah, edit, hapus data tim F1, logo, negara, dua pembalap utama, statistik kemenangan, podium, dan gelar konstruktor.
- **Grand Prix**: Kelola daftar Grand Prix, filter berdasarkan tahun, input pemenang dan podium, serta tampilan kartu modern dengan bendera dan hashtag otomatis.
- **World Driver Champions (WDC)**: Kelola juara dunia pembalap per tahun. Foto pembalap diambil otomatis dari data driver jika tidak diisi manual.
- **World Constructor Champions (WCC)**: Kelola juara dunia konstruktor per tahun. Foto/logo tim diambil otomatis dari data team jika tidak diisi manual.
- **Integrasi Otomatis Foto**: Saat menambah WDC/WCC, foto akan otomatis diambil dari data driver/team jika field foto dikosongkan.
- **Tampilan Modern & Responsif**: Semua kartu dan form didesain modern, interaktif, dan responsif untuk desktop & mobile.
- **Reset Data**: Kembalikan data ke kondisi awal dari file JSON dengan satu klik.
- **Drivers Standings**: Rekap klasemen akhir pembalap tiap musim, dengan data point, edit/tambah/hapus, dan sinkronisasi otomatis dengan data driver (kecuali point).

## Cara Penggunaan

1. **Buka `index.html` di browser** (disarankan Chrome/Edge/Firefox).
2. Navigasi ke tab fitur: Drivers, Teams, Grand Prix, WDC, WCC.
3. Klik tombol "Tambah" untuk menambah data baru pada setiap fitur, termasuk Drivers Standings.
4. Klik "Edit" untuk mengubah data, "Hapus" untuk menghapus.
5. Untuk WDC/WCC, pilih driver/team, foto akan otomatis terisi jika sudah ada di data driver/team.
6. Gunakan filter tahun di Grand Prix untuk melihat GP per musim.
7. Klik "Reset Data" untuk mengembalikan semua data ke kondisi awal.

## Struktur Data

- **Drivers**: `nama`, `nomor_balap`, `negara`, `team`, `kemenangan`, `podium`, `pole`, `foto`
- **Teams**: `nama`, `negara`, `logo`, `driver1`, `driver2`, `kemenangan`, `podium`, `gelar`
- **Grand Prix**: `nama`, `tahun`, `pemenang`, `podium[]`
- **WDC**: `tahun`, `driver`, `team`, `foto` (otomatis dari driver jika kosong)
- **WCC**: `tahun`, `team`, `foto` (otomatis dari team jika kosong)

### Contoh Data Driver
```json
{
  "nama": "Oscar Piastri",
  "nomor_balap": "81",
  "negara": "Australia",
  "team": "McLaren F1 Team",
  "kemenangan": 2,
  "podium": 5,
  "pole": 1,
  "foto": "https://example.com/piastri.jpg"
}
```

### Contoh Data Team
```json
{
  "nama": "McLaren F1 Team",
  "negara": "United Kingdom",
  "logo": "https://example.com/mclaren-logo.png",
  "driver1": "Oscar Piastri",
  "driver2": "Lando Norris",
  "kemenangan": 8,
  "podium": 20,
  "gelar": 8
}
```

### Contoh Data Grand Prix
```json
{
  "nama": "Monaco Grand Prix",
  "tahun": 2025,
  "pemenang": "Lewis Hamilton",
  "podium": ["Lewis Hamilton", "Oscar Piastri", "George Russell"]
}
```

### Contoh Data WDC
```json
{
  "tahun": 2025,
  "driver": "Oscar Piastri",
  "team": "McLaren F1 Team",
  "foto": "" // Akan otomatis diisi dari data driver jika kosong
}
```

### Contoh Data WCC
```json
{
  "tahun": 2025,
  "team": "McLaren F1 Team",
  "foto": "" // Akan otomatis diisi dari data team jika kosong
}
```

## Teknologi yang Digunakan
- HTML5, CSS3 (modern, responsive, dark mode ready)
- JavaScript (tanpa framework, mudah dikembangkan)
- LocalStorage untuk penyimpanan data
- File JSON untuk data awal

## Tips & Troubleshooting
- **Foto tidak muncul?** Pastikan URL foto valid dan driver/team sudah ada di data utama.
- **Data tidak tersimpan?** Pastikan browser mengizinkan LocalStorage.
- **Reset Data**: Klik tombol "Reset Data" di pojok kanan bawah untuk mengembalikan data ke default.
- **Mobile Friendly**: Semua fitur responsif, bisa diakses dari HP/tablet.

## Catatan Penting
- Semua data disimpan di LocalStorage browser, tidak akan hilang kecuali di-reset atau cache dibersihkan.
- Field foto pada WDC/WCC opsional, akan otomatis diisi jika driver/team sudah ada di data utama.
- Layout dan style dapat dimodifikasi sesuai kebutuhan (lihat file `style.css`).

---

Aplikasi ini dibuat untuk fans F1 yang ingin rekap data musim, statistik, dan juara dengan tampilan modern dan mudah digunakan.

Jika ada bug, saran, atau ingin kontribusi, silakan edit file ini atau hubungi developer. 