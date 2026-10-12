/* ═══ MÓDULO: Voz con IA ═══ */
(function() {
  const page = document.getElementById('page-voice');

  const style = document.createElement('style');
  style.textContent = `
    .voice-wrap{max-width:700px;margin:0 auto;padding:40px 20px;text-align:center;}
    .voice-hero h2{font-family:Georgia,serif;font-size:28px;color:var(--gold);margin:12px 0 8px;}
    .voice-hero p{color:var(--text2);font-size:14px;margin-bottom:32px;}
    .voice-mic{width:100px;height:100px;border-radius:50%;background:rgba(212,175,90,.1);
      border:3px solid rgba(212,175,90,.3);display:flex;align-items:center;justify-content:center;
      font-size:42px;cursor:pointer;margin:0 auto 24px;transition:all .2s;}
    .voice-mic:hover{background:rgba(212,175,90,.2);border-color:var(--gold);}
    .voice-mic.recording{background:rgba(212,75,75,.2);border-color:#e57373;animation:pulse 1s infinite;}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
    .voice-status{color:var(--text2);font-size:14px;margin-bottom:24px;min-height:20px;}
    .voice-transcript{background:var(--surface);border-radius:var(--r);padding:16px;
      margin-bottom:20px;text-align:left;min-height:60px;color:var(--text);font-size:15px;line-height:1.6;}
    .voice-answer{background:rgba(212,175,90,.06);border:1px solid rgba(212,175,90,.15);
      border-radius:var(--r);padding:20px;text-align:left;font-size:14px;color:var(--text);
      line-height:1.75;display:none;}
    .voice-answer.active{display:block;}
    .voice-answer-label{color:var(--gold);font-size:11px;font-weight:700;letter-spacing:1px;
      text-transform:uppercase;margin-bottom:10px;}
    .voice-suggestions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:24px;}
    .voice-sug{background:rgba(212,175,90,.08);border:1px solid rgba(212,175,90,.15);
      color:var(--text2);padding:6px 14px;border-radius:20px;cursor:pointer;font-size:12px;transition:all .15s;}
    .voice-sug:hover{color:var(--gold);border-color:var(--gold);}
    .voice-text-input{display:flex;gap:8px;margin-bottom:16px;}
    .voice-text-input input{flex:1;background:var(--surface);border:1px solid rgba(212,175,90,.2);
      color:var(--text);padding:10px 14px;border-radius:8px;font-size:14px;outline:none;}
    .voice-text-input input:focus{border-color:var(--gold);}`;
  document.head.appendChild(style);

  page.innerHTML = `
    <div class="voice-wrap">
      <div class="voice-hero">
        <div style="font-size:48px">🎤</div>
        <h2>Voz con IA Bíblica</h2>
        <p>Habla o escribe tu pregunta y la IA responde con la Palabra de Dios</p>
      </div>
      <div class="voice-mic" id="voice-mic" onclick="GCP.voice.toggleMic()">🎤</div>
      <div class="voice-status" id="voice-status">Toca el micrófono para hablar</div>
      <div class="voice-text-input">
        <input id="voice-text" type="text" placeholder="O escribe tu pregunta aquí..."
          onkeydown="if(event.key==='Enter') GCP.voice.askText()">
        <button class="btn btn-primary" onclick="GCP.voice.askText()">→</button>
      </div>
      <div class="voice-suggestions">
        ${['¿Qué dice la Biblia sobre el perdón?','Versículo para la ansiedad',
           '¿Cómo orar mejor?','Versículo de esperanza'].map(s=>
          `<span class="voice-sug" onclick="GCP.voice.ask('${s}')">${s}</span>`).join('')}
      </div>
      <div class="voice-transcript" id="voice-transcript" style="display:none"></div>
      <div class="voice-answer" id="voice-answer">
        <div class="voice-answer-label">✨ Respuesta con IA</div>
        <div id="voice-answer-text"></div>
      </div>
    </div>`;

  let recognition = null;
  let isRecording = false;

  function initSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.lang = 'es-ES';
    r.continuous = false;
    r.interimResults = false;
    r.onresult = e => {
      const text = e.results[0][0].transcript;
      document.getElementById('voice-transcript').style.display = 'block';
      document.getElementById('voice-transcript').textContent = `"${text}"`;
      ask(text);
    };
    r.onend = () => stopRecording();
    r.onerror = () => {
      stopRecording();
      GCP.toast('Error con el micrófono. Usa el texto.', 'error');
    };
    return r;
  }

  function toggleMic() {
    if (isRecording) { stopRecording(); return; }
    recognition = initSpeech();
    if (!recognition) {
      GCP.toast('Tu navegador no soporta voz. Usa el texto.');
      return;
    }
    isRecording = true;
    document.getElementById('voice-mic').classList.add('recording');
    document.getElementById('voice-mic').textContent = '⏹️';
    document.getElementById('voice-status').textContent = '🔴 Escuchando...';
    recognition.start();
  }

  function stopRecording() {
    isRecording = false;
    const mic = document.getElementById('voice-mic');
    if (mic) { mic.classList.remove('recording'); mic.textContent = '🎤'; }
    const status = document.getElementById('voice-status');
    if (status) status.textContent = 'Toca el micrófono para hablar';
    if (recognition) recognition.stop();
  }

  function askText() {
    const input = document.getElementById('voice-text');
    const q = input.value.trim();
    if (!q) return;
    document.getElementById('voice-transcript').style.display = 'block';
    document.getElementById('voice-transcript').textContent = `"${q}"`;
    input.value = '';
    ask(q);
  }

  async function ask(question) {
    const answer = document.getElementById('voice-answer');
    const answerText = document.getElementById('voice-answer-text');
    const status = document.getElementById('voice-status');
    answer.className = 'voice-answer active';
    answerText.textContent = '✨ Buscando en la Palabra de Dios...';
    if (status) status.textContent = 'Buscando respuesta...';

    try {
      const response = await GCP.ai.ask(
        `Eres un consejero bíblico usando la Biblia Reina Valera 1960.
Responde esta pregunta de forma pastoral, cálida y bíblica: "${question}"

Incluye:
1. Una respuesta directa y compasiva (2-3 párrafos)
2. Al menos 2 versículos relevantes de la RV1960 con su referencia
3. Una oración corta al final

Responde en español, de forma clara y accesible.`, 800);

      answerText.innerHTML = response.replace(/\n/g, '<br>');
      if (status) status.textContent = 'Toca el micrófono para hablar';
    } catch(e) {
      answerText.textContent = 'Error al obtener respuesta. Intenta de nuevo.';
    }
  }

  GCP.voice = { toggleMic, ask, askText };
})();
