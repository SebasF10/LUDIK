let actividadIndex = 0;
let apartadoActual = null;
let correctos = 0;
const LIMITE = 3;

const sonidos = {
  correcto: new Audio("Sounds_Discalculia/correcto.mp3"),
  incorrecto: new Audio("Sounds_Discalculia/incorrecto.mp3"),
  fin: new Audio("Sounds_Discalculia/fin.mp3")
};

function reproducirSonido(tipo) {
  const a = sonidos[tipo];
  if (!a) return;
  a.currentTime = 0;
  a.play().catch(() => { });
}

/* ----- Abrir / Cerrar vistas ----- */
function abrirActividad() {
  // Oculta menú y el botón principal de regreso
  document.getElementById("menu-apartados").style.display = "none";
  document.getElementById("btnRegresarPrincipal").style.display = "none";

  const vista = document.getElementById("vista-actividad");
  vista.hidden = false;
}

function volverAlMenu() {
  // Muestra de nuevo el menú y el botón principal
  document.getElementById("vista-actividad").hidden = true;
  document.getElementById("menu-apartados").style.display = "block";
  document.getElementById("btnRegresarPrincipal").style.display = "inline-block";
}

/* ----- Menú principal ----- */
function cargarApartados() {
  const apartados = [
    "Contar objetos",
    "Asociar número–cantidad",
    "Sumas visuales",
    "Comparar cantidades",
    "Series numéricas",
    "Mayor o menor que"
  ];
  const cont = document.getElementById("menu-apartados");
  cont.innerHTML = `
    <h2>Discalculia</h2>
    <div class="menu-opciones">
      ${apartados.map((a, i) => `
        <div class="categoria">
          <h3>${a}</h3>
          <button data-indice="${i}">Iniciar</button>
        </div>`).join("")}
    </div>
  `;
  cont.querySelectorAll("button[data-indice]").forEach(btn => {
    btn.addEventListener("click", e => {
      iniciarApartado(parseInt(e.target.dataset.indice));
    });
  });
}

/* ----- Actividades ----- */
function iniciarApartado(indice) {
  actividadIndex = 0;
  correctos = 0;
  apartadoActual = indice;

  abrirActividad();
  cargarActividad();
}

function cargarActividad() {
  const lista = [
    [
      { texto: "Cuenta cuántas manzanas 🍎🍎🍎", correcta: 3 },
      { texto: "Cuenta los perritos 🐶🐶🐶🐶", correcta: 4 },
      { texto: "Cuenta los soles ☀️☀️", correcta: 2 }
    ],
    [
      { texto: "Une el número con las estrellas ⭐⭐⭐", correcta: 3 },
      { texto: "Elige el número para 🐠🐠🐠🐠", correcta: 4 },
      { texto: "Asocia el 2 con 🍌🍌", correcta: 2 }
    ],
    [
      { texto: "🍎 + 🍎 = ?", correcta: 2 },
      { texto: "🐶🐶 + 🐶 = ?", correcta: 3 },
      { texto: "🌼🌼🌼 + 🌼 = ?", correcta: 4 }
    ],
    [
      { texto: "¿Dónde hay más? 🍓🍓🍓 vs 🍌🍌", correcta: "izquierda" },
      { texto: "Elige el grupo con menos 🐱🐱 vs 🐱🐱🐱", correcta: "izquierda" },
      { texto: "¿Qué grupo es mayor? 🌟🌟🌟🌟 vs 🌟", correcta: "izquierda" }
    ],
    [
      { texto: "1, 2, 3, ?", correcta: 4 },
      { texto: "2, 4, 6, ?", correcta: 8 },
      { texto: "5, 6, 7, ?", correcta: 8 }
    ],
    [
      { texto: "¿Qué número es mayor? 3 o 5", correcta: 5 },
      { texto: "¿Qué número es menor? 8 o 2", correcta: 2 },
      { texto: "Elige el mayor: 9 o 7", correcta: 9 }
    ]
  ];

  if (correctos >= LIMITE || actividadIndex >= lista[apartadoActual].length) {
    reproducirSonido("fin");
    mostrarFeedback("¡Apartado completado! 🎉", "correcto");
    setTimeout(volverAlMenu, 1500);
    return;
  }

  const act = lista[apartadoActual][actividadIndex];
  let opciones = "";
  if (typeof act.correcta === "number") {
    let nums = [act.correcta - 1, act.correcta, act.correcta + 1].filter(n => n > 0);
    opciones = nums.map(n => `
      <button class="tarjeta-bonita"
       onclick="validar(${n},${act.correcta})">${n}</button>`
    ).join("");
  } else {
    opciones = `
      <button class="tarjeta-bonita" onclick="validar('izquierda','${act.correcta}')">Izquierda</button>
      <button class="tarjeta-bonita" onclick="validar('derecha','${act.correcta}')">Derecha</button>`;
  }

  document.getElementById("pantalla-actividad").innerHTML = `
    <p id="marcador">Correctos: ${correctos}/${LIMITE}</p>
    <div class="tarjeta-instruccion">${act.texto}</div>
    <div class="opciones">${opciones}</div>
  `;
}

function validar(res, ok) {
  if (res == ok) {
    reproducirSonido("correcto");
    mostrarFeedback("¡Bien hecho!", "correcto");
    correctos++;
    actividadIndex++;
    setTimeout(cargarActividad, 700);
  } else {
    reproducirSonido("incorrecto");
    mostrarFeedback("Intenta otra vez", "incorrecto");
  }
}

/* --- Feedback --- */
function mostrarFeedback(msg, tipo) {
  const d = document.createElement("div");
  d.className = `feedback ${tipo}`;
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 1000);
}

/* Inicio */
window.addEventListener("DOMContentLoaded", () => {
  cargarApartados();
  document.getElementById('btnRegresarMenu')
    .addEventListener('click', volverAlMenu);
});
