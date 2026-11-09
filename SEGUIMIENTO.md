# SEGUIMIENTO — Registro de prompts

Registro cronológico de cada prompt aplicado al repositorio, según el protocolo de [.claude/skills/cinema-seat-manager/SKILL.md](.claude/skills/cinema-seat-manager/SKILL.md).

## Resumen

| Nº | Objetivo | Estado |
|----|----------|--------|
| 1 | Limpieza de plantilla, contexto, skill y esqueleto de documentación | OK |
| 1b | Regla de commit por prompt y sincronización de package-lock.json | OK |
| 2 | Funcionalidad principal: crearSala, mostrarSala, reservarAsiento, contarAsientos | OK |
| 3 | Búsqueda de asientos contiguos (while + parada en el primer par) | OK |
| 4 | Guion de pruebas (5 escenarios + robustez) y corrección de mensajes de reserva | OK |
| 5 | Auditoría de cumplimiento de criterios (evidencias, prueba de la prueba, riesgos) | OK |
| 6 | README final y npm audit fix (sin --force) | OK |
| 6b | Separar entregas (main + v1.0-base / interfaz-web + v2.0-web) | OK |
| 7c | Cómo ver cada versión (README en `main` e `interfaz-web`) | OK |
| 8a | README sin sección duplicada, versión 3 → `v2.2-web` (+ cabecera web en `interfaz-web`) | OK |
| 8b | Evaluación final independiente de la Entrega 1 (subagente con contexto limpio) | OK |
| 8c | `index.html` mínima en la versión de consola (rama `main`) | OK |
| 8d | Cierre: README sin capturas, versiones 1 y 3 en `v1.1-base` / `v2.3-web`, tags finales | OK |

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
- **Commit:** `3ca827f`

---

## Prompt 4 — Guion de pruebas y corrección de mensajes de reserva

- **Fecha:** 2026-11-09
- **Prompt literal:**

````text
Usa la skill cinema-seat-manager.

0. Mantenimiento previo:
   - SEGUIMIENTO.md: rellena el Commit del Prompt 3 con 3ca827f.
   - Corrige los mensajes de reservarAsiento con patrón "estado: posición" y concordancia correcta:
     "✅ Reserva confirmada: fila F, asiento C"
     "❌ Asiento ocupado: fila F, asiento C"
     "⚠️ Posición no válida: fila F, asiento C. Valores válidos: fila 0–7, asiento 0–9 (números enteros)."
   - EVALUACION.md: sustituye todas las referencias a números de línea por "fichero:función" (p. ej. src/cinema.ts:buscarAsientosContiguos). Regístralo solo en SEGUIMIENTO.md como mejora, no en ERRORES.md.
   - ERRORES.md, añade:
     ERR-001 — Tipo: salida incorrecta. Prompt: 3. Síntoma: "❌ La fila 2, asiento 3 ya está ocupado" y "⚠️ La fila 9, asiento 0 no es válido" (falta de concordancia de género). Causa raíz: el ejemplo de mensaje incluido en el propio Prompt 3 era incorrecto y se implementó literalmente. Solución: patrón fijo "estado: posición" en los tres mensajes. Verificación: comprobación automática de los tres textos exactos en main.ts (ver salida de npm run test).
     ERR-002 — Tipo: defecto de especificación (detectado antes de implementar). Prompt: 4 (versión previa del kit). Síntoma: el escenario "sala casi llena con solo asientos sueltos" se definía con un patrón alterno libre/ocupado, que deja la sala al 50 % (40/40) y no cumple "casi llena". Causa raíz: diseño del caso de prueba sin calcular la ocupación resultante. Solución: sala llena con 6 asientos sueltos liberados, sin contiguos (74/6). Verificación: escenario 3 con conteo [74, 6] y contiguos null.

1. Reescribe src/main.ts como el guion de pruebas que verá el evaluador. Para cada escenario imprime un encabezado claro (=== ESCENARIO N: nombre ===), la sala, el conteo, el resultado de buscar contiguos y, donde aplique, intentos de reserva con su mensaje.

Escenarios obligatorios:
1. Sala vacía: todo libre. Esperado: [0, 80], contiguos [[0,0],[0,1]].
2. Sala parcialmente ocupada: la sala del enunciado (ya está como literal number[][]). Esperado: [31, 49], contiguos [[0,2],[0,3]]. Incluye una reserva correcta, una reserva sobre un asiento ocupado y una fuera de rango.
3. Sala casi llena con solo asientos sueltos: sala llena y después libera estas posiciones (ninguna contigua a otra en su fila): [0,0], [1,5], [3,9], [5,2], [7,4], [7,7]. Guárdalas como number[][] y recórrelas con un bucle. Esperado: [74, 6], contiguos null y el mensaje de "no hay contiguos". Reserva uno de los sueltos y comprueba [75, 5].
4. Sala completamente llena: todo 1. Esperado: [80, 0], contiguos null, y un intento de reserva que falle con "Asiento ocupado".
5. Flujo real de taquilla: sala vacía → una pareja pide dos juntos → buscarAsientosContiguos → reservar los dos asientos devueltos con reservarAsiento → mostrar sala y conteo [2, 78] → volver a buscar: el siguiente par debe ser [[0,2],[0,3]].

Funciones auxiliares en main.ts con bucles (p. ej. llenarSala(sala) y liberarPosiciones(sala, posiciones)) en lugar de escribir 80 valores a mano. Liberar aquí es preparación de datos de prueba, no una funcionalidad de cinema.ts.

Conserva la prueba de sala vacía (0 filas → null) como escenario extra de robustez.

2. Comprobaciones:
- verificar(descripcion: string, obtenido: string, esperado: string): void, que imprima "✔ OK" o "✘ FALLO" comparando JSON.stringify.
- Al final: "Pruebas superadas: N/M". Si alguna falla, process.exitCode = 1.
- Verifica también los textos exactos de los tres mensajes de reservarAsiento (evidencia de ERR-001).

3. Documentación: EVALUACION.md criterios 7 y 8 y bloque "Pruebas y salida por consola" con evidencia (fragmento de salida y "Pruebas superadas: N/N"). SEGUIMIENTO.md: entrada del Prompt 4 que mencione ERR-001, ERR-002 y la mejora de referencias; Commit "pendiente (se registra en el Prompt 5)".

Ejecuta npm run typecheck y npm run test, pega la salida completa y cierra con un único commit + push:
test: añadir escenarios de prueba y corregir mensajes de reserva
(cuerpo: "Prompt 4: cinco escenarios del enunciado (vacía, parcial, casi llena, llena, flujo de taquilla) con verificar() y exit code. Corrige ERR-001 (concordancia de mensajes) y ERR-002 (escenario casi llena al 50 %). Referencias por función en EVALUACION.")
Enséñame `git log --oneline -2` y `git status -sb`.
````

- **Objetivo:** convertir `src/main.ts` en el guion de pruebas para el evaluador (5 escenarios del enunciado + robustez, con comprobaciones automáticas y código de salida) y corregir la concordancia de los mensajes de reserva.
- **Ficheros modificados:**
  - `src/cinema.ts`: mensajes de `reservarAsiento` con patrón "estado: posición" (corrige **ERR-001**); aviso de sala vacía alineado con ese patrón (`⚠️ Sala sin asientos: no se puede reservar.`).
  - `src/main.ts`: reescrito como guion de pruebas: `verificar`, `llenarSala`, `liberarPosiciones`, `encabezado`, `mostrarConteo`, `buscarYMostrarContiguos`, `intentarReserva`; escenarios 1–5 + EXTRA; resumen `Pruebas superadas: N/M` y `process.exitCode = 1` si falla alguna.
  - `package.json` / `package-lock.json`: `@types/node@^20` como devDependency (corrige **ERR-003**).
  - `ERRORES.md` (ERR-001, ERR-002, ERR-003), `EVALUACION.md` (criterios 3, 4, 7, 8; F6, F7), `SEGUIMIENTO.md` (hash del Prompt 3 y esta entrada).
- **Ficheros creados:** ninguno.
- **Mejora (no es error):** en `EVALUACION.md` se han sustituido todas las referencias a números de línea por `fichero:función` (p. ej. `src/cinema.ts:buscarAsientosContiguos`), para que no queden obsoletas al editar el código.
- **Errores registrados:**
  - **ERR-001** — concordancia de los mensajes de reserva (origen: ejemplo del Prompt 3). Corregido y verificado con los textos exactos en el escenario 2.
  - **ERR-002** — escenario "casi llena" al 50 % en una versión previa del kit; se usa sala llena con 6 sueltos (74/6). Verificado en el escenario 3.
  - **ERR-003** — `TS2580: Cannot find name 'process'` en el primer `npm run typecheck`; resuelto instalando `@types/node@20`.
- **Decisiones:**
  - `verificar` respeta la firma pedida (`obtenido` y `esperado` como `string`): los mensajes se pasan tal cual y las tuplas / matrices / `null` se pasan serializados con `JSON.stringify`; dentro, la comparación se hace sobre `JSON.stringify` de ambos textos.
  - En el escenario 2 se reserva (2,3), que en la sala del enunciado está libre; el segundo intento sobre (2,3) produce el ❌, y (9,0) el ⚠️. Conteo resultante [32, 48], también verificado.
  - En el escenario 3 se vende el suelto (1,5) → [75, 5]. En el escenario 4 se intenta (4,4).
- **`npm run typecheck`:** primer intento → `error TS2580` (ERR-003); tras la corrección → sin errores (exit 0).
- **`npm run test`:** exit 0. Salida completa:

```text

=== ESCENARIO 1: Sala vacía ===

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

Ocupados: 0 · Disponibles: 80 · Total: 80
💑 Asientos contiguos disponibles: fila 0, asientos 0 y 1
Comprobaciones:
  ✔ OK     conteo [ocupados, disponibles] → [0,80]
  ✔ OK     primer par contiguo → [[0,0],[0,1]]

=== ESCENARIO 2: Sala parcialmente ocupada (sala del enunciado) ===

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
  ✔ OK     conteo [ocupados, disponibles] → [31,49]
  ✔ OK     primer par contiguo → [[0,2],[0,3]]

Intentos de reserva:
Reserva (2, 3) → ✅ Reserva confirmada: fila 2, asiento 3
Reserva (2, 3) → ❌ Asiento ocupado: fila 2, asiento 3
Reserva (9, 0) → ⚠️ Posición no válida: fila 9, asiento 0. Valores válidos: fila 0–7, asiento 0–9 (números enteros).

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  L  X  L  L  X  X  L  L  X  L
Fila 1 │  X  L  L  X  L  L  X  X  L  X
Fila 2 │  L  L  X  X  X  L  L  L  X  L
Fila 3 │  L  X  L  L  L  X  X  L  L  X
Fila 4 │  X  L  L  X  X  L  L  X  L  L
Fila 5 │  L  L  X  L  L  X  L  L  X  X
Fila 6 │  L  X  L  L  X  L  X  L  L  L
Fila 7 │  X  L  L  X  L  L  L  X  X  L

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 32 · Disponibles: 48 · Total: 80
Comprobaciones (textos exactos de reservarAsiento, ERR-001):
  ✔ OK     mensaje de reserva correcta → ✅ Reserva confirmada: fila 2, asiento 3
  ✔ OK     mensaje de asiento ocupado → ❌ Asiento ocupado: fila 2, asiento 3
  ✔ OK     mensaje de posición no válida → ⚠️ Posición no válida: fila 9, asiento 0. Valores válidos: fila 0–7, asiento 0–9 (números enteros).
  ✔ OK     conteo tras una reserva → [32,48]

=== ESCENARIO 3: Sala casi llena con solo asientos sueltos ===

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  L  X  X  X  X  X  X  X  X  X
Fila 1 │  X  X  X  X  X  L  X  X  X  X
Fila 2 │  X  X  X  X  X  X  X  X  X  X
Fila 3 │  X  X  X  X  X  X  X  X  X  L
Fila 4 │  X  X  X  X  X  X  X  X  X  X
Fila 5 │  X  X  L  X  X  X  X  X  X  X
Fila 6 │  X  X  X  X  X  X  X  X  X  X
Fila 7 │  X  X  X  X  L  X  X  L  X  X

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 74 · Disponibles: 6 · Total: 80
⚠️ No hay dos asientos contiguos libres en ninguna fila. Ofrezca asientos separados.
Comprobaciones:
  ✔ OK     conteo [ocupados, disponibles] → [74,6]
  ✔ OK     sin asientos contiguos → null

Se vende uno de los asientos sueltos:
Reserva (1, 5) → ✅ Reserva confirmada: fila 1, asiento 5
Ocupados: 75 · Disponibles: 5 · Total: 80
Comprobaciones:
  ✔ OK     reserva de asiento suelto → ✅ Reserva confirmada: fila 1, asiento 5
  ✔ OK     conteo tras la reserva → [75,5]

=== ESCENARIO 4: Sala completamente llena ===

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  X  X  X  X  X  X  X  X  X  X
Fila 1 │  X  X  X  X  X  X  X  X  X  X
Fila 2 │  X  X  X  X  X  X  X  X  X  X
Fila 3 │  X  X  X  X  X  X  X  X  X  X
Fila 4 │  X  X  X  X  X  X  X  X  X  X
Fila 5 │  X  X  X  X  X  X  X  X  X  X
Fila 6 │  X  X  X  X  X  X  X  X  X  X
Fila 7 │  X  X  X  X  X  X  X  X  X  X

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 80 · Disponibles: 0 · Total: 80
⚠️ No hay dos asientos contiguos libres en ninguna fila. Ofrezca asientos separados.
Reserva (4, 4) → ❌ Asiento ocupado: fila 4, asiento 4
Comprobaciones:
  ✔ OK     conteo [ocupados, disponibles] → [80,0]
  ✔ OK     sin asientos contiguos → null
  ✔ OK     reserva rechazada → ❌ Asiento ocupado: fila 4, asiento 4

=== ESCENARIO 5: Flujo real de taquilla (una pareja pide dos asientos juntos) ===
Una pareja pide dos asientos juntos. Buscando...
💑 Asientos contiguos disponibles: fila 0, asientos 0 y 1
Comprobaciones:
  ✔ OK     par propuesto → [[0,0],[0,1]]

Reservando los dos asientos propuestos:
Reserva (0, 0) → ✅ Reserva confirmada: fila 0, asiento 0
Reserva (0, 1) → ✅ Reserva confirmada: fila 0, asiento 1

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  X  X  L  L  L  L  L  L  L  L
Fila 1 │  L  L  L  L  L  L  L  L  L  L
Fila 2 │  L  L  L  L  L  L  L  L  L  L
Fila 3 │  L  L  L  L  L  L  L  L  L  L
Fila 4 │  L  L  L  L  L  L  L  L  L  L
Fila 5 │  L  L  L  L  L  L  L  L  L  L
Fila 6 │  L  L  L  L  L  L  L  L  L  L
Fila 7 │  L  L  L  L  L  L  L  L  L  L

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 2 · Disponibles: 78 · Total: 80
Siguiente pareja. Buscando...
💑 Asientos contiguos disponibles: fila 0, asientos 2 y 3
Comprobaciones:
  ✔ OK     conteo tras reservar la pareja → [2,78]
  ✔ OK     siguiente par contiguo → [[0,2],[0,3]]

=== ESCENARIO EXTRA: Robustez: sala sin filas (matriz vacía) ===
⚠️ La sala no tiene asientos que mostrar.
⚠️ No hay dos asientos contiguos libres en ninguna fila. Ofrezca asientos separados.
Comprobaciones:
  ✔ OK     contiguos en matriz vacía → null

==========================================
Pruebas superadas: 19/19
==========================================
```

- **Checklist anti-objetos:** `grep -nE "\bclass\b|\binterface\b|new Map|new Set" src/` → vacío. Revisión manual: sin literales `{ }` usados como datos (posiciones sueltas como `number[][]`, contadores como variables `let`).
- **Estado:** OK
- **Commit:** `ce4c417`

---

## Prompt 5 — Auditoría de cumplimiento de criterios

- **Fecha:** 2026-11-09
- **Prompt literal:**

````text
Usa la skill cinema-seat-manager. Actúa como evaluador estricto de 4Geeks, no como autor del código.

0. Mantenimiento previo:
   - SEGUIMIENTO.md: rellena el Commit del Prompt 4 con ce4c417.
   - main.ts: cambia las etiquetas de los intentos de reserva de "Reserva (F, C) →" a "Reservar fila F, asiento C →" para que todo el guion use la misma notación que los mensajes.
   - Matriz vacía: buscarAsientosContiguos/mostrarResultadoContiguos no deben sugerir "Ofrezca asientos separados" si la sala no tiene asientos. Usa un aviso propio, p. ej. "⚠️ Sala sin asientos: no hay contiguos que buscar.", sin cambiar el retorno (sigue siendo null). Actualiza su comprobación.

1. Ejecuta y pega la salida de:
   - npm run typecheck
   - npm run test ; echo "exit: $?"
   - grep -nE "\bclass\b|\binterface\b|new Map|new Set|\bthis\b" src/
   - grep -nE "\bwhile\b" src/
   - grep -nE "\bfor\b" src/
   - grep -nE "\bif\b|\belse\b" src/cinema.ts

2. Prueba de la prueba (NO se commitea):
   - Cambia temporalmente un valor esperado en main.ts (p. ej. [31, 49] → [30, 50]).
   - Ejecuta npm run test ; echo "exit: $?" y pega la salida: debe aparecer "✘ FALLO", "Pruebas superadas: N-1/N" y exit 1.
   - Revierte el cambio con git checkout -- src/main.ts (o deshaciéndolo a mano si hay otros cambios pendientes) y confirma de nuevo N/N y exit 0.
   - Regístralo en EVALUACION.md como evidencia del criterio 7.

3. Revisión manual:
   - Busca literales de objeto usados como datos ({ ... }) en src/. Cualquier hallazgo → ERRORES.md + corrección.
   - Confirma que CADA función de src/cinema.ts y src/main.ts tiene JSDoc en español.
   - Revisa nombres: ninguna variable de una letra salvo índices de bucle claros, ningún nombre en inglés mezclado.

4. EVALUACION.md:
   - Cada criterio y requisito con "Cómo se cumple", "Dónde" (fichero:función), "Evidencia" (comando + fragmento de salida) y Estado. Ningún ✅ sin evidencia.
   - Añade la sección "Riesgos conocidos": ERR-000 (imagen vs enunciado), interfaz web fuera de evaluación, vulnerabilidades de npm audit en dependencias de desarrollo de Vite 5 (no se ejecuta audit fix --force para no romper @tailwindcss/vite; no afectan a la CLI), y @types/node visible en todo src/ (en web.ts no debe usarse process).

5. Si algo está ❌, corrígelo, vuelve a ejecutar y actualiza. No cierres hasta que todo esté ✅.

6. SEGUIMIENTO.md: entrada del Prompt 5, Commit "pendiente (se registra en el Prompt 6)".

Cierra con un único commit + push:
docs: auditar cumplimiento de criterios de evaluación
(cuerpo: "Prompt 5: auditoría con evidencias por criterio, prueba de detección de fallos (exit 1), riesgos conocidos; etiquetas de reserva unificadas y aviso propio para sala sin asientos.")
Enséñame `git log --oneline -2` y `git status -sb`.
````

- **Objetivo:** auditar el proyecto como evaluador estricto: evidencias por criterio, prueba de que el guion detecta fallos, revisión manual de restricciones y estilo, y riesgos conocidos. Mantenimiento: notación única "fila F, asiento C" en las etiquetas y aviso propio para sala sin asientos.
- **Ficheros modificados:**
  - `src/cinema.ts`: nueva `mensajeResultadoContiguos(resultado, sala?)` (devuelve el texto); `mostrarResultadoContiguos(resultado, sala?)` la usa. Con una sala sin filas muestra `⚠️ Sala sin asientos: no hay contiguos que buscar.`; `buscarAsientosContiguos` sigue devolviendo `null`.
  - `src/main.ts`: etiquetas `Reservar fila F, asiento C →`; `buscarYMostrarContiguos` pasa la sala; nueva comprobación del aviso de sala sin asientos (19 → 20 pruebas).
  - `CONTEXT.md`: funciones de presentación documentadas.
  - `EVALUACION.md`: reescrito con evidencias por criterio y requisito, estados ✅, prueba de la prueba en el criterio 7 y sección "Riesgos conocidos".
  - `SEGUIMIENTO.md`: hash del Prompt 4 y esta entrada.
- **Ficheros creados:** ninguno.
- **Decisión:** como `mostrarResultadoContiguos` solo recibía el resultado (`null` en ambos casos), no podía distinguir "sala sin asientos" de "sin pares libres". Se añade un segundo parámetro opcional `sala` y se separa el texto en `mensajeResultadoContiguos` para poder verificarlo con `verificar()`. Las llamadas antiguas de un solo argumento siguen funcionando igual.
- **`npm run typecheck`:** `tsc --noEmit` → exit 0.
- **`npm run test ; echo "exit: $?"`** (salida completa, estado final):

```text

> cinema-seat-manager@1.0.0 test
> tsx src/main.ts


=== ESCENARIO 1: Sala vacía ===

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

Ocupados: 0 · Disponibles: 80 · Total: 80
💑 Asientos contiguos disponibles: fila 0, asientos 0 y 1
Comprobaciones:
  ✔ OK     conteo [ocupados, disponibles] → [0,80]
  ✔ OK     primer par contiguo → [[0,0],[0,1]]

=== ESCENARIO 2: Sala parcialmente ocupada (sala del enunciado) ===

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
  ✔ OK     conteo [ocupados, disponibles] → [31,49]
  ✔ OK     primer par contiguo → [[0,2],[0,3]]

Intentos de reserva:
Reservar fila 2, asiento 3 → ✅ Reserva confirmada: fila 2, asiento 3
Reservar fila 2, asiento 3 → ❌ Asiento ocupado: fila 2, asiento 3
Reservar fila 9, asiento 0 → ⚠️ Posición no válida: fila 9, asiento 0. Valores válidos: fila 0–7, asiento 0–9 (números enteros).

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  L  X  L  L  X  X  L  L  X  L
Fila 1 │  X  L  L  X  L  L  X  X  L  X
Fila 2 │  L  L  X  X  X  L  L  L  X  L
Fila 3 │  L  X  L  L  L  X  X  L  L  X
Fila 4 │  X  L  L  X  X  L  L  X  L  L
Fila 5 │  L  L  X  L  L  X  L  L  X  X
Fila 6 │  L  X  L  L  X  L  X  L  L  L
Fila 7 │  X  L  L  X  L  L  L  X  X  L

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 32 · Disponibles: 48 · Total: 80
Comprobaciones (textos exactos de reservarAsiento, ERR-001):
  ✔ OK     mensaje de reserva correcta → ✅ Reserva confirmada: fila 2, asiento 3
  ✔ OK     mensaje de asiento ocupado → ❌ Asiento ocupado: fila 2, asiento 3
  ✔ OK     mensaje de posición no válida → ⚠️ Posición no válida: fila 9, asiento 0. Valores válidos: fila 0–7, asiento 0–9 (números enteros).
  ✔ OK     conteo tras una reserva → [32,48]

=== ESCENARIO 3: Sala casi llena con solo asientos sueltos ===

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  L  X  X  X  X  X  X  X  X  X
Fila 1 │  X  X  X  X  X  L  X  X  X  X
Fila 2 │  X  X  X  X  X  X  X  X  X  X
Fila 3 │  X  X  X  X  X  X  X  X  X  L
Fila 4 │  X  X  X  X  X  X  X  X  X  X
Fila 5 │  X  X  L  X  X  X  X  X  X  X
Fila 6 │  X  X  X  X  X  X  X  X  X  X
Fila 7 │  X  X  X  X  L  X  X  L  X  X

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 74 · Disponibles: 6 · Total: 80
⚠️ No hay dos asientos contiguos libres en ninguna fila. Ofrezca asientos separados.
Comprobaciones:
  ✔ OK     conteo [ocupados, disponibles] → [74,6]
  ✔ OK     sin asientos contiguos → null

Se vende uno de los asientos sueltos:
Reservar fila 1, asiento 5 → ✅ Reserva confirmada: fila 1, asiento 5
Ocupados: 75 · Disponibles: 5 · Total: 80
Comprobaciones:
  ✔ OK     reserva de asiento suelto → ✅ Reserva confirmada: fila 1, asiento 5
  ✔ OK     conteo tras la reserva → [75,5]

=== ESCENARIO 4: Sala completamente llena ===

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  X  X  X  X  X  X  X  X  X  X
Fila 1 │  X  X  X  X  X  X  X  X  X  X
Fila 2 │  X  X  X  X  X  X  X  X  X  X
Fila 3 │  X  X  X  X  X  X  X  X  X  X
Fila 4 │  X  X  X  X  X  X  X  X  X  X
Fila 5 │  X  X  X  X  X  X  X  X  X  X
Fila 6 │  X  X  X  X  X  X  X  X  X  X
Fila 7 │  X  X  X  X  X  X  X  X  X  X

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 80 · Disponibles: 0 · Total: 80
⚠️ No hay dos asientos contiguos libres en ninguna fila. Ofrezca asientos separados.
Reservar fila 4, asiento 4 → ❌ Asiento ocupado: fila 4, asiento 4
Comprobaciones:
  ✔ OK     conteo [ocupados, disponibles] → [80,0]
  ✔ OK     sin asientos contiguos → null
  ✔ OK     reserva rechazada → ❌ Asiento ocupado: fila 4, asiento 4

=== ESCENARIO 5: Flujo real de taquilla (una pareja pide dos asientos juntos) ===
Una pareja pide dos asientos juntos. Buscando...
💑 Asientos contiguos disponibles: fila 0, asientos 0 y 1
Comprobaciones:
  ✔ OK     par propuesto → [[0,0],[0,1]]

Reservando los dos asientos propuestos:
Reservar fila 0, asiento 0 → ✅ Reserva confirmada: fila 0, asiento 0
Reservar fila 0, asiento 1 → ✅ Reserva confirmada: fila 0, asiento 1

        ══════════ PANTALLA ══════════

          0  1  2  3  4  5  6  7  8  9
Fila 0 │  X  X  L  L  L  L  L  L  L  L
Fila 1 │  L  L  L  L  L  L  L  L  L  L
Fila 2 │  L  L  L  L  L  L  L  L  L  L
Fila 3 │  L  L  L  L  L  L  L  L  L  L
Fila 4 │  L  L  L  L  L  L  L  L  L  L
Fila 5 │  L  L  L  L  L  L  L  L  L  L
Fila 6 │  L  L  L  L  L  L  L  L  L  L
Fila 7 │  L  L  L  L  L  L  L  L  L  L

        L = libre · X = ocupado
        ▲ La pantalla está en la parte superior (fila 0 = más cerca)

Ocupados: 2 · Disponibles: 78 · Total: 80
Siguiente pareja. Buscando...
💑 Asientos contiguos disponibles: fila 0, asientos 2 y 3
Comprobaciones:
  ✔ OK     conteo tras reservar la pareja → [2,78]
  ✔ OK     siguiente par contiguo → [[0,2],[0,3]]

=== ESCENARIO EXTRA: Robustez: sala sin filas (matriz vacía) ===
⚠️ La sala no tiene asientos que mostrar.
⚠️ Sala sin asientos: no hay contiguos que buscar.
Comprobaciones:
  ✔ OK     contiguos en matriz vacía → null
  ✔ OK     aviso propio de sala sin asientos → ⚠️ Sala sin asientos: no hay contiguos que buscar.

==========================================
Pruebas superadas: 20/20
==========================================
exit: 0
```

- **Greps de auditoría:**

```text
$ grep -nE "\bclass\b|\binterface\b|new Map|new Set|\bthis\b" src/
(sin resultados, exit 1)

$ grep -nE "\bwhile\b" src/
src/cinema.ts:170: * Recorre las filas de arriba abajo (0 → última) con un bucle `while` que se
src/cinema.ts:183:  while (fila < sala.length && !encontrado) {
src/cinema.ts:186:    while (columna + 1 < asientosDeLaFila.length && !encontrado) {

$ grep -nE "\bfor\b" src/
src/cinema.ts:27: * Construye la matriz con dos bucles `for` anidados: el exterior crea cada
src/cinema.ts:36:  for (let fila = 0; fila < filas; fila++) {
src/cinema.ts:38:    for (let columna = 0; columna < columnas; columna++) {
src/cinema.ts:82:  for (let columna = 0; columna < totalColumnas; columna++) {
src/cinema.ts:88:  for (let fila = 0; fila < totalFilas; fila++) {
src/cinema.ts:90:    for (let columna = 0; columna < totalColumnas; columna++) {
src/cinema.ts:147: * Recorre la matriz completa con dos bucles `for` anidados.
src/cinema.ts:155:  for (let fila = 0; fila < sala.length; fila++) {
src/cinema.ts:156:    for (let columna = 0; columna < sala[fila].length; columna++) {
src/main.ts:63:  for (let fila = 0; fila < sala.length; fila++) {
src/main.ts:64:    for (let columna = 0; columna < sala[fila].length; columna++) {
src/main.ts:79:  for (let indice = 0; indice < posiciones.length; indice++) {
src/main.ts:245:  for (let indice = 0; indice < parPareja.length; indice++) {

$ grep -nE "\bif\b|\belse\b" src/cinema.ts
58:  if (sala.length === 0) {
92:      if (sala[fila][columna] === OCUPADO) {
94:      } else {
122:  if (sala.length === 0) {
131:  if (!filaValida || !columnaValida) {
136:  } else if (sala[fila][columna] === OCUPADO) {
138:  } else {
157:      if (sala[fila][columna] === OCUPADO) {
159:      } else {
187:      if (asientosDeLaFila[columna] === LIBRE && asientosDeLaFila[columna + 1] === LIBRE) {
193:      } else {
216:  if (resultado !== null) {
222:  } else if (sala !== undefined && sala.length === 0) {
224:  } else {
```

- **Prueba de la prueba (no commiteada):** `JSON.stringify([31, 49])` → `JSON.stringify([30, 50])` en el escenario 2. Como `main.ts` tenía cambios pendientes del propio prompt, se revirtió a mano (`sed` inverso) y se comprobó con `cmp` que el fichero quedó idéntico al estado previo.

```text
$ npm run test ; echo "exit: $?"   # con el esperado alterado
=== ESCENARIO 2: Sala parcialmente ocupada (sala del enunciado) ===
  ✘ FALLO  conteo [ocupados, disponibles] → obtenido [31,49], esperado [30,50]
Pruebas superadas: 19/20
exit: 1

$ npm run test ; echo "exit: $?"   # tras revertir
Pruebas superadas: 20/20
exit: 0
```

- **Revisión manual:**
  - Literales de objeto como datos en `src/`: **ninguno**. Las únicas `{` fuera de bloques son interpolaciones `${…}` de template strings y los imports con nombre; el par contiguo y las posiciones son `number[][]`.
  - JSDoc en español: **14/14 funciones** (`cinema.ts`: crearSala, mostrarSala, reservarAsiento, contarAsientos, buscarAsientosContiguos, mensajeResultadoContiguos, mostrarResultadoContiguos; `main.ts`: verificar, llenarSala, liberarPosiciones, encabezado, mostrarConteo, buscarYMostrarContiguos, intentarReserva).
  - Nombres: ninguna variable de una letra (ni siquiera índices: `fila`, `columna`, `indice`); ningún identificador en inglés.
- **`npm audit`:** `5 vulnerabilities (1 moderate, 4 high)`; registrado en "Riesgos conocidos". `esbuild` solo se corrige con `--force` (Vite 8, cambio incompatible); `nanoid`, `postcss` y `source-map-js` tendrían arreglo con `npm audit fix` sin `--force`, no aplicado en este prompt.
- **Errores:** ninguno nuevo (la auditoría no encontró ❌).
- **Estado:** OK
- **Commit:** `d923fc4`

---

## Prompt 6 — README final y npm audit fix

- **Fecha:** 2026-11-09
- **Prompt literal:**

````text
Usa la skill cinema-seat-manager.

0. Mantenimiento previo:
   - SEGUIMIENTO.md: rellena el Commit del Prompt 5 con d923fc4.
   - Ejecuta `npm audit fix` (SIN --force). Después npm run typecheck y npm run test ; echo "exit: $?" deben seguir en verde (20/20, exit 0). Pega el resumen de npm audit antes y después.
   - EVALUACION.md: actualiza el riesgo de npm audit con el estado real tras el fix (qué queda pendiente y por qué). En el criterio 4, la evidencia debe referirse a src/cinema.ts:buscarAsientosContiguos (dos while), no al recuento de líneas del grep (una de ellas es un comentario).
   - Registra el audit fix solo en SEGUIMIENTO.md (mantenimiento, no error).

1. Reescribe README.md en español para alguien que abre el repo por primera vez (evaluador incluido). Secciones:

   - Título y una frase: qué es y para quién (personal de taquilla, sala 8x10).
   - "Verificar en 30 segundos": npm install → npm run test → debe terminar con "Pruebas superadas: 20/20". Y npm run typecheck.
   - Cómo ejecutarlo: Codespaces (el devcontainer instala dependencias) y local (Node 20).
   - Ejemplo real de salida: fragmento corto copiado de npm run test (la sala del enunciado + conteo + par contiguo). No inventes salida: cópiala de una ejecución.
   - API: tabla con firma, qué hace y qué devuelve de TODAS las funciones exportadas de src/cinema.ts (incluidas mostrarResultadoContiguos y mensajeResultadoContiguos).
   - Decisiones de diseño:
     * Solo arreglo bidimensional number[][]; sin objetos ni clases; retornos como tuplas o null.
     * Criterio de "primer par" (recorrido fila a fila) y nota sobre la imagen del enunciado (ERR-000), en dos líneas con enlace a ERRORES.md.
     * Validaciones de reservarAsiento y formato "estado: posición" de los mensajes.
   - Escenarios de prueba: lista breve de los 5 + extra, con el resultado esperado de cada uno.
   - Estructura del proyecto (árbol, sin node_modules) y enlaces a CONTEXT.md, SEGUIMIENTO.md, ERRORES.md, EVALUACION.md.
   - Desarrollo asistido por IA: el proyecto se construyó con Claude Code mediante prompts secuenciales documentados en SEGUIMIENTO.md; los errores y su resolución están en ERRORES.md; la skill del proyecto está en .claude/skills/cinema-seat-manager/.
   - Autor: Daniel Ochoa Díaz.

   Reglas: sin badges ni restos de la plantilla typescript-hello; no dupliques la tabla de EVALUACION.md, enlázala; que se lea en 2 minutos.

2. SEGUIMIENTO.md: entrada del Prompt 6, Commit "pendiente (se registra en el Prompt 7)".

Cierra con un único commit + push:
docs: redactar README final y aplicar npm audit fix
(cuerpo: "Prompt 6: README con verificación rápida, API, decisiones de diseño, escenarios y trazabilidad del desarrollo con IA; npm audit fix sin --force; evidencia del criterio 4 por función.")
Enséñame `git log --oneline -2` y `git status -sb`.
````

- **Objetivo:** redactar el README definitivo para quien abre el repositorio por primera vez (evaluador incluido), aplicar `npm audit fix` sin `--force` y ajustar la evidencia del criterio 4.
- **Ficheros modificados:**
  - `README.md`: reescrito (verificación rápida, ejecución, salida real, API de las 7 funciones exportadas, decisiones de diseño, escenarios, estructura, desarrollo con IA, autor).
  - `package-lock.json`: `npm audit fix` (sin `--force`).
  - `EVALUACION.md`: criterio 4 con evidencia por función (`src/cinema.ts:buscarAsientosContiguos`, dos `while`) en lugar del recuento del grep; riesgo de `npm audit` con el estado real tras el fix.
  - `SEGUIMIENTO.md`: hash del Prompt 5 y esta entrada.
- **Ficheros creados:** ninguno.
- **Mantenimiento — `npm audit fix` (sin `--force`):**
  - Paquetes actualizados en `package-lock.json`: `nanoid` 3.3.11 → 3.3.20, `postcss` 8.5.6 → 8.5.32, `source-map-js` 1.2.1 → 1.2.2.
  - Resumen **antes**:

```text
esbuild  <=0.24.2 || 0.27.3 - 0.28.0
Severity: moderate
fix available via `npm audit fix --force`
Will install vite@8.3.7, which is a breaking change
  vite  <=6.4.3
nanoid  <=3.3.17
Severity: high
fix available via `npm audit fix`
postcss  <=8.5.22
Severity: high
fix available via `npm audit fix`
source-map-js  1.0.0 - 1.2.1
Severity: high
fix available via `npm audit fix`
5 vulnerabilities (1 moderate, 4 high)
```

  - Resumen **después**:

```text
esbuild  <=0.24.2 || 0.27.3 - 0.28.0
Severity: moderate
fix available via `npm audit fix --force`
Will install vite@8.3.7, which is a breaking change
  vite  <=6.4.3
2 vulnerabilities (1 moderate, 1 high)
```

  - Quedan 2 entradas y no solo `esbuild`: `vite <=6.4.3` aparece como **high** por avisos propios de su servidor de desarrollo (path traversal en `.map`, `server.fs.deny`/`allow`, `launch-editor` en Windows), además de depender de `esbuild`. Antes del fix también estaba, anidado bajo `esbuild`. Ambos solo se corrigen con `--force` (Vite 8, cambio incompatible), que no se aplica. Ninguno afecta a la CLI: `tsx` usa `esbuild` 0.27.7 solo para transpilar, sin servidor.
- **README — fragmento de salida:** copiado de una ejecución real de `npm run test`; comprobado con `diff` entre el bloque del README y la salida → idéntico (19 líneas). Sin restos de la plantilla (`grep -niE "typescript-hello|badge|shields|rigo"` → vacío).
- **`npm run typecheck`:** `tsc --noEmit` → exit 0 (tras el audit fix).
- **`npm run test ; echo "exit: $?"`:** `Pruebas superadas: 20/20` / `exit: 0` (tras el audit fix).
- **Checklist anti-objetos:** sin cambios en `src/`; `grep -nE "\bclass\b|\binterface\b|new Map|new Set" src/` → vacío.
- **Errores:** ninguno.
- **Estado:** OK
- **Commit:** `f5d3739`

---

## Prompt 6b — Separar entregas

- **Fecha:** 2026-11-09
- **Prompt literal:**

````text
Usa la skill cinema-seat-manager. Trabaja en main.

Vamos a separar el proyecto en dos entregas para que los instructores puedan revisar ambas:
- Entrega 1 (evaluable): rama main + tag v1.0-base. CLI en TypeScript, Prompts 1–6.
- Entrega 2 (opcional, no evaluable): rama interfaz-web + tag v2.0-web + Pull Request hacia main SIN fusionar. Interfaz web (Prompt 7).

1. SEGUIMIENTO.md: rellena el Commit del Prompt 6 con f5d3739.

2. README.md: añade, justo después de "Verificar en 30 segundos", una sección "Entregas" con:
   - Una tabla: Entrega | Qué incluye | Dónde está | Cómo ejecutarla.
     * 1 · Base (evaluable): gestor de asientos por consola; matriz 8x10, reservas con validación, conteo, búsqueda de contiguos, 5 escenarios de prueba. Dónde: rama main, tag v1.0-base. Cómo: npm install → npm run test.
     * 2 · Interfaz web (opcional, fuera de evaluación): mapa de sala clicable para taquilla con HTML + Tailwind, reutilizando src/cinema.ts. Dónde: rama interfaz-web, tag v2.0-web, Pull Request abierto hacia main. Cómo: git fetch && git switch interfaz-web → npm install → npm run dev → pestaña Puertos, puerto 5173 (privado).
   - Enlaces relativos al repo: la rama (../../tree/interfaz-web), la comparación de cambios (../../compare/main...interfaz-web) y las releases (../../releases).
   - Cómo abrir cada entrega en Codespaces: botón Code → Codespaces → elegir la rama (main o interfaz-web) antes de crear el codespace.
   - Una nota: "main es la versión evaluada. La rama interfaz-web añade además liberarAsiento y su escenario de prueba, por eso su total de pruebas es mayor."
   - Aclara que la Entrega 2 parte de la Entrega 1 y no modifica su comportamiento.

3. EVALUACION.md: añade una línea al inicio: "Este documento evalúa la Entrega 1 (rama main, tag v1.0-base)."

4. SEGUIMIENTO.md: entrada del Prompt 6b, Commit "pendiente (se registra en el Prompt 8)".

5. npm run typecheck y npm run test ; echo "exit: $?" en verde (20/20).

6. Commit + push en main:
   docs: describir entregas separadas en el README
   (cuerpo: "Prompt 6b: Entrega 1 evaluable en main (tag v1.0-base) y Entrega 2 web opcional en rama interfaz-web (tag v2.0-web, PR sin fusionar).")

7. Crea y sube el tag anotado sobre ese commit:
   git tag -a v1.0-base -m "Entrega 1: gestor de asientos por consola (evaluable)"
   git push origin v1.0-base

8. Crea la release con gh (si gh no tiene permisos, dímelo y no insistas; el tag basta):
   gh release create v1.0-base --title "Entrega 1 · Base evaluable (CLI)" --notes "Gestor de asientos por consola en TypeScript. Verificación: npm install && npm run test → Pruebas superadas: 20/20. Criterios: ver EVALUACION.md."

Enséñame git log --oneline -2, git tag -n y git status -sb.
````

- **Objetivo:** separar el proyecto en dos entregas revisables: Entrega 1 evaluable (`main`, tag `v1.0-base`) y Entrega 2 web opcional (rama `interfaz-web`, tag `v2.0-web`, PR sin fusionar, Prompt 7).
- **Ficheros modificados:**
  - `README.md`: sección "Entregas" tras "Verificar en 30 segundos" (tabla, enlaces relativos a la rama / comparación / releases, Codespaces por rama, nota sobre `liberarAsiento` y el total de pruebas).
  - `EVALUACION.md`: línea inicial "Este documento evalúa la Entrega 1 (rama main, tag v1.0-base)."
  - `SEGUIMIENTO.md`: hash del Prompt 6 y esta entrada.
- **Ficheros creados:** ninguno.
- **Nota:** los enlaces a `interfaz-web` (rama y comparación) devuelven 404 hasta que la rama exista (Prompt 7). Se mantienen a propósito.
- **Tag:** `v1.0-base` (anotado) sobre el commit de este prompt, subido a `origin`.
- **Release:** no creada desde este entorno: `gh` no está instalado (`command -v gh` → sin resultado). El tag `v1.0-base` fija la entrega; la release puede crearse desde la web de GitHub si la cuenta tiene permisos en la organización.
- **`npm run typecheck`:** `tsc --noEmit` → exit 0.
- **`npm run test ; echo "exit: $?"`:** `Pruebas superadas: 20/20` / `exit: 0`.
- **Checklist anti-objetos:** sin cambios en `src/`; grep → vacío.
- **Errores:** ninguno.
- **Estado:** OK
- **Commit:** `303cef2`

---

## Prompt 7c — Cómo ver cada versión (README en `main` e `interfaz-web`)

- **Fecha:** 2026-11-09
- **Rama de esta entrada:** `main`. El mismo prompt se aplica en `main` y en `interfaz-web`, con un commit en cada rama.
- **Prompt literal:**

````text
Usa la skill cinema-seat-manager. Vamos a añadir al README una sección "Cómo ver cada versión" IDÉNTICA en main y en interfaz-web. Solo documentación: no toques código, tsconfig ni package.json. Los tags existentes (v1.0-base, v2.0-web, v2.1-web) NO se mueven.

1. Texto de la sección (mismo contenido en ambas ramas), justo después de "Verificar en 30 segundos" (sustituye a la sección "Entregas" si existe, conservando su información):

## Cómo ver cada versión
Introducción de 2 líneas: el proyecto tiene tres versiones; la evaluada es la 1; la 2 es el reto extra tal como lo pide el enunciado; la 3 es una mejora propia sobre la 2.

Tabla: Versión | Qué es | Evaluada | Dónde (rama/tag con enlace relativo) | Comando
- 1 · Consola — gestor de asientos por línea de comandos (matriz 8x10, reservas, conteo, contiguos, 5 escenarios). Sí. main · tag v1.0-base. npm run test
- 2 · Web básica (reto extra solicitado) — mapa clicable con HTML + Tailwind reutilizando src/cinema.ts. No. tag v2.0-web. npm run dev
- 3 · Web mejorada — cartelera de película inventada, butacas de cine, pantalla curva, panel de taquilla. No. rama interfaz-web · tag v2.1-web. npm run dev

Subsección "Verlo sin ejecutar nada": una captura por versión (ver punto 2) y enlaces relativos al código de cada tag (../../tree/v1.0-base, ../../tree/v2.0-web, ../../tree/v2.1-web) y al Pull Request abierto (../../pulls).

Subsección "Ejecutarlo en Codespaces", paso a paso para cada versión:
- Versión 1: git switch main → npm install → npm run test → debe terminar con "Pruebas superadas: 20/20".
- Versión 2: git fetch --tags → git switch --detach v2.0-web → npm install → npm run dev → pestaña Puertos → puerto 5173 → icono del globo.
- Versión 3: git switch interfaz-web → npm install → npm run dev → igual que la 2. Recargar con Ctrl+Shift+R si se veía otra versión antes.
- Volver: Ctrl+C para parar el servidor y git switch main.
- Notas: npm install al cambiar de versión porque las dependencias pueden variar; "--detach" deja el repo en modo solo lectura de esa versión (es normal el aviso de "detached HEAD"); el puerto debe quedarse en Privado.

Subsección "Ejecutarlo en local": requisitos (Node 20, git) y los mismos pasos tras git clone.

Nota final: el total de pruebas es 20/20 en la versión 1 y 25/25 en las versiones 2 y 3 (añaden liberarAsiento y su escenario).

2. Capturas:
   - Crea la carpeta docs/capturas/ y referencia en el README estos ficheros: v1-consola.png, v2-web-basica.png, v3-web-mejorada.png, v3-web-mejorada-movil.png.
   - Si los ficheros no existen todavía, NO inventes imágenes: deja las referencias y dime exactamente qué captura tengo que hacer y dónde subirla. Las subiré yo y luego harás un commit con ellas.

3. Aplicación en las dos ramas:
   a) En main: edita el README, actualiza SEGUIMIENTO.md (entrada Prompt 7c, Commit "pendiente (se registra en el Prompt 8)"), npm run test (20/20), commit + push:
      docs: explicar cómo ver cada versión en el README
      (cuerpo: "Prompt 7c: tabla de versiones (consola evaluada, web básica, web mejorada), pasos para Codespaces y local, capturas en docs/capturas.")
   b) En interfaz-web: misma sección, palabra por palabra (compruébalo con diff de esa sección entre ramas), SEGUIMIENTO.md, npm run test (25/25), commit + push con el mismo mensaje.

4. Enséñame: git log --oneline -1 main, git log --oneline -1 interfaz-web, git tag -n, el diff de la sección entre ramas (debe estar vacío) y git status -sb. Termina en la rama main.
````

- **Objetivo:** explicar en el README cómo ver las tres versiones del proyecto (1 consola evaluada, 2 web básica, 3 web mejorada), con una sección idéntica en ambas ramas.
- **Ficheros creados:** `docs/capturas/.gitkeep` (para que la carpeta exista en el repositorio; git no versiona carpetas vacías).
- **Ficheros modificados:** `README.md` (la sección "Entregas" se sustituye por "Cómo ver cada versión", conservando su información: ramas, tags, PR, Codespaces por rama y que las versiones web no cambian la 1; el árbol incluye `docs/capturas/`), `SEGUIMIENTO.md` (esta entrada).
- **Sin cambios:** código, `tsconfig.json`, `package.json` y tags existentes.
- **Decisiones:**
  - El paso `git clone` de "Ejecutarlo en local" usa la URL real del repositorio en lugar de un marcador.
  - Las capturas se muestran en dos tablas de 2 columnas (consola y web básica; web mejorada en escritorio y móvil).
  - La sección se escribió una sola vez y se insertó igual en las dos ramas; se comprobó con `diff` entre ramas (vacío).
- **Capturas:** las cuatro referencias (`docs/capturas/v1-consola.png`, `v2-web-basica.png`, `v3-web-mejorada.png`, `v3-web-mejorada-movil.png`) **aún no existen**; no se han generado imágenes. Las subirá el usuario y se commitearán en un prompt posterior. Hasta entonces el README muestra las imágenes rotas.
- **`npm run typecheck`:** exit 0.
- **`npm run test ; echo "exit: $?"`:** `Pruebas superadas: 20/20` / `exit: 0`.
- **Errores:** ninguno.
- **Estado:** OK
- **Commit:** `1617114`

---

## Prompt 8a — README unificado y versión 3 en `v2.2-web` (rama `main`)

- **Fecha:** 2026-11-09
- **Rama de esta entrada:** `main`. Los puntos 2–4 del prompt (cabecera web, butaca propuesta, tag `v2.2-web`) se aplican en `interfaz-web` y se registran en el SEGUIMIENTO de esa rama.
- **Prompt literal:**

````text
Usa la skill cinema-seat-manager. NUNCA muevas ni borres tags existentes.

1. En main:
   - README.md: elimina la sección antigua "Cómo ejecutarlo" (su contenido ya está en "Cómo ver cada versión"); si contiene algo que no esté en la nueva, intégralo ahí y dime qué era. Revisa que ningún enlace interno del README apunte a la sección eliminada.
   - En la tabla de "Cómo ver cada versión", la versión 3 pasa a ser: rama interfaz-web · tag v2.2-web (en lugar de v2.1-web).
   - SEGUIMIENTO.md: rellena el Commit del Prompt 6b con 303cef2 y el del Prompt 7c (main) con 1617114. Añade la entrada del Prompt 8a con Commit "pendiente (se registra en el Prompt 8b)".
   - npm run typecheck y npm run test (20/20). Commit + push:
     docs: unificar instrucciones de ejecución y apuntar a v2.2-web
     (cuerpo: "Prompt 8a: elimina la sección duplicada 'Cómo ejecutarlo' y actualiza el tag de la versión 3.")

2. En interfaz-web (git switch interfaz-web):
   - Mismos cambios de README que en main. La sección "Cómo ver cada versión" debe seguir siendo idéntica entre ramas (compruébalo con diff).
   - Cabecera de la web: el texto de ayuda "Clic o Enter para reservar · flechas para moverse" se corta por la derecha. Corrígelo para que nunca desborde: en anchos estrechos baja debajo del título o se divide en líneas; en móvil puede ocultarse si la misma ayuda aparece en otro lugar visible. Revisa también que ningún otro elemento de la cabecera o del panel provoque scroll horizontal de la página.

3. (Opcional — bórralo si no lo quieres) Butaca propuesta: quita el ✓ porque puede confundirse con "ya reservada". Mantén el relleno ámbar y el contorno grueso, y actualiza la leyenda a "Propuesta (borde grueso)". El aria-label sigue diciendo "propuesto". Ajusta las comprobaciones que dependan del ✓.

4. Sigue en interfaz-web:
   - src/cinema.ts y src/main.ts NO se tocan. npm run typecheck y npm run test (25/25).
   - SEGUIMIENTO.md: rellena el Commit del Prompt 7b con d06e98e y el del Prompt 7c (rama) con f5dfe52. Entrada del Prompt 8a con Commit "pendiente (se registra en el Prompt 8b)".
   - Commit + push:
     fix(web): evitar desbordamiento de la cabecera y unificar README
     (cuerpo: "Prompt 8a: la ayuda de la cabecera ya no se corta; [si aplica: butaca propuesta sin ✓]; README sin sección duplicada.")
   - Tag nuevo: git tag -a v2.2-web -m "Versión 3 final: web mejorada" && git push origin v2.2-web

5. Vuelve a main. Enséñame:
   git log --oneline -1 main, git log --oneline -1 interfaz-web, git show-ref --tags -d (los tres tags antiguos no deben haberse movido), el diff de la sección entre ramas (vacío) y git status -sb.
   Dime qué has podido verificar tú de la cabecera y qué tengo que mirar yo en el navegador (a 1280 px, a 1024 px y a 390 px).
````

- **Objetivo:** quitar la sección duplicada "Cómo ejecutarlo" del README y apuntar la versión 3 al tag `v2.2-web`.
- **Ficheros modificados:**
  - `README.md`: eliminada "Cómo ejecutarlo". Dos datos suyos no estaban en "Cómo ver cada versión" y se han integrado ahí: que el devcontainer (Node 20) ejecuta `npm install` automáticamente al crear el Codespace, y que `npm run console` ejecuta el mismo guion (`tsx src/main.ts`). La versión 3 pasa a `rama interfaz-web · tag v2.2-web` (tabla y enlaces "Código de cada versión"). Ningún enlace interno (`](#…)`) apuntaba a la sección eliminada.
  - `SEGUIMIENTO.md`: hashes del Prompt 6b (`303cef2`) y del Prompt 7c en `main` (`1617114`); esta entrada.
- **Ficheros creados:** ninguno. **Tags:** ninguno movido ni borrado.
- **Nota:** el enlace a `v2.2-web` devuelve 404 hasta que se cree el tag en `interfaz-web` (mismo prompt).
- **`npm run typecheck`:** exit 0.
- **`npm run test ; echo "exit: $?"`:** `Pruebas superadas: 20/20` / `exit: 0`.
- **Errores:** ninguno.
- **Estado:** OK
- **Commit:** `3fe046a`

---

## Prompt 8b — Evaluación final independiente (rama `main`)

- **Fecha:** 2026-11-09
- **Prompt literal:**

`````text
Trabaja en main (git switch main). Vamos a hacer la evaluación final de la Entrega 1 con un evaluador independiente.

1. Lanza un subagente (herramienta Task/Agent, tipo general-purpose) con contexto limpio y EXACTAMENTE estas instrucciones:

---
Eres evaluador de 4Geeks Academy. Evalúa con rigor el proyecto "Cinema Seat Manager en TypeScript" de este repositorio (rama main). No conoces a su autor ni su historia.

REGLAS:
- NO leas EVALUACION.md, SEGUIMIENTO.md, ERRORES.md, CONTEXT.md, CLAUDE.md ni .claude/ antes de emitir tu veredicto. Evalúa solo el código, el README y lo que ejecutes.
- Cada veredicto necesita evidencia: comando + fragmento de salida, o fichero:función + fragmento de código.
- Si dudas, marca "Parcial" y explica por qué. No regales puntos.

PASOS:
a) Clon limpio: git clone de este repositorio en /tmp/eval-final, npm ci, npm run typecheck, npm run test ; echo "exit: $?".
b) Integridad de la entrega: git diff v1.0-base main -- src/ package.json tsconfig.json debe estar vacío (lo evaluado = lo etiquetado).
c) Lee src/cinema.ts y src/main.ts completos.
d) Casos propios no presentes en main.ts (créalos en /tmp, nunca en el repo): fila negativa, decimal, NaN, columna 10, reservar dos veces, una fila con libres alternos (no debe proponer par en ella), un par en la última columna posible (8,9), sala con un único par al final de la última fila.

ENUNCIADO (requisitos):
- Función que inicializa una matriz 8 filas x 10 columnas. Ocupado = 1, disponible = 0.
- Función que muestra la sala por consola con X ocupado, L libre e índices de fila y columna.
- Función para reservar dado fila y columna (0 → 1), que valide si ya está ocupado y devuelva un mensaje de éxito o fallo.
- Función que cuenta y devuelve ocupados y disponibles.
- Función que busca dos asientos libres contiguos horizontalmente en la misma fila, devuelve sus posiciones, devuelve el primero si hay varios e indica claramente si no hay.
- Pruebas: sala vacía, parcialmente ocupada, casi llena con solo asientos sueltos, completamente llena. Mensajes claros para cada operación. Comentarios que expliquen cada función.
- IMPORTANTE: no usar objetos ni clases; datos de asientos solo en un arreglo bidimensional (JSON solo para metadatos).

CRITERIOS DE EVALUACIÓN (puntúa cada uno: Cumple / Parcial / No cumple):
1. Uso correcto de un arreglo bidimensional (matriz) para representar los asientos del cine.
2. Implementación adecuada de funciones con parámetros y valores de retorno.
3. Uso correcto de sentencias condicionales (if, else) para validar la disponibilidad de los asientos.
4. Uso correcto de bucles (for, while) para procesar y mostrar la matriz de asientos.
5. Que la función de búsqueda identifique correctamente asientos contiguos libres de forma horizontal.
6. Que el código sea legible, con nombres de variables y funciones significativos.
7. Que el programa se ejecute sin errores y produzca la salida esperada al probarlo.
8. Que la salida por consola sea clara y útil para el personal del cine que vaya a usar el sistema.

ENTREGA tu informe con:
- Tabla: Criterio | Veredicto | Evidencia | Observaciones.
- Tabla de requisitos del enunciado: Requisito | Veredicto | Evidencia.
- Restricción "sin objetos ni clases": veredicto + evidencia.
- Resultado de tus casos propios.
- Hallazgos ordenados por gravedad (bloqueante / mejora / cosmético). Si no hay, dilo.
- Veredicto global: APTO / APTO CON OBSERVACIONES / NO APTO.
---

2. Cuando el subagente termine:
   - Compara su informe con la tabla existente de EVALUACION.md. Lista las discrepancias (criterios donde el evaluador independiente da menos nota que la autoevaluación).
   - Añade AL FINAL de EVALUACION.md una sección "## Evaluación final independiente" con: fecha, commit evaluado (hash de main), confirmación de integridad respecto a v1.0-base, método (subagente con contexto limpio, sin acceso a la documentación interna), su informe completo, las discrepancias encontradas y el veredicto global.
   - No modifiques la autoevaluación anterior: las dos quedan visibles.
   - Si hay hallazgos BLOQUEANTES: NO los corrijas en este prompt. Regístralos en ERRORES.md, dime cuáles son y para. Decidiremos juntos si se corrige (implicaría una nueva versión v1.1-base).
   - Los hallazgos de mejora o cosméticos quedan documentados, sin cambiar código.

3. SEGUIMIENTO.md: entrada del Prompt 8b; rellena el Commit del Prompt 8a (main) con su hash. Commit + push en main:
   docs: añadir evaluación final independiente
   (cuerpo: "Prompt 8b: evaluación de la Entrega 1 por subagente con contexto limpio; integridad respecto a v1.0-base; veredicto y discrepancias con la autoevaluación.")

Enséñame: el veredicto global, la tabla de los 8 criterios del evaluador, las discrepancias, git log --oneline -1 y git status -sb.
`````

- **Objetivo:** que un evaluador independiente, sin acceso a la documentación interna ni a la historia del desarrollo, evalúe la Entrega 1 y contrastar su resultado con la autoevaluación.
- **Método:** subagente `general-purpose` lanzado con las instrucciones del prompt, literales. Trabajó sobre un clon limpio en `/tmp/eval-final` y con casos propios en `/tmp/eval-casos`, sin tocar el repositorio.
- **Commit evaluado:** `3fe046a`. **Integridad:** `git diff v1.0-base main -- src/ package.json tsconfig.json` → vacío (comprobado por el evaluador y por el autor).
- **Resultado:** **APTO**. Los 8 criterios y los 8 requisitos dan "Cumple"; la restricción "sin objetos ni clases" también se cumple; los 12 casos propios dan el resultado correcto (uno, `[[]]`, fuera del enunciado, con un mensaje incoherente menor).
- **Hallazgos:** ninguno bloqueante.
  - **Mejora:** plantilla web residual en `main` (`index.html` "Hello World with Typescript" que carga `/rigo-baby.jpg`, inexistente, y ejecuta `main.ts` en el navegador); avisos de `npm audit`.
  - **Cosméticos:** rango "0–-1" con `[[]]`; "L" para valores distintos de 0/1; referencia "ERR-001" en la salida; "test" como guion propio.
- **Discrepancias con la autoevaluación:** ningún criterio con menor nota. Hay cuatro hallazgos que la autoevaluación no recogía; el principal es la plantilla residual de `index.html` en `main`, que el autor confirmó (`grep -n "rigo-baby" index.html` → línea 14).
- **Ficheros modificados:** `EVALUACION.md` (sección final "Evaluación final independiente", con el informe completo; la autoevaluación anterior no se toca), `SEGUIMIENTO.md` (hash del Prompt 8a en `main` y esta entrada).
- **Sin cambios de código.** `ERRORES.md` no cambia: solo se registrarían hallazgos bloqueantes, y no los hay.
- **`npm run typecheck`:** exit 0. **`npm run test`:** `Pruebas superadas: 20/20`, exit 0.
- **Estado:** OK
- **Commit:** `a862aba`

---

## Prompt 8c — `index.html` mínima en la versión de consola (rama `main`)

- **Fecha:** 2026-11-09
- **Rama de esta entrada:** `main` (parte A). La parte B se registra en el SEGUIMIENTO de `interfaz-web`.
- **Prompt literal** (llegó cortado al final, en el punto 10: "…reservar el". En el Prompt 8d se completa con el final literal facilitado por el usuario: "propuesto, deshacer). NO crees tags: …" hasta "…git status -sb."; no se ha inventado texto):

`````text
Usa la skill cinema-seat-manager. NUNCA muevas ni borres tags existentes. Etiqueta solo después de que yo confirme en el navegador.

PARTE A — main (git switch main)
1. index.html: sustitúyelo por una página mínima con Tailwind (la de la plantilla carga /rigo-baby.jpg, que no existe, y ejecuta el guion de consola en el navegador). Contenido: título "Cinema Seat Manager · Versión 1 (consola)", explicación de que esta versión se usa con `npm run test` en la terminal, y enlaces a las versiones web (rama interfaz-web y tags v2.0-web / v2.2-web en GitHub). No debe importar src/main.ts. No toques src/, package.json ni tsconfig.json.
2. Verifica: git diff v1.0-base -- src/ package.json tsconfig.json vacío; npm run typecheck; npm run test (20/20); vite build.
3. EVALUACION.md: en la sección "Evaluación final independiente", añade una nota de seguimiento: el hallazgo "restos de la plantilla web en main" queda resuelto en v1.1-base; src/ idéntico al evaluado (con el diff vacío como evidencia). Los tres hallazgos cosméticos quedan documentados sin cambios para no alterar el código evaluado.
4. SEGUIMIENTO.md: rellena el Commit del Prompt 8b con a862aba; entrada del Prompt 8c (main).
5. Commit + push (SIN tag todavía):
   fix: sustituir index.html de plantilla en la versión de consola
   (cuerpo: "Prompt 8c: resuelve el hallazgo de la evaluación independiente; src/ sin cambios respecto a v1.0-base.")

PARTE B — interfaz-web (git switch interfaz-web)
6. "Buscar 2 juntos":
   - Problema: cada pulsación propone el mismo par y repite la entrada en el registro.
   - NO modifiques buscarAsientosContiguos ni nada de src/cinema.ts.
   - En web.ts: guarda las posiciones de los pares ya propuestos en un number[][] (paresRechazados). Para buscar la siguiente opción, crea una COPIA de la sala (bucles, sin mutar la original), marca como 1 las posiciones rechazadas y llama a buscarAsientosContiguos(copia).
   - Tras la primera búsqueda, el botón pasa a "Otra opción". El registro solo anota un par cuando es nuevo.
   - Si no quedan más pares: mensaje "No hay más parejas disponibles; volvemos a la primera opción." y reinicia paresRechazados (la siguiente pulsación vuelve a proponer el primero).
   - Cualquier reserva, anulación, deshacer o nueva sesión reinicia la búsqueda (el botón vuelve a "Buscar 2 juntos").
   - Si la sala no tiene ningún par, sigue mostrando el mensaje actual de "no hay contiguos".
7. Desbordamiento: medido en mi navegador con getBoundingClientRect, ningún elemento sobrepasa innerWidth y scrollWidth > innerWidth es false. El arreglo del 8a funciona: NO cambies el layout. Anótalo en SEGUIMIENTO.md como verificación manual del 8a.
8. Verifica: src/cinema.ts y src/main.ts sin cambios (diff vacío respecto a v2.2-web); npm run typecheck; npm run test (25/25); vite build. Actualiza README (sección web: comportamiento de "Otra opción"), SEGUIMIENTO.md (entrada 8c rama; rellena el Commit del Prompt 8a rama con e433b74).
9. Commit + push (SIN tag todavía):
   fix(web): proponer otra pareja en cada búsqueda
   (cuerpo: "Prompt 8c: 'Otra opción' recorre los pares disponibles reutilizando buscarAsientosContiguos sobre una copia de la sala; registro sin duplicados.")

PARTE C — antes de etiquetar
10. Deja arrancado npm run dev en interfaz-web y dime qué tengo que comprobar en el navegador (pulsar "Otra opción" varias veces hasta el reinicio, reservar el propuesto, deshacer). NO crees tags: te los pediré cuando confirme que todo está bien.

Enséñame git log --oneline -1 main, git log --oneline -1 interfaz-web y git status -sb.
`````

- **Objetivo:** resolver el hallazgo "restos de la plantilla web en `main`" de la evaluación independiente sin tocar el código evaluado.
- **Ficheros modificados:**
  - `index.html`: página mínima con Tailwind (`<link rel="stylesheet" href="/src/style.css">`, sin scripts): título "Cinema Seat Manager · Versión 1 (consola)", cómo usar `npm run test` y enlaces absolutos a GitHub para `v2.0-web`, `v2.2-web` y la rama `interfaz-web`. Modo claro / oscuro.
  - `EVALUACION.md`: nota "Seguimiento de los hallazgos" al final de la evaluación independiente.
  - `SEGUIMIENTO.md`: hash del Prompt 8b (`a862aba`) y esta entrada.
- **Sin cambios:** `src/`, `package.json`, `tsconfig.json`. Tags existentes sin mover.
- **Verificación:**
  - `git diff v1.0-base -- src/ package.json tsconfig.json` → vacío.
  - `npm run typecheck` → exit 0; `npm run test` → `Pruebas superadas: 20/20`.
  - `vite build` → OK; `dist/index.html` sin `<script>` y sin referencias a `rigo` ni a `main.ts` (`dist/` borrado después).
- **Tag `v1.1-base`:** **no creado**; queda a la espera de que el usuario confirme la página en el navegador.
- **Errores:** ninguno.
- **Estado:** OK
- **Commit:** `5a2bf1a`

---

## Prompt 8d — Cierre de la entrega con tags finales (rama `main`)

- **Fecha:** 2026-11-09
- **Rama de esta entrada:** `main`. El mismo prompt se aplica en `main` y en `interfaz-web`, con un commit en cada una.
- **Prompt literal:**

````text
Usa la skill cinema-seat-manager. Ya he verificado en el navegador las versiones 1 y 3. Cerramos SIN capturas. NO muevas tags existentes.

1. SEGUIMIENTO.md (ambas ramas): el prompt del 8c llegó truncado. Completa su texto literal con este final exacto y anótalo:
   "propuesto, deshacer). NO crees tags: te los pediré cuando confirme que todo está bien.

   Enséñame git log --oneline -1 main, git log --oneline -1 interfaz-web y git status -sb."
   Rellena los Commit del 8c: main 5a2bf1a, rama 6d98cd8. Añade la decisión "las parejas propuestas no se solapan" en la entrada 8c de la rama.
2. Ambas ramas: elimina del README todas las referencias a docs/capturas/ (la subsección "Verlo sin ejecutar nada" queda solo con los enlaces al código de cada tag y al PR), borra docs/capturas/ con su .gitkeep y quítala del árbol del proyecto.
3. main: README → versión 1 apunta a v1.1-base y versión 3 a v2.3-web. Entrada 8d en SEGUIMIENTO.md (nota: el último commit de cada rama no puede registrar su propio hash). Verifica diff vacío de src/ package.json tsconfig.json frente a v1.0-base, typecheck y test 20/20. Commit + push: "docs: cerrar entrega con tags finales".
4. interfaz-web: mismos cambios de README (la sección compartida debe ser idéntica: compruébalo con diff), entrada 8d, typecheck y test 25/25. Commit + push con el mismo mensaje.
5. Tags anotados sobre esos dos commits y push:
   v1.1-base "Entrega 1 final: consola (evaluable)" en main
   v2.3-web "Versión 3 final: web mejorada" en interfaz-web
6. Termina en main. Enséñame git show-ref --tags -d, git log --oneline -3 main, git log --oneline -3 interfaz-web y git status -sb.
````

- **Objetivo:** cerrar la entrega sin capturas: completar el registro del 8c, quitar las referencias a `docs/capturas/`, apuntar las versiones 1 y 3 a sus tags finales y etiquetar.
- **Verificación en navegador:** el usuario confirmó las versiones 1 y 3.
- **Ficheros modificados:**
  - `README.md`: "Verlo sin ejecutar nada" queda solo con los enlaces al código de cada tag y al PR (sin tablas de capturas); versión 1 → `v1.1-base`, versión 3 → `v2.3-web` (tabla y enlaces); `docs/capturas/` fuera del árbol del proyecto. La sección "Cómo ver cada versión" es idéntica en las dos ramas (comprobado con `diff`).
  - `EVALUACION.md` (nota de seguimiento: tag `v1.1-base` creado), `SEGUIMIENTO.md`: final literal del prompt del 8c, hash del 8c (`5a2bf1a`) y esta entrada.
- **Ficheros borrados:** `docs/capturas/.gitkeep` (y con él la carpeta `docs/`).
- **Sin cambios:** `src/`, `package.json`, `tsconfig.json`. Tags existentes sin mover.
- **Verificación:** `git diff v1.0-base -- src/ package.json tsconfig.json` → vacío; `npm run typecheck` → exit 0; `npm run test` → `Pruebas superadas: 20/20`.
- **Tag:** `v1.1-base` (anotado) sobre el commit de esta entrada.
- **Nota:** el último commit de cada rama no puede registrar su propio hash (cambiaría al escribirlo). El de este prompt queda en `git log` y en el tag `v1.1-base`.
- **Errores:** ninguno.
- **Estado:** OK
- **Commit:** no registrable (último commit de la rama; ver tag `v1.1-base`)
