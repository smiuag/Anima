import React, { useState } from 'react'
import {
  getBonoCaracteristica, getCatData, getRazaData, PV_BASE_CON,
  TAMANOS, getTamano, ACCIONES_TURNO,
  getHabCombateCalc, RESISTENCIA_STAT, calcPDsGastados
} from '../data/tables'

const Stat = ({ label, value, warn = false, dim = false }) => (
  <div className={`flex flex-col items-center px-2 py-0.5 rounded ${dim ? 'opacity-40' : ''}`}>
    <span className="text-[10px] text-[#4a3520] leading-none mb-0.5">{label}</span>
    <span className={`text-xs font-bold leading-none ${warn ? 'text-red-400' : 'text-[#c9a84c]'}`}>{value}</span>
  </div>
)

const Sep = () => <div className="w-px bg-[#2a1f10] self-stretch mx-0.5" />

export default function CharacterSummary({ char }) {
  const [open, setOpen] = useState(true)

  const catData = getCatData(char.categoria)
  const razaData = getRazaData(char.raza)
  const nivel = parseInt(char.nivel) || 0

  const getStatTotal = (s) => {
    const c = char.caracteristicas?.[s] || {}
    return (parseInt(c.base) || 0) + (parseInt(c.temp) || 0) + (razaData[s] || 0)
  }
  const calcBono = (s) => getBonoCaracteristica(getStatTotal(s))

  const pdNiveles = char.pds?.niveles || []

  // PV
  const conTotal = getStatTotal('CON')
  const pvBase = PV_BASE_CON[Math.min(Math.max(conTotal, 1), 20)] ?? 20
  const pvMultiplos = pdNiveles.reduce((s, n) => s + (parseInt(n?.combate?.['Múltiplos de PV']) || 0), 0)
  const pvCalc = pvBase * (1 + pvMultiplos) + (catData.PlusPV || 0) * nivel + (parseInt(char.puntosVida?.esp) || 0)
  const zeonPDs = pdNiveles.reduce((s, n) => s + (parseInt(n?.mistico?.['Zeón']) || 0), 0) * 5

  // Zeón
  const podTotal = getStatTotal('POD')
  const zeonBase = PV_BASE_CON[Math.min(Math.max(podTotal, 1), 20)] ?? 0
  const zeonCalc = zeonBase + (catData.PlusZeon || 0) * nivel + (parseInt(char.misticos?.zeon?.esp) || 0) + zeonPDs

  // Turno
  const fueTotal = getStatTotal('FUE')
  const tamanoBase = getTamano(fueTotal, conTotal)
  const tamanoOffset = razaData.Tamano || 0
  const tamano = tamanoOffset === 0 ? tamanoBase : (() => {
    const idx = TAMANOS.indexOf(tamanoBase)
    const newIdx = Math.min(Math.max(idx + tamanoOffset, 0), TAMANOS.length - 1)
    return TAMANOS[newIdx]
  })()
  const penGeneralArmadura = (char.armaduras || []).reduce((sum, a) => sum + (parseInt(a.rMov) || 0), 0)
  const penNaturalArmadura = parseInt(char.penNaturalArmadura) || 0
  const habCombateCalc = getHabCombateCalc(char, catData)
  const habArmaduraTotal = habCombateCalc.armadura + (parseInt(char.habilidadesCombate?.armadura?.esp) || 0)
  const penArmadFinal = penGeneralArmadura === 0 ? 0
    : Math.min(-penNaturalArmadura, -penGeneralArmadura + Math.floor(habArmaduraTotal / 10))
  const turnoCalc = tamano.turnoBase + calcBono('AGI') + calcBono('DES') + (catData.PlusTurno || 0) + penArmadFinal
    + (parseInt(char.turno?.boniArma) || 20) + (parseInt(char.turno?.esp) || 0)

  // H. Ataque / Esquiva / Parada
  const habAtq = habCombateCalc.ataque + (parseInt(char.habilidadesCombate?.ataque?.esp) || 0)
  const habEsq = habCombateCalc.esquiva + (parseInt(char.habilidadesCombate?.esquiva?.esp) || 0)
  const habPar = habCombateCalc.parada + (parseInt(char.habilidadesCombate?.parada?.esp) || 0)

  // Acciones
  const acciones = ACCIONES_TURNO(getStatTotal('DES') + getStatTotal('AGI'))

  // CM
  const pdsCmTotal = pdNiveles.reduce((s, n) => s + (parseInt(n?.ki?.['CM']) || 0), 0)
  const cmCalc = (catData.PlusCM || 0) * nivel + pdsCmTotal

  // Resistencias
  const presenciaBase = nivel === 0 ? 20 : nivel === 1 ? 30 : 30 + (nivel - 1) * 5
  const presRes = char.resistencias?.presBase || {}
  const presenciaTotal = presenciaBase + (parseInt(presRes.bono) || 0) + (parseInt(presRes.esp) || 0)
  const getRes = (r) => {
    const statKey = RESISTENCIA_STAT[r]
    const base = presenciaTotal + (statKey ? calcBono(statKey) : 0)
    const rData = char.resistencias?.[r] || {}
    return base + (razaData[r] || 0) + (parseInt(rData.bono) || 0) + (parseInt(rData.esp) || 0)
  }

  // PDs libres — usando la función compartida con PDsTab
  const totalGanados  = pdNiveles.reduce((s, n) => s + (parseInt(n?.pdsGanados) || 0), 0)
  const totalGastados = calcPDsGastados(char, catData)
  const pdsLibres = totalGanados - totalGastados

  if (!open) {
    return (
      <div className="bg-[#1a1410] border-b border-[#2a1f10] px-3 py-0.5 flex items-center gap-2 no-print cursor-pointer" onClick={() => setOpen(true)}>
        <span className="text-[#4a3520] text-xs">▶ Resumen</span>
        <span className="text-[#c9a84c] text-xs font-bold">PV {pvCalc}</span>
        <span className="text-[#8a7560] text-xs">Turno {turnoCalc}</span>
        <span className="text-[#8a7560] text-xs">Atq {habAtq} / Esq {habEsq}</span>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1410] border-b border-[#2a1f10] no-print">
      <div className="flex items-center overflow-x-auto px-2 py-1 gap-0">
        <button className="text-[#4a3520] hover:text-[#8a7560] text-xs mr-1 shrink-0" onClick={() => setOpen(false)} title="Colapsar resumen">▼</button>

        <Stat label="PV" value={pvCalc} />
        <Stat label="Cansancio" value={conTotal} />
        <Sep />
        <Stat label="Turno" value={turnoCalc} warn={penArmadFinal < 0} />
        <Stat label="Acc/T" value={acciones} />
        <Sep />
        <Stat label="H.Atq" value={habAtq} />
        <Stat label="H.Esq" value={habEsq} />
        <Stat label="H.Par" value={habPar} />
        <Sep />
        <Stat label="RF" value={getRes('RF')} />
        <Stat label="RE" value={getRes('RE')} />
        <Stat label="RV" value={getRes('RV')} />
        <Stat label="RM" value={getRes('RM')} />
        <Stat label="RP" value={getRes('RP')} />
        <Sep />
        <Stat label="Zeón" value={zeonCalc} dim={zeonCalc <= 0} />
        <Stat label="CM" value={cmCalc} dim={cmCalc <= 0} />
        <Sep />
        <Stat label="PDs lib." value={pdsLibres} warn={pdsLibres < 0} />
      </div>
    </div>
  )
}
