/* ═══ MÓDULO: Profecías Mesiánicas ═══ */
(function() {
  const page = document.getElementById('page-profecias');
  let DATA = {cats:[], pairs:[]};
  let activeCat = 'all';
  let expandedIdx = null;

  const style = document.createElement('style');
  style.textContent = `
    .prof-wrap{max-width:960px;margin:0 auto;padding:28px 20px;}
    .prof-hero{text-align:center;margin-bottom:24px;}
    .prof-hero h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin:12px 0 8px;}
    .prof-hero p{color:var(--text2);font-size:14px;line-height:1.7;max-width:700px;margin:0 auto 16px;}
    .prof-stats{display:flex;gap:16px;justify-content:center;margin-bottom:24px;flex-wrap:wrap;}
    .prof-stat{background:var(--surface);border-radius:10px;padding:12px 20px;text-align:center;min-width:80px;}
    .prof-stat-num{font-size:24px;font-weight:700;color:var(--gold);}
    .prof-stat-label{font-size:11px;color:var(--text2);}
    .prof-cats{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:28px;}
    .prof-cat-btn{background:var(--surface);border:1px solid rgba(212,175,90,.15);color:var(--text2);
      padding:7px 16px;border-radius:20px;cursor:pointer;font-size:13px;transition:all .15s;}
    .prof-cat-btn:hover{border-color:rgba(212,175,90,.4);color:var(--text);}
    .prof-cat-btn.active{background:rgba(212,175,90,.15);color:var(--gold);border-color:var(--gold);font-weight:600;}
    .prof-group-title{font-family:Georgia,serif;font-size:20px;color:var(--gold);margin:24px 0 14px;
      padding-bottom:8px;border-bottom:1px solid rgba(212,175,90,.2);}
    /* CARD */
    .prof-card{background:var(--surface);border:1px solid rgba(212,175,90,.12);border-radius:12px;
      margin-bottom:14px;overflow:hidden;transition:border-color .2s;}
    .prof-card:hover{border-color:rgba(212,175,90,.3);}
    .prof-card-header{padding:16px 20px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;}
    .prof-card-theme{font-size:16px;font-weight:600;color:var(--text);}
    .prof-card-toggle{color:var(--gold);font-size:18px;transition:transform .2s;flex-shrink:0;}
    .prof-card.open .prof-card-toggle{transform:rotate(45deg);}
    /* PAR AT→NT */
    .prof-pair{display:grid;grid-template-columns:1fr 40px 1fr;gap:0;padding:0 20px 16px;align-items:stretch;}
    .prof-half{border-radius:10px;padding:14px 16px;}
    .prof-half.prophecy{background:rgba(50,50,80,.4);border:1px solid rgba(100,100,200,.2);}
    .prof-half.fulfillment{background:rgba(80,60,20,.4);border:1px solid rgba(212,175,90,.25);}
    .prof-half-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px;}
    .prof-half.prophecy .prof-half-label{color:rgba(150,150,255,.8);}
    .prof-half.fulfillment .prof-half-label{color:var(--gold);}
    .prof-half-ref{font-size:15px;font-weight:700;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:opacity .15s;}
    .prof-half.prophecy .prof-half-ref{color:rgba(180,180,255,.9);}
    .prof-half.fulfillment .prof-half-ref{color:var(--gold);}
    .prof-half-ref:hover{opacity:.8;}
    .prof-half-ref::after{content:'→';font-size:13px;}
    .prof-half-text{color:var(--text2);font-size:13px;font-style:italic;line-height:1.7;}
    /* Versículo expandido */
    .prof-verse-expanded{background:rgba(212,175,90,.06);border:1px solid rgba(212,175,90,.2);
      border-radius:8px;padding:14px;margin-top:10px;font-size:14px;color:var(--text);
      line-height:1.8;font-style:italic;display:none;}
    .prof-verse-expanded.show{display:block;}
    /* Flecha central */
    .prof-arrow{display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:22px;}
    /* Nota teológica */
    .prof-note{margin:0 20px 16px;background:rgba(212,175,90,.05);border-left:4px solid var(--gold);
      border-radius:0 8px 8px 0;padding:14px 16px;}
    .prof-note-label{color:var(--gold);font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;}
    .prof-note-text{color:var(--text);font-size:14px;line-height:1.75;}
    /* Versículo leído inline */
    .prof-inline-verse{background:var(--ink);border:1px solid rgba(212,175,90,.15);border-radius:8px;
      padding:14px;margin-top:10px;}
    .prof-inline-ref{color:var(--gold);font-size:12px;font-weight:700;margin-bottom:6px;}
    .prof-inline-text{color:var(--text);font-size:14px;line-height:1.8;font-family:Georgia,serif;}
    .prof-inline-loading{color:var(--text2);font-size:13px;font-style:italic;}
    /* Teología */
    .prof-theology{padding:0 20px 20px;}
    .prof-theology-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;}
    .prof-th-card{background:rgba(212,175,90,.04);border:1px solid rgba(212,175,90,.1);border-radius:10px;padding:14px;}
    .prof-th-label{color:var(--gold);font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;display:flex;align-items:center;gap:6px;}
    .prof-th-text{color:var(--text);font-size:13px;line-height:1.75;}
    .prof-key-insight{background:linear-gradient(135deg,rgba(212,175,90,.12),rgba(212,175,90,.06));
      border:1px solid rgba(212,175,90,.3);border-radius:10px;padding:16px;margin-top:10px;text-align:center;}
    .prof-key-icon{font-size:20px;margin-bottom:6px;}
    .prof-key-text{color:var(--gold);font-size:15px;font-family:Georgia,serif;font-style:italic;line-height:1.6;}
    .prof-note-simple{background:rgba(212,175,90,.05);border-left:4px solid var(--gold);border-radius:0 8px 8px 0;padding:12px 16px;margin-bottom:12px;}
    .prof-note-simple-text{color:var(--text2);font-size:13px;line-height:1.7;font-style:italic;}
    .prof-group-intro{background:rgba(212,175,90,.04);border:1px solid rgba(212,175,90,.1);
      border-radius:10px;padding:16px 20px;margin-bottom:16px;color:var(--text2);
      font-size:14px;line-height:1.8;font-style:italic;}
    @media(max-width:600px){
      .prof-theology-grid{grid-template-columns:1fr;}
    }
    @media(max-width:600px){
      .prof-pair{grid-template-columns:1fr;gap:10px;}
      .prof-arrow{transform:rotate(90deg);}
    }`;
  document.head.appendChild(style);

  page.innerHTML = `
    <div class="prof-wrap">
      <div class="prof-hero">
        <div style="font-size:48px">🔮</div>
        <h2>Profecías Mesiánicas</h2>
        <p>Cientos de años antes de Cristo, los profetas describieron su nacimiento, su vida, su muerte y su resurrección con asombroso detalle. Aquí puedes leer cada profecía junto a su cumplimiento. Toca cualquier referencia para leerla ahí mismo.</p>
      </div>
      <div class="prof-stats">
        <div class="prof-stat"><div class="prof-stat-num" id="prof-count">—</div><div class="prof-stat-label">Profecías</div></div>
        <div class="prof-stat"><div class="prof-stat-num">6</div><div class="prof-stat-label">Categorías</div></div>
        <div class="prof-stat"><div class="prof-stat-num">100%</div><div class="prof-stat-label">Cumplidas</div></div>
      </div>
      <div class="prof-cats" id="prof-cats"></div>
      <div id="prof-content"></div>
    </div>`;

  function render() {
    const catsEl = document.getElementById('prof-cats');
    const content = document.getElementById('prof-content');
    const countEl = document.getElementById('prof-count');
    if (!catsEl || !content) return;

    const filtered = activeCat === 'all' ? DATA.pairs : DATA.pairs.filter(p => p.cat === activeCat);
    if (countEl) countEl.textContent = filtered.length;

    // Botones de categoría con contadores
    catsEl.innerHTML = `
      <button class="prof-cat-btn ${activeCat==='all'?'active':''}" onclick="GCP.profecias.setCat('all')">
        Todas (${DATA.pairs.length})
      </button>
      ${DATA.cats.map(c => {
        const n = DATA.pairs.filter(p => p.cat === c.key).length;
        return `<button class="prof-cat-btn ${activeCat===c.key?'active':''}" onclick="GCP.profecias.setCat('${c.key}')">
          ${c.label} (${n})
        </button>`;
      }).join('')}`;

    // Agrupar por categoría
    const groups = {};
    filtered.forEach(p => {
      if (!groups[p.cat]) groups[p.cat] = [];
      groups[p.cat].push(p);
    });

    let html = '';
    Object.keys(groups).forEach(cat => {
      const catObj = DATA.cats.find(c => c.key === cat);
      if (activeCat === 'all') {
        html += `<div class="prof-group-title">${catObj ? catObj.label : cat}</div>`;
        if (catObj && catObj.intro) {
          html += `<div class="prof-group-intro">${esc(catObj.intro)}</div>`;
        }
      } else if (catObj && catObj.intro) {
        html += `<div class="prof-group-intro">${esc(catObj.intro)}</div>`;
      }
      groups[cat].forEach((pair, i) => {
        const idx = `${cat}-${i}`;
        html += buildCard(pair, idx);
      });
    });

    content.innerHTML = html;
  }

  function buildCard(pair, idx) {
    return `
      <div class="prof-card" id="pcard-${idx}">
        <div class="prof-card-header" onclick="GCP.profecias.toggle('${idx}')">
          <div class="prof-card-theme">${esc(pair.theme)}</div>
          <div class="prof-card-toggle">+</div>
        </div>
        <div id="pbody-${idx}" style="display:none">
          <div class="prof-pair">
            <div class="prof-half prophecy">
              <div class="prof-half-label">📜 Profecía · Antiguo Testamento</div>
              <div class="prof-half-ref" onclick="event.stopPropagation();GCP.profecias.loadVerse('${idx}','p','${esc(pair.prophecy.ref)}','${esc(pair.prophecy.bookId)}',${pair.prophecy.chapter})">
                ${esc(pair.prophecy.ref)}
              </div>
              <div class="prof-half-text">${esc(pair.prophecy.text)}</div>
              <div class="prof-inline-verse" id="pverse-${idx}-p"></div>
            </div>
            <div class="prof-arrow">→</div>
            <div class="prof-half fulfillment">
              <div class="prof-half-label">✝️ Cumplimiento · Nuevo Testamento</div>
              <div class="prof-half-ref" onclick="event.stopPropagation();GCP.profecias.loadVerse('${idx}','f','${esc(pair.fulfillment.ref)}','${esc(pair.fulfillment.bookId)}',${pair.fulfillment.chapter})">
                ${esc(pair.fulfillment.ref)}
              </div>
              <div class="prof-half-text">${esc(pair.fulfillment.text)}</div>
              <div class="prof-inline-verse" id="pverse-${idx}-f"></div>
            </div>
          </div>
          <div class="prof-theology">
            ${buildTheology(pair)}
          </div>
        </div>
      </div>`;
  }

  function toggle(idx) {
    const card = document.getElementById('pcard-' + idx);
    const body = document.getElementById('pbody-' + idx);
    if (!card || !body) return;
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'block';
    card.classList.toggle('open', !isOpen);
  }

  async function loadVerse(idx, side, ref, bookId, chapter) {
    const el = document.getElementById(`pverse-${idx}-${side}`);
    if (!el) return;

    // Si ya está mostrando, toggle
    if (el.classList.contains('show')) {
      el.classList.remove('show');
      el.innerHTML = '';
      return;
    }

    el.classList.add('show');
    el.innerHTML = `<div class="prof-inline-loading">Cargando ${ref}...</div>`;

    try {
      // Cargar desde la Biblia local
      if (!window._BIBLE_DATA) {
        const resp = await fetch('bible.json');
        window._BIBLE_DATA = await resp.json();
      }
      const key = bookId + '-' + chapter;
      const verses = window._BIBLE_DATA[key] || [];
      if (verses.length) {
        el.innerHTML = `
          <div class="prof-inline-ref">${ref}</div>
          <div class="prof-inline-text">${verses.map((t,i) => `<span style="color:var(--gold);font-size:11px;font-weight:700;">${i+1}</span> ${t} `).join('')}</div>`;
      } else {
        el.innerHTML = `<div class="prof-inline-ref">${ref}</div><div class="prof-inline-loading">Capítulo no disponible</div>`;
      }
    } catch(e) {
      el.innerHTML = `<div class="prof-inline-loading">Error al cargar</div>`;
    }
  }

  function setCat(key) {
    activeCat = key;
    render();
  }

  function buildTheology(pair) {
    const t = pair.theology;
    let h = '';

    // Nota simple (resumen corto original)
    if (pair.note) {
      h += `<div class="prof-note-simple">
        <div class="prof-th-label">✦ Resumen</div>
        <div class="prof-note-simple-text">${esc(pair.note)}</div>
      </div>`;
    }

    if (!t) return h;

    h += '<div class="prof-theology-grid">';

    if (t.historical_context) h += `
      <div class="prof-th-card">
        <div class="prof-th-label">📜 Contexto histórico</div>
        <div class="prof-th-text">${esc(t.historical_context)}</div>
      </div>`;

    if (t.at_meaning) h += `
      <div class="prof-th-card">
        <div class="prof-th-label">🕍 Significado en el AT</div>
        <div class="prof-th-text">${esc(t.at_meaning)}</div>
      </div>`;

    if (t.fulfillment_detail) h += `
      <div class="prof-th-card">
        <div class="prof-th-label">✝️ Cumplimiento en Cristo</div>
        <div class="prof-th-text">${esc(t.fulfillment_detail)}</div>
      </div>`;

    if (t.theological_impact) h += `
      <div class="prof-th-card">
        <div class="prof-th-label">🌟 Impacto teológico</div>
        <div class="prof-th-text">${esc(t.theological_impact)}</div>
      </div>`;

    h += '</div>';

    if (t.practical_application) h += `
      <div class="prof-th-card" style="margin-bottom:10px;">
        <div class="prof-th-label">💡 Aplicación práctica</div>
        <div class="prof-th-text">${esc(t.practical_application)}</div>
      </div>`;

    if (t.key_insight) h += `
      <div class="prof-key-insight">
        <div class="prof-key-icon">✨</div>
        <div class="prof-key-text">"${esc(t.key_insight)}"</div>
      </div>`;

    return h;
  }

  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

  GCP.profecias = { setCat, toggle, loadVerse };

  fetch('profecias.json').then(r => r.json()).then(d => {
    DATA = d;
    render();
  }).catch(e => console.error('profecias:', e));
})();
