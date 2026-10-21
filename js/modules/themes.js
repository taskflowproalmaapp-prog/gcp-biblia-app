/* ═══ MÓDULO: Temas y Necesidades ═══ */
(function() {

  const page = document.getElementById('page-themes');
  let THEMES = [];
  let state = { cat: 'all', query: '', active: null };

  const CATS = [
    { id: 'all', label: 'Todos', color: '#D4AF5A' },
    { id: 'emociones', label: 'Emociones', color: '#9b59b6' },
    { id: 'relaciones', label: 'Relaciones', color: '#e74c3c' },
    { id: 'vida-espiritual', label: 'Vida Espiritual', color: '#2980b9' },
    { id: 'vocacion', label: 'Vocación', color: '#27ae60' },
    { id: 'situaciones-dificiles', label: 'Situaciones Difíciles', color: '#e67e22' },
    { id: 'salud-mental', label: 'Salud Mental', color: '#1abc9c' },
    { id: 'fe-y-sociedad', label: 'Fe y Sociedad', color: '#8e44ad' },
    { id: 'juventud', label: 'Juventud', color: '#f39c12' },
    { id: 'etapas-de-vida', label: 'Etapas de Vida', color: '#16a085' },
  ];

  page.innerHTML = `<div class="loading"><div class="spinner"></div><p>Cargando temas...</p></div>`;

  const style = document.createElement('style');
  style.textContent = `
    .themes-wrap{display:flex;height:calc(100vh - 56px);}
    @media(max-width:700px){
      .themes-sidebar,.sum-sidebar,.chars-sidebar,.reader-sidebar{
        position:fixed!important;top:56px!important;
        left:-100%!important;bottom:0!important;
        width:82vw!important;max-width:290px!important;
        z-index:300!important;
        transition:left .25s cubic-bezier(.4,0,.2,1)!important;
        box-shadow:4px 0 30px rgba(0,0,0,.8)!important;
        overflow-y:auto!important;
      }
      .themes-sidebar.mob-open,.sum-sidebar.mob-open,
      .chars-sidebar.mob-open,.reader-sidebar.mob-open{
        left:0!important;
      }
      .themes-grid-wrap{width:100%!important;padding:14px!important;}
      .themes-wrap{flex-direction:column!important;height:auto!important;}
    }
    .themes-sidebar{width:240px;flex-shrink:0;background:var(--surface);
      border-right:1px solid rgba(212,175,90,.1);overflow-y:auto;padding:16px 0;}
    .themes-search{padding:0 12px 12px;border-bottom:1px solid rgba(212,175,90,.1);}
    .themes-search input{width:100%;background:var(--ink);border:1px solid rgba(212,175,90,.2);
      color:var(--text);padding:8px 12px;border-radius:8px;font-size:13px;outline:none;}
    .themes-search input:focus{border-color:var(--gold);}
    .themes-cats{padding:12px 0;}
    .themes-cat-btn{display:flex;align-items:center;gap:8px;width:100%;background:none;border:none;
      color:var(--text2);padding:8px 16px;cursor:pointer;font-size:13px;text-align:left;transition:all .15s;
      border-left:3px solid transparent;}
    .themes-cat-btn.active{color:var(--text);background:rgba(212,175,90,.06);border-left-color:var(--gold);}
    .themes-cat-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
    .themes-grid-wrap{flex:1;overflow-y:auto;padding:20px;}
    .themes-count{color:var(--text2);font-size:13px;margin-bottom:16px;}
    .themes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;}
    .theme-card{background:var(--surface);border:1px solid rgba(212,175,90,.1);
      border-radius:var(--r);padding:16px;cursor:pointer;transition:all .15s;text-align:center;}
    .theme-card:hover{border-color:rgba(212,175,90,.35);transform:translateY(-2px);}
    .theme-emoji{font-size:28px;margin-bottom:8px;}
    .theme-name{font-size:13px;font-weight:600;color:var(--text);margin-bottom:4px;}
    .theme-sub{font-size:11px;color:var(--text2);line-height:1.4;}
    .theme-detail{flex:1;overflow-y:auto;padding:28px;max-width:700px;}
    .theme-detail-header{display:flex;align-items:center;gap:16px;margin-bottom:24px;}
    .theme-detail-emoji{font-size:48px;}
    .theme-detail-title{font-family:Georgia,serif;font-size:28px;color:var(--gold);}
    .theme-detail-sub{color:var(--text2);font-size:14px;margin-top:4px;}
    .theme-section{background:var(--surface);border-radius:var(--r);padding:20px;margin-bottom:16px;}
    .theme-section-label{color:var(--gold);font-size:11px;font-weight:700;letter-spacing:1px;
      text-transform:uppercase;margin-bottom:12px;}
    .theme-section p{color:var(--text);line-height:1.75;font-size:15px;text-align:justify;}
    .theme-verse{border-left:3px solid rgba(212,175,90,.5);padding-left:14px;margin-bottom:14px;}
    .theme-verse-ref{color:var(--gold);font-size:12px;font-weight:700;margin-bottom:4px;}
    .theme-verse-text{color:var(--text);font-style:italic;line-height:1.6;font-size:14px;}
    .theme-step{display:flex;gap:12px;margin-bottom:12px;align-items:flex-start;}
    .theme-step-num{background:rgba(212,175,90,.15);color:var(--gold);width:24px;height:24px;
      border-radius:50%;display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:700;flex-shrink:0;margin-top:2px;}
    .theme-step-text{color:var(--text);font-size:14px;line-height:1.6;}
    .theme-prayer{background:rgba(212,175,90,.06);border-radius:var(--r);padding:20px;margin-bottom:16px;
      border-left:3px solid var(--gold);}
    .theme-prayer p{color:var(--text);font-style:italic;line-height:1.8;font-size:14px;}
    .theme-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px;}
    .theme-btn{background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.2);
      color:var(--gold);padding:10px 18px;border-radius:8px;cursor:pointer;font-size:13px;
      font-weight:600;transition:all .15s;}
    .theme-btn:hover{background:rgba(212,175,90,.2);}
    .theme-btn-primary{background:var(--gold);color:#0B0E14;border-color:var(--gold);}
    .theme-btn-primary:hover{background:var(--gold-light);}
    @media(max-width:600px){
      .themes-sidebar{width:180px;}
      .themes-grid{grid-template-columns:repeat(auto-fill,minmax(130px,1fr));}
    }`;
  document.head.appendChild(style);

  function renderShell() {
    page.innerHTML = `
      <div class="mob-sidebar-overlay" id="themes-overlay" onclick="GCP.themes.closeSidebar()"></div>
      <div class="mob-bar">
        <button class="mob-bar-btn" onclick="GCP.themes.toggleSidebar()">☰ Temas</button>
        <span class="mob-bar-title" id="themes-bar-title">Selecciona una categoría</span>
      </div>
      <div class="themes-wrap">
        <aside class="themes-sidebar" id="themes-sidebar">
          <div class="themes-search">
            <input id="themes-search" type="text" placeholder="Buscar tema..."
              oninput="GCP.themes.filter(this.value)">
          </div>
          <div class="themes-cats">
            ${CATS.map(c => `
              <button class="themes-cat-btn ${state.cat === c.id ? 'active' : ''}"
                onclick="GCP.themes.setCat('${c.id}')">
                <span class="themes-cat-dot" style="background:${c.color}"></span>
                ${c.label}
              </button>`).join('')}
          </div>
        </aside>
        <div id="themes-content" class="themes-grid-wrap"></div>
      </div>`;
    renderGrid();
  }

  function getFiltered() {
    let list = THEMES;
    if (state.cat !== 'all') list = list.filter(t => t.cat === state.cat);
    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.sub.toLowerCase().includes(q));
    }
    return list;
  }

  function renderGrid() {
    const content = document.getElementById('themes-content');
    if (!content) return;
    const list = getFiltered();
    state.active = null;
    content.innerHTML = `
      <p class="themes-count">${list.length} temas</p>
      <div class="themes-grid">
        ${list.map(t => `
          <div class="theme-card" onclick="GCP.themes.openTheme('${t.id}')">
            <div class="theme-emoji">${t.emoji}</div>
            <div class="theme-name">${t.name}</div>
            <div class="theme-sub">${t.sub}</div>
          </div>`).join('')}
      </div>`;
  }

  function openTheme(id) {
    const t = THEMES.find(x => x.id === id);
    if (!t) return;
    state.active = id;
    const content = document.getElementById('themes-content');
    if (!content) return;

    content.className = 'theme-detail';
    content.innerHTML = `
      <button onclick="GCP.themes.backToGrid()" style="background:none;border:none;color:var(--text2);cursor:pointer;margin-bottom:20px;font-size:13px;">
        ← Volver a temas
      </button>
      <div class="theme-detail-header">
        <div class="theme-detail-emoji">${t.emoji}</div>
        <div>
          <div class="theme-detail-title">${t.name}</div>
          <div class="theme-detail-sub">${t.sub}</div>
        </div>
      </div>

      <div class="theme-section">
        <div class="theme-section-label">✦ Reflexión Bíblica</div>
        <p>${t.explanation}</p>
      </div>

      <div class="theme-section">
        <div class="theme-section-label">✦ Versículos para ti</div>
        ${t.verses.map(v => `
          <div class="theme-verse">
            <div class="theme-verse-ref">${v.ref}</div>
            <div class="theme-verse-text">"${v.text}"</div>
          </div>`).join('')}
      </div>

      <div class="theme-section">
        <div class="theme-section-label">✦ Reflexión</div>
        <p>${t.reflection}</p>
      </div>

      <div class="theme-section">
        <div class="theme-section-label">✦ Pasos Prácticos</div>
        ${t.steps.map((s, i) => `
          <div class="theme-step">
            <div class="theme-step-num">${i+1}</div>
            <div class="theme-step-text">${s}</div>
          </div>`).join('')}
      </div>

      <div class="theme-prayer">
        <div class="theme-section-label">🙏 Oración Sugerida</div>
        <p>${t.prayer}</p>
      </div>

      <div class="theme-actions">
        <button class="theme-btn theme-btn-primary" onclick="GCP.themes.shareTheme('${t.id}')">
          📤 Compartir
        </button>
        <button class="theme-btn" onclick="GCP.themes.copyPrayer('${t.id}')">
          🙏 Copiar oración
        </button>
        <button class="theme-btn" onclick="GCP.speak.text(
          '${t.name}. ' +
          '${(t.explanation||'').replace(/'/g,"\'")}. ' +
          'Versículos clave: ' +
          '${((t.verses||[]).map(v=>v.ref+'. '+v.text).join('. ')).replace(/'/g,"\'")}. ' +
          'Reflexión: ${(t.reflection||'').replace(/'/g,"\'")}. ' +
          'Oración: ${(t.prayer||'').replace(/'/g,"\'")}',
          '${t.name}')">
          🔊 Escuchar
        </button>
      </div>`;
    content.scrollTop = 0;
  }

  function backToGrid() {
    const content = document.getElementById('themes-content');
    if (content) content.className = 'themes-grid-wrap';
    renderGrid();
  }

  function setCat(cat) {
    state.cat = cat;
    if (window.innerWidth <= 700) closeSidebar();
    document.querySelectorAll('.themes-cat-btn').forEach((b, i) => {
      b.classList.toggle('active', CATS[i].id === cat);
    });
    renderGrid();
  }

  function filter(q) { state.query = q; renderGrid(); }

  function copyPrayer(id) {
    const t = THEMES.find(x => x.id === id);
    if (!t) return;
    navigator.clipboard.writeText(t.prayer).then(() => GCP.toast('Oración copiada ✓', 'success'));
  }

  function shareTheme(id) {
    const t = THEMES.find(x => x.id === id);
    if (!t) return;
    const text = `${t.emoji} ${t.name}\n\n${t.explanation}\n\n📖 ${t.verses[0]?.ref}: "${t.verses[0]?.text}"\n\n🙏 ${t.prayer}`;
    if (navigator.share) {
      navigator.share({ title: t.name, text });
    } else {
      navigator.clipboard.writeText(text).then(() => GCP.toast('Tema copiado ✓', 'success'));
    }
  }

  function toggleSidebar() {
    const sb = document.getElementById('themes-sidebar');
    const ov = document.getElementById('themes-overlay');
    if (!sb) return;
    const isOpen = sb.classList.toggle('mob-open');
    if (ov) ov.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  function closeSidebar() {
    const sb = document.getElementById('themes-sidebar');
    const ov = document.getElementById('themes-overlay');
    if (sb) sb.classList.remove('mob-open');
    if (ov) ov.classList.remove('show');
    document.body.style.overflow = '';
  }

  GCP.themes = { openTheme, backToGrid, setCat, filter, copyPrayer, shareTheme };

  /* Cargar temas */
  fetch('temas.json')
    .then(r => r.json())
    .then(data => {
      THEMES = data;
      renderShell();
    })
    .catch(() => {
      page.innerHTML = '<div class="loading"><p style="color:var(--text2)">Error al cargar temas</p></div>';
    });

})();
