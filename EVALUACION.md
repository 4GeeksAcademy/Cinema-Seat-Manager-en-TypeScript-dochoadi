# EVALUACIÓN — Trazabilidad de criterios

Estados posibles: `Pendiente` · `En progreso` · `Cumplido`.

## Criterios oficiales de evaluación

| # | Criterio (literal) | Cómo se cumple | Dónde (fichero:función) | Evidencia (comando/salida) | Estado |
|---|--------------------|----------------|-------------------------|----------------------------|--------|
| 1 | Uso correcto de un arreglo bidimensional (matriz) para representar los asientos del cine. | | | | Pendiente |
| 2 | Implementación adecuada de funciones con parámetros y valores de retorno. | | | | Pendiente |
| 3 | Uso correcto de sentencias condicionales (if, else) para validar la disponibilidad de los asientos. | | | | Pendiente |
| 4 | Uso correcto de bucles (for, while) para procesar y mostrar la matriz de asientos. | | | | Pendiente |
| 5 | Que la función de búsqueda identifique correctamente asientos contiguos libres de forma horizontal. | | | | Pendiente |
| 6 | Que el código sea legible, con nombres de variables y funciones significativos. | | | | Pendiente |
| 7 | Que el programa se ejecute sin errores y produzca la salida esperada al probarlo. | | | | Pendiente |
| 8 | Que la salida por consola sea clara y útil para el personal del cine que vaya a usar el sistema. | | | | Pendiente |

## Requisitos funcionales del enunciado

| # | Bloque | Requisito | Cómo se cumple | Dónde (fichero:función) | Evidencia (comando/salida) | Estado |
|---|--------|-----------|----------------|-------------------------|----------------------------|--------|
| F1 | Funcionalidad principal | Crear la sala como matriz 8x10 inicializada a 0 (libre). | | `src/cinema.ts:crearSala` | | Pendiente |
| F2 | Funcionalidad principal | Mostrar la sala por consola con `L` (libre) y `X` (ocupado). | | `src/cinema.ts:mostrarSala` | | Pendiente |
| F3 | Funcionalidad principal | Reservar un asiento validando rango y disponibilidad; devolver mensaje. | | `src/cinema.ts:reservarAsiento` | | Pendiente |
| F4 | Funcionalidad principal | Contar asientos ocupados y disponibles (`[ocupados, disponibles]`). | | `src/cinema.ts:contarAsientos` | | Pendiente |
| F5 | Funcionalidad avanzada | Buscar el primer par de asientos contiguos libres en horizontal (`[[f,c],[f,c+1]]` o `null`). | | `src/cinema.ts:buscarAsientosContiguos` | | Pendiente |
| F6 | Pruebas | Escenarios que ejercitan todas las funciones (reserva OK, asiento ocupado, fuera de rango, conteo, contiguos encontrado / no encontrado). | | `src/main.ts` | | Pendiente |
| F7 | Salida por consola | Mensajes claros y útiles para taquilla en cada operación. | | `src/main.ts`, `src/cinema.ts` | | Pendiente |
