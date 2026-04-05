import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { BONO_CARACTERISTICA, HABILIDADES_SECUNDARIAS } from '../data/tables'

// ─── COORDINATE SYSTEM ───────────────────────────────────────────────────────
// Source: measured from the official Anima character sheet PDF
// fitz = top-left origin (PyMuPDF)
// pdf-lib = bottom-left origin
// Page height (A4) = 841.9 pts

const PH = 841.9

// fitz y  →  pdf-lib y
const py = (fitzY) => PH - fitzY

// ─── TEXT DRAWING HELPERS ─────────────────────────────────────────────────────

function txt(page, font, text, x, fitzY, size = 7, color = rgb(0, 0, 0)) {
  const s = String(text ?? '')
  if (!s) return
  page.drawText(s, { x, y: py(fitzY), size, font, color })
}

function txtR(page, font, text, x, fitzY, cellW, size = 7) {
  // right-aligned within cell of width cellW starting at x
  const s = String(text ?? '')
  if (!s) return
  const w = font.widthOfTextAtSize(s, size)
  const drawX = Math.max(x, x + cellW - w)
  page.drawText(s, { x: drawX, y: py(fitzY), size, font, color: rgb(0, 0, 0) })
}

// ─── PAGE 1: COORDINATES (fitz pts) ──────────────────────────────────────────

// Basic info row y-positions
const Y = {
  nombre:    57,
  categoria: 69,
  nivel:     81,
  sexo:      93,
  raza:      105,
}

// Basic info field x-positions
const X_BASIC = {
  nombre:    80,
  categoria: 95,
  pelo:      185, ojos: 240,    // right side of categoria row
  nivel:     52,  edad: 130,    // nivel row
  sexo:      52,  altura: 210, peso: 252,  // sexo row
  raza:      52,  tamano: 257,  // raza row
}

// Características columns (x = fitz, cell width)
const CARACT_X = {
  base:   { x: 71, w: 14 },
  actual: { x: 101, w: 14 },  // "Temp" column in PDF
  bono:   { x: 130, w: 14 },
}
// y positions per stat (AGI, CON, DES, FUE, INT, PER, POD, VOL)
const CARACT_Y = [163, 185, 207, 229, 251, 273, 295, 317]
const CARACT_KEYS = ['AGI', 'CON', 'DES', 'FUE', 'INT', 'PER', 'POD', 'VOL']

// Secondary skills columns
const SK = {
  base:  { x: 364, w: 18 },
  bono:  { x: 389, w: 18 },
  esp:   { x: 412, w: 14 },
  cat:   { x: 432, w: 14 },
  final: { x: 510, w: 18 },
}

// Map: [PDF row y (fitz), category key, skill key]
// Category and skill keys match HABILIDADES_SECUNDARIAS exactly
const SKILL_ROWS = [
  // ── Atléticas ────────────────────────────────────────────────
  [175, 'Atléticas',    'Acrobacias'],
  [184, 'Atléticas',    'Atletismo'],
  [193, 'Atléticas',    'Montar'],
  [202, 'Atléticas',    'Nadar'],
  [212, 'Atléticas',    'Trepar'],
  [222, 'Atléticas',    'Saltar'],
  // ── Vigor ────────────────────────────────────────────────────
  [241, 'Vigor',        'Frialdad'],
  [251, 'Vigor',        'P. Fuerza'],
  [261, 'Vigor',        'Res. Dolor'],
  // ── Percepción ───────────────────────────────────────────────
  [279, 'Percepción',   'Advertir'],
  [289, 'Percepción',   'Buscar'],
  [299, 'Percepción',   'Rastrear'],
  // ── Intelectuales ─────────────────────────────────────────────
  [318, 'Intelectuales','Animales'],
  [328, 'Intelectuales','Ciencia'],
  [338, 'Intelectuales','Herbolaria'],
  [348, 'Intelectuales','Historia'],
  [358, 'Intelectuales','Medicina'],
  [368, 'Intelectuales','Memorizar'],
  [378, 'Intelectuales','Navegación'],
  [388, null, null],              // Ley – not in data model, skip
  [398, 'Intelectuales','Ocultismo'],
  [408, null, null],              // Táctico – not in data model, skip
  [418, 'Intelectuales','Tasación'],
  [428, 'Intelectuales','V. Mágica'],
  // ── Sociales ──────────────────────────────────────────────────
  [447, null, null],              // Comerciar – not in data model, skip
  [457, null, null],              // Callejeo – not in data model, skip
  [467, 'Sociales',     'Estilo'],
  [477, 'Sociales',     'Intimidar'],
  [487, 'Sociales',     'Liderazgo'],
  [497, 'Sociales',     'Persuasión'],
  // ── Subterfugio ───────────────────────────────────────────────
  [516, 'Subterfugio',  'Cerrajería'],
  [526, 'Subterfugio',  'Disfraz'],
  [536, 'Subterfugio',  'Ocultarse'],
  [546, 'Subterfugio',  'Robo'],
  [556, 'Subterfugio',  'Sigilo'],
  [566, 'Subterfugio',  'Trampería'],
  [576, 'Subterfugio',  'Venenos'],
  // ── Creativas ─────────────────────────────────────────────────
  [594, 'Creativas',    'Arte'],
  [604, 'Creativas',    'Baile'],
  [614, 'Creativas',    'Forja'],
  [624, 'Creativas',    'Música'],
  [634, 'Creativas',    'T. Manos'],
]

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export async function exportarFichaPDF(char) {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const url = `${baseUrl}ficha_anima.pdf`
  const bytes = await fetch(url).then(r => {
    if (!r.ok) throw new Error(`No se pudo cargar la plantilla PDF: ${r.status}`)
    return r.arrayBuffer()
  })

  const pdfDoc = await PDFDocument.load(bytes)
  const font  = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontB = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const pages = pdfDoc.getPages()
  const p1 = pages[0]

  const t  = (text, x, fy, sz = 7)         => txt(p1, font,  text, x, fy, sz)
  const tb = (text, x, fy, sz = 7)         => txt(p1, fontB, text, x, fy, sz)
  const tr = (text, x, fy, w, sz = 7)      => txtR(p1, font,  text, x, fy, w, sz)

  // ── BASIC INFO ────────────────────────────────────────────────────────────
  tb(char.nombre    || '',   X_BASIC.nombre,    Y.nombre,    8)
  t(char.categoria  || '',   X_BASIC.categoria, Y.categoria)
  t(char.cabello    || '',   X_BASIC.pelo,      Y.categoria)
  t(char.ojos       || '',   X_BASIC.ojos,      Y.categoria)
  t(char.nivel > 0 ? String(char.nivel) : '', X_BASIC.nivel, Y.nivel)
  t(char.edad       || '',   X_BASIC.edad,      Y.nivel)
  t(char.sexo       || '',   X_BASIC.sexo,      Y.sexo)
  t(char.altura     || '',   X_BASIC.altura,    Y.sexo)
  t(char.peso       || '',   X_BASIC.peso,      Y.sexo)
  t(char.raza !== 'Humano' ? char.raza || 'Humano' : 'Humano', X_BASIC.raza, Y.raza)
  t(char.tamanoNombre || '',  X_BASIC.tamano,    Y.raza)

  // ── CARACTERÍSTICAS ───────────────────────────────────────────────────────
  const caract = char.caracteristicas || {}
  for (let i = 0; i < CARACT_KEYS.length; i++) {
    const key  = CARACT_KEYS[i]
    const stat = caract[key] || {}
    const base   = stat.base   !== undefined ? String(stat.base)  : ''
    const actual = stat.total  !== undefined ? String(stat.total) : base
    const bono   = base !== '' ? String(BONO_CARACTERISTICA[Number(base)] ?? '') : ''

    tr(base,   CARACT_X.base.x,   CARACT_Y[i], CARACT_X.base.w)
    tr(actual, CARACT_X.actual.x, CARACT_Y[i], CARACT_X.actual.w)
    tr(bono,   CARACT_X.bono.x,   CARACT_Y[i], CARACT_X.bono.w)
  }

  // ── SECONDARY SKILLS ──────────────────────────────────────────────────────
  const habSec = char.habilidadesSecundarias || {}
  for (const [rowY, cat, skill] of SKILL_ROWS) {
    if (!cat || !skill) continue
    const h = habSec?.[cat]?.[skill] || {}
    const penBase = HABILIDADES_SECUNDARIAS[cat]?.[skill] ?? 0
    const penNat = Number(h.penNatural) || 0
    const bono   = Number(h.bono)       || 0
    const total  = (penBase ?? 0) + penNat + bono

    tr(penNat !== 0 ? String(penNat) : '', SK.base.x,  rowY, SK.base.w,  6.5)
    tr(bono   !== 0 ? String(bono)   : '', SK.bono.x,  rowY, SK.bono.w,  6.5)
    tr(total  !== 0 ? String(total)  : '', SK.final.x, rowY, SK.final.w, 6.5)
  }

  // ── SAVE & DOWNLOAD ───────────────────────────────────────────────────────
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `${char.nombre || 'personaje'}_ficha.pdf`,
  })
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 10000)
}
