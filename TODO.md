# TODO — Anima Fichas

## 🔴 CRÍTICO: Paridad funcional con el Excel

### Categorías y clases ✅ Parcialmente implementado
- [x] `categoria` es un desplegable con las 20 categorías oficiales del juego
- [x] `raza` es un desplegable con todas las razas oficiales
- [x] CATEGORIAS_DATA: tabla completa con ~50 campos por categoría extraída del Excel
- [x] Turno base auto-calculado desde TAMANOS (FUE+CON), no hardcodeado
- [x] Bono de categoría al turno (PlusTurno) auto-calculado
- [x] Límites de Categoría visibles: Límite Combate/Magia/Psi, PV/CM/Zeon bonuses
- [x] PDsTab: muestra coste por punto según categoría (×2, ×3, etc.)
- [x] PDsTab: total de PDs gastados = Σ(puntos × coste)
- [x] PV auto-calculado: PV_BASE_CON[CON] + PlusPV × nivel

- [ ] **Zeón auto-calculado**: Zeón total = PV_BASE_CON[POD] + PlusZeon (de categoría) × nivel
- [ ] **ACT (Acumulación de Zeón)**: ACT_BASE_POD[POD] + ACT de categoría + PDs invertidos
- [ ] **CVs psíquicos**: PlusCV × nivel de categoría
- [ ] **Acciones por turno**: auto-calculado desde DES+AGI (tabla 37 del Excel)
- [ ] **Resistencias base**: base = 20 + bono_stat (POD→RM, CON→RF, etc.) — verificar fórmula exacta con Excel
- [ ] **Límite de PDs por área**: implementar la restricción real de que no se puede gastar más del Límite × PDs_totales en combate/magia/psi
- [ ] **PDs totales por nivel**: 600 base en el Excel — verificar si varía por categoría o ajuste
- [ ] **Habilidades secundarias: bono de categoría** (PlusAcrobacias, PlusSaltar, etc.) que algunas categorías dan gratis

### Habilidades secundarias
- [ ] Mostrar el bono de categoría (PlusXxx de CATEGORIAS_DATA) como columna calculada en PrincipalTab
- [ ] Verificar que la fórmula TOTAL = penBase + penNatural + bono + bonoCat coincide con el Excel
- [ ] La habilidad "Proezas" (Tecnicista, etc.) tiene coste especial — revisar
- [ ] Hay habilidades que la Categoría marca como gratuitas o especiales

### Combate
- [ ] Verificar fórmulas de armas y combate contra el Excel (CombateTab)
- [ ] Tabla de daños: auto-rellenar según tamaño y tipo de ser
- [ ] Acción por turno se calcula automáticamente con tabla DES+AGI

### Ki / Místico / Psíquico
- [ ] Zeón auto-calculado (ver arriba)
- [ ] Verificar fórmulas de Ki contra Excel (KiTab)
- [ ] Puntos de Ki base por característica: `floor(stat / 2)` — verificar con Excel

---

## 🟡 PENDIENTE: Adaptación para app móvil

- [ ] Layout responsive para pantallas < 480px (actualmente demasiado denso)
- [ ] Tabs en móvil: mejor como menú desplegable o bottom navigation
- [ ] Inputs táctiles mínimo 44px de altura
- [ ] Probar en iOS Safari y Android Chrome
- [ ] PWA: manifest.json + service worker para uso offline e instalación
- [ ] Considerar vistas separadas por sección (no todo en grid de columnas)

---

## 🟡 PENDIENTE: Revisión de estilos (UX/UI)

El diseño actual es funcional pero muy denso. Objetivo: mismo rigor de datos, mejor experiencia.

- [ ] **Cards colapsables**: poder ocultar secciones poco usadas
- [ ] **Modo lectura**: vista limpia de la ficha (solo valores, sin inputs)
- [ ] **Tipografía**: más grande, mejor legibilidad en todos los contextos
- [ ] **Inputs numéricos más cómodos**: más altura, feedback visual al editar
- [ ] **Indicadores visuales**: verde/rojo para valores en límite, calculados vs. editables
- [ ] **Resumen de personaje** al entrar a la ficha: stats principales de un vistazo
- [ ] Revisar densidad de cada tab (Principal especialmente)

---

## 🟢 HECHO

- [x] CRUD de partidas (públicas / privadas con PIN de 4 dígitos)
- [x] CRUD de personajes por partida
- [x] Ficha con 8 tabs: General, Principal, Combate, Ki, Místicos, Psíquicos, PDs, Personalización
- [x] Auto-guardado en Supabase con debounce de 3 segundos
- [x] Deploy en GitHub Pages con GitHub Actions
- [x] Exportación a PDF oficial (página 1: info básica, características, habilidades secundarias)
- [x] Cálculo automático de bono de característica (tabla BONO_CARACTERISTICA)
- [x] Cálculo automático de Tamaño, Movimiento y Regeneración a partir de stats
- [x] CATEGORIAS_DATA: tabla completa de 20 categorías con ~50 campos cada una (del Excel)
- [x] PV_BASE_CON y ACT_BASE_POD: tablas de valores base por CON/POD
- [x] categoria y raza: dropdowns con opciones oficiales
- [x] Turno: base auto desde TAMANOS, PlusTurno auto desde categoría
- [x] PV: auto-calculado desde CON + nivel + categoría
- [x] Límites de Categoría: panel informativo con todos los límites y bonos
- [x] PDsTab: costes por punto según categoría, total PDs calculado como Σ(pts×coste)
- [x] Eliminar botón "Imprimir" (reemplazado por "PDF oficial")
