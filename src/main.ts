/**
 * Demo mínima temporal (Prompt 2). Se sustituirá por los escenarios de
 * prueba completos en prompts posteriores.
 */
import { COLUMNAS, FILAS, contarAsientos, crearSala, mostrarSala, reservarAsiento } from "./cinema";

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
