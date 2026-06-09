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
// Selecciona el contador de partidas totales.
const contadorPartidas = document.getElementById("partidas");
// Selecciona el porcentaje general de victorias.
const contadorPorcentaje = document.getElementById("porcentaje");
// Selecciona el resultado de la estrategia de quedarse.
const estadisticaQuedarse = document.getElementById("quedarse-estadistica");
// Selecciona el resultado de la estrategia de cambiar.
const estadisticaCambiar = document.getElementById("cambiar-estadistica");
// Selecciona el botón que borra las estadísticas.
const btnReiniciarEstadisticas = document.getElementById("reiniciar-estadisticas");
// Selecciona la barra de éxito al quedarse.
const barraQuedarse = document.getElementById("barra-quedarse");
// Selecciona la barra de éxito al cambiar.
const barraCambiar = document.getElementById("barra-cambiar");

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
// Carga las estadísticas guardadas en el navegador.
let estadisticas = cargarEstadisticas();

// Recupera las estadísticas o crea unas vacías.
function cargarEstadisticas() {
  // Lee los datos guardados en localStorage.
  const guardadas = localStorage.getItem("estadisticasMontyHall");
  // Convierte los datos guardados o devuelve valores iniciales.
  return guardadas ? JSON.parse(guardadas) : {
    ganadas: 0,
    perdidas: 0,
    quedarse: { partidas: 0, ganadas: 0 },
    cambiar: { partidas: 0, ganadas: 0 }
  };
}

// Calcula el porcentaje entero de victorias.
function calcularPorcentaje(victorias, partidas) {
  // Evita dividir entre cero cuando no hay partidas.
  return partidas === 0 ? 0 : Math.round((victorias / partidas) * 100);
}

// Refresca todos los datos visibles y los guarda.
function actualizarEstadisticas() {
  // Calcula el total de partidas terminadas.
  const partidas = estadisticas.ganadas + estadisticas.perdidas;
  // Sincroniza el contador general de victorias.
  ganadas = estadisticas.ganadas;
  // Sincroniza el contador general de derrotas.
  perdidas = estadisticas.perdidas;

  // Muestra el total de partidas.
  contadorPartidas.textContent = partidas;
  // Muestra el total de victorias.
  contadorGanadas.textContent = ganadas;
  // Muestra el total de derrotas.
  contadorPerdidas.textContent = perdidas;
  // Muestra el porcentaje general.
  contadorPorcentaje.textContent = `${calcularPorcentaje(ganadas, partidas)}%`;
  // Muestra los resultados al quedarse.
  estadisticaQuedarse.textContent =
    `${estadisticas.quedarse.ganadas}/${estadisticas.quedarse.partidas} (${calcularPorcentaje(estadisticas.quedarse.ganadas, estadisticas.quedarse.partidas)}%)`;
  // Muestra los resultados al cambiar.
  estadisticaCambiar.textContent =
    `${estadisticas.cambiar.ganadas}/${estadisticas.cambiar.partidas} (${calcularPorcentaje(estadisticas.cambiar.ganadas, estadisticas.cambiar.partidas)}%)`;
  // Ajusta la barra de la estrategia de quedarse.
  barraQuedarse.style.width =
    `${calcularPorcentaje(estadisticas.quedarse.ganadas, estadisticas.quedarse.partidas)}%`;
  // Ajusta la barra de la estrategia de cambiar.
  barraCambiar.style.width =
    `${calcularPorcentaje(estadisticas.cambiar.ganadas, estadisticas.cambiar.partidas)}%`;

  // Guarda las estadísticas para conservarlas al recargar.
  localStorage.setItem("estadisticasMontyHall", JSON.stringify(estadisticas));
}

// Registra una partida según su resultado y estrategia.
function registrarResultado(gano, estrategia) {
  // Suma una partida a la estrategia utilizada.
  estadisticas[estrategia].partidas++;

  // Comprueba si la partida terminó en victoria.
  if (gano) {
    // Suma una victoria general.
    estadisticas.ganadas++;
    // Suma una victoria a la estrategia utilizada.
    estadisticas[estrategia].ganadas++;
  } else {
    // Suma una derrota general.
    estadisticas.perdidas++;
  }

  // Actualiza el panel después del resultado.
  actualizarEstadisticas();
}

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
function finalizarJuego(eleccionFinal, estrategia) {
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
    registrarResultado(true, estrategia);
    // Muestra el mensaje ganador.
    resultado.textContent = "¡Ganaste el coche!";
  } else {
    registrarResultado(false, estrategia);
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
  finalizarJuego(puertaElegida, "quedarse");
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
    finalizarJuego(puertaCambio, "cambiar");
  }, 1000);
});

// Reinicia al pulsar el botón.
btnReiniciar.addEventListener("click", iniciarJuego);

// Escucha el botón para borrar estadísticas.
btnReiniciarEstadisticas.addEventListener("click", () => {
  // Restablece todos los contadores.
  estadisticas = {
    ganadas: 0,
    perdidas: 0,
    quedarse: { partidas: 0, ganadas: 0 },
    cambiar: { partidas: 0, ganadas: 0 }
  };
  // Refresca y guarda los valores reiniciados.
  actualizarEstadisticas();
});

// Inicia la primera partida.
// Muestra las estadísticas guardadas.
actualizarEstadisticas();
iniciarJuego();
