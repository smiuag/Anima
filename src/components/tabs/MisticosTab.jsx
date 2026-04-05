import React from 'react'
import useCharacterStore from '../../store/useCharacterStore'
import { VIAS_MISTICAS } from '../../data/tables'

const F = ({ label, children, w = 'flex-1' }) => (
  <div className={`${w} flex flex-col gap-0.5`}>
    {label && <span className="field-label">{label}</span>}
    {children}
  </div>
)

const DIFICULTADES = ['Rutinario', 'Fácil', 'Medio', 'Difícil', 'Muy difícil', 'Casi imposible', 'Absurdo', 'Imposible', 'Inhumano', 'Zen']
const DURACIONES = ['Inmediato', '1 asalto', '3 asaltos', '5 asaltos', '1 minuto', '1 hora', '6 horas', '1 día', '1 semana', '1 mes', '6 meses']
const ALCANCES = ['Sobre sí mismo o en contacto', 'Blancos hasta 5m', 'Blancos hasta 20m', 'Blancos hasta 100m', 'Blancos hasta 250m', 'Blancos hasta 500m', 'Hasta 1 km. Blanco localizado', 'Hasta 10 km. Blanco aproximado']

export default function MisticosTab({ char }) {
  const updateField = useCharacterStore(s => s.updateField)
  const set = (path, val) => updateField(char.id, path, val)

  const mis = char.misticos || {}

  const addConjuro = () => {
    const list = [...(mis.conjuros || [])]
    list.push({ nombre: '', via: '', nivel: 0, descripcion: '' })
    set('misticos.conjuros', list)
  }
  const removeConjuro = (i) => set('misticos.conjuros', (mis.conjuros || []).filter((_, idx) => idx !== i))

  const addMetamagia = () => {
    const list = [...(mis.metamagia || [])]
    list.push({ nombre: '', nivel: 0 })
    set('misticos.metamagia', list)
  }

  const addInvocacion = () => {
    const list = [...(mis.invocaciones || [])]
    list.push({ nombre: '', convocatoria: 0, dominacion: 0, atadura: 0, desconvocacion: 0, criaturas: 0 })
    set('misticos.invocaciones', list)
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* ── Zeón y Proyección ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="panel">
          <div className="panel-title">Zeón</div>
          <div className="p-2 flex flex-col gap-2">
            <div className="flex gap-2">
              <F label="Total"><input type="number" value={mis.zeon?.total ?? 0} onChange={e => set('misticos.zeon.total', +e.target.value)} /></F>
              <F label="Usado"><input type="number" value={mis.zeon?.usado ?? 0} onChange={e => set('misticos.zeon.usado', +e.target.value)} /></F>
              <F label="Diario"><input type="number" value={mis.zeon?.diario ?? 0} onChange={e => set('misticos.zeon.diario', +e.target.value)} /></F>
            </div>
            <F label="Acumulación (por turno)">
              <input type="number" value={mis.acumulacion ?? 0} onChange={e => set('misticos.acumulacion', +e.target.value)} />
            </F>
            <F label="Coste Zeónico diario total">
              <input type="number" value={mis.costeDiario ?? 0} onChange={e => set('misticos.costeDiario', +e.target.value)} />
            </F>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Proyección y Nivel</div>
          <div className="p-2 flex flex-col gap-2">
            <F label="Proyección Mágica">
              <input type="number" value={mis.proyeccionMagica ?? 0} onChange={e => set('misticos.proyeccionMagica', +e.target.value)} />
            </F>
            <div className="flex gap-2">
              <F label="Nv. Magia"><input type="number" value={mis.nivelMagia ?? 0} onChange={e => set('misticos.nivelMagia', +e.target.value)} /></F>
              <F label="Nv. Máx"><input type="number" value={mis.nivelMaximo ?? 0} onChange={e => set('misticos.nivelMaximo', +e.target.value)} /></F>
              <F label="Nv. Usado"><input type="number" value={mis.nivelUsado ?? 0} onChange={e => set('misticos.nivelUsado', +e.target.value)} /></F>
            </div>
            <F label="Nombre Verdadero">
              <input value={mis.nombreVerdadero || ''} onChange={e => set('misticos.nombreVerdadero', e.target.value)} />
            </F>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Configuración</div>
          <div className="p-2 flex flex-col gap-2">
            <F label="Amplificador">
              <input value={mis.amplificador || ''} onChange={e => set('misticos.amplificador', e.target.value)} />
            </F>
            <F label="Contenedor">
              <input value={mis.contenedor || ''} onChange={e => set('misticos.contenedor', e.target.value)} />
            </F>
            <F label="Especialidad">
              <input value={mis.especialidad || ''} onChange={e => set('misticos.especialidad', e.target.value)} />
            </F>
            <F label="Potencial Innato">
              <input type="number" value={mis.potencialInnato ?? 0} onChange={e => set('misticos.potencialInnato', +e.target.value)} />
            </F>
            <div className="flex gap-2">
              <F label="Conj. Activos">
                <input type="number" value={mis.conjurosActivos ?? 0} onChange={e => set('misticos.conjurosActivos', +e.target.value)} />
              </F>
              <F label="Libre Acc. Rest.">
                <input type="number" value={mis.conjurosLibreRestantes ?? 0} onChange={e => set('misticos.conjurosLibreRestantes', +e.target.value)} />
              </F>
            </div>
          </div>
        </div>
      </div>

      {/* ── Vías ── */}
      <div className="panel">
        <div className="panel-title flex items-center justify-between">
          <span>Vías de Magia</span>
          <button className="add-row-btn" onClick={() => {
            const list = [...(mis.vias || [])]
            list.push({ via: '', subVia: '', nivel: 0, nivelMax: 0, nivelUsado: 0 })
            set('misticos.vias', list)
          }}>+ Añadir vía</button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="table-header text-left">Vía</th>
              <th className="table-header text-left">Sub-Vía</th>
              <th className="table-header w-14">Nivel</th>
              <th className="table-header w-14">Nv. Máx</th>
              <th className="table-header w-14">Nv. Usado</th>
              <th className="table-header w-6"></th>
            </tr>
          </thead>
          <tbody>
            {(mis.vias || []).map((v, i) => (
              <tr key={i}>
                <td className="table-cell">
                  <select value={v.via || ''} onChange={e => {
                    const list = [...(mis.vias || [])]
                    list[i] = { ...list[i], via: e.target.value }
                    set('misticos.vias', list)
                  }}>
                    <option value="">—</option>
                    {VIAS_MISTICAS.map(vv => <option key={vv}>{vv}</option>)}
                  </select>
                </td>
                <td className="table-cell">
                  <input value={v.subVia || ''} onChange={e => {
                    const list = [...(mis.vias || [])]
                    list[i] = { ...list[i], subVia: e.target.value }
                    set('misticos.vias', list)
                  }} />
                </td>
                {['nivel', 'nivelMax', 'nivelUsado'].map(f => (
                  <td key={f} className="table-cell">
                    <input type="number" className="w-full text-center" value={v[f] ?? 0} onChange={e => {
                      const list = [...(mis.vias || [])]
                      list[i] = { ...list[i], [f]: +e.target.value }
                      set('misticos.vias', list)
                    }} />
                  </td>
                ))}
                <td className="table-cell text-center">
                  <button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() =>
                    set('misticos.vias', (mis.vias || []).filter((_, idx) => idx !== i))
                  }>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Conjuros ── */}
      <div className="panel">
        <div className="panel-title flex items-center justify-between">
          <span>Conjuros Seleccionados</span>
          <button className="add-row-btn" onClick={addConjuro}>+ Añadir conjuro</button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="table-header text-left w-48">Nombre</th>
              <th className="table-header w-24">Vía</th>
              <th className="table-header w-12">Nivel</th>
              <th className="table-header">Descripción / Notas</th>
              <th className="table-header w-6"></th>
            </tr>
          </thead>
          <tbody>
            {(mis.conjuros || []).map((c, i) => (
              <tr key={i}>
                <td className="table-cell">
                  <input value={c.nombre || ''} onChange={e => {
                    const list = [...(mis.conjuros || [])]
                    list[i] = { ...list[i], nombre: e.target.value }
                    set('misticos.conjuros', list)
                  }} />
                </td>
                <td className="table-cell">
                  <select value={c.via || ''} onChange={e => {
                    const list = [...(mis.conjuros || [])]
                    list[i] = { ...list[i], via: e.target.value }
                    set('misticos.conjuros', list)
                  }}>
                    <option value="">—</option>
                    {VIAS_MISTICAS.map(vv => <option key={vv}>{vv}</option>)}
                  </select>
                </td>
                <td className="table-cell">
                  <input type="number" className="w-full text-center" value={c.nivel ?? 0} onChange={e => {
                    const list = [...(mis.conjuros || [])]
                    list[i] = { ...list[i], nivel: +e.target.value }
                    set('misticos.conjuros', list)
                  }} />
                </td>
                <td className="table-cell">
                  <input value={c.descripcion || ''} onChange={e => {
                    const list = [...(mis.conjuros || [])]
                    list[i] = { ...list[i], descripcion: e.target.value }
                    set('misticos.conjuros', list)
                  }} />
                </td>
                <td className="table-cell text-center">
                  <button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() => removeConjuro(i)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Metamagia + Poderes Místicos ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="panel">
          <div className="panel-title flex items-center justify-between">
            <span>Metamagia</span>
            <button className="add-row-btn" onClick={addMetamagia}>+ Añadir</button>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left">Nombre</th>
                <th className="table-header w-14">Nivel</th>
                <th className="table-header w-6"></th>
              </tr>
            </thead>
            <tbody>
              {(mis.metamagia || []).map((m, i) => (
                <tr key={i}>
                  <td className="table-cell">
                    <input value={m.nombre || ''} onChange={e => {
                      const list = [...(mis.metamagia || [])]
                      list[i] = { ...list[i], nombre: e.target.value }
                      set('misticos.metamagia', list)
                    }} />
                  </td>
                  <td className="table-cell">
                    <input type="number" className="w-full text-center" value={m.nivel ?? 0} onChange={e => {
                      const list = [...(mis.metamagia || [])]
                      list[i] = { ...list[i], nivel: +e.target.value }
                      set('misticos.metamagia', list)
                    }} />
                  </td>
                  <td className="table-cell text-center">
                    <button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() =>
                      set('misticos.metamagia', (mis.metamagia || []).filter((_, idx) => idx !== i))
                    }>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-title flex items-center justify-between">
            <span>Poderes Místicos</span>
            <button className="add-row-btn" onClick={() => {
              const list = [...(mis.poderesMisticos || [])]
              list.push({ nombre: '', descripcion: '' })
              set('misticos.poderesMisticos', list)
            }}>+ Añadir</button>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left">Nombre</th>
                <th className="table-header">Descripción</th>
                <th className="table-header w-6"></th>
              </tr>
            </thead>
            <tbody>
              {(mis.poderesMisticos || []).map((p, i) => (
                <tr key={i}>
                  <td className="table-cell">
                    <input value={p.nombre || ''} onChange={e => {
                      const list = [...(mis.poderesMisticos || [])]
                      list[i] = { ...list[i], nombre: e.target.value }
                      set('misticos.poderesMisticos', list)
                    }} />
                  </td>
                  <td className="table-cell">
                    <input value={p.descripcion || ''} onChange={e => {
                      const list = [...(mis.poderesMisticos || [])]
                      list[i] = { ...list[i], descripcion: e.target.value }
                      set('misticos.poderesMisticos', list)
                    }} />
                  </td>
                  <td className="table-cell text-center">
                    <button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() =>
                      set('misticos.poderesMisticos', (mis.poderesMisticos || []).filter((_, idx) => idx !== i))
                    }>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Invocaciones ── */}
      <div className="panel">
        <div className="panel-title flex items-center justify-between">
          <span>Invocaciones y Encarnaciones</span>
          <button className="add-row-btn" onClick={addInvocacion}>+ Añadir</button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="table-header text-left">Nombre</th>
              <th className="table-header">Convocatoria</th>
              <th className="table-header">Dominación</th>
              <th className="table-header">Atadura</th>
              <th className="table-header">Desconvocación</th>
              <th className="table-header">Criaturas atadas</th>
              <th className="table-header w-6"></th>
            </tr>
          </thead>
          <tbody>
            {(mis.invocaciones || []).map((inv, i) => (
              <tr key={i}>
                <td className="table-cell">
                  <input value={inv.nombre || ''} onChange={e => {
                    const list = [...(mis.invocaciones || [])]
                    list[i] = { ...list[i], nombre: e.target.value }
                    set('misticos.invocaciones', list)
                  }} />
                </td>
                {['convocatoria', 'dominacion', 'atadura', 'desconvocacion', 'criaturas'].map(f => (
                  <td key={f} className="table-cell">
                    <input type="number" className="w-full text-center" value={inv[f] ?? 0} onChange={e => {
                      const list = [...(mis.invocaciones || [])]
                      list[i] = { ...list[i], [f]: +e.target.value }
                      set('misticos.invocaciones', list)
                    }} />
                  </td>
                ))}
                <td className="table-cell text-center">
                  <button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() =>
                    set('misticos.invocaciones', (mis.invocaciones || []).filter((_, idx) => idx !== i))
                  }>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Ritual de Convocación ── */}
      <div className="panel">
        <div className="panel-title">Ritual de Convocación</div>
        <div className="p-2 grid grid-cols-3 gap-2">
          <F label="Nombre Verdadero del objetivo">
            <input value={mis.ritualConvocacion?.nombreVerdadero || ''} onChange={e => set('misticos.ritualConvocacion.nombreVerdadero', e.target.value)} />
          </F>
          <F label="Convocación en masa">
            <input value={mis.ritualConvocacion?.convocMasa || ''} onChange={e => set('misticos.ritualConvocacion.convocMasa', e.target.value)} />
          </F>
          <F label="Desconocer el tipo">
            <input value={mis.ritualConvocacion?.desconocerTipo || ''} onChange={e => set('misticos.ritualConvocacion.desconocerTipo', e.target.value)} />
          </F>
          <F label="Pertenencia del objetivo">
            <input value={mis.ritualConvocacion?.pertenencia || ''} onChange={e => set('misticos.ritualConvocacion.pertenencia', e.target.value)} />
          </F>
          <F label="Tener parte del objetivo">
            <input value={mis.ritualConvocacion?.tenerParte || ''} onChange={e => set('misticos.ritualConvocacion.tenerParte', e.target.value)} />
          </F>
        </div>
      </div>
    </div>
  )
}
