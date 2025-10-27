/**
 * 🔊 SISTEMA DE LECTOR DE VOZ - VERSIÓN ESTABLE MULTIPÁGINA
 * ✅ Conserva diseño y botones originales
 * ✅ Se mantiene activo entre páginas sin clic
 * ✅ Soluciona el bloqueo por cambio de HTML
 */

(function() {
  'use strict';

  // 🔹 ESTADO GLOBAL
  let lectorActivo = localStorage.getItem('lectorVozActivo') === 'true';
  let vozInicializada = false;
  let sistemaListo = false;

  console.log('🚀 Sistema de voz iniciando... Estado:', lectorActivo ? 'ACTIVO' : 'DESACTIVADO');

  // ========================================
  // 🔊 SISTEMA DE VOZ
  // ========================================

  function inicializarVoz() {
    if (vozInicializada) return true;
    if ('speechSynthesis' in window) {
      const voces = window.speechSynthesis.getVoices();
      if (voces.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          vozInicializada = true;
          console.log('✅ Voces cargadas:', window.speechSynthesis.getVoices().length);
        };
      } else {
        vozInicializada = true;
        console.log('✅ Voces disponibles:', voces.length);
      }
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
      return true;
    }
    console.error('❌ Tu navegador no soporta síntesis de voz');
    return false;
  }

 // -------------------------
// LECTURA VÍA TTS (API URL) + FALLBACK
// -------------------------
let _audioActual = null;
let _audioTimeout = null;

/**
 * Genera la URL de Google Translate TTS para el texto dado.
 * (Solución práctica; no es una API oficial con garantías)
 */
function generarUrlGoogleTTS(texto, lang = 'es') {
  // client=tw-ob suele funcionar; tl -> language
  const base = 'https://translate.google.com/translate_tts';
  const params = new URLSearchParams({
    ie: 'UTF-8',
    q: texto,
    tl: lang,
    client: 'tw-ob'
  });
  return `${base}?${params.toString()}`;
}

/**
 * Lee texto: intenta reproducir un audio TTS por URL.
 * Si falla (CORS/restricción/play error), usa speechSynthesis como fallback.
 */
function leerTexto(texto) {
  if (!lectorActivo || !texto || texto.trim() === "") return;
  detenerLectura(); // parar lo que hubiera

  const textoLimpio = texto.replace(/\s+/g, ' ').trim();
  // Limitar longitud por seguridad en la URL (puedes ajustar)
  const textoParaUrl = textoLimpio.length > 200 ? textoLimpio.substring(0, 200) + '...' : textoLimpio;

  // 1) Intento con Google Translate TTS (audio)
  try {
    const url = generarUrlGoogleTTS(textoParaUrl, 'es');
    const audio = new Audio();
    audio.crossOrigin = "anonymous"; // por si acaso
    audio.src = url;
    audio.preload = 'auto';
    audio.autoplay = false;

    // guardar referencia global
    _audioActual = audio;

    // reproducir y manejar errores
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // éxito: limpiar eventual timeout
        if (_audioTimeout) { clearTimeout(_audioTimeout); _audioTimeout = null; }
      }).catch((err) => {
        console.warn('⚠️ Reproducción TTS por URL falló, usando fallback speechSynthesis:', err);
        // fallback
        _usarFallbackSpeechSynthesis(textoLimpio);
      });
    } else {
      // Algunos navegadores retornan undefined, dejamos que suene
    }

    // por si la URL queda colgada, limitamos la reproducción máxima a 12s
    _audioTimeout = setTimeout(() => {
      if (_audioActual) {
        try { _audioActual.pause(); _audioActual.src = ''; } catch(e) {}
        _audioActual = null;
      }
    }, 12000);

    return;
  } catch (err) {
    console.warn('⚠️ Error al intentar TTS por URL, fallback:', err);
    _usarFallbackSpeechSynthesis(textoLimpio);
  }
}
// Llamar esto justo después de activar el lector (una vez que usuario presionó "Activar")
function desbloquearAudio() {
  // 1) Silent speechSynthesis (ya lo usas)
  try { window.speechSynthesis.speak(new SpeechSynthesisUtterance(' ')); } catch(e) {}

  // 2) Reproducir breve audio silencioso por URL (para permisos)
  try {
    const a = new Audio();
    a.src = generarUrlGoogleTTS(' ', 'es'); // texto vacío / espacio
    a.volume = 0;
    a.play().catch(()=>{ /* no importa */ });
  } catch(e) {}
}


/**
 * Fallback: speechSynthesis del navegador
 */
function _usarFallbackSpeechSynthesis(texto) {
  try {
    if (!('speechSynthesis' in window)) {
      console.error('❌ speechSynthesis no disponible');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voces = window.speechSynthesis.getVoices();
    const vozEspanol = voces.find(v => v.lang && v.lang.includes('es'));
    if (vozEspanol) utterance.voice = vozEspanol;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('❌ Fallback speechSynthesis falló:', error);
  }
}

/**
 * Detener toda la reproducción (audio URL o speechSynthesis)
 */
function detenerLectura() {
  // Cancelar audio por URL
  try {
    if (_audioTimeout) { clearTimeout(_audioTimeout); _audioTimeout = null; }
    if (_audioActual) {
      try { _audioActual.pause(); } catch (e) {}
      try { _audioActual.src = ''; } catch (e) {}
      _audioActual = null;
    }
  } catch (err) {
    console.warn('⚠️ Error al limpiar audioActual:', err);
  }

  // Cancelar speechSynthesis
  try {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch (error) {
    console.warn('⚠️ Error al cancelar speechSynthesis:', error);
  }
}

  // ========================================
  // 🎨 PANEL E INTERFAZ (NO SE MODIFICA)
  // ========================================

  function crearPanel() {
    const panelExistente = document.getElementById('accesibilidadPanel');
    if (panelExistente) panelExistente.remove();
    const html = `
      <div class="accessibility-panel" id="accesibilidadPanel">
        <button class="acc-toggle-arrow" id="toggleAccPanel" aria-label="Abrir panel de accesibilidad">
          <span class="arrow-icon">◀</span>
        </button>
        <div class="acc-panel-content">
          <div class="acc-panel-header">
            <h3>🔊 Lector de Voz</h3>
          </div>
          <div class="acc-panel-buttons">
            <button class="acc-btn acc-btn-activar" id="btnActivarVoz">
              <span class="btn-icon">✓</span>
              <span class="btn-text">Activar</span>
            </button>
            <button class="acc-btn acc-btn-desactivar" id="btnDesactivarVoz">
              <span class="btn-icon">✕</span>
              <span class="btn-text">Desactivar</span>
            </button>
          </div>
          <div class="acc-panel-status" id="statusLector">
            <span class="status-indicator"></span>
            <span class="status-text">Desactivado</span>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    crearEstilos();
  }

  function crearEstilos() {
    if (document.getElementById('accesibilidad-styles')) return;
    const style = document.createElement('style');
    style.id = 'accesibilidad-styles';
    style.textContent = `
      /* (NO SE MODIFICA EL DISEÑO ORIGINAL) */
      .accessibility-panel { position: fixed; right: 0; top: 50%; transform: translateY(-50%); z-index: 9999; display: flex; align-items: center; }
      .acc-toggle-arrow { width: 50px; height: 120px; background: linear-gradient(135deg, #06b6d4, #0ea5e9); border: none; border-radius: 20px 0 0 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: -4px 0 15px rgba(6, 182, 212, 0.3); transition: all 0.3s ease; }
      .acc-toggle-arrow:hover { background: linear-gradient(135deg, #0ea5e9, #06b6d4); transform: translateX(-5px); }
      .arrow-icon { font-size: 28px; color: white; font-weight: bold; transition: transform 0.3s ease; }
      .acc-panel-content { position: absolute; right: 50px; width: 280px; background: white; border-radius: 20px 0 0 20px; box-shadow: -6px 4px 25px rgba(0, 0, 0, 0.15); padding: 25px 20px; transform: translateX(100%); transition: transform 0.4s ease; opacity: 0; pointer-events: none; }
      .accessibility-panel.open .acc-panel-content { transform: translateX(0); opacity: 1; pointer-events: all; }
      .accessibility-panel.open .arrow-icon { transform: rotate(180deg); }
      .acc-panel-header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #e2e8f0; }
      .acc-panel-header h3 { font-size: 1.4rem; color: #4f46e5; font-weight: bold; margin: 0; }
      .acc-panel-buttons { display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; }
      .acc-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 20px; border: none; border-radius: 15px; cursor: pointer; font-size: 18px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
      .acc-btn:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); }
      .acc-btn-activar { background: linear-gradient(135deg, #06b6d4, #0ea5e9); color: white; }
      .acc-btn-activar.active { background: linear-gradient(135deg, #10b981, #34d399); animation: pulse 2s infinite; }
      .acc-btn-desactivar { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
      .acc-panel-status { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; background: #f1f5f9; border-radius: 12px; font-size: 14px; font-weight: 600; }
      .status-indicator { width: 12px; height: 12px; border-radius: 50%; background: #94a3b8; }
      .status-indicator.activo { background: #10b981; animation: pulse-dot 2s infinite; }
      @keyframes pulse { 0%, 100% { box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); } 50% { box-shadow: 0 6px 30px rgba(16, 185, 129, 0.6); } }
      @keyframes pulse-dot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.8; } }
      /* NOTIFICACIONES */
        .notificacion-lector {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white;
        padding: 35px 45px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(79, 70, 229, 0.4);
        z-index: 10000;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        animation: fadeInScale 0.4s ease;
        max-width: 90%;
        width: 450px;
      }
      .notificacion-lector .icono {
        font-size: 55px;
        margin-bottom: 15px;
        animation: bounce 1.5s infinite;
      }
      .notificacion-lector .titulo {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 12px;
      }
      .notificacion-lector .mensaje {
        line-height: 1.7;
        font-size: 16px;
        margin-bottom: 10px;
      }
      .notificacion-lector .instruccion {
        font-size: 15px;
        opacity: 0.95;
        font-weight: 500;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 2px solid rgba(255, 255, 255, 0.3);
      }
      .notificacion-lector.clickeable {
        cursor: pointer;
      }
      .notificacion-lector.clickeable:hover {
        transform: translate(-50%, -50%) scale(1.03);
        box-shadow: 0 15px 50px rgba(16, 185, 129, 0.5);
      }
      .notificacion-lector.activacion {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        box-shadow: 0 10px 40px rgba(79, 70, 229, 0.4);
      }
      @keyframes fadeInScale {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .overlay-lector {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9998;
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
// FUNCIONES DE NOTIFICACIONES
function esActividad() {
  const rutaActual = window.location.pathname;
  return (rutaActual.includes('Actividades/') || rutaActual.includes('/Actividades/')) && 
         !rutaActual.includes('Ejercicios.html');
}

function mostrarNotificacionActivacion() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay-lector';
  const notif = document.createElement('div');
  notif.className = 'notificacion-lector activacion clickeable';
  notif.innerHTML = `
    <div class="icono">🔊</div>
    <div class="titulo">¡Lector de Voz Activado!</div>
    <div class="mensaje">
      El lector de voz está ahora activo.<br>
      Los textos se reproducirán automáticamente al pasar el cursor sobre ellos.
    </div>
    <div class="instruccion">
      👆 <strong>Haz clic aquí para continuar</strong>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(notif);
  
  // Leer el contenido completo de la notificación
  const textoCompleto = 'Lector de Voz Activado. El lector de voz está ahora activo. Los textos se reproducirán automáticamente al pasar el cursor sobre ellos. Haz clic para continuar.';  leerTexto(textoCompleto);
  
  // Función para cerrar la notificación
  function cerrarNotificacion() {
    notif.style.animation = 'fadeInScale 0.3s ease reverse';
    overlay.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
      if (notif.parentNode) notif.remove();
      if (overlay.parentNode) overlay.remove();
      setTimeout(() => anunciarPagina(), 500);
    }, 300);
    document.removeEventListener('click', cerrarNotificacion);
    document.removeEventListener('keydown', cerrarNotificacion);
  }
  
  // Cerrar al hacer clic
  document.addEventListener('click', cerrarNotificacion);
  document.addEventListener('keydown', cerrarNotificacion);
}

function mostrarNotificacionRecordatorio() {
  if (!lectorActivo || !esActividad()) return;
  const overlay = document.createElement('div');
  overlay.className = 'overlay-lector';
  const notif = document.createElement('div');
  notif.className = 'notificacion-lector clickeable';
  notif.innerHTML = `
    <div class="icono">🔊</div>
    <div class="titulo">Lector de Voz Activo</div>
    <div class="mensaje">El lector de voz continúa activado en esta actividad.</div>
    <div class="instruccion">
      👆 <strong>Haz clic en cualquier parte</strong> para continuar<br>
      O desactívalo desde el panel lateral si lo prefieres
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(notif);
  function remover() {
    notif.style.animation = 'fadeInScale 0.3s ease reverse';
    overlay.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
      if (notif.parentNode) notif.remove();
      if (overlay.parentNode) overlay.remove();
      desbloquearAudio();
      setTimeout(() => anunciarPagina(), 500);
    }, 300);
    document.removeEventListener('click', remover);
    document.removeEventListener('keydown', remover);
  }
  document.addEventListener('click', remover);
  document.addEventListener('keydown', remover);
}
  // ========================================
  // 📱 CONTROL DE ESTADO Y EVENTOS
  // ========================================

  function actualizarUI() {
    const indicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    const btnActivar = document.getElementById('btnActivarVoz');
    const btnDesactivar = document.getElementById('btnDesactivarVoz');
    if (!indicator || !statusText || !btnActivar || !btnDesactivar) return;
    if (lectorActivo) {
      indicator.classList.add('activo');
      statusText.textContent = 'Activado ✓';
      btnActivar.classList.add('active');
      btnDesactivar.classList.remove('active');
    } else {
      indicator.classList.remove('activo');
      statusText.textContent = 'Desactivado';
      btnActivar.classList.remove('active');
      btnDesactivar.classList.add('active');
    }
  }

  function activar() {
    lectorActivo = true;
    localStorage.setItem('lectorVozActivo', 'true');
    actualizarUI();
    console.log('✅ LECTOR ACTIVADO');
    desbloquearAudio();
    mostrarNotificacionActivacion();
    // Ya no necesitamos setTimeout aquí porque se maneja dentro de la notificación
  }

  function desactivar() {
    lectorActivo = false;
    localStorage.setItem('lectorVozActivo', 'false');
    detenerLectura();
    actualizarUI();
    console.log('❌ LECTOR DESACTIVADO');
  }

  function anunciarPagina() {
    if (!lectorActivo) return;
    const titulo = document.querySelector('h1')?.textContent || document.querySelector('.titulo')?.textContent || document.title || 'Página cargada';
    console.log('📢 Anunciando:', titulo);
    leerTexto(titulo);
  }

  function configurarEventos() {
    let ultimoTexto = '', ultimoElemento = null, timerHover = null;
    document.body.addEventListener('mouseover', (e) => {
      if (!lectorActivo || !sistemaListo) return;
      const elem = e.target;
      if (elem.closest('.accessibility-panel')) return;
      if (elem === ultimoElemento) return;
      if (elem.clientHeight < 5 || elem.clientWidth < 5) return;
      let texto = elem.getAttribute('aria-label') || elem.getAttribute('title') || elem.getAttribute('alt') || elem.textContent?.trim() || '';
      texto = texto.replace(/\s+/g, ' ').trim();
      if (!texto || texto === ultimoTexto) return;
      if (texto.length > 200) texto = texto.substring(0, 200) + '...';
      ultimoElemento = elem;
      clearTimeout(timerHover);
      timerHover = setTimeout(() => {
        ultimoTexto = texto;
        leerTexto(texto);
      }, 250);
    }, true);
    document.body.addEventListener('mouseout', (e) => {
      if (e.target === ultimoElemento) ultimoElemento = null;
      clearTimeout(timerHover);
    }, true);
  }

  // ========================================
  // 🚀 INICIALIZACIÓN MULTIPÁGINA
  // ========================================

  function iniciar() {
    console.log('🔧 Iniciando sistema...');
    if (!inicializarVoz()) return;
    crearPanel();
    const panel = document.getElementById('accesibilidadPanel');
    const toggleBtn = document.getElementById('toggleAccPanel');
    const btnActivar = document.getElementById('btnActivarVoz');
    const btnDesactivar = document.getElementById('btnDesactivarVoz');
    toggleBtn.addEventListener('click', e => { e.stopPropagation(); panel.classList.toggle('open'); });
    btnActivar.addEventListener('click', e => { e.stopPropagation(); activar(); });
    btnDesactivar.addEventListener('click', e => { e.stopPropagation(); desactivar(); });
    document.addEventListener('click', e => { if (!panel.contains(e.target) && panel.classList.contains('open')) panel.classList.remove('open'); });
    configurarEventos();
    sistemaListo = true;
    actualizarUI();

    if (lectorActivo) {
      try {
        const utter = new SpeechSynthesisUtterance(' ');
        utter.volume = 0;
        utter.rate = 1;
        window.speechSynthesis.speak(utter);
      } catch (err) {
        console.warn('⚠️ No se pudo emitir sonido silencioso:', err);
      }
      if (esActividad()) {
        setTimeout(() => mostrarNotificacionRecordatorio(), 500);
      } else {
        setTimeout(() => anunciarPagina(), 1000);
      }
    }

    console.log('✅ Sistema listo - Estado:', lectorActivo ? 'ACTIVO' : 'DESACTIVADO');
  }

  document.addEventListener('DOMContentLoaded', () => {
    iniciar();
    if (lectorActivo && 'speechSynthesis' in window) {
      let checkInterval = setInterval(() => {
        const voces = window.speechSynthesis.getVoices();
        if (voces.length > 0) {
          vozInicializada = true;
          clearInterval(checkInterval);
          console.log('🔁 Voces reactivadas en la nueva página');
        }
      }, 300);
    }
  });

})();