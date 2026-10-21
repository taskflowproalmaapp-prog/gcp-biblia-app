/* ═══ MÓDULO: Personajes Bíblicos ═══ */
(function() {
  const page = document.getElementById('page-personajes');
  let DATA = [], _filterT = 'ALL', searchQ = '', activeId = null;

  const GROUP_LABELS = {
    jesus:'Jesucristo', patriarcas:'Patriarcas y Antepasados',
    jueces:'Jueces y Libertadores', reyes:'Reyes y Gobernantes',
    prof_hist:'Profetas Históricos', prof_may:'Profetas Mayores',
    prof_men:'Profetas Menores', mujeres:'Mujeres de Fe',
    exilio:'Exilio y Restauración', familia_jesus:'Familia y Entorno de Jesús',
    apostoles:'Apóstoles y Discípulos', companeros:'Compañeros y Aliados Clave',
    antagonistas:'Antagonistas y Opositores', espirituales:'Seres Espirituales'
  };
  const GROUP_ORDER = ['jesus','patriarcas','jueces','reyes','prof_hist','prof_may',
    'prof_men','mujeres','exilio','familia_jesus','apostoles','companeros','antagonistas','espirituales'];

  const style = document.createElement('style');
  style.textContent = `
    .chars-wrap{display:flex;height:calc(100vh - 56px);}
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
    .chars-sidebar{width:240px;flex-shrink:0;background:var(--surface);border-right:1px solid rgba(212,175,90,.1);overflow-y:auto;display:flex;flex-direction:column;}
    .chars-search{padding:12px;border-bottom:1px solid rgba(212,175,90,.1);}
    .chars-search input{width:100%;background:var(--ink);border:1px solid rgba(212,175,90,.2);color:var(--text);padding:8px 12px;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;}
    .chars-search input:focus{border-color:var(--gold);}
    .chars-tabs{display:flex;gap:4px;padding:8px 12px;border-bottom:1px solid rgba(212,175,90,.1);}
    .chars-tab{flex:1;background:none;border:1px solid rgba(212,175,90,.2);color:var(--text2);padding:4px;border-radius:6px;cursor:pointer;font-size:11px;transition:all .15s;}
    .chars-tab.active{background:rgba(212,175,90,.15);color:var(--gold);border-color:var(--gold);}
    .chars-group-label{padding:8px 14px 4px;font-size:10px;font-weight:700;letter-spacing:1px;color:var(--gold);text-transform:uppercase;display:flex;align-items:center;justify-content:space-between;}
    .chars-group-count{background:rgba(212,175,90,.15);color:var(--gold);border-radius:10px;padding:1px 6px;font-size:10px;}
    .chars-item{padding:8px 14px;cursor:pointer;font-size:13px;color:var(--text2);transition:all .15s;border-left:3px solid transparent;display:flex;align-items:center;gap:8px;}
    .chars-item:hover{color:var(--text);background:rgba(212,175,90,.05);}
    .chars-item.active{color:var(--gold);border-left-color:var(--gold);background:rgba(212,175,90,.08);}
    .chars-avatar-sm{width:26px;height:26px;border-radius:50%;background:rgba(212,175,90,.2);color:var(--gold);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .chars-stars{color:var(--gold);font-size:10px;margin-left:auto;}
    .chars-main{flex:1;overflow-y:auto;padding:0;}
    .chars-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:70%;text-align:center;color:var(--text2);padding:40px;}
    .chars-welcome h2{font-family:Georgia,serif;font-size:24px;color:var(--gold);margin:12px 0 8px;}
    /* HERO */
    .char-hero{padding:24px 28px 0;background:linear-gradient(180deg,rgba(212,175,90,.06) 0%,transparent 100%);}
    .char-hero-top{display:flex;gap:18px;align-items:flex-start;margin-bottom:16px;}
    .char-avatar{width:58px;height:58px;border-radius:50%;background:rgba(212,175,90,.2);border:2px solid var(--gold);color:var(--gold);font-size:22px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .char-name{font-family:Georgia,serif;font-size:26px;color:var(--gold);}
    .char-meaning{color:var(--text2);font-size:13px;font-style:italic;margin-top:2px;}
    .char-badge{display:inline-block;background:rgba(212,175,90,.15);border:1px solid rgba(212,175,90,.3);color:var(--gold);font-size:11px;padding:2px 10px;border-radius:20px;margin-top:6px;}
    .char-stars{color:var(--gold);font-size:14px;margin-top:4px;}
    .char-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;}
    .char-tag{background:rgba(212,175,90,.08);border:1px solid rgba(212,175,90,.15);color:var(--text2);font-size:11px;padding:2px 8px;border-radius:10px;}
    .char-meta-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;padding:16px 28px;border-bottom:1px solid rgba(212,175,90,.1);}
    .char-meta-card{background:var(--ink);border-radius:8px;padding:10px 14px;}
    .char-meta-label{color:var(--gold);font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;}
    .char-meta-val{color:var(--text);font-size:13px;line-height:1.5;}
    /* BODY */
    .char-body{padding:20px 28px;}
    .char-section{background:var(--surface);border-radius:10px;padding:18px;margin-bottom:14px;}
    .char-section-head{display:flex;align-items:center;gap:8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(212,175,90,.1);}
    .char-section-icon{font-size:18px;}
    .char-section-title{font-family:Georgia,serif;font-size:16px;color:var(--gold);}
    .char-sub{margin-bottom:12px;}
    .char-sub-label{color:var(--gold);font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
    .char-sub-text{color:var(--text);font-size:14px;line-height:1.75;}
    .char-ul{list-style:none;padding:0;margin:0;}
    .char-ul li{color:var(--text);font-size:14px;line-height:1.6;padding:5px 0;border-bottom:1px solid rgba(212,175,90,.06);display:flex;gap:8px;}
    .char-ul li::before{content:'•';color:var(--gold);flex-shrink:0;}
    .char-ul.virtues li::before{content:'•';color:#81c784;}
    .char-ul.weak li::before{content:'•';color:#e57373;}
    .char-ol{list-style:none;padding:0;margin:0;counter-reset:ol-counter;}
    .char-ol li{color:var(--text);font-size:14px;line-height:1.6;padding:6px 0;border-bottom:1px solid rgba(212,175,90,.06);display:flex;gap:10px;counter-increment:ol-counter;}
    .char-ol li::before{content:counter(ol-counter);color:#0B0E14;background:var(--gold);width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:2px;}
    .char-3col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
    .char-col-title{color:var(--text2);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(212,175,90,.1);}
    /* TIMELINE */
    .char-tl{position:relative;padding-left:20px;}
    .char-tl::before{content:'';position:absolute;left:7px;top:0;bottom:0;width:2px;background:rgba(212,175,90,.2);}
    .char-tl-item{position:relative;margin-bottom:14px;}
    .char-tl-item::before{content:'';position:absolute;left:-17px;top:4px;width:10px;height:10px;border-radius:50%;border:2px solid var(--gold);background:var(--bg);}
    .char-tl-label{color:var(--gold);font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:3px;}
    .char-tl-text{color:var(--text);font-size:13px;line-height:1.6;}
    /* RELATIONS */
    .char-relations{display:flex;gap:8px;flex-wrap:wrap;}
    .char-rel{background:var(--ink);border:1px solid rgba(212,175,90,.2);border-radius:8px;padding:8px 14px;cursor:pointer;transition:all .15s;text-align:center;}
    .char-rel:hover{border-color:var(--gold);background:rgba(212,175,90,.08);}
    .char-rel-name{color:var(--text);font-size:13px;font-weight:600;}
    .char-rel-role{color:var(--text2);font-size:11px;margin-top:2px;}
    /* VERSES */
    .char-verses{display:flex;flex-direction:column;gap:10px;}
    .char-verse{border-left:3px solid rgba(212,175,90,.4);padding:10px 14px;cursor:pointer;border-radius:0 8px 8px 0;transition:all .15s;}
    .char-verse:hover{background:rgba(212,175,90,.06);border-left-color:var(--gold);}
    .char-verse-ref{color:var(--gold);font-size:12px;font-weight:700;margin-bottom:4px;}
    .char-verse-text{color:var(--text);font-style:italic;font-size:13px;line-height:1.6;}
    /* CHAPTERS */
    .char-chapters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
    .char-chap{background:var(--ink);border:1px solid rgba(212,175,90,.15);border-radius:20px;padding:5px 14px;cursor:pointer;font-size:13px;color:var(--text2);transition:all .15s;}
    .char-chap:hover{border-color:var(--gold);color:var(--gold);}
    .char-chap strong{color:var(--gold);}
    .char-read-btn{background:var(--gold);color:#0B0E14;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:700;font-size:14px;margin-top:8px;}
    @media(max-width:600px){
      .chars-sidebar{width:160px;}
      .char-body{padding:16px;}
      .char-3col{grid-template-columns:1fr;}
      .char-meta-grid{grid-template-columns:1fr;}
    }`;
  document.head.appendChild(style);

  page.innerHTML = `
      <div class="mob-sidebar-overlay" id="chars-overlay" onclick="GCP.personajes.closeSidebar()"></div>
      <div class="mob-bar">
        <button class="mob-bar-btn" onclick="GCP.personajes.toggleSidebar()">☰ Personajes</button>
        <span class="mob-bar-title" id="chars-bar-title">Selecciona un personaje</span>
      </div>
    <div class="chars-wrap">
      <aside class="chars-sidebar" id="chars-sidebar">
        <div class="chars-search">
          <div style="display:flex;align-items:center;gap:8px;">
            <input id="chars-search" type="text" placeholder="Buscar personaje..." oninput="GCP.personajes.search(this.value)" style="flex:1">
            <button onclick="GCP.personajes.closeSidebar()" style="display:none;background:none;border:none;color:var(--text2);font-size:20px;cursor:pointer;padding:4px;flex-shrink:0;" id="chars-close-btn">✕</button>
          </div>
        </div>
        <div class="chars-tabs">
          <button class="chars-tab active" onclick="GCP.personajes.tab('ALL',this)">Todos</button>
          <button class="chars-tab" onclick="GCP.personajes.tab('AT',this)">A.T.</button>
          <button class="chars-tab" onclick="GCP.personajes.tab('NT',this)">N.T.</button>
        </div>
        <div id="chars-list" style="overflow-y:auto;flex:1;"></div>
      </aside>
      <div class="chars-main" id="chars-main">
        <div class="chars-welcome">
          <div style="font-size:52px">👤</div>
          <h2>Personajes Bíblicos</h2>
          <p>167 personajes del Antiguo y Nuevo Testamento<br>con biografía, perfil espiritual y versículos clave</p>
        </div>
      </div>
    </div>`;

  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function avatarText(name) { const w = String(name||'').trim().split(/\s+/); return w.length >= 2 ? (w[0][0]+w[1][0]).toUpperCase() : String(name||'')[0].toUpperCase(); }
  function stars(n) { return '★'.repeat(Math.min(5,n||0)) + '☆'.repeat(Math.max(0,5-(n||0))); }
  function sectionHead(icon, title) { return `<div class="char-section-head"><span class="char-section-icon">${icon}</span><span class="char-section-title">${title}</span></div>`; }
  function sub(label, text) { if (!text) return ''; return `<div class="char-sub"><div class="char-sub-label">${esc(label)}</div><div class="char-sub-text">${esc(text)}</div></div>`; }
  function ulList(arr, cls) { if (!arr||!arr.length) return ''; return `<ul class="char-ul ${cls||''}">${arr.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`; }
  function olList(arr) { if (!arr||!arr.length) return ''; return `<ol class="char-ol">${arr.map(i=>`<li>${esc(i)}</li>`).join('')}</ol>`; }

  function renderList() {
    const list = document.getElementById('chars-list');
    if (!list) return;
    let items = DATA;
    if (_filterT !== 'ALL') items = items.filter(p => p.testament === _filterT);
    if (searchQ) { const q = searchQ.toLowerCase(); items = items.filter(p => p.name.toLowerCase().includes(q) || (p.aliases||[]).some(a=>a.toLowerCase().includes(q))); }

    // Agrupar por group
    const grouped = {};
    items.forEach(p => { const g = p.group||'otros'; if (!grouped[g]) grouped[g]=[]; grouped[g].push(p); });

    let html = '';
    const order = searchQ ? Object.keys(grouped) : GROUP_ORDER.filter(g => grouped[g]);
    order.forEach(g => {
      if (!grouped[g]) return;
      html += `<div class="chars-group-label">${esc(GROUP_LABELS[g]||g)}<span class="chars-group-count">${grouped[g].length}</span></div>`;
      grouped[g].forEach(p => {
        html += `<div class="chars-item ${activeId===p.id?'active':''}" onclick="GCP.personajes.open('${p.id}')">
          <div class="chars-avatar-sm">${esc(avatarText(p.name))}</div>
          <span style="flex:1">${esc(p.name)}</span>
          <span class="chars-stars">${'★'.repeat(Math.min(5,p.importance||3))}</span>
        </div>`;
      });
    });
    list.innerHTML = html || '<div style="padding:16px;color:var(--text2);font-size:13px">No encontrado</div>';
  }

  function open(id) {
    const c = DATA.find(p => p.id === id);
    if (!c) return;
    activeId = id;
    renderList();
    const main = document.getElementById('chars-main');
    if (!main) return;
    main.innerHTML = buildDetail(c);
    main.scrollTop = 0;
    // Scroll al item en la lista
    const item = document.querySelector('.chars-item.active');
    if (item) item.scrollIntoView({block:'nearest'});
  }

  function buildDetail(c) {
    const catLabel = GROUP_LABELS[c.group] || (c.testament==='NT'?'Nuevo Testamento':'Antiguo Testamento');
    let h = '';

    // HERO
    h += `<div class="char-hero">
      <div class="char-hero-top">
        <div class="char-avatar">${esc(avatarText(c.name))}</div>
        <div>
          <div class="char-name">${esc(c.name)}</div>
          ${c.meaning?`<div class="char-meaning">Significado: ${esc(c.meaning)}</div>`:''}
          <div><span class="char-badge">${esc(catLabel)}</span></div>
          <div class="char-stars">${stars(c.importance)}</div>
          ${c.tags&&c.tags.length?`<div class="char-tags">${c.tags.map(t=>`<span class="char-tag">${esc(t)}</span>`).join('')}</div>`:''}
        </div>
      </div>
    </div>`;

    // META GRID
    h += '<div class="char-meta-grid">';
    if (c.era)    h += `<div class="char-meta-card"><div class="char-meta-label">Época histórica</div><div class="char-meta-val">${esc(c.era)}</div></div>`;
    if (c.origin) h += `<div class="char-meta-card"><div class="char-meta-label">Lugar de origen</div><div class="char-meta-val">${esc(c.origin)}</div></div>`;
    if (c.refs)   h += `<div class="char-meta-card"><div class="char-meta-label">Referencias bíblicas</div><div class="char-meta-val">${esc(c.refs)}</div></div>`;
    h += '</div>';

    h += '<div class="char-body">';

    // BIOGRAFÍA
    const b = c.bio || {};
    if (b.birth||b.calling||b.events||b.challenges||b.errors||b.legacy) {
      h += `<div class="char-section">${sectionHead('📖','Biografía')}
        ${sub('Nacimiento',b.birth)}
        ${sub('Llamado',b.calling)}`;
      if (b.events&&b.events.length) h += `<div class="char-sub"><div class="char-sub-label">Eventos importantes</div>${ulList(b.events)}</div>`;
      h += `${sub('Desafíos',b.challenges)}${sub('Errores',b.errors)}${sub('Legado',b.legacy)}</div>`;
    }

    // CRONOLOGÍA PERSONAL
    if (c.timeline && c.timeline.length) {
      h += `<div class="char-section">${sectionHead('⏱️','Cronología personal')}<div class="char-tl">`;
      c.timeline.forEach(t => {
        h += `<div class="char-tl-item"><div class="char-tl-label">${esc(t.label||t.phase||'')}</div><div class="char-tl-text">${esc(t.text||t.desc||'')}</div></div>`;
      });
      h += '</div></div>';
    }

    // PERFIL ESPIRITUAL
    const s = c.spiritual || {};
    if (s.virtues||s.weaknesses||s.lessons) {
      h += `<div class="char-section">${sectionHead('🌟','Perfil espiritual')}
        <div class="char-3col">
          <div><div class="char-col-title">Virtudes</div>${ulList(s.virtues,'virtues')||'<div class="char-sub-text">—</div>'}</div>
          <div><div class="char-col-title">Debilidades</div>${ulList(s.weaknesses,'weak')||'<div class="char-sub-text">—</div>'}</div>
          <div><div class="char-col-title">Lecciones aprendidas</div>${olList(s.lessons)||'<div class="char-sub-text">—</div>'}</div>
        </div></div>`;
    }

    // RELACIÓN CON DIOS
    const r = c.relationship || {};
    if (r.calling||r.response||r.learned) {
      h += `<div class="char-section">${sectionHead('✝️','Relación con Dios')}
        <div class="char-3col">
          <div><div class="char-col-title">Cómo fue llamado</div><div class="char-sub-text">${esc(r.calling||'—')}</div></div>
          <div><div class="char-col-title">Cómo respondió</div><div class="char-sub-text">${esc(r.response||'—')}</div></div>
          <div><div class="char-col-title">Qué aprendió</div><div class="char-sub-text">${esc(r.learned||'—')}</div></div>
        </div></div>`;
    }

    // RED DE RELACIONES (clickeable)
    if (c.relations && c.relations.length) {
      h += `<div class="char-section">${sectionHead('🔗','Relaciones')}
        <div class="char-relations">`;
      c.relations.forEach(rel => {
        const relName = rel.name || rel.id || '';
        const relId = rel.id || '';
        const relRole = rel.role || rel.type || '';
        h += `<div class="char-rel" onclick="GCP.personajes.open('${esc(relId)}')">
          <div class="char-rel-name">${esc(relName)}</div>
          ${relRole?`<div class="char-rel-role">${esc(relRole)}</div>`:''}
        </div>`;
      });
      h += '</div></div>';
    }

    // CONEXIÓN MESIÁNICA
    if (c.messianic) {
      const m = c.messianic;
      h += `<div class="char-section">${sectionHead('✨','Conexión mesiánica')}`;
      if (m.type) h += `<div class="char-sub"><div class="char-sub-label">Tipo</div><div class="char-sub-text">${esc(m.type)}</div></div>`;
      if (m.desc) h += `<div class="char-sub"><div class="char-sub-label">Descripción</div><div class="char-sub-text">${esc(m.desc)}</div></div>`;
      if (m.prophecies && m.prophecies.length) {
        h += `<div class="char-sub"><div class="char-sub-label">Profecías relacionadas</div>${ulList(m.prophecies)}</div>`;
      }
      h += '</div>';
    }

    // CURIOSIDADES
    const cu = c.curiosities || [];
    const cuArr = Array.isArray(cu) ? cu : (cu.facts||[]);
    const cuRel = !Array.isArray(cu) ? cu.relevant : null;
    if (cuArr.length || cuRel) {
      h += `<div class="char-section">${sectionHead('💎','Curiosidades')}`;
      if (cuArr.length) h += `<div class="char-sub"><div class="char-sub-label">Datos poco conocidos</div>${ulList(cuArr)}</div>`;
      if (cuRel) h += sub('Información relevante', cuRel);
      h += '</div>';
    }

    // VERSÍCULOS CLAVE (clickeables)
    if (c.keyVerses && c.keyVerses.length) {
      h += `<div class="char-section">${sectionHead('📌','Versículos clave')}<div class="char-verses">`;
      c.keyVerses.forEach(v => {
        h += `<div class="char-verse" onclick="GCP.personajes.goToVerse('${esc(v.ref||'')}')">
          <div class="char-verse-ref">📖 ${esc(v.ref||v.r||'')}</div>
          <div class="char-verse-text">"${esc(v.text||v.t||'')}"</div>
        </div>`;
      });
      h += '</div></div>';
    }

    // CAPÍTULOS RELACIONADOS
    if (c.chapters && c.chapters.length) {
      h += `<div class="char-section">${sectionHead('📚','Capítulos relacionados')}<div class="char-chapters">`;
      c.chapters.forEach(ch => {
        const label = ch.label ? ` · ${ch.label}` : '';
        h += `<div class="char-chap" onclick="GCP.personajes.goToChapter('${esc(ch.bookId)}',${ch.chapter})">
          <strong>${esc(ch.bookId?ch.bookId.toUpperCase():'')} ${ch.chapter}</strong>${esc(label)}
        </div>`;
      });
      h += `</div><button class="char-read-btn" onclick="GCP.personajes.readChapters('${c.id}')">📖 Leer capítulos relacionados</button></div>`;
    }

    h += '</div>'; // char-body
    return h;
  }

  function search(q) { searchQ = q; renderList(); }

  function tab(t, btn) {
    _filterT = t;
    document.querySelectorAll('.chars-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderList();
  }

  function goToVerse(ref) {
    if (!ref) return;
    GCP.router.go('search');
    setTimeout(() => {
      const input = document.getElementById('search-input');
      if (input) { input.value = ref; if (GCP.search) GCP.search.doSearch(); }
    }, 400);
  }

  function goToChapter(bookId, chapter) {
    GCP.router.go('reader');
    setTimeout(() => {
      if (GCP.reader) {
        const bk = document.getElementById('audio-book') || document.querySelector('#reader-book-list .reader-book-item');
        GCP.reader.openBook && GCP.reader.openBook(bookId);
        setTimeout(() => { GCP.reader.goToChapter && GCP.reader.goToChapter(chapter); }, 200);
      }
    }, 400);
  }

  function readChapters(id) {
    const c = DATA.find(p => p.id === id);
    if (c && c.chapters && c.chapters.length) {
      goToChapter(c.chapters[0].bookId, c.chapters[0].chapter);
    }
  }

  function toggleSidebar() {
    const sb = document.getElementById('chars-sidebar');
    const ov = document.getElementById('chars-overlay');
    if (!sb) return;
    const isOpen = sb.classList.toggle('mob-open');
    if (ov) ov.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  function closeSidebar() {
    const sb = document.getElementById('chars-sidebar');
    const ov = document.getElementById('chars-overlay');
    if (sb) sb.classList.remove('mob-open');
    if (ov) ov.classList.remove('show');
    document.body.style.overflow = '';
  }
  // Al abrir un personaje en móvil, cerrar sidebar
  const _origOpen = open;
  function openAndClose(id) {
    _origOpen(id);
    if (window.innerWidth <= 700) closeSidebar();
  }

  GCP.personajes = { open: openAndClose, search, tab, goToVerse, goToChapter, readChapters, toggleSidebar, closeSidebar };

  fetch('personajes.json').then(r => r.json()).then(d => {
    DATA = d;
    renderList();
  }).catch(e => console.error('personajes:', e));
})();
