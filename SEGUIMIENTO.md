# SEGUIMIENTO — Registro de prompts

Registro cronológico de cada prompt aplicado al repositorio, según el protocolo de [.claude/skills/cinema-seat-manager/SKILL.md](.claude/skills/cinema-seat-manager/SKILL.md).

## Resumen

| Nº | Objetivo | Estado |
|----|----------|--------|
| 1 | Limpieza de plantilla, contexto, skill y esqueleto de documentación | OK |
| 1b | Regla de commit por prompt y sincronización de package-lock.json | OK |
| 2 | Funcionalidad principal: crearSala, mostrarSala, reservarAsiento, contarAsientos | OK |
| 3 | Búsqueda de asientos contiguos (while + parada en el primer par) | OK |

---

## Prompt 1 — Limpieza, contexto, skill y esqueleto de documentación

- **Fecha:** 2026-11-09
- **Prompt literal:**

````text
Vas a preparar este repositorio para el proyecto "Cinema Seat Manager en TypeScript" (4Geeks Academy). Es un prototipo de línea de comandos para que el personal de taquilla de un cine independiente gestione una sala de 8 filas x 10 asientos.

1. LIMPIEZA
   - Borra: README.es.md, public/rigo-baby.jpg (y la carpeta public/ si queda vacía).
   - NO borres: vite.config.ts, index.html, src/style.css, src/vite-env.d.ts, learn.json, .devcontainer/, .vscode/, tsconfig.json (sirven para el reto web opcional o la plataforma).
   - package.json: name "cinema-seat-manager", description "Gestor de reservas de asientos de cine en TypeScript (CLI)". Mantén todos los scripts y añade "test": "tsx src/main.ts".
   - learn.json: actualiza title/description (es y en) y slug "cinema-seat-manager". No toques el resto de claves.
   - .devcontainer/devcontainer.json: name "cinema-seat-manager". Nada más.

2. CONTEXT.md (raíz). Debe contener:
   - Problema de negocio (taquilla, parejas que quieren asientos contiguos, papel → confusión).
   - Restricciones NO negociables:
     a) Prohibido usar class, interface, object literals ({...}) como estructuras de datos, Map o Set. Los datos de asientos viven SOLO en un arreglo bidimensional number[][].
     b) 0 = libre, 1 = ocupado. Visualización: "L" libre, "X" ocupado.
     c) Sala fija 8 filas x 10 columnas, índices base 0.
     d) Se permiten alias de tipo (type SalaMatriz = number[][]) y tuplas.
     e) Si hicieran falta metadatos de reserva, en formato JSON (no aplica en el alcance actual).
   - Contratos de funciones (firma + retorno):
     crearSala(filas: number, columnas: number): SalaMatriz
     mostrarSala(sala: SalaMatriz): void
     reservarAsiento(sala: SalaMatriz, fila: number, columna: number): string
     contarAsientos(sala: SalaMatriz): [number, number]   // [ocupados, disponibles]
     buscarAsientosContiguos(sala: SalaMatriz): number[][] | null   // [[f,c],[f,c+1]] o null
   - Decisión de diseño: "primer par" = recorrido fila a fila (0→7) y columna a columna (0→9). La imagen del enunciado resalta (3,2)-(3,3) pero el primer par real de esa sala es (0,2)-(0,3); se sigue el texto.
   - Estructura de ficheros: src/cinema.ts (lógica), src/main.ts (escenarios de prueba por consola), src/web.ts (solo reto opcional).
   - Comandos: npm run console, npm run test, npm run typecheck.

3. CLAUDE.md (raíz), una línea: "Lee CONTEXT.md y .claude/skills/cinema-seat-manager/SKILL.md antes de cualquier cambio."

4. SKILL del proyecto en .claude/skills/cinema-seat-manager/SKILL.md con frontmatter:
   ---
   name: cinema-seat-manager
   description: Reglas y protocolo de trabajo del proyecto Cinema Seat Manager. Úsala antes de escribir o modificar código, tests o documentación de este repositorio.
   ---
   Cuerpo:
   - Las restricciones de CONTEXT.md (resumidas).
   - Protocolo de documentación OBLIGATORIO tras cada prompt:
     * Añadir una entrada a SEGUIMIENTO.md con: nº, fecha, prompt literal (en bloque de código), objetivo, ficheros creados/modificados, resultado de `npm run typecheck` y `npm run test`, estado (OK/KO).
     * Cada error (compilación, ejecución, resultado incorrecto, desviación de restricción) va a ERRORES.md con: ID (ERR-001…), prompt en que surgió, síntoma (mensaje literal), causa raíz, solución aplicada, verificación.
     * Si el cambio afecta a un criterio de evaluación, actualizar su fila en EVALUACION.md.
   - Checklist anti-objetos antes de cerrar cualquier tarea: `grep -nE "\bclass\b|\binterface\b|new Map|new Set" src/` debe devolver vacío, y revisar a mano que no haya literales { } usados como datos.
   - Comentarios JSDoc en español en cada función: qué hace, parámetros, retorno.

5. SEGUIMIENTO.md: cabecera, tabla resumen (nº | objetivo | estado) y registra este Prompt 1 como primera entrada.
6. ERRORES.md: cabecera + plantilla de entrada + "Sin errores registrados" si no hubo. Registra ya como ERR-000 (tipo "discrepancia de enunciado") la contradicción imagen vs texto sobre el primer par contiguo, con la decisión tomada.
7. EVALUACION.md: tabla con los 8 criterios oficiales de evaluación (copiados literalmente) + columnas: "Cómo se cumple", "Dónde (fichero:función)", "Evidencia (comando/salida)", "Estado" (todas en Pendiente). Añade debajo una segunda tabla con los requisitos funcionales del enunciado (funcionalidad principal, avanzada, pruebas y salida por consola) con las mismas columnas.
   Criterios oficiales:
   1. Uso correcto de un arreglo bidimensional (matriz) para representar los asientos del cine.
   2. Implementación adecuada de funciones con parámetros y valores de retorno.
   3. Uso correcto de sentencias condicionales (if, else) para validar la disponibilidad de los asientos.
   4. Uso correcto de bucles (for, while) para procesar y mostrar la matriz de asientos.
   5. Que la función de búsqueda identifique correctamente asientos contiguos libres de forma horizontal.
   6. Que el código sea legible, con nombres de variables y funciones significativos.
   7. Que el programa se ejecute sin errores y produzca la salida esperada al probarlo.
   8. Que la salida por consola sea clara y útil para el personal del cine que vaya a usar el sistema.
8. README.md: de momento, solo título y "En construcción — ver CONTEXT.md". Se rehace en el Prompt 6.

Termina ejecutando `npm run typecheck` y enseñándome el árbol de ficheros resultante (sin node_modules).
````

> Nota: el prompt llegó truncado al final ("(si"). El final "…(sin node_modules)." se ha completado en el Prompt 1b con el texto literal facilitado por el usuario; no se ha inventado nada.

- **Objetivo:** convertir la plantilla "typescript-hello" en la base del proyecto Cinema Seat Manager y fijar el contexto, las reglas de trabajo y la documentación de trazabilidad antes de escribir código.
- **Ficheros borrados:** `README.es.md`, `public/rigo-baby.jpg`, `public/` (vacía).
- **Ficheros modificados:** `package.json` (name, description, script `test`), `learn.json` (title, description, slug), `.devcontainer/devcontainer.json` (name), `README.md` (placeholder).
- **Ficheros creados:** `CONTEXT.md`, `CLAUDE.md`, `.claude/skills/cinema-seat-manager/SKILL.md`, `SEGUIMIENTO.md`, `ERRORES.md`, `EVALUACION.md`.
- **`npm run typecheck`:** `tsc --noEmit` → sin errores (exit 0).
- **`npm run test`:** `tsx src/main.ts` → `Hello from src/main.ts` (exit 0; `main.ts` aún es el de la plantilla).
- **Checklist anti-objetos:** `grep -nE "\bclass\b|\binterface\b|new Map|new Set" src/` → vacío.
- **Errores:** ninguno de código. Registrada `ERR-000` (discrepancia de enunciado) en [ERRORES.md](ERRORES.md).
- **Estado:** OK
- **Commit:** `0547e31`

---

## Prompt 1b — Regla de commit por prompt y sincronización de package-lock.json

- **Fecha:** 2026-11-09
- **Prompt literal:**

````text
1. Ejecuta `npm install` para que package-lock.json recoja el nuevo nombre "cinema-seat-manager".
2. Añade al protocolo de .claude/skills/cinema-seat-manager/SKILL.md esta regla:
   "Cerrar cada prompt con un commit descriptivo (Conventional Commits, en español) cuyo cuerpo indique 'Prompt N' y resuma los cambios, seguido de git push a la rama actual. Solo si npm run typecheck y npm run test están en verde; si fallan, registrar en ERRORES.md y no hacer commit."
3. En SEGUIMIENTO.md, añade a cada entrada un campo "Commit" con el hash corto.
4. Revisa la entrada del Prompt 1 en SEGUIMIENTO.md: comprueba que el prompt literal está completo (debe terminar en "Termina ejecutando `npm run typecheck` y enseñándome el árbol de ficheros resultante (sin node_modules)."). Si está truncado, dímelo y no inventes el texto que falte.
5. Registra este Prompt 1b en SEGUIMIENTO.md (prompt literal incluido).
6. Haz DOS commits:
   a) Todo lo del Prompt 1:
      chore: preparar repositorio para Cinema Seat Manager
      (cuerpo: "Prompt 1: limpieza de plantilla typescript-hello, CONTEXT.md, CLAUDE.md, skill del proyecto y esqueleto de SEGUIMIENTO, ERRORES y EVALUACION.")
   b) Lo del Prompt 1b (skill, package-lock.json, SEGUIMIENTO.md):
      docs: añadir regla de commit por prompt al protocolo
      (cuerpo: "Prompt 1b: sincroniza package-lock.json con el nuevo nombre y documenta la regla de commit + push tras cada prompt.")
   Después, rellena el campo Commit de ambas entradas en SEGUIMIENTO.md y haz un tercer commit pequeño: "docs: registrar hashes de commit en SEGUIMIENTO".
7. git push y enséñame `git log --oneline -4`.
````

- **Objetivo:** sincronizar `package-lock.json`, incorporar al protocolo la regla de commit + push por prompt, añadir el campo "Commit" a SEGUIMIENTO.md y completar el prompt literal del Prompt 1.
- **Ficheros modificados:** `package-lock.json` (name → `cinema-seat-manager`), `.claude/skills/cinema-seat-manager/SKILL.md` (paso 4 "Commit + push" y campo "Commit"), `SEGUIMIENTO.md` (final del prompt literal del Prompt 1, campo "Commit", esta entrada).
- **Ficheros creados:** ninguno.
- **`npm run typecheck`:** `tsc --noEmit` → sin errores (exit 0).
- **`npm run test`:** `tsx src/main.ts` → `Hello from src/main.ts` (exit 0).
- **Checklist anti-objetos:** `grep -nE "\bclass\b|\binterface\b|new Map|new Set" src/` → vacío.
- **Errores:** ninguno.
- **Estado:** OK
- **Commit:** `12efeaf` (+ `cac1ac2` `docs: registrar hashes de commit en SEGUIMIENTO`, último commit con hashes aparte; a partir del Prompt 2 ya no se usa ese esquema)

---

## Prompt 2 — Funcionalidad principal

- **Fecha:** 2026-11-09
- **Prompt literal:**

````text
Usa la skill cinema-seat-manager y sigue CONTEXT.md.

Crea src/cinema.ts con estas funciones exportadas (sin clases, sin interfaces, sin objetos):

1. crearSala(filas, columnas): SalaMatriz — matriz rellena de 0 con bucles for anidados (no uses Array.from con callbacks; queremos el bucle explícito para el criterio 4).
2. mostrarSala(sala): void — imprime:
   - cabecera con números de columna alineados,
   - cada fila con su número a la izquierda,
   - "L" para 0 y "X" para 1,
   - una leyenda final "L = libre · X = ocupado" y una línea indicando que la pantalla está arriba.
   Formato monoespaciado, que se lea bien en una terminal de taquilla.
3. reservarAsiento(sala, fila, columna): string
   - if/else en este orden: fila/columna no enteras o fuera de rango → mensaje de error con el rango válido; asiento ocupado → "❌ El asiento (f, c) ya está ocupado"; si no, marcar 1 y "✅ Reserva confirmada: fila f, asiento c".
4. contarAsientos(sala): [number, number] — [ocupados, disponibles], recorriendo con bucles.
5. Exporta también el alias `export type SalaMatriz = number[][]` y las constantes FILAS = 8, COLUMNAS = 10.

JSDoc en español en cada función. Nombres en español, significativos.

En src/main.ts deja temporalmente una demo mínima: crear sala, mostrarla, reservar (2,3), reintentar (2,3), reservar fuera de rango (9,0), mostrar conteo con un mensaje legible ("Ocupados: X · Disponibles: Y · Total: 80").

Elimina de src/main.ts todo el código de la plantilla (import de style.css / document). main.ts debe correr en Node con tsx.

Ejecuta npm run typecheck y npm run test, pega la salida, y documenta según el protocolo (SEGUIMIENTO, ERRORES si los hay, EVALUACION criterios 1–4, 6 y requisitos principales). El criterio 4 debe quedar como "Parcial": aún no hay while (llega en el Prompt 3).

Ajuste de protocolo (aplícalo en este mismo prompt):
- Modifica el paso "Commit + push" de .claude/skills/cinema-seat-manager/SKILL.md: ya no se hace un commit aparte para registrar hashes. El hash del commit del prompt N se escribe en SEGUIMIENTO.md durante el prompt N+1 y viaja en su commit. El Prompt 8 registra el hash del último.
- En este Prompt 2, el campo Commit de su propia entrada queda como "pendiente (se registra en el Prompt 3)".

Cierra con un único commit + push según el protocolo. Mensaje sugerido:
feat: implementar matriz de sala, reserva con validación y conteo
(cuerpo: "Prompt 2: crearSala, mostrarSala, reservarAsiento, contarAsientos en src/cinema.ts; demo mínima en main.ts; ajuste del protocolo de registro de hashes.")
Enséñame al final `git log --oneline -2` y `git status -sb`.
````

- **Objetivo:** implementar la funcionalidad principal (matriz de sala, visualización, reserva validada y conteo), sustituir la demo de la plantilla en `main.ts` y ajustar el protocolo de registro de hashes.
- **Ficheros creados:** `src/cinema.ts` (`SalaMatriz`, `FILAS`, `COLUMNAS`, `crearSala`, `mostrarSala`, `reservarAsiento`, `contarAsientos`).
- **Ficheros modificados:** `src/main.ts` (demo mínima, sin código de plantilla), `.claude/skills/cinema-seat-manager/SKILL.md` (registro de hashes en el prompt N+1), `SEGUIMIENTO.md`, `EVALUACION.md`.
- **Decisiones:**
  - `reservarAsiento` y `mostrarSala` calculan el rango a partir de `sala.length` / `sala[0].length`, no de las constantes, para que funcionen con cualquier matriz recibida.
  - El import en `main.ts` es `"./cinema"` (sin extensión), compatible con `moduleResolution: "Bundler"` y con `tsx`.
- **`npm run typecheck`:** `tsc --noEmit` → sin errores (exit 0).
- **`npm run test`:** exit 0. Salida:

```text
=== Sala recién creada ===

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  L  L  L  L  L  L  L  L  L  L
Fila 1 │  L  L  L  L  L  L  L  L  L  L
Fila 2 │  L  L  L  L  L  L  L  L  L  L
Fila 3 │  L  L  L  L  L  L  L  L  L  L
Fila 4 │  L  L  L  L  L  L  L  L  L  L
Fila 5 │  L  L  L  L  L  L  L  L  L  L
Fila 6 │  L  L  L  L  L  L  L  L  L  L
Fila 7 │  L  L  L  L  L  L  L  L  L  L

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

=== Reservas ===
✅ Reserva confirmada: fila 2, asiento 3
❌ El asiento (2, 3) ya está ocupado
⚠️ Asiento (9, 0) no válido. Valores válidos: fila 0–7, asiento 0–9 (números enteros).

=== Sala tras las reservas ===

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  L  L  L  L  L  L  L  L  L  L
Fila 1 │  L  L  L  L  L  L  L  L  L  L
Fila 2 │  L  L  L  X  L  L  L  L  L  L
Fila 3 │  L  L  L  L  L  L  L  L  L  L
Fila 4 │  L  L  L  L  L  L  L  L  L  L
Fila 5 │  L  L  L  L  L  L  L  L  L  L
Fila 6 │  L  L  L  L  L  L  L  L  L  L
Fila 7 │  L  L  L  L  L  L  L  L  L  L

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 1 · Disponibles: 79 · Total: 80
```

- **Checklist anti-objetos:** `grep -nE "\bclass\b|\binterface\b|new Map|new Set" src/` → vacío. Revisión manual: no hay literales `{ }` usados como datos (solo llaves de bloque y el import con nombre).
- **Errores:** ninguno.
- **Estado:** OK
- **Commit:** `a649c4c`

---

## Prompt 3 — Búsqueda de asientos contiguos

- **Fecha:** 2026-11-09
- **Prompt literal:**

````text
Usa la skill cinema-seat-manager.

0. Mantenimiento previo:
   - En SEGUIMIENTO.md, rellena el campo Commit de la entrada del Prompt 2 con a649c4c.
   - Unifica el formato de los mensajes de reservarAsiento para que todos digan "fila F, asiento C" (el de ocupado y el de no válido usan ahora "(F, C)"). Ejemplo: "❌ La fila 2, asiento 3 ya está ocupado".
   - Protege reservarAsiento y mostrarSala contra una matriz vacía (sala.length === 0): no deben acceder a sala[0].

1. Añade a src/cinema.ts:

buscarAsientosContiguos(sala): number[][] | null
- Busca dos asientos libres consecutivos en la MISMA fila (horizontal).
- Recorre fila a fila (0→7) y, dentro de cada fila, columna a columna comparando columna con columna+1.
- Usa un bucle while para recorrer las filas, con una condición de parada (encontrado) de modo que se detenga en el PRIMER par (esto completa el "while" del criterio 4).
- Devuelve [[fila, col], [fila, col + 1]] o null si no hay ninguno.
- Nunca accedas fuera de los límites (col + 1 < número de columnas). Matriz vacía → null.

2. Añade una función de presentación:
mostrarResultadoContiguos(resultado: number[][] | null): void
- Si hay par: "💑 Asientos contiguos disponibles: fila F, asientos C1 y C2".
- Si es null: "⚠️ No hay dos asientos contiguos libres en ninguna fila. Ofrezca asientos separados."

3. Verificación en src/main.ts (se reorganizará en el Prompt 4):
Añade la sala de la imagen del enunciado como literal number[][] (L=0, X=1):
fila 0: L X L L X X L L X L
fila 1: X L L X L L X X L X
fila 2: L L X L X L L L X L
fila 3: L X L L L X X L L X
fila 4: X L L X X L L X L L
fila 5: L L X L L X L L X X
fila 6: L X L L X L X L L L
fila 7: X L L X L L L X X L
Muéstrala, cuenta y busca contiguos. Resultado esperado: conteo [31, 49] y par [[0,2],[0,3]].
Si el resultado no coincide, NO ajustes lo esperado: busca el fallo y regístralo en ERRORES.md.
Añade también una prueba rápida de sala llena (todo 1) que devuelva null.

4. Documentación:
- ERRORES.md: marca ERR-000 como verificado, con la salida que lo demuestra.
- EVALUACION.md: criterio 4 → Cumplido (indica dónde está el while), criterio 5 → Cumplido con evidencia, y los requisitos de la funcionalidad avanzada.
- SEGUIMIENTO.md: entrada del Prompt 3, Commit "pendiente (se registra en el Prompt 4)".

Ejecuta npm run typecheck y npm run test, pega la salida y cierra con un único commit + push:
feat: añadir búsqueda de asientos contiguos
(cuerpo: "Prompt 3: buscarAsientosContiguos con while y parada en el primer par, mostrarResultadoContiguos, verificación con la sala del enunciado (31/49, par 0,2-0,3); unifica formato de mensajes.")
Enséñame `git log --oneline -2` y `git status -sb`.
````

- **Objetivo:** implementar la funcionalidad avanzada (primer par de asientos contiguos libres en horizontal, con `while` y parada temprana), su presentación para taquilla, verificarla con la sala del enunciado y unificar el formato de los mensajes de reserva.
- **Ficheros modificados:**
  - `src/cinema.ts`: nuevas `buscarAsientosContiguos` y `mostrarResultadoContiguos`; `reservarAsiento` con mensajes "fila F, asiento C" y protección ante sala vacía; `mostrarSala` con protección ante sala vacía (ninguna accede a `sala[0]` si `sala.length === 0`).
  - `src/main.ts`: sala del enunciado como `number[][]`, comprobaciones ✔/✘ (conteo, par), sala llena y sala vacía → `null`.
  - `ERRORES.md` (ERR-000 verificado), `EVALUACION.md` (criterios 3, 4, 5 y F5), `SEGUIMIENTO.md` (hash del Prompt 2 y esta entrada).
- **Ficheros creados:** ninguno.
- **Decisiones:**
  - Las filas se recorren con un `while (fila < sala.length && !encontrado)` y las columnas con otro `while (columna + 1 < longitud && !encontrado)`; así la parada en el primer par vale para ambos niveles y nunca se lee fuera de la fila.
  - Matriz vacía: `mostrarSala` imprime un aviso y `reservarAsiento` devuelve "⚠️ La sala no tiene asientos: no se puede reservar."
- **`npm run typecheck`:** `tsc --noEmit` → sin errores (exit 0).
- **`npm run test`:** exit 0. Salida:

```text
=== Sala recién creada ===

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  L  L  L  L  L  L  L  L  L  L
Fila 1 │  L  L  L  L  L  L  L  L  L  L
Fila 2 │  L  L  L  L  L  L  L  L  L  L
Fila 3 │  L  L  L  L  L  L  L  L  L  L
Fila 4 │  L  L  L  L  L  L  L  L  L  L
Fila 5 │  L  L  L  L  L  L  L  L  L  L
Fila 6 │  L  L  L  L  L  L  L  L  L  L
Fila 7 │  L  L  L  L  L  L  L  L  L  L

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

=== Reservas ===
✅ Reserva confirmada: fila 2, asiento 3
❌ La fila 2, asiento 3 ya está ocupado
⚠️ La fila 9, asiento 0 no es válido. Valores válidos: fila 0–7, asiento 0–9 (números enteros).

=== Sala tras las reservas ===

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  L  L  L  L  L  L  L  L  L  L
Fila 1 │  L  L  L  L  L  L  L  L  L  L
Fila 2 │  L  L  L  X  L  L  L  L  L  L
Fila 3 │  L  L  L  L  L  L  L  L  L  L
Fila 4 │  L  L  L  L  L  L  L  L  L  L
Fila 5 │  L  L  L  L  L  L  L  L  L  L
Fila 6 │  L  L  L  L  L  L  L  L  L  L
Fila 7 │  L  L  L  L  L  L  L  L  L  L

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 1 · Disponibles: 79 · Total: 80

=== Sala del enunciado ===

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  L  X  L  L  X  X  L  L  X  L
Fila 1 │  X  L  L  X  L  L  X  X  L  X
Fila 2 │  L  L  X  L  X  L  L  L  X  L
Fila 3 │  L  X  L  L  L  X  X  L  L  X
Fila 4 │  X  L  L  X  X  L  L  X  L  L
Fila 5 │  L  L  X  L  L  X  L  L  X  X
Fila 6 │  L  X  L  L  X  L  X  L  L  L
Fila 7 │  X  L  L  X  L  L  L  X  X  L

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 31 · Disponibles: 49 · Total: 80
💑 Asientos contiguos disponibles: fila 0, asientos 2 y 3
Comprobaciones:
  ✔ conteo [ocupados, disponibles]: [31,49]
  ✔ primer par contiguo: [[0,2],[0,3]]

=== Sala llena ===
⚠️ No hay dos asientos contiguos libres en ninguna fila. Ofrezca asientos separados.
Comprobaciones:
  ✔ sala llena → null: null
  ✔ sala vacía (0 filas) → null: null
```

- **Verificación de lo esperado:** conteo `[31, 49]` ✔, par `[[0,2],[0,3]]` ✔ (fila 0, no fila 3), sala llena → `null` ✔, `grep -n while src/cinema.ts` → L183, L186.
- **Checklist anti-objetos:** `grep -nE "\bclass\b|\binterface\b|new Map|new Set" src/` → vacío. Revisión manual: sin literales `{ }` usados como datos (el par se devuelve como arreglo `number[][]`).
- **Errores:** ninguno.
- **Estado:** OK
- **Commit:** pendiente (se registra en el Prompt 4)
