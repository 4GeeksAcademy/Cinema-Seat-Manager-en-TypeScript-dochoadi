# Cinema Seat Manager en TypeScript

Prototipo de línea de comandos para que el **personal de taquilla** de un cine independiente gestione las reservas de una **sala de 8 filas x 10 asientos**: ver la sala, reservar, contar ocupación y encontrar dos asientos juntos para una pareja.

## Verificar en 30 segundos

```bash
npm install
npm run test        # debe terminar con "Pruebas superadas: 20/20" (exit 0)
npm run typecheck   # tsc --noEmit, sin errores
```

## Cómo ver cada versión

El proyecto tiene tres versiones. La **evaluada es la 1**; la 2 es el reto extra tal como lo pide el enunciado y la 3 es una mejora propia sobre la 2.
La 2 y la 3 parten de la 1 y no modifican su comportamiento.

| Versión | Qué es | Evaluada | Dónde | Comando |
|---------|--------|----------|-------|---------|
| **1 · Consola** | Gestor de asientos por línea de comandos: matriz 8x10, reservas con validación, conteo, búsqueda de contiguos y 5 escenarios de prueba. | **Sí** | rama [`main`](../../tree/main) · tag [`v1.0-base`](../../tree/v1.0-base) | `npm run test` |
| **2 · Web básica** (reto extra solicitado) | Mapa de sala clicable con HTML + Tailwind, reutilizando `src/cinema.ts`. | No | tag [`v2.0-web`](../../tree/v2.0-web) | `npm run dev` |
| **3 · Web mejorada** | Cartelera de una película inventada, butacas de cine, pantalla curva y panel de taquilla. | No | rama [`interfaz-web`](../../tree/interfaz-web) · tag [`v2.2-web`](../../tree/v2.2-web) | `npm run dev` |

### Verlo sin ejecutar nada

| Versión 1 · Consola | Versión 2 · Web básica |
|---------------------|------------------------|
| ![Salida de npm run test en la versión 1](docs/capturas/v1-consola.png) | ![Interfaz web básica de la versión 2](docs/capturas/v2-web-basica.png) |

| Versión 3 · Web mejorada (escritorio) | Versión 3 · Web mejorada (móvil) |
|---------------------------------------|----------------------------------|
| ![Interfaz web mejorada de la versión 3 en escritorio](docs/capturas/v3-web-mejorada.png) | ![Interfaz web mejorada de la versión 3 en móvil](docs/capturas/v3-web-mejorada-movil.png) |

- Código de cada versión: [`v1.0-base`](../../tree/v1.0-base) · [`v2.0-web`](../../tree/v2.0-web) · [`v2.2-web`](../../tree/v2.2-web)
- Cambios de la web respecto a la consola: [Pull Request abierto](../../pulls) (no se fusiona hasta después de la evaluación).

### Ejecutarlo en Codespaces

Abre el repositorio en un Codespace (botón **Code** → **Codespaces**). El devcontainer (Node 20) ejecuta `npm install` automáticamente al crearlo. En la terminal:

**Versión 1 · Consola**

```bash
git switch main
npm install
npm run test        # debe terminar con "Pruebas superadas: 20/20"
```

`npm run console` ejecuta el mismo guion (`tsx src/main.ts`).

**Versión 2 · Web básica**

```bash
git fetch --tags
git switch --detach v2.0-web
npm install
npm run dev
```

Después: pestaña **Puertos** → puerto **5173** → icono del globo (abrir en el navegador).

**Versión 3 · Web mejorada**

```bash
git switch interfaz-web
npm install
npm run dev
```

Igual que la versión 2: pestaña **Puertos** → puerto **5173** → icono del globo. Si antes se veía otra versión, recarga con **Ctrl+Shift+R**.

**Volver:** `Ctrl+C` para parar el servidor y `git switch main`.

Notas:

- Ejecuta `npm install` cada vez que cambies de versión: las dependencias pueden variar entre versiones.
- `--detach` deja el repositorio en modo de solo lectura de esa versión; es normal el aviso de *detached HEAD*.
- El puerto 5173 debe quedarse en **Privado**.

### Ejecutarlo en local

Requisitos: **Node 20** y **git**.

```bash
git clone https://github.com/4GeeksAcademy/Cinema-Seat-Manager-en-TypeScript-dochoadi.git
cd Cinema-Seat-Manager-en-TypeScript-dochoadi
```

Después, los mismos pasos que en Codespaces para cada versión. En local, la web se abre en `http://localhost:5173`.

> El total de pruebas es **20/20** en la versión 1 y **25/25** en las versiones 2 y 3 (añaden `liberarAsiento` y su escenario de prueba).

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
6. **Extra (robustez):** matriz sin filas → `null` y "Sala sin asientos: no hay contiguos que buscar."

El cumplimiento de cada criterio de evaluación, con su evidencia, está en [EVALUACION.md](EVALUACION.md).

## Estructura del proyecto

```text
.
├── .claude/skills/cinema-seat-manager/SKILL.md   # reglas y protocolo del proyecto
├── .devcontainer/devcontainer.json               # Codespaces (Node 20)
├── docs/capturas/                                # capturas de cada versión
├── src/
│   ├── cinema.ts        # lógica: matriz y funciones
│   ├── main.ts          # guion de pruebas por consola
│   ├── style.css        # reto web opcional
│   └── vite-env.d.ts    # reto web opcional
├── CLAUDE.md
├── CONTEXT.md           # problema, restricciones y contratos
├── ERRORES.md           # errores y su resolución
├── EVALUACION.md        # criterios de evaluación con evidencias
├── SEGUIMIENTO.md       # registro de cada prompt
├── README.md
├── index.html           # reto web opcional
├── vite.config.ts       # reto web opcional
├── learn.json
├── package.json
└── tsconfig.json
```

Documentación: [CONTEXT.md](CONTEXT.md) · [SEGUIMIENTO.md](SEGUIMIENTO.md) · [ERRORES.md](ERRORES.md) · [EVALUACION.md](EVALUACION.md)

## Desarrollo asistido por IA

El proyecto se construyó con **Claude Code** mediante prompts secuenciales, cada uno documentado (prompt literal, cambios, salida de las pruebas y commit) en [SEGUIMIENTO.md](SEGUIMIENTO.md). Los errores encontrados y su resolución están en [ERRORES.md](ERRORES.md). Las reglas que siguió el asistente están en la skill del proyecto: [.claude/skills/cinema-seat-manager/](.claude/skills/cinema-seat-manager/SKILL.md).

## Autor

Daniel Ochoa Díaz
