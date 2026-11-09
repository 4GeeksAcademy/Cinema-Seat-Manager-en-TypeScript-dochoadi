---
name: cinema-seat-manager
description: Reglas y protocolo de trabajo del proyecto Cinema Seat Manager. Úsala antes de escribir o modificar código, tests o documentación de este repositorio.
---

# Cinema Seat Manager — reglas y protocolo

Fuente de verdad: [CONTEXT.md](../../../CONTEXT.md). Resumen:

## Restricciones (no negociables)

- **Prohibido**: `class`, `interface`, object literals `{ ... }` como datos, `Map`, `Set`.
- Los asientos viven **solo** en un `number[][]` (`type SalaMatriz = number[][]`).
- `0` = libre, `1` = ocupado. En pantalla: `L` = libre, `X` = ocupado.
- Sala fija **8 x 10**, índices **base 0**.
- Permitidos: alias de tipo y tuplas (`[number, number]`).
- Metadatos de reserva (si algún día hacen falta): JSON. Fuera de alcance actual.
- Contratos:
  - `crearSala(filas, columnas): SalaMatriz`
  - `mostrarSala(sala): void`
  - `reservarAsiento(sala, fila, columna): string`
  - `contarAsientos(sala): [number, number]` → `[ocupados, disponibles]`
  - `buscarAsientosContiguos(sala): number[][] | null` → `[[f,c],[f,c+1]]` o `null`
- "Primer par" contiguo = recorrido fila 0→7, columna 0→9 (se sigue el texto, no la imagen; ver `ERR-000`).
- Ficheros: `src/cinema.ts` (lógica), `src/main.ts` (escenarios), `src/web.ts` (reto opcional).

## Protocolo de documentación OBLIGATORIO (tras cada prompt)

1. **SEGUIMIENTO.md** — añadir una entrada con:
   - nº de prompt y fecha;
   - prompt literal en bloque de código;
   - objetivo;
   - ficheros creados / modificados / borrados;
   - resultado de `npm run typecheck` y `npm run test`;
   - estado (`OK` / `KO`).
   - Actualizar también la tabla resumen.
2. **ERRORES.md** — cada error (compilación, ejecución, resultado incorrecto, desviación de restricción) se registra con:
   - ID (`ERR-001`, `ERR-002`, …);
   - prompt en que surgió;
   - síntoma (mensaje literal);
   - causa raíz;
   - solución aplicada;
   - verificación.
3. **EVALUACION.md** — si el cambio afecta a un criterio de evaluación o requisito funcional, actualizar su fila (cómo se cumple, dónde, evidencia, estado).

## Checklist anti-objetos (antes de cerrar cualquier tarea)

```bash
grep -nE "\bclass\b|\binterface\b|new Map|new Set" src/
```

- Debe devolver **vacío**.
- Revisar a mano que no haya literales `{ }` usados como datos (las llaves de bloques de función/if/for son correctas).

## Estilo de código

- Comentarios **JSDoc en español** en cada función: qué hace, `@param` de cada parámetro y `@returns`.
- Nombres de variables y funciones significativos, en español y coherentes con los contratos.
- Bucles `for`/`while` para recorrer la matriz; `if`/`else` para validar disponibilidad y rango.
