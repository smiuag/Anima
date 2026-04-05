import React from 'react'
import useCharacterStore from '../../store/useCharacterStore'
import { getBonoCaracteristica, MOVIMIENTO_AGI, REGENERACION_CON, HABILIDADES_SECUNDARIAS } from '../../data/tables'

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
  const calcBono = (stat) => getBonoCaracteristica(calcTotal(stat))

  const handleCaractChange = (stat, field, val) => {
    set(`caracteristicas.${stat}.${field}`, val === '' ? '' : +val)
  }

  // Regeneración por CON
  const conTotal = calcTotal('CON')
  const regenIdx = REGENERACION_CON[Math.min(Math.max(conTotal, 1), 20)] ?? 0

  // Movimiento por AGI
  const agiTotal = calcTotal('AGI')
  const movTexto = MOVIMIENTO_AGI[Math.min(Math.max(agiTotal, 1), 20)] || '35 m/asalto'

  // Turno
  const turno = char.turno || {}
  const turnoTotal = 40 +
    calcBono('AGI') +
    calcBono('DES') +
    (parseInt(turno.boniCat) || 0) +
    (parseInt(turno.penArmad) || 0) +
    (parseInt(turno.boniArma) || 20) +
    (parseInt(turno.esp) || 0)

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
                <th className="table-header w-6"></th>
                <th className="table-header">Stat</th>
                <th className="table-header">Base</th>
                <th className="table-header">Temp</th>
                <th className="table-header">Total</th>
                <th className="table-header">Bono</th>
              </tr>
            </thead>
            <tbody>
              {stats.map(s => {
                const c = caract[s] || {}
                const total = calcTotal(s)
                const bono = calcBono(s)
                return (
                  <tr key={s}>
                    <td className="table-cell text-center text-[#4a3520] text-xs">{c.base || 10}</td>
                    <td className="table-cell text-[#c9a84c] font-bold text-center">{s}</td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={c.base ?? 10}
                        onChange={e => handleCaractChange(s, 'base', e.target.value)} />
                    </td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={c.temp ?? 0}
                        onChange={e => handleCaractChange(s, 'temp', e.target.value)} />
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
        <div className="panel">
          <div className="panel-title">Regeneración y Movimiento</div>
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
        </div>

        {/* Puntos de Vida */}
        <div className="panel">
          <div className="panel-title">Puntos de Vida</div>
          <div className="p-2 flex flex-col gap-1">
            <div className="flex gap-2">
              <F label="Base"><input type="number" value={char.puntosVida?.base ?? 20} onChange={e => set('puntosVida.base', +e.target.value)} /></F>
              <F label="Total"><input type="number" value={char.puntosVida?.total ?? 20} onChange={e => set('puntosVida.total', +e.target.value)} /></F>
              <F label="Actual"><input type="number" value={char.puntosVida?.actual ?? 20} onChange={e => set('puntosVida.actual', +e.target.value)} /></F>
            </div>
            <F label="Esp."><input value={char.puntosVida?.esp || ''} onChange={e => set('puntosVida.esp', e.target.value)} /></F>
          </div>
        </div>

        {/* Cansancio */}
        <div className="panel">
          <div className="panel-title">Cansancio</div>
          <div className="p-2 flex gap-2">
            <F label="Máximo"><input type="number" value={char.cansancio?.total ?? 0} onChange={e => set('cansancio.total', +e.target.value)} /></F>
            <F label="Actual"><input type="number" value={char.cansancio?.actual ?? 0} onChange={e => set('cansancio.actual', +e.target.value)} /></F>
          </div>
        </div>

        {/* Resistencias */}
        <div className="panel">
          <div className="panel-title">Resistencias</div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Res.</th>
                <th className="table-header">Base</th>
                <th className="table-header">Bono</th>
                <th className="table-header">Raza</th>
                <th className="table-header">Esp.</th>
                <th className="table-header">Total</th>
              </tr>
            </thead>
            <tbody>
              {['presBase', 'RF', 'RE', 'RV', 'RM', 'RP'].map(r => {
                const res = char.resistencias?.[r] || {}
                const label = r === 'presBase' ? 'Pres.' : r
                const total = (parseInt(res.base) || 20) + (parseInt(res.bono) || 0) + (parseInt(res.raza) || 0) + (parseInt(res.esp) || 0)
                return (
                  <tr key={r}>
                    <td className="table-cell text-[#c9a84c] font-bold text-center text-xs">{label}</td>
                    <td className="table-cell"><input type="number" className="w-full text-center" value={res.base ?? 20} onChange={e => set(`resistencias.${r}.base`, +e.target.value)} /></td>
                    <td className="table-cell"><input type="number" className="w-full text-center" value={res.bono ?? 0} onChange={e => set(`resistencias.${r}.bono`, +e.target.value)} /></td>
                    <td className="table-cell"><input type="number" className="w-full text-center" value={res.raza ?? 0} onChange={e => set(`resistencias.${r}.raza`, +e.target.value)} /></td>
                    <td className="table-cell"><input type="number" className="w-full text-center" value={res.esp ?? 0} onChange={e => set(`resistencias.${r}.esp`, +e.target.value)} /></td>
                    <td className="table-cell"><span className="calc-input block text-center px-1 rounded font-bold">{total}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="p-2">
            <F label="Esp."><input value={char.resistencias?.esp || ''} onChange={e => set('resistencias.esp', e.target.value)} /></F>
          </div>
        </div>

        {/* Idiomas */}
        <div className="panel">
          <div className="panel-title">Idiomas</div>
          <div className="p-2 flex flex-col gap-1">
            {['base', 'primero', 'segundo', 'tercero', 'cuarto', 'quinto', 'sexto'].map(k => (
              <F key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
                <input value={char.idiomas?.[k] || ''} onChange={e => set(`idiomas.${k}`, e.target.value)} />
              </F>
            ))}
          </div>
        </div>

        {/* Puntos */}
        <div className="panel">
          <div className="panel-title">Puntos</div>
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
        </div>
      </div>

      {/* ── Columna 2: Turno + Combate + Secundarias (Atl, Soc, Per, Vig) ── */}
      <div className="flex flex-col gap-3">
        {/* Turno */}
        <div className="panel">
          <div className="panel-title">Turno</div>
          <table className="w-full text-xs">
            <tbody>
              <tr><td className="table-cell field-label pl-2">Base</td><td className="table-cell text-center text-[#c9a84c] font-bold">40</td></tr>
              <tr><td className="table-cell field-label pl-2">AGI (Bono)</td><td className="table-cell"><span className="calc-input block text-center">{calcBono('AGI')}</span></td></tr>
              <tr><td className="table-cell field-label pl-2">DES (Bono)</td><td className="table-cell"><span className="calc-input block text-center">{calcBono('DES')}</span></td></tr>
              <tr><td className="table-cell field-label pl-2">Bono Categoría</td><td className="table-cell"><input type="number" className="w-full text-center" value={turno.boniCat ?? 0} onChange={e => set('turno.boniCat', +e.target.value)} /></td></tr>
              <tr><td className="table-cell field-label pl-2">Pen. Armadura</td><td className="table-cell"><input type="number" className="w-full text-center" value={turno.penArmad ?? 0} onChange={e => set('turno.penArmad', +e.target.value)} /></td></tr>
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
            {['ataque', 'esquiva', 'parada', 'armadura'].map(h => {
              const hc = char.habilidadesCombate?.[h] || {}
              const total = (parseInt(hc.base) || 0) + (parseInt(hc.bono) || 0)
              const labels = { ataque: 'H. Ataque', esquiva: 'H. Esquiva', parada: 'H. Parada', armadura: 'Ll. Armadura' }
              return (
                <div key={h} className="flex items-center gap-1">
                  <span className="field-label w-24">{labels[h]}</span>
                  <input type="number" className="w-16 text-center" placeholder="Base" value={hc.base ?? 0} onChange={e => set(`habilidadesCombate.${h}.base`, +e.target.value)} />
                  <input type="number" className="w-16 text-center" placeholder="Bono" value={hc.bono ?? 0} onChange={e => set(`habilidadesCombate.${h}.bono`, +e.target.value)} />
                  <span className="calc-input w-12 text-center rounded">{total}</span>
                </div>
              )
            })}
            <div className="flex gap-2 mt-1">
              <F label="Arma Desarrollada">
                <input value={char.habilidadesCombate?.armaDesarrollada || ''} onChange={e => set('habilidadesCombate.armaDesarrollada', e.target.value)} />
              </F>
              <F label="Acc/Turno" w="w-20">
                <input type="number" value={char.habilidadesCombate?.accionesPorTurno ?? 1} onChange={e => set('habilidadesCombate.accionesPorTurno', +e.target.value)} />
              </F>
            </div>
          </div>
        </div>

        {/* Ajustes de Nivel */}
        <div className="panel">
          <div className="panel-title">Ajustes de Nivel</div>
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
        </div>

        {/* Capacidades Raciales */}
        <div className="panel">
          <div className="panel-title">Capacidades Raciales</div>
          <div className="p-2 flex flex-col gap-1">
            {(char.capacidadesRaciales || []).map((cap, i) => (
              <input key={i} value={cap} onChange={e => {
                const list = [...(char.capacidadesRaciales || [])]
                list[i] = e.target.value
                set('capacidadesRaciales', list)
              }} />
            ))}
          </div>
        </div>

        {/* Legados de Sangre */}
        <div className="panel">
          <div className="panel-title">Legados de Sangre</div>
          <div className="p-2 flex flex-col gap-1">
            {(char.legadosSangre || []).map((leg, i) => (
              <input key={i} value={leg} onChange={e => {
                const list = [...(char.legadosSangre || [])]
                list[i] = e.target.value
                set('legadosSangre', list)
              }} />
            ))}
          </div>
        </div>

        {/* Notas Adicionales */}
        <div className="panel">
          <div className="panel-title">Notas Adicionales</div>
          <textarea className="w-full p-2 h-24 resize-none border-0 bg-[#231d17] text-[#e8d5b0]"
            value={char.notasAdicionales || ''} onChange={e => set('notasAdicionales', e.target.value)} />
        </div>
      </div>

      {/* ── Columna 3: Habilidades Secundarias ── */}
      <div className="flex flex-col gap-2">
        <div className="panel">
          <div className="panel-title">Habilidades Secundarias</div>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left">Habilidad</th>
                <th className="table-header w-10">P.Nat.</th>
                <th className="table-header w-10">Bono</th>
                <th className="table-header w-12">Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(HABILIDADES_SECUNDARIAS).map(([cat, habs]) => (
                <React.Fragment key={cat}>
                  <tr>
                    <td colSpan={4} className="table-cell bg-[#1e180f] text-[#c9a84c] font-bold text-xs pl-2 py-1">{cat}</td>
                  </tr>
                  {Object.entries(habs).map(([hab, penBase]) => {
                    const h = habSec?.[cat]?.[hab] || {}
                    const penNat = parseInt(h.penNatural) || 0
                    const bono = parseInt(h.bono) || 0
                    const base = penBase !== null ? penBase : 0
                    const total = base + penNat + bono
                    return (
                      <tr key={hab}>
                        <td className="table-cell pl-3">{hab}</td>
                        <td className="table-cell">
                          <input type="number" className="w-full text-center" value={h.penNatural ?? 0}
                            onChange={e => set(`habilidadesSecundarias.${cat}.${hab}.penNatural`, +e.target.value)} />
                        </td>
                        <td className="table-cell">
                          <input type="number" className="w-full text-center" value={h.bono ?? 0}
                            onChange={e => set(`habilidadesSecundarias.${cat}.${hab}.bono`, +e.target.value)} />
                        </td>
                        <td className="table-cell">
                          <span className={`calc-input block text-center rounded ${penBase === null ? 'opacity-50' : ''}`}>{penBase === null ? '-' : total}</span>
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              ))}
              {/* Especiales */}
              <tr>
                <td colSpan={4} className="table-cell bg-[#1e180f] text-[#c9a84c] font-bold text-xs pl-2 py-1">Especiales</td>
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
