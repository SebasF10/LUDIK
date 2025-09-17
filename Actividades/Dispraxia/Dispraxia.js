/********************
 * Estado global
 ********************/
let actividadDispraxiaIndex = 0;
let correctos = 0;
const LIMITE = 3;
let currentTitulo = "Dispraxia";
let currentIndice = 0;

/********************
 * Sonidos
 ********************/
const sonidos = {
  correcto: new Audio("Sounds_Dispraxia/correcto.mp3"),
  incorrecto: new Audio("Sounds_Dispraxia/incorrecto.mp3"),
  drag: new Audio("Sounds_Dispraxia/drag.mp3"),
  fin: new Audio("Sounds_Dispraxia/fin.mp3")
};
sonidos.drag.loop = true;

function reproducirSonido(tipo) {
  const audio = sonidos[tipo];
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(err => console.error("Error sonido", err));
}

function detenerSonido(tipo) {
  const audio = sonidos[tipo];
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

/********************
 * Navegación
 ********************/
function mostrarDispraxia() {
  document.getElementById("pantalla-inicial").hidden = true;
  document.getElementById("vista-actividad").hidden = false;

  cargarApartadosDispraxia("Dispraxia", [
    "Juegos de arrastre",
    "Trazado de figuras",
    "Coordinación ojo-mano"
  ]);
}

function cargarApartadosDispraxia(titulo, apartados) {
  const vista = document.getElementById("vista-actividad");
  currentTitulo = titulo;
  vista.innerHTML = `
    <h2 id="instruccion">${titulo}</h2>
    <div class="menu-opciones">
      ${apartados.map((a, i) => `
        <div class="categoria">
          <h3>${a}</h3>
          <button onclick="iniciarApartadoDispraxia(${i}, '${titulo}')">Iniciar</button>
        </div>
      `).join("")}
    </div>
  `;
}

function iniciarApartadoDispraxia(indice, titulo) {
  actividadDispraxiaIndex = 0;
  correctos = 0;
  currentIndice = indice;
  cargarActividadesDispraxia(indice, titulo);
}

/********************
 * Actividades
 ********************/
function cargarActividadesDispraxia(indice, titulo) {
  const actividades = [
    [
      { texto: "Arrastra las frutas a la canasta.", tipo: "frutas" },
      { texto: "Arrastra las estrellas al contenedor.", tipo: "estrellas" },
      { texto: "Arrastra los bloques al cuadro.", tipo: "bloques" }
    ],
    [
      { texto: "Sigue con el mouse el círculo.", figura: "circle" },
      { texto: "Sigue el triángulo con el mouse.", figura: "triangle" },
      { texto: "Sigue la estrella con el mouse.", figura: "star" }
    ],
    [
      { texto: "Haz clic en todas las mariposas 🦋.", objetivo: "🦋" },
      { texto: "Haz clic en todos los balones ⚽.", objetivo: "⚽" },
      { texto: "Haz clic en todas las estrellas ⭐.", objetivo: "⭐" }
    ]
  ];

  // 🔹 Si llega al límite, regresar automáticamente
  if (correctos >= LIMITE) {
    reproducirSonido("fin");
    mostrarFeedback(`¡Has completado ${LIMITE} actividades! 🎉`, "correcto");
    setTimeout(() => {
      cargarApartadosDispraxia(titulo, [
        "Juegos de arrastre",
        "Trazado de figuras",
        "Coordinación ojo-mano"
      ]);
    }, 1500);
    return;
  }

  if (actividadDispraxiaIndex < actividades[indice].length) {
    mostrarActividadDispraxia(actividades[indice][actividadDispraxiaIndex], indice, titulo);
  } else {
    reproducirSonido("fin");
    mostrarFeedback("¡Has completado todas las actividades!", "correcto");
    setTimeout(() => {
      cargarApartadosDispraxia(titulo, [
        "Juegos de arrastre",
        "Trazado de figuras",
        "Coordinación ojo-mano"
      ]);
    }, 1500);
  }
}

function mostrarActividadDispraxia(actividad, indice, titulo) {
  const vista = document.getElementById("vista-actividad");

  let contenido = `
    <button class="btn-regresar" onclick="cargarApartadosDispraxia('${titulo}', ['Juegos de arrastre','Trazado de figuras','Coordinación ojo-mano'])">⬅ Regresar</button>
    <p id="marcador">Completadas: ${correctos}/${LIMITE}</p>

    <div class="tarjeta-instruccion">
      <p>${actividad.texto}</p>
    </div>
  `;

  // --- Juegos de arrastre ---
  if (indice === 0) {
    let opciones = [];
    if (actividad.tipo === "frutas") opciones = ["🍎", "🍌", "🍇", "🍉"];
    if (actividad.tipo === "estrellas") opciones = ["⭐", "🌟", "✨"];
    if (actividad.tipo === "bloques") opciones = ["🟥", "🟦", "🟩", "🟨"];

    contenido += `
      <div class="zona-destino" ondrop="drop(event)" ondragover="allowDrop(event)">🧺</div>
      <div class="opciones">
        ${opciones.map(o => `<div class="objeto-arrastrable" draggable="true" ondragstart="drag(event)">${o}</div>`).join("")}
      </div>
      <button class="btn-completar" id="btn-correcto">✅ Completar</button>
    `;
  }

  // --- Trazado ---
  if (indice === 1) {
    contenido += `
      <div id="p5-container"></div>
      <button class="btn-completar" id="btn-correcto">✅ Completar</button>
    `;
  }

  // --- Coordinación ojo-mano ---
  if (indice === 2) {
    contenido += `
      <div id="zona-coordinacion" style="height:300px; border:2px dashed var(--color-secundario); position:relative;"></div>
      <button class="btn-completar" id="btn-correcto">✅ Completar</button>
    `;
  }

  vista.innerHTML = contenido;

  if (indice === 1) iniciarTrazado(actividad.figura);
  if (indice === 2) iniciarCoordinacion(actividad.objetivo);

  const btn = document.getElementById("btn-correcto");
  btn.addEventListener("click", () => {
    if (btn.disabled) return;
    btn.disabled = true;
    reproducirSonido("correcto");
    mostrarFeedback("¡Correcto!", "correcto");
    correctos++;
    setTimeout(() => siguienteActividadDispraxia(indice, titulo), 800);
  });
}

function siguienteActividadDispraxia(indice, titulo) {
  actividadDispraxiaIndex++;
  cargarActividadesDispraxia(indice, titulo);
}

/********************
 * Feedback
 ********************/
function mostrarFeedback(mensaje, tipo) {
  const fb = document.createElement("div");
  fb.className = `feedback ${tipo}`;
  fb.textContent = mensaje;
  fb.setAttribute("aria-live", "assertive");
  document.body.appendChild(fb);
  setTimeout(() => fb.remove(), 1200);
}

/********************
 * Drag & Drop
 ********************/
function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) {
  reproducirSonido("drag");
  ev.dataTransfer.setData("text", ev.target.outerHTML);
}
function drop(ev) {
  detenerSonido("drag");
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  ev.target.innerHTML += data;
}

/********************
 * Actividad de trazado con p5.js
 ********************/
function iniciarTrazado(figura) {
  let sketch = (p) => {
    p.setup = function() {
      let canvas = p.createCanvas(400, 300);
      canvas.parent("p5-container");
      p.background(255);
      p.stroke(0);
      p.noFill();

      if (figura === "circle") {
        p.ellipse(200, 150, 200, 200);
      } else if (figura === "triangle") {
        p.triangle(200, 50, 100, 250, 300, 250);
      } else if (figura === "square") {
        p.rect(120, 80, 160, 160);
      } else if (figura === "star") {
        p.beginShape();
        for (let i = 0; i < 5; i++) {
          let angle = p.TWO_PI / 5 * i;
          let x = 200 + Math.cos(angle) * 80;
          let y = 150 + Math.sin(angle) * 80;
          p.vertex(x, y);
          angle += p.TWO_PI / 10;
          x = 200 + Math.cos(angle) * 40;
          y = 150 + Math.sin(angle) * 40;
          p.vertex(x, y);
        }
        p.endShape(p.CLOSE);
      }
    };

    p.draw = function() {
      if (p.mouseIsPressed) {
        p.stroke('red');
        p.strokeWeight(3);
        p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
      }
    };
  };
  new p5(sketch);
}

/********************
 * Actividad coordinación ojo-mano
 ********************/
function iniciarCoordinacion(objetivo) {
  const zona = document.getElementById("zona-coordinacion");
  zona.innerHTML = "";

  const distractores = ["⭐", "⚽", "🍒", "🐟", "🦋", "🎈"];
  let total = 8;

  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      const objeto = document.createElement("div");
      let figura = Math.random() < 0.4 ? objetivo : distractores[Math.floor(Math.random() * distractores.length)];
      objeto.textContent = figura;
      objeto.style.position = "absolute";
      objeto.style.left = Math.random() * 80 + "%";
      objeto.style.top = Math.random() * 80 + "%";
      objeto.style.fontSize = "2rem";
      objeto.style.cursor = "pointer";
      objeto.addEventListener("click", () => objeto.remove());
      zona.appendChild(objeto);
    }, i * 800);
  }
}

/********************
 * Auto inicio
 ********************/
document.addEventListener("DOMContentLoaded", () => {
  mostrarDispraxia();
});
