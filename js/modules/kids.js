/* ═══ MÓDULO: Estudio Bíblico para Niños ═══ */
(function() {
  const page = document.getElementById('page-kids');

  const TOPICS = [
    {id:'creacion',name:'La Creación',icon:'🌍',ref:'Génesis 1',age:'4-8'},
    {id:'noe',name:'El Arca de Noé',icon:'🚢',ref:'Génesis 6-8',age:'4-8'},
    {id:'david-goliat',name:'David y Goliat',icon:'🪨',ref:'1 Samuel 17',age:'6-10'},
    {id:'jonas',name:'Jonás y el Gran Pez',icon:'🐋',ref:'Jonás 1-4',age:'4-8'},
    {id:'nacimiento',name:'El Nacimiento de Jesús',icon:'⭐',ref:'Lucas 2',age:'4-10'},
    {id:'loaves',name:'Los 5 Panes y 2 Peces',icon:'🐟',ref:'Juan 6',age:'5-10'},
    {id:'hijo-prodigo',name:'El Hijo Pródigo',icon:'🏠',ref:'Lucas 15',age:'7-12'},
    {id:'buen-samaritano',name:'El Buen Samaritano',icon:'🤝',ref:'Lucas 10',age:'6-12'},
    {id:'resurreccion',name:'La Resurrección',icon:'✝️',ref:'Mateo 28',age:'8-12'},
    {id:'amor-dios',name:'El Amor de Dios',icon:'❤️',ref:'Juan 3:16',age:'4-12'},
    {id:'oracion',name:'Cómo Orar',icon:'🙏',ref:'Mateo 6',age:'5-12'},
    {id:'perdon',name:'El Perdón',icon:'🕊️',ref:'Lucas 23',age:'7-12'},
  ];

  const style = document.createElement('style');
  style.textContent = `
    .kids-wrap{max-width:900px;margin:0 auto;padding:28px 20px;}
    .kids-hero{text-align:center;margin-bottom:32px;}
    .kids-hero h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin:12px 0 8px;}
    .kids-hero p{color:var(--text2);font-size:14px;}
    .kids-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-bottom:28px;}
    .kids-card{background:var(--surface);border:1px solid rgba(212,175,90,.1);
      border-radius:12px;padding:20px;cursor:pointer;transition:all .15s;text-align:center;}
    .kids-card:hover{border-color:rgba(212,175,90,.4);transform:translateY(-3px);
      box-shadow:0 8px 24px rgba(0,0,0,.3);}
    .kids-card-icon{font-size:36px;margin-bottom:10px;}
    .kids-card-name{font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px;}
    .kids-card-ref{font-size:11px;color:var(--text2);}
    .kids-card-age{display:inline-block;background:rgba(212,175,90,.1);color:var(--gold);
      font-size:10px;padding:2px 8px;border-radius:20px;margin-top:6px;}
    .kids-detail{background:var(--surface);border-radius:14px;padding:28px;margin-top:24px;display:none;}
    .kids-detail.active{display:block;}
    .kids-detail-header{text-align:center;margin-bottom:24px;}
    .kids-detail-icon{font-size:52px;margin-bottom:8px;}
    .kids-detail-title{font-family:Georgia,serif;font-size:24px;color:var(--gold);}
    .kids-section{margin-bottom:20px;}
    .kids-section-label{color:var(--gold);font-size:12px;font-weight:700;letter-spacing:1px;
      text-transform:uppercase;margin-bottom:10px;}
    .kids-section p{color:var(--text);line-height:1.8;font-size:15px;}
    .kids-question{background:rgba(212,175,90,.08);border-radius:8px;padding:14px;
      margin-bottom:8px;display:flex;gap:10px;align-items:flex-start;}
    .kids-question-num{color:var(--gold);font-weight:700;font-size:14px;flex-shrink:0;}
    .kids-question-text{color:var(--text);font-size:14px;line-height:1.5;}
    .kids-memory{background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.3);
      border-radius:8px;padding:16px;text-align:center;font-style:italic;
      color:var(--text);font-size:15px;line-height:1.7;}
    .kids-back{background:none;border:none;color:var(--text2);cursor:pointer;
      font-size:13px;margin-bottom:20px;}
    .kids-age-filter{display:flex;gap:8px;justify-content:center;margin-bottom:20px;flex-wrap:wrap;}
    .kids-age-btn{background:none;border:1px solid rgba(212,175,90,.2);color:var(--text2);
      padding:6px 14px;border-radius:20px;cursor:pointer;font-size:12px;transition:all .15s;}
    .kids-age-btn.active{background:rgba(212,175,90,.15);color:var(--gold);border-color:var(--gold);}
    .kids-custom{background:var(--surface);border:1px solid rgba(212,175,90,.2);
      border-radius:10px;padding:20px;margin-bottom:24px;}
    .kids-custom input{width:100%;background:var(--ink);border:1px solid rgba(212,175,90,.2);
      color:var(--text);padding:10px 14px;border-radius:8px;font-size:14px;outline:none;margin-bottom:10px;}
    .kids-custom input:focus{border-color:var(--gold);}`;
  document.head.appendChild(style);

  page.innerHTML = `
    <div class="kids-wrap">
      <div class="kids-hero">
        <div style="font-size:48px">🧒</div>
        <h2>Estudio Bíblico para Niños</h2>
        <p>La Palabra de Dios explicada de forma simple y divertida</p>
      </div>
      <div class="kids-custom">
        <div class="kids-section-label">✨ Pregunta libre con IA</div>
        <input id="kids-input" type="text" placeholder="Ej: ¿Por qué Dios amó al mundo? ¿Qué es el cielo?">
        <button class="btn btn-primary" onclick="GCP.kids.askCustom()" style="width:100%">Preguntar a la IA 🤖</button>
      </div>
      <div class="kids-section-label" style="text-align:center;margin-bottom:16px;">✦ Historias Bíblicas ✦</div>
      <div class="kids-grid" id="kids-grid"></div>
      <div class="kids-detail" id="kids-detail"></div>
    </div>`;

  function renderGrid() {
    const grid = document.getElementById('kids-grid');
    if (!grid) return;
    grid.innerHTML = TOPICS.map(t => `
      <div class="kids-card" onclick="GCP.kids.open('${t.id}')">
        <div class="kids-card-icon">${t.icon}</div>
        <div class="kids-card-name">${t.name}</div>
        <div class="kids-card-ref">${t.ref}</div>
        <div class="kids-card-age">👶 ${t.age} años</div>
      </div>`).join('');
  }

  async function open(id) {
    const topic = TOPICS.find(t => t.id === id);
    if (!topic) return;

    const detail = document.getElementById('kids-detail');
    detail.className = 'kids-detail active';
    detail.innerHTML = `
      <div class="kids-detail-header">
        <div class="kids-detail-icon">${topic.icon}</div>
        <div class="kids-detail-title">${topic.name}</div>
      </div>
      <div class="sum-ai-loading" style="text-align:center;padding:30px;color:var(--text2);">
        <div class="spinner" style="margin:0 auto 12px"></div>
        <p>✨ Preparando lección para niños...</p>
      </div>`;
    detail.scrollIntoView({behavior:'smooth'});

    const cached = GCP.ai.cache.get('kids_' + id);
    const lesson = cached || await GCP.ai.askJSON(
      `Eres un maestro bíblico para niños. Explica "${topic.name}" (${topic.ref}) de la Biblia RV1960
de forma muy simple, divertida y apropiada para niños de ${topic.age} años.
Responde SOLO con este JSON:
{"story":"cuenta la historia en 4-5 oraciones simples y emocionantes",
"meaning":"qué significa para la vida del niño (2-3 oraciones simples)",
"questions":["pregunta para reflexionar 1","pregunta para reflexionar 2","pregunta para reflexionar 3"],
"activity":"una actividad simple que el niño puede hacer hoy",
"memoryVerse":"versículo corto para memorizar con su referencia"}`, 800);

    if (!cached && lesson) GCP.ai.cache.set('kids_' + id, lesson);

    if (!lesson) {
      detail.innerHTML = '<p style="text-align:center;color:#e57373;padding:20px">Error al generar. Intenta de nuevo.</p>';
      return;
    }

    const lessonText = [
      'Hola amiguito. Hoy aprendemos sobre ' + topic.name + '. ',
      lesson.story||'',
      'Qué significa para mí. ' + (lesson.meaning||''),
      'Así es Dios. ' + (lesson.godCharacter||''),
      'Actividad de hoy. ' + (lesson.activity||''),
      'Oración. ' + (lesson.prayer||''),
      'Dato curioso. ' + (lesson.funFact||''),
      'Versículo para memorizar. ' + (lesson.memoryVerse||'')
    ].join('. ');

    detail.innerHTML = `
      <button class="kids-back" onclick="document.getElementById('kids-detail').className='kids-detail';GCP.speak.stop()">← Volver</button>

      <div class="kids-detail-header">
        <div class="kids-detail-icon">${topic.icon}</div>
        <div class="kids-detail-title">${topic.name}</div>
        <div style="color:var(--text2);font-size:14px;margin-top:4px">${topic.ref} · Para niños de ${topic.age} años</div>
      </div>

      <!-- BOTÓN AUDIO GRANDE Y PROMINENTE -->
      <div style="background:linear-gradient(135deg,rgba(212,175,90,.15),rgba(212,175,90,.05));
        border:2px solid rgba(212,175,90,.4);border-radius:14px;padding:20px;margin-bottom:24px;text-align:center;">
        <div style="font-size:36px;margin-bottom:8px;">🎧</div>
        <div style="color:var(--gold);font-weight:700;font-size:16px;margin-bottom:6px;">¡Escucha la lección completa!</div>
        <div style="color:var(--text2);font-size:13px;margin-bottom:14px;">Ideal para que un adulto lea mientras el niño escucha</div>
        <button onclick="GCP.speak.text(\`${lessonText.replace(/`/g,"'")}\`,'${topic.name}')"
          style="background:var(--gold);color:#0B0E14;border:none;padding:14px 32px;
          border-radius:10px;font-weight:700;cursor:pointer;font-size:16px;margin-right:10px;">
          ▶ Escuchar ahora
        </button>
        <button onclick="GCP.speak.stop()"
          style="background:rgba(212,175,90,.1);color:var(--gold);border:1px solid rgba(212,175,90,.3);
          padding:14px 20px;border-radius:10px;font-weight:600;cursor:pointer;font-size:14px;">
          ⏹ Detener
        </button>
      </div>

      <div class="kids-section">
        <div class="kids-section-label">📖 La Historia</div>
        <p style="font-size:16px;line-height:1.9">${lesson.story||''}</p>
      </div>

      <div class="kids-section">
        <div class="kids-section-label">💡 ¿Qué significa para mí?</div>
        <p style="font-size:15px;line-height:1.8">${lesson.meaning||''}</p>
      </div>

      ${lesson.godCharacter ? `
      <div class="kids-section">
        <div class="kids-section-label">✨ Así es Dios</div>
        <p style="font-size:15px;line-height:1.8">${lesson.godCharacter}</p>
      </div>` : ''}

      <div class="kids-section">
        <div class="kids-section-label">🤔 Preguntas para pensar</div>
        ${(lesson.questions||[]).map((q,i)=>`
          <div class="kids-question">
            <div class="kids-question-num">${i+1}.</div>
            <div class="kids-question-text" style="font-size:15px">${q}</div>
          </div>`).join('')}
      </div>

      <div class="kids-section">
        <div class="kids-section-label">🎨 Actividad de hoy</div>
        <p style="font-size:15px;line-height:1.8">${lesson.activity||''}</p>
      </div>

      ${lesson.funFact ? `
      <div style="background:rgba(212,175,90,.08);border-left:4px solid var(--gold);
        border-radius:0 10px 10px 0;padding:16px;margin-bottom:16px;">
        <div class="kids-section-label">🌟 ¿Sabías que...?</div>
        <p style="color:var(--text);font-size:15px;line-height:1.7">${lesson.funFact}</p>
      </div>` : ''}

      <div class="kids-memory">
        <div class="kids-section-label">📜 Versículo para memorizar</div>
        <div style="font-size:18px;font-style:italic;line-height:1.6;margin:10px 0">"${lesson.memoryVerse||''}"</div>
        <button onclick="GCP.speak.text('${(lesson.memoryVerse||'').replace(/'/g,"\'")}','Versículo')"
          style="background:rgba(212,175,90,.15);border:1px solid rgba(212,175,90,.3);color:var(--gold);
          padding:8px 18px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-top:8px;">
          🔊 Escuchar versículo
        </button>
      </div>

      ${lesson.prayer ? `
      <div style="background:rgba(100,150,255,.06);border:1px solid rgba(100,150,255,.2);
        border-radius:12px;padding:20px;margin-top:16px;text-align:center;">
        <div class="kids-section-label">🙏 Oremos juntos</div>
        <p style="color:var(--text);font-size:16px;line-height:1.9;font-style:italic">${lesson.prayer}</p>
        <button onclick="GCP.speak.text('${(lesson.prayer||'').replace(/'/g,"\'")}','Oración')"
          style="background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.3);color:var(--gold);
          padding:8px 18px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-top:8px;">
          🔊 Escuchar oración
        </button>
      </div>` : ''}`;
  }

  async function askCustom() {
    const input = document.getElementById('kids-input');
    const q = input.value.trim();
    if (!q) return;

    const detail = document.getElementById('kids-detail');
    detail.className = 'kids-detail active';
    detail.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text2);">
      <div class="spinner" style="margin:0 auto 12px"></div><p>✨ Pensando la respuesta...</p></div>`;
    detail.scrollIntoView({behavior:'smooth'});

    try {
      const answer = await GCP.ai.ask(
        `Eres un maestro bíblico para niños. Un niño te pregunta: "${q}"
Responde de forma simple, amorosa y bíblica en 3-4 párrafos cortos. 
Incluye al menos un versículo de la Biblia RV1960 relacionado.
Usa lenguaje que un niño de 8 años pueda entender.`, 600);

      detail.innerHTML = `
        <button class="kids-back" onclick="document.getElementById('kids-detail').className='kids-detail'">← Volver</button>
        <div class="kids-detail-header">
          <div class="kids-detail-icon">🤖</div>
          <div class="kids-detail-title">${q}</div>
        </div>
        <div class="kids-section"><p style="white-space:pre-wrap">${answer}</p></div>`;
    } catch(e) {
      detail.innerHTML = '<p style="text-align:center;color:#e57373;padding:20px">Error. Intenta de nuevo.</p>';
    }
  }

  GCP.kids = { open, askCustom };
  renderGrid();
})();
