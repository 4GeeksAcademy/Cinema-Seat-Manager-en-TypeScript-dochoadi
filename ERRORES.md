# ERRORES — Registro de errores y discrepancias

Cada error de compilación, ejecución, resultado incorrecto o desviación de una restricción se registra aquí con un ID correlativo.

## Plantilla

```markdown
### ERR-XXX — <título breve>

- **Tipo:** compilación | ejecución | resultado incorrecto | desviación de restricción | discrepancia de enunciado
- **Prompt en que surgió:** Prompt N
- **Síntoma (literal):** `<mensaje exacto o salida observada>`
- **Causa raíz:** ...
- **Solución aplicada:** ...
- **Verificación:** <comando ejecutado y resultado>
```

## Registro

### ERR-000 — Primer par contiguo: imagen vs texto del enunciado

- **Tipo:** discrepancia de enunciado
- **Prompt en que surgió:** Prompt 1
- **Síntoma (literal):** la imagen del enunciado resalta como resultado de `buscarAsientosContiguos` el par **(3,2)-(3,3)**, mientras que el texto pide devolver el **primer** par de asientos contiguos libres; recorriendo la sala de ejemplo, el primer par es **(0,2)-(0,3)**.
- **Causa raíz:** la ilustración del enunciado no es coherente con la definición textual de "primer par".
- **Solución aplicada:** se sigue el **texto**. "Primer par" = recorrido fila a fila (0→7) y columna a columna (0→9); se devuelve `[[f, c], [f, c + 1]]` del primer `c` con `sala[f][c] === 0 && sala[f][c + 1] === 0`. Decisión documentada en [CONTEXT.md](CONTEXT.md) §4.
- **Verificación:** ✔ verificado en el Prompt 3. `src/main.ts` reproduce la sala del enunciado como `number[][]` y `npm run test` muestra:

  ```text
  Ocupados: 31 · Disponibles: 49 · Total: 80
  💑 Asientos contiguos disponibles: fila 0, asientos 2 y 3
  Comprobaciones:
    ✔ conteo [ocupados, disponibles]: [31,49]
    ✔ primer par contiguo: [[0,2],[0,3]]
  ```

### ERR-001 — Mensajes de reserva sin concordancia de género

- **Tipo:** salida incorrecta
- **Prompt en que surgió:** Prompt 3
- **Síntoma (literal):** `❌ La fila 2, asiento 3 ya está ocupado` y `⚠️ La fila 9, asiento 0 no es válido` (falta de concordancia de género).
- **Causa raíz:** el ejemplo de mensaje incluido en el propio Prompt 3 era incorrecto y se implementó literalmente.
- **Solución aplicada:** patrón fijo "estado: posición" en los tres mensajes de `src/cinema.ts:reservarAsiento`:
  - `✅ Reserva confirmada: fila F, asiento C`
  - `❌ Asiento ocupado: fila F, asiento C`
  - `⚠️ Posición no válida: fila F, asiento C. Valores válidos: fila 0–7, asiento 0–9 (números enteros).`
- **Verificación:** comprobación automática de los tres textos exactos en `src/main.ts` (escenario 2). Salida de `npm run test` (Prompt 4):

  ```text
  Comprobaciones (textos exactos de reservarAsiento, ERR-001):
    ✔ OK     mensaje de reserva correcta → ✅ Reserva confirmada: fila 2, asiento 3
    ✔ OK     mensaje de asiento ocupado → ❌ Asiento ocupado: fila 2, asiento 3
    ✔ OK     mensaje de posición no válida → ⚠️ Posición no válida: fila 9, asiento 0. Valores válidos: fila 0–7, asiento 0–9 (números enteros).
  ```

### ERR-002 — Escenario "sala casi llena" mal definido (al 50 %)

- **Tipo:** defecto de especificación (detectado antes de implementar)
- **Prompt en que surgió:** Prompt 4 (versión previa del kit)
- **Síntoma (literal):** el escenario "sala casi llena con solo asientos sueltos" se definía con un patrón alterno libre/ocupado, que deja la sala al 50 % (40/40) y no cumple "casi llena".
- **Causa raíz:** diseño del caso de prueba sin calcular la ocupación resultante.
- **Solución aplicada:** sala llena con 6 asientos sueltos liberados, sin contiguos: `[0,0]`, `[1,5]`, `[3,9]`, `[5,2]`, `[7,4]`, `[7,7]` (74/6).
- **Verificación:** escenario 3 de `src/main.ts`, salida de `npm run test` (Prompt 4):

  ```text
  Ocupados: 74 · Disponibles: 6 · Total: 80
  ⚠️ No hay dos asientos contiguos libres en ninguna fila. Ofrezca asientos separados.
  Comprobaciones:
    ✔ OK     conteo [ocupados, disponibles] → [74,6]
    ✔ OK     sin asientos contiguos → null
  ```

### ERR-003 — `process` sin tipos en `src/main.ts`

- **Tipo:** compilación
- **Prompt en que surgió:** Prompt 4
- **Síntoma (literal):** `src/main.ts(274,3): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try \`npm i --save-dev @types/node\`.`
- **Causa raíz:** el proyecto partía de una plantilla web (Vite) sin tipos de Node; `process.exitCode = 1` es la primera API de Node usada en el código.
- **Solución aplicada:** `npm install --save-dev @types/node@20` (coincide con Node 20 del devcontainer, `node --version` → v20.19.2). No hace falta tocar `tsconfig.json`: sin `types` explícito, TypeScript carga todos los `@types/*` instalados.
- **Verificación:** `npm run typecheck` → exit 0; `npm run test` → `Pruebas superadas: 19/19`, exit 0.
