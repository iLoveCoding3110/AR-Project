// products.js — Single source of truth for all product data
// Edit this file to add, remove, or modify products.
// All files (index.html, app.js) pull from window.PRODUCTS.

window.PRODUCTS = [
  {
    id: 1,
    slug: "kursi-gitar aluminium-minimalis",
    name: "Kursi Gitar Aluminium Minimalis",
    category: "Kursi",
    price: "Rp 1.250.000",
    description: "Kursi aluminium dengan desain minimalis, cocok untuk ruang tamu modern dan tahan digunakan dalam jangka panjang.",
    material: "Aluminium",
    finish: "Natural matte",
    dimensions: "75 × 70 × 95 cm",
    badge: "Terlaris",
    emoji: "🪑",
    bg: "linear-gradient(135deg,#f0e6d3,#d9c9b0)",
    thumbnail: "images/guitar chair 1.jpg",
    model_glb:  "models/guitar_chair_4.glb",
    model_usdz: "models/guitar chair 4.usdz",
    whatsapp_message: "Halo Mebel Jati Nusantara, saya tertarik dengan *Kursi Gitar Aluminium Minimalis* (Rp 1.250.000). Bisa info lebih lanjut mengenai ketersediaan dan pengiriman?"
  },
];

// Quick lookup helpers
window.getProductById   = (id)   => window.PRODUCTS.find(p => p.id   === id);
window.getProductBySlug = (slug) => window.PRODUCTS.find(p => p.slug === slug);
