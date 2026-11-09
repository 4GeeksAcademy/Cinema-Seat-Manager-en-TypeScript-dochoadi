# SEGUIMIENTO — Registro de prompts

Registro cronológico de cada prompt aplicado al repositorio, según el protocolo de [.claude/skills/cinema-seat-manager/SKILL.md](.claude/skills/cinema-seat-manager/SKILL.md).

## Resumen

| Nº | Objetivo | Estado |
|----|----------|--------|
| 1 | Limpieza de plantilla, contexto, skill y esqueleto de documentación | OK |
| 1b | Regla de commit por prompt y sincronización de package-lock.json | OK |

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
- **Commit:** _pendiente_

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
- **Commit:** _pendiente_
