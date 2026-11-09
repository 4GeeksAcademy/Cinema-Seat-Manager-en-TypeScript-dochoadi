# EVALUACIÓN — Trazabilidad de criterios

Estados posibles: `Pendiente` · `En progreso` · `Parcial` · `Cumplido`.

## Criterios oficiales de evaluación

| # | Criterio (literal) | Cómo se cumple | Dónde (fichero:función) | Evidencia (comando/salida) | Estado |
|---|--------------------|----------------|-------------------------|----------------------------|--------|
| 1 | Uso correcto de un arreglo bidimensional (matriz) para representar los asientos del cine. | `type SalaMatriz = number[][]`; los asientos solo viven en `sala[fila][columna]` con 0/1. Sin clases, interfaces, objetos, Map ni Set. | `src/cinema.ts:SalaMatriz`, `src/cinema.ts:crearSala` | `npm run test` → cuadrícula 8x10; grep anti-objetos vacío (Prompt 2) | Cumplido |
| 2 | Implementación adecuada de funciones con parámetros y valores de retorno. | Cuatro funciones exportadas con parámetros tipados y retorno según contrato: `SalaMatriz`, `void`, `string`, tupla `[number, number]`. JSDoc en español. | `src/cinema.ts:crearSala`, `mostrarSala`, `reservarAsiento`, `contarAsientos` | `npm run typecheck` exit 0 (Prompt 2) | Cumplido |
| 3 | Uso correcto de sentencias condicionales (if, else) para validar la disponibilidad de los asientos. | `if / else if / else` en orden: rango/enteros → ocupado → reservar. También `if/else` para L/X y para contar. | `src/cinema.ts:reservarAsiento` (L122-131), `mostrarSala` (L87), `contarAsientos` (L148) | `npm run test` → ✅ (2,3), ❌ (2,3), ⚠️ (9,0) (Prompt 2) | Cumplido |
| 4 | Uso correcto de bucles (for, while) para procesar y mostrar la matriz de asientos. | `for` anidados para crear, mostrar y contar la matriz. Falta un `while` (llega en el Prompt 3). | `src/cinema.ts:crearSala` (L36-38), `mostrarSala` (L77-85), `contarAsientos` (L146-147) | `npm run test` → cuadrícula y conteo correctos (Prompt 2) | Parcial |
| 5 | Que la función de búsqueda identifique correctamente asientos contiguos libres de forma horizontal. | | | | Pendiente |
| 6 | Que el código sea legible, con nombres de variables y funciones significativos. | Nombres en español y descriptivos (`asientosDeLaFila`, `totalColumnas`, `filaValida`, `LIBRE`/`OCUPADO`), JSDoc en cada función. | `src/cinema.ts`, `src/main.ts` | Revisión de código (Prompt 2) | Cumplido |
| 7 | Que el programa se ejecute sin errores y produzca la salida esperada al probarlo. | | | | Pendiente |
| 8 | Que la salida por consola sea clara y útil para el personal del cine que vaya a usar el sistema. | | | | Pendiente |

## Requisitos funcionales del enunciado

| # | Bloque | Requisito | Cómo se cumple | Dónde (fichero:función) | Evidencia (comando/salida) | Estado |
|---|--------|-----------|----------------|-------------------------|----------------------------|--------|
| F1 | Funcionalidad principal | Crear la sala como matriz 8x10 inicializada a 0 (libre). | Bucles `for` anidados rellenan con 0; `FILAS = 8`, `COLUMNAS = 10`. | `src/cinema.ts:crearSala` | `npm run test` → sala inicial toda `L` (Prompt 2) | Cumplido |
| F2 | Funcionalidad principal | Mostrar la sala por consola con `L` (libre) y `X` (ocupado). | Pantalla arriba, cabecera de columnas alineada, `Fila N │` a la izquierda, leyenda final. | `src/cinema.ts:mostrarSala` | `npm run test` → `Fila 2 │  L  L  L  X ...` (Prompt 2) | Cumplido |
| F3 | Funcionalidad principal | Reservar un asiento validando rango y disponibilidad; devolver mensaje. | Valida enteros y rango, luego ocupación; marca 1 y devuelve mensaje con ✅ / ❌ / ⚠️ y rango válido. | `src/cinema.ts:reservarAsiento` | `npm run test` → 3 mensajes esperados (Prompt 2) | Cumplido |
| F4 | Funcionalidad principal | Contar asientos ocupados y disponibles (`[ocupados, disponibles]`). | Recorre la matriz con `for` anidados y devuelve la tupla. | `src/cinema.ts:contarAsientos` | `npm run test` → `Ocupados: 1 · Disponibles: 79 · Total: 80` (Prompt 2) | Cumplido |
| F5 | Funcionalidad avanzada | Buscar el primer par de asientos contiguos libres en horizontal (`[[f,c],[f,c+1]]` o `null`). | | `src/cinema.ts:buscarAsientosContiguos` | | Pendiente |
| F6 | Pruebas | Escenarios que ejercitan todas las funciones (reserva OK, asiento ocupado, fuera de rango, conteo, contiguos encontrado / no encontrado). | | `src/main.ts` | | Pendiente |
| F7 | Salida por consola | Mensajes claros y útiles para taquilla en cada operación. | | `src/main.ts`, `src/cinema.ts` | | Pendiente |
