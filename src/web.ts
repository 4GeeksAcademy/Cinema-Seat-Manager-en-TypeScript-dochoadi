/**
 * Interfaz web de taquilla (Entrega 2, opcional, fuera de evaluación).
 *
 * Toda la lógica de la sala vive en `src/cinema.ts`; este fichero solo
 * pinta la matriz y conecta los controles. El estado de la página es:
 *   - `sala`: la matriz `number[][]` (0 libre, 1 ocupado);
 *   - `parResaltado`: el par propuesto `[[f, c], [f, c + 1]]` o `null`;
 *   - `historial`: pila `[[fila, columna], ...]` de reservas para deshacer.
 *
 * Los datos de la película (inventada) llegan de `src/pelicula.json`, la
 * única estructura de datos fuera de la matriz; aquí no hay literales `{…}`.
 *
 * No usa APIs de Node (`process`, `fs`…): se ejecuta en el navegador.
 */
import "./style.css";
import pelicula from "./pelicula.json";
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

/** Estado visual de una butaca. */
type EstadoButaca = "libre" | "ocupado" | "propuesto";

/** Espacio de nombres de los elementos SVG. */
const ESPACIO_SVG = "http://www.w3.org/2000/svg";

/** Clave de localStorage donde se guarda la matriz en JSON. */
const CLAVE_ALMACENAMIENTO = "cinema-seat-manager:sala";

/** Número máximo de entradas visibles en el registro de operaciones. */
const MAXIMO_REGISTRO = 10;

/** Clases comunes a todos los botones de butaca. */
const CLASES_BOTON_BUTACA =
  "block aspect-square w-full min-w-10 rounded-md " +
  "focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-600 " +
  "dark:focus-visible:outline-sky-400";

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
 * Devuelve el id del botón de una butaca.
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
// Cartelera (película inventada, solo presentación)
// ---------------------------------------------------------------------------

/**
 * Genera el marcado SVG del cartel (composición original: cielo nocturno,
 * sol eclipsado y siluetas de butacas). El texto se rellena después con
 * `textContent` desde `pelicula.json`.
 *
 * @param prefijo - Prefijo para los ids de los degradados (único por cartel).
 * @returns Marcado SVG del cartel en formato 2:3.
 */
function marcadoCartel(prefijo: string): string {
  let estrellas = "";
  const posicionesEstrellas: number[][] = [
    [22, 84], [41, 112], [168, 92], [180, 140], [30, 160], [150, 70],
    [58, 74], [184, 186], [14, 196], [132, 176], [76, 182], [118, 66],
  ];
  for (let indice = 0; indice < posicionesEstrellas.length; indice++) {
    const radio = indice % 3 === 0 ? 1.3 : 0.8;
    estrellas +=
      `<circle cx="${posicionesEstrellas[indice][0]}" cy="${posicionesEstrellas[indice][1]}" ` +
      `r="${radio}" fill="#e0e7ff" fill-opacity="0.75"/>`;
  }

  let butacasFondo = "";
  for (let indice = 0; indice < 7; indice++) {
    butacasFondo += `<use href="#butaca" x="${indice * 28 + 2}" y="226" width="26" height="26" fill="#14112b"/>`;
  }
  let butacasDelante = "";
  for (let indice = 0; indice < 5; indice++) {
    butacasDelante += `<use href="#butaca" x="${indice * 40 + 2}" y="250" width="38" height="38" fill="#05060f"/>`;
  }

  return (
    `<svg viewBox="0 0 200 300" role="img" class="block h-auto w-full">` +
    `<title data-parte="descripcion"></title>` +
    `<defs>` +
    `<linearGradient id="${prefijo}-cielo" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#050816"/><stop offset="0.5" stop-color="#1e1b4b"/>` +
    `<stop offset="1" stop-color="#4c1d3d"/></linearGradient>` +
    `<radialGradient id="${prefijo}-corona" cx="0.5" cy="0.5" r="0.5">` +
    `<stop offset="0.5" stop-color="#fef3c7" stop-opacity="0.95"/>` +
    `<stop offset="0.66" stop-color="#f59e0b" stop-opacity="0.6"/>` +
    `<stop offset="1" stop-color="#f59e0b" stop-opacity="0"/></radialGradient>` +
    `</defs>` +
    `<rect width="200" height="300" fill="url(#${prefijo}-cielo)"/>` +
    estrellas +
    `<circle cx="100" cy="140" r="64" fill="url(#${prefijo}-corona)"/>` +
    `<circle cx="104" cy="136" r="34" fill="#05060f"/>` +
    `<circle cx="104" cy="136" r="34" fill="none" stroke="#fcd34d" stroke-opacity="0.4" stroke-width="0.8"/>` +
    butacasFondo +
    butacasDelante +
    `<text data-parte="titulo-1" x="100" y="40" text-anchor="middle" fill="#fef3c7" ` +
    `font-family="system-ui, sans-serif" font-size="27" font-weight="800" letter-spacing="3"></text>` +
    `<text data-parte="titulo-2" x="100" y="58" text-anchor="middle" fill="#fcd34d" ` +
    `font-family="system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="4"></text>` +
    `<rect x="160" y="10" width="30" height="17" rx="3" fill="#05060f" fill-opacity="0.6" stroke="#fef3c7" stroke-width="1"/>` +
    `<text data-parte="calificacion" x="175" y="22.5" text-anchor="middle" fill="#fef3c7" ` +
    `font-family="system-ui, sans-serif" font-size="11" font-weight="700"></text>` +
    `</svg>`
  );
}

/**
 * Inserta un cartel en un contenedor y rellena sus textos desde la película.
 *
 * @param idContenedor - Id del elemento donde va el cartel.
 * @param prefijo - Prefijo único para los ids internos del SVG.
 * @returns Nada; modifica el DOM.
 */
function pintarCartel(idContenedor: string, prefijo: string): void {
  const contenedor = obtenerElemento(idContenedor);
  contenedor.innerHTML = marcadoCartel(prefijo);
  const espacio = pelicula.titulo.indexOf(" ");
  const primeraLinea = espacio === -1 ? pelicula.titulo : pelicula.titulo.slice(0, espacio);
  const segundaLinea = espacio === -1 ? "" : pelicula.titulo.slice(espacio + 1);
  const textos = contenedor.querySelectorAll("[data-parte]");
  for (let indice = 0; indice < textos.length; indice++) {
    const parte = textos[indice].getAttribute("data-parte");
    if (parte === "titulo-1") {
      textos[indice].textContent = primeraLinea.toUpperCase();
    } else if (parte === "titulo-2") {
      textos[indice].textContent = segundaLinea.toUpperCase();
    } else if (parte === "calificacion") {
      textos[indice].textContent = pelicula.calificacion;
    } else if (parte === "descripcion") {
      textos[indice].textContent = `Cartel de «${pelicula.titulo}» (película inventada)`;
    }
  }
}

/**
 * Rellena la cartelera de escritorio y la ficha compacta desde `pelicula.json`.
 *
 * @returns Nada; modifica el DOM.
 */
function pintarCartelera(): void {
  pintarCartel("cartel-grande", "cartel-grande");
  pintarCartel("cartel-compacto", "cartel-compacto");
  obtenerElemento("cartelera-titulo").textContent = pelicula.titulo;
  obtenerElemento("cartelera-genero").textContent = pelicula.genero;
  obtenerElemento("cartelera-duracion").textContent = pelicula.duracion;
  obtenerElemento("cartelera-calificacion").textContent = pelicula.calificacion;
  obtenerElemento("cartelera-formato").textContent = pelicula.formato;
  obtenerElemento("cartelera-sesion").textContent = pelicula.sesion;
  obtenerElemento("cartelera-sinopsis").textContent = pelicula.sinopsis;
  obtenerElemento("compacta-titulo").textContent = pelicula.titulo;
  obtenerElemento("compacta-sesion").textContent = `${pelicula.sesion} · ${pelicula.calificacion}`;
}

// ---------------------------------------------------------------------------
// Butacas
// ---------------------------------------------------------------------------

/**
 * Crea el dibujo de una butaca: un `<svg>` con un `<use>` del símbolo
 * `#butaca` y un `<text>` para la marca (× ocupada, ✓ propuesta).
 *
 * @returns El elemento SVG listo para insertar.
 */
function crearDibujoButaca(): SVGSVGElement {
  const dibujo = document.createElementNS(ESPACIO_SVG, "svg");
  dibujo.setAttribute("viewBox", "0 0 40 40");
  dibujo.setAttribute("aria-hidden", "true");
  dibujo.setAttribute("class", "block size-full overflow-visible");
  const silueta = document.createElementNS(ESPACIO_SVG, "use");
  silueta.setAttribute("href", "#butaca");
  const marca = document.createElementNS(ESPACIO_SVG, "text");
  marca.setAttribute("x", "20");
  marca.setAttribute("y", "17.5");
  marca.setAttribute("text-anchor", "middle");
  marca.setAttribute("dominant-baseline", "central");
  marca.setAttribute("font-size", "17");
  marca.setAttribute("font-weight", "900");
  marca.setAttribute("font-family", "system-ui, sans-serif");
  dibujo.append(silueta, marca);
  return dibujo;
}

/**
 * Aplica a un dibujo de butaca los colores y la marca de su estado.
 * El estado no se comunica solo con color: libre sin marca, ocupada con ×
 * y propuesta con ✓ y contorno grueso.
 *
 * @param dibujo - SVG creado con `crearDibujoButaca`.
 * @param estado - Estado de la butaca.
 * @returns Nada; modifica el SVG.
 */
function aplicarEstadoButaca(dibujo: SVGSVGElement, estado: EstadoButaca): void {
  const silueta = dibujo.querySelector("use");
  const marca = dibujo.querySelector("text");
  if (silueta === null || marca === null) {
    return;
  }
  if (estado === "ocupado") {
    silueta.setAttribute("class", "fill-slate-600 stroke-slate-700 stroke-[1.5] dark:fill-slate-700 dark:stroke-slate-500");
    marca.setAttribute("class", "fill-white dark:fill-slate-100");
    marca.textContent = "×";
  } else if (estado === "propuesto") {
    silueta.setAttribute("class", "fill-amber-300 stroke-amber-800 stroke-[3.5] dark:fill-amber-400 dark:stroke-amber-100");
    marca.setAttribute("class", "fill-slate-900");
    marca.textContent = "✓";
  } else {
    silueta.setAttribute("class", "fill-white stroke-slate-600 stroke-[1.5] dark:fill-slate-200 dark:stroke-slate-400");
    marca.setAttribute("class", "");
    marca.textContent = "";
  }
}

/**
 * Pinta la pantalla curva (arco con brillo suave) sobre las columnas de
 * butacas.
 *
 * @returns Elemento que ocupa las 10 columnas de butacas.
 */
function crearPantalla(): HTMLDivElement {
  const pantalla = document.createElement("div");
  pantalla.setAttribute("aria-hidden", "true");
  pantalla.className = "col-span-10 col-start-2 mb-3";
  pantalla.innerHTML =
    `<svg viewBox="0 0 400 48" class="block h-auto w-full">` +
    `<defs><linearGradient id="brillo-pantalla" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#38bdf8" stop-opacity="0.45"/>` +
    `<stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient></defs>` +
    `<path d="M8 30 Q200 -2 392 30 L372 44 Q200 18 28 44 Z" fill="url(#brillo-pantalla)"/>` +
    `<path d="M8 30 Q200 -2 392 30" fill="none" stroke-width="4" stroke-linecap="round" ` +
    `class="stroke-sky-700 dark:stroke-sky-300"/>` +
    `<text x="200" y="38" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="8" ` +
    `font-family="system-ui, sans-serif" class="fill-slate-700 dark:fill-slate-300">PANTALLA</text>` +
    `</svg>`;
  return pantalla;
}

/**
 * Crea la leyenda con las tres butacas reales.
 *
 * @returns Nada; rellena `#leyenda`.
 */
function construirLeyenda(): void {
  const leyenda = obtenerElemento<HTMLUListElement>("leyenda");
  const estados: EstadoButaca[] = ["libre", "ocupado", "propuesto"];
  const textos: string[] = ["Libre", "Ocupada (×)", "Propuesta (✓)"];
  for (let indice = 0; indice < estados.length; indice++) {
    const elemento = document.createElement("li");
    elemento.className = "flex items-center gap-2";
    const contenedorDibujo = document.createElement("span");
    contenedorDibujo.className = "size-7";
    const dibujo = crearDibujoButaca();
    aplicarEstadoButaca(dibujo, estados[indice]);
    contenedorDibujo.append(dibujo);
    elemento.append(contenedorDibujo, textos[indice]);
    leyenda.append(elemento);
  }
}

// ---------------------------------------------------------------------------
// Mapa
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
 * Crea una vez la cuadrícula: pantalla curva, números de columna, números
 * de fila y un botón por butaca con sus eventos de clic y teclado. No hay
 * pasillos: la sala visual coincide columna a columna con la matriz.
 *
 * @returns Nada; rellena `#mapa`.
 */
function construirMapa(): void {
  const mapa = obtenerElemento<HTMLDivElement>("mapa");
  mapa.className = "grid grid-cols-[1.75rem_repeat(10,minmax(2.5rem,1fr))] items-center gap-1 sm:gap-1.5";

  mapa.append(crearPantalla());

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
    etiquetaFila.className = "text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300";
    etiquetaFila.textContent = `F${fila}`;
    mapa.append(etiquetaFila);

    for (let columna = 0; columna < COLUMNAS; columna++) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.id = idAsiento(fila, columna);
      boton.append(crearDibujoButaca());
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
      let estado: EstadoButaca;
      if (sala[fila][columna] === 1) {
        estado = "ocupado";
        boton.className = CLASES_BOTON_BUTACA + " cursor-not-allowed";
      } else if (esPropuesto(fila, columna)) {
        estado = "propuesto";
        boton.className = CLASES_BOTON_BUTACA + " cursor-pointer";
      } else {
        estado = "libre";
        boton.className =
          CLASES_BOTON_BUTACA +
          " cursor-pointer transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0";
      }
      const dibujo = boton.querySelector("svg");
      if (dibujo !== null) {
        aplicarEstadoButaca(dibujo, estado);
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
 * Clic (o Enter / Espacio) sobre una butaca del mapa.
 * Si está ocupada, `reservarAsiento` devuelve el aviso y no cambia nada.
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
 * Mueve el foco entre butacas con las flechas del teclado.
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
 * foco en su primera butaca; si no hay par, muestra el aviso.
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
 * "Reservar par": reserva las dos butacas resaltadas con `reservarAsiento`.
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
  if (!window.confirm("¿Empezar una nueva sesión? Se liberarán todas las butacas.")) {
    return;
  }
  sala = crearSala(FILAS, COLUMNAS);
  parResaltado = null;
  historial = [];
  guardarSala();
  anotar("🆕 Nueva sesión: todas las butacas libres");
  pintar();
}

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------

pintarCartelera();
construirMapa();
construirLeyenda();
obtenerElemento("boton-buscar-par").addEventListener("click", buscarPar);
obtenerElemento("boton-reservar-par").addEventListener("click", reservarPar);
obtenerElemento("boton-deshacer").addEventListener("click", deshacer);
obtenerElemento("boton-nueva-sesion").addEventListener("click", nuevaSesion);
obtenerElemento<HTMLFormElement>("formulario-rapido").addEventListener("submit", reservaRapida);
pintar();
