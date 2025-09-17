let correctos = 0;
const maxCorrectos = 10;

// 🔊 Sonidos
const sonidoCorrecto = new Audio("Sounds_Disfasia/correcto.mp3");
const sonidoIncorrecto = new Audio("Sounds_Disfasia/incorrecto.mp3");
const sonidoFin = new Audio("Sounds_Disfasia/fin.mp3");

function mostrarFeedback(texto, correcto = true) {
  const div = document.createElement("div");
  div.className = `feedback ${correcto ? 'correcto' : 'incorrecto'}`;
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
  setTimeout(mostrarMenu, 2000);
}

function leerTexto(texto) {
  const msg = new SpeechSynthesisUtterance(texto);
  window.speechSynthesis.speak(msg);
}

/* --- Mostrar menú y ocultar botón principal cuando entramos a actividad --- */
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

/********************
 * Actividad Sílabas
 ********************/
const silabas = [
  { id: 'ma', texto: 'ma' }, { id: 'me', texto: 'me' }, { id: 'mi', texto: 'mi' },
  { id: 'mo', texto: 'mo' }, { id: 'mu', texto: 'mu' },
  { id: 'pa', texto: 'pa' }, { id: 'pe', texto: 'pe' }, { id: 'pi', texto: 'pi' },
  { id: 'po', texto: 'po' }, { id: 'pu', texto: 'pu' }
];

function iniciarSilabas() {
  const contenedor = document.getElementById("vista-actividad");
  contenedor.hidden = false;
  ocultarMenuPrincipal();
  contenedor.innerHTML = "";

  const btnBack = document.createElement("button");
  btnBack.className = "btn-regresar";
  btnBack.textContent = "⬅ Volver a apartados";
  btnBack.addEventListener("click", mostrarMenu);
  contenedor.appendChild(btnBack);

  actualizarMarcador();

  function mostrarSiguiente() {
    contenedor.querySelectorAll("#instruccion, .opciones").forEach(el => el.remove());

    const target = silabas[Math.floor(Math.random() * silabas.length)];
    const instruccion = document.createElement("div");
    instruccion.id = "instruccion";
    instruccion.textContent = `Selecciona la sílaba: ${target.texto}`;
    contenedor.appendChild(instruccion);

    const opcionesDiv = document.createElement("div");
    opcionesDiv.className = "opciones";

    silabas.forEach(s => {
      const btn = document.createElement("button");
      btn.className = "tarjeta-bonita";
      btn.textContent = s.texto;
      btn.addEventListener("click", () => {
        if (s.id === target.id) {
          mostrarFeedback("¡Correcto!");
          correctos++;
          actualizarMarcador();
          if (correctos >= maxCorrectos) {
            finalizarActividad();
          } else {
            setTimeout(mostrarSiguiente, 600);
          }
        } else {
          mostrarFeedback("Intenta otra vez", false);
        }
      });
      opcionesDiv.appendChild(btn);
    });

    contenedor.appendChild(opcionesDiv);
  }

  mostrarSiguiente();
}

/********************
 * Palabras con imagen
 ********************/
function iniciarVocabulario() {
  const contenedor = document.getElementById("vista-actividad");
  contenedor.hidden = false;
  ocultarMenuPrincipal();
  contenedor.innerHTML = "";

  const btnBack = document.createElement("button");
  btnBack.className = "btn-regresar";
  btnBack.textContent = "⬅ Volver a apartados";
  btnBack.addEventListener("click", mostrarMenu);
  contenedor.appendChild(btnBack);

  const apartados = document.createElement("div");
  apartados.className = "opciones";
  apartados.style.justifyContent = "center";
  apartados.style.marginTop = "20px";

  const categorias = [
    { nombre: "Animales", key: "animales", icono: "🐾" },
    { nombre: "Objetos", key: "objetos", icono: "📦" }
  ];

  categorias.forEach(cat => {
    const item = document.createElement("div");
    item.className = "tarjeta-bonita";
    item.innerHTML = `<div style="font-size:3rem">${cat.icono}</div><p>${cat.nombre}</p>`;
    item.addEventListener("click", () => mostrarCategoriaVocabulario(cat.key, contenedor));
    apartados.appendChild(item);
  });

  contenedor.appendChild(apartados);
}

/********************
 * Historias
 ********************/
function iniciarHistorias() {
  const contenedor = document.getElementById("vista-actividad");
  contenedor.hidden = false;
  ocultarMenuPrincipal();
  contenedor.innerHTML = "";

  let indice = 0;
  const historias = [ /* tus historias */ ];

  function mostrarHistoria() {
    contenedor.innerHTML = "";
    if (indice >= historias.length) {
      finalizarActividad();
      return;
    }

    const h = historias[indice];
    const btnBack = document.createElement("button");
    btnBack.className = "btn-regresar";
    btnBack.textContent = "⬅ Volver a apartados";
    btnBack.addEventListener("click", mostrarMenu);
    contenedor.appendChild(btnBack);

    actualizarMarcador();

    const texto = document.createElement("p");
    texto.id = "instruccion";
    texto.textContent = h.texto;
    contenedor.appendChild(texto);

    const grid = document.createElement("div");
    grid.className = "opciones";

    h.opciones.forEach(op => {
      const item = document.createElement("div");
      item.className = "tarjeta-bonita";
      item.innerHTML = `<div style="font-size:3rem">${op.imagen}</div><p>${op.palabra}</p>`;
      item.addEventListener("click", () => {
        if (op.palabra === h.respuesta) {
          mostrarFeedback("¡Correcto!");
          correctos++;
          actualizarMarcador();
          setTimeout(() => { indice++; mostrarHistoria(); }, 600);
        } else {
          mostrarFeedback("Intenta otra vez", false);
        }
      });
      grid.appendChild(item);
    });

    contenedor.appendChild(grid);
  }

  mostrarHistoria();
}

/* --- Botones menú principal --- */
document.querySelectorAll(".menu-actividades button").forEach(btn => {
  btn.addEventListener("click", () => {
    const act = btn.dataset.actividad;
    if (act === "silabas") iniciarSilabas();
    if (act === "palabras") iniciarVocabulario();
    if (act === "historias") iniciarHistorias();
  });
});
