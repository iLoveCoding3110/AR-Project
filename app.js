// app.js — Mebel Jati Nusantara WebAR Catalog
// Requires: products.js (window.PRODUCTS) loaded before this script.

/* ══════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════ */
const CONFIG = {
  WA_NUMBER:  '628123456789',
  STORE_NAME: 'Mebel Jati Nusantara',
  MAPS_URL:   'https://maps.google.com/?q=Mebel+Jati+Nusantara+Solo',
  QR_API:     'https://api.qrserver.com/v1/create-qr-code/',
};

/* ══════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════ */
const state = {
  activeFilter:  'Semua',
  activeProduct: null,
  searchQuery:   '',
};

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initRevealObserver();
  renderProducts(PRODUCTS);
  handleDeepLink();

  // Keyboard: close modal on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Native share availability → show share button if supported
  if (navigator.share) {
    document.querySelectorAll('.btn-share.share-native').forEach(el => {
      el.style.display = 'flex';
    });
  }
});

/* ══════════════════════════════════════════════════
   DEEP LINK — open product from URL param
   e.g. index.html?product=kursi-tamu-jati-minimalis
══════════════════════════════════════════════════ */
function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('product');
  if (!slug) return;

  const product = getProductBySlug(slug);
  if (product) {
    // Slight delay so the page renders first
    setTimeout(() => openModal(product.id), 400);
  }
}

/* ══════════════════════════════════════════════════
   CATALOG RENDERING
══════════════════════════════════════════════════ */
function renderProducts(list) {
  const grid  = document.getElementById('productGrid');
  const noRes = document.getElementById('noResults');
  grid.innerHTML = '';

  if (list.length === 0) {
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = p.id;

    // Thumbnail: try real image, fall back to emoji+gradient
    const imgHTML = p.thumbnail
      ? `<img src="${p.thumbnail}" alt="${p.name}"
              loading="lazy"
              onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
              style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
         <span class="card-emoji-fallback" style="display:none;">${p.emoji}</span>`
      : `<span class="card-emoji-fallback">${p.emoji}</span>`;

    card.innerHTML = `
      <div class="card-img" style="background:${p.bg};">
        ${imgHTML}
        ${p.badge ? `<div class="card-badge">${p.badge}</div>` : ''}
      </div>
      <div class="card-body">
        <div class="card-cat">${p.category}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-price">${p.price}</div>
        <button class="card-ar-btn" aria-label="Lihat ${p.name} di ruangan Anda">
          Lihat di Ruangan Saya
        </button>
      </div>
    `;

    card.querySelector('.card-ar-btn').addEventListener('click', e => {
      e.stopPropagation();
      openModal(p.id);
    });
    card.addEventListener('click', () => openModal(p.id));
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════
   FILTER & SEARCH
══════════════════════════════════════════════════ */
function getFiltered() {
  const q = state.searchQuery.toLowerCase();
  return PRODUCTS.filter(p => {
    const matchCat = state.activeFilter === 'Semua' || p.category === state.activeFilter;
    const matchQ   = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
}

function filterProducts() {
  state.searchQuery = document.getElementById('searchInput').value.trim();
  const clearBtn = document.getElementById('clearBtn');
  clearBtn.style.display = state.searchQuery ? 'block' : 'none';
  renderProducts(getFiltered());
}

function setFilter(cat, btn) {
  state.activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(getFiltered());
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  state.searchQuery = '';
  document.getElementById('clearBtn').style.display = 'none';
  renderProducts(getFiltered());
}

/* ══════════════════════════════════════════════════
   MODAL — open / close
══════════════════════════════════════════════════ */
function openModal(id) {
  const p = getProductById(id);
  if (!p) return;
  state.activeProduct = p;

  // Update URL so this link is shareable / deep-linkable
  history.replaceState({ productId: p.id }, '', `?product=${p.slug}`);

  // Fill modal header info
  document.getElementById('mCat').textContent   = p.category;
  document.getElementById('mName').textContent  = p.name;
  document.getElementById('mPrice').textContent = p.price;
  document.getElementById('mDesc').textContent  = p.description;

  // Specs
  document.getElementById('mSpecs').innerHTML = `
    <div class="spec-item">
      <div class="spec-label">Material</div>
      <div class="spec-val">${p.material}</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Finishing</div>
      <div class="spec-val">${p.finish}</div>
    </div>
    <div class="spec-item">
      <div class="spec-label">Ukuran</div>
      <div class="spec-val">${p.dimensions}</div>
    </div>
  `;

  // WhatsApp link
  const waMsg = encodeURIComponent(p.whatsapp_message);
  document.getElementById('modalWaBtn').href = `https://wa.me/${CONFIG.WA_NUMBER}?text=${waMsg}`;

  // QR code for this product's link
  buildQRSection(p);

  // Reset AR section
  document.getElementById('arFallback').style.display = 'none';
  setARButtonLoading();

  // Show overlay
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Initialize model-viewer (slight delay so modal animates first)
  setTimeout(() => setupModelViewer(p), 200);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';

  // Clear URL param when modal closes
  history.replaceState({}, '', window.location.pathname);

  // Destroy model-viewer after animation to free GPU
  setTimeout(() => {
    document.getElementById('mvContainer').innerHTML = '';
  }, 320);

  state.activeProduct = null;
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

/* ══════════════════════════════════════════════════
   MODEL-VIEWER SETUP & AR MANAGEMENT
══════════════════════════════════════════════════ */
function setupModelViewer(product) {
  const mvc = document.getElementById('mvContainer');

  // Inject loading state overlay while model-viewer boots
  mvc.innerHTML = `
    <div class="mv-loading" id="mvLoading">
      <div class="mv-loading-spinner"></div>
      <p>Memuat model 3D…</p>
    </div>
    <model-viewer
      id="activeModelViewer"
      src="${product.model_glb}"
      ios-src="${product.model_usdz}"
      alt="Model 3D ${product.name}"
      ar
      ar-modes="scene-viewer webxr quick-look"
      ar-scale="auto"
      scale="0.1 0.1 0.1"
      camera-controls
      auto-rotate
      auto-rotate-delay="0"
      rotation-per-second="12deg"
      shadow-intensity="1.2"
      shadow-softness="0.8"
      exposure="0.85"
      style="width:100%;height:300px;opacity:0;transition:opacity .4s;"
    >
      <div slot="poster"
           style="width:100%;height:300px;display:flex;align-items:center;justify-content:center;background:${product.bg};font-size:5rem;">
        ${product.emoji}
      </div>
    </model-viewer>
  `;

  const mv = document.getElementById('activeModelViewer');
  const loadingEl = document.getElementById('mvLoading');

  // Model loaded successfully
  mv.addEventListener('load', () => {
    mv.style.opacity = '1';
    if (loadingEl) loadingEl.remove();
    updateARButton(mv.canActivateAR);
  });

  // Model failed to load (missing file, CORS, etc.)
  mv.addEventListener('error', () => {
    mv.style.opacity = '1';
    if (loadingEl) loadingEl.remove();
    setARButtonError();
  });

  // Track AR session events
  mv.addEventListener('ar-status', e => {
    switch (e.detail.status) {
      case 'session-started':
        // AR launched — nothing to do in page
        break;
      case 'object-placed':
        // Object placed in room
        break;
      case 'failed':
        showARFallback('session-failed');
        break;
    }
  });

  // Track model-viewer's poster dismiss (means it started loading)
  mv.addEventListener('poster-dismissed', () => {
    // Model is loading from server
  });
}

/* ─── AR button state helpers ─────────────────── */
function setARButtonLoading() {
  const btn = document.getElementById('modalArBtn');
  btn.className = 'btn-ar ar-loading';
  btn.disabled  = true;
  btn.innerHTML = `<span class="btn-ar-spinner"></span> Menyiapkan AR…`;
}

function updateARButton(canActivateAR) {
  const btn = document.getElementById('modalArBtn');
  btn.disabled = false;

  if (canActivateAR) {
    btn.className = 'btn-ar ar-ready';
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
      Lihat di Ruangan Saya
    `;
    document.getElementById('arFallback').style.display = 'none';
  } else {
    btn.className = 'btn-ar ar-unsupported';
    btn.innerHTML = 'Putar model 3D di atas · AR tidak tersedia';
    showARFallback('not-supported');
  }
}

function setARButtonError() {
  const btn = document.getElementById('modalArBtn');
  btn.className = 'btn-ar ar-error';
  btn.disabled  = true;
  btn.innerHTML = 'Model belum tersedia · AR tidak dapat diluncurkan';
  showARFallback('no-model');
}

function launchAR() {
  const mv = document.getElementById('activeModelViewer');
  if (!mv) return;

  if (mv.canActivateAR) {
    mv.activateAR();
  } else {
    showARFallback('not-supported');
  }
}

function showARFallback(reason) {
  const fb = document.getElementById('arFallback');
  const msgs = {
    'not-supported':
      'AR belum didukung di browser atau perangkat ini. Untuk pengalaman AR terbaik, gunakan Chrome di Android atau Safari di iPhone/iPad.',
    'session-failed':
      'AR gagal diluncurkan. Pastikan izin kamera sudah diberikan, lalu coba lagi.',
    'no-model':
      'File model 3D produk ini belum tersedia. Hubungi kami via WhatsApp untuk informasi lebih lanjut.',
  };
  fb.querySelector('p').textContent = msgs[reason] || msgs['not-supported'];
  fb.style.display = 'block';
}

/* ══════════════════════════════════════════════════
   QR SECTION — generate product QR code & link
══════════════════════════════════════════════════ */
function buildQRSection(product) {
  const productURL = getProductURL(product.slug);
  const qrSrc = `${CONFIG.QR_API}?size=88x88&data=${encodeURIComponent(productURL)}&bgcolor=f2ebe0&color=3b2a1a&margin=2`;

  document.getElementById('productQRImg').src        = qrSrc;
  document.getElementById('productQRImg').alt        = `QR Code ${product.name}`;
  document.getElementById('productQRUrl').textContent = productURL;
}

function getProductURL(slug) {
  return `${location.origin}${location.pathname}?product=${slug}`;
}

/* ══════════════════════════════════════════════════
   SHARE & COPY
══════════════════════════════════════════════════ */
function copyProductLink() {
  const p = state.activeProduct;
  if (!p) return;
  const url = getProductURL(p.slug);
  navigator.clipboard.writeText(url)
    .then(() => showToast('Link produk disalin!'))
    .catch(() => {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      showToast('Link produk disalin!');
    });
}

async function shareProduct() {
  const p = state.activeProduct;
  if (!p || !navigator.share) return;
  try {
    await navigator.share({
      title: p.name,
      text: `Lihat ${p.name} di katalog AR ${CONFIG.STORE_NAME} — ${p.price}`,
      url: getProductURL(p.slug),
    });
  } catch (_) {
    // User cancelled or share failed — ignore
  }
}

/* ══════════════════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════════════════ */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ══════════════════════════════════════════════════
   SCROLL HELPERS
══════════════════════════════════════════════════ */
function scrollToCatalog() {
  document.getElementById('katalog').scrollIntoView({ behavior: 'smooth' });
}

function openMaps() {
  window.open(CONFIG.MAPS_URL, '_blank');
}

/* ══════════════════════════════════════════════════
   SCROLL-REVEAL OBSERVER
══════════════════════════════════════════════════ */
function initRevealObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
