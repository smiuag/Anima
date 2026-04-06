# TODO — Anima Fichas

## 🔴 CRÍTICO — Revisar DUDAS.md

- [x] **Aliases eliminados** — dropdown usa los 20 nombres oficiales del Excel directamente
- [x] **Cazador de Sombras** — no existe en el Excel, eliminado del dropdown
- [x] **Ocultista** — no existe en el Excel, eliminado del dropdown
- ⚠️ **Pendiente**: factores Ki, Acumulación de Ki y Nivel de Magia (ver DUDAS.md)

---

## 🔴 CRÍTICO: Paridad funcional con el Excel

### Categorías y clases
- [x] `categoria` es un desplegable con las 20 categorías oficiales del juego
- [x] `raza` es un desplegable con todas las razas oficiales
- [x] CATEGORIAS_DATA: tabla completa con ~50 campos por categoría extraída del Excel
- [x] Turno base auto-calculado desde TAMANOS (FUE+CON), no hardcodeado
- [x] Bono de categoría al turno (PlusTurno) auto-calculado
- [x] Límites de Categoría visibles: Límite Combate/Magia/Psi, PV/CM/Zeon bonuses
- [x] PDsTab: muestra coste por punto según categoría (×2, ×3, etc.)
- [x] PDsTab: total de PDs gastados = Σ(puntos × coste) por nivel
- [x] PV auto-calculado: PV_BASE_CON[CON] + PlusPV × nivel
- [x] Zeón auto-calculado: PV_BASE_CON[POD] + PlusZeon × nivel + Esp
- [x] ACT base auto-calculado: ACT_BASE_POD[POD] + ACT de categoría
- [x] CVs psíquicos: floor(PlusCV × nivel × 3)
- [x] Acciones por turno: auto-calculado desde DES+AGI (tabla aproximada — verificar tabla 37 exacta del Excel)
- [x] Resistencias base: 20 + bono_stat (RF/RE/RV←CON, RM←POD, RP←VOL)
- [x] Habilidades secundarias: columna Cat. con PlusXxx de CATEGORIAS_DATA sumado al total
- [x] Ki base por característica: floor(stat/2), columna separada de PDs adicionales

### Fórmulas pendientes — stats y combat
- [x] **Cansancio máximo** = CON total (auto-calc en PrincipalTab)
- [x] **H. Ataque / H. Esquiva / H. Parada total** = Σ(pts en PDsTab × 5) + bono categoría×nivel + Esp.
- [x] **Proyección Mágica total** = Σ(pts_ProjMag × 5) + Esp.
- [x] **Proyección Psíquica total** = Σ(pts_ProjPsi × 5) + Esp.
- [x] **Resistencias**: base = Presencia (20 + bonos manuales) + bono_stat. Presencia escalable manualmente. Gnosis avanzado en DUDAS.
- [x] **Acciones por turno**: verificada contra Excel (tabla 37) — match exacto
- [x] **Tabla de daños por tamaño**: datos extraídos del Excel en TAMANOS (armaNatural, atFisico, armadura, rotura, entereza)

### Fórmulas pendientes — PDs
- [x] **PDs totales auto-calc**: Σ(pdsGanados) a través de todos los niveles
- [x] **PDs gastados total**: Σ(PDs gastados por nivel) calculado
- [x] **Límite de PDs por área**: indicador visual en PDsTab — PDs en Combate/Magia/Psi vs Límite × PDs_totales
- [x] **PDs totales base**: nivel 0→400, nivel 1→600, nivel 2+→600+(n-1)×100 — confirmado con usuario

### Fórmulas pendientes — Ki/Místico/Psíquico (conexión PDsTab → tabs)
- [x] **CM total** = PlusCM × nivel + Σ(pts_CM de todos los niveles en PDsTab)
- [x] **Ki pool desde PDsTab**: indicador de pool total vs. distribuido por stat (verde/rojo). Factor 1:1 asumido — verificar en DUDAS.md
- [ ] **Acumulación de Ki por stat**: base = 1 por stat; adicional = Σ(pts en "Acumulación de KI") / 6 stats o total? — verificar Excel
- [x] **Zeón total desde PDs**: Σ(pts_Zeón × 5) — factor ×5 confirmado e implementado
- [x] **ACT total desde PDs**: ACT_BASE_POD[POD] × (1 + múltiplos); catData.ACT = coste por múltiplo
- [ ] **Nivel de Magia máximo**: Σ(pts en "Nivel de Magia") — factor de conversión en DUDAS.md
- [x] **Convocar/Dominar/Atar/Desconvocar**: Σ(pts × 5) auto-calc en MisticosTab

### Fórmulas pendientes — Razas
- [x] **Bonos de raza a características**: RAZAS_DATA implementada, columna Raza visible en PrincipalTab
- [x] **Bonos de raza a resistencias**: RAZAS_DATA incluye RF/RE/RV/RM/RP por raza, aplicados en PrincipalTab
- [x] **Bonos de raza a habilidades secundarias**: verificados — Excel no tiene habSec, vienen del reglamento físico
- [x] **Capacidades raciales automáticas**: panel muestra lista automática de la raza + campo manual para extras
- [x] Tabla RAZAS_DATA creada en tables.js (extraída del Excel)

### Habilidades secundarias
- [x] Bono de categoría (PlusXxx de CATEGORIAS_DATA) como columna calculada en PrincipalTab
- [x] Conexión PDsTab → PrincipalTab: PDs×5 auto-calc para todas las habilidades secundarias
- [x] Habilidades con coste nulo (Ciencia, Historia, etc.) — muestran total si hay PDs o Esp. invertidos
- [x] Verificar que fórmula TOTAL = penBase + PDs×5 + bonoCat×nivel + esp coincide con el Excel — corregido ×nivel
- [x] "Proezas" = P. Fuerza en la ficha — mapeado correctamente en HAB_SEC_PLUS_KEYS

### Combate
- [x] Verificar fórmulas de armas y combate contra el Excel (CombateTab) — Total Atq/Def = PDs×5 + bonoCat×Nv + Esp + arma + calidad + mods
- [x] Tabla de daños por tamaño extraída del Excel (armaNatural, atFisico, armadura, rotura, entereza en TAMANOS)
- [x] Penalización de armadura: auto-calc desde Σ(rMov armaduras), reducida por Llevar Armadura/10, mínimo penNatural

---

## 🟡 PENDIENTE: Verificación de tablas

Crear una página/sección de consulta para verificar que los datos extraídos del Excel son correctos.

- [x] **Modal "Tablas"** accesible desde la cabecera de la app (botón "Tablas" en CharacterSheet)
- [x] **BONO_CARACTERISTICA**: tabla stat 1–20 → bono
- [x] **TAMANOS**: tabla FUE+CON → Tamaño, Turno base
- [x] **PV_BASE_CON**: tabla CON/POD 1–20 → PV/Zeón base
- [x] **ACT_BASE_POD**: tabla POD 1–20 → Acumulación de Zeón base
- [x] **CATEGORIAS_DATA**: tabla completa con campos clave por categoría
- [x] **HABILIDADES_SECUNDARIAS**: lista con penalizaciones y clave de categoría
- [x] **ACCIONES_TURNO**: tabla DES+AGI → acciones/turno
- [x] **RAZAS_DATA**: bonos por raza a stats y resistencias
- [x] Exportar a CSV para comparar con el Excel fácilmente

---

## 🟡 PENDIENTE: Adaptación para app móvil

- [x] Layout responsive para pantallas < 480px: grids colapsan a 1 columna, header compacto con iconos
- [x] Tabs en móvil: select dropdown en pantallas < sm (640px); desktop mantiene botones horizontales
- [x] Inputs táctiles mínimo 40px de altura en móvil (font-size: 16px para evitar zoom iOS)
- [ ] Probar en iOS Safari y Android Chrome
- [x] PWA: manifest.json + service worker para uso offline e instalación (network-first, offline fallback)
- [ ] Considerar vistas separadas por sección (no todo en grid de columnas)

---

## 🟡 PENDIENTE: Revisión de estilos (UX/UI)

- [x] **Cards colapsables**: CollapsiblePanel reutilizable aplicado en todos los tabs (General, Principal, Combate, Ki, Místicos, Psíquicos, Personalización)
- [x] **Modo lectura**: botón 👁 en cabecera activa `.modo-lectura` CSS — inputs transparentes, botones ocultos, solo valores
- [x] **Tipografía**: base 14px (de 13px), mejor legibilidad
- [x] **Inputs numéricos más cómodos**: min-height 28px, padding 4px 6px, focus con glow dorado, number inputs centrados
- [x] **Indicadores visuales**: calc-input con borde diferenciado; over-limit class; inputs compactos en tablas
- [x] **Resumen de personaje** al entrar a la ficha: barra colapsable con PV, Turno, Atq/Esq/Par, Resistencias, Zeón, CM, PDs libres
- [x] Revisar densidad de cada tab — PrincipalTab: panel Regen/Mov cerrado, secundarias en tabla compacta están bien; densidad revisada

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
- [x] Resistencias base auto-calc: 20 + bono_stat por tipo
- [x] Acciones por turno auto-calc desde DES+AGI
- [x] Habilidades secundarias: columna Cat. con bonos de categoría
- [x] Ki base por stat: floor(stat/2) + columna PDs adicionales
- [x] Zeón auto-calc: PV_BASE_CON[POD] + PlusZeon×nivel + Esp
- [x] ACT base auto-calc: ACT_BASE_POD[POD] + cat.ACT
- [x] CVs auto-calc: floor(PlusCV × nivel × 3)
- [x] Cansancio máximo auto-calc: CON total
- [x] PDsTab: PDs totales y gastados auto-calc con Σ por niveles
- [x] PDsTab: indicador de límite por área (Combate/Magia/Psi) con aviso visual
- [x] CM total auto-calc: PlusCM × nivel + PDs invertidos en CM
