# Monoposto Formula One

Aplikasi web untuk mengelola data Formula One termasuk drivers, teams, grand prix, dan champions.

## Fitur

- **Drivers Management**: Tambah, edit, hapus data pembalap
- **Teams Management**: Tambah, edit, hapus data tim
- **Grand Prix Management**: Tambah, edit, hapus data grand prix dengan filter tahun
- **World Driver Champions (WDC)**: Kelola juara dunia pembalap dengan foto dan layout yang menarik
- **World Constructor Champions (WCC)**: Kelola juara dunia konstruktor dengan foto dan layout yang menarik

## Fitur Foto Champion

Aplikasi sekarang mendukung foto untuk WDC dan WCC dengan layout yang menarik:

### Cara Menambahkan Foto:
1. Buka form tambah/edit WDC atau WCC
2. Masukkan URL foto di field "Foto Driver" atau "Foto Team"
3. Foto akan ditampilkan sebagai gambar lingkaran dengan border kuning
4. Layout text akan di-center di bawah foto

### Contoh URL Foto yang Bisa Digunakan:
- **Max Verstappen**: `https://upload.wikimedia.org/wikipedia/commons/8/8a/Max_Verstappen_2017_Malaysia_3.jpg`
- **Lewis Hamilton**: `https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg`
- **Charles Leclerc**: `https://upload.wikimedia.org/wikipedia/commons/7/72/Charles_Leclerc_2019_Monaco_2.jpg`
- **Lando Norris**: `https://upload.wikimedia.org/wikipedia/commons/8/8a/Lando_Norris_2019_Monaco_2.jpg`
- **Red Bull Racing**: `https://upload.wikimedia.org/wikipedia/en/6/6e/Red_Bull_Racing_logo.png`
- **Mercedes**: `https://upload.wikimedia.org/wikipedia/commons/6/6e/Mercedes-Benz_logo_2010.svg`
- **Ferrari**: `https://upload.wikimedia.org/wikipedia/en/d/d2/Scuderia_Ferrari_Logo.png`
- **McLaren**: `https://upload.wikimedia.org/wikipedia/en/6/6f/McLaren_Racing_logo.png`

### Layout Champion yang Baru:
- **Tahun**: Ditampilkan besar di atas dengan font Bebas Neue
- **Foto**: Gambar lingkaran 120px dengan border kuning
- **Nama**: Font besar dan bold di bawah foto
- **Team**: Informasi team di bawah nama
- **Badge**: Badge "World Driver/Constructor Champion" dengan gradient
- **Actions**: Tombol edit dan hapus di bawah

### Fitur Interaktif:
- **Hover Effects**: Card akan naik dan membesar saat di-hover
- **Photo Animation**: Foto akan rotate dan scale saat hover
- **Color Transitions**: Warna akan berubah saat hover
- **Responsive Design**: Menyesuaikan dengan ukuran layar
- **Placeholder Icons**: Icon 🏆 untuk WDC dan 🏁 untuk WCC jika tidak ada foto

### Catatan:
- Field foto bersifat opsional
- Jika URL foto tidak valid, gambar tidak akan ditampilkan dan akan diganti dengan icon
- Layout responsive untuk mobile dan desktop
- Animasi smooth untuk semua interaksi

## Cara Penggunaan

1. Buka `index.html` di browser
2. Navigasi ke tab yang diinginkan (Drivers, Teams, Grand Prix, WDC, WCC)
3. Klik "Tambah" untuk menambah data baru
4. Klik "Edit" untuk mengubah data yang ada
5. Klik "Hapus" untuk menghapus data

## Data Storage

Data disimpan di localStorage browser dan akan tetap tersimpan sampai di-reset atau cache dibersihkan.

## Reset Data

Klik tombol "Reset Data" untuk mengembalikan semua data ke kondisi awal dari file JSON. 