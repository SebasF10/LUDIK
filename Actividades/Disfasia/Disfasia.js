// =============================
// 🎯 CONFIGURACIÓN PRINCIPAL
// =============================
let correctos = 0;
const maxCorrectos = 10;

// 🔊 Sonidos
const sonidoCorrecto = new Audio("Sounds_Disfasia/correcto.mp3");
const sonidoIncorrecto = new Audio("Sounds_Disfasia/incorrecto.mp3");
const sonidoFin = new Audio("Sounds_Disfasia/fin.mp3");

// =============================
// 🎵 FUNCIONES DE SONIDO Y FEEDBACK
// =============================
function mostrarFeedback(texto, correcto = true) {
  const div = document.createElement("div");
  div.className = `feedback ${correcto ? "correcto" : "incorrecto"}`;
  div.textContent = texto;
  document.body.appendChild(div);

  if (texto.includes("¡Actividad terminada!")) {
    sonidoFin.play();
  } else {
    correcto ? sonidoCorrecto.play() : sonidoIncorrecto.play();
  }

  setTimeout(() => div.remove(), 1200);
}

function actualizarMarcador() {
  let marcador = document.getElementById("marcador");
  if (!marcador) {
    marcador = document.createElement("div");
    marcador.id = "marcador";
    document.getElementById("vista-actividad").appendChild(marcador);
  }
  marcador.textContent = `Correctos: ${correctos}/${maxCorrectos}`;
}

function finalizarActividad() {
  mostrarFeedback("¡Actividad terminada!", true);
  correctos = 0;
  setTimeout(mostrarMenu, 15);
}

// =============================
// 🔊 LECTOR DE VOZ
// =============================
function leerTexto(texto) {
  const msg = new SpeechSynthesisUtterance(texto);
  msg.lang = "es-ES";
  msg.rate = 1;
  msg.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}

// =============================
// 🧩 MENÚ PRINCIPAL
// =============================
function mostrarMenu() {
  document.getElementById("menu-principal").style.display = "block";
  document.getElementById("vista-actividad").hidden = true;
  document.getElementById("btnRegresarPrincipal").style.display = "inline-block";
  correctos = 0;
}

function ocultarMenuPrincipal() {
  document.getElementById("menu-principal").style.display = "none";
  document.getElementById("btnRegresarPrincipal").style.display = "none";
}

// =============================
// 🟢 ACTIVIDAD: SÍLABAS
// =============================
const silabas = [
  { id: "ma", texto: "ma" },
  { id: "me", texto: "me" },
  { id: "mi", texto: "mi" },
  { id: "mo", texto: "mo" },
  { id: "mu", texto: "mu" },
  { id: "pa", texto: "pa" },
  { id: "pe", texto: "pe" },
  { id: "pi", texto: "pi" },
  { id: "po", texto: "po" },
  { id: "pu", texto: "pu" },
];

function iniciarSilabas() {
  const contenedor = document.getElementById("vista-actividad");
  contenedor.hidden = false;
  ocultarMenuPrincipal();
  contenedor.innerHTML = "";

  const btnBack = document.createElement("button");
  btnBack.className = "btn-regresar";
  btnBack.textContent = "⬅ Regresar";
  btnBack.addEventListener("click", mostrarMenu);
  contenedor.appendChild(btnBack);

  actualizarMarcador();

  function mostrarSiguiente() {
    contenedor.querySelectorAll("#instruccion, .opciones").forEach((el) => el.remove());

    const target = silabas[Math.floor(Math.random() * silabas.length)];
    const instruccion = document.createElement("div");
    instruccion.id = "instruccion";
    instruccion.textContent = `Selecciona la sílaba: ${target.texto}`;
    contenedor.appendChild(instruccion);

    const opcionesDiv = document.createElement("div");
    opcionesDiv.className = "opciones";

    silabas.forEach((s) => {
      const btn = document.createElement("button");
      btn.className = "tarjeta-bonita";
      btn.textContent = s.texto;

      btn.addEventListener("click", () => {
        // Si ya está bloqueado, no hacer nada
        if (contenedor.classList.contains("bloqueado")) return;

        // Bloquear todos los botones temporalmente
        const botones = opcionesDiv.querySelectorAll("button");
        botones.forEach(b => b.disabled = true);

        if (s.id === target.id) {
          mostrarFeedback("¡Correcto!");
          correctos++;
          actualizarMarcador();

          if (correctos >= maxCorrectos) {
            finalizarActividad();
            contenedor.classList.remove("bloqueado");
          } else {
            setTimeout(() => {
              botones.forEach(b => b.disabled = false);
              mostrarSiguiente();
            }, 800);
          }
        } else {
          mostrarFeedback("Intenta otra vez", false);
          // 🔓 Permitir intentar de nuevo tras breve pausa
          setTimeout(() => botones.forEach(b => b.disabled = false), 800);
        }
      });

      opcionesDiv.appendChild(btn);
    });

    contenedor.appendChild(opcionesDiv);
  }

  mostrarSiguiente();
}


// =============================
// 🐾 ACTIVIDAD: VOCABULARIO CON EMOJIS
// =============================
function iniciarVocabulario() {
  const contenedor = document.getElementById("vista-actividad");
  contenedor.hidden = false;
  ocultarMenuPrincipal();
  contenedor.innerHTML = "";

  const btnBack = document.createElement("button");
  btnBack.className = "btn-regresar";
  btnBack.textContent = "⬅ Regresar";
  btnBack.addEventListener("click", mostrarMenu);
  contenedor.appendChild(btnBack);

  const apartados = document.createElement("div");
  apartados.className = "opciones";
  apartados.style.justifyContent = "center";
  apartados.style.marginTop = "20px";

  const categorias = [
    { nombre: "Animales", key: "animales", icono: "🐾" },
    { nombre: "Objetos", key: "objetos", icono: "📦" },
  ];

  categorias.forEach((cat) => {
    const item = document.createElement("div");
    item.className = "tarjeta-bonita";
    item.innerHTML = `<div style="font-size:3rem">${cat.icono}</div><p>${cat.nombre}</p>`;
    item.addEventListener("click", () => mostrarCategoriaVocabulario(cat.key, contenedor));
    apartados.appendChild(item);
  });

  contenedor.appendChild(apartados);
}

// =============================
// 📚 CATEGORÍAS DE VOCABULARIO
// =============================
function mostrarCategoriaVocabulario(categoria, contenedor) {
  contenedor.innerHTML = "";

  const btnBack = document.createElement("button");
  btnBack.className = "btn-regresar";
  btnBack.textContent = "⬅ Volver";
  btnBack.addEventListener("click", iniciarVocabulario);
  contenedor.appendChild(btnBack);

  const titulo = document.createElement("h2");
  titulo.style.textAlign = "center";
  titulo.style.marginTop = "10px";
  titulo.style.color = "var(--color-principal)";
  titulo.textContent = categoria === "animales" ? "Animales" : "Objetos";
  contenedor.appendChild(titulo);

  const vocabulario = {
    animales: [
      "🐶 Perro", "🐱 Gato", "🐮 Vaca", "🐦 Pájaro", "🦁 León",
      "🐴 Caballo", "🐸 Rana", "🐢 Tortuga", "🐍 Serpiente", "🐰 Conejo",
    ],
    objetos: [
      "🔔 Campana", "📱 Teléfono", "🥁 Tambor", "⌚ Reloj", "🚪 Puerta",
      "🪑 Silla", "💡 Bombillo", "🧸 Juguete", "🖊️ Lápiz", "📚 Libro",
    ],
  };

  const lista = vocabulario[categoria] || [];

  const grid = document.createElement("div");
  grid.className = "opciones";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(5, 1fr)";
  grid.style.gap = "15px";
  grid.style.marginTop = "20px";
  grid.style.justifyItems = "center";

  lista.forEach((item) => {
    const [emoji, ...resto] = item.split(" ");
    const nombre = resto.join(" ");

    const card = document.createElement("div");
    card.className = "tarjeta-bonita";
    card.innerHTML = `
      <div style="font-size:3rem;">${emoji}</div>
      <p style="font-size:1.2rem; margin:8px 0;">${nombre}</p>
      <button class="btn-escuchar">🔊 Escuchar</button>
    `;

    const btn = card.querySelector(".btn-escuchar");
    btn.addEventListener("click", () => leerTexto(nombre));

    grid.appendChild(card);
  });

  contenedor.appendChild(grid);
}

// =============================
// 🧠 ACTIVIDAD: HISTORIAS (con emojis)
// =============================
function iniciarHistorias() {
  const contenedor = document.getElementById("vista-actividad");
  contenedor.hidden = false;
  ocultarMenuPrincipal();
  contenedor.innerHTML = "";

  let indice = 0;
  const historias = [
    {
      texto: "El 🐶 juega con una 🧸",
      opciones: [
        { palabra: "Pelota", imagen: "⚽" },
        { palabra: "Juguete", imagen: "🧸" },
        { palabra: "Libro", imagen: "📚" },
      ],
      respuesta: "Juguete",
    },
    {
      texto: "El 🐱 duerme sobre la 🪑",
      opciones: [
        { palabra: "Silla", imagen: "🪑" },
        { palabra: "Puerta", imagen: "🚪" },
        { palabra: "Ventana", imagen: "🪟" },
      ],
      respuesta: "Silla",
    },
    {
      texto: "El 👧 come una 🍎",
      opciones: [
        { palabra: "Manzana", imagen: "🍎" },
        { palabra: "Banano", imagen: "🍌" },
        { palabra: "Sandía", imagen: "🍉" },
      ],
      respuesta: "Manzana",
    },
    {
      texto: "El 🚗 cruza el 🌉",
      opciones: [
        { palabra: "Puente", imagen: "🌉" },
        { palabra: "Camino", imagen: "🛣️" },
        { palabra: "Casa", imagen: "🏠" },
      ],
      respuesta: "Puente",
    },
    {
      texto: "El 🦋 vuela sobre la 🌸",
      opciones: [
        { palabra: "Flor", imagen: "🌸" },
        { palabra: "Hoja", imagen: "🍃" },
        { palabra: "Roca", imagen: "🪨" },
      ],
      respuesta: "Flor",
    },
    {
      texto: "El 👦 bebe 🥛",
      opciones: [
        { palabra: "Leche", imagen: "🥛" },
        { palabra: "Agua", imagen: "💧" },
        { palabra: "Jugo", imagen: "🧃" },
      ],
      respuesta: "Leche",
    },
    {
      texto: "El 🐦 está en el 🌳",
      opciones: [
        { palabra: "Árbol", imagen: "🌳" },
        { palabra: "Cielo", imagen: "☁️" },
        { palabra: "Flor", imagen: "🌸" },
      ],
      respuesta: "Árbol",
    },
    {
      texto: "El 🍞 está sobre la 🍽️",
      opciones: [
        { palabra: "Mesa", imagen: "🍽️" },
        { palabra: "Cama", imagen: "🛏️" },
        { palabra: "Silla", imagen: "🪑" },
      ],
      respuesta: "Mesa",
    },
    {
      texto: "La 🚲 está junto al 🏠",
      opciones: [
        { palabra: "Casa", imagen: "🏠" },
        { palabra: "Parque", imagen: "🏞️" },
        { palabra: "Árbol", imagen: "🌳" },
      ],
      respuesta: "Casa",
    },
    {
      texto: "El 🌞 brilla en el 🌈",
      opciones: [
        { palabra: "Cielo", imagen: "🌈" },
        { palabra: "Agua", imagen: "💧" },
        { palabra: "Montaña", imagen: "⛰️" },
      ],
      respuesta: "Cielo",
    },
  ];
  
  function mostrarHistoria() {
    contenedor.innerHTML = "";
    if (indice >= historias.length) {
      finalizarActividad();
      return;
    }

    const h = historias[indice];
    const btnBack = document.createElement("button");
    btnBack.className = "btn-regresar";
    btnBack.textContent = "⬅ Regresar";
    btnBack.addEventListener("click", mostrarMenu);
    contenedor.appendChild(btnBack);

    actualizarMarcador();

    const texto = document.createElement("p");
    texto.id = "instruccion";
    texto.textContent = h.texto;
    contenedor.appendChild(texto);

    const grid = document.createElement("div");
    grid.className = "opciones";

    h.opciones.forEach((op) => {
      const item = document.createElement("div");
      item.className = "tarjeta-bonita";
      item.innerHTML = `<div style="font-size:3rem">${op.imagen}</div><p>${op.palabra}</p>`;
      item.addEventListener("click", () => {
        // Evitar doble clic si ya está procesando
        if (contenedor.classList.contains("bloqueado")) return;
        contenedor.classList.add("bloqueado");
      
        // Bloquear interacción con las opciones visualmente
        const opciones = grid.querySelectorAll(".tarjeta-bonita");
        opciones.forEach(o => o.style.pointerEvents = "none");
      
        if (op.palabra === h.respuesta) {
          mostrarFeedback("¡Correcto!");
          sonidoCorrecto.play?.();
          correctos++;
          actualizarMarcador();
      
          setTimeout(() => {
            // Desbloquear y avanzar a la siguiente historia
            opciones.forEach(o => o.style.pointerEvents = "auto");
            contenedor.classList.remove("bloqueado");
            indice++;
            mostrarHistoria();
          }, 800);
        } else {
          mostrarFeedback("Intenta otra vez", false);
          sonidoIncorrecto.play?.();
      
          setTimeout(() => {
            // Desbloquear para reintentar la misma historia
            opciones.forEach(o => o.style.pointerEvents = "auto");
            contenedor.classList.remove("bloqueado");
          }, 800);
        }
      });
      
  
      
      grid.appendChild(item);
    });

    contenedor.appendChild(grid);
  }

  mostrarHistoria();
}

// =============================
// 🔗 CONECTAR BOTONES DEL MENÚ
// =============================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#menu-principal button").forEach((boton) => {
    boton.addEventListener("click", () => {
      const actividad = boton.dataset.actividad;
      if (actividad === "silabas") iniciarSilabas();
      if (actividad === "palabras") iniciarVocabulario();
      if (actividad === "historias") iniciarHistorias();
    });
  });
});
