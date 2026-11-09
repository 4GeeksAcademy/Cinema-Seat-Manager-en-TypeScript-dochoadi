# CONTEXT — Cinema Seat Manager en TypeScript

> Documento de referencia del proyecto (4Geeks Academy). Cualquier cambio de código, tests o documentación debe respetar lo descrito aquí.

## 1. Problema de negocio

Un cine independiente gestiona las reservas de su sala **en papel**. El personal de taquilla:

- tarda en saber qué asientos están libres u ocupados;
- comete errores (dobles reservas, asientos tachados ilegibles);
- tiene dificultades para atender a **parejas o grupos que quieren sentarse juntos**, porque localizar a ojo dos asientos contiguos libres es lento y propenso a confusión.

Objetivo: un **prototipo de línea de comandos** que permita al personal ver el estado de la sala, reservar asientos, contar ocupación y encontrar rápidamente dos asientos contiguos libres.

## 2. Restricciones NO negociables

| # | Restricción |
|---|-------------|
| a | **Prohibido** usar `class`, `interface`, object literals (`{ ... }`) como estructuras de datos, `Map` o `Set`. Los datos de asientos viven **solo** en un arreglo bidimensional `number[][]`. |
| b | Codificación: `0` = libre, `1` = ocupado. Visualización: `"L"` = libre, `"X"` = ocupado. |
| c | Sala fija de **8 filas x 10 columnas**, índices **base 0** (filas 0–7, columnas 0–9). |
| d | Se permiten **alias de tipo** (`type SalaMatriz = number[][]`) y **tuplas** (`[number, number]`). |
| e | Si hicieran falta metadatos de reserva, irían en formato **JSON** (no aplica en el alcance actual). |

> Nota: las llaves `{ }` de bloques de código (funciones, `if`, `for`) obviamente están permitidas; lo prohibido es usarlas para **modelar datos**.

## 3. Contratos de funciones

```ts
type SalaMatriz = number[][];

crearSala(filas: number, columnas: number): SalaMatriz
mostrarSala(sala: SalaMatriz): void
reservarAsiento(sala: SalaMatriz, fila: number, columna: number): string
contarAsientos(sala: SalaMatriz): [number, number]          // [ocupados, disponibles]
buscarAsientosContiguos(sala: SalaMatriz): number[][] | null // [[f, c], [f, c + 1]] o null
```

- `crearSala`: devuelve una matriz `filas x columnas` llena de `0`.
- `mostrarSala`: imprime la sala por consola con `L` / `X` y cabeceras de fila/columna.
- `reservarAsiento`: valida rango y disponibilidad; marca `1` si está libre y devuelve un mensaje legible para taquilla (éxito, ya ocupado o fuera de rango).
- `contarAsientos`: recorre la matriz y devuelve la tupla `[ocupados, disponibles]`.
- `buscarAsientosContiguos`: devuelve el **primer** par horizontal de asientos libres o `null` si no existe.

Funciones de presentación (añadidas en los Prompts 3 y 5):

```ts
mensajeResultadoContiguos(resultado: number[][] | null, sala?: SalaMatriz): string
mostrarResultadoContiguos(resultado: number[][] | null, sala?: SalaMatriz): void
```

Funcionalidad adicional (Entrega 2, rama `interfaz-web`, fuera de evaluación):

```ts
liberarAsiento(sala: SalaMatriz, fila: number, columna: number): string // ↩️ anulada / ⚠️ ya libre / ⚠️ no válida
```

- 💑 con el par encontrado; ⚠️ "Ofrezca asientos separados" si no hay par; ⚠️ "Sala sin asientos: no hay contiguos que buscar." si se pasa una sala sin filas.

## 4. Decisión de diseño: "primer par" contiguo

"Primer par" = recorrido **fila a fila (0 → 7)** y, dentro de cada fila, **columna a columna (0 → 9)**; se devuelve el primer `c` tal que `sala[f][c] === 0 && sala[f][c + 1] === 0`.

La imagen del enunciado resalta el par **(3,2)-(3,3)**, pero con ese recorrido el primer par real de la sala de ejemplo es **(0,2)-(0,3)**. **Se sigue el texto del enunciado**, no la imagen. Registrado como `ERR-000` en [ERRORES.md](ERRORES.md).

## 5. Estructura de ficheros

| Fichero | Rol |
|---------|-----|
| `src/cinema.ts` | Lógica: tipo `SalaMatriz` y las 5 funciones del contrato. |
| `src/main.ts` | Escenarios de prueba por consola (punto de entrada CLI). |
| `src/web.ts` | Solo para el reto web opcional (Vite). |
| `src/pelicula.json` | Rama `interfaz-web`: datos de presentación de la película inventada (ver §7). |
| `index.html`, `vite.config.ts`, `src/style.css`, `src/vite-env.d.ts` | Infraestructura del reto web opcional. |
| `CONTEXT.md`, `CLAUDE.md`, `.claude/skills/cinema-seat-manager/SKILL.md` | Contexto y reglas de trabajo. |
| `SEGUIMIENTO.md`, `ERRORES.md`, `EVALUACION.md` | Trazabilidad del desarrollo y de la evaluación. |

## 6. Comandos

```bash
npm run console    # ejecuta src/main.ts con tsx
npm run test       # ejecuta los escenarios de prueba (tsx src/main.ts)
npm run typecheck  # tsc --noEmit
```

## 7. Datos adicionales en JSON (solo rama `interfaz-web`)

- `src/pelicula.json` guarda los datos de **presentación** de una película **inventada** (*Eclipse en la Sala 8*): título, género, duración, calificación, formato, sesión y sinopsis. Aplica la restricción (e): los datos adicionales van en JSON. Es la **única** estructura de datos fuera de la matriz; `src/web.ts` la importa y no contiene literales `{…}`.
- Para importarlo, `tsconfig.json` activa `"resolveJsonModule": true` **solo en esta rama**.
- Una única sesión: no hay selector de fecha ni de horario (varias sesiones exigirían varias matrices).
