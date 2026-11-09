# EVALUACIÓN — Trazabilidad de criterios

Este documento evalúa la Entrega 1 (rama main, tag v1.0-base).

Auditoría realizada en el **Prompt 5** desde el punto de vista de un evaluador estricto. Cada fila indica cómo se cumple, dónde (`fichero:función`) y la evidencia (comando + fragmento de salida). Ningún ✅ sin evidencia.

Estados posibles: `⏳ Pendiente` · `🟡 Parcial` · `❌ No cumple` · `✅ Cumplido`.

## Criterios oficiales de evaluación

| # | Criterio (literal) | Cómo se cumple | Dónde (fichero:función) | Evidencia (comando/salida) | Estado |
|---|--------------------|----------------|-------------------------|----------------------------|--------|
| 1 | Uso correcto de un arreglo bidimensional (matriz) para representar los asientos del cine. | `type SalaMatriz = number[][]`; los asientos viven solo en `sala[fila][columna]` con 0 (libre) / 1 (ocupado). Sin clases, interfaces, objetos, `Map`, `Set` ni `this`. | `src/cinema.ts:SalaMatriz`, `src/cinema.ts:crearSala` | `grep -nE "\bclass\b\|\binterface\b\|new Map\|new Set\|\bthis\b" src/` → sin resultados (exit 1). `npm run test` → cuadrícula `Fila 0 │  L  L …` de 8x10 y `Total: 80`. | ✅ Cumplido |
| 2 | Implementación adecuada de funciones con parámetros y valores de retorno. | Funciones exportadas con parámetros tipados y retorno según contrato: `crearSala → SalaMatriz`, `mostrarSala → void`, `reservarAsiento → string`, `contarAsientos → [number, number]`, `buscarAsientosContiguos → number[][] \| null`, más `mensajeResultadoContiguos → string` y `mostrarResultadoContiguos → void`. JSDoc en español en las 14 funciones de `src/`. | `src/cinema.ts:crearSala`, `src/cinema.ts:mostrarSala`, `src/cinema.ts:reservarAsiento`, `src/cinema.ts:contarAsientos`, `src/cinema.ts:buscarAsientosContiguos` | `npm run typecheck` → `tsc --noEmit`, exit 0. `npm run test` → `✔ OK conteo [ocupados, disponibles] → [31,49]` (la tupla devuelta se verifica). | ✅ Cumplido |
| 3 | Uso correcto de sentencias condicionales (if, else) para validar la disponibilidad de los asientos. | `if / else if / else` en orden: sala vacía → posición no válida (enteros y rango) → asiento ocupado → reservar. También `if/else` para pintar L/X, contar, detectar el par libre y elegir el mensaje de contiguos. | `src/cinema.ts:reservarAsiento`, `src/cinema.ts:mostrarSala`, `src/cinema.ts:contarAsientos`, `src/cinema.ts:buscarAsientosContiguos`, `src/cinema.ts:mensajeResultadoContiguos` | `grep -nE "\bif\b\|\belse\b" src/cinema.ts` → 14 líneas, p. ej. `if (!filaValida \|\| !columnaValida) {` / `} else if (sala[fila][columna] === OCUPADO) {` / `} else {`. `npm run test` → `✔ OK mensaje de asiento ocupado → ❌ Asiento ocupado: fila 2, asiento 3`. | ✅ Cumplido |
| 4 | Uso correcto de bucles (for, while) para procesar y mostrar la matriz de asientos. | `for` anidados para crear, mostrar y contar la matriz; `while` anidados con condición de parada `!encontrado` para detenerse en el primer par contiguo. | `for`: `src/cinema.ts:crearSala`, `src/cinema.ts:mostrarSala`, `src/cinema.ts:contarAsientos`. `while`: `src/cinema.ts:buscarAsientosContiguos` | `src/cinema.ts:buscarAsientosContiguos` contiene los dos `while`: `while (fila < sala.length && !encontrado) {` (filas) y `while (columna + 1 < asientosDeLaFila.length && !encontrado) {` (columnas), localizados con `grep -nE "\bwhile\b" src/`. Los `for` anidados están en `src/cinema.ts:crearSala`, `src/cinema.ts:mostrarSala` y `src/cinema.ts:contarAsientos`. `npm run test` → `✔ OK primer par contiguo → [[0,2],[0,3]]` (el `while` se detiene en el primer par). | ✅ Cumplido |
| 5 | Que la función de búsqueda identifique correctamente asientos contiguos libres de forma horizontal. | Recorre fila 0→7 y en cada fila compara `columna` con `columna + 1` (siempre `columna + 1 < longitud`, nunca fuera de rango); devuelve `[[f,c],[f,c+1]]` del primer par o `null`. Verificada en 5 salas distintas. | `src/cinema.ts:buscarAsientosContiguos` | `npm run test` → vacía `✔ OK primer par contiguo → [[0,0],[0,1]]`; enunciado `✔ OK primer par contiguo → [[0,2],[0,3]]` (ver ERR-000); casi llena / llena `✔ OK sin asientos contiguos → null`; taquilla `✔ OK siguiente par contiguo → [[0,2],[0,3]]`; matriz vacía `✔ OK contiguos en matriz vacía → null`. | ✅ Cumplido |
| 6 | Que el código sea legible, con nombres de variables y funciones significativos. | Todo en español y descriptivo (`asientosDeLaFila`, `totalColumnas`, `filaValida`, `conteoCasiLlena`, `LIBRE` / `OCUPADO`); ninguna variable de una letra; JSDoc en español en cada función; constantes `FILAS`, `COLUMNAS` en lugar de números mágicos. | `src/cinema.ts`, `src/main.ts` | Revisión manual (Prompt 5): JSDoc presente en 14/14 funciones; `grep -nE "\b(let\|const\|var)\s+[A-Za-z_]\b" src/*.ts` → sin resultados; listado de identificadores sin nombres en inglés. | ✅ Cumplido |
| 7 | Que el programa se ejecute sin errores y produzca la salida esperada al probarlo. | Guion con 5 escenarios del enunciado + 1 de robustez; `verificar()` compara cada resultado con el esperado y `process.exitCode = 1` si falla alguno. **Prueba de la prueba:** se alteró temporalmente un esperado y el guion lo detectó. | `src/main.ts:verificar`, escenarios 1–5 + EXTRA de `src/main.ts` | `npm run typecheck` → exit 0. `npm run test ; echo "exit: $?"` → `Pruebas superadas: 20/20` / `exit: 0`. Prueba de la prueba (`[31, 49]` → `[30, 50]`, no commiteada): `✘ FALLO  conteo [ocupados, disponibles] → obtenido [31,49], esperado [30,50]` / `Pruebas superadas: 19/20` / `exit: 1`; tras revertir → `Pruebas superadas: 20/20` / `exit: 0`. | ✅ Cumplido |
| 8 | Que la salida por consola sea clara y útil para el personal del cine que vaya a usar el sistema. | Encabezados `=== ESCENARIO N: nombre ===`; sala con pantalla arriba, cabecera de columnas, `Fila N │` y leyenda; conteo `Ocupados · Disponibles · Total`; notación única "fila F, asiento C" en etiquetas y mensajes; mensajes "estado: posición" (✅ / ❌ / ⚠️); 💑 con el par o ⚠️ con recomendación ("Ofrezca asientos separados"), y aviso propio si la sala no tiene asientos. | `src/cinema.ts:mostrarSala`, `src/cinema.ts:reservarAsiento`, `src/cinema.ts:mensajeResultadoContiguos`, `src/main.ts:mostrarConteo`, `src/main.ts:intentarReserva` | `npm run test` → `Reservar fila 2, asiento 3 → ❌ Asiento ocupado: fila 2, asiento 3`; `💑 Asientos contiguos disponibles: fila 0, asientos 2 y 3`; `Ocupados: 74 · Disponibles: 6 · Total: 80`; `⚠️ Sala sin asientos: no hay contiguos que buscar.` | ✅ Cumplido |

## Requisitos funcionales del enunciado

| # | Bloque | Requisito | Cómo se cumple | Dónde (fichero:función) | Evidencia (comando/salida) | Estado |
|---|--------|-----------|----------------|-------------------------|----------------------------|--------|
| F1 | Funcionalidad principal | Crear la sala como matriz 8x10 inicializada a 0 (libre). | Bucles `for` anidados rellenan con 0; `FILAS = 8`, `COLUMNAS = 10`. | `src/cinema.ts:crearSala` | `npm run test` → escenario 1: `Ocupados: 0 · Disponibles: 80 · Total: 80` / `✔ OK conteo [ocupados, disponibles] → [0,80]`. | ✅ Cumplido |
| F2 | Funcionalidad principal | Mostrar la sala por consola con `L` (libre) y `X` (ocupado). | Pantalla arriba, cabecera de columnas alineada, `Fila N │` a la izquierda, leyenda `L = libre · X = ocupado`. | `src/cinema.ts:mostrarSala` | `npm run test` → `Fila 2 │  L  L  X  X  X  L  L  L  X  L` (tras reservar 2,3 en la sala del enunciado). | ✅ Cumplido |
| F3 | Funcionalidad principal | Reservar un asiento validando rango y disponibilidad; devolver mensaje. | Valida sala vacía, enteros y rango, luego ocupación; marca 1 y devuelve ✅ / ❌ / ⚠️ con el rango válido. | `src/cinema.ts:reservarAsiento` | `npm run test` → `✔ OK mensaje de reserva correcta`, `✔ OK mensaje de asiento ocupado`, `✔ OK mensaje de posición no válida` (textos exactos, ERR-001). | ✅ Cumplido |
| F4 | Funcionalidad principal | Contar asientos ocupados y disponibles (`[ocupados, disponibles]`). | Recorre la matriz con `for` anidados y devuelve la tupla. | `src/cinema.ts:contarAsientos` | `npm run test` → `[0,80]`, `[31,49]`, `[32,48]`, `[74,6]`, `[75,5]`, `[80,0]`, `[2,78]`, todos `✔ OK`. | ✅ Cumplido |
| F5 | Funcionalidad avanzada | Buscar el primer par de asientos contiguos libres en horizontal (`[[f,c],[f,c+1]]` o `null`). | `while` por filas y columnas con parada en el primer par; sin accesos fuera de rango; matriz vacía → `null`. Presentación con `mensajeResultadoContiguos` / `mostrarResultadoContiguos`. | `src/cinema.ts:buscarAsientosContiguos`, `src/cinema.ts:mensajeResultadoContiguos`, `src/cinema.ts:mostrarResultadoContiguos` | `npm run test` → `💑 Asientos contiguos disponibles: fila 0, asientos 2 y 3`; sala llena → `⚠️ No hay dos asientos contiguos libres en ninguna fila. Ofrezca asientos separados.` | ✅ Cumplido |
| F6 | Pruebas | Escenarios que ejercitan todas las funciones (reserva OK, asiento ocupado, fuera de rango, conteo, contiguos encontrado / no encontrado). | 1 vacía; 2 enunciado + 3 reservas; 3 casi llena (74/6) + venta de un suelto; 4 llena + reserva rechazada; 5 flujo de taquilla; EXTRA matriz vacía. Datos preparados con `llenarSala` / `liberarPosiciones` (bucles). Detección de fallos comprobada. | `src/main.ts` (escenarios 1–5 + EXTRA), `src/main.ts:verificar`, `src/main.ts:llenarSala`, `src/main.ts:liberarPosiciones` | `npm run test ; echo "exit: $?"` → `Pruebas superadas: 20/20` / `exit: 0`; con un esperado alterado → `Pruebas superadas: 19/20` / `exit: 1`. | ✅ Cumplido |
| F7 | Salida por consola | Mensajes claros y útiles para taquilla en cada operación. | Cada escenario muestra encabezado, sala, conteo, búsqueda de contiguos y reservas con etiqueta `Reservar fila F, asiento C →`; resumen final `Pruebas superadas: N/M`. | `src/main.ts:encabezado`, `src/main.ts:intentarReserva`, `src/cinema.ts:mostrarSala`, `src/cinema.ts:reservarAsiento`, `src/cinema.ts:mostrarResultadoContiguos` | `npm run test` → `=== ESCENARIO 5: Flujo real de taquilla (una pareja pide dos asientos juntos) ===` … `Reservar fila 0, asiento 0 → ✅ Reserva confirmada: fila 0, asiento 0` … `Pruebas superadas: 20/20`. | ✅ Cumplido |

## Riesgos conocidos

| Riesgo | Descripción | Mitigación |
|--------|-------------|------------|
| ERR-000 — imagen vs enunciado | La imagen del enunciado resalta el par (3,2)-(3,3), pero el primer par según el texto es (0,2)-(0,3). Un evaluador que compare con la imagen podría esperar la fila 3. | Se sigue el texto; decisión documentada en `CONTEXT.md` §4 y verificada en ERR-000 (`✔ OK primer par contiguo → [[0,2],[0,3]]`). |
| Interfaz web fuera de evaluación | `index.html`, `vite.config.ts`, `src/style.css`, `src/vite-env.d.ts` (y un futuro `src/web.ts`) son solo para el reto opcional; no forman parte de los criterios ni de `npm run test`. | La evaluación se apoya exclusivamente en `npm run typecheck` y `npm run test` (CLI). |
| `npm audit` en dependencias de desarrollo | Antes del fix (Prompt 5): `5 vulnerabilities (1 moderate, 4 high)`. Tras `npm audit fix` sin `--force` (Prompt 6) se actualizaron `nanoid` 3.3.11 → 3.3.20, `postcss` 8.5.6 → 8.5.32 y `source-map-js` 1.2.1 → 1.2.2. **Quedan** `2 vulnerabilities (1 moderate, 1 high)`: `esbuild` (moderate: el servidor de desarrollo acepta peticiones de cualquier web; lectura de ficheros en Windows) y `vite <=6.4.3` (high: avisos propios del servidor de desarrollo —path traversal, `server.fs.deny`/`allow`, `launch-editor` en Windows— más su dependencia de `esbuild`). Ambos solo se arreglan con `npm audit fix --force` (`Will install vite@8.3.7, which is a breaking change`), que no se aplica para no romper `@tailwindcss/vite` ni el reto web. | Todos los avisos pendientes afectan al **servidor de desarrollo** (`vite` / `esbuild serve`). La CLI se ejecuta con `tsx`, que usa su propio `esbuild` 0.27.7 (en el rango afectado) solo para transpilar, sin levantar servidor, así que no está expuesta. No ejecutar `npm run dev` en redes no confiables. |
| `@types/node` visible en todo `src/` | Instalado en el Prompt 4 (ERR-003) para `process.exitCode`; sus tipos son globales, así que `tsc` no avisaría si se usara `process` en código de navegador. | Regla: `src/web.ts` no debe usar `process` ni otras APIs de Node; revisarlo al implementar el reto web. |

## Evaluación final independiente

- **Fecha:** 2026-11-09
- **Commit evaluado:** `3fe046a` (rama `main`).
- **Integridad respecto a `v1.0-base`:** `git diff v1.0-base main -- src/ package.json tsconfig.json` → **vacío**. Lo evaluado coincide con lo etiquetado; los commits posteriores a `v1.0-base` en `main` solo cambian documentación.
- **Método:** un subagente con contexto limpio (Claude Code, tipo `general-purpose`), con instrucciones de evaluador de 4Geeks. No tenía acceso a la conversación de desarrollo y tenía prohibido leer `EVALUACION.md`, `SEGUIMIENTO.md`, `ERRORES.md`, `CONTEXT.md`, `CLAUDE.md` y `.claude/` antes del veredicto. Trabajó sobre un clon limpio en `/tmp/eval-final` (`npm ci`, typecheck, test, build) y con casos propios en `/tmp`, sin tocar el repositorio.
- **Veredicto global:** **APTO**. 8/8 criterios "Cumple" y 8/8 requisitos "Cumple". Sin hallazgos bloqueantes.

### Informe completo del evaluador

#### Informe de evaluación — Cinema Seat Manager en TypeScript (rama `main`, commit 3fe046a)

> No he leído EVALUACION.md, SEGUIMIENTO.md, ERRORES.md, CONTEXT.md, CLAUDE.md ni `.claude/`. Veredicto basado solo en código, README y ejecución.

##### a) Clon limpio y ejecución
- `git clone … /tmp/eval-final && npm ci` → OK (avisa de vulnerabilidades en dependencias de desarrollo, "npm audit fix --force").
- `npm run typecheck` (`tsc --noEmit`) → sin errores.
- `npm run test` (`tsx src/main.ts`) → `Pruebas superadas: 20/20`, **`exit real: 0`** (mi primer `echo $?` cogía el código de `tail`; lo repetí sin tubería).
- `npm run build` → exit 0 también.

##### b) Integridad de la entrega
`git diff --stat v1.0-base main -- src/ package.json tsconfig.json` → **vacío**. Lo evaluado = lo etiquetado en `v1.0-base`.

##### Criterios de evaluación

| # | Criterio | Veredicto | Evidencia | Observaciones |
|---|---|---|---|---|
| 1 | Matriz bidimensional | **Cumple** | `cinema.ts`: `export type SalaMatriz = number[][];` · `crearSala` → `sala.push(asientosDeLaFila)` con dos `for` anidados; caso propio `dims 8 10 [0,80]` | Constantes `LIBRE=0`, `OCUPADO=1`, sin números mágicos. |
| 2 | Funciones con parámetros y retorno | **Cumple** | `reservarAsiento(sala, fila, columna): string`, `contarAsientos(sala): [number, number]`, `buscarAsientosContiguos(sala): number[][] \| null` | Buena separación cálculo (`mensajeResultadoContiguos`) / presentación (`mostrarResultadoContiguos`). |
| 3 | Condicionales para validar | **Cumple** | `reservarAsiento`: `if (!filaValida \|\| !columnaValida) … else if (sala[fila][columna] === OCUPADO) … else { sala[fila][columna] = OCUPADO; …}` | Valida enteros, rango y ocupación. |
| 4 | Bucles para procesar y mostrar | **Cumple** | `for` anidados en `crearSala`, `mostrarSala`, `contarAsientos`; `while` con parada `!encontrado` en `buscarAsientosContiguos` | Correcto y legible. |
| 5 | Búsqueda contiguos horizontales | **Cumple** | `while (columna + 1 < asientosDeLaFila.length …) if (fila[c]===LIBRE && fila[c+1]===LIBRE)`; casos propios: alternos → `null`, (7,8)-(7,9) encontrado, par "entre filas" (2,9)/(3,0) → `null` | Primer par por recorrido fila a fila; sin salirse de límites ni cruzar filas. |
| 6 | Legibilidad y nombres | **Cumple** | Nombres como `asientosDeLaFila`, `filaValida`, `anchoEtiquetaFila`; JSDoc con `@param`/`@returns` en cada función | Cosmético: `main.ts:177` muestra la referencia interna "ERR-001" en la salida. |
| 7 | Ejecución sin errores y salida esperada | **Cumple** | `Pruebas superadas: 20/20`, exit 0; typecheck y build limpios | `main.ts` usa `process.exitCode = 1` si falla alguna prueba: el guion verifica de verdad. |
| 8 | Salida clara para el personal | **Cumple** | Pantalla, cabecera de columnas, `Fila N │ L X …`, leyenda, `Ocupados: 31 · Disponibles: 49 · Total: 80`, `💑 Asientos contiguos disponibles: fila 0, asientos 2 y 3`, `⚠️ … Ofrezca asientos separados.` | Los errores indican los valores válidos. |

##### Requisitos del enunciado

| Requisito | Veredicto | Evidencia |
|---|---|---|
| Inicializar matriz 8x10, ocupado=1 / libre=0 | Cumple | `crearSala(FILAS, COLUMNAS)` con `FILAS = 8`, `COLUMNAS = 10` → `[0,80]` |
| Mostrar sala con X/L e índices | Cumple | `mostrarSala`: cabecera `0 1 … 9` y `Fila 0 │ …` (salida del caso "par final") |
| Reservar (0→1), validar ocupado, mensaje | Cumple | `1a: ✅ Reserva confirmada: fila 4, asiento 4` / `2a: ❌ Asiento ocupado: fila 4, asiento 4` |
| Contar y devolver ocupados/disponibles | Cumple | `contarAsientos` → `[ocupados, disponibles]`; tras 6 intentos inválidos y 1 válido → `[1,79]` (los inválidos no modifican la matriz) |
| Buscar dos contiguos, primero, indicar si no hay | Cumple | `[[f,c],[f,c+1]]` o `null`, mensaje "No hay dos asientos contiguos libres en ninguna fila" |
| Pruebas: vacía, parcial, casi llena con sueltos, llena | Cumple | `main.ts` escenarios 1–4 (+ 5 flujo de taquilla y extra de matriz vacía) |
| Mensajes claros en cada operación | Cumple | ✅ / ❌ / ⚠️ con posición y rango válido |
| Comentarios que expliquen cada función | Cumple | JSDoc en las 7 funciones exportadas y en las auxiliares de `main.ts` |

##### Restricción "sin objetos ni clases"
**Cumple.** Ni `class`, `interface`, `new`, `Map`, `Set` ni literales `{clave: valor}` en `src/cinema.ts` y `src/main.ts` (grep `class |new [A-Z]|interface |\{ *[a-zA-Z]+:` → sin resultados). Asientos solo en `number[][]`; resultados compuestos como tuplas/matrices y `null`. Única desestructuración: de array, en `mensajeResultadoContiguos` (permitida).

##### Casos propios
Script `/tmp/eval-casos/casos.ts` (`npx tsx`, exit 0):

| Caso | Resultado | OK |
|---|---|---|
| Fila negativa (-1,3) | `⚠️ Posición no válida: fila -1, asiento 3. Valores válidos: fila 0–7, asiento 0–9 (números enteros).` | ✔ |
| Decimal (1.5,3) | `⚠️ Posición no válida: fila 1.5 …` | ✔ |
| NaN fila / NaN columna | `⚠️ Posición no válida: fila NaN …` / `… asiento NaN …` | ✔ |
| Infinity | `⚠️ Posición no válida: fila Infinity …` | ✔ |
| Columna 10 | `⚠️ Posición no válida: fila 0, asiento 10 …` | ✔ |
| Reservar dos veces (4,4) | `✅ Reserva confirmada…` y luego `❌ Asiento ocupado: fila 4, asiento 4` | ✔ |
| Fila 0 con libres alternos + par en (3,8)-(3,9) | `[[3,8],[3,9]]`; no propone nada en fila 0 | ✔ |
| Par en última columna posible (8,9) | cubierto por el caso anterior | ✔ |
| Único par al final de la última fila (7,8)-(7,9) | `[[7,8],[7,9]] 💑 … fila 7, asientos 8 y 9` | ✔ |
| Solo libres alternos | `null` + "Ofrezca asientos separados" | ✔ |
| Libres en (2,9) y (3,0), filas distintas | `null`, no los une | ✔ |
| Matriz `[[]]` (fuera de enunciado) | `… asiento 0–-1 …`: mensaje incoherente | menor |

##### Hallazgos por gravedad
**Bloqueantes:** ninguno.

**Mejora:**
1. `npm run dev` / `npm start` en `main` sirven la plantilla residual: `index.html` con título "Hello World with Typescript", que carga `/rigo-baby.jpg` (no existe, no hay `public/`) y ejecuta `src/main.ts` (guion de consola) en el navegador. Dependencias vite/tailwind, `vite.config.ts` y `style.css` están en la entrega de consola sin uso. No afecta a la evaluación, pero confunde.
2. `npm ci` avisa de vulnerabilidades en dependencias de desarrollo.

**Cosmético:**
1. `reservarAsiento` con una sala de filas sin columnas (`[[]]`) da el rango "asiento 0–-1" (robustez fuera del enunciado).
2. `mostrarSala` pinta "L" para cualquier valor distinto de 1 (p. ej. 2); aceptable porque la matriz solo debería contener 0/1.
3. `main.ts:177` imprime una referencia interna ("ERR-001") en la salida para el usuario; el README enlaza documentos de proceso (ERRORES.md, etc.) y ramas/tags web que no forman parte de la entrega.
4. "test" es un guion propio con `tsx`, no un framework de pruebas (válido para el nivel).

##### Veredicto global: **APTO**
Cumple los 8 criterios y todos los requisitos del enunciado; todos los casos límite propios dan el resultado correcto (validación de rango y enteros robusta; búsqueda de contiguos correcta incluso en la última columna y la última fila). Las observaciones son restos de la plantilla web en `main` y detalles menores de salida que no afectan a la funcionalidad evaluada.

### Discrepancias con la autoevaluación

**Criterios con menor nota que la autoevaluación:** ninguno. La autoevaluación marca los 8 criterios como ✅ Cumplido y el evaluador independiente como "Cumple".

| # | Autoevaluación | Evaluación independiente | ¿Discrepancia? |
|---|----------------|--------------------------|----------------|
| 1 | ✅ Cumplido | Cumple | No |
| 2 | ✅ Cumplido | Cumple | No |
| 3 | ✅ Cumplido | Cumple | No |
| 4 | ✅ Cumplido | Cumple | No |
| 5 | ✅ Cumplido | Cumple | No |
| 6 | ✅ Cumplido | Cumple (con una observación cosmética: "ERR-001" en la salida) | No en la nota |
| 7 | ✅ Cumplido | Cumple | No |
| 8 | ✅ Cumplido | Cumple | No |

**Hallazgos que la autoevaluación no recogía:**

1. **(Mejora) Plantilla web residual en `main`.** El riesgo "Interfaz web fuera de evaluación" de la autoevaluación decía que `index.html` y compañía eran "solo para el reto opcional". No detectó que en `main` siguen siendo la plantilla original "Hello World with Typescript": cargan `/rigo-baby.jpg`, borrado en el Prompt 1, y ejecutan `src/main.ts` en el navegador. Comprobado por el autor tras el informe (`grep -n "rigo-baby" index.html` → línea 14; `public/` no existe).
2. **(Cosmético) Robustez con `[[]]`.** Una sala con filas sin columnas produce el rango "asiento 0–-1". La autoevaluación solo había contemplado la sala sin filas (`[]`).
3. **(Cosmético) `mostrarSala` pinta "L" para valores distintos de 0/1.** No se había considerado.
4. **(Cosmético) Referencia interna "ERR-001" en la salida de `main.ts`.** La autoevaluación la citaba como evidencia, no como defecto de presentación.

Los hallazgos de mejora y cosméticos quedan documentados aquí, **sin cambios de código**. Como no hay bloqueantes, no se registra nada en `ERRORES.md` ni hace falta una versión `v1.1-base`.

### Seguimiento de los hallazgos (Prompt 8c)

- **"Restos de la plantilla web en `main`" (mejora) → resuelto en `v1.1-base`.** `index.html` se sustituye por una página mínima con Tailwind ("Cinema Seat Manager · Versión 1 (consola)") que explica que esta versión se usa con `npm run test` y enlaza a las versiones web. No carga ningún script: no importa `src/main.ts` ni `/rigo-baby.jpg` (`vite build` → `dist/index.html` sin `<script>`).
- **El código evaluado no cambia:** `git diff v1.0-base -- src/ package.json tsconfig.json` → **vacío**. `npm run typecheck` → exit 0; `npm run test` → `Pruebas superadas: 20/20`.
- **Hallazgos cosméticos** (rango "0–-1" con `[[]]`, "L" para valores distintos de 0/1, referencia "ERR-001" en la salida): quedan documentados **sin cambios**, para no alterar el código evaluado.
- **Avisos de `npm audit`:** sin cambios; ver "Riesgos conocidos".
- **Tag `v1.1-base`:** pendiente de que el usuario confirme la página en el navegador.

