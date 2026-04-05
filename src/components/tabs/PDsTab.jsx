import React, { useState } from 'react'
import useCharacterStore from '../../store/useCharacterStore'

const F = ({ label, children, w = 'flex-1' }) => (
  <div className={`${w} flex flex-col gap-0.5`}>
    {label && <span className="field-label">{label}</span>}
    {children}
  </div>
)

const SKILLS_COMBATE = ['H. Ataque', 'H. Esquiva', 'H. Parada', 'Llevar Armadura', 'Tablas de Armas', 'Tablas de Estilos', 'Artes Marciales']
const SKILLS_KI = ['Puntos de KI', 'Acumulación de KI', 'CM']
const SKILLS_MISTICO = ['Zeón', 'Nivel de Magia', 'Proyección Mágica', 'Convocar', 'Dominar', 'Atar', 'Desconvocar']
const SKILLS_PSIQUICO = ['CVs', 'Proyección Psíquica']
const SKILLS_SEC = ['Acrobacias', 'Atletismo', 'Montar', 'Nadar', 'Trepar', 'Saltar',
  'Estilo', 'Intimidar', 'Liderazgo', 'Persuasión',
  'Advertir', 'Buscar', 'Rastrear',
  'Animales', 'Ciencia', 'Herbolaria', 'Historia', 'Medicina', 'Memorizar', 'Navegación', 'Ocultismo', 'Tasación', 'V. Mágica',
  'Frialdad', 'P. Fuerza', 'Res. Dolor',
  'Cerrajería', 'Disfraz', 'Ocultarse', 'Robo', 'Sigilo', 'Trampería', 'Venenos',
  'Arte', 'Baile', 'Forja', 'Música', 'T. Manos']

export default function PDsTab({ char }) {
  const updateField = useCharacterStore(s => s.updateField)
  const set = (path, val) => updateField(char.id, path, val)
  const [activeNivel, setActiveNivel] = useState(1)

  const pds = char.pds || {}
  const niveles = pds.niveles || []
  const nivel = niveles[activeNivel - 1] || {}

  const updNivel = (field, val) => {
    const list = [...niveles]
    if (!list[activeNivel - 1]) list[activeNivel - 1] = {}
    list[activeNivel - 1] = { ...list[activeNivel - 1], [field]: val }
    set('pds.niveles', list)
  }

  const updNivelSkill = (group, skill, val) => {
    const list = [...niveles]
    const niv = { ...(list[activeNivel - 1] || {}) }
    niv[group] = { ...(niv[group] || {}), [skill]: +val }
    list[activeNivel - 1] = niv
    set('pds.niveles', list)
  }

  const updNivelSec = (skill, val) => {
    const list = [...niveles]
    const niv = { ...(list[activeNivel - 1] || {}) }
    niv.secundarias = { ...(niv.secundarias || {}), [skill]: +val }
    list[activeNivel - 1] = niv
    set('pds.niveles', list)
  }

  // Total PDs gastados en nivel activo
  const calcTotalGastadoNivel = () => {
    let total = 0
    const n = nivel
    SKILLS_COMBATE.forEach(s => { total += parseInt(n.combate?.[s]) || 0 })
    SKILLS_KI.forEach(s => { total += parseInt(n.ki?.[s]) || 0 })
    SKILLS_MISTICO.forEach(s => { total += parseInt(n.mistico?.[s]) || 0 })
    SKILLS_PSIQUICO.forEach(s => { total += parseInt(n.psiquico?.[s]) || 0 })
    SKILLS_SEC.forEach(s => { total += parseInt(n.secundarias?.[s]) || 0 })
    total += parseInt(n.caracteristicas?.pdsGastados) || 0
    return total
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Resumen global */}
      <div className="panel">
        <div className="panel-title">Resumen de Puntos de Desarrollo</div>
        <div className="p-2 grid grid-cols-4 gap-3">
          <F label="PDs Totales Acumulados">
            <input type="number" value={pds.pdsTotal ?? 0} onChange={e => set('pds.pdsTotal', +e.target.value)} />
          </F>
          <F label="PDs Gastados">
            <input type="number" value={pds.pdsGastados ?? 0} onChange={e => set('pds.pdsGastados', +e.target.value)} />
          </F>
          <F label="PDs Libres">
            <input type="number" value={pds.pdsLibres ?? 0} onChange={e => set('pds.pdsLibres', +e.target.value)} />
          </F>
          <F label="Categoría">
            <input value={char.categoria || ''} readOnly className="calc-input" />
          </F>
        </div>
        <div className="p-2 flex flex-wrap gap-2">
          <div className="panel p-2 flex flex-col gap-1 w-64">
            <div className="text-[#c9a84c] text-xs font-bold mb-1">Bonos de Novel</div>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex gap-1">
                <input placeholder={`Bono #${i + 1}`} value={pds.bonusNoveles?.[i] || ''} onChange={e => {
                  const list = [...(pds.bonusNoveles || ['', '', ''])]
                  list[i] = e.target.value
                  set('pds.bonusNoveles', list)
                }} />
              </div>
            ))}
          </div>
          <div className="panel p-2 flex flex-col gap-1 w-64">
            <div className="text-[#c9a84c] text-xs font-bold mb-1">Bonos Naturales</div>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex gap-1">
                <input placeholder={`Bono #${i + 1}`} value={pds.bonusNaturales?.[i] || ''} onChange={e => {
                  const list = [...(pds.bonusNaturales || ['', '', '', '', ''])]
                  list[i] = e.target.value
                  set('pds.bonusNaturales', list)
                }} />
              </div>
            ))}
          </div>
          <div className="panel p-2 flex flex-col gap-1 w-64">
            <div className="text-[#c9a84c] text-xs font-bold mb-1">Habilidades Naturales</div>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex gap-1">
                <input placeholder={`Hab. #${i + 1}`} value={pds.habNaturales?.[i] || ''} onChange={e => {
                  const list = [...(pds.habNaturales || ['', '', '', '', ''])]
                  list[i] = e.target.value
                  set('pds.habNaturales', list)
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selector de nivel */}
      <div className="panel">
        <div className="panel-title">Detalle por Nivel</div>
        <div className="flex flex-wrap gap-1 p-2 border-b border-[#4a3520]">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
            <button key={n}
              className={`w-7 h-7 text-xs rounded border transition-colors ${activeNivel === n
                ? 'bg-[#c9a84c] text-[#1a1410] border-[#c9a84c] font-bold'
                : 'bg-[#1a1410] text-[#8a7560] border-[#4a3520] hover:border-[#c9a84c] hover:text-[#c9a84c]'
              }`}
              onClick={() => setActiveNivel(n)}>
              {n}
            </button>
          ))}
        </div>

        <div className="p-2 flex flex-col gap-3">
          {/* Cabecera nivel */}
          <div className="flex gap-3 items-center">
            <F label="PDs Ganados este Nivel" w="w-40">
              <input type="number" value={nivel.pdsGanados ?? 0} onChange={e => updNivel('pdsGanados', +e.target.value)} />
            </F>
            <F label="PDs Gastados (calculado)" w="w-40">
              <span className="calc-input block text-center px-2 py-1 rounded">{calcTotalGastadoNivel()}</span>
            </F>
            <F label="Notas">
              <input value={nivel.notas || ''} onChange={e => updNivel('notas', e.target.value)} />
            </F>
          </div>

          {/* Grid de habilidades */}
          <div className="grid grid-cols-4 gap-3">
            {/* Combate */}
            <div className="panel">
              <div className="panel-title">Combate</div>
              <div className="p-2 flex flex-col gap-1">
                {SKILLS_COMBATE.map(s => (
                  <div key={s} className="flex items-center gap-1">
                    <span className="field-label flex-1 text-xs">{s}</span>
                    <input type="number" className="w-14 text-center" value={nivel.combate?.[s] ?? 0}
                      onChange={e => updNivelSkill('combate', s, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Ki + Místico */}
            <div className="flex flex-col gap-2">
              <div className="panel">
                <div className="panel-title">Ki</div>
                <div className="p-2 flex flex-col gap-1">
                  {SKILLS_KI.map(s => (
                    <div key={s} className="flex items-center gap-1">
                      <span className="field-label flex-1 text-xs">{s}</span>
                      <input type="number" className="w-14 text-center" value={nivel.ki?.[s] ?? 0}
                        onChange={e => updNivelSkill('ki', s, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel">
                <div className="panel-title">Místico</div>
                <div className="p-2 flex flex-col gap-1">
                  {SKILLS_MISTICO.map(s => (
                    <div key={s} className="flex items-center gap-1">
                      <span className="field-label flex-1 text-xs">{s}</span>
                      <input type="number" className="w-14 text-center" value={nivel.mistico?.[s] ?? 0}
                        onChange={e => updNivelSkill('mistico', s, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel">
                <div className="panel-title">Psíquico</div>
                <div className="p-2 flex flex-col gap-1">
                  {SKILLS_PSIQUICO.map(s => (
                    <div key={s} className="flex items-center gap-1">
                      <span className="field-label flex-1 text-xs">{s}</span>
                      <input type="number" className="w-14 text-center" value={nivel.psiquico?.[s] ?? 0}
                        onChange={e => updNivelSkill('psiquico', s, e.target.value)} />
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-[#4a3520]">
                  <div className="flex items-center gap-1">
                    <span className="field-label flex-1 text-xs">PDs en Caract.</span>
                    <input type="number" className="w-14 text-center"
                      value={nivel.caracteristicas?.pdsGastados ?? 0}
                      onChange={e => {
                        const list = [...niveles]
                        const niv = { ...(list[activeNivel - 1] || {}) }
                        niv.caracteristicas = { ...(niv.caracteristicas || {}), pdsGastados: +e.target.value }
                        list[activeNivel - 1] = niv
                        set('pds.niveles', list)
                      }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Secundarias 1ª mitad */}
            <div className="panel">
              <div className="panel-title">Habilidades Sec. (1/2)</div>
              <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-96">
                {SKILLS_SEC.slice(0, Math.ceil(SKILLS_SEC.length / 2)).map(s => (
                  <div key={s} className="flex items-center gap-1">
                    <span className="field-label flex-1 text-xs">{s}</span>
                    <input type="number" className="w-14 text-center" value={nivel.secundarias?.[s] ?? 0}
                      onChange={e => updNivelSec(s, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Secundarias 2ª mitad */}
            <div className="panel">
              <div className="panel-title">Habilidades Sec. (2/2)</div>
              <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-96">
                {SKILLS_SEC.slice(Math.ceil(SKILLS_SEC.length / 2)).map(s => (
                  <div key={s} className="flex items-center gap-1">
                    <span className="field-label flex-1 text-xs">{s}</span>
                    <input type="number" className="w-14 text-center" value={nivel.secundarias?.[s] ?? 0}
                      onChange={e => updNivelSec(s, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ventajas del nivel */}
          <div className="panel">
            <div className="panel-title flex items-center justify-between">
              <span>Ventajas / Desventajas adquiridas en Nivel {activeNivel}</span>
              <button className="add-row-btn" onClick={() => {
                const list = [...niveles]
                const niv = { ...(list[activeNivel - 1] || {}) }
                niv.ventajas = [...(niv.ventajas || []), { nombre: '', coste: 0, tipo: 'Ventaja' }]
                list[activeNivel - 1] = niv
                set('pds.niveles', list)
              }}>+ Añadir</button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="table-header text-left">Nombre</th>
                  <th className="table-header w-24">Tipo</th>
                  <th className="table-header w-16">Coste PDs</th>
                  <th className="table-header w-6"></th>
                </tr>
              </thead>
              <tbody>
                {(nivel.ventajas || []).map((v, vi) => (
                  <tr key={vi}>
                    <td className="table-cell">
                      <input value={v.nombre || ''} onChange={e => {
                        const list = [...niveles]
                        const niv = { ...(list[activeNivel - 1] || {}) }
                        niv.ventajas = [...(niv.ventajas || [])]
                        niv.ventajas[vi] = { ...niv.ventajas[vi], nombre: e.target.value }
                        list[activeNivel - 1] = niv
                        set('pds.niveles', list)
                      }} />
                    </td>
                    <td className="table-cell">
                      <select value={v.tipo || 'Ventaja'} onChange={e => {
                        const list = [...niveles]
                        const niv = { ...(list[activeNivel - 1] || {}) }
                        niv.ventajas = [...(niv.ventajas || [])]
                        niv.ventajas[vi] = { ...niv.ventajas[vi], tipo: e.target.value }
                        list[activeNivel - 1] = niv
                        set('pds.niveles', list)
                      }}>
                        <option>Ventaja</option>
                        <option>Desventaja</option>
                        <option>Especial</option>
                      </select>
                    </td>
                    <td className="table-cell">
                      <input type="number" className="w-full text-center" value={v.coste ?? 0} onChange={e => {
                        const list = [...niveles]
                        const niv = { ...(list[activeNivel - 1] || {}) }
                        niv.ventajas = [...(niv.ventajas || [])]
                        niv.ventajas[vi] = { ...niv.ventajas[vi], coste: +e.target.value }
                        list[activeNivel - 1] = niv
                        set('pds.niveles', list)
                      }} />
                    </td>
                    <td className="table-cell text-center">
                      <button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() => {
                        const list = [...niveles]
                        const niv = { ...(list[activeNivel - 1] || {}) }
                        niv.ventajas = (niv.ventajas || []).filter((_, idx) => idx !== vi)
                        list[activeNivel - 1] = niv
                        set('pds.niveles', list)
                      }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
