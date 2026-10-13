/* ═══ MÓDULO: Resúmenes Bíblicos con IA ═══ */
(function() {
  const page = document.getElementById('page-summaries');

  const BOOKS = [
    {id:'gn',name:'Génesis',abbr:'Gn',t:'AT',chapters:50,icon:'👤',author:'Moisés',date:'~1450 a.C.',genre:'Historia'},
    {id:'ex',name:'Éxodo',abbr:'Ex',t:'AT',chapters:40,icon:'⚡',author:'Moisés',date:'~1450 a.C.',genre:'Historia'},
    {id:'lv',name:'Levítico',abbr:'Lv',t:'AT',chapters:27,icon:'⚖️',author:'Moisés',date:'~1445 a.C.',genre:'Ley'},
    {id:'nm',name:'Números',abbr:'Nm',t:'AT',chapters:36,icon:'🔢',author:'Moisés',date:'~1444 a.C.',genre:'Historia'},
    {id:'dt',name:'Deuteronomio',abbr:'Dt',t:'AT',chapters:34,icon:'📜',author:'Moisés',date:'~1406 a.C.',genre:'Ley'},
    {id:'jos',name:'Josué',abbr:'Jos',t:'AT',chapters:24,icon:'⚔️',author:'Josué',date:'~1405 a.C.',genre:'Historia'},
    {id:'jue',name:'Jueces',abbr:'Jue',t:'AT',chapters:21,icon:'🛡️',author:'Samuel',date:'~1050 a.C.',genre:'Historia'},
    {id:'rt',name:'Rut',abbr:'Rt',t:'AT',chapters:4,icon:'🌾',author:'Samuel',date:'~1050 a.C.',genre:'Historia'},
    {id:'1sm',name:'1 Samuel',abbr:'1Sm',t:'AT',chapters:31,icon:'👑',author:'Samuel',date:'~1000 a.C.',genre:'Historia'},
    {id:'2sm',name:'2 Samuel',abbr:'2Sm',t:'AT',chapters:24,icon:'🎵',author:'Natán',date:'~960 a.C.',genre:'Historia'},
    {id:'1re',name:'1 Reyes',abbr:'1Re',t:'AT',chapters:22,icon:'🏛️',author:'Jeremías',date:'~550 a.C.',genre:'Historia'},
    {id:'2re',name:'2 Reyes',abbr:'2Re',t:'AT',chapters:25,icon:'🔥',author:'Jeremías',date:'~550 a.C.',genre:'Historia'},
    {id:'1cr',name:'1 Crónicas',abbr:'1Cr',t:'AT',chapters:29,icon:'📋',author:'Esdras',date:'~450 a.C.',genre:'Historia'},
    {id:'2cr',name:'2 Crónicas',abbr:'2Cr',t:'AT',chapters:36,icon:'📖',author:'Esdras',date:'~450 a.C.',genre:'Historia'},
    {id:'esd',name:'Esdras',abbr:'Esd',t:'AT',chapters:10,icon:'🏗️',author:'Esdras',date:'~450 a.C.',genre:'Historia'},
    {id:'neh',name:'Nehemías',abbr:'Neh',t:'AT',chapters:13,icon:'🧱',author:'Nehemías',date:'~430 a.C.',genre:'Historia'},
    {id:'est',name:'Ester',abbr:'Est',t:'AT',chapters:10,icon:'👸',author:'Mardoqueo',date:'~480 a.C.',genre:'Historia'},
    {id:'job',name:'Job',abbr:'Job',t:'AT',chapters:42,icon:'💔',author:'Desconocido',date:'~2000 a.C.',genre:'Poesía'},
    {id:'sal',name:'Salmos',abbr:'Sal',t:'AT',chapters:150,icon:'🎵',author:'David y otros',date:'~1000 a.C.',genre:'Poesía'},
    {id:'pr',name:'Proverbios',abbr:'Pr',t:'AT',chapters:31,icon:'💡',author:'Salomón',date:'~950 a.C.',genre:'Sabiduría'},
    {id:'ec',name:'Eclesiastés',abbr:'Ec',t:'AT',chapters:12,icon:'🌬️',author:'Salomón',date:'~940 a.C.',genre:'Sabiduría'},
    {id:'cnt',name:'Cantares',abbr:'Cnt',t:'AT',chapters:8,icon:'❤️',author:'Salomón',date:'~950 a.C.',genre:'Poesía'},
    {id:'is',name:'Isaías',abbr:'Is',t:'AT',chapters:66,icon:'📜',author:'Isaías',date:'~700 a.C.',genre:'Profecía'},
    {id:'jer',name:'Jeremías',abbr:'Jer',t:'AT',chapters:52,icon:'😢',author:'Jeremías',date:'~600 a.C.',genre:'Profecía'},
    {id:'lm',name:'Lamentaciones',abbr:'Lm',t:'AT',chapters:5,icon:'💧',author:'Jeremías',date:'~586 a.C.',genre:'Poesía'},
    {id:'ez',name:'Ezequiel',abbr:'Ez',t:'AT',chapters:48,icon:'👁️',author:'Ezequiel',date:'~590 a.C.',genre:'Profecía'},
    {id:'dn',name:'Daniel',abbr:'Dn',t:'AT',chapters:12,icon:'🦁',author:'Daniel',date:'~530 a.C.',genre:'Profecía'},
    {id:'os',name:'Oseas',abbr:'Os',t:'AT',chapters:14,icon:'💒',author:'Oseas',date:'~750 a.C.',genre:'Profecía'},
    {id:'jl',name:'Joel',abbr:'Jl',t:'AT',chapters:3,icon:'🌾',author:'Joel',date:'~835 a.C.',genre:'Profecía'},
    {id:'am',name:'Amós',abbr:'Am',t:'AT',chapters:9,icon:'⚖️',author:'Amós',date:'~760 a.C.',genre:'Profecía'},
    {id:'ab',name:'Abdías',abbr:'Ab',t:'AT',chapters:1,icon:'🏔️',author:'Abdías',date:'~840 a.C.',genre:'Profecía'},
    {id:'jon',name:'Jonás',abbr:'Jon',t:'AT',chapters:4,icon:'🐋',author:'Jonás',date:'~760 a.C.',genre:'Profecía'},
    {id:'mi',name:'Miqueas',abbr:'Mi',t:'AT',chapters:7,icon:'⚖️',author:'Miqueas',date:'~735 a.C.',genre:'Profecía'},
    {id:'nah',name:'Nahúm',abbr:'Nah',t:'AT',chapters:3,icon:'⚡',author:'Nahúm',date:'~650 a.C.',genre:'Profecía'},
    {id:'hab',name:'Habacuc',abbr:'Hab',t:'AT',chapters:3,icon:'🙏',author:'Habacuc',date:'~607 a.C.',genre:'Profecía'},
    {id:'sof',name:'Sofonías',abbr:'Sof',t:'AT',chapters:3,icon:'🔥',author:'Sofonías',date:'~630 a.C.',genre:'Profecía'},
    {id:'hag',name:'Hageo',abbr:'Hag',t:'AT',chapters:2,icon:'🏛️',author:'Hageo',date:'~520 a.C.',genre:'Profecía'},
    {id:'zac',name:'Zacarías',abbr:'Zac',t:'AT',chapters:14,icon:'👁️',author:'Zacarías',date:'~520 a.C.',genre:'Profecía'},
    {id:'mal',name:'Malaquías',abbr:'Mal',t:'AT',chapters:4,icon:'🌅',author:'Malaquías',date:'~430 a.C.',genre:'Profecía'},
    {id:'mt',name:'Mateo',abbr:'Mt',t:'NT',chapters:28,icon:'👑',author:'Mateo',date:'~60 d.C.',genre:'Evangelio'},
    {id:'mr',name:'Marcos',abbr:'Mr',t:'NT',chapters:16,icon:'⚡',author:'Marcos',date:'~65 d.C.',genre:'Evangelio'},
    {id:'lc',name:'Lucas',abbr:'Lc',t:'NT',chapters:24,icon:'🩺',author:'Lucas',date:'~60 d.C.',genre:'Evangelio'},
    {id:'jn',name:'Juan',abbr:'Jn',t:'NT',chapters:21,icon:'✝️',author:'Juan',date:'~90 d.C.',genre:'Evangelio'},
    {id:'hch',name:'Hechos',abbr:'Hch',t:'NT',chapters:28,icon:'🔥',author:'Lucas',date:'~62 d.C.',genre:'Historia'},
    {id:'ro',name:'Romanos',abbr:'Ro',t:'NT',chapters:16,icon:'📜',author:'Pablo',date:'~57 d.C.',genre:'Epístola'},
    {id:'1co',name:'1 Corintios',abbr:'1Co',t:'NT',chapters:16,icon:'💒',author:'Pablo',date:'~55 d.C.',genre:'Epístola'},
    {id:'2co',name:'2 Corintios',abbr:'2Co',t:'NT',chapters:13,icon:'💪',author:'Pablo',date:'~56 d.C.',genre:'Epístola'},
    {id:'ga',name:'Gálatas',abbr:'Ga',t:'NT',chapters:6,icon:'🕊️',author:'Pablo',date:'~49 d.C.',genre:'Epístola'},
    {id:'ef',name:'Efesios',abbr:'Ef',t:'NT',chapters:6,icon:'🛡️',author:'Pablo',date:'~62 d.C.',genre:'Epístola'},
    {id:'flp',name:'Filipenses',abbr:'Flp',t:'NT',chapters:4,icon:'😊',author:'Pablo',date:'~62 d.C.',genre:'Epístola'},
    {id:'col',name:'Colosenses',abbr:'Col',t:'NT',chapters:4,icon:'👑',author:'Pablo',date:'~62 d.C.',genre:'Epístola'},
    {id:'1ts',name:'1 Tesalonicenses',abbr:'1Ts',t:'NT',chapters:5,icon:'🌅',author:'Pablo',date:'~51 d.C.',genre:'Epístola'},
    {id:'2ts',name:'2 Tesalonicenses',abbr:'2Ts',t:'NT',chapters:3,icon:'⏰',author:'Pablo',date:'~52 d.C.',genre:'Epístola'},
    {id:'1ti',name:'1 Timoteo',abbr:'1Ti',t:'NT',chapters:6,icon:'👨‍💼',author:'Pablo',date:'~62 d.C.',genre:'Epístola'},
    {id:'2ti',name:'2 Timoteo',abbr:'2Ti',t:'NT',chapters:4,icon:'🔥',author:'Pablo',date:'~67 d.C.',genre:'Epístola'},
    {id:'tit',name:'Tito',abbr:'Tit',t:'NT',chapters:3,icon:'⚓',author:'Pablo',date:'~63 d.C.',genre:'Epístola'},
    {id:'flm',name:'Filemón',abbr:'Flm',t:'NT',chapters:1,icon:'🤝',author:'Pablo',date:'~62 d.C.',genre:'Epístola'},
    {id:'heb',name:'Hebreos',abbr:'Heb',t:'NT',chapters:13,icon:'✝️',author:'Desconocido',date:'~68 d.C.',genre:'Epístola'},
    {id:'stg',name:'Santiago',abbr:'Stg',t:'NT',chapters:5,icon:'🙌',author:'Santiago',date:'~49 d.C.',genre:'Epístola'},
    {id:'1pe',name:'1 Pedro',abbr:'1Pe',t:'NT',chapters:5,icon:'🪨',author:'Pedro',date:'~64 d.C.',genre:'Epístola'},
    {id:'2pe',name:'2 Pedro',abbr:'2Pe',t:'NT',chapters:3,icon:'⚠️',author:'Pedro',date:'~66 d.C.',genre:'Epístola'},
    {id:'1jn',name:'1 Juan',abbr:'1Jn',t:'NT',chapters:5,icon:'❤️',author:'Juan',date:'~90 d.C.',genre:'Epístola'},
    {id:'2jn',name:'2 Juan',abbr:'2Jn',t:'NT',chapters:1,icon:'✉️',author:'Juan',date:'~90 d.C.',genre:'Epístola'},
    {id:'3jn',name:'3 Juan',abbr:'3Jn',t:'NT',chapters:1,icon:'👋',author:'Juan',date:'~90 d.C.',genre:'Epístola'},
    {id:'jud',name:'Judas',abbr:'Jud',t:'NT',chapters:1,icon:'⚔️',author:'Judas',date:'~65 d.C.',genre:'Epístola'},
    {id:'ap',name:'Apocalipsis',abbr:'Ap',t:'NT',chapters:22,icon:'🌟',author:'Juan',date:'~95 d.C.',genre:'Profecía'},
  ];

  let state = { testament: 'ALL', active: null };

  const style = document.createElement('style');
  style.textContent = `
    .sum-wrap{display:flex;height:calc(100vh - 56px);}
    .sum-sidebar{width:230px;flex-shrink:0;background:var(--surface);
      border-right:1px solid rgba(212,175,90,.1);overflow-y:auto;padding:12px 0;}
    .sum-filter{display:flex;gap:4px;padding:0 12px 12px;border-bottom:1px solid rgba(212,175,90,.1);}
    .sum-filter-btn{flex:1;background:none;border:1px solid rgba(212,175,90,.2);
      color:var(--text2);padding:5px;border-radius:6px;cursor:pointer;font-size:12px;transition:all .15s;}
    .sum-filter-btn.active{background:rgba(212,175,90,.15);color:var(--gold);border-color:var(--gold);}
    .sum-book-item{padding:8px 16px;cursor:pointer;font-size:13px;color:var(--text2);
      transition:all .15s;border-left:3px solid transparent;display:flex;align-items:center;gap:8px;}
    .sum-book-item:hover{color:var(--text);background:rgba(212,175,90,.05);}
    .sum-book-item.active{color:var(--gold);border-left-color:var(--gold);background:rgba(212,175,90,.08);}
    .sum-book-icon{font-size:14px;}
    .sum-main{flex:1;overflow-y:auto;padding:28px;}
    .sum-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;
      min-height:70%;text-align:center;color:var(--text2);}
    .sum-welcome h2{font-family:Georgia,serif;font-size:24px;color:var(--gold);margin:12px 0 8px;}
    .sum-header{display:flex;align-items:center;gap:16px;margin-bottom:24px;}
    .sum-header-icon{font-size:44px;}
    .sum-header-title{font-family:Georgia,serif;font-size:26px;color:var(--gold);}
    .sum-header-meta{color:var(--text2);font-size:13px;margin-top:4px;}
    .sum-section{background:var(--surface);border-radius:var(--r);padding:20px;margin-bottom:14px;}
    .sum-section-label{color:var(--gold);font-size:11px;font-weight:700;letter-spacing:1px;
      text-transform:uppercase;margin-bottom:10px;}
    .sum-section p{color:var(--text);line-height:1.75;font-size:14px;text-align:justify;}
    .sum-verse{border-left:3px solid rgba(212,175,90,.5);padding-left:12px;margin-bottom:12px;}
    .sum-verse-ref{color:var(--gold);font-size:12px;font-weight:700;margin-bottom:3px;}
    .sum-verse-text{color:var(--text);font-style:italic;font-size:13px;line-height:1.6;}
    .sum-curiosity{background:rgba(212,175,90,.06);border-radius:6px;padding:10px 14px;
      margin-bottom:8px;font-size:13px;color:var(--text);display:flex;gap:8px;}
    .sum-ai-loading{text-align:center;padding:40px;color:var(--text2);}
    .sum-ai-loading p{margin-top:12px;font-size:14px;}
    .sum-ai-loading small{font-size:12px;opacity:.7;display:block;margin-top:4px;}
    @media(max-width:600px){.sum-sidebar{width:160px;}.sum-main{padding:16px;}}`;
  document.head.appendChild(style);

  page.innerHTML = `
    <div class="sum-wrap">
      <aside class="sum-sidebar">
        <div class="sum-filter">
          <button class="sum-filter-btn active" onclick="GCP.summaries.setT('ALL')">Todos</button>
          <button class="sum-filter-btn" onclick="GCP.summaries.setT('AT')">AT</button>
          <button class="sum-filter-btn" onclick="GCP.summaries.setT('NT')">NT</button>
        </div>
        <div id="sum-list"></div>
      </aside>
      <div id="sum-main" class="sum-main">
        <div class="sum-welcome">
          <div style="font-size:48px">📚</div>
          <h2>Resúmenes Bíblicos</h2>
          <p>Selecciona un libro para ver su análisis completo generado por IA</p>
        </div>
      </div>
    </div>`;

  function renderList() {
    const list = document.getElementById('sum-list');
    if (!list) return;
    const filtered = state.testament === 'ALL' ? BOOKS : BOOKS.filter(b => b.t === state.testament);
    list.innerHTML = filtered.map(b => `
      <div class="sum-book-item ${state.active === b.id ? 'active' : ''}"
           onclick="GCP.summaries.open('${b.id}')">
        <span class="sum-book-icon">${b.icon}</span>
        ${b.name}
      </div>`).join('');
  }

  async function open(id) {
    const book = BOOKS.find(b => b.id === id);
    if (!book) return;
    state.active = id;
    renderList();

    const main = document.getElementById('sum-main');
    main.innerHTML = `
      <div class="sum-header">
        <div class="sum-header-icon">${book.icon}</div>
        <div>
          <div class="sum-header-title">${book.name}</div>
          <div class="sum-header-meta">${book.author} · ${book.date} · ${book.genre} · ${book.chapters} capítulos</div>
        </div>
      </div>
      <div class="sum-ai-loading">
        <div class="spinner"></div>
        <p>✨ Generando análisis con IA...</p>
        <small>Solo la primera vez — luego queda guardado</small>
      </div>`;
    // Guardar texto para botón escuchar (evita problema de comillas en onclick)
    window._sumText = [book.name, deep.whatHappens||'', deep.context||'',
      deep.godPurpose||'', deep.practicalLessons||'', deep.christConnection||'',
      (deep.keyVerses||[]).map(v=>v.ref+'. '+v.text).join('. ')
    ].filter(Boolean).join('. ');
    window._sumTitle = 'Resumen de ' + book.name;
    main.scrollTop = 0;

    const cached = GCP.ai.cache.get('sum_' + id);
    const deep = cached || await GCP.ai.askJSON(
      `Eres experto en Biblia Reina Valera 1960. Analiza el libro de ${book.name}.
Responde SOLO con este JSON válido, sin texto extra:
{"whatHappens":"qué ocurre (3-4 oraciones)","context":"contexto histórico (2-3 oraciones)",
"godPurpose":"propósito de Dios (2-3 oraciones)","practicalLessons":"3 lecciones prácticas hoy",
"christConnection":"conexión con Cristo (2-3 oraciones)",
"keyVerses":[{"ref":"Libro cap:vers","text":"versículo exacto RV1960"},{"ref":"Libro cap:vers","text":"versículo exacto RV1960"},{"ref":"Libro cap:vers","text":"versículo exacto RV1960"}],
"curiosities":["dato curioso 1","dato curioso 2","dato curioso 3"]}`, 1000);

    if (!cached && deep) GCP.ai.cache.set('sum_' + id, deep);

    if (!deep) {
      main.querySelector('.sum-ai-loading').innerHTML = '<p style="color:#e57373">⚠️ Error al generar. Intenta de nuevo.</p>';
      return;
    }

    main.innerHTML = `
      <div class="sum-header">
        <div class="sum-header-icon">${book.icon}</div>
        <div>
          <div class="sum-header-title">${book.name}</div>
          <div class="sum-header-meta">${book.author} · ${book.date} · ${book.genre}</div>
        </div>
      </div>
      <div class="sum-section"><div class="sum-section-label">📖 ¿Qué ocurre?</div><p>${deep.whatHappens||''}</p></div>
      <div class="sum-section"><div class="sum-section-label">🌍 Contexto histórico</div><p>${deep.context||''}</p></div>
      <div class="sum-section"><div class="sum-section-label">🎯 Propósito de Dios</div><p>${deep.godPurpose||''}</p></div>
      <div class="sum-section"><div class="sum-section-label">💡 Lecciones prácticas</div><p>${deep.practicalLessons||''}</p></div>
      <div class="sum-section"><div class="sum-section-label">✝️ Conexión con Cristo</div><p>${deep.christConnection||''}</p></div>
      ${deep.keyVerses ? `<div class="sum-section"><div class="sum-section-label">📌 Versículos clave</div>
        ${deep.keyVerses.map(v=>`<div class="sum-verse"><div class="sum-verse-ref">${v.ref}</div><div class="sum-verse-text">"${v.text}"</div></div>`).join('')}</div>` : ''}
      ${deep.curiosities ? `<div class="sum-section"><div class="sum-section-label">💎 Datos curiosos</div>
        ${deep.curiosities.map(c=>`<div class="sum-curiosity">✦ ${c}</div>`).join('')}</div>` : ''}
      <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="theme-btn theme-btn-primary" onclick="GCP.router.go('reader')">📖 Leer ${book.name}</button>
        <button class="theme-btn" onclick="GCP.speak.text(window._sumText,window._sumTitle)">
          🔊 Escuchar resumen
        </button>
      </div>`;
  }

  function setT(t) {
    state.testament = t;
    document.querySelectorAll('.sum-filter-btn').forEach((b,i)=>b.classList.toggle('active',['ALL','AT','NT'][i]===t));
    renderList();
  }

  GCP.summaries = { open, setT };
  renderList();
})();
