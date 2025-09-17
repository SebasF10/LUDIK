/********************
 * Variables Globales
 ********************/
let currentActivity = null;
let currentMode = "practica"; // "practica" o "evaluar"
let tabs = {};

/********************
 * Sonidos
 ********************/
const sonidos = {
  correcto: new Audio("Sounds_Motriz/correcto.mp3"),
  incorrecto: new Audio("Sounds_Motrizincorrecto.mp3"),
  fin: new Audio("Sounds_Motrizfin.mp3"),
  drag: new Audio("Sounds_Motrizdrag.mp3")
};

/********************
 * Feedback visual
 ********************/
function mostrarFeedback(mensaje, tipo) {
  const fb = document.createElement("div");
  fb.className = `feedback ${tipo}`;
  fb.textContent = mensaje;
  document.body.appendChild(fb);
  setTimeout(() => fb.remove(), 1200);
}

/********************
 * DOM
 ********************/
window.onload = () => {
  tabs = {
    motrizReaccion: document.getElementById("tab-motrizReaccion"),
    motrizDibujo: document.getElementById("tab-motrizDibujo"),
    motrizArrastre: document.getElementById("tab-motrizArrastre")
  };

  document.querySelectorAll("[data-actividad]").forEach(btn => {
    btn.addEventListener("click", () => {
      abrirActividad(btn.dataset.actividad, btn.dataset.modo);
    });
  });

  document.querySelector(".btn-regresar").addEventListener("click", volverAlMenu);
};

/********************
 * Flujo
 ********************/
function abrirActividad(tipo, modo) {
  currentActivity = tipo;
  currentMode = modo;

  limpiarPuntosDibujo(); // 🔥 limpiar puntos viejos

  document.getElementById("menu-principal").hidden = true;
  const vista = document.getElementById("vista-actividad");
  vista.hidden = false;
  vista.classList.add("activa");

  Object.values(tabs).forEach(a => a.hidden = true);
  tabs[tipo].hidden = false;
  tabs[tipo].innerHTML = "";

  switch (tipo) {
    case "motrizReaccion": renderMotrizReaccion(); break;
    case "motrizDibujo": renderMotrizDibujo(); break;
    case "motrizArrastre": renderMotrizArrastre(); break;
  }
}
function volverAlMenu() {
  limpiarPuntosDibujo(); // 🔥 limpiar puntos viejos
  const vista = document.getElementById("vista-actividad");
  vista.hidden = true;
  vista.classList.remove("activa");
  document.getElementById("menu-principal").hidden = false;
  currentActivity = null;
}

/*******************************
 * ACTIVIDAD 1 – JUEGO DE REACCIÓN
 *******************************/
function renderMotrizReaccion() {
  const cont = tabs[currentActivity];
  cont.innerHTML = "";

  let contador = 0;
  let objetivo = currentMode === "evaluar" ? 15 : 10;
  let velocidad = currentMode === "evaluar" ? 900 : 1200;

  const marcador = document.createElement("div");
  marcador.className = "marcador-bonito";
  marcador.textContent = `Aciertos: ${contador} / ${objetivo}`;
  cont.appendChild(marcador);

  const progreso = document.createElement("div");
  progreso.className = "barra-progreso";
  progreso.innerHTML = `<div class="relleno"></div>`;
  cont.appendChild(progreso);

  const areaJuego = document.createElement("div");
  areaJuego.className = "area-reaccion";
  cont.appendChild(areaJuego);

  const objetivoDiv = document.createElement("div");
  objetivoDiv.className = "objetivo";
  objetivoDiv.textContent = "🎯";
  areaJuego.appendChild(objetivoDiv);

  function moverObjetivo() {
    const maxX = areaJuego.clientWidth - 60;
    const maxY = areaJuego.clientHeight - 60;
    objetivoDiv.style.left = Math.random() * maxX + "px";
    objetivoDiv.style.top = Math.random() * maxY + "px";
  }

  objetivoDiv.addEventListener("click", () => {
    contador++;
    sonidos.correcto.play();
    marcador.textContent = `Aciertos: ${contador} / ${objetivo}`;
    const porcentaje = (contador / objetivo) * 100;
    progreso.querySelector(".relleno").style.width = porcentaje + "%";

    if (contador >= objetivo) {
      sonidos.fin.play();
      mostrarFeedback("¡Excelente! Has terminado 🎉", "correcto");

      const btnOpciones = document.createElement("div");
      btnOpciones.className = "controles";
      btnOpciones.innerHTML = `
        <button onclick="renderMotrizReaccion()">🔁 Reintentar</button>
        <button onclick="volverAlMenu()">🏠 Salir</button>
      `;
      cont.appendChild(btnOpciones);
    } else {
      moverObjetivo();
    }
  });

  moverObjetivo();
  setInterval(moverObjetivo, velocidad);
}

/*******************************
 * ACTIVIDAD 2 – DIBUJO GUIADO
 *******************************/
function renderMotrizDibujo() {
  const cont = tabs[currentActivity];
  cont.innerHTML = "";

  const instruccion = document.createElement("div");
  instruccion.className = "tarjeta-instruccion";
  instruccion.textContent = currentMode === "evaluar"
    ? "🎯 Completa la figura colocando puntos en sus bordes"
    : "✏️ Dibuja libremente haciendo clic en el lienzo";
  cont.appendChild(instruccion);

  const selector = document.createElement("div");
  selector.className = "opciones";
  cont.appendChild(selector);

  const figurasPractica = ["⬛ Cuadrado", "🔺 Triángulo"];
  const figurasEvaluar = ["⭐ Estrella", "🐻 Oso", "🏠 Casa"];
  const figuras = currentMode === "evaluar" ? figurasEvaluar : figurasPractica;

  figuras.forEach(fig => {
    const btn = document.createElement("div");
    btn.className = "tarjeta-bonita";
    btn.textContent = fig;
    btn.addEventListener("click", () => iniciarDibujo(fig));
    selector.appendChild(btn);
  });

  function iniciarDibujo(figura) {
    cont.innerHTML = "";
    cont.appendChild(instruccion);

    const lienzo = document.createElement("div");
    lienzo.id = "pizarra";
    cont.appendChild(lienzo);

    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 400;
    lienzo.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 3;
    ctx.beginPath();

    let puntosClave = [];

    if (figura.includes("Cuadrado")) {
      ctx.rect(100, 100, 300, 200);
      puntosClave = [[100,100],[400,100],[100,300],[400,300]];
    }
    if (figura.includes("Triángulo")) {
      ctx.moveTo(250, 80);
      ctx.lineTo(100, 320);
      ctx.lineTo(400, 320);
      ctx.closePath();
      puntosClave = [[250,80],[100,320],[400,320]];
    }
    if (figura.includes("Estrella")) {
      const cx=250, cy=200, spikes=5, outer=120, inner=50;
      let rot=Math.PI/2*3, x=cx, y=cy;
      ctx.moveTo(cx, cy-outer);
      for(let i=0;i<spikes;i++){
        x = cx + Math.cos(rot) * outer;
        y = cy + Math.sin(rot) * outer;
        ctx.lineTo(x,y);
        rot += Math.PI/spikes;

        x = cx + Math.cos(rot) * inner;
        y = cy + Math.sin(rot) * inner;
        ctx.lineTo(x,y);
        rot += Math.PI/spikes;
        puntosClave.push([x,y]);
      }
      ctx.closePath();
    }
    if (figura.includes("Casa")) {
      ctx.rect(150, 180, 200, 180);
      ctx.moveTo(150, 180);
      ctx.lineTo(250, 80);
      ctx.lineTo(350, 180);
      ctx.closePath();
      puntosClave = [[150,180],[350,180],[250,80]];
    }
    if (figura.includes("Oso")) {
      ctx.arc(250,200,100,0,Math.PI*2);
      puntosClave = [[250,100],[200,150],[300,150],[250,300]];
    }

    ctx.stroke();

    let puntosAcertados = 0;

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const punto = document.createElement("div");
      punto.className = "punto-dibujo";
      punto.style.position = "absolute";
      punto.style.left = (rect.left + x - 6) + "px";
      punto.style.top = (rect.top + y - 6) + "px";
      punto.style.width = "12px";
      punto.style.height = "12px";
      punto.style.borderRadius = "50%";
      punto.style.background = "#22c55e";
      punto.style.zIndex = "2000";
      document.body.appendChild(punto);

      sonidos.correcto.play();

      if (currentMode === "evaluar") {
        for (let i = 0; i < puntosClave.length; i++) {
          const [px, py] = puntosClave[i];
          const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
          if (dist < 25) {
            puntosAcertados++;
            if (puntosAcertados >= puntosClave.length) {
              sonidos.fin.play();
              mostrarFeedback("¡Imagen completada! 🎉", "correcto");
            }
            break;
          }
        }
      }
    });
  }
}

/********************
 * Actividad 3 – Arrastre
 ********************/
function renderMotrizArrastre() {
  const cont = tabs[currentActivity];
  cont.innerHTML = "";

  let contador = 0;
  const marcador = document.createElement("div");
  marcador.className = "marcador-bonito";
  cont.appendChild(marcador);

  const misionBox = document.createElement("div");
  misionBox.className = "mision-box";
  cont.appendChild(misionBox);

  const zonaDestino = document.createElement("div");
  zonaDestino.className = "zona-destino";
  cont.appendChild(zonaDestino);

  const objetosDiv = document.createElement("div");
  objetosDiv.className = "zona-inicial";
  cont.appendChild(objetosDiv);

  const objetos = ["🍎","🚗","🐶","🌟","🍌","⚽"];

  function crearObjeto(icono) {
    const el = document.createElement("div");
    el.className = "objeto-arrastrable";
    el.textContent = icono;
    el.draggable = true;

    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text", icono);
      el.classList.add("arrastrando");
      sonidos.drag.play();
    });

    el.addEventListener("dragend", () => el.classList.remove("arrastrando"));
    return el;
  }

  objetos.forEach(obj => objetosDiv.appendChild(crearObjeto(obj)));

  let objetivo = null;
  let cantidadNecesaria = 0;

  function nuevaMision() {
    contador = 0;
    zonaDestino.innerHTML = "";

    const posibles = ["🍎","🚗","🐶","🌟"];
    objetivo = posibles[Math.floor(Math.random() * posibles.length)];
    cantidadNecesaria = Math.floor(Math.random() * 3) + 3;

    misionBox.innerHTML = `🎯 <strong>Tu misión:</strong> Arrastra <span style="color:#ef4444">${cantidadNecesaria} ${objetivo}</span>`;
    marcador.textContent = `Has arrastrado: 0 / ${cantidadNecesaria}`;
  }

  if (currentMode === "evaluar") {
    nuevaMision();
  } else {
    misionBox.textContent = "Arrastra los objetos 🖐️ (¡puedes practicar libremente!)";
    marcador.textContent = "Has arrastrado: 0";
  }

  zonaDestino.addEventListener("dragover", e => e.preventDefault());
  zonaDestino.addEventListener("drop", e => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");

    const arrastrado = [...objetosDiv.children, ...zonaDestino.children]
      .find(c => c.textContent === data && c.classList.contains("arrastrando"));

    if (arrastrado) {
      zonaDestino.appendChild(arrastrado);
      objetosDiv.appendChild(crearObjeto(data));

      if (currentMode === "practica" || data === objetivo) {
        contador++;
        sonidos.correcto.play();
        mostrarFeedback("¡Muy bien! 🎉", "correcto");
      } else {
        sonidos.incorrecto.play();
        mostrarFeedback("Ese no es el correcto ❌", "incorrecto");
      }

      if (currentMode === "evaluar") {
        marcador.textContent = `Has arrastrado: ${contador} / ${cantidadNecesaria}`;

        if (contador >= cantidadNecesaria) {
          sonidos.fin.play();
          mostrarFeedback("¡Misión completada! 🎉", "correcto");
          misionBox.innerHTML = "🏆 <strong>¡Excelente!</strong> Has cumplido tu misión 👏";
        
          // 🔥 ahora el botón va debajo, no dentro del cartel
          let btnMision = document.querySelector(".btn-nueva-mision");
          if (!btnMision) {
            btnMision = document.createElement("button");
            btnMision.textContent = "➕ Nueva misión";
            btnMision.className = "btn-nueva-mision";
            btnMision.addEventListener("click", nuevaMision);
            cont.appendChild(btnMision); // ⬅️ agregado al contenedor general, abajo
          }
        }
        
      } else {
        marcador.textContent = `Has arrastrado: ${contador}`;
      }
    }
  });
}

/********************
 * Utilidad
 ********************/
function limpiarPuntosDibujo() {
  document.querySelectorAll(".punto-dibujo").forEach(el => el.remove());
}
