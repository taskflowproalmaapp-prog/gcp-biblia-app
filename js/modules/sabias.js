/* ═══ MÓDULO: ¿Sabías que...? ═══ */
(function() {
  const page = document.getElementById('page-sabias');
  let DATA = [], idx = 0;

  const style = document.createElement('style');
  style.textContent = `
    .sabias-wrap{max-width:700px;margin:0 auto;padding:40px 20px;text-align:center;}
    .sabias-hero h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin:12px 0 8px;}
    .sabias-hero p{color:var(--text2);font-size:14px;margin-bottom:32px;}
    .sabias-card{background:var(--surface);border:1px solid rgba(212,175,90,.2);border-radius:14px;
      padding:32px;margin-bottom:24px;min-height:160px;display:flex;flex-direction:column;
      align-items:center;justify-content:center;animation:fadeIn .3s ease;}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    .sabias-icon{font-size:36px;margin-bottom:16px;}
    .sabias-text{font-size:17px;color:var(--text);line-height:1.8;font-family:Georgia,serif;font-style:italic;}
    .sabias-person{color:var(--text2);font-size:13px;margin-top:12px;}
    .sabias-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
    .sabias-counter{color:var(--text2);font-size:13px;margin-bottom:16px;}
    .sabias-search{display:flex;gap:8px;margin-bottom:24px;}
    .sabias-search input{flex:1;background:var(--surface);border:1px solid rgba(212,175,90,.2);
      color:var(--text);padding:10px 14px;border-radius:8px;font-size:14px;outline:none;}
    .sabias-search input:focus{border-color:var(--gold);}
    .sabias-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-top:24px;text-align:left;}
    .sabias-grid-item{background:var(--surface);border:1px solid rgba(212,175,90,.1);border-radius:10px;padding:16px;font-size:13px;color:var(--text);line-height:1.6;}
    .sabias-grid-person{color:var(--gold);font-size:11px;margin-top:6px;}`;
  document.head.appendChild(style);

  page.innerHTML = `
    <div class="sabias-wrap">
      <div class="sabias-hero">
        <div style="font-size:48px">💡</div>
        <h2>¿Sabías que...?</h2>
        <p>Datos curiosos y sorprendentes de la Biblia</p>
      </div>
      <div class="sabias-search">
        <input id="sabias-search" type="text" placeholder="Buscar un hecho..." oninput="GCP.sabias.search(this.value)">
      </div>
      <div class="sabias-counter" id="sabias-counter"></div>
      <div class="sabias-card" id="sabias-card">
        <div class="sabias-icon">⏳</div>
        <div class="sabias-text">Cargando datos curiosos...</div>
      </div>
      <div class="sabias-actions">
        <button class="btn btn-primary" onclick="GCP.sabias.next()">✦ Siguiente dato</button>
        <button class="btn btn-outline" onclick="GCP.sabias.random()">🎲 Aleatorio</button>
        <button class="btn btn-outline" onclick="GCP.sabias.share()">📤 Compartir</button>
      </div>
      <div id="sabias-grid" class="sabias-grid" style="display:none"></div>
    </div>`;

  function show(i) {
    if (!DATA.length) return;
    idx = ((i % DATA.length) + DATA.length) % DATA.length;
    const item = DATA[idx];
    const card = document.getElementById('sabias-card');
    const counter = document.getElementById('sabias-counter');
    if (card) {
      card.innerHTML = `
        <div class="sabias-icon">💡</div>
        <div class="sabias-text">${item.text}</div>
        ${item.person ? `<div class="sabias-person">— ${item.person}</div>` : ''}`;
    }
    if (counter) counter.textContent = `${idx + 1} de ${DATA.length} datos`;
  }

  function next() { show(idx + 1); }
  function random() { show(Math.floor(Math.random() * DATA.length)); }

  function share() {
    const item = DATA[idx];
    if (!item) return;
    const text = `💡 ¿Sabías que...?\n\n${item.text}\n\n— Generación con Propósito`;
    if (navigator.share) navigator.share({text});
    else navigator.clipboard.writeText(text).then(() => GCP.toast('Copiado ✓', 'success'));
  }

  function search(q) {
    const grid = document.getElementById('sabias-grid');
    const card = document.getElementById('sabias-card');
    if (!q) {
      if (grid) grid.style.display = 'none';
      if (card) card.style.display = 'flex';
      return;
    }
    const results = DATA.filter(d => d.text.toLowerCase().includes(q.toLowerCase()));
    if (grid) {
      grid.style.display = 'grid';
      grid.innerHTML = results.map(r => `
        <div class="sabias-grid-item">
          ${r.text}
          ${r.person ? `<div class="sabias-grid-person">— ${r.person}</div>` : ''}
        </div>`).join('');
    }
    if (card) card.style.display = 'none';
  }

  GCP.sabias = { next, random, share, search };

  fetch('sabias.json').then(r => r.json()).then(d => {
    DATA = d.sort(() => Math.random() - 0.5);
    show(0);
  }).catch(e => console.error(e));
})();
