

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.warn("SpeechSynthesis no disponible", e);
  }
}

const banco = {
  colores: [
    { id: "rojo", etiqueta: "Rojo", img: "🔴" },
    { id: "azul", etiqueta: "Azul", img: "🔵" },
    { id: "verde", etiqueta: "Verde", img: "🟢" },
    { id: "amarillo", etiqueta: "Amarillo", img: "🟡" },
    { id: "morado", etiqueta: "morado", img: "🟣" },
    { id: "naranja", etiqueta: "Naranja", img: "🟠" },
    { id: "negro", etiqueta: "Negro", img: "⚫" },
    { id: "blanco", etiqueta: "Blanco", img: "⚪" },
  ],
  animales: [
    { id: "perro", etiqueta: "Perro", img: "🐶" },
    { id: "gato", etiqueta: "Gato", img: "🐱" },
    { id: "elefante", etiqueta: "Elefante", img: "🐘" },
    { id: "leon", etiqueta: "León", img: "🦁" },
    { id: "mono", etiqueta: "Mono", img: "🐵" },
    { id: "tigre", etiqueta: "Tigre", img: "🐯" },
    { id: "cerdo", etiqueta: "Cerdo", img: "🐷" },
    { id: "vaca", etiqueta: "Vaca", img: "🐮" },
  ],
  numeros: [
    { id: "0", etiqueta: "0", img: "0", pregunta: "cero" },
    { id: "1", etiqueta: "1", img: "1", pregunta: "uno" },
    { id: "2", etiqueta: "2", img: "2", pregunta: "dos" },
    { id: "3", etiqueta: "3", img: "3", pregunta: "tres" },
    { id: "4", etiqueta: "4", img: "4", pregunta: "cuatro" },
    { id: "5", etiqueta: "5", img: "5", pregunta: "cinco" },
    { id: "6", etiqueta: "6", img: "6", pregunta: "seis" },
    { id: "7", etiqueta: "7", img: "7", pregunta: "siete" },
    { id: "8", etiqueta: "8", img: "8", pregunta: "ocho" },
    { id: "9", etiqueta: "9", img: "9", pregunta: "nueve" },
    { id: "10", etiqueta: "10", img: "10", pregunta: "diez" },
  ],
};

let categoriaActual = "";
let modoActual = "";
let preguntas = [];
let idx = 0;
let aciertos = 0;

const menu = $("#menu");
const actividad = $("#actividad");
const instruccion = $("#instruccion");
const opcionesDiv = $("#opciones");
const marcador = $("#marcador");
const retro = $("#retro");
const btnRepetir = $("#btn-repetir");
const btnSiguiente = $("#btn-siguiente");
const btnVolver = $("#btn-volver");

function barajar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function mostrarMenu() {
  menu.style.display = "block";
  actividad.style.display = "none";
}

function iniciar(categoria, modo) {
  categoriaActual = categoria;
  modoActual = modo;
  idx = 0;
  aciertos = 0;
  preguntas = banco[categoria];

  menu.style.display = "none";
  actividad.style.display = "block";

  // Ocultar el botón siguiente en modo evaluación
  if (modo === "evaluacion") {
    btnSiguiente.style.display = "none";
  } else {
    btnSiguiente.style.display = "inline-block";
  }

  if (modo === "practica") {
    instruccion.textContent = "¡Practiquemos!";
    speak("Practiquemos");
  }
  cargarPregunta();
}

function cargarPregunta() {
  const pregunta = preguntas[idx];
  
  if (modoActual === "evaluacion") {
    // Para números, usar la versión en letras en la pregunta
    const textoPregunta = pregunta.pregunta ? pregunta.pregunta : pregunta.etiqueta;
    instruccion.textContent = `¿Cuál es ${textoPregunta}?`;
    speak(instruccion.textContent);
  }

  marcador.textContent = `Pregunta ${idx + 1} de ${preguntas.length} | Aciertos: ${aciertos}`;
  retro.textContent = "";
  btnRepetir.disabled = false;
  
  if (modoActual === "practica") {
    btnSiguiente.disabled = true;
  }

  opcionesDiv.innerHTML = "";
  const opciones = modoActual === "evaluacion"
    ? barajar([pregunta, ...barajar(banco[categoriaActual].filter(o => o.id !== pregunta.id)).slice(0, 3)])
    : banco[categoriaActual];

  opciones.forEach((op) => {
    const card = document.createElement("button");
    card.className = "tarjeta-bonita";
    
    // En modo evaluación no mostrar el texto, solo en práctica
    const textoVisible = modoActual === "practica" ? `<p>${op.etiqueta}</p>` : "";
    card.innerHTML = `<span style="font-size: 3rem;">${op.img}</span>${textoVisible}`;
    
    card.addEventListener("click", () => {
      if (modoActual === "evaluacion") {
        if (op.id === pregunta.id) {
          aciertos++;
          retro.textContent = "¡Correcto! 🎉";
          speak("¡Correcto!");
          
          // Actualizar marcador
          marcador.textContent = `Pregunta ${idx + 1} de ${preguntas.length} | Aciertos: ${aciertos}`;
          
          // Avanzar automáticamente después de un breve delay
          setTimeout(() => {
            if (idx < preguntas.length - 1) {
              idx++;
              cargarPregunta();
            } else {
              // Mostrar resultado final
              retro.textContent = `¡Completado! Aciertos: ${aciertos}/${preguntas.length}`;
              speak(`¡Completado! Obtuviste ${aciertos} aciertos de ${preguntas.length}`);
            }
          }, 1500);
          
        } else {
          retro.textContent = "Intenta de nuevo";
          speak("Intenta de nuevo");
        }
      } else {
        speak(op.etiqueta);
      }
    });
    opcionesDiv.appendChild(card);
  });
}

$$("button[data-categoria]").forEach((btn) => {
  btn.addEventListener("click", () => {
    iniciar(btn.dataset.categoria, btn.dataset.modo);
  });
});

btnRepetir.addEventListener("click", () => {
  speak(instruccion.textContent);
});

btnSiguiente.addEventListener("click", () => {
  if (idx < preguntas.length - 1) {
    idx++;
    cargarPregunta();
  }
});

btnVolver.addEventListener("click", () => {
  mostrarMenu();
});