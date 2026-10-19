/* ═══ MÓDULO: Línea de Tiempo Bíblica ═══ */
(function() {
  const page = document.getElementById('page-timeline');
  let DATA = {eras:[], events:[]};
  let activeEra = null;

  const style = document.createElement('style');
  style.textContent = `
    .tl-wrap{max-width:900px;margin:0 auto;padding:28px 20px;}
    .tl-hero{text-align:center;margin-bottom:28px;}
    .tl-hero h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin:12px 0 8px;}
    .tl-hero p{color:var(--text2);font-size:14px;}
    .tl-eras{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:28px;}
    .tl-era-btn{background:var(--surface);border:1px solid rgba(212,175,90,.15);color:var(--text2);
      padding:8px 16px;border-radius:20px;cursor:pointer;font-size:13px;transition:all .15s;}
    .tl-era-btn:hover{border-color:rgba(212,175,90,.4);color:var(--text);}
    .tl-era-btn.active{background:rgba(212,175,90,.15);color:var(--gold);border-color:var(--gold);}
    .tl-era-label{text-align:center;margin-bottom:20px;}
    .tl-era-title{font-family:Georgia,serif;font-size:22px;color:var(--gold);}
    .tl-era-sub{color:var(--text2);font-size:13px;}
    .tl-events{position:relative;padding-left:24px;}
    .tl-events::before{content:'';position:absolute;left:8px;top:0;bottom:0;width:2px;background:rgba(212,175,90,.2);}
    .tl-event{position:relative;margin-bottom:20px;}
    .tl-event::before{content:'';position:absolute;left:-20px;top:6px;width:10px;height:10px;
      border-radius:50%;background:var(--gold);border:2px solid var(--bg);}
    .tl-event-card{background:var(--surface);border:1px solid rgba(212,175,90,.1);border-radius:var(--r);padding:16px;transition:all .15s;}
    .tl-event-card:hover{border-color:rgba(212,175,90,.3);}
    .tl-event-date{color:var(--gold);font-size:12px;font-weight:700;margin-bottom:4px;}
    .tl-event-name{font-size:15px;font-weight:600;color:var(--text);margin-bottom:6px;}
    .tl-event-summary{color:var(--text2);font-size:13px;line-height:1.6;}
    .tl-event-desc{color:var(--text);font-size:13px;line-height:1.7;margin-top:8px;display:none;}
    .tl-event-card.expanded .tl-event-desc{display:block;}
    .tl-event-toggle{color:var(--gold);font-size:12px;cursor:pointer;margin-top:6px;display:inline-block;}`;
  document.head.appendChild(style);

  page.innerHTML = `
    <div class="tl-wrap">
      <div class="tl-hero">
        <div style="font-size:48px">⏳</div>
        <h2>Línea de Tiempo Bíblica</h2>
        <p>Los grandes eventos de la historia bíblica organizados cronológicamente</p>
      </div>
      <div class="tl-eras" id="tl-eras"></div>
      <div id="tl-content"></div>
    </div>`;

  function render() {
    const erasEl = document.getElementById('tl-eras');
    if (!erasEl) return;
    erasEl.innerHTML = DATA.eras.map(e => `
      <button class="tl-era-btn ${activeEra === e.key ? 'active' : ''}" onclick="GCP.timeline.setEra('${e.key}')">
        ${e.label}
      </button>`).join('');
    renderEvents();
  }

  function renderEvents() {
    const content = document.getElementById('tl-content');
    if (!content) return;
    const era = DATA.eras.find(e => e.key === activeEra);
    const events = activeEra ? DATA.events.filter(e => e.era === activeEra) : DATA.events.slice(0, 20);
    content.innerHTML = `
      ${era ? `<div class="tl-era-label"><div class="tl-era-title">${era.label}</div><div class="tl-era-sub">${era.sub}</div></div>` : ''}
      <div class="tl-events">
        ${events.map((e,i) => `
          <div class="tl-event">
            <div class="tl-event-card" id="tl-ev-${i}">
              <div class="tl-event-date">${e.date || ''}</div>
              <div class="tl-event-name">${e.name}</div>
              <div class="tl-event-summary">${e.summary}</div>
              ${e.desc ? `<div class="tl-event-desc">${e.desc}</div>
                <span class="tl-event-toggle" onclick="GCP.timeline.toggle('tl-ev-${i}')">Ver más ▾</span>` : ''}
            </div>
          </div>`).join('')}
      </div>`;
  }

  function setEra(key) {
    activeEra = activeEra === key ? null : key;
    render();
  }

  function toggle(id) {
    const card = document.getElementById(id);
    if (!card) return;
    card.classList.toggle('expanded');
    const btn = card.querySelector('.tl-event-toggle');
    if (btn) btn.textContent = card.classList.contains('expanded') ? 'Ver menos ▴' : 'Ver más ▾';
  }

  GCP.timeline = { setEra, toggle };

  fetch('timeline.json').then(r => r.json()).then(d => {
    DATA = d;
    if (DATA.eras.length) activeEra = DATA.eras[0].key;
    render();
  }).catch(e => console.error(e));
})();
