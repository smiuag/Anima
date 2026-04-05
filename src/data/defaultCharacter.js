import { HABILIDADES_SECUNDARIAS, HABILIDADES_KI } from './tables'

const makeCaract = (base = 10) => ({ base, temp: 0, total: base, bono: 0 })

const makeHabSec = () => {
  const result = {}
  for (const [cat, habs] of Object.entries(HABILIDADES_SECUNDARIAS)) {
    result[cat] = {}
    for (const [hab, penBase] of Object.entries(habs)) {
      result[cat][hab] = { penNatural: 0, bono: 0, total: penBase }
    }
  }
  return result
}

const makeKiHabs = () => {
  const result = {}
  for (const h of HABILIDADES_KI) {
    result[h] = { nivel: 0, usado: false, notas: '' }
  }
  return result
}

export const createDefaultCharacter = (id) => ({
  id: id || crypto.randomUUID(),
  meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

  // ── General ──────────────────────────────────────────────────────────────
  nombre: '',
  categoria: '',
  raza: 'Humano',
  sexo: '',
  origen: '',
  edad: '',
  altura: '',
  peso: '',
  ojos: '',
  cabello: '',
  apariencia: '',
  descripcionFisica: '',
  personalidad: '',
  motivacion: '',
  citaFavorita: '',
  equipoCombate: [{ nombre: '', localizacion: '', peso: '' }],
  equipoVariado: [{ nombre: '', peso: '' }],
  vestimenta: [{ nombre: '', peso: '' }],
  artefactos: [{ nombre: '', descripcion: '' }],
  titulosYPosesiones: '',
  contactos: '',
  dinero: { oro: 0, plata: 0, cobre: 0, joyas: 0 },
  fama: '',
  saludMental: { umbral: 0, notas: '' },
  valores: { audacia: 0, cobardia: 0, honorabilidad: 0, infamia: 0 },

  // ── Principal ─────────────────────────────────────────────────────────────
  nivel: 0,
  tamano: 0,
  tamanoNombre: 'Minúsculo',
  clase: '',
  tipoCriatura: '',

  caracteristicas: {
    AGI: makeCaract(10),
    CON: makeCaract(10),
    DES: makeCaract(10),
    FUE: makeCaract(10),
    INT: makeCaract(10),
    PER: makeCaract(10),
    POD: makeCaract(10),
    VOL: makeCaract(10),
  },

  regeneracion: { indice: 3, texto: '30 PV/día' },
  movimiento: { valor: 35, texto: '35 m/asalto' },

  puntosVida: { base: 20, total: 20, actual: 20, esp: 0 },
  cansancio: { total: 0, actual: 0 },

  turno: { base: 40, boniAgi: 0, boniDes: 0, boniCat: 0, penArmad: 0, boniArma: 20, esp: 0, total: 60 },

  habilidadesCombate: {
    ataque: { base: 0, bono: 0, total: 0 },
    esquiva: { base: 0, bono: 0, total: 0 },
    parada: { base: 0, bono: 0, total: 0 },
    armadura: { base: 0, bono: 0, total: 0 },
    armaDesarrollada: '',
    accionesPorTurno: 1,
  },

  habilidadesSecundarias: makeHabSec(),
  habSecEspeciales: [
    { nombre: '', penNatural: null, bono: 0, total: 0 },
    { nombre: '', penNatural: null, bono: 0, total: 0 },
    { nombre: '', penNatural: null, bono: 0, total: 0 },
  ],

  resistencias: {
    presBase: { base: 20, bono: 0, raza: 0, esp: 0, total: 20 },
    RF: { base: 20, bono: 0, raza: 0, esp: 0, total: 20 },
    RE: { base: 20, bono: 0, raza: 0, esp: 0, total: 20 },
    RV: { base: 20, bono: 0, raza: 0, esp: 0, total: 20 },
    RM: { base: 20, bono: 0, raza: 0, esp: 0, total: 20 },
    RP: { base: 20, bono: 0, raza: 0, esp: 0, total: 20 },
    esp: '',
  },

  idiomas: { base: '', primero: '', segundo: '', tercero: '', cuarto: '', quinto: '', sexto: '' },

  puntosCreacion: 3,
  puntosDestino: 0,

  capacidadesRaciales: ['', '', '', '', '', ''],
  legadosSangre: ['', '', '', '', '', ''],

  ajustesNivel: [
    { tipo: 'Ajuste de Nivel', notas: '', nivel: 0, pds: 0 },
    { tipo: 'Ajuste por Gnosis', notas: '', nivel: 0, pds: 0 },
    { tipo: 'Ajuste por Legados', notas: 'Sí', nivel: 0, pds: 0 },
    { tipo: 'Artefacto vinculado', notas: 'No', nivel: 0, pds: 0 },
    { tipo: 'PDs Adicionales', notas: '', nivel: 0, pds: 0 },
  ],

  notasAdicionales: '',
  gnosis: 0,
  natura: '-',

  capacidadesInnatas: [{ nombre: '', descripcion: '' }],
  habilidadesEsenciales: [{ nombre: '', valor: '' }],
  poderesCriatura: [{ nombre: '', poder: '' }],

  // ── Combate ────────────────────────────────────────────────────────────────
  armaduras: [
    { nombre: '', localizacion: '', calidad: 0, FIL: 0, CON: 0, PEN: 0, CAL: 0, ELE: 0, FRI: 0, ENE: 0, ent: 0, pres: 0, rMov: 0 }
  ],
  restriccionMovimiento: 0,
  requisito: 0,
  requisitoNatural: 0,
  penGeneral: 0,
  penNaturalArmadura: 0,

  tablaDanos: (() => {
    const t = {}
    for (let i = 10; i <= 400; i += 10) t[i] = { corte: 0, imp: 0, pen: 0, cal: 0 }
    return t
  })(),

  armas: {
    sinArmas: { nombre: 'Desarmado', turno: 60, ataque: 0, defensa: 0, tipoDefensa: 'Esq', dano: 10, crit1: 'CON', crit2: '-', ent: 0, rotura: 0, pres: 20, calidad: 0, tamExcesivo: false, boniTurno: 0, boniAtaque: 0, boniParada: 0, boniEsq: 0, boniDano: 0 },
    arma1: { nombre: '', tam: 'Normal', turno: 0, ataque: 0, defensa: 0, tipoDefensa: 'Par', dano: 0, crit1: '', crit2: '', ent: 0, rotura: 0, pres: 0, calidad: 0, tamExcesivo: false },
    adicional1: { nombre: '', tam: 'Normal', turno: 0, ataque: 0, defensa: 0, tipoDefensa: 'Esq', dano: 0, crit1: '', crit2: '', ent: 0, rotura: 0, pres: 0, calidad: 0, tamExcesivo: false },
    arma2: { nombre: '', tam: 'Normal', turno: 0, ataque: 0, defensa: 0, tipoDefensa: 'Par', dano: 0, crit1: '', crit2: '', ent: 0, rotura: 0, pres: 0, calidad: 0, tamExcesivo: false },
    adicional2: { nombre: '', tam: 'Normal', turno: 0, ataque: 0, defensa: 0, tipoDefensa: 'Esq', dano: 0, crit1: '', crit2: '', ent: 0, rotura: 0, pres: 0, calidad: 0, tamExcesivo: false },
    dosManos: { nombre: '', tam: 'Normal', turno: 0, ataque: 0, defensa: 0, tipoDefensa: 'Par', dano: 0, crit1: '', crit2: '', ent: 0, rotura: 0, pres: 0, calidad: 0, tamExcesivo: false },
    disparo: { nombre: '', tam: 'Normal', turno: 0, ataque: 0, defensa: 0, tipoDefensa: 'Esq', dano: 0, crit1: '', crit2: '', ent: 0, rotura: 0, pres: 0, calidad: 0, rango: 0, recarga: 0, municion: { nombre: '', crit1: '', crit2: '', ent: 0, rotura: 0, pres: 0, total: 0 } },
  },

  modificadoresCombate: { penDolor: 0, penCansancio: 0, penFisico: 0, bonoEsp1: 0, bonoEsp2: 0, total: 0 },

  tablasArmas: [{ nombre: '', descripcion: '' }],
  tablasEstilos: [{ nombre: '', descripcion: '' }],
  artesMarciales: [{ nombre: '', descripcion: '' }],
  arsMagnus: [{ nombre: '', descripcion: '' }],
  capacidadesCombate: [{ nombre: '', descripcion: '' }],

  // ── Ki ─────────────────────────────────────────────────────────────────────
  ki: {
    puntos: {
      AGI: { acu: 0, ki: 0, actual: 0 },
      CON: { acu: 0, ki: 0, actual: 0 },
      DES: { acu: 0, ki: 0, actual: 0 },
      FUE: { acu: 0, ki: 0, actual: 0 },
      POD: { acu: 0, ki: 0, actual: 0 },
      VOL: { acu: 0, ki: 0, actual: 0 },
    },
    cmTotal: 0, cmUsado: 0,
    limites: 0,
    habilidades: makeKiHabs(),
    tecnicasDominio: [{ nombre: '', nivel: 0, notas: '' }],
    sellos: { madera: 0, agua: 0, fuego: 0, tierra: 0, metal: 0, aire: 0 },
    pacteosSangre: [{ criatura: '', sellos: '' }],
  },

  // ── Místicos ───────────────────────────────────────────────────────────────
  misticos: {
    zeon: { total: 0, usado: 0, diario: 0 },
    acumulacion: 0,
    proyeccionMagica: 0,
    nivelMagia: 0, nivelMaximo: 0, nivelUsado: 0,
    nombreVerdadero: '',
    vias: [
      { via: '', subVia: '', nivel: 0, nivelMax: 0, nivelUsado: 0 },
      { via: '', subVia: '', nivel: 0, nivelMax: 0, nivelUsado: 0 },
    ],
    conjuros: [{ nombre: '', via: '', nivel: 0, descripcion: '' }],
    conjurosActivos: 0,
    conjurosLibreRestantes: 0,
    costeDiario: 0,
    amplificador: '',
    contenedor: '',
    especialidad: '',
    metamagia: [{ nombre: '', nivel: 0 }],
    poderesMisticos: [{ nombre: '', descripcion: '' }],
    potencialInnato: 0,
    invocaciones: [{ nombre: '', convocatoria: 0, dominacion: 0, atadura: 0, desconvocacion: 0, criaturas: 0 }],
    ritualConvocacion: {
      nombreVerdadero: '',
      convocMasa: '',
      desconocerTipo: '',
      pertenencia: '',
      tenerParte: '',
      criaturas: [{ nombre: '', sellos: '' }],
    },
  },

  // ── Psíquicos ──────────────────────────────────────────────────────────────
  psiquicos: {
    cvs: { total: 0, libres: 0, usados: 0, porTurno: 0 },
    potencial: 0,
    proyeccion: 0,
    disciplinas: [{ nombre: '', afines: '' }],
    poderes: [{ nombre: '', descripcion: '' }],
    patronesMentales: [
      { nombre: '', bonos: '', penalizadores: '', coste: 0, coste2: 0, descripcion: '' }
    ],
    cristalPsi: '',
    innatos: 0,
    notas: '',
  },

  // ── PDs ────────────────────────────────────────────────────────────────────
  pds: {
    pdsTotal: 0,
    pdsGastados: 0,
    pdsLibres: 0,
    bonusNoveles: [],
    bonusNaturales: [],
    habNaturales: [],
    niveles: Array.from({ length: 20 }, (_, i) => ({
      nivel: i + 1,
      pdsGanados: 0,
      combate: { hAtaque: 0, hEsquiva: 0, hParada: 0, llArmadura: 0, tablasArmas: 0, tablasEstilos: 0, artesMarciales: 0 },
      ki: { puntosKi: 0, acuKi: 0, cm: 0 },
      mistico: { zeón: 0, nivelMagia: 0, proyMagica: 0, convocar: 0, dominar: 0, atar: 0, desconvocar: 0 },
      psiquico: { cvs: 0, proyPsi: 0 },
      secundarias: {},
      caracteristicas: { pdsGastados: 0, notas: '' },
      ventajas: [],
      notas: '',
    })),
  },

  // ── Personalización ────────────────────────────────────────────────────────
  personalizacion: {
    elan: [{ nombre: '', modificadores: '' }, { nombre: '', modificadores: '' }],
    invocacionesPersonalizadas: Array.from({ length: 7 }, () => ({ nombre: '', dif: '', zeon: 0, limite: 0 })),
    conjuroEspecializado: Array.from({ length: 7 }, () => ({ conjuro: '', nivel: 0 })),
    patronesMentalesPersonalizados: [
      { patron: '', bonos: '', penalizadores: '', coste: 0, coste2: 0, descripcion: '' },
      { patron: '', bonos: '', penalizadores: '', coste: 0, coste2: 0, descripcion: '' },
    ],
  },
})
