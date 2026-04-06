import React from 'react'
import useCharacterStore from '../../store/useCharacterStore'
import { VIAS_MISTICAS, PV_BASE_CON, ACT_BASE_POD, getCatData, getRazaData } from '../../data/tables'
import CollapsiblePanel from '../CollapsiblePanel'

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
  const nivel = parseInt(char.nivel) || 0
  const catData = getCatData(char.categoria)
  const razaData = getRazaData(char.raza)
  const getStatTotal = (s) => {
    const c = char.caracteristicas?.[s] || {}
    return (parseInt(c.base) || 0) + (parseInt(c.temp) || 0) + (razaData[s] || 0)
  }
  const podTotal = Math.max(1, Math.min(20, getStatTotal('POD')))

  // Zeón auto-calculado: base POD + PlusZeon × nivel + esp
  const zeonBase = PV_BASE_CON[podTotal] || 0
  const plusZeon = catData.PlusZeon || 0
  const zeonEsp = mis.zeon?.esp || 0
  const zeonCalculado = zeonBase + plusZeon * nivel + zeonEsp

  // ACT: base × (1 + múltiplos comprados). Cada múltiplo cuesta catData.ACT PDs.
  const actBase = ACT_BASE_POD[podTotal] || 0
  const actMultiplos = (char.pds?.niveles || []).reduce((sum, n) => sum + (parseInt(n?.mistico?.['ACT']) || 0), 0)
  const actCalculado = actBase * (1 + actMultiplos)

  // Zeón adicional desde PDs: cada "Pts" en PDsTab = 5 Zeón (factor ×5)
  const zeonPDsUnits = (char.pds?.niveles || []).reduce((sum, n) => sum + (parseInt(n?.mistico?.['Zeón']) || 0), 0)
  const zeonPDs = zeonPDsUnits * 5
  const zeonCalculadoFinal = zeonBase + plusZeon * nivel + zeonEsp + zeonPDs

  // Proyección Mágica auto-calc: Σ(pts_ProjMag en PDsTab) × 5 + esp
  const proyPDsUnits = (char.pds?.niveles || []).reduce((sum, n) => sum + (parseInt(n?.mistico?.['Proyección Mágica']) || 0), 0)
  const proyCalcBase = proyPDsUnits * 5

  // Convocar / Dominar / Atar / Desconvocar: Σ(pts × 5) desde PDsTab
  const pdsMistico = (skill) => (char.pds?.niveles || []).reduce((sum, n) => sum + (parseInt(n?.mistico?.[skill]) || 0), 0)
  const convCalc   = pdsMistico('Convocar')    * 5
  const domCalc    = pdsMistico('Dominar')     * 5
  const atarCalc   = pdsMistico('Atar')        * 5
  const desconvCalc = pdsMistico('Desconvocar') * 5

  // Nivel de Magia desde PDsTab (factor pendiente de verificar — DUDAS.md)
  const nivelMagiaPDs = pdsMistico('Nivel de Magia')

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
      {/* ── Stats de Zeón / Proyección / Invocación ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Columna izquierda: Zeón + Proyección */}
        <div className="flex flex-col gap-2">
          <div className="panel mb-0">
            <div className="panel-title">Zeón y Acumulación</div>
            <div className="p-2 flex flex-col gap-1.5">
              <div className="flex gap-2 items-end flex-wrap">
                <F label="Zeón Total (calc.)" w="flex-1">
                  <div className="calc-value text-lg">{zeonCalculadoFinal}</div>
                </F>
                <F label="Acum. (calc.)" w="flex-1">
                  <div className="calc-value">{actCalculado}</div>
                </F>
                <F label="Esp. Zeón" w="w-20">
                  <input type="number" value={mis.zeon?.esp ?? 0} onChange={e => set('misticos.zeon.esp', +e.target.value)} />
                </F>
                <F label="Usado" w="w-20">
                  <input type="number" value={mis.zeon?.usado ?? 0} onChange={e => set('misticos.zeon.usado', +e.target.value)} />
                </F>
                <F label="Coste diario" w="w-24">
                  <input type="number" value={mis.costeDiario ?? 0} onChange={e => set('misticos.costeDiario', +e.target.value)} />
                </F>
              </div>
              {char.categoria && (
                <div className="text-xs text-[#7fa8cc]">
                  POD:{zeonBase} +{plusZeon}×Nv{nivel} +PDs:{zeonPDsUnits}×5={zeonPDs} +Esp:{zeonEsp} = {zeonCalculadoFinal}
                </div>
              )}
            </div>
          </div>

          <div className="panel mb-0">
            <div className="panel-title">Proyección y Nivel de Magia</div>
            <div className="p-2 flex gap-2 items-end flex-wrap">
              <F label="Proy. Mágica (calc.)" w="flex-1">
                <div className="calc-value">{proyCalcBase + (parseInt(mis.proyEsp) || 0)}</div>
              </F>
              <F label="Esp." w="w-20">
                <input type="number" value={mis.proyEsp ?? 0} onChange={e => set('misticos.proyEsp', +e.target.value)} />
              </F>
              <F label="Nv. Magia (PDs)" w="w-24">
                <span className="calc-input block text-center">{nivelMagiaPDs}</span>
              </F>
              <F label="Nv. Máx." w="w-20">
                <input type="number" value={mis.nivelMaximo ?? 0} onChange={e => set('misticos.nivelMaximo', +e.target.value)} />
              </F>
              <F label="Nv. Usado" w="w-20">
                <input type="number" value={mis.nivelUsado ?? 0} onChange={e => set('misticos.nivelUsado', +e.target.value)} />
              </F>
              <F label="Nombre Verdadero" w="w-full">
                <input value={mis.nombreVerdadero || ''} onChange={e => set('misticos.nombreVerdadero', e.target.value)} />
              </F>
            </div>
          </div>
        </div>

        {/* Columna derecha: Invocación + Configuración */}
        <div className="flex flex-col gap-2">
          <div className="panel mb-0">
            <div className="panel-title">Habilidades de Invocación (calc.)</div>
            <div className="p-2 flex flex-col gap-1 text-xs">
              <div className="flex text-[#5580a0] text-xs mb-0.5">
                <span className="flex-1"></span><span className="w-12 text-center">PDs×5</span>
                <span className="w-4 text-center"></span><span className="w-14 text-center">Esp.</span>
                <span className="w-14 text-center font-bold text-[#7fa8cc]">Total</span>
              </div>
              {[
                ['Convocar',    convCalc,    'convEsp'],
                ['Dominar',     domCalc,     'domEsp'],
                ['Atar',        atarCalc,    'atarEsp'],
                ['Desconvocar', desconvCalc, 'desconvEsp'],
              ].map(([label, base, espKey]) => {
                const esp = parseInt(mis[espKey]) || 0
                return (
                  <div key={label} className="flex items-center gap-1">
                    <span className="field-label flex-1">{label}</span>
                    <span className="calc-input w-12 text-center rounded">{base || '—'}</span>
                    <span className="text-[#3a5070] text-xs w-4 text-center">+</span>
                    <input type="number" className="w-14" value={mis[espKey] ?? 0}
                      onChange={e => set(`misticos.${espKey}`, +e.target.value)} />
                    <span className="calc-input w-14 text-center rounded font-bold text-[#f5b832]">{base + esp}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="panel mb-0">
            <div className="panel-title">Configuración</div>
            <div className="p-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
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
      <CollapsiblePanel title="Vías de Magia" actions={<button className="add-row-btn" onClick={() => { const list = [...(mis.vias||[])]; list.push({ via:'', subVia:'', nivel:0, nivelMax:0, nivelUsado:0 }); set('misticos.vias', list) }}>+ Añadir vía</button>}>
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
                  <button className="text-[#3a5070] hover:text-red-500 text-xs" onClick={() =>
                    set('misticos.vias', (mis.vias || []).filter((_, idx) => idx !== i))
                  }>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsiblePanel>

      {/* ── Conjuros ── */}
      <CollapsiblePanel title="Conjuros Seleccionados" actions={<button className="add-row-btn" onClick={addConjuro}>+ Añadir conjuro</button>}>
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
                  <button className="text-[#3a5070] hover:text-red-500 text-xs" onClick={() => removeConjuro(i)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsiblePanel>

      {/* ── Metamagia + Poderes Místicos ── */}
      <div className="grid grid-cols-2 gap-3">
        <CollapsiblePanel title="Metamagia" defaultOpen={false} actions={<button className="add-row-btn" onClick={addMetamagia}>+ Añadir</button>}>
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
                    <button className="text-[#3a5070] hover:text-red-500 text-xs" onClick={() =>
                      set('misticos.metamagia', (mis.metamagia || []).filter((_, idx) => idx !== i))
                    }>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsiblePanel>

        <CollapsiblePanel title="Poderes Místicos" defaultOpen={false} actions={<button className="add-row-btn" onClick={() => { const list=[...(mis.poderesMisticos||[])]; list.push({nombre:'',descripcion:''}); set('misticos.poderesMisticos',list) }}>+ Añadir</button>}>
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
                    <button className="text-[#3a5070] hover:text-red-500 text-xs" onClick={() =>
                      set('misticos.poderesMisticos', (mis.poderesMisticos || []).filter((_, idx) => idx !== i))
                    }>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsiblePanel>
      </div>

      {/* ── Invocaciones ── */}
      <CollapsiblePanel title="Invocaciones y Encarnaciones" defaultOpen={false} actions={<button className="add-row-btn" onClick={addInvocacion}>+ Añadir</button>}>
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
                  <button className="text-[#3a5070] hover:text-red-500 text-xs" onClick={() =>
                    set('misticos.invocaciones', (mis.invocaciones || []).filter((_, idx) => idx !== i))
                  }>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsiblePanel>

      {/* ── Ritual de Convocación ── */}
      <CollapsiblePanel title="Ritual de Convocación" defaultOpen={false}>
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
      </CollapsiblePanel>
    </div>
  )
}
