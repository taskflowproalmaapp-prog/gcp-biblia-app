/* ═══ MÓDULO: Audio Biblia ═══ */
(function() {
  const page = document.getElementById('page-audio');

  const style = document.createElement('style');
  style.textContent = `
    .audio-wrap{max-width:800px;margin:0 auto;padding:28px 20px;}
    .audio-hero{text-align:center;margin-bottom:28px;}
    .audio-hero h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin:12px 0 8px;}
    .audio-hero p{color:var(--text2);font-size:14px;}
    .audio-player{background:var(--surface);border:1px solid rgba(212,175,90,.2);
      border-radius:14px;padding:24px;margin-bottom:24px;}
    .audio-book-title{font-family:Georgia,serif;font-size:20px;color:var(--gold);margin-bottom:4px;}
    .audio-chapter-info{color:var(--text2);font-size:13px;margin-bottom:20px;}
    .audio-controls{display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;}
    .audio-btn{background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.2);
      color:var(--gold);width:44px;height:44px;border-radius:50%;cursor:pointer;
      font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .15s;}
    .audio-btn:hover{background:rgba(212,175,90,.25);}
    .audio-play-btn{width:56px;height:56px;font-size:22px;background:var(--gold);
      color:#0B0E14;border-color:var(--gold);}
    .audio-play-btn:hover{background:var(--gold-light);}
    .audio-progress{flex:1;min-width:200px;}
    .audio-progress input[type=range]{width:100%;accent-color:var(--gold);}
    .audio-time{color:var(--text2);font-size:12px;display:flex;justify-content:space-between;}
    .audio-speed{background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.2);
      color:var(--gold);padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;}
    .audio-tts-section{background:var(--surface);border-radius:var(--r);padding:20px;margin-bottom:20px;}
    .audio-tts-label{color:var(--gold);font-size:11px;font-weight:700;letter-spacing:1px;
      text-transform:uppercase;margin-bottom:10px;}
    .audio-tts-input{display:flex;gap:8px;margin-bottom:12px;}
    .audio-tts-input input{flex:1;background:var(--ink);border:1px solid rgba(212,175,90,.2);
      color:var(--text);padding:10px 14px;border-radius:8px;font-size:14px;outline:none;}
    .audio-tts-input input:focus{border-color:var(--gold);}
    .audio-quick{display:flex;gap:8px;flex-wrap:wrap;}
    .audio-quick-btn{background:rgba(212,175,90,.08);border:1px solid rgba(212,175,90,.15);
      color:var(--text2);padding:6px 14px;border-radius:20px;cursor:pointer;font-size:12px;transition:all .15s;}
    .audio-quick-btn:hover{color:var(--gold);border-color:var(--gold);}
    .audio-reading{background:rgba(212,175,90,.05);border-radius:var(--r);padding:20px;
      max-height:300px;overflow-y:auto;color:var(--text);font-size:15px;line-height:1.9;
      font-family:Georgia,serif;display:none;}
    .audio-reading.active{display:block;}
    .audio-verse-highlight{background:rgba(212,175,90,.2);border-radius:3px;padding:1px 2px;}`;
  document.head.appendChild(style);

  page.innerHTML = `
    <div class="audio-wrap">
      <div class="audio-hero">
        <div style="font-size:48px">🔊</div>
        <h2>Audio Biblia</h2>
        <p>Escucha la Palabra de Dios. Ideal para invidentes, ancianos y en cualquier momento.</p>
      </div>

      <div class="audio-tts-section">
        <div class="audio-tts-label">📖 Escuchar versículo o pasaje</div>
        <div class="audio-tts-input">
          <input id="audio-ref-input" type="text" placeholder="Ej: Juan 3:16 o Salmos 23">
          <button class="btn btn-primary" onclick="GCP.audio.loadAndPlay()">▶ Escuchar</button>
        </div>
        <div class="audio-quick">
          ${['Juan 3:16','Salmos 23','Filipenses 4:13','Romanos 8:28','Isaías 40:31'].map(r=>
            `<span class="audio-quick-btn" onclick="GCP.audio.quickPlay('${r}')">${r}</span>`).join('')}
        </div>
      </div>

      <div class="audio-player" id="audio-player" style="display:none">
        <div class="audio-book-title" id="audio-title">—</div>
        <div class="audio-chapter-info" id="audio-info">—</div>
        <div class="audio-reading" id="audio-reading"></div>
        <div style="margin-top:16px">
          <div class="audio-controls">
            <button class="audio-btn" id="audio-play-btn" onclick="GCP.audio.togglePlay()">▶</button>
            <button class="audio-btn" onclick="GCP.audio.slower()">🐢</button>
            <button class="audio-btn" onclick="GCP.audio.faster()">🐇</button>
            <button class="audio-btn" onclick="GCP.audio.stop()">⏹</button>
          </div>
          <div style="color:var(--text2);font-size:13px;margin-top:8px;">
            Velocidad: <span id="audio-speed-label">1x</span>
          </div>
        </div>
      </div>

      <div class="audio-tts-section">
        <div class="audio-tts-label">💡 Cómo funciona</div>
        <p style="color:var(--text2);font-size:13px;line-height:1.7">
          La app usa la voz del dispositivo para leer la Biblia en voz alta.
          Compatible con todos los navegadores modernos.
          Para mejor experiencia en invidentes, activa el modo de lectura de tu dispositivo.
        </p>
      </div>
    </div>`;

  let utterance = null;
  let isPaused = false;
  let speed = 1.0;
  let currentText = '';

  function quickPlay(ref) {
    document.getElementById('audio-ref-input').value = ref;
    loadAndPlay();
  }

  async function loadAndPlay() {
    const ref = document.getElementById('audio-ref-input').value.trim();
    if (!ref) return;
    GCP.toast('Cargando...');

    try {
      const resp = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=rv1960`);
      const data = await resp.json();
      if (!data.text) { GCP.toast('Versículo no encontrado', 'error'); return; }

      currentText = data.text.trim();
      const title = `${data.reference || ref}`;
      document.getElementById('audio-title').textContent = title;
      document.getElementById('audio-info').textContent = `${currentText.length} caracteres · ${Math.ceil(currentText.length/15)} seg aprox.`;

      const reading = document.getElementById('audio-reading');
      reading.className = 'audio-reading active';
      reading.textContent = currentText;

      document.getElementById('audio-player').style.display = 'block';
      speak(currentText);
    } catch(e) {
      GCP.toast('Error al cargar el versículo', 'error');
    }
  }

  function speak(text) {
    window.speechSynthesis.cancel();
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.onend = () => {
      document.getElementById('audio-play-btn').textContent = '▶';
      isPaused = false;
    };
    window.speechSynthesis.speak(utterance);
    document.getElementById('audio-play-btn').textContent = '⏸';
    isPaused = false;
  }

  function togglePlay() {
    if (!currentText) return;
    if (window.speechSynthesis.speaking && !isPaused) {
      window.speechSynthesis.pause();
      isPaused = true;
      document.getElementById('audio-play-btn').textContent = '▶';
    } else if (isPaused) {
      window.speechSynthesis.resume();
      isPaused = false;
      document.getElementById('audio-play-btn').textContent = '⏸';
    } else {
      speak(currentText);
    }
  }

  function stop() {
    window.speechSynthesis.cancel();
    isPaused = false;
    document.getElementById('audio-play-btn').textContent = '▶';
  }

  function faster() {
    speed = Math.min(speed + 0.25, 2.0);
    document.getElementById('audio-speed-label').textContent = speed + 'x';
    if (window.speechSynthesis.speaking) { stop(); speak(currentText); }
  }

  function slower() {
    speed = Math.max(speed - 0.25, 0.5);
    document.getElementById('audio-speed-label').textContent = speed + 'x';
    if (window.speechSynthesis.speaking) { stop(); speak(currentText); }
  }

  GCP.audio = { loadAndPlay, quickPlay, togglePlay, stop, faster, slower };
})();
