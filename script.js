// Selecciona todas las puertas.
const puertas = document.querySelectorAll(".puerta");
// Selecciona el texto de instrucciones.
const mensaje = document.getElementById("mensaje");
// Selecciona el texto del resultado.
const resultado = document.getElementById("resultado");
// Selecciona el botón para quedarse.
const btnQuedarse = document.getElementById("quedarse");
// Selecciona el botón para cambiar.
const btnCambiar = document.getElementById("cambiar");
// Selecciona el botón para reiniciar.
const btnReiniciar = document.getElementById("reiniciar");
// Selecciona el contador de victorias.
const contadorGanadas = document.getElementById("ganadas");
// Selecciona el contador de derrotas.
const contadorPerdidas = document.getElementById("perdidas");

// Guarda el número de la puerta ganadora.
let puertaPremiada;
// Guarda la puerta elegida inicialmente.
let puertaElegida;
// Guarda la puerta abierta por el presentador.
let puertaAbierta;
// Guarda la puerta disponible para cambiar.
let puertaCambio;
// Cuenta las partidas ganadas.
let ganadas = 0;
// Cuenta las partidas perdidas.
let perdidas = 0;

// Prepara una partida nueva.
function iniciarJuego() {
  // Elige aleatoriamente una puerta ganadora.
  puertaPremiada = Math.floor(Math.random() * 3) + 1;
  // Borra la elección anterior.
  puertaElegida = null;
  // Borra la puerta abierta anterior.
  puertaAbierta = null;
  // Borra la opción de cambio anterior.
  puertaCambio = null;

  // Muestra la instrucción inicial.
  mensaje.textContent = "Elige una puerta para comenzar.";
  // Limpia el resultado anterior.
  resultado.textContent = "";
  // Desactiva quedarse hasta elegir puerta.
  btnQuedarse.disabled = true;
  // Desactiva cambiar hasta elegir puerta.
  btnCambiar.disabled = true;

  // Restablece cada puerta.
  puertas.forEach(puerta => {
    // Muestra el número de la puerta.
    puerta.textContent = "Puerta " + puerta.dataset.puerta;
    // Permite seleccionar la puerta.
    puerta.disabled = false;
    // Elimina todos sus estados visuales.
    puerta.classList.remove("abierta", "elegida", "premiada", "perdedora");
  });
}

// Procesa la primera puerta elegida.
function elegirPuerta(numeroPuerta) {
  // Guarda el número seleccionado.
  puertaElegida = numeroPuerta;

  // Recorre todas las puertas.
  puertas.forEach(puerta => {
    // Evita seleccionar otra puerta.
    puerta.disabled = true;
    // Comprueba si es la puerta elegida.
    if (Number(puerta.dataset.puerta) === puertaElegida) {
      // Resalta la puerta elegida.
      puerta.classList.add("elegida");
    }
  });

  // Ordena al presentador abrir una puerta.
  abrirPuertaMonty();
  // Explica qué puerta abrió el presentador.
  mensaje.textContent =
    `Elegiste la puerta ${puertaElegida}. El presentador abrió la puerta ${puertaAbierta} y había una cabra.`;
  // Permite quedarse con la elección.
  btnQuedarse.disabled = false;
  // Permite cambiar de puerta.
  btnCambiar.disabled = false;
}

// Elige y abre una puerta perdedora.
function abrirPuertaMonty() {
  // Guarda las puertas que Monty puede abrir.
  const opciones = [];

  // Revisa los números del 1 al 3.
  for (let i = 1; i <= 3; i++) {
    // Excluye la puerta elegida y la premiada.
    if (i !== puertaElegida && i !== puertaPremiada) {
      // Añade una puerta válida.
      opciones.push(i);
    }
  }

  // Selecciona aleatoriamente una opción válida.
  puertaAbierta = opciones[Math.floor(Math.random() * opciones.length)];

  // Busca la puerta que debe abrirse.
  puertas.forEach(puerta => {
    // Comprueba si coincide con la elegida por Monty.
    if (Number(puerta.dataset.puerta) === puertaAbierta) {
      // Oculta el texto de la puerta.
      puerta.textContent = "";
      // Muestra la puerta abierta con cabra.
      puerta.classList.add("abierta");
    }
  });

  // Busca la única puerta disponible para cambiar.
  for (let i = 1; i <= 3; i++) {
    // Excluye la elegida y la abierta.
    if (i !== puertaElegida && i !== puertaAbierta) {
      // Guarda la opción de cambio.
      puertaCambio = i;
    }
  }
}

// Revela las puertas y registra el resultado.
function finalizarJuego(eleccionFinal) {
  // Recorre todas las puertas.
  puertas.forEach(puerta => {
    // Convierte su número de texto a número.
    const numero = Number(puerta.dataset.puerta);

    // Comprueba si contiene el premio.
    if (numero === puertaPremiada) {
      // Oculta el texto de la puerta.
      puerta.textContent = "";
      // Abre la puerta y muestra el premio.
      puerta.classList.add("abierta", "premiada");
    } else {
      // Oculta el texto de la puerta.
      puerta.textContent = "";
      // Abre la puerta y muestra una cabra.
      puerta.classList.add("abierta", "perdedora");
    }

    // Impide volver a pulsar la puerta.
    puerta.disabled = true;
  });

  // Desactiva el botón de quedarse.
  btnQuedarse.disabled = true;
  // Desactiva el botón de cambiar.
  btnCambiar.disabled = true;

  // Comprueba si la elección final ganó.
  if (eleccionFinal === puertaPremiada) {
    // Suma una victoria.
    ganadas++;
    // Actualiza el contador de victorias.
    contadorGanadas.textContent = ganadas;
    // Muestra el mensaje ganador.
    resultado.textContent = "¡Ganaste el coche!";
  } else {
    // Suma una derrota.
    perdidas++;
    // Actualiza el contador de derrotas.
    contadorPerdidas.textContent = perdidas;
    // Muestra el mensaje de derrota.
    resultado.textContent = "Perdiste, te tocó una cabra.";
  }
}

// Añade un evento a cada puerta.
puertas.forEach(puerta => {
  // Escucha cuando se pulsa una puerta.
  puerta.addEventListener("click", () => {
    // Envía el número de la puerta elegida.
    elegirPuerta(Number(puerta.dataset.puerta));
  });
});

// Escucha el botón para quedarse.
btnQuedarse.addEventListener("click", () => {
  // Finaliza usando la elección inicial.
  finalizarJuego(puertaElegida);
});

// Escucha el botón para cambiar.
btnCambiar.addEventListener("click", () => {
  // Quita el resaltado de la elección inicial.
  puertas.forEach(puerta => puerta.classList.remove("elegida"));

  // Busca la nueva puerta elegida.
  puertas.forEach(puerta => {
    // Comprueba si es la opción de cambio.
    if (Number(puerta.dataset.puerta) === puertaCambio) {
      // Resalta la nueva elección.
      puerta.classList.add("elegida");
    }
  });

  // Informa del cambio realizado.
  mensaje.textContent = `Has decidido cambiar a la puerta ${puertaCambio}`;

  // Espera un segundo antes de revelar.
  setTimeout(() => {
    // Finaliza usando la nueva puerta.
    finalizarJuego(puertaCambio);
  }, 1000);
});

// Reinicia al pulsar el botón.
btnReiniciar.addEventListener("click", iniciarJuego);

// Inicia la primera partida.
iniciarJuego();
