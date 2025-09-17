const pantallaMenu = document.getElementById("pantalla-menu");
const pantallaActividad = document.getElementById("pantalla-actividad");
const contenedor = document.getElementById("actividad-contenido");
const btnPortada = document.getElementById("btn-portada");

function abrirActividad(tipo) {
  // Ocultar menú y botón de portada
  pantallaMenu.classList.remove("visible");
  pantallaMenu.classList.add("oculto");
  btnPortada.style.display = "none";

  // Mostrar actividad
  pantallaActividad.classList.remove("oculto");
  pantallaActividad.classList.add("visible");

  if (tipo === "memoria") renderMemoria();
  else if (tipo === "relajacion") renderRelajacion();
  else if (tipo === "puzzle") renderPuzzle();
}

function volverAlMenu() {
  contenedor.innerHTML = "";
  pantallaActividad.classList.remove("visible");
  pantallaActividad.classList.add("oculto");
  pantallaMenu.classList.remove("oculto");
  pantallaMenu.classList.add("visible");
  btnPortada.style.display = "inline-block";
}

/* Mantén aquí las funciones renderMemoria, renderRelajacion y renderPuzzle */


/* ---------- Actividad: Memoria Auditiva ---------- */
function renderMemoria() {
  contenedor.innerHTML = `
    <h2>Memoria Auditiva</h2>
    <p>Escucha la secuencia de tonos y repítela.</p>
    <button class="tarjeta-bonita" id="playSequence">Reproducir Secuencia</button>
    <div id="botonesSecuencia" style="margin-top:20px;"></div>
    <p id="mensaje" style="margin-top:20px;font-weight:bold;"></p>
  `;

  const tones = [261, 329, 392];
  const sequence = [];
  const userInput = [];
  const btnContainer = document.getElementById("botonesSecuencia");

  tones.forEach((freq, idx) => {
    const b = document.createElement("button");
    b.className = "tarjeta-bonita";
    b.textContent = `Sonido ${idx + 1}`;
    b.addEventListener("click", () => {
      playTone(freq);
      userInput.push(idx);
      checkInput();
    });
    btnContainer.appendChild(b);
  });

  document.getElementById("playSequence").addEventListener("click", () => {
    userInput.length = 0;
    if (sequence.length < 5) sequence.push(Math.floor(Math.random() * tones.length));
    playSequence();
  });

  function playTone(freq) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.15;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    setTimeout(() => osc.stop(), 400);
  }

  function playSequence() {
    sequence.forEach((note, i) => {
      setTimeout(() => playTone(tones[note]), i * 600);
    });
  }

  function checkInput() {
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== sequence[i]) {
        document.getElementById("mensaje").textContent = "Intenta de nuevo 😊";
        userInput.length = 0;
        return;
      }
    }
    if (userInput.length === sequence.length) {
      document.getElementById("mensaje").textContent = "¡Bien hecho!";
    }
  }
}

/* ---------- Actividad: Relajación Guiada ---------- */
function renderRelajacion() {
  contenedor.innerHTML = `
    <h2>Relajación Guiada</h2>
    <p>Sigue la respiración: Inhala… Exhala…</p>
    <div class="breath-circle" id="breathing"></div>
    <p id="textoRespira" style="font-size:1.5rem;margin-top:20px;"></p>
  `;

  const circle = document.getElementById("breathing");
  const texto = document.getElementById("textoRespira");
  let grow = true;
  setInterval(() => {
    circle.style.transform = grow ? "scale(1.5)" : "scale(1)";
    texto.textContent = grow ? "Inhala lentamente" : "Exhala despacio";
    grow = !grow;
  }, 4000);
}

/* ---------- Actividad: Puzzle Suave ---------- */
function renderPuzzle() {
  contenedor.innerHTML = `
    <h2>Puzzle Suave</h2>
    <p>Haz clic en las piezas para ordenarlas de 1 a 9.</p>
    <div class="puzzle-grid" id="puzzleGrid"></div>
    <p id="resultado" style="margin-top:20px;font-weight:bold;"></p>
  `;

  const grid = document.getElementById("puzzleGrid");
  const pieces = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);

  function updateGrid() {
    grid.innerHTML = "";
    pieces.forEach((n, idx) => {
      const d = document.createElement("div");
      d.className = "piece";
      d.textContent = n;
      d.addEventListener("click", () => {
        pieces.splice(idx,1);
        pieces.push(n);
        updateGrid();
        checkOrder();
      });
      grid.appendChild(d);
    });
  }

  function checkOrder() {
    if (pieces.every((v,i)=>v===i+1)) {
      document.getElementById("resultado").textContent = "¡Excelente! Puzzle ordenado.";
    }
  }

  updateGrid();
}
