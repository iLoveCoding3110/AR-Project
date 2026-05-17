# Mebel Jati Nusantara — WebAR Furniture Catalog

Platform katalog furnitur berbasis WebAR dengan dukungan AR animasi menggunakan MindAR. Pelanggan dapat melihat produk dalam Augmented Reality tanpa perlu menginstal aplikasi.

## Struktur File

```
/
├── index.html              ← Katalog produk utama (product catalog)
├── animation.html          ← AR animasi dengan MindAR image tracking
├── styles.css              ← Semua styling (shared)
├── app.js                  ← Logic: katalog, modal, AR, deep-link, QR, share
├── products.js             ← Data produk (single source of truth)
├── manifest.json           ← PWA manifest
├── targets.mind            ← MindAR image tracking marker
├── images/                 ← Foto produk (jpg/webp), icon PWA
│   └── ...
└── models/                 ← File 3D model
    ├── kid.glb             ← Model animasi (AR animation)
    ├── guitar_chair_4.glb  ← Android (Scene Viewer)
    └── guitar chair 4.usdz ← iOS (Quick Look)
```

## Fitur Utama

### 1. Katalog Produk (`index.html`)
- Browse produk dengan filter kategori
- Search/pencarian produk
- Modal detail produk dengan AR preview
- QR code per produk untuk deep-linking
- Share produk via WhatsApp, link, atau native share

### 2. AR Animasi (`animation.html`)
- MindAR image tracking untuk mendeteksi marker
- Model 3D animasi (kid.glb) yang muncul di atas marker
- UI loading screen, hint bar, dan found banner
- Kembali ke katalog dengan tombol

## Deep Link / QR Code

Format URL untuk QR code per produk:
```
https://domain-anda.com/?product=kursi-gitar-aluminium-minimalis
```

Slug tersedia di `products.js` untuk setiap produk (`slug` field).

Format URL untuk AR animasi:
```
https://domain-anda.com/animation.html
```

## Menambah Produk Baru

Edit **hanya** `products.js` — tambahkan objek baru ke array `window.PRODUCTS`:

```js
{
  id: 2,
  slug: "nama-produk-baru",
  name: "Nama Produk Baru",
  category: "Kursi",          // Kursi | Meja | Lemari | Rak | Sofa | Dekorasi
  price: "Rp 1.000.000",
  description: "Deskripsi singkat produk.",
  material: "Kayu jati solid",
  finish: "Natural matte",
  dimensions: "80 × 60 × 90 cm",
  badge: null,                 // null | "Terlaris" | "Baru" | "Premium" | ...
  emoji: "🪑",
  bg: "linear-gradient(135deg,#f0e6d3,#d9c9b0)",
  thumbnail: "images/nama-produk-baru.jpg",
  model_glb:  "models/nama-produk-baru.glb",
  model_usdz: "models/nama-produk-baru.usdz",
  whatsapp_message: "Halo Mebel Jati Nusantara, saya tertarik dengan *Nama Produk Baru* (Rp 1.000.000). Bisa info ketersediaan dan pengiriman?"
}
```

**File yang dibutuhkan untuk setiap produk baru:**
- `models/nama-produk-baru.glb` (untuk Android)
- `models/nama-produk-baru.usdz` (untuk iOS)
- `images/nama-produk-baru.jpg` (thumbnail katalog)

## Mengupdate AR Animasi

Edit `animation.html` untuk mengubah:
- Model 3D yang ditampilkan: ubah `src="./models/kid.glb"` ke model lain
- Scale animasi: ubah `scale="0.25 0.25 0.25"` sesuai ukuran model
- Marker tracking: ganti `targets.mind` dengan marker file baru

Untuk generate marker baru:
1. Buka https://www.mediaio.ai/ (MindAR Target Creator)
2. Upload gambar marker Anda
3. Download file `.mind` dan simpan sebagai `targets.mind`

## AR Stack

### Katalog Produk (`index.html`)
| Platform | Metode AR         | Requirement                  |
|----------|-------------------|------------------------------|
| Android  | Scene Viewer      | Chrome 81+, ARCore           |
| iOS      | Quick Look        | Safari, iOS 12+, LiDAR/ARKit |
| Desktop  | 3D preview only   | Model Viewer support         |

### AR Animasi (`animation.html`)
| Platform | Metode AR         | Requirement                     |
|----------|-------------------|---------------------------------|
| Android  | MindAR + WebXR    | Chrome 81+, ARCore, Camera      |
| iOS      | MindAR + WebXR    | Safari, iOS 14+, Camera         |
| Desktop  | 3D preview only   | Webcam, WebGL support           |

**Catatan:** AR Animasi memerlukan `targets.mind` marker file untuk berfungsi.

## Deploy

Static hosting — cukup upload semua file ke:
- **GitHub Pages**: push ke branch `gh-pages`
- **Netlify**: drag-drop folder ke netlify.com/drop
- **Vercel**: `vercel --prod`

**Penting:** Pastikan folder berikut ikut terupload:
- `images/` (foto produk & icon PWA)
- `models/` (file .glb dan .usdz)
- Jangan lupa: `targets.mind` untuk AR animasi

## Testing Lokal

Untuk test dengan camera (AR functionality):
```bash
# Gunakan local server, jangan buka file:// langsung
# Opsi 1: Python
python -m http.server 8000

# Opsi 2: Node.js (http-server)
npx http-server -c-1 -o

# Opsi 3: VS Code Live Server
# Buka file HTML, klik "Go Live" di status bar
```

Kemudian buka: `http://localhost:8000` atau `http://localhost:5500`

## Kontak Toko (placeholder — ganti sesuai data asli)

- WhatsApp: `628123456789`
- Email: halo@mebeljatinusantara.id
- Alamat: Jl. Mebel Raya No. 45, Laweyan, Solo

---

**Last Updated:** May 2026 | Integrated with MindAR image tracking for animation.html
