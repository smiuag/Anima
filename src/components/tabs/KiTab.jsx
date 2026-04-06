import React from 'react'
import useCharacterStore from '../../store/useCharacterStore'
import { HABILIDADES_KI, getBonoCaracteristica, getCatData, getAcuKi, getRazaData } from '../../data/tables'
import CollapsiblePanel from '../CollapsiblePanel'

const F = ({ label, children, w = 'flex-1' }) => (
  <div className={`${w} flex flex-col gap-0.5`}>
    {label && <span className="field-label">{label}</span>}
    {children}
  </div>
)

export default function KiTab({ char }) {
  const updateField = useCharacterStore(s => s.updateField)
  const set = (path, val) => updateField(char.id, path, val)

  const ki = char.ki || {}
  const puntos = ki.puntos || {}
  const stats = ['AGI', 'CON', 'DES', 'FUE', 'POD', 'VOL']
  const catData = getCatData(char.categoria)
  const razaData = getRazaData(char.raza)
  const nivel = parseInt(char.nivel) || 0

  const pdNiveles = char.pds?.niveles || []

  // CM auto-calc: PlusCM × nivel + Σ(pts en 'CM' de todos los niveles de PDsTab)
  const pdsCmTotal = pdNiveles.reduce((sum, n) => sum + (parseInt(n?.ki?.['CM']) || 0), 0)
  const cmCalculado = (catData.PlusCM || 0) * nivel + pdsCmTotal

  // Pool de Ki desde PDsTab: total disponible para distribuir entre stats
  // Factor pendiente de verificar (DUDAS.md) — asumido 1:1 por ahora
  const kiPoolTotal  = pdNiveles.reduce((sum, n) => sum + (parseInt(n?.ki?.['Puntos de KI'])     || 0), 0)
  const acuPoolTotal = pdNiveles.reduce((sum, n) => sum + (parseInt(n?.ki?.['Acumulación de KI']) || 0), 0)

  const getStatTotal = (s) => {
    const c = char.caracteristicas?.[s] || {}
    return (parseInt(c.base) || 0) + (parseInt(c.temp) || 0) + (razaData[s] || 0)
  }
  // Ki base por stat = floor(stat_total / 2)
  const getKiBase = (s) => Math.floor(getStatTotal(s) / 2)
  // Acumulación base por stat = tabla oficial (extraída del Excel)
  const getAcuBase = (s) => getAcuKi(getStatTotal(s))

  const totalKiBase    = stats.reduce((sum, s) => sum + getKiBase(s), 0)
  const totalKiPDs     = stats.reduce((sum, s) => sum + (parseInt(puntos[s]?.pds) || 0), 0)
  const totalKi        = totalKiBase + totalKiPDs
  const totalAcuPDs    = stats.reduce((sum, s) => sum + (parseInt(puntos[s]?.acuPds) || 0), 0)
  const kiPoolLibre    = kiPoolTotal  - totalKiPDs
  const acuPoolLibre   = acuPoolTotal - totalAcuPDs

  const updPuntos = (stat, field, val) => set(`ki.puntos.${stat}.${field}`, +val)

  const updHab = (nombre, field, val) => {
    set(`ki.habilidades.${nombre}.${field}`, val)
  }

  const addTecnica = () => {
    const list = [...(ki.tecnicasDominio || [])]
    list.push({ nombre: '', nivel: 0, notas: '' })
    set('ki.tecnicasDominio', list)
  }
  const removeTecnica = (i) => set('ki.tecnicasDominio', (ki.tecnicasDominio || []).filter((_, idx) => idx !== i))

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {/* ── Columna izquierda ── */}
      <div className="flex flex-col gap-3">
        {/* Puntos de Ki */}
        <div className="panel">
          <div className="panel-title">Puntos de Ki</div>
          {kiPoolTotal > 0 && (
            <div className={`mx-2 mb-1 px-2 py-0.5 rounded text-xs flex gap-3 ${kiPoolLibre < 0 ? 'bg-red-900/40 text-red-400' : kiPoolLibre === 0 ? 'bg-green-900/30 text-green-400' : 'bg-[#2a1f10] text-[#8a7560]'}`}>
              <span>Pool Ki PDs: <b>{kiPoolTotal}</b></span>
              <span>Distribuido: <b>{totalKiPDs}</b></span>
              <span>Libre: <b className={kiPoolLibre < 0 ? 'text-red-400' : ''}>{kiPoolLibre}</b></span>
            </div>
          )}
          {acuPoolTotal > 0 && (
            <div className={`mx-2 mb-1 px-2 py-0.5 rounded text-xs flex gap-3 ${acuPoolLibre < 0 ? 'bg-red-900/40 text-red-400' : acuPoolLibre === 0 ? 'bg-green-900/30 text-green-400' : 'bg-[#2a1f10] text-[#8a7560]'}`}>
              <span>Pool Acu PDs: <b>{acuPoolTotal}</b></span>
              <span>Distribuido: <b>{totalAcuPDs}</b></span>
              <span>Libre: <b className={acuPoolLibre < 0 ? 'text-red-400' : ''}>{acuPoolLibre}</b></span>
            </div>
          )}
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header">Stat</th>
                <th className="table-header w-12">Base</th>
                <th className="table-header w-12">+PDs</th>
                <th className="table-header w-12">Ki</th>
                <th className="table-header w-12">Acu.</th>
                <th className="table-header w-12">+PDs</th>
                <th className="table-header w-12">Actual</th>
              </tr>
            </thead>
            <tbody>
              {stats.map(s => {
                const p = puntos[s] || {}
                const kiBase = getKiBase(s)
                const kiPds  = parseInt(p.pds) || 0
                const kiTotal = kiBase + kiPds
                const acuBase = getAcuBase(s)
                const acuPds  = parseInt(p.acuPds) || 0
                const acuTotal = acuBase + acuPds
                return (
                  <tr key={s}>
                    <td className="table-cell text-[#c9a84c] font-bold text-center">{s}</td>
                    <td className="table-cell">
                      <span className="calc-input block text-center rounded">{kiBase}</span>
                    </td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={p.pds ?? 0}
                        onChange={e => updPuntos(s, 'pds', e.target.value)} />
                    </td>
                    <td className="table-cell">
                      <span className="calc-input block text-center rounded font-bold">{kiTotal}</span>
                    </td>
                    <td className="table-cell">
                      <span className="calc-input block text-center rounded">{acuBase}</span>
                    </td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={p.acuPds ?? 0}
                        onChange={e => updPuntos(s, 'acuPds', e.target.value)} />
                    </td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={p.actual ?? 0}
                        onChange={e => updPuntos(s, 'actual', e.target.value)} />
                    </td>
                  </tr>
                )
              })}
              <tr className="border-t border-[#4a3520]">
                <td className="table-cell text-[#c9a84c] font-bold text-center text-xs">Total</td>
                <td className="table-cell text-center text-[#8a7560]">{totalKiBase}</td>
                <td className="table-cell text-center text-[#8a7560]">{totalKiPDs}</td>
                <td className="table-cell text-center font-bold text-[#c9a84c]">{totalKi}</td>
                <td className="table-cell text-center text-[#8a7560]">{stats.reduce((s2,s) => s2 + getAcuBase(s), 0)}</td>
                <td className="table-cell text-center text-[#8a7560]">{totalAcuPDs}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CM y Uso del Ki */}
        <div className="panel">
          <div className="panel-title">Concentración Marcial y Uso del Ki</div>
          <div className="p-2 flex flex-col gap-2">
            <div className="flex gap-2 items-end">
              <F label="CM Total (calc.)">
                <div className="calc-value text-center">{cmCalculado}</div>
              </F>
              <F label="CM Usado"><input type="number" value={ki.cmUsado ?? 0} onChange={e => set('ki.cmUsado', +e.target.value)} /></F>
              <F label="Límites libres"><input type="number" value={ki.limites ?? 0} onChange={e => set('ki.limites', +e.target.value)} /></F>
            </div>
            {char.categoria && (
              <div className="text-xs text-[#8a7560]">
                {catData.PlusCM || 0}×Nv{nivel}={((catData.PlusCM||0)*nivel)} + PDs:{pdsCmTotal} = {cmCalculado}
              </div>
            )}
            <div className="flex gap-2">
              <F label="Uso del Ki (base 40)">
                <input type="number" value={ki.usoKi ?? 40} onChange={e => set('ki.usoKi', +e.target.value)} />
              </F>
              <F label="Control del Ki (base 30)">
                <input type="number" value={ki.controlKi ?? 30} onChange={e => set('ki.controlKi', +e.target.value)} />
              </F>
            </div>
          </div>
        </div>

        {/* Sellos de Invocación */}
        <CollapsiblePanel title="Sellos de Invocación" defaultOpen={false}>
          <div className="p-2 grid grid-cols-3 gap-2">
            {['madera', 'agua', 'fuego', 'tierra', 'metal', 'aire'].map(s => (
              <F key={s} label={s.charAt(0).toUpperCase() + s.slice(1)}>
                <input type="number" value={ki.sellos?.[s] ?? 0}
                  onChange={e => set(`ki.sellos.${s}`, +e.target.value)} />
              </F>
            ))}
          </div>
        </CollapsiblePanel>

        {/* Pactos de Sangre */}
        <CollapsiblePanel title="Pactos de Sangre" defaultOpen={false} actions={<button className="add-row-btn" onClick={() => { const list=[...(ki.pacteosSangre||[])]; list.push({criatura:'',sellos:''}); set('ki.pacteosSangre',list) }}>+ Añadir</button>}>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left">Criatura</th>
                <th className="table-header">Sellos Nec.</th>
                <th className="table-header w-6"></th>
              </tr>
            </thead>
            <tbody>
              {(ki.pacteosSangre || []).map((p, i) => (
                <tr key={i}>
                  <td className="table-cell">
                    <input value={p.criatura || ''} onChange={e => {
                      const list = [...(ki.pacteosSangre || [])]
                      list[i] = { ...list[i], criatura: e.target.value }
                      set('ki.pacteosSangre', list)
                    }} />
                  </td>
                  <td className="table-cell">
                    <input value={p.sellos || ''} onChange={e => {
                      const list = [...(ki.pacteosSangre || [])]
                      list[i] = { ...list[i], sellos: e.target.value }
                      set('ki.pacteosSangre', list)
                    }} />
                  </td>
                  <td className="table-cell text-center">
                    <button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() =>
                      set('ki.pacteosSangre', (ki.pacteosSangre || []).filter((_, idx) => idx !== i))
                    }>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsiblePanel>

        {/* Técnicas de Dominio */}
        <CollapsiblePanel title="Técnicas de Dominio" defaultOpen={false} actions={<button className="add-row-btn" onClick={addTecnica}>+ Añadir</button>}>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left">Nombre</th>
                <th className="table-header w-12">Nivel</th>
                <th className="table-header">Notas</th>
                <th className="table-header w-6"></th>
              </tr>
            </thead>
            <tbody>
              {(ki.tecnicasDominio || []).map((t, i) => (
                <tr key={i}>
                  <td className="table-cell">
                    <input value={t.nombre || ''} onChange={e => {
                      const list = [...(ki.tecnicasDominio || [])]
                      list[i] = { ...list[i], nombre: e.target.value }
                      set('ki.tecnicasDominio', list)
                    }} />
                  </td>
                  <td className="table-cell">
                    <input type="number" className="w-full text-center" value={t.nivel ?? 0} onChange={e => {
                      const list = [...(ki.tecnicasDominio || [])]
                      list[i] = { ...list[i], nivel: +e.target.value }
                      set('ki.tecnicasDominio', list)
                    }} />
                  </td>
                  <td className="table-cell">
                    <input value={t.notas || ''} onChange={e => {
                      const list = [...(ki.tecnicasDominio || [])]
                      list[i] = { ...list[i], notas: e.target.value }
                      set('ki.tecnicasDominio', list)
                    }} />
                  </td>
                  <td className="table-cell text-center">
                    <button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() => removeTecnica(i)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsiblePanel>
      </div>

      {/* ── Columna derecha: Habilidades del Ki ── */}
      <div className="panel">
        <div className="panel-title">Habilidades del Ki</div>
        <div className="overflow-y-auto max-h-[800px]">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left">Habilidad</th>
                <th className="table-header w-12">Nivel</th>
                <th className="table-header w-16">Usado</th>
                <th className="table-header">Notas</th>
              </tr>
            </thead>
            <tbody>
              {HABILIDADES_KI.map(hab => {
                const h = ki.habilidades?.[hab] || {}
                return (
                  <tr key={hab}>
                    <td className="table-cell pl-2">{hab}</td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={h.nivel ?? 0}
                        onChange={e => updHab(hab, 'nivel', +e.target.value)} />
                    </td>
                    <td className="table-cell text-center">
                      <input type="checkbox" checked={!!h.usado}
                        onChange={e => updHab(hab, 'usado', e.target.checked)}
                        style={{ width: '14px', height: '14px' }} />
                    </td>
                    <td className="table-cell">
                      <input value={h.notas || ''}
                        onChange={e => updHab(hab, 'notas', e.target.value)} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
