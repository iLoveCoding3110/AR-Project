# Mebel Jati Nusantara — WebAR Furniture Catalog

Platform katalog furnitur berbasis WebAR dengan QR deep-linking. Pelanggan scan QR → browser terbuka → lihat produk dalam Augmented Reality tanpa install aplikasi.

## Struktur File

```
/
├── index.html       ← Shell HTML (struktur halaman)
├── styles.css       ← Semua styling
├── app.js           ← Logic: katalog, modal, AR, deep-link, QR, share
├── products.js      ← Data produk (sumber tunggal / single source of truth)
├── manifest.json    ← PWA manifest
├── images/          ← Foto produk (jpg/webp), icon PWA
│   ├── kursi-tamu-jati-minimalis.jpg
│   ├── meja-kopi-industrial.jpg
│   └── ...
└── models/          ← File 3D model
    ├── kursi-tamu-jati-minimalis.glb   ← Android (Scene Viewer)
    ├── kursi-tamu-jati-minimalis.usdz  ← iOS (Quick Look)
    └── ...
```

## Deep Link / QR Code

Format URL untuk QR code per produk:
```
https://domain-anda.com/?product=kursi-tamu-jati-minimalis
```

Slug tersedia di `products.js` untuk setiap produk (`slug` field).

## Menambah Produk Baru

Edit **hanya** `products.js` — tambahkan objek baru ke array `window.PRODUCTS`:

```js
{
  id: 9,
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
  whatsapp_message: "Halo Mebel Jati Nusantara, saya tertarik dengan *Nama Produk Baru* (Rp 1.000.000)."
}
```

## AR Stack

| Platform | Metode AR         | Requirement                  |
|----------|-------------------|------------------------------|
| Android  | Scene Viewer      | Chrome 81+, ARCore           |
| iOS      | Quick Look        | Safari, iOS 12+, LiDAR/ARKit |
| Desktop  | 3D preview only   | WebGL support                |

## Deploy

Static hosting — cukup upload semua file ke:
- **GitHub Pages**: push ke branch `gh-pages`
- **Netlify**: drag-drop folder ke netlify.com/drop
- **Vercel**: `vercel --prod`

Pastikan folder `images/` dan `models/` ikut terupload bersama file HTML/CSS/JS.

## Kontak Toko (placeholder — ganti sesuai data asli)

- WhatsApp: `628123456789`
- Email: halo@mebeljatinusantara.id
- Alamat: Jl. Mebel Raya No. 45, Laweyan, Solo
