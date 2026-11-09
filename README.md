# Cinema Seat Manager en TypeScript

Prototipo de línea de comandos para que el **personal de taquilla** de un cine independiente gestione las reservas de una **sala de 8 filas x 10 asientos**: ver la sala, reservar, contar ocupación y encontrar dos asientos juntos para una pareja.

> **Estás en la rama `interfaz-web` (Entrega 2, opcional, fuera de evaluación).** Incluye todo lo de la Entrega 1 más una interfaz web de taquilla y la función `liberarAsiento`. La versión evaluada es la rama `main` (tag `v1.0-base`).

## Verificar en 30 segundos

```bash
npm install
npm run test        # en esta rama: "Pruebas superadas: 25/25" (exit 0); en main: 20/20
npm run typecheck   # tsc --noEmit, sin errores
```

## Entregas

| Entrega | Qué incluye | Dónde está | Cómo ejecutarla |
|---------|-------------|------------|-----------------|
| **1 · Base (evaluable)** | Gestor de asientos por consola: matriz 8x10, reservas con validación, conteo, búsqueda de contiguos y 5 escenarios de prueba. | Rama `main`, tag `v1.0-base`. | `npm install` → `npm run test` |
| **2 · Interfaz web (opcional, fuera de evaluación)** | Mapa de sala clicable para taquilla con HTML + Tailwind, reutilizando `src/cinema.ts`. | Rama `interfaz-web`, tag `v2.0-web`, Pull Request abierto hacia `main`. | `git fetch && git switch interfaz-web` → `npm install` → `npm run dev` → pestaña **Puertos**, puerto **5173** (privado) |

- Enlaces: [rama `interfaz-web`](../../tree/interfaz-web) · [cambios respecto a `main`](../../compare/main...interfaz-web) · [releases](../../releases)
- **En Codespaces:** botón **Code** → **Codespaces** → elige la rama (`main` o `interfaz-web`) **antes** de crear el codespace.
- La Entrega 2 parte de la Entrega 1 y **no modifica su comportamiento**.

> `main` es la versión evaluada. La rama `interfaz-web` añade además `liberarAsiento` y su escenario de prueba, por eso su total de pruebas es mayor.

## Cómo ejecutarlo

- **GitHub Codespaces:** abre el repositorio en un Codespace. El devcontainer (Node 20) ejecuta `npm install` automáticamente; después, `npm run test`.
- **En local:** con **Node 20** instalado, clona el repositorio y ejecuta `npm install` y `npm run test`.

`npm run console` ejecuta el mismo guion (`tsx src/main.ts`).

## Ejemplo de salida

Fragmento real de `npm run test` (escenario 2, la sala del enunciado):

```text
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
```

## API (`src/cinema.ts`)

`type SalaMatriz = number[][]` · constantes `FILAS = 8`, `COLUMNAS = 10`.

| Función | Qué hace | Devuelve |
|---------|----------|----------|
| `crearSala(filas: number, columnas: number): SalaMatriz` | Crea una sala con todos los asientos libres (bucles `for` anidados). | Matriz `filas x columnas` llena de `0`. |
| `mostrarSala(sala: SalaMatriz): void` | Imprime la sala: pantalla arriba, números de columna, `Fila N │`, `L` libre / `X` ocupado y leyenda. | Nada (escribe en consola). |
| `reservarAsiento(sala: SalaMatriz, fila: number, columna: number): string` | Valida la posición y la disponibilidad; si está libre, marca `1`. | Mensaje para taquilla (✅ / ❌ / ⚠️). |
| `contarAsientos(sala: SalaMatriz): [number, number]` | Recorre la matriz y cuenta asientos. | Tupla `[ocupados, disponibles]`. |
| `buscarAsientosContiguos(sala: SalaMatriz): number[][] \| null` | Busca el primer par de asientos libres juntos en la misma fila (`while` con parada en el primer par). | `[[f, c], [f, c + 1]]` o `null`. |
| `liberarAsiento(sala: SalaMatriz, fila: number, columna: number): string` | *Funcionalidad adicional (Entrega 2).* Anula una reserva con la misma validación que `reservarAsiento`; si está ocupado, marca `0`. | `↩️ Reserva anulada…` / `⚠️ Asiento ya libre…` / `⚠️ Posición no válida…`. |
| `mensajeResultadoContiguos(resultado: number[][] \| null, sala?: SalaMatriz): string` | Construye el texto del resultado de la búsqueda. | 💑 con el par, ⚠️ "Ofrezca asientos separados" o ⚠️ "Sala sin asientos". |
| `mostrarResultadoContiguos(resultado: number[][] \| null, sala?: SalaMatriz): void` | Imprime el mensaje anterior. | Nada (escribe en consola). |

## Decisiones de diseño

- **Solo un arreglo bidimensional `number[][]`** (`0` libre, `1` ocupado). Sin clases, interfaces, objetos, `Map` ni `Set`; los resultados compuestos se devuelven como tuplas (`[ocupados, disponibles]`), matrices (`[[f, c], [f, c + 1]]`) o `null`.
- **"Primer par" contiguo** = recorrido fila a fila (0 → 7) y, en cada fila, columna a columna (0 → 9).
  La imagen del enunciado resalta (3,2)-(3,3), pero según el texto el primer par es (0,2)-(0,3); se sigue el texto ([ERR-000](ERRORES.md)).
- **`reservarAsiento` valida en orden:** sala sin asientos → posición no válida (no entera o fuera de rango) → asiento ocupado → reserva. Los mensajes siguen el formato **"estado: posición"**:
  - `✅ Reserva confirmada: fila 2, asiento 3`
  - `❌ Asiento ocupado: fila 2, asiento 3`
  - `⚠️ Posición no válida: fila 9, asiento 0. Valores válidos: fila 0–7, asiento 0–9 (números enteros).`

## Escenarios de prueba (`src/main.ts`)

Cada comprobación imprime `✔ OK` o `✘ FALLO`; si alguna falla, el proceso termina con código 1.

1. **Sala vacía:** `[0, 80]`, par `[[0,0],[0,1]]`.
2. **Sala del enunciado:** `[31, 49]`, par `[[0,2],[0,3]]`; reserva correcta, repetida (ocupado) y fuera de rango → `[32, 48]`.
3. **Casi llena, solo asientos sueltos:** `[74, 6]`, sin par (`null`); se vende un suelto → `[75, 5]`.
4. **Llena:** `[80, 0]`, sin par; la reserva falla con "Asiento ocupado".
5. **Flujo de taquilla:** una pareja pide dos juntos → `[[0,0],[0,1]]` → se reservan → `[2, 78]` → siguiente par `[[0,2],[0,3]]`.
6. **Anulación de reservas** *(Entrega 2, fuera de evaluación)*: reservar (3,4) → `[1, 79]`; anular → `↩️ Reserva anulada`; anular otra vez → `⚠️ Asiento ya libre`; fila 8 → `⚠️ Posición no válida`; `[0, 80]`.
7. **Extra (robustez):** matriz sin filas → `null` y "Sala sin asientos: no hay contiguos que buscar."

El cumplimiento de cada criterio de evaluación, con su evidencia, está en [EVALUACION.md](EVALUACION.md).

## Interfaz web (opcional)

Pantalla de taquilla (ventanilla y teléfono) que reutiliza `src/cinema.ts`: toda reserva pasa por `reservarAsiento`, todo conteo por `contarAsientos` y toda búsqueda por `buscarAsientosContiguos`.

```bash
npm install
npm run dev         # Vite en el puerto 5173
```

- **Local:** abre `http://localhost:5173`.
- **Codespaces:** pestaña **Puertos** → puerto **5173** → abrir en el navegador. Deja el puerto en **privado** (visibilidad por defecto).

Qué se puede hacer:

- **Mapa de sala** con la pantalla arriba y los mismos índices que la consola. Cada asiento es un botón: `L` libre, `X` ocupado, borde grueso para el par propuesto (el estado no depende solo del color). Clic, `Enter` o `Espacio` para reservar; flechas para moverse.
- **Contador en vivo:** ocupados, disponibles y % de ocupación.
- **Buscar 2 juntos** (resalta el par y le pone el foco) y **Reservar par**.
- **Reserva rápida** por fila y asiento, para reservas telefónicas.
- **Deshacer última reserva** (usa `liberarAsiento`) y **Nueva sesión** (con confirmación).
- **Registro** de las últimas 10 operaciones con la hora y el mensaje devuelto.
- La sala se guarda en `localStorage` como JSON y se recupera al recargar (si el dato no es una sala 8x10 de 0/1, se empieza con la sala vacía). El historial de deshacer no se guarda: al recargar empieza vacío.
- Responsive (en móvil el panel va debajo del mapa) y modo claro / oscuro según el sistema.

## Estructura del proyecto

```text
.
├── .claude/skills/cinema-seat-manager/SKILL.md   # reglas y protocolo del proyecto
├── .devcontainer/devcontainer.json               # Codespaces (Node 20)
├── src/
│   ├── cinema.ts        # lógica: matriz y funciones
│   ├── main.ts          # guion de pruebas por consola
│   ├── web.ts           # interfaz web de taquilla (Entrega 2)
│   ├── style.css        # estilos (Tailwind) de la interfaz web
│   └── vite-env.d.ts    # tipos de Vite
├── CLAUDE.md
├── CONTEXT.md           # problema, restricciones y contratos
├── ERRORES.md           # errores y su resolución
├── EVALUACION.md        # criterios de evaluación con evidencias
├── SEGUIMIENTO.md       # registro de cada prompt
├── README.md
├── index.html           # página de la interfaz web (carga src/web.ts)
├── vite.config.ts       # Vite + Tailwind (puerto 5173)
├── learn.json
├── package.json
└── tsconfig.json
```

Documentación: [CONTEXT.md](CONTEXT.md) · [SEGUIMIENTO.md](SEGUIMIENTO.md) · [ERRORES.md](ERRORES.md) · [EVALUACION.md](EVALUACION.md)

## Desarrollo asistido por IA

El proyecto se construyó con **Claude Code** mediante prompts secuenciales, cada uno documentado (prompt literal, cambios, salida de las pruebas y commit) en [SEGUIMIENTO.md](SEGUIMIENTO.md). Los errores encontrados y su resolución están en [ERRORES.md](ERRORES.md). Las reglas que siguió el asistente están en la skill del proyecto: [.claude/skills/cinema-seat-manager/](.claude/skills/cinema-seat-manager/SKILL.md).

## Autor

Daniel Ochoa Díaz
