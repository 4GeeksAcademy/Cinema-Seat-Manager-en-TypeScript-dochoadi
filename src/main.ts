/**
 * Demo y verificación temporal (Prompts 2–3). Se reorganizará en escenarios
 * de prueba completos en el Prompt 4.
 */
import {
  COLUMNAS,
  FILAS,
  type SalaMatriz,
  buscarAsientosContiguos,
  contarAsientos,
  crearSala,
  mostrarResultadoContiguos,
  mostrarSala,
  reservarAsiento,
} from "./cinema";

/**
 * Compara un valor obtenido con el esperado (vía JSON) e imprime ✔/✘.
 *
 * @param descripcion - Qué se está comprobando.
 * @param obtenido - Valor devuelto por el programa.
 * @param esperado - Valor que debería devolver.
 * @returns Nada; solo escribe en la consola.
 */
function comprobar(descripcion: string, obtenido: unknown, esperado: unknown): void {
  const textoObtenido = JSON.stringify(obtenido);
  const textoEsperado = JSON.stringify(esperado);
  if (textoObtenido === textoEsperado) {
    console.log(`  ✔ ${descripcion}: ${textoObtenido}`);
  } else {
    console.log(`  ✘ ${descripcion}: obtenido ${textoObtenido}, esperado ${textoEsperado}`);
  }
}

// --- Demo mínima (Prompt 2) ---------------------------------------------
const sala = crearSala(FILAS, COLUMNAS);

console.log("=== Sala recién creada ===");
mostrarSala(sala);

console.log("=== Reservas ===");
console.log(reservarAsiento(sala, 2, 3));
console.log(reservarAsiento(sala, 2, 3));
console.log(reservarAsiento(sala, 9, 0));

console.log("");
console.log("=== Sala tras las reservas ===");
mostrarSala(sala);

const [ocupados, disponibles] = contarAsientos(sala);
console.log(`Ocupados: ${ocupados} · Disponibles: ${disponibles} · Total: ${ocupados + disponibles}`);

// --- Verificación con la sala del enunciado (Prompt 3) --------------------
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

console.log("");
console.log("=== Sala del enunciado ===");
mostrarSala(salaEnunciado);

const conteoEnunciado = contarAsientos(salaEnunciado);
console.log(
  `Ocupados: ${conteoEnunciado[0]} · Disponibles: ${conteoEnunciado[1]} · ` +
    `Total: ${conteoEnunciado[0] + conteoEnunciado[1]}`,
);
const parEnunciado = buscarAsientosContiguos(salaEnunciado);
mostrarResultadoContiguos(parEnunciado);

console.log("Comprobaciones:");
comprobar("conteo [ocupados, disponibles]", conteoEnunciado, [31, 49]);
comprobar("primer par contiguo", parEnunciado, [
  [0, 2],
  [0, 3],
]);

// --- Sala llena: no debe haber par contiguo -------------------------------
console.log("");
console.log("=== Sala llena ===");
const salaLlena = crearSala(FILAS, COLUMNAS);
for (let fila = 0; fila < FILAS; fila++) {
  for (let columna = 0; columna < COLUMNAS; columna++) {
    salaLlena[fila][columna] = 1;
  }
}
const parSalaLlena = buscarAsientosContiguos(salaLlena);
mostrarResultadoContiguos(parSalaLlena);
console.log("Comprobaciones:");
comprobar("sala llena → null", parSalaLlena, null);
comprobar("sala vacía (0 filas) → null", buscarAsientosContiguos([]), null);
