/* ═══ MÓDULO: Profecías Mesiánicas ═══ */
(function() {
  const page = document.getElementById('page-profecias');
  let DATA = {cats:[], pairs:[]};
  let activeCat = 'all';

  const style = document.createElement('style');
  style.textContent = `
    .prof-wrap{max-width:900px;margin:0 auto;padding:28px 20px;}
    .prof-hero{text-align:center;margin-bottom:28px;}
    .prof-hero h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin:12px 0 8px;}
    .prof-hero p{color:var(--text2);font-size:14px;}
    .prof-cats{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:28px;}
    .prof-cat-btn{background:var(--surface);border:1px solid rgba(212,175,90,.15);color:var(--text2);
      padding:8px 16px;border-radius:20px;cursor:pointer;font-size:13px;transition:all .15s;}
    .prof-cat-btn:hover{border-color:rgba(212,175,90,.4);color:var(--text);}
    .prof-cat-btn.active{background:rgba(212,175,90,.15);color:var(--gold);border-color:var(--gold);}
    .prof-count{text-align:center;color:var(--text2);font-size:13px;margin-bottom:20px;}
    .prof-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:14px;}
    .prof-card{background:var(--surface);border:1px solid rgba(212,175,90,.1);border-radius:var(--r);padding:20px;transition:all .15s;}
    .prof-card:hover{border-color:rgba(212,175,90,.3);}
    .prof-ref{color:var(--gold);font-size:13px;font-weight:700;margin-bottom:10px;}
    .prof-text{color:var(--text);font-size:14px;font-style:italic;line-height:1.7;border-left:3px solid rgba(212,175,90,.4);padding-left:12px;}
    .prof-cat-label{display:inline-block;background:rgba(212,175,90,.1);color:var(--gold);font-size:11px;padding:2px 8px;border-radius:10px;margin-top:10px;}
    .prof-stats{display:flex;gap:16px;justify-content:center;margin-bottom:24px;flex-wrap:wrap;}
    .prof-stat{background:var(--surface);border-radius:10px;padding:12px 20px;text-align:center;}
    .prof-stat-num{font-size:24px;font-weight:700;color:var(--gold);}
    .prof-stat-label{font-size:12px;color:var(--text2);}`;
  document.head.appendChild(style);

  page.innerHTML = `
    <div class="prof-wrap">
      <div class="prof-hero">
        <div style="font-size:48px">🔮</div>
        <h2>Profecías Mesiánicas</h2>
        <p>Profecías del Antiguo Testamento cumplidas en Jesucristo</p>
      </div>
      <div class="prof-stats">
        <div class="prof-stat"><div class="prof-stat-num">62</div><div class="prof-stat-label">Profecías</div></div>
        <div class="prof-stat"><div class="prof-stat-num">6</div><div class="prof-stat-label">Categorías</div></div>
        <div class="prof-stat"><div class="prof-stat-num">100%</div><div class="prof-stat-label">Cumplidas</div></div>
      </div>
      <div class="prof-cats" id="prof-cats"></div>
      <div class="prof-count" id="prof-count"></div>
      <div class="prof-grid" id="prof-grid"></div>
    </div>`;

  function render() {
    const catsEl = document.getElementById('prof-cats');
    const grid = document.getElementById('prof-grid');
    const count = document.getElementById('prof-count');
    if (!catsEl) return;

    catsEl.innerHTML = `
      <button class="prof-cat-btn ${activeCat === 'all' ? 'active' : ''}" onclick="GCP.profecias.setCat('all')">Todas</button>
      ${DATA.cats.map(c => `
        <button class="prof-cat-btn ${activeCat === c.key ? 'active' : ''}" onclick="GCP.profecias.setCat('${c.key}')">
          ${c.label}
        </button>`).join('')}`;

    const pairs = activeCat === 'all' ? DATA.pairs : DATA.pairs.filter(p => p.cat === activeCat);
    if (count) count.textContent = `${pairs.length} profecías${activeCat !== 'all' ? ' en esta categoría' : ''}`;
    
    if (grid) {
      grid.innerHTML = pairs.map(p => {
        const cat = DATA.cats.find(c => c.key === p.cat);
        return `
          <div class="prof-card">
            <div class="prof-ref">📜 ${p.ref}</div>
            <div class="prof-text">"${p.text}"</div>
            ${cat ? `<span class="prof-cat-label">${cat.label}</span>` : ''}
          </div>`;
      }).join('');
    }
  }

  function setCat(key) {
    activeCat = key;
    document.querySelectorAll('.prof-cat-btn').forEach(b => {
      const isAll = b.textContent.trim() === 'Todas';
      b.classList.toggle('active', isAll ? key === 'all' : b.onclick?.toString().includes(`'${key}'`));
    });
    render();
  }

  GCP.profecias = { setCat };

  fetch('profecias.json').then(r => r.json()).then(d => {
    DATA = d;
    // Asignar categoría a cada profecía basado en el orden
    const perCat = Math.ceil(DATA.pairs.length / DATA.cats.length);
    DATA.pairs.forEach((p, i) => {
      if (!p.cat) p.cat = DATA.cats[Math.floor(i / perCat)]?.key || DATA.cats[0]?.key;
    });
    render();
  }).catch(e => console.error(e));
})();
