/********************
 * Datos en memoria *
 ********************/
const actividadesTEA = {
  emociones: [
    { nombre: 'alegría', icono: '😊' },
    { nombre: 'tristeza', icono: '😢' },
    { nombre: 'enojo', icono: '😠' },
    { nombre: 'sorpresa', icono: '😲' },
    { nombre: 'miedo', icono: '😨' },
    { nombre: 'calma', icono: '😌' }
  ],
  rutinas: [
    ["Despertar ⏰", "Cepillarse 🪥", "Desayunar 🍳", "Ir al colegio 🎒"],
    ["Almorzar 🍽️", "Jugar 🎲", "Hacer tareas 📚", "Merienda 🥪"],
    ["Bañarse 🚿", "Cenar 🍽️", "Cepillarse 🪥", "Dormir 🛌"]
  ],
  pares: [
    { id: 'manzana', texto: 'manzana', icono: '🍎' },
    { id: 'pelota', texto: 'pelota', icono: '⚽' },
    { id: 'casa', texto: 'casa', icono: '🏠' },
    { id: 'libro', texto: 'libro', icono: '📖' }
  ]
};

/********************
 * Referencias DOM *
 ********************/
const tabs = {
  emociones: document.getElementById('tab-emociones'),
  rutinas: document.getElementById('tab-rutinas'),
  pares: document.getElementById('tab-pares')
};

/********************
 * Estado global *
 ********************/
let currentActivity = null;
let progress = JSON.parse(localStorage.getItem('teaProgress')) || {
  emociones: { completed: 0, bestScore: 0 },
  rutinas: { completed: 0, bestScore: 0 },
  pares: { completed: 0, bestScore: 0 }
};

let correctos = 0;

/********************
 * Funciones de límite dinámico *
 ********************/
function getLimiteActual() {
  return currentActivity === 'rutinas' ? 3 : 10;
}

function resetearContador() {
  correctos = 0;
  actualizarContador();
}

function actualizarContador() {
  const marcador = document.getElementById("marcador");
  if (marcador) {
    marcador.textContent = `Correctos: ${correctos}/${getLimiteActual()}`;
    marcador.setAttribute('aria-live', 'polite');
  }
}

function sumarCorrecto(callback) {
  if (correctos < getLimiteActual()) {
    correctos++;
    actualizarContador();
    progress[currentActivity].completed++;
    if (correctos >= getLimiteActual()) {
      progress[currentActivity].bestScore = Math.max(progress[currentActivity].bestScore, correctos);
      localStorage.setItem('teaProgress', JSON.stringify(progress));

      reproducirSonido('fin'); // 🔊 sonido final al cerrar actividad
      mostrarFeedback(`¡Has alcanzado ${getLimiteActual()}/${getLimiteActual()} correctos! 🎉`, "correcto");

      setTimeout(volverAlMenu, 2000);
      return;
    }
    setTimeout(callback, 1000);
  }
}

/********************
 * Abrir / Cerrar vistas
 ********************/
function abrirActividad(tipo) {
  try {
    currentActivity = tipo;
    document.getElementById('menu-principal').hidden = true;

    const vista = document.getElementById('vista-actividad');
    vista.hidden = false;
    vista.classList.add("activa");

    Object.values(tabs).forEach(a => a.hidden = true);
    tabs[tipo].hidden = false;
    tabs[tipo].innerHTML = "";
    resetearContador();

    switch (tipo) {
      case 'emociones': renderEmociones(); break;
      case 'rutinas': rutinaIndex = 0; renderRutinas(); break;
      case 'pares': renderPares(); break;
      default: throw new Error('Actividad no reconocida');
    }
  } catch (error) {
    console.error('Error al abrir actividad:', error);
    mostrarFeedback('¡Error al cargar la actividad!', 'incorrecto');
    setTimeout(volverAlMenu, 1500);
  }
}

function volverAlMenu() {
  const vista = document.getElementById('vista-actividad');
  vista.hidden = true;
  vista.classList.remove("activa");

  document.getElementById('menu-principal').hidden = false;
  currentActivity = null;
}

/********************
 * EMOCIONES
 ********************/
function renderEmociones() {
  tabs.emociones.innerHTML = '';
  const target = actividadesTEA.emociones[Math.floor(Math.random() * actividadesTEA.emociones.length)];

  const marcador = document.createElement("div");
  marcador.id = "marcador";
  marcador.className = "marcador";
  marcador.textContent = `Correctos: ${correctos}/${getLimiteActual()}`;
  tabs.emociones.appendChild(marcador);

  const divTarget = document.createElement('div');
  divTarget.id = 'instruccion';
  divTarget.textContent = 'Selecciona la emoción: ' + target.nombre;
  divTarget.setAttribute('aria-label', `Instrucción: Selecciona la emoción ${target.nombre}`);
  tabs.emociones.appendChild(divTarget);

  const opciones = document.createElement('div');
  opciones.className = 'opciones';

  actividadesTEA.emociones.forEach(e => {
    const btn = document.createElement('button');
    btn.className = 'tarjeta-bonita';
    btn.textContent = e.icono;
    btn.setAttribute('aria-label', `Emoción ${e.nombre}`);
    btn.addEventListener('click', () => {
      if (e.nombre === target.nombre) {
        btn.classList.add('correct');
        reproducirSonido('correcto');
        mostrarFeedback("¡Correcto!", "correcto");
        sumarCorrecto(renderEmociones);
      } else {
        btn.classList.add('incorrecta');
        reproducirSonido('incorrecto');
        mostrarFeedback("Intenta otra vez", "incorrecto");
      }
    });
    opciones.appendChild(btn);
  });

  tabs.emociones.appendChild(opciones);
}

/********************
 * RUTINAS
 ********************/
let rutinaIndex = 0;

function renderRutinas() {
  tabs.rutinas.innerHTML = '';

  const marcador = document.createElement("div");
  marcador.id = "marcador";
  marcador.className = "marcador";
  marcador.textContent = `Correctos: ${correctos}/${getLimiteActual()}`;
  tabs.rutinas.appendChild(marcador);

  if (rutinaIndex >= actividadesTEA.rutinas.length) {
    const fin = document.createElement('p');
    fin.textContent = "¡Has completado todas las rutinas!";
    fin.setAttribute('aria-live', 'assertive');
    tabs.rutinas.appendChild(fin);
    setTimeout(volverAlMenu, 1200);
    return;
  }

  const rutina = actividadesTEA.rutinas[rutinaIndex];
  const pasosConClave = rutina.map((paso, i) => ({ paso, key: i }));

  const divTarget = document.createElement('div');
  divTarget.id = 'instruccion';
  divTarget.textContent = 'Ordena la rutina diaria:';
  divTarget.setAttribute('aria-label', 'Ordena la rutina diaria');
  tabs.rutinas.appendChild(divTarget);

  const pool = document.createElement('div');
  pool.className = 'opciones';

  const barajados = [...pasosConClave].sort(() => Math.random() - 0.5);
  barajados.forEach(({ paso, key }, index) => {
    const item = document.createElement('div');
    item.className = 'tarjeta-bonita';
    item.textContent = paso;
    item.dataset.key = String(key);
    item.setAttribute('aria-label', `Paso ${index + 1}: ${paso}`);
    item.setAttribute('draggable', 'true');
    pool.appendChild(item);
  });

  tabs.rutinas.appendChild(pool);

  if (typeof dragula === 'undefined') {
    mostrarFeedback("Error: No se pudo cargar la funcionalidad de arrastrar", "incorrecto");
    console.error("Dragula no está cargado");
    return;
  }

  const drake = dragula([pool], {
    revertOnSpill: true,
    mirrorContainer: pool
  });

  drake.on('drag', (el) => {
    el.classList.add('dragging');
    reproducirSonido('drag');
  });

  drake.on('drop', (el) => {
    if (el) el.classList.remove('dragging');
    detenerSonido('drag');

    setTimeout(() => {
      const items = Array.from(pool.children);
      const ordenActualKeys = items.map(c => Number(c.dataset.key));
      let esCorrecto = ordenActualKeys.every((k, i) => k === i);

      if (esCorrecto) {
        reproducirSonido('correcto');
        mostrarFeedback("¡Correcto!", "correcto");
        rutinaIndex++;
        sumarCorrecto(renderRutinas);
      } else {
        mostrarFeedback("Aún no está en orden", "incorrecto");
      }
    }, 30);
  });

  drake.on('cancel', (el) => {
    if (el) el.classList.remove('dragging');
    detenerSonido('drag');
  });

  drake.on('dragend', () => detenerSonido('drag'));
}

/********************
 * PARES
 ********************/
function renderPares() {
  tabs.pares.innerHTML = '';

  const marcador = document.createElement("div");
  marcador.id = "marcador";
  marcador.className = "marcador";
  marcador.textContent = `Correctos: ${correctos}/${getLimiteActual()}`;
  tabs.pares.appendChild(marcador);

  const target = actividadesTEA.pares[Math.floor(Math.random() * actividadesTEA.pares.length)];

  const divTarget = document.createElement('div');
  divTarget.id = 'instruccion';
  divTarget.innerHTML = `
    <button id="play-audio" class="tarjeta-bonita" aria-label="Escuchar palabra ${target.texto}">🔊 Escuchar palabra</button>
    <p>Selecciona la imagen correcta</p>
  `;
  tabs.pares.appendChild(divTarget);

  const playAudioBtn = divTarget.querySelector('#play-audio');
  playAudioBtn.addEventListener("click", () => {
    const utterance = new SpeechSynthesisUtterance(target.texto);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  });

  const grid = document.createElement('div');
  grid.className = 'opciones';
  actividadesTEA.pares.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'tarjeta-bonita';
    btn.innerHTML = `<span style="font-size:32px">${p.icono}</span><p>${p.texto}</p>`;
    btn.setAttribute('aria-label', `Opción ${p.texto}`);
    btn.addEventListener('click', () => {
      if (p.id === target.id) {
        btn.classList.add('correct');
        reproducirSonido('correcto');
        mostrarFeedback("¡Correcto!", "correcto");
        sumarCorrecto(renderPares);
      } else {
        btn.classList.add('incorrecta');
        reproducirSonido('incorrecto');
        mostrarFeedback("Intenta otra vez", "incorrecto");
      }
    });
    grid.appendChild(btn);
  });
  tabs.pares.appendChild(grid);
}

/********************
 * Mostrar feedback *
 ********************/
function mostrarFeedback(mensaje, tipo) {
  const fb = document.createElement("div");
  fb.className = `feedback ${tipo}`;
  fb.textContent = mensaje;
  fb.setAttribute('aria-live', 'assertive');
  document.body.appendChild(fb);
  setTimeout(() => fb.remove(), 1200);
}

/********************
 * Funciones progreso
 ********************/
function actualizarBarraAutismo() {
  const progreso = Math.round((apartadosCompletadosAutismo / TOTAL_APARTADOS_AUTISMO) * 100);
  document.getElementById("progress-bar-autismo").style.width = progreso + "%";
  document.getElementById("progress-text-autismo").textContent =
    `Progreso: ${apartadosCompletadosAutismo}/${TOTAL_APARTADOS_AUTISMO} apartados completados`;
}

/********************
 * Ejemplo al terminar apartado
 ********************/
function terminarApartadoAutismo() {
  apartadosCompletadosAutismo++;
  actualizarBarraAutismo();
  volverAlMenu();
}
/********************
 * Sonidos *
 ********************/
const sonidos = {
  correcto: new Audio('Sounds_Autismo/correcto.mp3'),
  incorrecto: new Audio('Sounds_Autismo/incorrecto.mp3'),
  drag: new Audio('Sounds_Autismo/drag.mp3'),
  fin: new Audio('Sounds_Autismo/fin.mp3') // 🔊 sonido final
};

sonidos.drag.loop = true;

function reproducirSonido(tipo) {
  const audio = sonidos[tipo];
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(err => console.error(`Error al reproducir ${tipo}:`, err));
}

function detenerSonido(tipo) {
  const audio = sonidos[tipo];
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

/********************
 * Inicialización *
 ********************/
document.addEventListener('DOMContentLoaded', () => {
  Object.values(sonidos).forEach(audio => {
    audio.load();
  });

  document.querySelectorAll('.menu-actividades button').forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.actividad;
      if (tipo) abrirActividad(tipo);
    });
  });

  const btnRegresar = document.querySelector('.btn-regresar');
  if (btnRegresar) {
    btnRegresar.addEventListener('click', volverAlMenu);
  }
});
