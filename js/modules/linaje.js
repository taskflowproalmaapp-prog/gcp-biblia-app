/* ═══ MÓDULO: Linaje de Jesús ═══ */
(function() {
  const page = document.getElementById('page-linaje');
  let DATA = {segments:[], names:[]};

  const style = document.createElement('style');
  style.textContent = `
    .linaje-wrap{max-width:800px;margin:0 auto;padding:28px 20px;}
    .linaje-hero{text-align:center;margin-bottom:32px;}
    .linaje-hero h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin:12px 0 8px;}
    .linaje-hero p{color:var(--text2);font-size:14px;}
    .linaje-intro{background:var(--surface);border-radius:var(--r);padding:20px;margin-bottom:24px;border-left:4px solid var(--gold);}
    .linaje-intro p{color:var(--text);line-height:1.75;font-size:14px;}
    .linaje-segments{display:flex;flex-direction:column;gap:20px;}
    .linaje-segment{background:var(--surface);border:1px solid rgba(212,175,90,.15);border-radius:var(--r);overflow:hidden;}
    .linaje-segment-header{padding:16px 20px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .15s;}
    .linaje-segment-header:hover{background:rgba(212,175,90,.05);}
    .linaje-segment-title{font-family:Georgia,serif;font-size:16px;color:var(--gold);}
    .linaje-segment-meta{color:var(--text2);font-size:12px;margin-top:3px;}
    .linaje-segment-passage{color:var(--text2);font-size:12px;}
    .linaje-segment-body{display:none;padding:0 20px 16px;border-top:1px solid rgba(212,175,90,.1);}
    .linaje-segment.open .linaje-segment-body{display:block;}
    .linaje-names{display:flex;flex-wrap:wrap;gap:8px;padding-top:14px;}
    .linaje-name{background:rgba(212,175,90,.08);border:1px solid rgba(212,175,90,.15);color:var(--text);
      padding:4px 12px;border-radius:20px;font-size:13px;cursor:pointer;transition:all .15s;}
    .linaje-name:hover{border-color:var(--gold);color:var(--gold);}
    .linaje-name.special{background:rgba(212,175,90,.2);border-color:var(--gold);color:var(--gold);font-weight:600;}
    .linaje-chain{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:14px;padding-top:14px;}
    .linaje-chain-item{color:var(--text2);font-size:13px;}
    .linaje-chain-arrow{color:rgba(212,175,90,.4);font-size:12px;}
    .linaje-final{text-align:center;background:linear-gradient(135deg,rgba(212,175,90,.1),rgba(212,175,90,.05));
      border:2px solid rgba(212,175,90,.4);border-radius:14px;padding:24px;margin-top:24px;}
    .linaje-final-icon{font-size:36px;margin-bottom:8px;}
    .linaje-final-text{font-family:Georgia,serif;font-size:18px;color:var(--gold);margin-bottom:8px;}
    .linaje-final-verse{color:var(--text2);font-size:13px;font-style:italic;}`;
  document.head.appendChild(style);

  page.innerHTML = `
    <div class="linaje-wrap">
      <div class="linaje-hero">
        <div style="font-size:48px">🌿</div>
        <h2>Linaje de Jesús</h2>
        <p>La genealogía mesiánica desde Adán hasta Jesucristo</p>
      </div>
      <div class="linaje-intro">
        <p>La Biblia registra cuidadosamente la genealogía de Jesús, demostrando que es el cumplimiento de todas las promesas hechas a Adán, Abraham, David y los profetas. Cada nombre en esta línea es parte del plan eterno de Dios para la redención.</p>
      </div>
      <div class="linaje-segments" id="linaje-segments"></div>
      <div class="linaje-final">
        <div class="linaje-final-icon">✝️</div>
        <div class="linaje-final-text">Jesucristo — El Hijo de David, el Hijo de Abraham</div>
        <div class="linaje-final-verse">"Libro de la genealogía de Jesucristo, hijo de David, hijo de Abraham." — Mateo 1:1</div>
      </div>
    </div>`;

  function render() {
    const el = document.getElementById('linaje-segments');
    if (!el) return;
    el.innerHTML = DATA.segments.map((seg, i) => `
      <div class="linaje-segment" id="seg-${i}">
        <div class="linaje-segment-header" onclick="GCP.linaje.toggle('seg-${i}')">
          <div>
            <div class="linaje-segment-title">${seg.title}</div>
            <div class="linaje-segment-meta">${seg.sub}</div>
          </div>
          <div class="linaje-segment-passage">${seg.passage}</div>
        </div>
        <div class="linaje-segment-body">
          <div class="linaje-names">
            ${(seg.links || []).map(l => `
              <span class="linaje-name ${l.flag ? 'special' : ''}" 
                onclick="GCP.linaje.goToChar('${l.id || ''}')">
                ${l.name}
              </span>`).join('')}
          </div>
        </div>
      </div>`).join('');
    // Abrir el primero por defecto
    const first = document.getElementById('seg-0');
    if (first) first.classList.add('open');
  }

  function toggle(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  }

  function goToChar(id) {
    if (!id) return;
    GCP.router.go('personajes');
    setTimeout(() => {
      if (GCP.personajes) GCP.personajes.open(id);
    }, 500);
  }

  GCP.linaje = { toggle, goToChar };

  fetch('linaje.json').then(r => r.json()).then(d => {
    DATA = d;
    render();
  }).catch(e => console.error(e));
})();
