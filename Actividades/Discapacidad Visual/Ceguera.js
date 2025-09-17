const $ = (sel) => document.querySelector(sel);

// ====== SÍNTESIS DE VOZ ======
function speak(text, keepAudio = false) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  u.rate = 0.95;
  if (!keepAudio) speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// ====== ACTIVIDADES ======
const actividades = {
  entorno: [
{ id: "lluvia", sonido: "Sounds_Ceguera/lluvia.mp3", respuesta: "lluvia" },
    { id: "aplausos", sonido: "Sounds_Ceguera/aplausos.mp3", respuesta: "aplausos" },
    { id: "auto", sonido: "Sounds_Ceguera/auto.mp3", respuesta: "auto" },
    { id: "pajaro", sonido: "Sounds_Ceguera/pajaro.mp3", respuesta: "pájaro" },
    { id: "timbre", sonido: "Sounds_Ceguera/timbre.mp3", respuesta: "timbre" },
    { id: "perro", sonido: "Sounds_Ceguera/perro.mp3", respuesta: "perro" },
    { id: "gato", sonido: "Sounds_Ceguera/gato.mp3", respuesta: "gato" },
    { id: "sirena", sonido: "Sounds_Ceguera/sirena.mp3", respuesta: "sirena" },
    { id: "fuego", sonido: "Sounds_Ceguera/fuego.mp3", respuesta: "fuego" },
  ],
  memoria: ["do", "re", "mi", "fa"],
  historia: [
    "Juan camina por un bosque.",
    "A la izquierda escucha un río, a la derecha un perro.",
    "¿Quieres ir al río o al perro?"
  ]
};

// ====== VARIABLES ======
let modo = "";
let idx = 0;
let preguntas = [];
let audioPlayer = new Audio();
let isListening = false; // control del micro

// ====== ELEMENTOS ======
const menu = $("#menu");
const actividad = $("#actividad");
const instruccion = $("#instruccion");
const marcador = $("#marcador");
const retro = $("#retro");
const btnRepetir = $("#btn-repetir");
const btnVolver = $("#btn-volver");

// ====== FUNCIONES ======
function barajar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function iniciar(tipo) {
  modo = tipo;
  idx = 0;

  if (modo === "entorno") {
    preguntas = barajar(actividades.entorno);
  } else if (modo === "historia") {
    preguntas = actividades.historia;
  }

  menu.style.display = "none";
  actividad.style.display = "block";

  if (modo === "entorno") {
    speak("Escucha el sonido y dime qué es.");
    reproducirSonido();
  } else if (modo === "memoria") {
    speak("Escucha la secuencia de notas y repítelas.");
  } else if (modo === "historia") {
    speak(preguntas[idx]);
    instruccion.textContent = preguntas[idx];
  }
}

function reproducirSonido() {
  const item = preguntas[idx];
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.src = item.sonido;
  audioPlayer.play()
    .then(() => {
      instruccion.textContent = "¿Qué sonido es?";
      marcador.textContent = `Sonido ${idx+1} de ${preguntas.length}`;
    })
    .catch(err => {
      console.warn("Error al reproducir audio:", err);
      retro.textContent = "No se pudo reproducir el sonido";
    });
}

btnRepetir.addEventListener("click", () => {
  if (modo === "entorno") reproducirSonido();
  else if (modo === "historia") speak(preguntas[idx]);
});

btnVolver.addEventListener("click", () => {
  menu.style.display = "block";
  actividad.style.display = "none";
});

// ====== ENLACE MENÚ ======
document.querySelectorAll("button[data-actividad]").forEach((btn) => {
  btn.addEventListener("click", () => iniciar(btn.dataset.actividad));
});

// ====== RECONOCIMIENTO DE VOZ ======
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
  recognition = new SpeechRecognition();
}

if (recognition) {
  recognition.lang = "es-ES";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => { isListening = true; };
  recognition.onend = () => { isListening = false; };

  recognition.onresult = (event) => {
    const texto = event.results[0][0].transcript.toLowerCase();
    retro.textContent = "Dijiste: " + texto;

    if (modo === "entorno") {
      const correcto = preguntas[idx].respuesta.toLowerCase();
      if (texto.includes(correcto)) {
        retro.textContent = "¡Correcto! 🎉";
        speak("¡Correcto!", true);

        setTimeout(() => {
          idx++;
          if (idx < preguntas.length) {
            reproducirSonido();
          } else {
            retro.textContent = "¡Actividad completada!";
            speak("Actividad completada", true);
          }
        }, 2000);

      } else {
        retro.textContent = "Intenta de nuevo";
        speak("Intenta de nuevo", true);
      }
    }
  };

  recognition.onerror = (event) => {
    retro.textContent = "Error al escuchar";
    console.warn("Error:", event.error);
  };

  // activar con barra espaciadora
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !isListening) {
      e.preventDefault();
      retro.textContent = "🎤 Escuchando...";
      speak("Te escucho", true);
      recognition.start();
    }
  });
}
