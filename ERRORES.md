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
- **Verificación:** pendiente — se comprobará con un escenario en `src/main.ts` que reproduzca la sala de ejemplo y espere `(0,2)-(0,3)`.

---

Sin errores de código registrados por ahora.
