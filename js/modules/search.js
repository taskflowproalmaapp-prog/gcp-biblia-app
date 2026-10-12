/* ═══ MÓDULO: Búsqueda de Versículos ═══ */
(function() {

  const page = document.getElementById('page-search');

  page.innerHTML = `
    <div class="search-wrap">
      <div class="search-header">
        <div class="search-ornament">🔍</div>
        <h2>Buscar en la Biblia</h2>
        <p>Encuentra versículos por palabra, frase o referencia</p>
        <div class="search-input-wrap">
          <input id="search-input" type="text" placeholder="Ej: amor, Juan 3:16, fe y esperanza..."
            onkeydown="if(event.key==='Enter') GCP.search.doSearch()">
          <button onclick="GCP.search.doSearch()">Buscar</button>
        </div>
        <div class="search-suggestions">
          <span>Sugerencias:</span>
          ${['amor','fe','esperanza','perdón','gracia','paz'].map(s =>
            `<button onclick="GCP.search.quick('${s}')">${s}</button>`).join('')}
        </div>
      </div>
      <div id="search-results" class="search-results"></div>
    </div>`;

  const style = document.createElement('style');
  style.textContent = `
    .search-wrap{max-width:800px;margin:0 auto;padding:40px 20px;}
    .search-header{text-align:center;margin-bottom:32px;}
    .search-ornament{font-size:36px;margin-bottom:12px;}
    .search-header h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin-bottom:8px;}
    .search-header p{color:var(--text2);margin-bottom:24px;}
    .search-input-wrap{display:flex;gap:8px;max-width:600px;margin:0 auto 16px;}
    .search-input-wrap input{flex:1;background:var(--surface);border:1px solid rgba(212,175,90,.3);
      color:var(--text);padding:12px 16px;border-radius:8px;font-size:15px;outline:none;}
    .search-input-wrap input:focus{border-color:var(--gold);}
    .search-input-wrap button{background:var(--gold);color:#0B0E14;border:none;padding:12px 24px;
      border-radius:8px;font-weight:600;cursor:pointer;white-space:nowrap;}
    .search-suggestions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;color:var(--text2);font-size:13px;align-items:center;}
    .search-suggestions button{background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.2);
      color:var(--gold);padding:4px 12px;border-radius:20px;cursor:pointer;font-size:12px;}
    .search-results{margin-top:24px;}
    .search-result-card{background:var(--surface);border:1px solid rgba(212,175,90,.1);
      border-radius:var(--r);padding:16px;margin-bottom:12px;transition:all .15s;}
    .search-result-card:hover{border-color:rgba(212,175,90,.3);}
    .search-result-ref{color:var(--gold);font-size:13px;font-weight:600;margin-bottom:6px;}
    .search-result-text{color:var(--text);line-height:1.7;font-size:15px;}
    .search-result-text mark{background:rgba(212,175,90,.25);color:var(--gold);border-radius:2px;padding:0 2px;}
    .search-empty{text-align:center;padding:40px;color:var(--text2);}
    .search-loading{text-align:center;padding:40px;color:var(--text2);}
    .search-ai-btn{display:block;margin:20px auto 0;background:none;border:1px solid rgba(212,175,90,.3);
      color:var(--gold);padding:10px 24px;border-radius:8px;cursor:pointer;font-size:13px;}
    .search-ai-btn:hover{background:rgba(212,175,90,.1);}`;
  document.head.appendChild(style);

  let lastQuery = '';

  async function doSearch() {
    const input = document.getElementById('search-input');
    const q = input.value.trim();
    if (!q) return;
    lastQuery = q;
    const results = document.getElementById('search-results');
    results.innerHTML = '<div class="search-loading">Buscando...</div>';

    try {
      const resp = await fetch(`https://bible-api.com/?q=${encodeURIComponent(q)}&translation=rv1960`);
      const data = await resp.json();
      const verses = data.verses || [];

      if (verses.length === 0) {
        results.innerHTML = `
          <div class="search-empty">
            <p>No se encontraron resultados para "<strong>${q}</strong>"</p>
            <button class="search-ai-btn" onclick="GCP.search.searchWithAI()">
              ✨ Buscar con IA (versículos relacionados)
            </button>
          </div>`;
        return;
      }

      const highlight = (text) => text.replace(
        new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
        m => `<mark>${m}</mark>`
      );

      results.innerHTML = `
        <p style="color:var(--text2);font-size:13px;margin-bottom:16px;">
          ${verses.length} resultados para "<strong style="color:var(--gold)">${q}</strong>"
        </p>
        ${verses.map(v => `
          <div class="search-result-card">
            <div class="search-result-ref">${v.book_name} ${v.chapter}:${v.verse}</div>
            <div class="search-result-text">${highlight(v.text)}</div>
          </div>`).join('')}
        <button class="search-ai-btn" onclick="GCP.search.searchWithAI()">
          ✨ Ver más versículos relacionados con IA
        </button>`;
    } catch(e) {
      results.innerHTML = `<div class="search-empty">Error al buscar. Intenta de nuevo.</div>`;
    }
  }

  async function searchWithAI() {
    const results = document.getElementById('search-results');
    const existing = results.querySelector('.search-ai-btn');
    if (existing) existing.textContent = '✨ Buscando con IA...';

    try {
      const text = await GCP.ai.ask(
        `Busca en la Biblia Reina Valera 1960 versículos sobre: "${lastQuery}". 
        Dame 5 versículos relevantes en formato JSON:
        [{"ref":"Libro cap:vers","text":"versículo completo"}]
        Solo el JSON, sin texto adicional.`
      );
      const verses = JSON.parse(text.replace(/```json|```/g, '').trim());
      const aiSection = document.createElement('div');
      aiSection.innerHTML = `
        <p style="color:var(--text2);font-size:13px;margin:20px 0 12px;">✨ Versículos adicionales con IA:</p>
        ${verses.map(v => `
          <div class="search-result-card">
            <div class="search-result-ref">${v.ref}</div>
            <div class="search-result-text">${v.text}</div>
          </div>`).join('')}`;
      const btn = results.querySelector('.search-ai-btn');
      if (btn) btn.replaceWith(aiSection);
    } catch(e) {
      const btn = results.querySelector('.search-ai-btn');
      if (btn) btn.textContent = 'Error al buscar con IA';
    }
  }

  function quick(term) {
    document.getElementById('search-input').value = term;
    doSearch();
  }

  GCP.search = { doSearch, searchWithAI, quick };

})();
