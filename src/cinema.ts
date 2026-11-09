/**
 * Lógica de la sala de cine.
 *
 * Los asientos viven exclusivamente en un arreglo bidimensional de números:
 *   0 = asiento libre, 1 = asiento ocupado.
 * Índices base 0: sala[fila][columna].
 */

/** Matriz de asientos: sala[fila][columna] con 0 (libre) o 1 (ocupado). */
export type SalaMatriz = number[][];

/** Número de filas de la sala. */
export const FILAS = 8;

/** Número de asientos (columnas) por fila. */
export const COLUMNAS = 10;

/** Valor que representa un asiento libre en la matriz. */
const LIBRE = 0;

/** Valor que representa un asiento ocupado en la matriz. */
const OCUPADO = 1;

/**
 * Crea una sala vacía con todos los asientos libres.
 *
 * Construye la matriz con dos bucles `for` anidados: el exterior crea cada
 * fila y el interior rellena sus asientos con 0.
 *
 * @param filas - Número de filas de la sala.
 * @param columnas - Número de asientos por fila.
 * @returns Una matriz `filas x columnas` llena de 0 (todos libres).
 */
export function crearSala(filas: number, columnas: number): SalaMatriz {
  const sala: SalaMatriz = [];
  for (let fila = 0; fila < filas; fila++) {
    const asientosDeLaFila: number[] = [];
    for (let columna = 0; columna < columnas; columna++) {
      asientosDeLaFila.push(LIBRE);
    }
    sala.push(asientosDeLaFila);
  }
  return sala;
}

/**
 * Muestra la sala por consola en formato de cuadrícula monoespaciada.
 *
 * Imprime la pantalla en la parte superior, una cabecera con los números de
 * columna, cada fila precedida de su número, "L" para los asientos libres y
 * "X" para los ocupados, y una leyenda final.
 *
 * @param sala - Matriz de asientos a mostrar.
 * @returns Nada; solo escribe en la consola.
 */
export function mostrarSala(sala: SalaMatriz): void {
  const totalFilas = sala.length;
  const totalColumnas = totalFilas > 0 ? sala[0].length : 0;

  // Ancho de la etiqueta de fila (ej.: "Fila 7") y de cada celda.
  const anchoEtiquetaFila = `Fila ${totalFilas - 1}`.length;
  const anchoCelda = Math.max(String(totalColumnas - 1).length, 1) + 2;
  const anchoCuadricula = anchoCelda * totalColumnas;
  const sangria = " ".repeat(anchoEtiquetaFila + 2);

  // Pantalla centrada sobre la cuadrícula.
  const textoPantalla = " PANTALLA ";
  const relleno = Math.max(anchoCuadricula - textoPantalla.length, 0);
  const rellenoIzquierdo = Math.floor(relleno / 2);
  const rellenoDerecho = relleno - rellenoIzquierdo;
  console.log("");
  console.log(sangria + "═".repeat(rellenoIzquierdo) + textoPantalla + "═".repeat(rellenoDerecho));
  console.log("");

  // Cabecera con los números de columna.
  let cabecera = sangria;
  for (let columna = 0; columna < totalColumnas; columna++) {
    cabecera += String(columna).padStart(anchoCelda);
  }
  console.log(cabecera);

  // Una línea por fila: etiqueta + estado de cada asiento.
  for (let fila = 0; fila < totalFilas; fila++) {
    let linea = `Fila ${fila}`.padStart(anchoEtiquetaFila) + " │";
    for (let columna = 0; columna < totalColumnas; columna++) {
      let simbolo: string;
      if (sala[fila][columna] === OCUPADO) {
        simbolo = "X";
      } else {
        simbolo = "L";
      }
      linea += simbolo.padStart(anchoCelda);
    }
    console.log(linea);
  }

  console.log("");
  console.log(sangria + "L = libre · X = ocupado");
  console.log(sangria + "▲ La pantalla está en la parte superior (fila 0 = más cerca)");
  console.log("");
}

/**
 * Intenta reservar un asiento concreto de la sala.
 *
 * Valida en este orden: que fila y columna sean enteros dentro de rango y
 * que el asiento esté libre. Si todo es correcto, marca el asiento como
 * ocupado (1) modificando la matriz recibida.
 *
 * @param sala - Matriz de asientos (se modifica si la reserva tiene éxito).
 * @param fila - Índice de fila (base 0).
 * @param columna - Índice de columna / número de asiento (base 0).
 * @returns Mensaje legible para taquilla con el resultado de la operación.
 */
export function reservarAsiento(sala: SalaMatriz, fila: number, columna: number): string {
  const totalFilas = sala.length;
  const totalColumnas = totalFilas > 0 ? sala[0].length : 0;

  const filaValida = Number.isInteger(fila) && fila >= 0 && fila < totalFilas;
  const columnaValida = Number.isInteger(columna) && columna >= 0 && columna < totalColumnas;

  if (!filaValida || !columnaValida) {
    return (
      `⚠️ Asiento (${fila}, ${columna}) no válido. ` +
      `Valores válidos: fila 0–${totalFilas - 1}, asiento 0–${totalColumnas - 1} (números enteros).`
    );
  } else if (sala[fila][columna] === OCUPADO) {
    return `❌ El asiento (${fila}, ${columna}) ya está ocupado`;
  } else {
    sala[fila][columna] = OCUPADO;
    return `✅ Reserva confirmada: fila ${fila}, asiento ${columna}`;
  }
}

/**
 * Cuenta los asientos ocupados y disponibles de la sala.
 *
 * Recorre la matriz completa con dos bucles `for` anidados.
 *
 * @param sala - Matriz de asientos a contar.
 * @returns Tupla `[ocupados, disponibles]`.
 */
export function contarAsientos(sala: SalaMatriz): [number, number] {
  let ocupados = 0;
  let disponibles = 0;
  for (let fila = 0; fila < sala.length; fila++) {
    for (let columna = 0; columna < sala[fila].length; columna++) {
      if (sala[fila][columna] === OCUPADO) {
        ocupados++;
      } else {
        disponibles++;
      }
    }
  }
  return [ocupados, disponibles];
}
