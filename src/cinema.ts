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
 * "X" para los ocupados, y una leyenda final. Si la sala está vacía solo
 * muestra un aviso.
 *
 * @param sala - Matriz de asientos a mostrar.
 * @returns Nada; solo escribe en la consola.
 */
export function mostrarSala(sala: SalaMatriz): void {
  if (sala.length === 0) {
    console.log("⚠️ La sala no tiene asientos que mostrar.");
    return;
  }
  const totalFilas = sala.length;
  const totalColumnas = sala[0].length;

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
 * Si la sala está vacía devuelve un aviso sin acceder a la matriz.
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
  if (sala.length === 0) {
    return "⚠️ Sala sin asientos: no se puede reservar.";
  }
  const totalFilas = sala.length;
  const totalColumnas = sala[0].length;

  const filaValida = Number.isInteger(fila) && fila >= 0 && fila < totalFilas;
  const columnaValida = Number.isInteger(columna) && columna >= 0 && columna < totalColumnas;

  if (!filaValida || !columnaValida) {
    return (
      `⚠️ Posición no válida: fila ${fila}, asiento ${columna}. ` +
      `Valores válidos: fila 0–${totalFilas - 1}, asiento 0–${totalColumnas - 1} (números enteros).`
    );
  } else if (sala[fila][columna] === OCUPADO) {
    return `❌ Asiento ocupado: fila ${fila}, asiento ${columna}`;
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

/**
 * Busca el primer par de asientos libres contiguos en horizontal.
 *
 * Recorre las filas de arriba abajo (0 → última) con un bucle `while` que se
 * detiene en cuanto encuentra un par; dentro de cada fila compara cada
 * columna con la siguiente (columna + 1), sin salirse nunca de los límites.
 *
 * @param sala - Matriz de asientos donde buscar.
 * @returns `[[fila, columna], [fila, columna + 1]]` con el primer par libre,
 *   o `null` si no hay ninguno (o la sala está vacía).
 */
export function buscarAsientosContiguos(sala: SalaMatriz): number[][] | null {
  let resultado: number[][] | null = null;
  let encontrado = false;
  let fila = 0;

  while (fila < sala.length && !encontrado) {
    const asientosDeLaFila = sala[fila];
    let columna = 0;
    while (columna + 1 < asientosDeLaFila.length && !encontrado) {
      if (asientosDeLaFila[columna] === LIBRE && asientosDeLaFila[columna + 1] === LIBRE) {
        resultado = [
          [fila, columna],
          [fila, columna + 1],
        ];
        encontrado = true;
      } else {
        columna++;
      }
    }
    fila++;
  }

  return resultado;
}

/**
 * Muestra por consola el resultado de la búsqueda de asientos contiguos
 * con un mensaje pensado para el personal de taquilla.
 *
 * @param resultado - Par devuelto por `buscarAsientosContiguos`, o `null`.
 * @returns Nada; solo escribe en la consola.
 */
export function mostrarResultadoContiguos(resultado: number[][] | null): void {
  if (resultado === null) {
    console.log("⚠️ No hay dos asientos contiguos libres en ninguna fila. Ofrezca asientos separados.");
  } else {
    const [primerAsiento, segundoAsiento] = resultado;
    console.log(
      `💑 Asientos contiguos disponibles: fila ${primerAsiento[0]}, ` +
        `asientos ${primerAsiento[1]} y ${segundoAsiento[1]}`,
    );
  }
}
