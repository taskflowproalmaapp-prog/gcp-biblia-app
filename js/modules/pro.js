/* ═══ MÓDULO: Planes Pro ═══ */
(function() {
  const page = document.getElementById('page-pro');

  const style = document.createElement('style');
  style.textContent = `
    .pro-wrap{max-width:900px;margin:0 auto;padding:40px 20px;}
    .pro-hero{text-align:center;margin-bottom:40px;}
    .pro-hero h2{font-family:Georgia,serif;font-size:32px;color:var(--gold);margin:12px 0 8px;}
    .pro-hero p{color:var(--text2);font-size:15px;max-width:500px;margin:0 auto;}
    .pro-trial-banner{background:rgba(212,175,90,.1);border:1px solid rgba(212,175,90,.3);
      border-radius:10px;padding:16px 24px;text-align:center;margin-bottom:32px;}
    .pro-trial-banner strong{color:var(--gold);font-size:16px;}
    .pro-trial-banner p{color:var(--text2);font-size:13px;margin-top:4px;}
    .pro-toggle{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:32px;}
    .pro-toggle span{color:var(--text2);font-size:14px;}
    .pro-toggle span.active{color:var(--gold);font-weight:600;}
    .pro-toggle-btn{width:48px;height:26px;background:rgba(212,175,90,.2);border-radius:13px;
      cursor:pointer;position:relative;border:none;transition:all .2s;}
    .pro-toggle-btn .knob{width:20px;height:20px;background:var(--gold);border-radius:50%;
      position:absolute;top:3px;left:3px;transition:all .2s;}
    .pro-toggle-btn.annual .knob{left:25px;}
    .pro-save-badge{background:var(--gold);color:#0B0E14;font-size:11px;font-weight:700;
      padding:2px 8px;border-radius:20px;margin-left:6px;}
    .pro-plans{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px;}
    .pro-card{background:var(--surface);border:1px solid rgba(212,175,90,.15);
      border-radius:14px;padding:28px;transition:all .2s;}
    .pro-card.featured{border-color:var(--gold);background:rgba(212,175,90,.04);
      box-shadow:0 0 30px rgba(212,175,90,.1);}
    .pro-card-name{font-size:18px;font-weight:700;margin-bottom:8px;}
    .pro-card-price{font-size:40px;font-weight:700;color:var(--gold);line-height:1;}
    .pro-card-period{color:var(--text2);font-size:13px;margin-bottom:6px;}
    .pro-card-annual{color:var(--text2);font-size:12px;margin-bottom:20px;}
    .pro-features{list-style:none;margin-bottom:24px;}
    .pro-features li{padding:6px 0;font-size:13px;color:var(--text2);
      border-bottom:1px solid rgba(255,255,255,.04);display:flex;align-items:center;gap:8px;}
    .pro-features li::before{content:'✓';color:var(--gold);font-weight:700;flex-shrink:0;}
    .pro-features li.inactive::before{content:'·';color:rgba(255,255,255,.2);}
    .pro-features li.inactive{opacity:.5;}
    .pro-cta{width:100%;padding:14px;border-radius:8px;border:none;cursor:pointer;
      font-size:14px;font-weight:700;transition:all .15s;}
    .pro-cta-free{background:transparent;color:var(--gold);border:1px solid rgba(212,175,90,.4);}
    .pro-cta-free:hover{background:rgba(212,175,90,.1);}
    .pro-cta-pro{background:var(--gold);color:#0B0E14;}
    .pro-cta-pro:hover{background:var(--gold-light);transform:translateY(-1px);}
    .pro-payment-section{background:var(--surface);border-radius:var(--r);padding:24px;margin-bottom:24px;}
    .pro-payment-label{color:var(--gold);font-size:11px;font-weight:700;letter-spacing:1px;
      text-transform:uppercase;margin-bottom:16px;}
    .pro-payment-methods{display:flex;gap:12px;flex-wrap:wrap;}
    .pro-payment-btn{flex:1;min-width:140px;background:var(--ink);border:1px solid rgba(212,175,90,.2);
      color:var(--text);padding:14px;border-radius:8px;cursor:pointer;font-size:14px;
      font-weight:600;transition:all .15s;text-align:center;}
    .pro-payment-btn:hover{border-color:var(--gold);color:var(--gold);}
    .pro-mission{background:rgba(212,175,90,.05);border-radius:var(--r);padding:20px;
      text-align:center;border:1px solid rgba(212,175,90,.1);}
    .pro-mission p{color:var(--text2);font-size:13px;line-height:1.8;}
    .pro-active{background:rgba(46,125,50,.1);border:1px solid #4caf50;
      border-radius:10px;padding:20px;text-align:center;margin-bottom:24px;}
    .pro-active h3{color:#81c784;font-size:18px;margin-bottom:8px;}
    .pro-active p{color:var(--text2);font-size:13px;}
    @media(max-width:600px){.pro-plans{grid-template-columns:1fr;}}`;
  document.head.appendChild(style);

  let isAnnual = false;

  function render() {
    const isPro = GCP.auth.isPro();
    const trialEnd = GCP.storage.get('trial_end');
    const trialDays = trialEnd ? Math.max(0, Math.ceil((parseInt(trialEnd) - Date.now()) / 86400000)) : 0;

    page.innerHTML = `
      <div class="pro-wrap">
        <div class="pro-hero">
          <div style="font-size:48px">⭐</div>
          <h2>Generación con Propósito Pro</h2>
          <p>Herramientas avanzadas para estudiar, enseñar y compartir la Palabra de Dios</p>
        </div>

        ${isPro ? `
          <div class="pro-active">
            <h3>✅ Plan Pro Activo</h3>
            <p>${trialDays > 0 ? `Tu período de prueba vence en ${trialDays} días` : 'Gracias por apoyar esta obra de Dios'}</p>
          </div>` : `
          <div class="pro-trial-banner">
            <strong>🎁 7 días de prueba gratuita activa</strong>
            <p>${trialDays > 0 ? `Te quedan ${trialDays} días de prueba` : 'Tu prueba ha vencido — activa Pro para continuar'}</p>
          </div>`}

        <div class="pro-toggle">
          <span class="${!isAnnual ? 'active' : ''}">Mensual</span>
          <button class="pro-toggle-btn ${isAnnual ? 'annual' : ''}" onclick="GCP.pro.togglePeriod()" id="pro-toggle-btn">
            <div class="knob"></div>
          </button>
          <span class="${isAnnual ? 'active' : ''}">Anual <span class="pro-save-badge">AHORRA 30%</span></span>
        </div>

        <div class="pro-plans">
          <div class="pro-card">
            <div class="pro-card-name">Free</div>
            <div class="pro-card-price">$0</div>
            <div class="pro-card-period">Para siempre</div>
            <div class="pro-card-annual">&nbsp;</div>
            <ul class="pro-features">
              <li>Biblia RV1960 completa</li>
              <li>Búsqueda de versículos</li>
              <li>7 días Pro gratis</li>
              <li class="inactive">Temas y Necesidades</li>
              <li class="inactive">Resúmenes con IA</li>
              <li class="inactive">Estudio para niños</li>
              <li class="inactive">Proyección</li>
              <li class="inactive">Voz con IA</li>
              <li class="inactive">Audio Biblia</li>
            </ul>
            <button class="pro-cta pro-cta-free" onclick="GCP.router.go('reader')">Continuar gratis</button>
          </div>

          <div class="pro-card featured">
            <div class="pro-card-name">⭐ Pro</div>
            <div class="pro-card-price" id="pro-price">${isAnnual ? '$2.08' : '$2.99'}</div>
            <div class="pro-card-period">USD / mes</div>
            <div class="pro-card-annual" id="pro-annual-info">
              ${isAnnual ? 'Facturado como $24.99/año' : 'o $24.99/año (ahorra 30%)'}
            </div>
            <ul class="pro-features">
              <li>Todo lo de Free</li>
              <li>116 Temas con oración</li>
              <li>Resúmenes 66 libros con IA</li>
              <li>Estudio bíblico para niños</li>
              <li>Proyección pantalla completa</li>
              <li>Voz con IA bíblica</li>
              <li>Audio Biblia narrada</li>
              <li>Compartir con imagen IA</li>
              <li>Multiidioma (pronto)</li>
            </ul>
            <button class="pro-cta pro-cta-pro" onclick="GCP.pro.showPayment()">
              ${isPro ? '✅ Plan activo' : '🚀 Activar Pro ahora'}
            </button>
          </div>
        </div>

        <div class="pro-payment-section" id="pro-payment" style="display:none">
          <div class="pro-payment-label">Elige tu método de pago</div>
          <div class="pro-payment-methods">
            <div class="pro-payment-btn" onclick="GCP.pro.payStripe()">
              💳 Tarjeta de crédito<br>
              <small style="opacity:.7">Stripe · Internacional</small>
            </div>
            <div class="pro-payment-btn" onclick="GCP.pro.payMercadoPago()">
              🟦 MercadoPago<br>
              <small style="opacity:.7">Latinoamérica</small>
            </div>
          </div>
        </div>

        <div class="pro-mission">
          <div style="font-size:28px;margin-bottom:8px">🙏</div>
          <p><strong style="color:var(--gold)">Una obra para Dios</strong><br>
          Con el excedente de las suscripciones ayudamos a otros ministerios y misiones.
          Tu apoyo hace posible que más personas accedan a la Palabra de Dios.</p>
        </div>
      </div>`;
  }

  function togglePeriod() {
    isAnnual = !isAnnual;
    render();
  }

  function showPayment() {
    const section = document.getElementById('pro-payment');
    if (section) {
      section.style.display = section.style.display === 'none' ? 'block' : 'none';
      section.scrollIntoView({behavior:'smooth'});
    }
  }

  function payStripe() {
    // Por ahora muestra un mensaje — se integra con Stripe cuando tengas la cuenta
    GCP.toast('Stripe se configurará próximamente. ¡Gracias por tu interés!');
    // Cuando tengas Stripe: window.location.href = 'https://buy.stripe.com/TU_LINK';
  }

  function payMercadoPago() {
    // Por ahora muestra un mensaje — se integra con MercadoPago cuando tengas la cuenta
    GCP.toast('MercadoPago se configurará próximamente. ¡Gracias por tu interés!');
    // Cuando tengas MP: window.location.href = 'https://mpago.la/TU_LINK';
  }

  GCP.pro = { togglePeriod, showPayment, payStripe, payMercadoPago };
  render();
})();
