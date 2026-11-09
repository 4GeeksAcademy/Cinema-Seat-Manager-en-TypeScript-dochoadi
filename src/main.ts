/**
 * Guion de pruebas por consola de Cinema Seat Manager.
 *
 * Ejecuta los escenarios del enunciado (sala vacía, parcialmente ocupada,
 * casi llena, llena y flujo real de taquilla) más un escenario extra de
 * robustez. Cada comprobación imprime ✔ OK o ✘ FALLO y al final se muestra
 * el total de pruebas superadas. Si alguna falla, el proceso termina con
 * código de salida 1.
 *
 * Ejecutar con: npm run test
 */
import {
  COLUMNAS,
  FILAS,
  type SalaMatriz,
  buscarAsientosContiguos,
  contarAsientos,
  crearSala,
  liberarAsiento,
  mensajeResultadoContiguos,
  mostrarResultadoContiguos,
  mostrarSala,
  reservarAsiento,
} from "./cinema";

/** Número total de comprobaciones ejecutadas. */
let pruebasTotales = 0;

/** Número de comprobaciones superadas. */
let pruebasSuperadas = 0;

// ---------------------------------------------------------------------------
// Utilidades de prueba
// ---------------------------------------------------------------------------

/**
 * Compara un resultado obtenido con el esperado e imprime ✔ OK o ✘ FALLO.
 *
 * Los valores llegan como texto: los mensajes se pasan tal cual y las
 * matrices / tuplas se pasan serializadas con `JSON.stringify`.
 *
 * @param descripcion - Qué se está comprobando.
 * @param obtenido - Resultado real, como texto.
 * @param esperado - Resultado esperado, como texto.
 * @returns Nada; actualiza los contadores y escribe en la consola.
 */
function verificar(descripcion: string, obtenido: string, esperado: string): void {
  pruebasTotales++;
  if (JSON.stringify(obtenido) === JSON.stringify(esperado)) {
    pruebasSuperadas++;
    console.log(`  ✔ OK     ${descripcion} → ${obtenido}`);
  } else {
    console.log(`  ✘ FALLO  ${descripcion} → obtenido ${obtenido}, esperado ${esperado}`);
  }
}

/**
 * Marca como ocupados (1) todos los asientos de la sala.
 *
 * @param sala - Matriz de asientos que se modifica.
 * @returns Nada; modifica la matriz recibida.
 */
function llenarSala(sala: SalaMatriz): void {
  for (let fila = 0; fila < sala.length; fila++) {
    for (let columna = 0; columna < sala[fila].length; columna++) {
      sala[fila][columna] = 1;
    }
  }
}

/**
 * Deja libres (0) las posiciones indicadas. Solo prepara datos de prueba;
 * no es una funcionalidad de la aplicación.
 *
 * @param sala - Matriz de asientos que se modifica.
 * @param posiciones - Lista de posiciones `[fila, columna]` a liberar.
 * @returns Nada; modifica la matriz recibida.
 */
function liberarPosiciones(sala: SalaMatriz, posiciones: number[][]): void {
  for (let indice = 0; indice < posiciones.length; indice++) {
    const fila = posiciones[indice][0];
    const columna = posiciones[indice][1];
    sala[fila][columna] = 0;
  }
}

/**
 * Imprime el encabezado de un escenario.
 *
 * @param numero - Número o etiqueta del escenario.
 * @param nombre - Nombre descriptivo del escenario.
 * @returns Nada; solo escribe en la consola.
 */
function encabezado(numero: string, nombre: string): void {
  console.log("");
  console.log(`=== ESCENARIO ${numero}: ${nombre} ===`);
}

/**
 * Muestra el conteo de la sala con un mensaje legible y lo devuelve.
 *
 * @param sala - Matriz de asientos a contar.
 * @returns Tupla `[ocupados, disponibles]` calculada por `contarAsientos`.
 */
function mostrarConteo(sala: SalaMatriz): [number, number] {
  const conteo = contarAsientos(sala);
  console.log(`Ocupados: ${conteo[0]} · Disponibles: ${conteo[1]} · Total: ${conteo[0] + conteo[1]}`);
  return conteo;
}

/**
 * Busca asientos contiguos, muestra el resultado para taquilla y lo devuelve.
 *
 * @param sala - Matriz de asientos donde buscar.
 * @returns El par encontrado o `null`.
 */
function buscarYMostrarContiguos(sala: SalaMatriz): number[][] | null {
  const resultado = buscarAsientosContiguos(sala);
  mostrarResultadoContiguos(resultado, sala);
  return resultado;
}

/**
 * Intenta una reserva, muestra el mensaje y lo devuelve.
 *
 * @param sala - Matriz de asientos.
 * @param fila - Fila solicitada.
 * @param columna - Asiento solicitado.
 * @returns Mensaje devuelto por `reservarAsiento`.
 */
function intentarReserva(sala: SalaMatriz, fila: number, columna: number): string {
  const mensaje = reservarAsiento(sala, fila, columna);
  console.log(`Reservar fila ${fila}, asiento ${columna} → ${mensaje}`);
  return mensaje;
}

// ---------------------------------------------------------------------------
// ESCENARIO 1: sala vacía
// ---------------------------------------------------------------------------
encabezado("1", "Sala vacía");
const salaVacia = crearSala(FILAS, COLUMNAS);
mostrarSala(salaVacia);
const conteoVacia = mostrarConteo(salaVacia);
const contiguosVacia = buscarYMostrarContiguos(salaVacia);
console.log("Comprobaciones:");
verificar("conteo [ocupados, disponibles]", JSON.stringify(conteoVacia), JSON.stringify([0, 80]));
verificar("primer par contiguo", JSON.stringify(contiguosVacia), JSON.stringify([[0, 0], [0, 1]]));

// ---------------------------------------------------------------------------
// ESCENARIO 2: sala parcialmente ocupada (sala del enunciado)
// ---------------------------------------------------------------------------
encabezado("2", "Sala parcialmente ocupada (sala del enunciado)");
// L = 0 (libre), X = 1 (ocupado)
const salaEnunciado: SalaMatriz = [
  [0, 1, 0, 0, 1, 1, 0, 0, 1, 0], // fila 0: L X L L X X L L X L
  [1, 0, 0, 1, 0, 0, 1, 1, 0, 1], // fila 1: X L L X L L X X L X
  [0, 0, 1, 0, 1, 0, 0, 0, 1, 0], // fila 2: L L X L X L L L X L
  [0, 1, 0, 0, 0, 1, 1, 0, 0, 1], // fila 3: L X L L L X X L L X
  [1, 0, 0, 1, 1, 0, 0, 1, 0, 0], // fila 4: X L L X X L L X L L
  [0, 0, 1, 0, 0, 1, 0, 0, 1, 1], // fila 5: L L X L L X L L X X
  [0, 1, 0, 0, 1, 0, 1, 0, 0, 0], // fila 6: L X L L X L X L L L
  [1, 0, 0, 1, 0, 0, 0, 1, 1, 0], // fila 7: X L L X L L L X X L
];
mostrarSala(salaEnunciado);
const conteoEnunciado = mostrarConteo(salaEnunciado);
const contiguosEnunciado = buscarYMostrarContiguos(salaEnunciado);
console.log("Comprobaciones:");
verificar("conteo [ocupados, disponibles]", JSON.stringify(conteoEnunciado), JSON.stringify([31, 49]));
verificar("primer par contiguo", JSON.stringify(contiguosEnunciado), JSON.stringify([[0, 2], [0, 3]]));

console.log("");
console.log("Intentos de reserva:");
const mensajeCorrecto = intentarReserva(salaEnunciado, 2, 3);
const mensajeOcupado = intentarReserva(salaEnunciado, 2, 3);
const mensajeFueraDeRango = intentarReserva(salaEnunciado, 9, 0);
mostrarSala(salaEnunciado);
const conteoTrasReservas = mostrarConteo(salaEnunciado);
console.log("Comprobaciones (textos exactos de reservarAsiento, ERR-001):");
verificar("mensaje de reserva correcta", mensajeCorrecto, "✅ Reserva confirmada: fila 2, asiento 3");
verificar("mensaje de asiento ocupado", mensajeOcupado, "❌ Asiento ocupado: fila 2, asiento 3");
verificar(
  "mensaje de posición no válida",
  mensajeFueraDeRango,
  "⚠️ Posición no válida: fila 9, asiento 0. Valores válidos: fila 0–7, asiento 0–9 (números enteros).",
);
verificar("conteo tras una reserva", JSON.stringify(conteoTrasReservas), JSON.stringify([32, 48]));

// ---------------------------------------------------------------------------
// ESCENARIO 3: sala casi llena con solo asientos sueltos
// ---------------------------------------------------------------------------
encabezado("3", "Sala casi llena con solo asientos sueltos");
const salaCasiLlena = crearSala(FILAS, COLUMNAS);
llenarSala(salaCasiLlena);
const asientosSueltos: number[][] = [
  [0, 0],
  [1, 5],
  [3, 9],
  [5, 2],
  [7, 4],
  [7, 7],
];
liberarPosiciones(salaCasiLlena, asientosSueltos);
mostrarSala(salaCasiLlena);
const conteoCasiLlena = mostrarConteo(salaCasiLlena);
const contiguosCasiLlena = buscarYMostrarContiguos(salaCasiLlena);
console.log("Comprobaciones:");
verificar("conteo [ocupados, disponibles]", JSON.stringify(conteoCasiLlena), JSON.stringify([74, 6]));
verificar("sin asientos contiguos", JSON.stringify(contiguosCasiLlena), JSON.stringify(null));

console.log("");
console.log("Se vende uno de los asientos sueltos:");
const mensajeSuelto = intentarReserva(salaCasiLlena, 1, 5);
const conteoTrasSuelto = mostrarConteo(salaCasiLlena);
console.log("Comprobaciones:");
verificar("reserva de asiento suelto", mensajeSuelto, "✅ Reserva confirmada: fila 1, asiento 5");
verificar("conteo tras la reserva", JSON.stringify(conteoTrasSuelto), JSON.stringify([75, 5]));

// ---------------------------------------------------------------------------
// ESCENARIO 4: sala completamente llena
// ---------------------------------------------------------------------------
encabezado("4", "Sala completamente llena");
const salaLlena = crearSala(FILAS, COLUMNAS);
llenarSala(salaLlena);
mostrarSala(salaLlena);
const conteoLlena = mostrarConteo(salaLlena);
const contiguosLlena = buscarYMostrarContiguos(salaLlena);
const mensajeSalaLlena = intentarReserva(salaLlena, 4, 4);
console.log("Comprobaciones:");
verificar("conteo [ocupados, disponibles]", JSON.stringify(conteoLlena), JSON.stringify([80, 0]));
verificar("sin asientos contiguos", JSON.stringify(contiguosLlena), JSON.stringify(null));
verificar("reserva rechazada", mensajeSalaLlena, "❌ Asiento ocupado: fila 4, asiento 4");

// ---------------------------------------------------------------------------
// ESCENARIO 5: flujo real de taquilla
// ---------------------------------------------------------------------------
encabezado("5", "Flujo real de taquilla (una pareja pide dos asientos juntos)");
const salaTaquilla = crearSala(FILAS, COLUMNAS);
console.log("Una pareja pide dos asientos juntos. Buscando...");
const parPareja = buscarYMostrarContiguos(salaTaquilla);
console.log("Comprobaciones:");
verificar("par propuesto", JSON.stringify(parPareja), JSON.stringify([[0, 0], [0, 1]]));

if (parPareja !== null) {
  console.log("");
  console.log("Reservando los dos asientos propuestos:");
  for (let indice = 0; indice < parPareja.length; indice++) {
    intentarReserva(salaTaquilla, parPareja[indice][0], parPareja[indice][1]);
  }
}
mostrarSala(salaTaquilla);
const conteoTaquilla = mostrarConteo(salaTaquilla);
console.log("Siguiente pareja. Buscando...");
const siguientePar = buscarYMostrarContiguos(salaTaquilla);
console.log("Comprobaciones:");
verificar("conteo tras reservar la pareja", JSON.stringify(conteoTaquilla), JSON.stringify([2, 78]));
verificar("siguiente par contiguo", JSON.stringify(siguientePar), JSON.stringify([[0, 2], [0, 3]]));

// ---------------------------------------------------------------------------
// ESCENARIO 6: anulación de reservas (Entrega 2, funcionalidad adicional)
// ---------------------------------------------------------------------------
encabezado("6", "Anulación de reservas (funcionalidad adicional, fuera de evaluación)");
const salaAnulaciones = crearSala(FILAS, COLUMNAS);
intentarReserva(salaAnulaciones, 3, 4);
const conteoTrasReservar = mostrarConteo(salaAnulaciones);
const mensajeAnulada = liberarAsiento(salaAnulaciones, 3, 4);
console.log(`Anular fila 3, asiento 4 → ${mensajeAnulada}`);
const mensajeYaLibre = liberarAsiento(salaAnulaciones, 3, 4);
console.log(`Anular fila 3, asiento 4 → ${mensajeYaLibre}`);
const mensajeAnulacionNoValida = liberarAsiento(salaAnulaciones, 8, 0);
console.log(`Anular fila 8, asiento 0 → ${mensajeAnulacionNoValida}`);
const conteoTrasAnular = mostrarConteo(salaAnulaciones);
console.log("Comprobaciones:");
verificar("conteo tras reservar", JSON.stringify(conteoTrasReservar), JSON.stringify([1, 79]));
verificar("mensaje de reserva anulada", mensajeAnulada, "↩️ Reserva anulada: fila 3, asiento 4");
verificar("mensaje de asiento ya libre", mensajeYaLibre, "⚠️ Asiento ya libre: fila 3, asiento 4");
verificar(
  "mensaje de posición no válida al anular",
  mensajeAnulacionNoValida,
  "⚠️ Posición no válida: fila 8, asiento 0. Valores válidos: fila 0–7, asiento 0–9 (números enteros).",
);
verificar("conteo tras anular", JSON.stringify(conteoTrasAnular), JSON.stringify([0, 80]));

// ---------------------------------------------------------------------------
// ESCENARIO EXTRA: robustez con una matriz sin filas
// ---------------------------------------------------------------------------
encabezado("EXTRA", "Robustez: sala sin filas (matriz vacía)");
const salaSinFilas: SalaMatriz = [];
mostrarSala(salaSinFilas);
const contiguosSinFilas = buscarYMostrarContiguos(salaSinFilas);
console.log("Comprobaciones:");
verificar("contiguos en matriz vacía", JSON.stringify(contiguosSinFilas), JSON.stringify(null));
verificar(
  "aviso propio de sala sin asientos",
  mensajeResultadoContiguos(contiguosSinFilas, salaSinFilas),
  "⚠️ Sala sin asientos: no hay contiguos que buscar.",
);

// ---------------------------------------------------------------------------
// Resumen
// ---------------------------------------------------------------------------
console.log("");
console.log("==========================================");
console.log(`Pruebas superadas: ${pruebasSuperadas}/${pruebasTotales}`);
console.log("==========================================");
if (pruebasSuperadas !== pruebasTotales) {
  process.exitCode = 1;
}
