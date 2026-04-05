import React from 'react'
import useCharacterStore from '../../store/useCharacterStore'
import { CATEGORIAS_DATA, RAZAS } from '../../data/tables'

const CATEGORIAS_LIST = Object.keys(CATEGORIAS_DATA)

const F = ({ label, children, w = 'flex-1' }) => (
  <div className={`${w} flex flex-col gap-0.5`}>
    {label && <span className="field-label">{label}</span>}
    {children}
  </div>
)

const Row = ({ children, className = '' }) => (
  <div className={`flex gap-2 items-start ${className}`}>{children}</div>
)

export default function GeneralTab({ char }) {
  const updateField = useCharacterStore(s => s.updateField)
  const set = (path, val) => updateField(char.id, path, val)

  const updateList = (key, idx, field, val) => {
    const list = [...(char[key] || [])]
    list[idx] = { ...list[idx], [field]: val }
    set(key, list)
  }
  const addRow = (key, template) => set(key, [...(char[key] || []), { ...template }])
  const removeRow = (key, idx) => set(key, (char[key] || []).filter((_, i) => i !== idx))

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {/* ── Columna izquierda ── */}
      <div className="flex flex-col gap-3">
        {/* Descripción del Personaje */}
        <div className="panel">
          <div className="panel-title">Descripción del Personaje</div>
          <div className="p-2 flex flex-col gap-2">
            <Row>
              <F label="Nombre" w="flex-[2]"><input value={char.nombre || ''} onChange={e => set('nombre', e.target.value)} /></F>
              <F label="Categoría">
                <select value={char.categoria || ''} onChange={e => set('categoria', e.target.value)}
                  className="w-full bg-[#1a1410] border border-[#4a3520] text-[#e8d5b0] rounded px-2 py-1 text-sm">
                  <option value="">— Sin categoría —</option>
                  {CATEGORIAS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </F>
              <F label="Nivel" w="w-16"><input type="number" value={char.nivel || 0} onChange={e => set('nivel', +e.target.value)} /></F>
            </Row>
            <Row>
              <F label="Raza">
                <select value={char.raza || 'Humano'} onChange={e => set('raza', e.target.value)}
                  className="w-full bg-[#1a1410] border border-[#4a3520] text-[#e8d5b0] rounded px-2 py-1 text-sm">
                  {RAZAS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </F>
              <F label="Sexo"><input value={char.sexo || ''} onChange={e => set('sexo', e.target.value)} /></F>
              <F label="Origen"><input value={char.origen || ''} onChange={e => set('origen', e.target.value)} /></F>
            </Row>
            <Row>
              <F label="Edad" w="w-20"><input value={char.edad || ''} onChange={e => set('edad', e.target.value)} /></F>
              <F label="Altura" w="w-20"><input value={char.altura || ''} onChange={e => set('altura', e.target.value)} /></F>
              <F label="Peso" w="w-20"><input value={char.peso || ''} onChange={e => set('peso', e.target.value)} /></F>
              <F label="Ojos"><input value={char.ojos || ''} onChange={e => set('ojos', e.target.value)} /></F>
              <F label="Cabello"><input value={char.cabello || ''} onChange={e => set('cabello', e.target.value)} /></F>
            </Row>
            <F label="Apariencia"><input value={char.apariencia || ''} onChange={e => set('apariencia', e.target.value)} /></F>
          </div>
        </div>

        {/* Descripción Física */}
        <div className="panel">
          <div className="panel-title">Descripción Física</div>
          <textarea className="w-full p-2 h-20 resize-none border-0 bg-[#231d17] text-[#e8d5b0]"
            value={char.descripcionFisica || ''} onChange={e => set('descripcionFisica', e.target.value)} />
        </div>

        {/* Personalidad */}
        <div className="panel">
          <div className="panel-title">Personalidad</div>
          <textarea className="w-full p-2 h-20 resize-none border-0 bg-[#231d17] text-[#e8d5b0]"
            value={char.personalidad || ''} onChange={e => set('personalidad', e.target.value)} />
        </div>

        {/* Motivación */}
        <div className="panel">
          <div className="panel-title">Motivación y Objetivos</div>
          <textarea className="w-full p-2 h-20 resize-none border-0 bg-[#231d17] text-[#e8d5b0]"
            value={char.motivacion || ''} onChange={e => set('motivacion', e.target.value)} />
        </div>

        {/* Cita favorita */}
        <div className="panel">
          <div className="panel-title">Cita Favorita</div>
          <div className="p-2">
            <textarea className="w-full h-12 resize-none border-0 bg-[#231d17] text-[#e8d5b0]"
              value={char.citaFavorita || ''} onChange={e => set('citaFavorita', e.target.value)} />
          </div>
        </div>

        {/* Valores morales */}
        <div className="panel">
          <div className="panel-title">Valores</div>
          <div className="p-2 grid grid-cols-2 gap-2">
            {['audacia', 'cobardia', 'honorabilidad', 'infamia'].map(v => (
              <F key={v} label={v.charAt(0).toUpperCase() + v.slice(1)}>
                <input type="number" value={char.valores?.[v] || 0}
                  onChange={e => set(`valores.${v}`, +e.target.value)} />
              </F>
            ))}
          </div>
        </div>

        {/* Salud Mental */}
        <div className="panel">
          <div className="panel-title">Salud Mental</div>
          <div className="p-2 flex flex-col gap-2">
            <F label="Umbral de locura">
              <input type="number" value={char.saludMental?.umbral || 0}
                onChange={e => set('saludMental.umbral', +e.target.value)} />
            </F>
            <F label="Notas">
              <textarea className="h-12 resize-none" value={char.saludMental?.notas || ''}
                onChange={e => set('saludMental.notas', e.target.value)} />
            </F>
          </div>
        </div>
      </div>

      {/* ── Columna derecha ── */}
      <div className="flex flex-col gap-3">
        {/* Equipo de Combate */}
        <div className="panel">
          <div className="panel-title flex items-center justify-between">
            <span>Equipo de Combate</span>
            <button className="add-row-btn" onClick={() => addRow('equipoCombate', { nombre: '', localizacion: '', peso: '' })}>+ Añadir</button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header text-left w-[50%]">Nombre</th>
                <th className="table-header">Localización</th>
                <th className="table-header w-16">Peso</th>
                <th className="table-header w-6"></th>
              </tr>
            </thead>
            <tbody>
              {(char.equipoCombate || []).map((item, i) => (
                <tr key={i}>
                  <td className="table-cell"><input value={item.nombre} onChange={e => updateList('equipoCombate', i, 'nombre', e.target.value)} /></td>
                  <td className="table-cell"><input value={item.localizacion} onChange={e => updateList('equipoCombate', i, 'localizacion', e.target.value)} /></td>
                  <td className="table-cell"><input type="number" value={item.peso} onChange={e => updateList('equipoCombate', i, 'peso', e.target.value)} /></td>
                  <td className="table-cell text-center"><button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() => removeRow('equipoCombate', i)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vestimenta */}
        <div className="panel">
          <div className="panel-title flex items-center justify-between">
            <span>Vestimenta / Complementos</span>
            <button className="add-row-btn" onClick={() => addRow('vestimenta', { nombre: '', peso: '' })}>+ Añadir</button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header text-left">Nombre</th>
                <th className="table-header w-16">Peso</th>
                <th className="table-header w-6"></th>
              </tr>
            </thead>
            <tbody>
              {(char.vestimenta || []).map((item, i) => (
                <tr key={i}>
                  <td className="table-cell"><input value={item.nombre} onChange={e => updateList('vestimenta', i, 'nombre', e.target.value)} /></td>
                  <td className="table-cell"><input type="number" value={item.peso} onChange={e => updateList('vestimenta', i, 'peso', e.target.value)} /></td>
                  <td className="table-cell text-center"><button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() => removeRow('vestimenta', i)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Equipo variado */}
        <div className="panel">
          <div className="panel-title flex items-center justify-between">
            <span>Equipo Variado</span>
            <button className="add-row-btn" onClick={() => addRow('equipoVariado', { nombre: '', peso: '' })}>+ Añadir</button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header text-left">Nombre</th>
                <th className="table-header w-16">Peso</th>
                <th className="table-header w-6"></th>
              </tr>
            </thead>
            <tbody>
              {(char.equipoVariado || []).map((item, i) => (
                <tr key={i}>
                  <td className="table-cell"><input value={item.nombre} onChange={e => updateList('equipoVariado', i, 'nombre', e.target.value)} /></td>
                  <td className="table-cell"><input type="number" value={item.peso} onChange={e => updateList('equipoVariado', i, 'peso', e.target.value)} /></td>
                  <td className="table-cell text-center"><button className="text-[#4a3520] hover:text-red-500 text-xs" onClick={() => removeRow('equipoVariado', i)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Artefactos */}
        <div className="panel">
          <div className="panel-title flex items-center justify-between">
            <span>Artefactos</span>
            <button className="add-row-btn" onClick={() => addRow('artefactos', { nombre: '', descripcion: '' })}>+ Añadir</button>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {(char.artefactos || []).map((item, i) => (
              <Row key={i}>
                <F label="Nombre" w="w-32"><input value={item.nombre} onChange={e => updateList('artefactos', i, 'nombre', e.target.value)} /></F>
                <F label="Descripción"><input value={item.descripcion} onChange={e => updateList('artefactos', i, 'descripcion', e.target.value)} /></F>
                <button className="text-[#4a3520] hover:text-red-500 text-xs self-end mb-0.5" onClick={() => removeRow('artefactos', i)}>✕</button>
              </Row>
            ))}
          </div>
        </div>

        {/* Títulos y Dinero */}
        <div className="grid grid-cols-2 gap-3">
          <div className="panel">
            <div className="panel-title">Títulos y Posesiones</div>
            <textarea className="w-full p-2 h-20 resize-none border-0 bg-[#231d17] text-[#e8d5b0]"
              value={char.titulosYPosesiones || ''} onChange={e => set('titulosYPosesiones', e.target.value)} />
          </div>
          <div className="panel">
            <div className="panel-title">Dinero</div>
            <div className="p-2 flex flex-col gap-1">
              {['oro', 'plata', 'cobre'].map(m => (
                <F key={m} label={m.charAt(0).toUpperCase() + m.slice(1)}>
                  <input type="number" value={char.dinero?.[m] || 0}
                    onChange={e => set(`dinero.${m}`, +e.target.value)} />
                </F>
              ))}
              <F label="Joyas y otros">
                <input type="number" value={char.dinero?.joyas || 0}
                  onChange={e => set('dinero.joyas', +e.target.value)} />
              </F>
              <div className="flex justify-between text-xs mt-1">
                <span className="field-label">Total</span>
                <span className="text-[#c9a84c] font-bold">
                  {((char.dinero?.oro || 0) + (char.dinero?.plata || 0) / 10 + (char.dinero?.cobre || 0) / 100 + (char.dinero?.joyas || 0)).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contactos */}
        <div className="panel">
          <div className="panel-title">Contactos</div>
          <textarea className="w-full p-2 h-16 resize-none border-0 bg-[#231d17] text-[#e8d5b0]"
            value={char.contactos || ''} onChange={e => set('contactos', e.target.value)} />
        </div>

        {/* Fama */}
        <div className="panel">
          <div className="panel-title">Fama y Reconocimiento</div>
          <textarea className="w-full p-2 h-16 resize-none border-0 bg-[#231d17] text-[#e8d5b0]"
            value={char.fama || ''} onChange={e => set('fama', e.target.value)} />
        </div>
      </div>
    </div>
  )
}
