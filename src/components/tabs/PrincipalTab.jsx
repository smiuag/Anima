import React from 'react'
import useCharacterStore from '../../store/useCharacterStore'
import CollapsiblePanel from '../CollapsiblePanel'
import { getBonoCaracteristica, MOVIMIENTO_AGI, REGENERACION_CON, HABILIDADES_SECUNDARIAS,
         TAMANOS, getTamano, getCatData, PV_BASE_CON,
         HAB_SEC_PLUS_KEYS, RESISTENCIA_STAT, ACCIONES_TURNO, getRazaData,
         getHabCombateCalc } from '../../data/tables'

const F = ({ label, children, w = 'flex-1' }) => (
  <div className={`${w} flex flex-col gap-0.5`}>
    {label && <span className="field-label">{label}</span>}
    {children}
  </div>
)

const Calc = ({ value, w = 'w-12' }) => (
  <div className={`calc-value text-center px-1 ${w}`}>{value ?? 0}</div>
)

export default function PrincipalTab({ char }) {
  const updateField = useCharacterStore(s => s.updateField)
  const set = (path, val) => updateField(char.id, path, val)

  const caract = char.caracteristicas || {}
  const stats = ['AGI', 'CON', 'DES', 'FUE', 'INT', 'PER', 'POD', 'VOL']

  const calcTotal = (stat) => {
    const c = caract[stat] || {}
    return (parseInt(c.base) || 0) + (parseInt(c.temp) || 0)
  }
  // calcTotal con bono racial incluido (para fórmulas derivadas)
  const calcTotalConRaza = (stat) => calcTotal(stat) + (getRazaData(char.raza)[stat] || 0)
  const calcBono = (stat) => getBonoCaracteristica(calcTotalConRaza(stat))

  const handleCaractChange = (stat, field, val) => {
    set(`caracteristicas.${stat}.${field}`, val === '' ? '' : +val)
  }

  // Category and race data (auto-derived)
  const catData = getCatData(char.categoria)
  const razaData = getRazaData(char.raza)

  // Stats con bono racial incluido (para regeneración, tamaño, movimiento)
  const conTotal = calcTotalConRaza('CON')
  const agiTotal = calcTotalConRaza('AGI')
  const fueTotal = calcTotalConRaza('FUE')

  // Regeneración por CON (incluye bono racial)
  const regenIdx = REGENERACION_CON[Math.min(Math.max(conTotal, 1), 20)] ?? 0

  // Movimiento por AGI (incluye bono racial)
  const movTexto = MOVIMIENTO_AGI[Math.min(Math.max(agiTotal, 1), 20)] || '35 m/asalto'

  // Tamaño: base FUE+CON (con raza) + desplazamiento de categoría racial
  const tamanoBase = getTamano(fueTotal, conTotal)
  const tamanoOffset = razaData.Tamano || 0
  const tamano = tamanoOffset === 0 ? tamanoBase : (() => {
    const idx = TAMANOS.indexOf(tamanoBase)
    const newIdx = Math.min(Math.max(idx + tamanoOffset, 0), TAMANOS.length - 1)
    return TAMANOS[newIdx]
  })()
  const turnoBase = tamano.turnoBase

  // PV auto-calculated: PV_BASE_CON[CON] + PlusPV × nivel
  const pvBase = PV_BASE_CON[Math.min(Math.max(conTotal, 1), 20)] ?? 20
  const nivel = parseInt(char.nivel) || 0
  // Presencia base auto-calc: nivel 0→20, nivel 1→30, nivel 2+→30+(nivel-1)×5
  const presenciaBase = nivel === 0 ? 20 : nivel === 1 ? 30 : 30 + (nivel - 1) * 5
  const catPlusPV = catData.PlusPV || 0
  const pvMultiplos = (char.pds?.niveles || []).reduce((sum, n) => sum + (parseInt(n?.combate?.['Múltiplos de PV']) || 0), 0)
  const pvCalculado = pvBase * (1 + pvMultiplos) + catPlusPV * nivel + (parseInt(char.puntosVida?.esp) || 0)

  // Penalización de armadura auto-calc
  // penGeneral = Σ(rMov de todas las armaduras equipadas)
  const penGeneralArmadura = (char.armaduras || []).reduce((sum, a) => sum + (parseInt(a.rMov) || 0), 0)
  const penNaturalArmadura = parseInt(char.penNaturalArmadura) || 0

  // Habilidades de combate auto-calc desde PDsTab (función compartida con CombateTab)
  const pdNiveles = char.pds?.niveles || []
  const habCombateCalc = getHabCombateCalc(char, catData)

  // Pen. Armadura al Turno:
  //   penActual = min(-penNatural, -penGeneral + floor(habLlevarArmadura / 10))
  //   penNatural = mínimo que siempre se aplica; penGeneral = penalización bruta
  const habArmaduraTotal = habCombateCalc.armadura + (parseInt(char.habilidadesCombate?.armadura?.esp) || 0)
  const penArmadFinal = penGeneralArmadura === 0 ? 0
    : Math.min(-penNaturalArmadura, -penGeneralArmadura + Math.floor(habArmaduraTotal / 10))

  // Turno (PlusTurno de categoría es el bono de iniciativa de la categoría)
  const turno = char.turno || {}
  const catPlusTurno = catData.PlusTurno || 0
  const turnoTotal = turnoBase +
    calcBono('AGI') +
    calcBono('DES') +
    catPlusTurno +
    penArmadFinal +
    (parseInt(turno.boniArma) || 20) +
    (parseInt(turno.esp) || 0)

  // Habilidades secundarias: Σ(pts en PDsTab × 5) por habilidad
  const sumSecPDs = (hab) => pdNiveles.reduce((sum, n) => sum + (parseInt(n?.secundarias?.[hab]) || 0), 0)

  const habSec = char.habilidadesSecundarias || {}

  return (
    <div className="grid grid-cols-3 gap-3 p-3">
      {/* ── Columna 1: Características + Resistencias ── */}
      <div className="flex flex-col gap-3">
        {/* Características */}
        <div className="panel">
          <div className="panel-title">Características</div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Stat</th>
                <th className="table-header">Base</th>
                <th className="table-header">Temp</th>
                <th className="table-header w-8">Raza</th>
                <th className="table-header">Total</th>
                <th className="table-header">Bono</th>
              </tr>
            </thead>
            <tbody>
              {stats.map(s => {
                const c = caract[s] || {}
                const razaBonus = razaData[s] || 0
                const total = calcTotal(s) + razaBonus
                const bono = getBonoCaracteristica(total)
                return (
                  <tr key={s}>
                    <td className="table-cell text-[#c9a84c] font-bold text-center">{s}</td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={c.base ?? 10}
                        onChange={e => handleCaractChange(s, 'base', e.target.value)} />
                    </td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={c.temp ?? 0}
                        onChange={e => handleCaractChange(s, 'temp', e.target.value)} />
                    </td>
                    <td className="table-cell text-center">
                      <span className={razaBonus !== 0 ? (razaBonus > 0 ? 'text-green-400 font-bold text-xs' : 'text-red-400 font-bold text-xs') : 'text-[#4a3520] text-xs'}>
                        {razaBonus !== 0 ? (razaBonus > 0 ? '+' : '') + razaBonus : '—'}
                      </span>
                    </td>
                    <td className="table-cell"><span className="calc-input block w-full text-center px-1 rounded">{total}</span></td>
                    <td className="table-cell"><span className={`block w-full text-center px-1 rounded font-bold ${bono >= 0 ? 'text-green-400' : 'text-red-400'}`}>{bono >= 0 ? '+' : ''}{bono}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Regeneración y Movimiento */}
        <CollapsiblePanel title="Regeneración y Movimiento" defaultOpen={false}>
          <div className="p-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="field-label">Índice Regeneración</span>
              <Calc value={regenIdx} w="w-8" />
            </div>
            <F label="Esp. Regeneración">
              <input value={char.regeneracion?.esp || ''} onChange={e => set('regeneracion.esp', e.target.value)} />
            </F>
            <div className="flex items-center justify-between">
              <span className="field-label">Movimiento (AGI {agiTotal})</span>
              <span className="text-[#c9a84c] text-xs font-bold">{movTexto}</span>
            </div>
            <F label="Esp. Movimiento">
              <input value={char.movimiento?.esp || ''} onChange={e => set('movimiento.esp', e.target.value)} />
            </F>
          </div>
        </CollapsiblePanel>

        {/* Puntos de Vida */}
        <div className="panel">
          <div className="panel-title">Puntos de Vida</div>
          <div className="p-2 flex flex-col gap-1">
            <div className="flex gap-2 text-xs">
              <div className="flex-1">
                <div className="field-label">Calculado</div>
                <div className="calc-input text-center rounded px-1 font-bold text-[#c9a84c]">{pvCalculado}</div>
                <div className="text-[#4a3520] text-center mt-0.5">CON:{pvBase}×(1+{pvMultiplos}) +{catPlusPV}×Nv{nivel}</div>
              </div>
              <F label="Esp."><input type="number" value={char.puntosVida?.esp ?? 0} onChange={e => set('puntosVida.esp', +e.target.value)} /></F>
              <F label="Actual"><input type="number" value={char.puntosVida?.actual ?? pvCalculado} onChange={e => set('puntosVida.actual', +e.target.value)} /></F>
            </div>
          </div>
        </div>

        {/* Cansancio */}
        <CollapsiblePanel title="Cansancio">
          <div className="p-2 flex gap-2 items-end">
            <F label="Máximo (CON)">
              <div className="calc-value text-center">{conTotal}</div>
            </F>
            <F label="Actual"><input type="number" value={char.cansancio?.actual ?? conTotal} onChange={e => set('cansancio.actual', +e.target.value)} /></F>
          </div>
        </CollapsiblePanel>

        {/* Resistencias */}
        <div className="panel">
          <div className="panel-title">Resistencias</div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Res.</th>
                <th className="table-header">Base</th>
                <th className="table-header">Raza</th>
                <th className="table-header">Bono</th>
                <th className="table-header">Esp.</th>
                <th className="table-header">Total</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Presencia auto-calc por nivel + bonos manuales (base de todas las resistencias)
                const presRes = char.resistencias?.presBase || {}
                const presenciaTotal = presenciaBase + (parseInt(presRes.bono) || 0) + (parseInt(presRes.esp) || 0)
                return ['presBase', 'RF', 'RE', 'RV', 'RM', 'RP'].map(r => {
                const res = char.resistencias?.[r] || {}
                const label = r === 'presBase' ? 'Pres.' : r
                const statKey = RESISTENCIA_STAT[r]
                // presBase muestra su base auto-calc; las demás usan presenciaTotal como base
                const baseCalc = r === 'presBase'
                  ? presenciaBase
                  : presenciaTotal + (statKey ? calcBono(statKey) : 0)
                const razaBonus = razaData[r] || 0
                const bono = parseInt(res.bono) || 0
                const esp  = parseInt(res.esp)  || 0
                const total = r === 'presBase'
                  ? presenciaTotal
                  : baseCalc + razaBonus + bono + esp
                return (
                  <tr key={r}>
                    <td className="table-cell text-[#c9a84c] font-bold text-center text-xs">
                      {label}{statKey ? <span className="text-[#4a3520] font-normal text-xs"> ({statKey})</span> : ''}
                    </td>
                    <td className="table-cell">
                      <span className="calc-input block text-center px-1 rounded">{baseCalc}</span>
                    </td>
                    <td className="table-cell text-center">
                      <span className={razaBonus !== 0 ? (razaBonus > 0 ? 'text-green-400 font-bold text-xs' : 'text-red-400 font-bold text-xs') : 'text-[#4a3520] text-xs'}>
                        {razaBonus !== 0 ? (razaBonus > 0 ? '+' : '') + razaBonus : '—'}
                      </span>
                    </td>
                    <td className="table-cell"><input type="number" className="w-full text-center" value={res.bono ?? 0} onChange={e => set(`resistencias.${r}.bono`, +e.target.value)} /></td>
                    <td className="table-cell"><input type="number" className="w-full text-center" value={res.esp ?? 0} onChange={e => set(`resistencias.${r}.esp`, +e.target.value)} /></td>
                    <td className="table-cell"><span className="calc-input block text-center px-1 rounded font-bold">{total}</span></td>
                  </tr>
                )
              })
              })()}
            </tbody>
          </table>
        </div>

        {/* Idiomas */}
        <CollapsiblePanel title="Idiomas" defaultOpen={false}>
          <div className="p-2 flex flex-col gap-1">
            {['base', 'primero', 'segundo', 'tercero', 'cuarto', 'quinto', 'sexto'].map(k => (
              <F key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
                <input value={char.idiomas?.[k] || ''} onChange={e => set(`idiomas.${k}`, e.target.value)} />
              </F>
            ))}
          </div>
        </CollapsiblePanel>

        <CollapsiblePanel title="Puntos" defaultOpen={false}>
          <div className="p-2 flex flex-col gap-1">
            <F label="Puntos de Creación">
              <input type="number" value={char.puntosCreacion ?? 3} onChange={e => set('puntosCreacion', +e.target.value)} />
            </F>
            <F label="Puntos de Destino">
              <input type="number" value={char.puntosDestino ?? 0} onChange={e => set('puntosDestino', +e.target.value)} />
            </F>
            <F label="Gnosis">
              <input type="number" value={char.gnosis ?? 0} onChange={e => set('gnosis', +e.target.value)} />
            </F>
            <F label="Natura">
              <input value={char.natura || '-'} onChange={e => set('natura', e.target.value)} />
            </F>
          </div>
        </CollapsiblePanel>
      </div>

      {/* ── Columna 2: Turno + Combate + Secundarias (Atl, Soc, Per, Vig) ── */}
      <div className="flex flex-col gap-3">
        {/* Turno */}
        <div className="panel">
          <div className="panel-title">Turno</div>
          <table className="w-full text-xs">
            <tbody>
              <tr><td className="table-cell field-label pl-2">Base (Tamaño: {tamano.nombre})</td><td className="table-cell"><span className="calc-input block text-center">{turnoBase}</span></td></tr>
              <tr><td className="table-cell field-label pl-2">AGI (Bono)</td><td className="table-cell"><span className="calc-input block text-center">{calcBono('AGI')}</span></td></tr>
              <tr><td className="table-cell field-label pl-2">DES (Bono)</td><td className="table-cell"><span className="calc-input block text-center">{calcBono('DES')}</span></td></tr>
              <tr><td className="table-cell field-label pl-2">Bono Categoría {char.categoria ? `(${char.categoria})` : ''}</td><td className="table-cell"><span className="calc-input block text-center">{catPlusTurno}</span></td></tr>
              <tr><td className="table-cell field-label pl-2">Pen. Armadura (calc.)</td><td className="table-cell"><span className={`calc-input block text-center rounded ${penArmadFinal < 0 ? 'text-red-400' : ''}`}>{penArmadFinal}</span></td></tr>
              <tr><td className="table-cell field-label pl-2">Bono Arma</td><td className="table-cell"><input type="number" className="w-full text-center" value={turno.boniArma ?? 20} onChange={e => set('turno.boniArma', +e.target.value)} /></td></tr>
              <tr><td className="table-cell field-label pl-2">Esp.</td><td className="table-cell"><input type="number" className="w-full text-center" value={turno.esp ?? 0} onChange={e => set('turno.esp', +e.target.value)} /></td></tr>
              <tr className="border-t border-[#c9a84c]">
                <td className="table-cell text-[#c9a84c] font-bold pl-2">TOTAL</td>
                <td className="table-cell"><span className="calc-input block text-center font-bold text-lg">{turnoTotal}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Habilidades de Combate */}
        <div className="panel">
          <div className="panel-title">Habilidades de Combate</div>
          <div className="p-2 flex flex-col gap-2">
            <div className="flex text-[#4a3520] text-xs px-0 mb-0.5">
              <span className="w-24"></span>
              <span className="w-14 text-center">PDs×5</span>
              <span className="w-14 text-center">Esp.</span>
              <span className="w-12 text-center font-bold text-[#8a7560]">Total</span>
            </div>
            {['ataque', 'esquiva', 'parada', 'armadura'].map(h => {
              const hc = char.habilidadesCombate?.[h] || {}
              const labels = { ataque: 'H. Ataque', esquiva: 'H. Esquiva', parada: 'H. Parada', armadura: 'Ll. Armadura' }
              const fromPDs = habCombateCalc[h]
              const esp = parseInt(hc.esp) || 0
              const total = fromPDs + esp
              return (
                <div key={h} className="flex items-center gap-1">
                  <span className="field-label w-24">{labels[h]}</span>
                  <span className="calc-input w-14 text-center rounded">{fromPDs}</span>
                  <input type="number" className="w-14 text-center" value={hc.esp ?? 0}
                    onChange={e => set(`habilidadesCombate.${h}.esp`, +e.target.value)} />
                  <span className="calc-input w-12 text-center rounded font-bold text-[#c9a84c]">{total}</span>
                </div>
              )
            })}
            <div className="flex gap-2 mt-1">
              <F label="Arma Desarrollada">
                <input value={char.habilidadesCombate?.armaDesarrollada || ''} onChange={e => set('habilidadesCombate.armaDesarrollada', e.target.value)} />
              </F>
              <div className="flex flex-col gap-0.5 w-20">
                <span className="field-label">Acc/Turno</span>
                <div className="calc-value text-center">{ACCIONES_TURNO(calcTotalConRaza('DES') + agiTotal)}</div>
                <span className="text-[#4a3520] text-center" style={{fontSize:'9px'}}>DES+AGI={calcTotalConRaza('DES')+agiTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Límites y bonos de Categoría */}
        {char.categoria && (
          <CollapsiblePanel title={`Límites de Categoría — ${char.categoria}`} defaultOpen={false}>
            <div className="p-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              {[
                ['Límite Combate', Math.round((catData['Limite Combate'] || 0.5) * 100) + '%'],
                ['Límite Magia',   Math.round((catData['Limite Magia']   || 0.5) * 100) + '%'],
                ['Límite Psi',     Math.round((catData['Limite Psi']     || 0.5) * 100) + '%'],
                ['+PV/nivel',      catData.PlusPV || 0],
                ['+CM/nivel',      catData.PlusCM || 0],
                ['+Zeon base',     catData.PlusZeon || 0],
                ['Coste ACT (×mult)',catData.ACT || 0],
                ['+CV/nivel',      catData.PlusCV != null ? catData.PlusCV.toFixed(2).replace(/\.?0+$/, '') : '—'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-[#8a7560]">{label}</span>
                  <span className="text-[#c9a84c] font-bold">{val}</span>
                </div>
              ))}
            </div>
          </CollapsiblePanel>
        )}

        <CollapsiblePanel title="Ajustes de Nivel" defaultOpen={false}>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left">Tipo</th>
                <th className="table-header">Notas</th>
                <th className="table-header w-10">Nv.</th>
                <th className="table-header w-10">PDs</th>
              </tr>
            </thead>
            <tbody>
              {(char.ajustesNivel || []).map((a, i) => (
                <tr key={i}>
                  <td className="table-cell text-[#8a7560] text-xs">{a.tipo}</td>
                  <td className="table-cell"><input value={a.notas} onChange={e => {
                    const list = [...(char.ajustesNivel || [])]
                    list[i] = { ...list[i], notas: e.target.value }
                    set('ajustesNivel', list)
                  }} /></td>
                  <td className="table-cell"><input type="number" className="w-full text-center" value={a.nivel} onChange={e => {
                    const list = [...(char.ajustesNivel || [])]
                    list[i] = { ...list[i], nivel: +e.target.value }
                    set('ajustesNivel', list)
                  }} /></td>
                  <td className="table-cell"><input type="number" className="w-full text-center" value={a.pds} onChange={e => {
                    const list = [...(char.ajustesNivel || [])]
                    list[i] = { ...list[i], pds: +e.target.value }
                    set('ajustesNivel', list)
                  }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsiblePanel>

        <CollapsiblePanel title="Capacidades Raciales" defaultOpen={false}>
          <div className="p-2 flex flex-col gap-2">
            {/* Capacidades automáticas de la raza seleccionada */}
            {razaData.capacidades?.length > 0 && (
              <div>
                <div className="text-[#8a7560] text-xs mb-1">
                  Automáticas ({char.raza || 'sin raza'}):
                </div>
                <ul className="flex flex-col gap-0.5">
                  {razaData.capacidades.map((cap, i) => (
                    <li key={i} className="text-xs text-[#c9a84c] pl-2 border-l-2 border-[#4a3520]">{cap}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Capacidades adicionales (manuales) */}
            <div>
              {razaData.capacidades?.length > 0 && (
                <div className="text-[#8a7560] text-xs mb-1">Adicionales / personalizadas:</div>
              )}
              <div className="flex flex-col gap-1">
                {(char.capacidadesRaciales || []).map((cap, i) => (
                  <div key={i} className="flex gap-1">
                    <input className="flex-1" value={cap} onChange={e => {
                      const list = [...(char.capacidadesRaciales || [])]
                      list[i] = e.target.value
                      set('capacidadesRaciales', list)
                    }} />
                    <button className="text-[#4a3520] hover:text-red-500 text-xs px-1" onClick={() =>
                      set('capacidadesRaciales', (char.capacidadesRaciales || []).filter((_, idx) => idx !== i))
                    }>✕</button>
                  </div>
                ))}
                <button className="add-row-btn text-left" onClick={() =>
                  set('capacidadesRaciales', [...(char.capacidadesRaciales || []), ''])
                }>+ Añadir</button>
              </div>
            </div>
          </div>
        </CollapsiblePanel>

        <CollapsiblePanel title="Legados de Sangre" defaultOpen={false}>
          <div className="p-2 flex flex-col gap-1">
            {(char.legadosSangre || []).map((leg, i) => (
              <input key={i} value={leg} onChange={e => {
                const list = [...(char.legadosSangre || [])]
                list[i] = e.target.value
                set('legadosSangre', list)
              }} />
            ))}
          </div>
        </CollapsiblePanel>

        <CollapsiblePanel title="Notas Adicionales" defaultOpen={false}>
          <textarea className="w-full p-2 h-24 resize-none border-0 bg-[#231d17] text-[#e8d5b0]"
            value={char.notasAdicionales || ''} onChange={e => set('notasAdicionales', e.target.value)} />
        </CollapsiblePanel>
      </div>

      {/* ── Columna 3: Habilidades Secundarias ── */}
      <div className="flex flex-col gap-2">
        <div className="panel">
          <div className="panel-title">Habilidades Secundarias</div>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left">Habilidad</th>
                <th className="table-header w-10">PDs×5</th>
                <th className="table-header w-10">Esp.</th>
                <th className="table-header w-10">Cat.</th>
                <th className="table-header w-10">Raza</th>
                <th className="table-header w-12">Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(HABILIDADES_SECUNDARIAS).map(([cat, habs]) => (
                <React.Fragment key={cat}>
                  <tr>
                    <td colSpan={6} className="table-cell bg-[#1e180f] text-[#c9a84c] font-bold text-xs pl-2 py-1">{cat}</td>
                  </tr>
                  {Object.entries(habs).map(([hab, penBase]) => {
                    const h = habSec?.[cat]?.[hab] || {}
                    const fromPDs = sumSecPDs(hab) * 5
                    const esp = parseInt(h.esp) || 0
                    const plusKey = HAB_SEC_PLUS_KEYS[hab]
                    const bonoCat = plusKey ? (catData[plusKey] || 0) * nivel : 0
                    const bonoRaza = razaData.habSec?.[hab] || 0
                    const base = penBase !== null ? penBase : (fromPDs || esp || bonoCat || bonoRaza ? 0 : null)
                    const total = base !== null ? base + fromPDs + esp + bonoCat + bonoRaza : null
                    return (
                      <tr key={hab}>
                        <td className="table-cell pl-3">{hab}</td>
                        <td className="table-cell">
                          <span className={`calc-input block text-center rounded ${fromPDs > 0 ? 'text-[#c9a84c]' : ''}`}>{fromPDs || '—'}</span>
                        </td>
                        <td className="table-cell">
                          <input type="number" className="w-full text-center" value={h.esp ?? 0}
                            onChange={e => set(`habilidadesSecundarias.${cat}.${hab}.esp`, +e.target.value)} />
                        </td>
                        <td className="table-cell">
                          <span className={`block text-center ${bonoCat > 0 ? 'text-[#c9a84c] font-bold' : 'text-[#4a3520]'}`}>{bonoCat || '—'}</span>
                        </td>
                        <td className="table-cell">
                          <span className={`block text-center ${bonoRaza > 0 ? 'text-green-400 font-bold' : 'text-[#4a3520]'}`}>{bonoRaza || '—'}</span>
                        </td>
                        <td className="table-cell">
                          <span className={`calc-input block text-center rounded ${total === null ? 'opacity-40' : ''}`}>{total !== null ? total : '—'}</span>
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              ))}
              {/* Especiales */}
              <tr>
                <td colSpan={6} className="table-cell bg-[#1e180f] text-[#c9a84c] font-bold text-xs pl-2 py-1">Especiales</td>
              </tr>
              {(char.habSecEspeciales || []).map((h, i) => (
                <tr key={`esp-${i}`}>
                  <td className="table-cell pl-3">
                    <input value={h.nombre || ''} placeholder="Nombre..." onChange={e => {
                      const list = [...(char.habSecEspeciales || [])]
                      list[i] = { ...list[i], nombre: e.target.value }
                      set('habSecEspeciales', list)
                    }} />
                  </td>
                  <td className="table-cell">
                    <input type="number" className="w-full text-center" value={h.penNatural ?? 0}
                      onChange={e => {
                        const list = [...(char.habSecEspeciales || [])]
                        list[i] = { ...list[i], penNatural: +e.target.value }
                        set('habSecEspeciales', list)
                      }} />
                  </td>
                  <td className="table-cell">
                    <input type="number" className="w-full text-center" value={h.bono ?? 0}
                      onChange={e => {
                        const list = [...(char.habSecEspeciales || [])]
                        list[i] = { ...list[i], bono: +e.target.value }
                        set('habSecEspeciales', list)
                      }} />
                  </td>
                  <td className="table-cell text-center text-[#4a3520]">—</td>
                  <td className="table-cell text-center text-[#4a3520]">—</td>
                  <td className="table-cell">
                    <span className="calc-input block text-center rounded">{(h.penNatural || 0) + (h.bono || 0)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
