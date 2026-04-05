// Tabla 2: Bono de Características (pag. 11)
export const BONO_CARACTERISTICA = {
  1: -30, 2: -20, 3: -10, 4: -5, 5: 0,
  6: 5, 7: 5, 8: 10, 9: 10, 10: 15,
  11: 20, 12: 20, 13: 25, 14: 25, 15: 30,
  16: 35, 17: 35, 18: 40, 19: 40, 20: 45
}

export const getBonoCaracteristica = (val) => {
  const v = parseInt(val) || 0
  if (v <= 0) return -30
  if (v > 20) return 45 + Math.floor((v - 20) / 2) * 5
  return BONO_CARACTERISTICA[v] ?? 0
}

// Tabla 21: Movimiento por Agilidad
export const MOVIMIENTO_AGI = {
  1: '< 1 m/asalto', 2: '4 m/asalto', 3: '8 m/asalto',
  4: '15 m/asalto', 5: '20 m/asalto', 6: '22 m/asalto',
  7: '25 m/asalto', 8: '28 m/asalto', 9: '32 m/asalto',
  10: '35 m/asalto', 11: '40 m/asalto', 12: '50 m/asalto',
  13: '80 m/asalto', 14: '150 m/asalto', 15: '250 m/asalto',
  16: '500 m/asalto', 17: '1 km/asalto', 18: '5 km/asalto',
  19: '25 km/asalto', 20: 'Esp*'
}

// Tabla 19: Regeneración por CON
export const REGENERACION_CON = {
  1: 0, 2: 0, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 2, 9: 2,
  10: 3, 11: 4, 12: 5, 13: 6, 14: 7, 15: 8, 16: 9, 17: 10,
  18: 11, 19: 12, 20: 12
}

// Tabla 80: Tamaño por FUE+CON
export const TAMANOS = [
  { min: -99, max: 3, nombre: 'Minúsculo', turnoBase: 40 },
  { min: 4, max: 8, nombre: 'Pequeño', turnoBase: 30 },
  { min: 9, max: 22, nombre: 'Medio', turnoBase: 20 },
  { min: 23, max: 24, nombre: 'Grande', turnoBase: 10 },
  { min: 25, max: 28, nombre: 'Enorme', turnoBase: 0 },
  { min: 29, max: 33, nombre: 'Gigantesco', turnoBase: -10 },
  { min: 34, max: 999, nombre: 'Colosal', turnoBase: -20 },
]

export const getTamano = (fue, con) => {
  const suma = (parseInt(fue) || 0) + (parseInt(con) || 0)
  return TAMANOS.find(t => suma >= t.min && suma <= t.max) || TAMANOS[2]
}

// Razas disponibles
export const RAZAS = [
  'Humano', 'Nephilim Sylvain', 'Nephilim Jayán', "Nephilim D'Anjayni",
  'Nephilim Ebudan', 'Nephilim Daimah', 'Nephilim Duk\'zarist',
  'Nephilim Devah', 'Nephilim Vetala', 'Nephilim Turak',
  'Sylvain', 'Jayán', "D'Anjayni", 'Ebudan', 'Daimah',
  "Duk'zarist", 'Devah', 'Vetala', 'Tuan Dalyr', 'Turak', 'Criatura'
]

// Bonos raciales a resistencias
export const BONOS_RAZA_RESIST = {
  'Humano': { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  'Nephilim Sylvain': { RF: 5, RE: 20, RV: 5, RM: 10, RP: 10 },
  'Nephilim Jayán': { RF: 15, RE: 0, RV: 0, RM: -10, RP: 0 },
  "Nephilim D'Anjayni": { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  'Nephilim Ebudan': { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  'Nephilim Daimah': { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  "Nephilim Duk'zarist": { RF: 20, RE: 15, RV: 15, RM: 15, RP: 15 },
  'Nephilim Devah': { RF: -10, RE: -10, RV: 0, RM: 0, RP: 0 },
  'Nephilim Vetala': { RF: 0, RE: -20, RV: 0, RM: 0, RP: 0 },
  'Nephilim Turak': { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  'Sylvain': { RF: 0, RE: 0, RV: 0, RM: 30, RP: 30 },
  'Jayán': { RF: 20, RE: 0, RV: 0, RM: -20, RP: 0 },
  "D'Anjayni": { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  'Ebudan': { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  'Daimah': { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  "Duk'zarist": { RF: 20, RE: 15, RV: 15, RM: 15, RP: 15 },
  'Devah': { RF: -10, RE: -10, RV: 0, RM: 0, RP: 0 },
  'Vetala': { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  'Tuan Dalyr': { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  'Turak': { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
  'Criatura': { RF: 0, RE: 0, RV: 0, RM: 0, RP: 0 },
}

// Categorías
export const CATEGORIAS = [
  'Guerrero', 'Guerrero Acróbata', 'Paladín', 'Paladín Oscuro',
  'Maestro de Armas', 'Tecnicista', 'Explorador', 'Sombra',
  'Ladrón', 'Asesino', 'Cazador de Sombras', 'Ocultista',
  'Místico', 'Warlock', 'Iluminado', 'Tao', 'Conjurador',
  'Mentalista', 'Guerrero Místico', 'Explorador Místico',
  'Hechicero', 'Brujo', 'Novel'
]

// Habilidades secundarias con su penalización natural base
export const HABILIDADES_SECUNDARIAS = {
  'Atléticas': {
    'Acrobacias': -30, 'Atletismo': -30, 'Montar': -30,
    'Nadar': -30, 'Trepar': -30, 'Saltar': -30
  },
  'Sociales': {
    'Estilo': -30, 'Intimidar': -30, 'Liderazgo': -30, 'Persuasión': -30
  },
  'Percepción': {
    'Advertir': -30, 'Buscar': -30, 'Rastrear': -30
  },
  'Intelectuales': {
    'Animales': -30, 'Ciencia': null, 'Herbolaria': -30, 'Historia': null,
    'Medicina': null, 'Memorizar': -30, 'Navegación': -30,
    'Ocultismo': -30, 'Tasación': null, 'V. Mágica': null
  },
  'Vigor': {
    'Frialdad': -30, 'P. Fuerza': -30, 'Res. Dolor': -30
  },
  'Subterfugio': {
    'Cerrajería': -30, 'Disfraz': -30, 'Ocultarse': -30,
    'Robo': -30, 'Sigilo': -30, 'Trampería': -30, 'Venenos': null
  },
  'Creativas': {
    'Arte': -30, 'Baile': null, 'Forja': null, 'Música': null, 'T. Manos': -30
  }
}

// Habilidades de Ki
export const HABILIDADES_KI = [
  'Uso del Ki', 'Control del Ki', 'Inhumanidad', 'Zen',
  'Uso de la energía necesaria', 'Eliminación de necesidades',
  'Eliminación de penalizadores', 'Eliminación de peso',
  'Sin necesidades', 'Detección del Ki', 'Ocultación del Ki',
  'Transmisión del Ki', 'Curación por Ki', 'Curación superior',
  'Destrucción por Ki', 'Anulación de Ki', 'Anulación de Ki mayor',
  'Absorción de energía', 'Aumento de características',
  'Armadura de energía', 'Armadura mayor', 'Armadura de vacío',
  'Arm. arcana', 'Escudo físico', 'Aura de combate', 'Aura de ocultación',
  'Aura de Vacío', 'Extrusión de presencia', 'Extrusión de Vacío',
  'Levitación', 'Vuelo', 'Velocidad incrementada', 'Alcance incrementado',
  'Daño incrementado', 'Incremento superior', 'Movimiento de objetos',
  'Movimiento de masas', 'Cambio físico', 'Cambio superior',
  'Control de la edad', 'Falsa muerte', 'Estabilizar', 'Sacrificio vital',
  'Restituir a otros', 'Dominio físico', 'Forzar técnicas',
  'Imitación de técnicas', 'Técnicas de combate improvisadas',
  'Anulación de Lazos', 'Anulación de Magia', 'Anulación de Magia mayor',
  'Anulación de Matrices', 'Anulación de Matrices mayor',
  'Uno con la nada', 'Cuerpo de Vacío', 'Forma de Vacío',
  'Esencia de Vacío', 'Movimiento de Vacío', 'Erudición',
  'Indetección', 'Mult. de cuerpos', 'Mult. mayor',
  'Recuperación', 'Inmunidad elem. ELE', 'Inmunidad elem. FRI', 'Inmunidad elem. FUE',
  'Ataque elemental', 'Uso del Némesis', 'Mag. arcana', 'Mult. arcana',
]

// Vías Místicas
export const VIAS_MISTICAS = [
  'Fuego', 'Agua', 'Tierra', 'Aire', 'Luz', 'Oscuridad',
  'Creación', 'Destrucción', 'Esencia', 'Ilusión', 'Nigromancia',
  'Libre Acceso'
]
