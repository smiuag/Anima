import React from 'react'
import useCharacterStore from '../../store/useCharacterStore'

const F = ({ label, children, w = 'flex-1' }) => (
  <div className={`${w} flex flex-col gap-0.5`}>
    {label && <span className="field-label">{label}</span>}
    {children}
  </div>
)

const WeaponBlock = ({ title, wKey, char, set }) => {
  const w = char.armas?.[wKey] || {}
  const upd = (field, val) => set(`armas.${wKey}.${field}`, val)
  return (
    <div className="panel">
      <div className="panel-title">{title}</div>
      <div className="p-2 flex flex-col gap-1">
        <div className="flex gap-1">
          <F label="Nombre" w="flex-[2]"><input value={w.nombre || ''} onChange={e => upd('nombre', e.target.value)} /></F>
          <F label="Tam.">
            <select value={w.tam || 'Normal'} onChange={e => upd('tam', e.target.value)}>
              {['Minúsculo','Pequeño','Normal','Grande','Enorme','Gigantesco'].map(t => <option key={t}>{t}</option>)}
            </select>
          </F>
          <F label="Calidad" w="w-14"><input type="number" value={w.calidad ?? 0} onChange={e => upd('calidad', +e.target.value)} /></F>
        </div>
        <div className="flex gap-1">
          <F label="Turno" w="w-14"><input type="number" value={w.turno ?? 0} onChange={e => upd('turno', +e.target.value)} /></F>
          <F label="Ataque" w="w-14"><input type="number" value={w.ataque ?? 0} onChange={e => upd('ataque', +e.target.value)} /></F>
          <F label="Defensa" w="w-14"><input type="number" value={w.defensa ?? 0} onChange={e => upd('defensa', +e.target.value)} /></F>
          <F label="Tipo Def.">
            <select value={w.tipoDefensa || 'Par'} onChange={e => upd('tipoDefensa', e.target.value)}>
              <option>Par</option><option>Esq</option>
            </select>
          </F>
          <F label="Daño" w="w-14"><input type="number" value={w.dano ?? 0} onChange={e => upd('dano', +e.target.value)} /></F>
        </div>
        <div className="flex gap-1">
          <F label="Crit.1"><input value={w.crit1 || ''} onChange={e => upd('crit1', e.target.value)} /></F>
          <F label="Crit.2"><input value={w.crit2 || ''} onChange={e => upd('crit2', e.target.value)} /></F>
          <F label="Ent." w="w-12"><input type="number" value={w.ent ?? 0} onChange={e => upd('ent', +e.target.value)} /></F>
          <F label="Rotura" w="w-12"><input type="number" value={w.rotura ?? 0} onChange={e => upd('rotura', +e.target.value)} /></F>
          <F label="Pres." w="w-12"><input type="number" value={w.pres ?? 0} onChange={e => upd('pres', +e.target.value)} /></F>
          <div className="flex items-end gap-1">
            <label className="flex items-center gap-1 text-xs text-[#8a7560] cursor-pointer">
              <input type="checkbox" checked={!!w.tamExcesivo} onChange={e => upd('tamExcesivo', e.target.checked)} className="w-3 h-3" style={{width:'12px',height:'12px'}} />
              Tam.Exc
            </label>
          </div>
        </div>
        {wKey === 'disparo' && (
          <div className="flex gap-1">
            <F label="Rango" w="w-20"><input type="number" value={w.rango ?? 0} onChange={e => upd('rango', +e.target.value)} /></F>
            <F label="Recarga" w="w-20"><input type="number" value={w.recarga ?? 0} onChange={e => upd('recarga', +e.target.value)} /></F>
          </div>
        )}
      </div>
    </div>
  )
}

const ListPanel = ({ title, listKey, char, set, fields }) => {
  const list = char[listKey] || []
  const addRow = () => {
    const template = {}
    fields.forEach(f => { template[f.key] = '' })
    set(listKey, [...list, template])
  }
  const removeRow = (i) => set(listKey, list.filter((_, idx) => idx !== i))
  const upd = (i, field, val) => {
    const next = [...list]
    next[i] = { ...next[i], [field]: val }
    set(listKey, next)
  }
  return (
    <div className="panel">
      <div className="panel-title flex items-center justify-between">
        <span>{title}</span>
        <button className="add-row-btn" onClick={addRow}>+ Añadir</button>
      </div>
      {list.length > 0 && (
        <table className="w-full text-xs">
          <thead>
            <tr>
              {fields.map(f => <th key={f.key} className="table-header text-left">{f.label}</th>)}
              <th className="table-header w-6"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((row, i) => (
              <tr key={i}>
                {fields.map(f => (
                  <td key={f.key} className="table-cell">
                    <input value={row[f.key] || ''} onChange={e => upd(i, f.key, e.target.value)} />
                  </td>
                ))}
                <td className="table-cell text-center">
                  <button className="text-[#4a3520] hover:text-red-500" onClick={() => removeRow(i)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default function CombateTab({ char }) {
  const updateField = useCharacterStore(s => s.updateField)
  const set = (path, val) => updateField(char.id, path, val)

  const mod = char.modificadoresCombate || {}
  const totalMod = (parseInt(mod.penDolor) || 0) + (parseInt(mod.penCansancio) || 0) + (parseInt(mod.penFisico) || 0) + (parseInt(mod.bonoEsp1) || 0) + (parseInt(mod.bonoEsp2) || 0)

  const addArmadura = () => {
    const list = [...(char.armaduras || [])]
    list.push({ nombre: '', localizacion: '', calidad: 0, FIL: 0, CON: 0, PEN: 0, CAL: 0, ELE: 0, FRI: 0, ENE: 0, ent: 0, pres: 0, rMov: 0 })
    set('armaduras', list)
  }
  const removeArmadura = (i) => set('armaduras', (char.armaduras || []).filter((_, idx) => idx !== i))
  const updArmadura = (i, field, val) => {
    const list = [...(char.armaduras || [])]
    list[i] = { ...list[i], [field]: val }
    set('armaduras', list)
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* ── Armaduras ── */}
      <div className="panel">
        <div className="panel-title flex items-center justify-between">
          <span>Armaduras</span>
          <button className="add-row-btn" onClick={addArmadura}>+ Añadir armadura</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="table-header text-left w-32">Nombre</th>
                <th className="table-header">Localización</th>
                <th className="table-header">Cal.</th>
                <th className="table-header">FIL</th>
                <th className="table-header">CON</th>
                <th className="table-header">PEN</th>
                <th className="table-header">CAL</th>
                <th className="table-header">ELE</th>
                <th className="table-header">FRI</th>
                <th className="table-header">ENE</th>
                <th className="table-header">Ent.</th>
                <th className="table-header">Pres.</th>
                <th className="table-header">R.Mov</th>
                <th className="table-header w-6"></th>
              </tr>
            </thead>
            <tbody>
              {(char.armaduras || []).map((a, i) => (
                <tr key={i}>
                  <td className="table-cell"><input value={a.nombre || ''} onChange={e => updArmadura(i, 'nombre', e.target.value)} /></td>
                  <td className="table-cell"><input value={a.localizacion || ''} onChange={e => updArmadura(i, 'localizacion', e.target.value)} /></td>
                  {['calidad','FIL','CON','PEN','CAL','ELE','FRI','ENE','ent','pres','rMov'].map(f => (
                    <td key={f} className="table-cell">
                      <input type="number" className="w-10 text-center" value={a[f] ?? 0} onChange={e => updArmadura(i, f, +e.target.value)} />
                    </td>
                  ))}
                  <td className="table-cell text-center">
                    <button className="text-[#4a3520] hover:text-red-500" onClick={() => removeArmadura(i)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-2 flex gap-3 flex-wrap">
          <F label="Rest. Movimiento" w="w-32"><input type="number" value={char.restriccionMovimiento ?? 0} onChange={e => set('restriccionMovimiento', +e.target.value)} /></F>
          <F label="Requisito" w="w-24"><input type="number" value={char.requisito ?? 0} onChange={e => set('requisito', +e.target.value)} /></F>
          <F label="Req. Natural" w="w-24"><input type="number" value={char.requisitoNatural ?? 0} onChange={e => set('requisitoNatural', +e.target.value)} /></F>
          <F label="Pen. General" w="w-24"><input type="number" value={char.penGeneral ?? 0} onChange={e => set('penGeneral', +e.target.value)} /></F>
          <F label="Pen. Natural" w="w-24"><input type="number" value={char.penNaturalArmadura ?? 0} onChange={e => set('penNaturalArmadura', +e.target.value)} /></F>
        </div>
      </div>

      {/* ── Modificadores + Tabla Daños ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="panel">
          <div className="panel-title">Modificadores de Combate</div>
          <div className="p-2 flex flex-col gap-1">
            {[
              ['penDolor', 'Pen. por Dolor'],
              ['penCansancio', 'Pen. Cansancio'],
              ['penFisico', 'Penalizador Físico'],
              ['bonoEsp1', 'Bono Especial 1'],
              ['bonoEsp2', 'Bono Especial 2'],
            ].map(([k, label]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="field-label flex-1">{label}</span>
                <input type="number" className="w-16 text-center" value={mod[k] ?? 0} onChange={e => set(`modificadoresCombate.${k}`, +e.target.value)} />
              </div>
            ))}
            <div className="flex items-center justify-between mt-1 border-t border-[#4a3520] pt-1">
              <span className="text-[#c9a84c] font-bold text-xs">Total</span>
              <span className={`font-bold text-sm ${totalMod >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalMod >= 0 ? '+' : ''}{totalMod}</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Tabla de Daños (%)</div>
          <div className="overflow-y-auto max-h-64">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="table-header">%</th>
                  <th className="table-header">Corte</th>
                  <th className="table-header">Imp.</th>
                  <th className="table-header">Pen.</th>
                  <th className="table-header">Cal.</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 40 }, (_, i) => (i + 1) * 10).map(pct => {
                  const row = char.tablaDanos?.[pct] || { corte: 0, imp: 0, pen: 0, cal: 0 }
                  return (
                    <tr key={pct}>
                      <td className="table-cell text-[#c9a84c] text-center font-bold">{pct}</td>
                      {['corte', 'imp', 'pen', 'cal'].map(t => (
                        <td key={t} className="table-cell">
                          <input type="number" className="w-full text-center" value={row[t] ?? 0}
                            onChange={e => {
                              const td = { ...(char.tablaDanos || {}) }
                              td[pct] = { ...(td[pct] || {}), [t]: +e.target.value }
                              set('tablaDanos', td)
                            }} />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Armas ── */}
      <div className="grid grid-cols-2 gap-3">
        <WeaponBlock title="Sin Armas / Desarmado" wKey="sinArmas" char={char} set={set} />
        <WeaponBlock title="Arma Principal" wKey="arma1" char={char} set={set} />
        <WeaponBlock title="Arma Adicional 1" wKey="adicional1" char={char} set={set} />
        <WeaponBlock title="Arma Principal 2" wKey="arma2" char={char} set={set} />
        <WeaponBlock title="Arma Adicional 2" wKey="adicional2" char={char} set={set} />
        <WeaponBlock title="A 2 Manos" wKey="dosManos" char={char} set={set} />
        <WeaponBlock title="Arma de Disparo" wKey="disparo" char={char} set={set} />
      </div>

      {/* ── Tablas y Capacidades ── */}
      <div className="grid grid-cols-2 gap-3">
        <ListPanel title="Tablas de Armas" listKey="tablasArmas" char={char} set={set}
          fields={[{ key: 'nombre', label: 'Nombre' }, { key: 'descripcion', label: 'Descripción' }]} />
        <ListPanel title="Tablas de Estilos" listKey="tablasEstilos" char={char} set={set}
          fields={[{ key: 'nombre', label: 'Nombre' }, { key: 'descripcion', label: 'Descripción' }]} />
        <ListPanel title="Artes Marciales" listKey="artesMarciales" char={char} set={set}
          fields={[{ key: 'nombre', label: 'Nombre' }, { key: 'descripcion', label: 'Descripción' }]} />
        <ListPanel title="Ars Magnus" listKey="arsMagnus" char={char} set={set}
          fields={[{ key: 'nombre', label: 'Nombre' }, { key: 'descripcion', label: 'Descripción' }]} />
      </div>

      <ListPanel title="Capacidades de Combate" listKey="capacidadesCombate" char={char} set={set}
        fields={[{ key: 'nombre', label: 'Nombre' }, { key: 'descripcion', label: 'Descripción' }]} />
    </div>
  )
}
