/* ═══ MÓDULO: Proyección de Versículos ═══ */
(function() {
  const page = document.getElementById('page-projection');

  const style = document.createElement('style');
  style.textContent = `
    .proj-wrap{max-width:900px;margin:0 auto;padding:28px 20px;}
    .proj-hero{text-align:center;margin-bottom:28px;}
    .proj-hero h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin:12px 0 8px;}
    .proj-hero p{color:var(--text2);font-size:14px;}
    .proj-input-section{background:var(--surface);border-radius:var(--r);padding:20px;margin-bottom:20px;}
    .proj-label{color:var(--gold);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;}
    .proj-input{width:100%;background:var(--ink);border:1px solid rgba(212,175,90,.2);
      color:var(--text);padding:10px 14px;border-radius:8px;font-size:14px;outline:none;margin-bottom:10px;}
    .proj-input:focus{border-color:var(--gold);}
    .proj-textarea{width:100%;background:var(--ink);border:1px solid rgba(212,175,90,.2);
      color:var(--text);padding:10px 14px;border-radius:8px;font-size:14px;outline:none;
      resize:vertical;min-height:80px;font-family:Georgia,serif;}
    .proj-textarea:focus{border-color:var(--gold);}
    .proj-actions{display:flex;gap:10px;flex-wrap:wrap;}
    .proj-btn{background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.2);
      color:var(--gold);padding:10px 18px;border-radius:8px;cursor:pointer;font-size:13px;
      font-weight:600;transition:all .15s;}
    .proj-btn:hover{background:rgba(212,175,90,.2);}
    .proj-btn-primary{background:var(--gold);color:#0B0E14;border-color:var(--gold);}
    .proj-btn-primary:hover{background:var(--gold-light);}
    .proj-themes{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}
    .proj-theme-chip{background:rgba(212,175,90,.08);border:1px solid rgba(212,175,90,.15);
      color:var(--text2);padding:4px 12px;border-radius:20px;cursor:pointer;font-size:12px;transition:all .15s;}
    .proj-theme-chip:hover{color:var(--gold);border-color:var(--gold);}
    /* Pantalla de proyección */
    .proj-screen{position:fixed;inset:0;background:#000;z-index:9999;display:none;
      flex-direction:column;align-items:center;justify-content:center;padding:60px;cursor:pointer;}
    .proj-screen.active{display:flex;}
    .proj-screen-verse{font-family:Georgia,serif;font-size:clamp(24px,4vw,56px);
      color:#fff;text-align:center;line-height:1.4;max-width:900px;font-style:italic;margin-bottom:24px;}
    .proj-screen-ref{color:var(--gold);font-size:clamp(16px,2vw,28px);font-weight:600;letter-spacing:1px;}
    .proj-screen-hint{position:absolute;bottom:20px;color:rgba(255,255,255,.3);font-size:13px;}
    .proj-screen-controls{position:absolute;top:20px;right:20px;display:flex;gap:8px;}
    .proj-screen-btn{background:rgba(255,255,255,.1);border:none;color:#fff;
      padding:8px 14px;border-radius:6px;cursor:pointer;font-size:13px;transition:all .15s;}
    .proj-screen-btn:hover{background:rgba(255,255,255,.2);}`;
  document.head.appendChild(style);

  const quickVerses = [
    {ref:'Juan 3:16',text:'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.'},
    {ref:'Filipenses 4:13',text:'Todo lo puedo en Cristo que me fortalece.'},
    {ref:'Jeremías 29:11',text:'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.'},
    {ref:'Salmos 23:1',text:'Jehová es mi pastor; nada me faltará.'},
    {ref:'Romanos 8:28',text:'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.'},
    {ref:'Isaías 40:31',text:'Los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.'},
  ];

  page.innerHTML = `
    <div class="proj-wrap">
      <div class="proj-hero">
        <div style="font-size:48px">📽️</div>
        <h2>Proyección de Versículos</h2>
        <p>Proyecta versículos en pantalla completa para iglesias y grupos</p>
      </div>

      <div class="proj-input-section">
        <div class="proj-label">Versículos rápidos</div>
        <div class="proj-themes">
          ${quickVerses.map(v=>`<span class="proj-theme-chip" onclick="GCP.projection.setVerse('${v.ref}','${v.text.replace(/'/g,"\\'")}')">
            ${v.ref}</span>`).join('')}
        </div>
      </div>

      <div class="proj-input-section">
        <div class="proj-label">Personalizar</div>
        <input class="proj-input" id="proj-ref" placeholder="Referencia (ej: Juan 3:16)" type="text">
        <textarea class="proj-textarea" id="proj-text" placeholder="Texto del versículo..."></textarea>
        <div class="proj-actions" style="margin-top:10px">
          <button class="proj-btn" onclick="GCP.projection.searchVerse()">🔍 Buscar versículo</button>
          <button class="proj-btn proj-btn-primary" onclick="GCP.projection.project()">📽️ Proyectar</button>
        </div>
      </div>

      <div class="proj-input-section">
        <div class="proj-label">✨ Buscar con IA por tema</div>
        <input class="proj-input" id="proj-ai-input" placeholder="Ej: versículo sobre esperanza para proyectar hoy" type="text">
        <button class="proj-btn proj-btn-primary" onclick="GCP.projection.aiSearch()" style="width:100%">Buscar con IA</button>
      </div>
    </div>

    <div class="proj-screen" id="proj-screen" onclick="GCP.projection.close()">
      <div class="proj-screen-controls">
        <button class="proj-screen-btn" onclick="event.stopPropagation();GCP.projection.toggleBg()">🌓 Fondo</button>
        <button class="proj-screen-btn" onclick="event.stopPropagation();GCP.projection.close()">✕ Cerrar</button>
      </div>
      <div class="proj-screen-verse" id="proj-screen-verse"></div>
      <div class="proj-screen-ref" id="proj-screen-ref"></div>
      <div class="proj-screen-hint">Toca para cerrar · ESC para salir</div>
    </div>`;

  let bgDark = true;

  function setVerse(ref, text) {
    document.getElementById('proj-ref').value = ref;
    document.getElementById('proj-text').value = text;
  }

  function project() {
    const ref = document.getElementById('proj-ref').value.trim();
    const text = document.getElementById('proj-text').value.trim();
    if (!text) { GCP.toast('Escribe o busca un versículo primero'); return; }
    document.getElementById('proj-screen-verse').textContent = `"${text}"`;
    document.getElementById('proj-screen-ref').textContent = `— ${ref}`;
    document.getElementById('proj-screen').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    document.getElementById('proj-screen').classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleBg() {
    bgDark = !bgDark;
    document.getElementById('proj-screen').style.background = bgDark ? '#000' : '#1a0a00';
  }

  async function searchVerse() {
    const ref = document.getElementById('proj-ref').value.trim();
    if (!ref) { GCP.toast('Escribe una referencia primero'); return; }
    GCP.toast('Buscando...');
    try {
      const resp = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=rv1960`);
      const data = await resp.json();
      if (data.text) document.getElementById('proj-text').value = data.text.trim();
    } catch(e) { GCP.toast('Error al buscar el versículo', 'error'); }
  }

  async function aiSearch() {
    const q = document.getElementById('proj-ai-input').value.trim();
    if (!q) return;
    GCP.toast('Buscando con IA...');
    try {
      const result = await GCP.ai.askJSON(
        `Encuentra el versículo bíblico más adecuado para proyectar en una iglesia sobre: "${q}".
Responde SOLO con JSON: {"ref":"Libro cap:vers","text":"versículo exacto RV1960"}`, 300);
      if (result) setVerse(result.ref, result.text);
    } catch(e) { GCP.toast('Error con IA', 'error'); }
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  GCP.projection = { project, close, toggleBg, setVerse, searchVerse, aiSearch };
})();
