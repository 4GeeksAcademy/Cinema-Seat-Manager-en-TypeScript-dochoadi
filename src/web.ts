/**
 * Interfaz web de taquilla (Entrega 2, opcional, fuera de evaluación).
 *
 * Toda la lógica de la sala vive en `src/cinema.ts`; este fichero solo
 * pinta la matriz y conecta los controles. El estado de la página es:
 *   - `sala`: la matriz `number[][]` (0 libre, 1 ocupado);
 *   - `parResaltado`: el par propuesto `[[f, c], [f, c + 1]]` o `null`;
 *   - `historial`: pila `[[fila, columna], ...]` de reservas para deshacer.
 *
 * No usa APIs de Node (`process`, `fs`…): se ejecuta en el navegador.
 */
import "./style.css";
import {
  COLUMNAS,
  FILAS,
  type SalaMatriz,
  buscarAsientosContiguos,
  contarAsientos,
  crearSala,
  liberarAsiento,
  mensajeResultadoContiguos,
  reservarAsiento,
} from "./cinema";

/** Clave de localStorage donde se guarda la matriz en JSON. */
const CLAVE_ALMACENAMIENTO = "cinema-seat-manager:sala";

/** Número máximo de entradas visibles en el registro de operaciones. */
const MAXIMO_REGISTRO = 10;

/** Clases comunes a todos los asientos. */
const CLASES_ASIENTO =
  "grid size-11 place-items-center rounded-md font-mono text-sm font-bold " +
  "focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-600 " +
  "dark:focus-visible:outline-sky-400";

/** Clases de un asiento libre. */
const CLASES_LIBRE =
  " border border-slate-500 bg-white text-slate-900 hover:bg-sky-50 " +
  "dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700";

/** Clases de un asiento ocupado. */
const CLASES_OCUPADO =
  " bg-slate-800 text-white cursor-not-allowed dark:bg-slate-200 dark:text-slate-900";

/** Clases de un asiento propuesto (par resaltado): borde grueso. */
const CLASES_PROPUESTO =
  " border-4 border-amber-600 bg-amber-100 text-slate-900 " +
  "dark:border-amber-400 dark:bg-amber-950 dark:text-amber-50";

// ---------------------------------------------------------------------------
// Estado (solo arreglos)
// ---------------------------------------------------------------------------

let sala: SalaMatriz = cargarSala();
let parResaltado: number[][] | null = null;
let historial: number[][] = [];

// ---------------------------------------------------------------------------
// Utilidades de DOM
// ---------------------------------------------------------------------------

/**
 * Obtiene un elemento del documento por su id o lanza un error claro.
 *
 * @param id - Atributo id del elemento.
 * @returns El elemento encontrado.
 */
function obtenerElemento<Tipo extends HTMLElement>(id: string): Tipo {
  const elemento = document.getElementById(id);
  if (elemento === null) {
    throw new Error(`Falta el elemento #${id} en index.html`);
  }
  return elemento as Tipo;
}

/**
 * Devuelve el id del botón de un asiento.
 *
 * @param fila - Índice de fila.
 * @param columna - Índice de columna.
 * @returns Id con el formato `asiento-F-C`.
 */
function idAsiento(fila: number, columna: number): string {
  return `asiento-${fila}-${columna}`;
}

/**
 * Lee un campo numérico del formulario; un campo vacío devuelve `NaN`.
 *
 * @param campo - Campo de entrada.
 * @returns El número escrito o `NaN` si está vacío o no es numérico.
 */
function leerNumero(campo: HTMLInputElement): number {
  const texto = campo.value.trim();
  if (texto === "") {
    return Number.NaN;
  }
  return Number(texto);
}

// ---------------------------------------------------------------------------
// Persistencia
// ---------------------------------------------------------------------------

/**
 * Comprueba que un valor leído de JSON sea una sala 8x10 de ceros y unos.
 *
 * @param valor - Valor desconocido (resultado de `JSON.parse`).
 * @returns `true` si es una matriz válida de `FILAS x COLUMNAS` con 0/1.
 */
function esSalaValida(valor: unknown): valor is SalaMatriz {
  if (!Array.isArray(valor) || valor.length !== FILAS) {
    return false;
  }
  for (let fila = 0; fila < FILAS; fila++) {
    const asientosDeLaFila: unknown = valor[fila];
    if (!Array.isArray(asientosDeLaFila) || asientosDeLaFila.length !== COLUMNAS) {
      return false;
    }
    for (let columna = 0; columna < COLUMNAS; columna++) {
      const asiento: unknown = asientosDeLaFila[columna];
      if (asiento !== 0 && asiento !== 1) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Recupera la sala guardada en localStorage. Si no existe, no se puede leer
 * o no es una sala 8x10 válida, devuelve una sala vacía.
 *
 * @returns La matriz recuperada o una sala nueva.
 */
function cargarSala(): SalaMatriz {
  try {
    const texto = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (texto !== null) {
      const valor: unknown = JSON.parse(texto);
      if (esSalaValida(valor)) {
        return valor;
      }
    }
  } catch {
    // localStorage bloqueado o JSON corrupto: se empieza con sala vacía.
  }
  return crearSala(FILAS, COLUMNAS);
}

/**
 * Guarda la matriz actual en localStorage como JSON.
 *
 * @returns Nada; los fallos de almacenamiento se ignoran.
 */
function guardarSala(): void {
  try {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(sala));
  } catch {
    // Sin almacenamiento disponible: la sesión sigue funcionando en memoria.
  }
}

// ---------------------------------------------------------------------------
// Pintado
// ---------------------------------------------------------------------------

/**
 * Indica si una posición forma parte del par resaltado.
 *
 * @param fila - Índice de fila.
 * @param columna - Índice de columna.
 * @returns `true` si la posición está en `parResaltado`.
 */
function esPropuesto(fila: number, columna: number): boolean {
  if (parResaltado === null) {
    return false;
  }
  for (let indice = 0; indice < parResaltado.length; indice++) {
    if (parResaltado[indice][0] === fila && parResaltado[indice][1] === columna) {
      return true;
    }
  }
  return false;
}

/**
 * Crea una vez la cuadrícula: cabecera de columnas, etiquetas de fila y un
 * botón por asiento con sus eventos de clic y teclado.
 *
 * @returns Nada; rellena `#mapa`.
 */
function construirMapa(): void {
  const mapa = obtenerElemento<HTMLDivElement>("mapa");
  mapa.className = "grid gap-1.5 grid-cols-[2.5rem_repeat(10,2.75rem)]";

  // Esquina vacía + números de columna.
  const esquina = document.createElement("span");
  esquina.setAttribute("aria-hidden", "true");
  mapa.append(esquina);
  for (let columna = 0; columna < COLUMNAS; columna++) {
    const cabecera = document.createElement("span");
    cabecera.setAttribute("aria-hidden", "true");
    cabecera.className = "text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300";
    cabecera.textContent = String(columna);
    mapa.append(cabecera);
  }

  for (let fila = 0; fila < FILAS; fila++) {
    const etiquetaFila = document.createElement("span");
    etiquetaFila.setAttribute("aria-hidden", "true");
    etiquetaFila.className =
      "grid place-items-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300";
    etiquetaFila.textContent = `F${fila}`;
    mapa.append(etiquetaFila);

    for (let columna = 0; columna < COLUMNAS; columna++) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.id = idAsiento(fila, columna);
      boton.addEventListener("click", () => reservarDesdeMapa(fila, columna));
      boton.addEventListener("keydown", (evento) => moverFoco(evento, fila, columna));
      mapa.append(boton);
    }
  }
}

/**
 * Actualiza el mapa, los contadores y los botones a partir del estado.
 *
 * @returns Nada; modifica el DOM.
 */
function pintar(): void {
  for (let fila = 0; fila < FILAS; fila++) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      const boton = obtenerElemento<HTMLButtonElement>(idAsiento(fila, columna));
      let estado: string;
      if (sala[fila][columna] === 1) {
        estado = "ocupado";
        boton.textContent = "X";
        boton.className = CLASES_ASIENTO + CLASES_OCUPADO;
      } else if (esPropuesto(fila, columna)) {
        estado = "propuesto";
        boton.textContent = "L";
        boton.className = CLASES_ASIENTO + CLASES_PROPUESTO;
      } else {
        estado = "libre";
        boton.textContent = "L";
        boton.className = CLASES_ASIENTO + CLASES_LIBRE;
      }
      boton.setAttribute("aria-label", `Fila ${fila}, asiento ${columna}, ${estado}`);
    }
  }

  const [ocupados, disponibles] = contarAsientos(sala);
  const porcentaje = Math.round((ocupados / (ocupados + disponibles)) * 100);
  obtenerElemento("contador-ocupados").textContent = String(ocupados);
  obtenerElemento("contador-disponibles").textContent = String(disponibles);
  obtenerElemento("contador-porcentaje").textContent = `${porcentaje} %`;
  obtenerElemento("barra-ocupacion").style.width = `${porcentaje}%`;

  obtenerElemento<HTMLButtonElement>("boton-reservar-par").disabled = parResaltado === null;
  obtenerElemento<HTMLButtonElement>("boton-deshacer").disabled = historial.length === 0;
}

/**
 * Muestra un mensaje en el panel y lo añade al registro con la hora.
 * El registro conserva solo las últimas `MAXIMO_REGISTRO` entradas.
 *
 * @param mensaje - Texto devuelto por una función de `cinema.ts`.
 * @returns Nada; modifica el DOM.
 */
function anotar(mensaje: string): void {
  obtenerElemento("mensaje").textContent = mensaje;

  const registro = obtenerElemento<HTMLOListElement>("registro");
  const entrada = document.createElement("li");
  entrada.className = "rounded bg-slate-100 px-2 py-1 dark:bg-slate-800";
  const hora = document.createElement("time");
  hora.className = "mr-2 text-slate-600 dark:text-slate-400";
  hora.textContent = new Date().toLocaleTimeString("es-ES");
  entrada.append(hora, mensaje);
  registro.prepend(entrada);
  while (registro.children.length > MAXIMO_REGISTRO) {
    registro.lastElementChild?.remove();
  }
}

// ---------------------------------------------------------------------------
// Operaciones de taquilla
// ---------------------------------------------------------------------------

/**
 * Reserva un asiento con `reservarAsiento` y, si se ha ocupado, lo apila en
 * el historial. El éxito se detecta con `contarAsientos` (sin duplicar
 * la validación).
 *
 * @param fila - Índice de fila.
 * @param columna - Índice de columna.
 * @returns Mensaje devuelto por `reservarAsiento`.
 */
function reservarYRegistrar(fila: number, columna: number): string {
  const ocupadosAntes = contarAsientos(sala)[0];
  const mensaje = reservarAsiento(sala, fila, columna);
  if (contarAsientos(sala)[0] > ocupadosAntes) {
    historial.push([fila, columna]);
  }
  anotar(mensaje);
  return mensaje;
}

/**
 * Clic (o Enter / Espacio) sobre un asiento del mapa.
 * Si está ocupado, `reservarAsiento` devuelve el aviso y no cambia nada.
 *
 * @param fila - Índice de fila.
 * @param columna - Índice de columna.
 * @returns Nada.
 */
function reservarDesdeMapa(fila: number, columna: number): void {
  reservarYRegistrar(fila, columna);
  if (esPropuesto(fila, columna)) {
    parResaltado = null;
  }
  guardarSala();
  pintar();
}

/**
 * Mueve el foco entre asientos con las flechas del teclado.
 *
 * @param evento - Evento de teclado del botón con foco.
 * @param fila - Fila del botón con foco.
 * @param columna - Columna del botón con foco.
 * @returns Nada.
 */
function moverFoco(evento: KeyboardEvent, fila: number, columna: number): void {
  let nuevaFila = fila;
  let nuevaColumna = columna;
  if (evento.key === "ArrowUp") {
    nuevaFila = Math.max(fila - 1, 0);
  } else if (evento.key === "ArrowDown") {
    nuevaFila = Math.min(fila + 1, FILAS - 1);
  } else if (evento.key === "ArrowLeft") {
    nuevaColumna = Math.max(columna - 1, 0);
  } else if (evento.key === "ArrowRight") {
    nuevaColumna = Math.min(columna + 1, COLUMNAS - 1);
  } else {
    return;
  }
  evento.preventDefault();
  obtenerElemento(idAsiento(nuevaFila, nuevaColumna)).focus();
}

/**
 * "Buscar 2 juntos": resalta el par de `buscarAsientosContiguos` y pone el
 * foco en su primer asiento; si no hay par, muestra el aviso.
 *
 * @returns Nada.
 */
function buscarPar(): void {
  parResaltado = buscarAsientosContiguos(sala);
  anotar(mensajeResultadoContiguos(parResaltado, sala));
  pintar();
  if (parResaltado !== null) {
    obtenerElemento(idAsiento(parResaltado[0][0], parResaltado[0][1])).focus();
  }
}

/**
 * "Reservar par": reserva los dos asientos resaltados con `reservarAsiento`.
 *
 * @returns Nada.
 */
function reservarPar(): void {
  if (parResaltado === null) {
    return;
  }
  const par = parResaltado;
  parResaltado = null;
  for (let indice = 0; indice < par.length; indice++) {
    reservarYRegistrar(par[indice][0], par[indice][1]);
  }
  guardarSala();
  pintar();
}

/**
 * Reserva rápida (teléfono) desde los campos Fila / Asiento.
 *
 * @param evento - Evento submit del formulario.
 * @returns Nada.
 */
function reservaRapida(evento: SubmitEvent): void {
  evento.preventDefault();
  const campoFila = obtenerElemento<HTMLInputElement>("campo-fila");
  const campoAsiento = obtenerElemento<HTMLInputElement>("campo-asiento");
  const fila = leerNumero(campoFila);
  const columna = leerNumero(campoAsiento);
  if (Number.isNaN(fila) || Number.isNaN(columna)) {
    anotar("⚠️ Indique fila y asiento.");
    return;
  }
  reservarYRegistrar(fila, columna);
  if (esPropuesto(fila, columna)) {
    parResaltado = null;
  }
  guardarSala();
  pintar();
  campoFila.select();
}

/**
 * "Deshacer última reserva": saca la última posición del historial y la
 * libera con `liberarAsiento`.
 *
 * @returns Nada.
 */
function deshacer(): void {
  const ultima = historial.pop();
  if (ultima === undefined) {
    return;
  }
  anotar(liberarAsiento(sala, ultima[0], ultima[1]));
  parResaltado = null;
  guardarSala();
  pintar();
}

/**
 * "Nueva sesión": tras confirmación, vacía la sala y el historial.
 *
 * @returns Nada.
 */
function nuevaSesion(): void {
  if (!window.confirm("¿Empezar una nueva sesión? Se liberarán todos los asientos.")) {
    return;
  }
  sala = crearSala(FILAS, COLUMNAS);
  parResaltado = null;
  historial = [];
  guardarSala();
  anotar("🆕 Nueva sesión: todos los asientos libres");
  pintar();
}

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------

construirMapa();
obtenerElemento("boton-buscar-par").addEventListener("click", buscarPar);
obtenerElemento("boton-reservar-par").addEventListener("click", reservarPar);
obtenerElemento("boton-deshacer").addEventListener("click", deshacer);
obtenerElemento("boton-nueva-sesion").addEventListener("click", nuevaSesion);
obtenerElemento<HTMLFormElement>("formulario-rapido").addEventListener("submit", reservaRapida);
pintar();
