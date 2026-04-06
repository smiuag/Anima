import React from 'react'
import useCharacterStore from '../../store/useCharacterStore'
import CollapsiblePanel from '../CollapsiblePanel'

const F = ({ label, children, w = 'flex-1' }) => (
  <div className={`${w} flex flex-col gap-0.5`}>
    {label && <span className="field-label">{label}</span>}
    {children}
  </div>
)

export default function PersonalizacionTab({ char }) {
  const updateField = useCharacterStore(s => s.updateField)
  const set = (path, val) => updateField(char.id, path, val)

  const pers = char.personalizacion || {}

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Elan */}
      <CollapsiblePanel title="Elan y Personalización" defaultOpen={false}>
        <div className="p-2 flex flex-col gap-3">
          {(pers.elan || []).map((e, i) => (
            <div key={i} className="flex gap-3 items-start border-b border-[#2a2018] pb-2">
              <F label={`Elan ${i + 1}`} w="w-48">
                <input value={e.nombre || ''} onChange={ev => {
                  const list = [...(pers.elan || [])]
                  list[i] = { ...list[i], nombre: ev.target.value }
                  set('personalizacion.elan', list)
                }} />
              </F>
              <F label="Modificadores">
                <input value={e.modificadores || ''} onChange={ev => {
                  const list = [...(pers.elan || [])]
                  list[i] = { ...list[i], modificadores: ev.target.value }
                  set('personalizacion.elan', list)
                }} />
              </F>
            </div>
          ))}
        </div>
      </CollapsiblePanel>

      {/* Invocaciones Personalizadas + Conjuro especializado */}
      <div className="grid grid-cols-2 gap-3">
        <CollapsiblePanel title="Invocaciones Personalizadas" defaultOpen={false}>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left">Nombre</th>
                <th className="table-header">Dif.</th>
                <th className="table-header w-14">Zeón</th>
                <th className="table-header w-14">Límite</th>
              </tr>
            </thead>
            <tbody>
              {(pers.invocacionesPersonalizadas || []).map((inv, i) => (
                <tr key={i}>
                  <td className="table-cell">
                    <input value={inv.nombre || ''} onChange={e => {
                      const list = [...(pers.invocacionesPersonalizadas || [])]
                      list[i] = { ...list[i], nombre: e.target.value }
                      set('personalizacion.invocacionesPersonalizadas', list)
                    }} />
                  </td>
                  <td className="table-cell">
                    <input value={inv.dif || ''} onChange={e => {
                      const list = [...(pers.invocacionesPersonalizadas || [])]
                      list[i] = { ...list[i], dif: e.target.value }
                      set('personalizacion.invocacionesPersonalizadas', list)
                    }} />
                  </td>
                  <td className="table-cell">
                    <input type="number" className="w-full text-center" value={inv.zeon ?? 0} onChange={e => {
                      const list = [...(pers.invocacionesPersonalizadas || [])]
                      list[i] = { ...list[i], zeon: +e.target.value }
                      set('personalizacion.invocacionesPersonalizadas', list)
                    }} />
                  </td>
                  <td className="table-cell">
                    <input type="number" className="w-full text-center" value={inv.limite ?? 0} onChange={e => {
                      const list = [...(pers.invocacionesPersonalizadas || [])]
                      list[i] = { ...list[i], limite: +e.target.value }
                      set('personalizacion.invocacionesPersonalizadas', list)
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsiblePanel>

        <CollapsiblePanel title="Conjuros Especializados" defaultOpen={false}>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left">Conjuro</th>
                <th className="table-header w-14">Nivel</th>
              </tr>
            </thead>
            <tbody>
              {(pers.conjuroEspecializado || []).map((c, i) => (
                <tr key={i}>
                  <td className="table-cell">
                    <input value={c.conjuro || ''} onChange={e => {
                      const list = [...(pers.conjuroEspecializado || [])]
                      list[i] = { ...list[i], conjuro: e.target.value }
                      set('personalizacion.conjuroEspecializado', list)
                    }} />
                  </td>
                  <td className="table-cell">
                    <input type="number" className="w-full text-center" value={c.nivel ?? 0} onChange={e => {
                      const list = [...(pers.conjuroEspecializado || [])]
                      list[i] = { ...list[i], nivel: +e.target.value }
                      set('personalizacion.conjuroEspecializado', list)
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsiblePanel>
      </div>

      {/* Patrones Mentales Personalizados */}
      <CollapsiblePanel title="Patrones Mentales Personalizados" defaultOpen={false}>
        {(pers.patronesMentalesPersonalizados || []).map((patron, i) => (
          <div key={i} className="border-b border-[#2a2018] p-2">
            <div className="text-[#c9a84c] text-xs font-bold mb-2">Patrón {i + 1}</div>
            <div className="flex gap-2 mb-2">
              <F label="Patrón Mental" w="flex-[2]">
                <input value={patron.patron || ''} onChange={e => {
                  const list = [...(pers.patronesMentalesPersonalizados || [])]
                  list[i] = { ...list[i], patron: e.target.value }
                  set('personalizacion.patronesMentalesPersonalizados', list)
                }} />
              </F>
              <F label="Coste 1" w="w-20">
                <input type="number" value={patron.coste ?? 0} onChange={e => {
                  const list = [...(pers.patronesMentalesPersonalizados || [])]
                  list[i] = { ...list[i], coste: +e.target.value }
                  set('personalizacion.patronesMentalesPersonalizados', list)
                }} />
              </F>
              <F label="Coste 2" w="w-20">
                <input type="number" value={patron.coste2 ?? 0} onChange={e => {
                  const list = [...(pers.patronesMentalesPersonalizados || [])]
                  list[i] = { ...list[i], coste2: +e.target.value }
                  set('personalizacion.patronesMentalesPersonalizados', list)
                }} />
              </F>
            </div>
            <div className="flex gap-2">
              <F label="Bonificadores">
                <textarea className="h-12 resize-none" value={patron.bonos || ''} onChange={e => {
                  const list = [...(pers.patronesMentalesPersonalizados || [])]
                  list[i] = { ...list[i], bonos: e.target.value }
                  set('personalizacion.patronesMentalesPersonalizados', list)
                }} />
              </F>
              <F label="Penalizadores">
                <textarea className="h-12 resize-none" value={patron.penalizadores || ''} onChange={e => {
                  const list = [...(pers.patronesMentalesPersonalizados || [])]
                  list[i] = { ...list[i], penalizadores: e.target.value }
                  set('personalizacion.patronesMentalesPersonalizados', list)
                }} />
              </F>
              <F label="Descripción" w="flex-[2]">
                <textarea className="h-12 resize-none" value={patron.descripcion || ''} onChange={e => {
                  const list = [...(pers.patronesMentalesPersonalizados || [])]
                  list[i] = { ...list[i], descripcion: e.target.value }
                  set('personalizacion.patronesMentalesPersonalizados', list)
                }} />
              </F>
            </div>
          </div>
        ))}
      </CollapsiblePanel>
    </div>
  )
}
