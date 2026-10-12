/* ═══ MÓDULO: Audio Biblia — Voz cálida con selección ═══ */
(function() {
  const page = document.getElementById('page-audio');

  const style = document.createElement('style');
  style.textContent = `
    .audio-wrap{max-width:900px;margin:0 auto;padding:28px 20px;}
    .audio-hero{text-align:center;margin-bottom:28px;}
    .audio-hero h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin:12px 0 8px;}
    .audio-hero p{color:var(--text2);font-size:14px;}
    .audio-voice-section{background:var(--surface);border-radius:var(--r);padding:20px;margin-bottom:20px;}
    .audio-label{color:var(--gold);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;}
    .audio-voices{display:flex;gap:10px;flex-wrap:wrap;}
    .audio-voice-btn{background:var(--ink);border:2px solid rgba(212,175,90,.2);color:var(--text2);
      padding:10px 16px;border-radius:10px;cursor:pointer;font-size:13px;transition:all .15s;text-align:center;min-width:120px;}
    .audio-voice-btn:hover{border-color:rgba(212,175,90,.5);color:var(--text);}
    .audio-voice-btn.active{border-color:var(--gold);color:var(--gold);background:rgba(212,175,90,.08);}
    .audio-voice-name{font-weight:600;margin-bottom:2px;}
    .audio-voice-desc{font-size:11px;opacity:.7;}
    .audio-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px;}
    .audio-btn{background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.2);
      color:var(--gold);width:44px;height:44px;border-radius:50%;cursor:pointer;
      font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .15s;}
    .audio-btn:hover{background:rgba(212,175,90,.25);}
    .audio-play-btn{width:58px;height:58px;font-size:24px;background:var(--gold);color:#0B0E14;border-color:var(--gold);}
    .audio-play-btn:hover{background:var(--gold-light);}
    .audio-speed-btn{background:rgba(212,175,90,.08);border:1px solid rgba(212,175,90,.15);
      color:var(--text2);padding:5px 10px;border-radius:6px;cursor:pointer;font-size:12px;transition:all .15s;}
    .audio-speed-btn.active{background:rgba(212,175,90,.2);color:var(--gold);border-color:var(--gold);}
    .audio-bible-section{background:var(--surface);border-radius:var(--r);padding:20px;margin-bottom:20px;}
    .audio-bible-nav{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px;}
    .audio-select{background:var(--ink);border:1px solid rgba(212,175,90,.2);color:var(--text);
      padding:8px 12px;border-radius:8px;font-size:13px;cursor:pointer;outline:none;}
    .audio-select:focus{border-color:var(--gold);}
    .audio-nav-btn{background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.2);
      color:var(--gold);padding:8px 14px;border-radius:8px;cursor:pointer;font-size:13px;transition:all .15s;}
    .audio-nav-btn:hover{background:rgba(212,175,90,.2);}
    .audio-chapter-text{max-height:320px;overflow-y:auto;padding:16px;
      background:rgba(212,175,90,.04);border-radius:8px;font-family:Georgia,serif;
      font-size:15px;line-height:1.9;color:var(--text);}
    .audio-verse-num{color:var(--gold);font-size:11px;font-weight:700;margin-right:4px;}
    .audio-verse-active{background:rgba(212,175,90,.2);border-radius:4px;padding:2px 4px;}
    .audio-player-info{background:var(--surface);border-radius:var(--r);padding:20px;margin-bottom:20px;display:none;}
    .audio-player-info.active{display:block;}
    .audio-now-playing{font-family:Georgia,serif;font-size:18px;color:var(--gold);margin-bottom:4px;}
    .audio-now-sub{color:var(--text2);font-size:13px;margin-bottom:16px;}
    .audio-progress-bar{width:100%;height:6px;background:rgba(212,175,90,.15);
      border-radius:3px;margin-bottom:8px;cursor:pointer;}
    .audio-progress-fill{height:100%;background:var(--gold);border-radius:3px;transition:width .3s;}
    .audio-time-info{display:flex;justify-content:space-between;color:var(--text2);font-size:12px;}
    .audio-quick-section{background:var(--surface);border-radius:var(--r);padding:20px;margin-bottom:20px;}
    .audio-quick-input{display:flex;gap:8px;margin-bottom:12px;}
    .audio-quick-input input{flex:1;background:var(--ink);border:1px solid rgba(212,175,90,.2);
      color:var(--text);padding:10px 14px;border-radius:8px;font-size:14px;outline:none;}
    .audio-quick-input input:focus{border-color:var(--gold);}
    .audio-chip{background:rgba(212,175,90,.08);border:1px solid rgba(212,175,90,.15);
      color:var(--text2);padding:5px 12px;border-radius:20px;cursor:pointer;font-size:12px;
      display:inline-block;margin:3px;transition:all .15s;}
    .audio-chip:hover{color:var(--gold);border-color:var(--gold);}`;
  document.head.appendChild(style);

  let synth = window.speechSynthesis;
  let voices = [];
  let selectedVoice = null;
  let speed = 1.0;
  let isPaused = false;
  let currentText = '';
  let bibleData = null;
  let currentBook = 'gn';
  let currentChapter = 1;
  let allVerses = [];
  let currentVerseIdx = 0;

  const BOOKS = [
    {id:'gn',name:'Génesis',c:50},{id:'ex',name:'Éxodo',c:40},{id:'lv',name:'Levítico',c:27},
    {id:'nm',name:'Números',c:36},{id:'dt',name:'Deuteronomio',c:34},{id:'jos',name:'Josué',c:24},
    {id:'jue',name:'Jueces',c:21},{id:'rt',name:'Rut',c:4},{id:'1sm',name:'1 Samuel',c:31},
    {id:'2sm',name:'2 Samuel',c:24},{id:'1re',name:'1 Reyes',c:22},{id:'2re',name:'2 Reyes',c:25},
    {id:'1cr',name:'1 Crónicas',c:29},{id:'2cr',name:'2 Crónicas',c:36},{id:'esd',name:'Esdras',c:10},
    {id:'neh',name:'Nehemías',c:13},{id:'est',name:'Ester',c:10},{id:'job',name:'Job',c:42},
    {id:'sal',name:'Salmos',c:150},{id:'pr',name:'Proverbios',c:31},{id:'ec',name:'Eclesiastés',c:12},
    {id:'cnt',name:'Cantares',c:8},{id:'is',name:'Isaías',c:66},{id:'jer',name:'Jeremías',c:52},
    {id:'lm',name:'Lamentaciones',c:5},{id:'ez',name:'Ezequiel',c:48},{id:'dn',name:'Daniel',c:12},
    {id:'os',name:'Oseas',c:14},{id:'jl',name:'Joel',c:3},{id:'am',name:'Amós',c:9},
    {id:'jon',name:'Jonás',c:4},{id:'mi',name:'Miqueas',c:7},{id:'hab',name:'Habacuc',c:3},
    {id:'zac',name:'Zacarías',c:14},{id:'mal',name:'Malaquías',c:4},
    {id:'mt',name:'Mateo',c:28},{id:'mr',name:'Marcos',c:16},{id:'lc',name:'Lucas',c:24},
    {id:'jn',name:'Juan',c:21},{id:'hch',name:'Hechos',c:28},{id:'ro',name:'Romanos',c:16},
    {id:'1co',name:'1 Corintios',c:16},{id:'2co',name:'2 Corintios',c:13},{id:'ga',name:'Gálatas',c:6},
    {id:'ef',name:'Efesios',c:6},{id:'flp',name:'Filipenses',c:4},{id:'col',name:'Colosenses',c:4},
    {id:'1ts',name:'1 Tesalonicenses',c:5},{id:'heb',name:'Hebreos',c:13},{id:'stg',name:'Santiago',c:5},
    {id:'1pe',name:'1 Pedro',c:5},{id:'2pe',name:'2 Pedro',c:3},{id:'1jn',name:'1 Juan',c:5},
    {id:'ap',name:'Apocalipsis',c:22},
  ];

  page.innerHTML = `
    <div class="audio-wrap">
      <div class="audio-hero">
        <div style="font-size:48px">🔊</div>
        <h2>Audio Biblia</h2>
        <p>Escucha la Palabra de Dios. Elige tu voz favorita y escucha en modo manos libres.</p>
      </div>

      <div class="audio-voice-section">
        <div class="audio-label">🎙️ Selecciona una voz</div>
        <div class="audio-voices" id="audio-voices">
          <div style="color:var(--text2);font-size:13px">Cargando voces...</div>
        </div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:14px;flex-wrap:wrap;">
          <span style="color:var(--text2);font-size:13px">Velocidad:</span>
          ${[0.75,1,1.25,1.5].map(s=>`
            <button class="audio-speed-btn ${s===1?'active':''}" onclick="GCP.audio.setSpeed(${s})" data-speed="${s}">${s}x</button>
          `).join('')}
          <button class="audio-nav-btn" onclick="GCP.audio.testVoice()">🔊 Probar voz</button>
        </div>
      </div>

      <div class="audio-player-info" id="audio-player-info">
        <div class="audio-now-playing" id="audio-now-playing">—</div>
        <div class="audio-now-sub" id="audio-now-sub">—</div>
        <div class="audio-controls">
          <button class="audio-btn audio-play-btn" id="audio-play-btn" onclick="GCP.audio.togglePlay()">▶</button>
          <button class="audio-btn" onclick="GCP.audio.stop()" title="Detener">⏹</button>
          <button class="audio-btn" onclick="GCP.audio.prevVerse()" title="Anterior">⏮</button>
          <button class="audio-btn" onclick="GCP.audio.nextVerse()" title="Siguiente">⏭</button>
        </div>
        <div class="audio-progress-bar" id="audio-progress-bar" onclick="GCP.audio.seek(event)">
          <div class="audio-progress-fill" id="audio-progress-fill" style="width:0%"></div>
        </div>
        <div class="audio-time-info">
          <span id="audio-verse-info">Versículo 0 de 0</span>
          <span id="audio-speed-label">1x</span>
        </div>
      </div>

      <div class="audio-bible-section">
        <div class="audio-label">📖 Biblia Completa RV1960</div>
        <div class="audio-bible-nav">
          <select class="audio-select" id="audio-book" onchange="GCP.audio.loadBook()">
            ${BOOKS.map(b=>`<option value="${b.id}">${b.name}</option>`).join('')}
          </select>
          <select class="audio-select" id="audio-chapter" onchange="GCP.audio.loadChapter()"></select>
          <button class="audio-nav-btn" onclick="GCP.audio.readChapter()">▶ Escuchar</button>
        </div>
        <div class="audio-chapter-text" id="audio-chapter-text">
          <span style="color:var(--text2)">Selecciona un libro...</span>
        </div>
      </div>

      <div class="audio-quick-section">
        <div class="audio-label">🔍 Escuchar versículo</div>
        <div class="audio-quick-input">
          <input id="audio-ref" type="text" placeholder="Ej: Juan 3:16, Salmos 23:1...">
          <button class="audio-nav-btn" onclick="GCP.audio.playRef()">▶</button>
        </div>
        <div>
          ${['Juan 3:16','Salmos 23','Filipenses 4:13','Romanos 8:28','Isaías 40:31'].map(r=>
            `<span class="audio-chip" onclick="GCP.audio.quickPlay('${r}')">${r}</span>`).join('')}
        </div>
      </div>
    </div>`;

  function loadVoices() {
    const all = synth.getVoices();
    voices = all.filter(v => v.lang.startsWith('es') || v.lang.startsWith('ES'));
    if (voices.length === 0) voices = all;

    const warm = ['female','mujer','helena','lucia','paulina','maria','sofia','carmen','rosa','sabina'];
    voices.sort((a,b) => {
      const aW = warm.some(k=>a.name.toLowerCase().includes(k)) ? -1 : 1;
      const bW = warm.some(k=>b.name.toLowerCase().includes(k)) ? -1 : 1;
      return aW - bW;
    });

    selectedVoice = voices[0];
    const c = document.getElementById('audio-voices');
    if (!c) return;
    if (voices.length === 0) {
      c.innerHTML = '<div style="color:var(--text2);font-size:13px">No hay voces en español en este dispositivo.</div>';
      return;
    }
    c.innerHTML = voices.slice(0,8).map((v,i)=>`
      <button class="audio-voice-btn ${i===0?'active':''}" onclick="GCP.audio.selectVoice(${i})">
        <div class="audio-voice-name">${v.name.split(' ').slice(0,2).join(' ')}</div>
        <div class="audio-voice-desc">${v.lang}</div>
      </button>`).join('');
  }

  synth.onvoiceschanged = loadVoices;
  setTimeout(loadVoices, 500);

  function selectVoice(i) {
    selectedVoice = voices[i];
    document.querySelectorAll('.audio-voice-btn').forEach((b,j)=>b.classList.toggle('active',i===j));
    GCP.toast('Voz: ' + selectedVoice.name, 'success');
  }

  function testVoice() {
    speak('Y conoceréis la verdad, y la verdad os hará libres. Juan 8:32');
  }

  function setSpeed(s) {
    speed = s;
    document.querySelectorAll('.audio-speed-btn').forEach(b=>b.classList.toggle('active',parseFloat(b.dataset.speed)===s));
    const lbl = document.getElementById('audio-speed-label');
    if (lbl) lbl.textContent = s + 'x';
  }

  async function ensureBible() {
    if (window._BIBLE_DATA) return window._BIBLE_DATA;
    const r = await fetch('bible.json');
    window._BIBLE_DATA = await r.json();
    return window._BIBLE_DATA;
  }

  async function loadBook() {
    const bk = document.getElementById('audio-book');
    const ch = document.getElementById('audio-chapter');
    if (!bk || !ch) return;
    currentBook = bk.value;
    const book = BOOKS.find(b=>b.id===currentBook);
    if (!book) return;
    ch.innerHTML = Array.from({length:book.c},(_,i)=>`<option value="${i+1}">Capítulo ${i+1}</option>`).join('');
    currentChapter = 1;
    await loadChapter();
  }

  async function loadChapter() {
    const ch = document.getElementById('audio-chapter');
    if (ch) currentChapter = parseInt(ch.value)||1;
    const el = document.getElementById('audio-chapter-text');
    if (!el) return;
    el.innerHTML = '<span style="color:var(--text2)">Cargando...</span>';
    try {
      const bible = await ensureBible();
      const key = currentBook + '-' + currentChapter;
      const vs = bible[key] || [];
      allVerses = vs;
      el.innerHTML = vs.length
        ? vs.map((t,i)=>`<span id="av-${i}"><span class="audio-verse-num">${i+1}</span>${t} </span>`).join('')
        : '<span style="color:var(--text2)">Capítulo no disponible</span>';
    } catch(e) {
      el.innerHTML = '<span style="color:#e57373">Error</span>';
    }
  }

  async function readChapter() {
    await loadChapter();
    if (!allVerses.length) return;
    const book = BOOKS.find(b=>b.id===currentBook);
    currentVerseIdx = 0;
    showPlayer(`${book?.name||''} · Capítulo ${currentChapter}`, `${allVerses.length} versículos`);
    speakByVerse();
  }

  function speakByVerse() {
    if (currentVerseIdx >= allVerses.length) {
      const btn = document.getElementById('audio-play-btn');
      if (btn) btn.textContent = '▶';
      return;
    }
    const text = allVerses[currentVerseIdx];
    updateProgress(currentVerseIdx+1, allVerses.length);
    highlight(currentVerseIdx);
    const u = new SpeechSynthesisUtterance(text);
    if (selectedVoice) u.voice = selectedVoice;
    u.rate = speed; u.pitch = 1.0;
    u.lang = selectedVoice?.lang || 'es-ES';
    u.onend = () => { currentVerseIdx++; speakByVerse(); };
    u.onerror = () => {};
    synth.cancel();
    synth.speak(u);
    const btn = document.getElementById('audio-play-btn');
    if (btn) btn.textContent = '⏸';
    isPaused = false;
  }

  function highlight(i) {
    document.querySelectorAll('.audio-verse-active').forEach(el=>el.classList.remove('audio-verse-active'));
    const el = document.getElementById('av-'+i);
    if (el) { el.classList.add('audio-verse-active'); el.scrollIntoView({behavior:'smooth',block:'center'}); }
  }

  function updateProgress(cur, tot) {
    const fill = document.getElementById('audio-progress-fill');
    const info = document.getElementById('audio-verse-info');
    if (fill) fill.style.width = (tot>0?cur/tot*100:0)+'%';
    if (info) info.textContent = `Versículo ${cur} de ${tot}`;
  }

  function showPlayer(title, sub) {
    const el = document.getElementById('audio-player-info');
    const t = document.getElementById('audio-now-playing');
    const s = document.getElementById('audio-now-sub');
    if (el) el.className = 'audio-player-info active';
    if (t) t.textContent = title;
    if (s) s.textContent = sub;
  }

  function speak(text, onEnd) {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (selectedVoice) u.voice = selectedVoice;
    u.rate = speed; u.pitch = 1.0;
    u.lang = selectedVoice?.lang || 'es-ES';
    u.onend = () => {
      const btn = document.getElementById('audio-play-btn');
      if (btn) btn.textContent = '▶';
      isPaused = false;
      if (onEnd) onEnd();
    };
    synth.speak(u);
    const btn = document.getElementById('audio-play-btn');
    if (btn) btn.textContent = '⏸';
    isPaused = false;
  }

  function togglePlay() {
    if (synth.speaking && !isPaused) {
      synth.pause(); isPaused = true;
      document.getElementById('audio-play-btn').textContent = '▶';
    } else if (isPaused) {
      synth.resume(); isPaused = false;
      document.getElementById('audio-play-btn').textContent = '⏸';
    } else if (allVerses.length) {
      speakByVerse();
    }
  }

  function stop() {
    synth.cancel(); isPaused = false; currentVerseIdx = 0;
    const btn = document.getElementById('audio-play-btn');
    if (btn) btn.textContent = '▶';
    document.querySelectorAll('.audio-verse-active').forEach(el=>el.classList.remove('audio-verse-active'));
  }

  function prevVerse() {
    synth.cancel();
    currentVerseIdx = Math.max(0, currentVerseIdx - 2);
    speakByVerse();
  }

  function nextVerse() {
    synth.cancel();
    currentVerseIdx++;
    speakByVerse();
  }

  function seek(e) {
    if (!allVerses.length) return;
    const bar = document.getElementById('audio-progress-bar');
    currentVerseIdx = Math.floor((e.offsetX/bar.offsetWidth)*allVerses.length);
    speakByVerse();
  }

  async function playRef() {
    const ref = document.getElementById('audio-ref').value.trim();
    if (ref) await quickPlay(ref);
  }

  async function quickPlay(ref) {
    const input = document.getElementById('audio-ref');
    if (input) input.value = ref;
    try {
      const bible = await ensureBible();
      const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
      if (m) {
        const bn = m[1].trim().toLowerCase();
        const ch = parseInt(m[2]), vs = parseInt(m[3]);
        const book = BOOKS.find(b=>b.name.toLowerCase().startsWith(bn)||b.id===bn);
        if (book) {
          const key = book.id+'-'+ch;
          const verses = bible[key]||[];
          const text = verses[vs-1];
          if (text) {
            allVerses = [text]; currentVerseIdx = 0;
            showPlayer(ref, text.slice(0,60)+'...');
            speak(text); return;
          }
        }
      }
      // Si no se parsea exacto, intenta leer capítulo
      const m2 = ref.match(/^(.+?)\s+(\d+)$/);
      if (m2) {
        const bn = m2[1].trim().toLowerCase();
        const ch = parseInt(m2[2]);
        const book = BOOKS.find(b=>b.name.toLowerCase().startsWith(bn)||b.id===bn);
        if (book) {
          const bk = document.getElementById('audio-book');
          const chEl = document.getElementById('audio-chapter');
          if (bk) bk.value = book.id;
          currentBook = book.id; currentChapter = ch;
          if (chEl) chEl.value = ch;
          await readChapter(); return;
        }
      }
      GCP.toast('Referencia no encontrada', 'error');
    } catch(e) { GCP.toast('Error', 'error'); }
  }

  /* API pública — usada desde summaries y kids */
  GCP.audio = {
    selectVoice, testVoice, setSpeed,
    loadBook, loadChapter, readChapter,
    quickPlay, playRef, togglePlay, stop,
    prevVerse, nextVerse, seek,
    speakText(text, title) {
      allVerses = text.split(/\.\s+/).filter(Boolean);
      currentVerseIdx = 0;
      showPlayer(title||'Escuchando...', '');
      speak(text);
    }
  };

  setTimeout(loadBook, 400);
})();
