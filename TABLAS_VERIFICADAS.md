# Tablas verificadas contra el Excel oficial

Todas las tablas aquí documentadas han sido comprobadas célula a célula contra
`Anima - Ficha v7.5_.xlsx`. No es necesario volver a consultarlo para estos valores.

---

## BONO_CARACTERISTICA
Hoja Tablas, filas 89–108 (pág. 11 del reglamento)

| Stat | Bono |
|------|------|
| 1 | -30 |
| 2 | -20 |
| 3 | -10 |
| 4 | -5 |
| 5 | 0 |
| 6 | 5 |
| 7 | 5 |
| 8 | 10 |
| 9 | 10 |
| 10 | 15 |
| 11 | 20 |
| 12 | 20 |
| 13 | 25 |
| 14 | 25 |
| 15 | 30 |
| 16 | 35 |
| 17 | 35 |
| 18 | 40 |
| 19 | 40 |
| 20 | 45 |

---

## PV_BASE_CON / ZEON_BASE_POD
Hoja Tablas, filas 260–279 — **misma tabla** para PV (indexado por CON) y Zeón (indexado por POD).

| CON/POD | PV / Zeón base |
|---------|---------------|
| 1 | 5 |
| 2 | 20 |
| 3 | 40 |
| 4 | 55 |
| 5 | 70 |
| 6 | 85 |
| 7 | 95 |
| 8 | 110 |
| 9 | 120 |
| 10 | 135 |
| 11 | 150 |
| 12 | 160 |
| 13 | 175 |
| 14 | 185 |
| 15 | 200 |
| 16 | 215 |
| 17 | 225 |
| 18 | 240 |
| 19 | 250 |
| 20 | 265 |

---

## ACT_BASE_POD
Hoja Tablas, filas 260–279, columna "ACT Base"

| POD | ACT Base |
|-----|----------|
| 1–4 | 0 |
| 5–7 | 5 |
| 8–11 | 10 |
| 12–14 | 15 |
| 15 | 20 |
| 16–17 | 25 |
| 18–19 | 30 |
| 20 | 35 |

---

## ACU_KI_TABLE
Hoja Tablas, filas 1294–1313 ("Tabla de Acumulación")

| Característica | Acumulación base |
|----------------|-----------------|
| 1–9 | 1 |
| 10–12 | 2 |
| 13–15 | 3 |
| 16–20 | 4 |

---

## ACCIONES_TURNO
Hoja Tablas, filas 249–256

| DES+AGI | Acciones/turno |
|---------|---------------|
| 0–10 | 1 |
| 11–14 | 2 |
| 15–19 | 3 |
| 20–22 | 4 |
| 23–25 | 5 |
| 26–28 | 6 |
| 29–31 | 8 |
| 32+ | 10 |

---

## TAMANOS
Hoja Tablas, filas 65–72

| FUE+CON | Tamaño | Turno base |
|---------|--------|-----------|
| < 4 | Minúsculo | 40 |
| 4–8 | Pequeño | 30 |
| 9–22 | Medio | 20 |
| 23–24 | Grande | 10 |
| 25–28 | Enorme | 0 |
| 29–33 | Gigantesco | -10 |
| 34+ | Colosal | -20 |

---

## PDs por nivel
Confirmado en hoja PDs (fila 188: "PDs usados por Categoría" base = 400).
El usuario confirmó la escala completa:

| Nivel | PDs ganados ese nivel |
|-------|-----------------------|
| 0 | 400 |
| 1 | 600 |
| 2 | 700 |
| 3 | 800 |
| n ≥ 2 | 600 + (n−1) × 100 |

Función: `getPdsPorNivel(n)` en `src/data/tables.js`

---

## Presencia por nivel
`presenciaBase = nivel === 0 ? 20 : nivel === 1 ? 30 : 30 + (nivel - 1) × 5`

| Nivel | Presencia base |
|-------|---------------|
| 0 | 20 |
| 1 | 30 |
| 2 | 35 |
| 3 | 40 |
| … | … |

La presencia base se usa como base para RF/RE/RV/RM/RP.
**Gnosis**: campo manual — da acceso a poderes, no afecta auto-cálculos.

---

## RAZAS_DATA — verificación completa
Todos los valores de RF/RE/RV/RM/RP, stats (AGI/CON/DES/FUE/INT/PER/POD/VOL), Tamaño, Regeneración y Cansancio verificados contra la hoja Tablas filas 5–24. **Match exacto en todas las razas.**

Razas verificadas: Humano, Nephilim Sylvain/Jayán/D'Anjayni/Ebudan/Daimah/Duk'zarist/Devah/Vetala/Turak, Sylvain, Jayán, D'Anjayni, Ebudan, Daimah, Duk'zarist, Devah, Vetala, Tuan Dalyr, Turak.

**`habSec`**: no está en el Excel. Valores del reglamento físico, no verificables vía Excel.

---

## Mapeo Proezas → P. Fuerza
`PlusProezas` en CATEGORIAS_DATA corresponde a **P. Fuerza** (Proezas de Fuerza) en la ficha.
Categorías con bono: Guerrero +5, Maestro de Armas +5.

---

## Mapeo Trucos → T. Manos
`PlusTrucos` en CATEGORIAS_DATA corresponde a la habilidad **T. Manos** (Creativas) en la ficha.
Confirmado. Categorías con bono: Guerrero Acróbata +10, Ladrón +5, Ilusionista +10.

---

## CM (Conocimiento Marcial)
`CM_total = PlusCM × nivel + Σ(pts_CM de todos los niveles en PDsTab)`

Factor 1:1 confirmado — cada unidad invertida en "CM" en PDsTab = 1 punto de CM.

---

## CVs Psíquicos
`cvsTotal = floor(nivel × PlusCV) + cvsPDs`

| PlusCV en CATEGORIAS_DATA | Categorías | CVs ganados |
|---------------------------|-----------|-------------|
| 1 | Mentalista, Guerrero Mentalista, Hechicero Mentalista | 1 por nivel |
| 0.5 | Novel | 1 cada 2 niveles |
| 0.333… | Todos los demás | 1 cada 3 niveles |

---

## Múltiplos de PV (CosteMultiploPV)
Mismo sistema que ACT pero para puntos de vida.

`pvTotal = PV_BASE_CON[CON] × (1 + múltiplos_comprados) + PlusPV×nivel + esp`

Coste por múltiplo según categoría: Maestro de Armas=10, Guerrero/Paladín/Paladín Oscuro=15, resto=20.
"Múltiplos de PV" aparece en PDsTab sección Combate con coste `CosteMultiploPV`.

---

## Campo ACT en CATEGORIAS_DATA
Hoja Tablas fila 193, columna entre CosteZeon y CosteProy_Mag.

- `catData.ACT` = **coste en PDs por múltiplo de ACT**
- Clases físicas (Guerrero, Ladrón, etc.) = 70 PDs/múltiplo
- Clases mágicas (Hechicero, Warlock) = 50 PDs/múltiplo
- Clases híbridas (Ilusionista, Conjurador, etc.) = 60 PDs/múltiplo
- Mentalistas = 70 PDs/múltiplo

**Fórmula:**
`actTotal = ACT_BASE_POD[POD] × (1 + múltiplos_comprados)`

Cada "unidad" comprada en PDsTab bajo "ACT" = 1 múltiplo (coste = catData.ACT PDs).

---

## CATEGORIAS (lista oficial, 20 categorías)
Hoja Tablas, filas 194–213 (en ese orden)

1. Guerrero
2. Guerrero Acróbata
3. Paladín
4. Paladín Oscuro
5. Maestro de Armas
6. Tecnicista
7. Tao
8. Explorador
9. Sombra
10. Ladrón
11. Asesino
12. Hechicero
13. Warlock
14. Ilusionista
15. Hechicero Mentalista
16. Conjurador
17. Guerrero Conjurador
18. Mentalista
19. Guerrero Mentalista
20. Novel

**Categorías eliminadas** (no existen en el Excel): Cazador de Sombras, Ocultista, Místico, Iluminado, Guerrero Místico, Explorador Místico, Brujo.
