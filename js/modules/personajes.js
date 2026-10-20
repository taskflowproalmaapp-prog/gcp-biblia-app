/* ═══ MÓDULO: Personajes Bíblicos ═══ */
(function() {
  const page = document.getElementById('page-personajes');
  let DATA = [], filtered = [], active = null;
  let _filterT = 'ALL', filterG = 'ALL', searchQ = '';

  const style = document.createElement('style');
  style.textContent = `
    .chars-wrap{display:flex;height:calc(100vh - 56px);}
    .chars-sidebar{width:240px;flex-shrink:0;background:var(--surface);border-right:1px solid rgba(212,175,90,.1);overflow-y:auto;display:flex;flex-direction:column;}
    .chars-search{padding:12px;border-bottom:1px solid rgba(212,175,90,.1);}
    .chars-search input{width:100%;background:var(--ink);border:1px solid rgba(212,175,90,.2);color:var(--text);padding:8px 12px;border-radius:8px;font-size:13px;outline:none;}
    .chars-search input:focus{border-color:var(--gold);}
    .chars-filters{display:flex;gap:4px;padding:8px 12px;border-bottom:1px solid rgba(212,175,90,.1);}
    .chars-filter-btn{flex:1;background:none;border:1px solid rgba(212,175,90,.2);color:var(--text2);padding:4px 6px;border-radius:6px;cursor:pointer;font-size:11px;transition:all .15s;}
    .chars-filter-btn.active{background:rgba(212,175,90,.15);color:var(--gold);border-color:var(--gold);}
    .chars-list{flex:1;overflow-y:auto;}
    .chars-item{padding:10px 16px;cursor:pointer;font-size:13px;color:var(--text2);transition:all .15s;border-left:3px solid transparent;display:flex;align-items:center;gap:8px;}
    .chars-item:hover{color:var(--text);background:rgba(212,175,90,.05);}
    .chars-item.active{color:var(--gold);border-left-color:var(--gold);background:rgba(212,175,90,.08);}
    .chars-testament{font-size:10px;background:rgba(212,175,90,.1);color:var(--gold);padding:2px 6px;border-radius:10px;margin-left:auto;flex-shrink:0;}
    .chars-main{flex:1;overflow-y:auto;padding:28px;}
    .chars-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60%;text-align:center;color:var(--text2);}
    .chars-welcome h2{font-family:Georgia,serif;font-size:24px;color:var(--gold);margin:12px 0 8px;}
    .chars-detail-name{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin-bottom:4px;}
    .chars-detail-meta{color:var(--text2);font-size:13px;margin-bottom:20px;}
    .chars-section{background:var(--surface);border-radius:var(--r);padding:18px;margin-bottom:14px;}
    .chars-section-label{color:var(--gold);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;}
    .chars-section p{color:var(--text);line-height:1.75;font-size:14px;}
    .chars-verse{border-left:3px solid rgba(212,175,90,.4);padding-left:12px;margin-bottom:10px;}
    .chars-verse-ref{color:var(--gold);font-size:12px;font-weight:700;margin-bottom:3px;}
    .chars-verse-text{color:var(--text);font-style:italic;font-size:13px;line-height:1.6;}
    .chars-curiosity{background:rgba(212,175,90,.06);border-radius:6px;padding:10px 14px;margin-bottom:8px;font-size:13px;color:var(--text);}
    .chars-count{color:var(--text2);font-size:12px;padding:8px 16px;}
    @media(max-width:600px){.chars-sidebar{width:160px;}.chars-main{padding:16px;}}`;
  document.head.appendChild(style);

  page.innerHTML = `
    <div class="chars-wrap">
      <aside class="chars-sidebar">
        <div class="chars-search">
          <input id="chars-search" type="text" placeholder="Buscar personaje..." oninput="GCP.personajes.search(this.value)">
        </div>
        <div class="chars-filters">
          <button class="chars-filter-btn active" onclick="GCP.personajes.filterT('ALL')">Todos</button>
          <button class="chars-filter-btn" onclick="GCP.personajes.filterT('AT')">AT</button>
          <button class="chars-filter-btn" onclick="GCP.personajes.filterT('NT')">NT</button>
        </div>
        <div class="chars-count" id="chars-count"></div>
        <div class="chars-list" id="chars-list"></div>
      </aside>
      <div class="chars-main" id="chars-main">
        <div class="chars-welcome">
          <div style="font-size:48px">👤</div>
          <h2>Personajes Bíblicos</h2>
          <p>167 personajes del Antiguo y Nuevo Testamento</p>
        </div>
      </div>
    </div>`;

  function renderList() {
    const list = document.getElementById('chars-list');
    const count = document.getElementById('chars-count');
    if (!list) return;
    let items = DATA;
    if (_filterT !== 'ALL') items = items.filter(p => p.testament === _filterT);
    if (searchQ) { const q = searchQ.toLowerCase(); items = items.filter(p => p.name.toLowerCase().includes(q)); }
    filtered = items;
    if (count) count.textContent = `${items.length} personajes`;
    list.innerHTML = items.map(p => `
      <div class="chars-item ${active === p.id ? 'active' : ''}" onclick="GCP.personajes.open('${p.id}')">
        <span>${p.name}</span>
        <span class="chars-testament">${p.testament}</span>
      </div>`).join('');
  }

  function open(id) {
    const p = DATA.find(x => x.id === id);
    if (!p) return;
    active = id;
    renderList();
    const main = document.getElementById('chars-main');
    if (!main) return;
    const verses = (p.keyVerses || []).map(v => `
      <div class="chars-verse">
        <div class="chars-verse-ref">${v.ref || v.r || ''}</div>
        <div class="chars-verse-text">"${v.text || v.t || ''}"</div>
      </div>`).join('');
    const curiosities = (p.curiosities || []).filter(Boolean).map(c => `
      <div class="chars-curiosity">✦ ${c}</div>`).join('');
    main.innerHTML = `
      <div class="chars-detail-name">${p.name}</div>
      <div class="chars-detail-meta">${p.era || ''} · ${p.group || ''} · ${p.meaning ? '"' + p.meaning + '"' : ''}</div>
      ${p.bio ? `<div class="chars-section"><div class="chars-section-label">📖 Biografía</div><p>${p.bio}</p></div>` : ''}
      ${p.spiritual ? `<div class="chars-section"><div class="chars-section-label">✝️ Lección espiritual</div><p>${p.spiritual}</p></div>` : ''}
      ${verses ? `<div class="chars-section"><div class="chars-section-label">📌 Versículos clave</div>${verses}</div>` : ''}
      ${curiosities ? `<div class="chars-section"><div class="chars-section-label">💎 Datos curiosos</div>${curiosities}</div>` : ''}`;
    main.scrollTop = 0;
  }

  function search(q) { searchQ = q; renderList(); }
  function filterT(t) {
    _filterT = t;
    document.querySelectorAll('.chars-filter-btn').forEach((b,i) => b.classList.toggle('active', ['ALL','AT','NT'][i] === t));
    renderList();
  }

  GCP.personajes = { open, search, filterT };

  fetch('personajes.json').then(r => r.json()).then(d => { DATA = d; renderList(); }).catch(e => console.error(e));
})();
