/* ═══ MÓDULO: Lector de la Biblia RV1960 ═══ */
(function() {

  const page = document.getElementById('page-reader');

  /* Estructura de libros (básica, sin texto) */
  const BOOKS = [
    {id:'gn',name:'Génesis',t:'AT',chapters:50,abbr:'Gn'},
    {id:'ex',name:'Éxodo',t:'AT',chapters:40,abbr:'Ex'},
    {id:'lv',name:'Levítico',t:'AT',chapters:27,abbr:'Lv'},
    {id:'nm',name:'Números',t:'AT',chapters:36,abbr:'Nm'},
    {id:'dt',name:'Deuteronomio',t:'AT',chapters:34,abbr:'Dt'},
    {id:'jos',name:'Josué',t:'AT',chapters:24,abbr:'Jos'},
    {id:'jue',name:'Jueces',t:'AT',chapters:21,abbr:'Jue'},
    {id:'rt',name:'Rut',t:'AT',chapters:4,abbr:'Rt'},
    {id:'1sm',name:'1 Samuel',t:'AT',chapters:31,abbr:'1Sm'},
    {id:'2sm',name:'2 Samuel',t:'AT',chapters:24,abbr:'2Sm'},
    {id:'1re',name:'1 Reyes',t:'AT',chapters:22,abbr:'1Re'},
    {id:'2re',name:'2 Reyes',t:'AT',chapters:25,abbr:'2Re'},
    {id:'1cr',name:'1 Crónicas',t:'AT',chapters:29,abbr:'1Cr'},
    {id:'2cr',name:'2 Crónicas',t:'AT',chapters:36,abbr:'2Cr'},
    {id:'esd',name:'Esdras',t:'AT',chapters:10,abbr:'Esd'},
    {id:'neh',name:'Nehemías',t:'AT',chapters:13,abbr:'Neh'},
    {id:'est',name:'Ester',t:'AT',chapters:10,abbr:'Est'},
    {id:'job',name:'Job',t:'AT',chapters:42,abbr:'Job'},
    {id:'sal',name:'Salmos',t:'AT',chapters:150,abbr:'Sal'},
    {id:'pr',name:'Proverbios',t:'AT',chapters:31,abbr:'Pr'},
    {id:'ec',name:'Eclesiastés',t:'AT',chapters:12,abbr:'Ec'},
    {id:'cnt',name:'Cantares',t:'AT',chapters:8,abbr:'Cnt'},
    {id:'is',name:'Isaías',t:'AT',chapters:66,abbr:'Is'},
    {id:'jer',name:'Jeremías',t:'AT',chapters:52,abbr:'Jer'},
    {id:'lm',name:'Lamentaciones',t:'AT',chapters:5,abbr:'Lm'},
    {id:'ez',name:'Ezequiel',t:'AT',chapters:48,abbr:'Ez'},
    {id:'dn',name:'Daniel',t:'AT',chapters:12,abbr:'Dn'},
    {id:'os',name:'Oseas',t:'AT',chapters:14,abbr:'Os'},
    {id:'jl',name:'Joel',t:'AT',chapters:3,abbr:'Jl'},
    {id:'am',name:'Amós',t:'AT',chapters:9,abbr:'Am'},
    {id:'ab',name:'Abdías',t:'AT',chapters:1,abbr:'Ab'},
    {id:'jon',name:'Jonás',t:'AT',chapters:4,abbr:'Jon'},
    {id:'mi',name:'Miqueas',t:'AT',chapters:7,abbr:'Mi'},
    {id:'nah',name:'Nahúm',t:'AT',chapters:3,abbr:'Nah'},
    {id:'hab',name:'Habacuc',t:'AT',chapters:3,abbr:'Hab'},
    {id:'sof',name:'Sofonías',t:'AT',chapters:3,abbr:'Sof'},
    {id:'hag',name:'Hageo',t:'AT',chapters:2,abbr:'Hag'},
    {id:'zac',name:'Zacarías',t:'AT',chapters:14,abbr:'Zac'},
    {id:'mal',name:'Malaquías',t:'AT',chapters:4,abbr:'Mal'},
    {id:'mt',name:'Mateo',t:'NT',chapters:28,abbr:'Mt'},
    {id:'mr',name:'Marcos',t:'NT',chapters:16,abbr:'Mr'},
    {id:'lc',name:'Lucas',t:'NT',chapters:24,abbr:'Lc'},
    {id:'jn',name:'Juan',t:'NT',chapters:21,abbr:'Jn'},
    {id:'hch',name:'Hechos',t:'NT',chapters:28,abbr:'Hch'},
    {id:'ro',name:'Romanos',t:'NT',chapters:16,abbr:'Ro'},
    {id:'1co',name:'1 Corintios',t:'NT',chapters:16,abbr:'1Co'},
    {id:'2co',name:'2 Corintios',t:'NT',chapters:13,abbr:'2Co'},
    {id:'ga',name:'Gálatas',t:'NT',chapters:6,abbr:'Ga'},
    {id:'ef',name:'Efesios',t:'NT',chapters:6,abbr:'Ef'},
    {id:'flp',name:'Filipenses',t:'NT',chapters:4,abbr:'Flp'},
    {id:'col',name:'Colosenses',t:'NT',chapters:4,abbr:'Col'},
    {id:'1ts',name:'1 Tesalonicenses',t:'NT',chapters:5,abbr:'1Ts'},
    {id:'2ts',name:'2 Tesalonicenses',t:'NT',chapters:3,abbr:'2Ts'},
    {id:'1ti',name:'1 Timoteo',t:'NT',chapters:6,abbr:'1Ti'},
    {id:'2ti',name:'2 Timoteo',t:'NT',chapters:4,abbr:'2Ti'},
    {id:'tit',name:'Tito',t:'NT',chapters:3,abbr:'Tit'},
    {id:'flm',name:'Filemón',t:'NT',chapters:1,abbr:'Flm'},
    {id:'heb',name:'Hebreos',t:'NT',chapters:13,abbr:'Heb'},
    {id:'stg',name:'Santiago',t:'NT',chapters:5,abbr:'Stg'},
    {id:'1pe',name:'1 Pedro',t:'NT',chapters:5,abbr:'1Pe'},
    {id:'2pe',name:'2 Pedro',t:'NT',chapters:3,abbr:'2Pe'},
    {id:'1jn',name:'1 Juan',t:'NT',chapters:5,abbr:'1Jn'},
    {id:'2jn',name:'2 Juan',t:'NT',chapters:1,abbr:'2Jn'},
    {id:'3jn',name:'3 Juan',t:'NT',chapters:1,abbr:'3Jn'},
    {id:'jud',name:'Judas',t:'NT',chapters:1,abbr:'Jud'},
    {id:'ap',name:'Apocalipsis',t:'NT',chapters:22,abbr:'Ap'},
  ];

  let state = { book: null, chapter: 1, testament: 'ALL' };

  /* Render inicial */
  page.innerHTML = `
      <div class="mob-sidebar-overlay" id="reader-overlay" onclick="GCP.reader.closeSidebar()"></div>
      <div class="mob-bar">
        <button class="mob-bar-btn" onclick="GCP.reader.toggleSidebar()">☰ Libros</button>
        <span class="mob-bar-title" id="reader-bar-title">Selecciona un libro</span>
      </div>
    <div class="reader-wrap">
      <aside class="reader-sidebar" id="reader-sidebar">
        <div class="reader-filter">
          <button class="reader-filter-btn active" onclick="GCP.reader.setTestament('ALL')">Todos</button>
          <button class="reader-filter-btn" onclick="GCP.reader.setTestament('AT')">Antiguo</button>
          <button class="reader-filter-btn" onclick="GCP.reader.setTestament('NT')">Nuevo</button>
        </div>
        <div class="reader-book-list" id="reader-book-list"></div>
      </aside>
      <div class="reader-main" id="reader-main">
        <div class="reader-welcome">
          <div style="font-size:48px;margin-bottom:16px;">📖</div>
          <h2 style="color:var(--gold);font-family:Georgia,serif;margin-bottom:8px;">Biblia Reina Valera 1960</h2>
          <p style="color:var(--text2);">Selecciona un libro para comenzar a leer</p>
        </div>
      </div>
    </div>`;

  /* CSS del módulo */
  const style = document.createElement('style');
  style.textContent = `
    .reader-wrap{display:flex;height:calc(100vh - 56px);}
    @media(max-width:700px){
      .reader-sidebar,.chars-sidebar,.sum-sidebar{
        position:fixed!important;top:56px!important;
        left:-100%!important;bottom:0!important;
        width:82vw!important;max-width:290px!important;
        z-index:300!important;
        transition:left .25s cubic-bezier(.4,0,.2,1)!important;
        box-shadow:4px 0 30px rgba(0,0,0,.8)!important;
        overflow-y:auto!important;
      }
      .reader-sidebar.mob-open,.chars-sidebar.mob-open,.sum-sidebar.mob-open{
        left:0!important;
      }
      .reader-main,.chars-main,.sum-main{
        width:100%!important;padding:14px!important;
      }
      .reader-wrap,.chars-wrap,.sum-wrap{
        flex-direction:column!important;
        height:auto!important;
      }
    }
    .reader-sidebar{width:220px;flex-shrink:0;background:var(--surface);
      border-right:1px solid rgba(212,175,90,.1);overflow-y:auto;padding:12px 0;}
    .reader-filter{display:flex;gap:4px;padding:0 12px 12px;border-bottom:1px solid rgba(212,175,90,.1);}
    .reader-filter-btn{flex:1;background:none;border:1px solid rgba(212,175,90,.2);
      color:var(--text2);padding:5px;border-radius:6px;cursor:pointer;font-size:12px;transition:all .15s;}
    .reader-filter-btn.active{background:rgba(212,175,90,.15);color:var(--gold);border-color:var(--gold);}
    .reader-book-item{padding:8px 16px;cursor:pointer;font-size:13px;color:var(--text2);
      transition:all .15s;border-left:2px solid transparent;}
    .reader-book-item:hover{color:var(--text);background:rgba(212,175,90,.05);}
    .reader-book-item.active{color:var(--gold);border-left-color:var(--gold);background:rgba(212,175,90,.08);}
    .reader-main{flex:1;overflow-y:auto;padding:24px;}
    .reader-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;
      min-height:60%;text-align:center;}
    .reader-chapter-nav{display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap;}
    .reader-chapter-nav button{background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.2);
      color:var(--gold);padding:6px 14px;border-radius:6px;cursor:pointer;font-size:13px;transition:all .15s;}
    .reader-chapter-nav button:hover{background:rgba(212,175,90,.2);}
    .reader-chapter-nav select{background:var(--surface);color:var(--text);border:1px solid rgba(212,175,90,.2);
      padding:6px 10px;border-radius:6px;font-size:13px;}
    .reader-book-title{font-family:Georgia,serif;font-size:22px;color:var(--gold);margin-bottom:4px;}
    .reader-chapter-title{color:var(--text2);font-size:13px;margin-bottom:20px;}
    .reader-verses{max-width:700px;}
    .reader-verse{display:flex;gap:10px;padding:4px 0;line-height:1.8;font-size:15px;}
    .reader-verse-num{color:var(--gold);font-size:11px;font-weight:700;min-width:24px;margin-top:4px;}
    .reader-verse-text{color:var(--text);}
    .reader-loading{color:var(--text2);padding:40px 0;text-align:center;}
    @media(max-width:600px){
      .reader-sidebar{width:160px;}
      .reader-main{padding:16px;}
    }`;
  document.head.appendChild(style);

  function renderBookList() {
    const list = document.getElementById('reader-book-list');
    if (!list) return;
    const filtered = state.testament === 'ALL' ? BOOKS : BOOKS.filter(b => b.t === state.testament);
    list.innerHTML = filtered.map(b => `
      <div class="reader-book-item ${state.book === b.id ? 'active' : ''}"
           onclick="GCP.reader.openBook('${b.id}')">
        ${b.name}
      </div>`).join('');
  }

  async function openBook(id) {
    state.book = id;
    state.chapter = 1;
    renderBookList();
    await renderChapter();
  }

  async function renderChapter() {
    const main = document.getElementById('reader-main');
    const book = BOOKS.find(b => b.id === state.book);
    if (!book || !main) return;

    main.innerHTML = `<div class="reader-loading">Cargando ${book.name} ${state.chapter}...</div>`;

    /* Cargar versículos desde la API de la Biblia */
    try {
      /* Cargar versículos desde la Biblia local RV1960 */
      let verses = [];
      try {
        if (!window._BIBLE_DATA) {
          const resp = await fetch('bible.json');
          window._BIBLE_DATA = await resp.json();
        }
        const key = book.id + '-' + state.chapter;
        const rawVerses = window._BIBLE_DATA[key] || [];
        verses = rawVerses.map((text, i) => ({ verse: i + 1, text }));
      } catch(e) {
        console.error('Error cargando Biblia:', e);
        verses = [];
      }

      const chapSelect = Array.from({length: book.chapters}, (_, i) => i + 1)
        .map(c => `<option value="${c}" ${c === state.chapter ? 'selected' : ''}>Capítulo ${c}</option>`)
        .join('');

      main.innerHTML = `
        <div class="reader-chapter-nav">
          <button onclick="GCP.reader.prevChapter()">‹ Anterior</button>
          <select onchange="GCP.reader.goToChapter(parseInt(this.value))">${chapSelect}</select>
          <button onclick="GCP.reader.nextChapter()">Siguiente ›</button>
        </div>
        <div class="reader-book-title">${book.name}</div>
        <div class="reader-chapter-title">Capítulo ${state.chapter} de ${book.chapters}</div>
        <div class="reader-verses">
          ${verses.map(v => `
            <div class="reader-verse">
              <span class="reader-verse-num">${v.verse}</span>
              <span class="reader-verse-text">${v.text}</span>
            </div>`).join('')}
        </div>`;

      GCP.storage.set('reader_book', state.book);
      GCP.storage.set('reader_chapter', state.chapter.toString());
    } catch(e) {
      main.innerHTML = `
        <div class="reader-loading">
          <p>Error al cargar el capítulo.</p>
          <button class="btn btn-outline" onclick="GCP.reader.renderChapter()" style="margin-top:12px">Reintentar</button>
        </div>`;
    }
  }

  function prevChapter() {
    if (state.chapter > 1) { state.chapter--; renderChapter(); }
  }
  function nextChapter() {
    const book = BOOKS.find(b => b.id === state.book);
    if (book && state.chapter < book.chapters) { state.chapter++; renderChapter(); }
  }
  function goToChapter(n) { state.chapter = n; renderChapter(); }
  function setTestament(t) {
    state.testament = t;
    document.querySelectorAll('.reader-filter-btn').forEach((b, i) => {
      b.classList.toggle('active', ['ALL','AT','NT'][i] === t);
    });
    renderBookList();
  }

  /* Exponer API pública */
  function toggleSidebar() {
    const sb = document.getElementById('reader-sidebar');
    const ov = document.getElementById('reader-overlay');
    const cl = document.getElementById('reader-close-btn');
    if (!sb) return;
    const isOpen = sb.classList.toggle('mob-open');
    if (ov) ov.classList.toggle('show', isOpen);
    if (cl) cl.style.display = isOpen ? 'block' : 'none';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  function closeSidebar() {
    const sb = document.getElementById('reader-sidebar');
    const ov = document.getElementById('reader-overlay');
    const cl = document.getElementById('reader-close-btn');
    if (sb) sb.classList.remove('mob-open');
    if (ov) ov.classList.remove('show');
    if (cl) cl.style.display = 'none';
    document.body.style.overflow = '';
  }

  GCP.reader = { toggleSidebar, closeSidebar, openBook, renderChapter, prevChapter, nextChapter, goToChapter, setTestament };

  /* Init: restaurar última posición */
  renderBookList();
  const lastBook = GCP.storage.get('reader_book');
  const lastChap = GCP.storage.get('reader_chapter');
  if (lastBook) {
    state.book = lastBook;
    state.chapter = parseInt(lastChap) || 1;
    renderBookList();
    renderChapter();
  }

})();
