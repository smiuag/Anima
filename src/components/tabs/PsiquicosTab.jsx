import React from 'react'
import useCharacterStore from '../../store/useCharacterStore'
import { getCatData } from '../../data/tables'
import CollapsiblePanel from '../CollapsiblePanel'

const F = ({ label, children, w = 'flex-1' }) => (
  <div className={`${w} flex flex-col gap-0.5`}>
    {label && <span className="field-label">{label}</span>}
    {children}
  </div>
)

const DISCIPLINAS_PSI = [
  'Telequinesis', 'Telepatía', 'Pirokinesis', 'Criokinesis',
  'Electrokinesis', 'Fisioquinesis', 'Sentikinesis', 'Energokinesis',
  'Matrixkinesis', 'Umbrakinesis', 'Photokinesis', 'Magnetokinesis',
]

const CV_TABLA = [
  { pot: '+10', cv1: '+10', cv2: '+10 / CV' },
  { pot: '+20', cv1: '+20', cv2: '+20 / CV' },
  { pot: '+30', cv1: '+30', cv2: '+20 / CV' },
  { pot: '+40', cv1: '+40', cv2: '+20 / CV' },
  { pot: '+50', cv1: '+50', cv2: '+20 / CV' },
  { pot: 'Max +50', cv1: '+50', cv2: '+20 / CV' },
  { pot: 'Max +100', cv1: '+100', cv2: '+10 / CV' },
]

export default function PsiquicosTab({ char }) {
  const updateField = useCharacterStore(s => s.updateField)
  const set = (path, val) => updateField(char.id, path, val)

  const psi = char.psiquicos || {}
  const nivel = char.nivel || 0
  const catData = getCatData(char.categoria)
  // CVs auto-calculados: floor(nivel × PlusCV)
  // PlusCV=1 → puro psíquico (1 CV/nivel), 0.5 → mitad (1/2 niveles), 0.333 → sin psíquico (1/3 niveles)
  const plusCV = catData.PlusCV || 0
  const cvsPDs = (char.pds?.niveles || []).reduce((sum, n) => sum + (parseInt(n?.psiquico?.['CVs']) || 0), 0)
  const cvsCalculados = Math.floor(nivel * plusCV) + cvsPDs

  // Proyección Psíquica auto-calc: Σ(pts_ProjPsi en PDsTab) × 5 + esp
  const proyPsiPDsUnits = (char.pds?.niveles || []).reduce((sum, n) => sum + (parseInt(n?.psiquico?.['Proyección Psíquica']) || 0), 0)
  const proyPsiCalcBase = proyPsiPDsUnits * 5

  const addDisciplina = () => {
    const list = [...(psi.disciplinas || [])]
    list.push({ nombre: '', afines: '' })
    set('psiquicos.disciplinas', list)
  }

  const addPoder = () => {
    const list = [...(psi.poderes || [])]
    list.push({ nombre: '', descripcion: '' })
    set('psiquicos.poderes', list)
  }

  const addPatron = () => {
    const list = [...(psi.patronesMentales || [])]
    list.push({ nombre: '', bonos: '', penalizadores: '', coste: 0, coste2: 0, descripcion: '' })
    set('psiquicos.patronesMentales', list)
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* ── CVs y Potencial ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="panel">
          <div className="panel-title">Puntos de Concentración (CVs)</div>
          <div className="p-2 flex flex-col gap-2">
            <div className="flex gap-2 items-end">
              <F label="Totales (calc.)">
                <div className="calc-value">{cvsCalculados}</div>
              </F>
              <F label="Libres"><input type="number" value={psi.cvs?.libres ?? 0} onChange={e => set('psiquicos.cvs.libres', +e.target.value)} /></F>
              <F label="Usados"><input type="number" value={psi.cvs?.usados ?? 0} onChange={e => set('psiquicos.cvs.usados', +e.target.value)} /></F>
            </div>
            {char.categoria && (
              <div className="text-xs text-[#8a7560]">
                Cat:{Math.floor(nivel * plusCV)} +PDs:{cvsPDs} = {cvsCalculados} CVs
              </div>
            )}
            <F label="CVs por Turno">
              <input type="number" value={psi.cvs?.porTurno ?? 0} onChange={e => set('psiquicos.cvs.porTurno', +e.target.value)} />
            </F>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Potencial y Proyección</div>
          <div className="p-2 flex flex-col gap-2">
            <F label="Potencial Psíquico">
              <input type="number" value={psi.potencial ?? 0} onChange={e => set('psiquicos.potencial', +e.target.value)} />
            </F>
            <div className="flex gap-1 items-end">
              <F label="Proyección Psíquica (calc.)">
                <div className="calc-value text-center">{proyPsiCalcBase + (parseInt(psi.proyEsp) || 0)}</div>
              </F>
              <F label="Esp." w="w-16">
                <input type="number" value={psi.proyEsp ?? 0} onChange={e => set('psiquicos.proyEsp', +e.target.value)} />
              </F>
            </div>
            {proyPsiPDsUnits > 0 && (
              <div className="text-xs text-[#8a7560]">PDs:{proyPsiPDsUnits}×5={proyPsiCalcBase} +Esp:{parseInt(psi.proyEsp)||0}</div>
            )}
            <F label="Nº Poderes Innatos">
              <input type="number" value={psi.innatos ?? 0} onChange={e => set('psiquicos.innatos', +e.target.value)} />
            </F>
            <F label="Cristal Psi">
              <input value={psi.cristalPsi || ''} onChange={e => set('psiquicos.cristalPsi', e.target.value)} />
            </F>
          </div>
        </div>

        <CollapsiblePanel title="Tabla General de CVs (ref.)" defaultOpen={false}>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header">Potencial</th>
                <th className="table-header">1 CV</th>
                <th className="table-header">Más CVs</th>
              </tr>
            </thead>
            <tbody>
              {CV_TABLA.map((row, i) => (
                <tr key={i}>
                  <td className="table-cell text-center text-[#c9a84c]">{row.pot}</td>
                  <td className="table-cell text-center">{row.cv1}</td>
                  <td className="table-cell text-center text-[#8a7560]">{row.cv2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsiblePanel>
      </div>

      {/* ── Disciplinas ── */}
      <CollapsiblePanel title="Disciplinas Psíquicas"
        actions={<button className="add-row-btn" onClick={addDisciplina}>+ Añadir</button>}>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="table-header text-left">Disciplina</th>
              <th className="table-header text-left">Disciplinas Afines</th>
              <th className="table-header w-6"></th>
            </tr>
          </thead>
          <tbody>
            {(psi.disciplinas || []).map((d, i) => (
              <tr key={i}>
                <td className="table-cell">
                  <input list={`disc-list-${i}`} value={d.nombre || ''} onChange={e => {
                    const list = [...(psi.disciplinas || [])]
                    list[i] = { ...list[i], nombre: e.target.value }
                    set('psiquicos.disciplinas', list)
                  }} />
                  <datalist id={`disc-list-${i}`}>
                    {DISCIPLINAS_PSI.map(dp => <option key={dp} value={dp} />)}
                  </datalist>
                </td>
                <td className="table-cell">
                  <input value={d.afines || ''} onChange={e => {
                    const list = [...(psi.disciplinas || [])]
                    list[i] = { ...list[i], afines: e.target.value }
                    set('psiquicos.disciplinas', list)
                  }} />
                </td>
                <td className="table-cell text-center">
                  <button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() =>
                    set('psiquicos.disciplinas', (psi.disciplinas || []).filter((_, idx) => idx !== i))
                  }>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsiblePanel>

      {/* ── Poderes Psíquicos ── */}
      <CollapsiblePanel title="Poderes Psíquicos"
        actions={<button className="add-row-btn" onClick={addPoder}>+ Añadir poder</button>}>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="table-header text-left w-48">Nombre</th>
              <th className="table-header">Descripción / Efectos</th>
              <th className="table-header w-6"></th>
            </tr>
          </thead>
          <tbody>
            {(psi.poderes || []).map((p, i) => (
              <tr key={i}>
                <td className="table-cell">
                  <input value={p.nombre || ''} onChange={e => {
                    const list = [...(psi.poderes || [])]
                    list[i] = { ...list[i], nombre: e.target.value }
                    set('psiquicos.poderes', list)
                  }} />
                </td>
                <td className="table-cell">
                  <input value={p.descripcion || ''} onChange={e => {
                    const list = [...(psi.poderes || [])]
                    list[i] = { ...list[i], descripcion: e.target.value }
                    set('psiquicos.poderes', list)
                  }} />
                </td>
                <td className="table-cell text-center">
                  <button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() =>
                    set('psiquicos.poderes', (psi.poderes || []).filter((_, idx) => idx !== i))
                  }>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsiblePanel>

      {/* ── Patrones Mentales ── */}
      <CollapsiblePanel title="Patrones Mentales"
        actions={<button className="add-row-btn" onClick={addPatron}>+ Añadir patrón</button>}>
        {(psi.patronesMentales || []).map((patron, i) => (
          <div key={i} className="border-b border-[#2a2018] p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2 flex-1">
                <F label="Patrón Mental" w="flex-[2]">
                  <input value={patron.nombre || ''} onChange={e => {
                    const list = [...(psi.patronesMentales || [])]
                    list[i] = { ...list[i], nombre: e.target.value }
                    set('psiquicos.patronesMentales', list)
                  }} />
                </F>
                <F label="Coste 1" w="w-20">
                  <input type="number" value={patron.coste ?? 0} onChange={e => {
                    const list = [...(psi.patronesMentales || [])]
                    list[i] = { ...list[i], coste: +e.target.value }
                    set('psiquicos.patronesMentales', list)
                  }} />
                </F>
                <F label="Coste 2" w="w-20">
                  <input type="number" value={patron.coste2 ?? 0} onChange={e => {
                    const list = [...(psi.patronesMentales || [])]
                    list[i] = { ...list[i], coste2: +e.target.value }
                    set('psiquicos.patronesMentales', list)
                  }} />
                </F>
              </div>
              <button className="ml-2 text-[#4a3520] hover:text-red-500 text-xs" onClick={() =>
                set('psiquicos.patronesMentales', (psi.patronesMentales || []).filter((_, idx) => idx !== i))
              }>✕</button>
            </div>
            <div className="flex gap-2">
              <F label="Bonificadores">
                <input value={patron.bonos || ''} onChange={e => {
                  const list = [...(psi.patronesMentales || [])]
                  list[i] = { ...list[i], bonos: e.target.value }
                  set('psiquicos.patronesMentales', list)
                }} />
              </F>
              <F label="Penalizadores">
                <input value={patron.penalizadores || ''} onChange={e => {
                  const list = [...(psi.patronesMentales || [])]
                  list[i] = { ...list[i], penalizadores: e.target.value }
                  set('psiquicos.patronesMentales', list)
                }} />
              </F>
              <F label="Descripción" w="flex-[2]">
                <input value={patron.descripcion || ''} onChange={e => {
                  const list = [...(psi.patronesMentales || [])]
                  list[i] = { ...list[i], descripcion: e.target.value }
                  set('psiquicos.patronesMentales', list)
                }} />
              </F>
            </div>
          </div>
        ))}
      </CollapsiblePanel>

      {/* ── Notas ── */}
      <CollapsiblePanel title="Notas Adicionales" defaultOpen={false}>
        <textarea className="w-full p-2 h-24 resize-none border-0 bg-[#231d17] text-[#e8d5b0]"
          value={psi.notas || ''} onChange={e => set('psiquicos.notas', e.target.value)} />
      </CollapsiblePanel>
    </div>
  )
}
