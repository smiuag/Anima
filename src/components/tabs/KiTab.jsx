import React from 'react'
import useCharacterStore from '../../store/useCharacterStore'
import { HABILIDADES_KI } from '../../data/tables'

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

  const totalKi = stats.reduce((sum, s) => sum + (parseInt(puntos[s]?.ki) || 0), 0)
  const totalAcu = stats.reduce((sum, s) => sum + (parseInt(puntos[s]?.acu) || 0), 0)

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
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header">Stat</th>
                <th className="table-header">Acum.</th>
                <th className="table-header">Ki</th>
                <th className="table-header">Actual</th>
              </tr>
            </thead>
            <tbody>
              {stats.map(s => {
                const p = puntos[s] || {}
                return (
                  <tr key={s}>
                    <td className="table-cell text-[#c9a84c] font-bold text-center">{s}</td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={p.acu ?? 0}
                        onChange={e => updPuntos(s, 'acu', e.target.value)} />
                    </td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={p.ki ?? 0}
                        onChange={e => updPuntos(s, 'ki', e.target.value)} />
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
                <td className="table-cell text-center font-bold text-[#c9a84c]">{totalAcu}</td>
                <td className="table-cell text-center font-bold text-[#c9a84c]">{totalKi}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CM y Uso del Ki */}
        <div className="panel">
          <div className="panel-title">Concentración Marcial y Uso del Ki</div>
          <div className="p-2 flex flex-col gap-2">
            <div className="flex gap-2">
              <F label="CM Total"><input type="number" value={ki.cmTotal ?? 0} onChange={e => set('ki.cmTotal', +e.target.value)} /></F>
              <F label="CM Usado"><input type="number" value={ki.cmUsado ?? 0} onChange={e => set('ki.cmUsado', +e.target.value)} /></F>
              <F label="Límites libres"><input type="number" value={ki.limites ?? 0} onChange={e => set('ki.limites', +e.target.value)} /></F>
            </div>
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
        <div className="panel">
          <div className="panel-title">Sellos de Invocación</div>
          <div className="p-2 grid grid-cols-3 gap-2">
            {['madera', 'agua', 'fuego', 'tierra', 'metal', 'aire'].map(s => (
              <F key={s} label={s.charAt(0).toUpperCase() + s.slice(1)}>
                <input type="number" value={ki.sellos?.[s] ?? 0}
                  onChange={e => set(`ki.sellos.${s}`, +e.target.value)} />
              </F>
            ))}
          </div>
        </div>

        {/* Pactos de Sangre */}
        <div className="panel">
          <div className="panel-title flex items-center justify-between">
            <span>Pactos de Sangre</span>
            <button className="add-row-btn" onClick={() => {
              const list = [...(ki.pacteosSangre || [])]
              list.push({ criatura: '', sellos: '' })
              set('ki.pacteosSangre', list)
            }}>+ Añadir</button>
          </div>
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
        </div>

        {/* Técnicas de Dominio */}
        <div className="panel">
          <div className="panel-title flex items-center justify-between">
            <span>Técnicas de Dominio</span>
            <button className="add-row-btn" onClick={addTecnica}>+ Añadir</button>
          </div>
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
        </div>
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
