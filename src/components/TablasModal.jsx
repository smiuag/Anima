import React, { useState } from 'react'
import {
  BONO_CARACTERISTICA, PV_BASE_CON, ACT_BASE_POD, TAMANOS,
  ACCIONES_TURNO, ACU_KI_TABLE, CATEGORIAS_DATA, RAZAS_DATA,
  HABILIDADES_SECUNDARIAS, HAB_SEC_PLUS_KEYS
} from '../data/tables'

const Section = ({ title, children }) => (
  <div className="mb-6">
    <div className="panel-title mb-2">{title}</div>
    {children}
  </div>
)

const exportCSV = (rows, filename) => {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export default function TablasModal({ onClose }) {
  const [seccion, setSeccion] = useState('bono')

  // BONO_CARACTERISTICA: objeto {1:..., 20:...}
  const bonoRows = Array.from({ length: 20 }, (_, i) => i + 1).map(v => [v, BONO_CARACTERISTICA[v] ?? '?'])

  // PV_BASE_CON
  const pvRows = Array.from({ length: 20 }, (_, i) => i + 1).map(v => [v, PV_BASE_CON[v] ?? '?'])

  // ACT_BASE_POD
  const actRows = Array.from({ length: 20 }, (_, i) => i + 1).map(v => [v, ACT_BASE_POD[v] ?? '?'])

  // ACU_KI_TABLE
  const acuRows = Array.from({ length: 20 }, (_, i) => i + 1).map(v => [v, ACU_KI_TABLE[v] ?? '?'])

  // TAMANOS
  const tamanoRows = TAMANOS.map(t => [t.nombre, `${t.min}–${t.max}`, t.turnoBase])

  // ACCIONES_TURNO: generar para sumas 2–40
  const accionesRows = []
  let prev = null
  for (let s = 2; s <= 40; s++) {
    const acc = ACCIONES_TURNO(s)
    if (acc !== prev) { accionesRows.push([s, acc]); prev = acc }
  }

  // CATEGORIAS_DATA: columnas clave
  const catKeys = ['PlusHA','PlusHE','PlusHP','PlusLL_Armor','PlusTurno','PlusPV','PlusCM','PlusZeon','ACT','PlusCV',
    'Limite Combate','Limite Magia','Limite Psi','CosteHA','CosteHE','CosteHP','CosteLL','CosteZeon','CosteAcuKi']
  const catRows = Object.entries(CATEGORIAS_DATA).map(([cat, d]) => [
    cat, ...catKeys.map(k => d[k] ?? '—')
  ])

  // RAZAS_DATA
  const razaStatKeys = ['AGI','CON','DES','FUE','INT','PER','POD','VOL','RF','RE','RV','RM','RP','Tamano']
  const razaRows = Object.entries(RAZAS_DATA).map(([raza, d]) => [
    raza, ...razaStatKeys.map(k => d[k] !== undefined && d[k] !== 0 ? d[k] : '—')
  ])

  // HABILIDADES_SECUNDARIAS
  const habRows = Object.entries(HABILIDADES_SECUNDARIAS).flatMap(([cat, habs]) =>
    Object.entries(habs).map(([hab, pen]) => [cat, hab, pen ?? 'libre', HAB_SEC_PLUS_KEYS[hab] || '—'])
  )

  const SECCIONES = [
    { id: 'bono',      label: 'Bono Caract.' },
    { id: 'pv',        label: 'PV/Zeón base' },
    { id: 'act',       label: 'ACT base (POD)' },
    { id: 'acu',       label: 'Acu. Ki' },
    { id: 'tamanos',   label: 'Tamaños' },
    { id: 'acciones',  label: 'Acc/Turno' },
    { id: 'categorias',label: 'Categorías' },
    { id: 'razas',     label: 'Razas' },
    { id: 'habs',      label: 'Hab. Secundarias' },
  ]

  const renderTable = (headers, rows, csvName) => (
    <div>
      <div className="flex justify-end mb-1">
        <button className="btn-secondary text-xs py-0.5 px-2"
          onClick={() => exportCSV([headers, ...rows], csvName + '.csv')}>
          ↓ CSV
        </button>
      </div>
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>{headers.map((h, i) => (
              <th key={i} className="table-header text-left px-2 py-1 bg-[#162030] sticky top-0">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-[#1d2a3e]' : 'bg-[#162030]'}>
                {row.map((cell, j) => (
                  <td key={j} className="table-cell px-2 py-0.5">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (seccion) {
      case 'bono':
        return renderTable(['Stat', 'Bono'], bonoRows, 'bono_caracteristica')
      case 'pv':
        return (
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-xs text-[#7fa8cc] mb-1">PV base por CON</div>
              {renderTable(['CON', 'PV base'], pvRows, 'pv_base_con')}
            </div>
            <div className="text-xs text-[#3a5070] self-center px-2">
              Nota DUDAS:<br/>¿misma tabla para Zeón<br/>(indexada por POD)?
            </div>
          </div>
        )
      case 'act':
        return renderTable(['POD', 'ACT base (Zeón/turno)'], actRows, 'act_base_pod')
      case 'acu':
        return renderTable(['Stat', 'Acu. Ki base'], acuRows, 'acu_ki_table')
      case 'tamanos':
        return renderTable(['Nombre', 'Suma FUE+CON', 'Turno base'], tamanoRows, 'tamanos')
      case 'acciones':
        return (
          <>
            <div className="text-xs text-[#7fa8cc] mb-1">Muestra el corte donde cambia el valor (DUDAS: verificar tabla 37 Excel)</div>
            {renderTable(['DES+AGI (desde)', 'Acciones/turno'], accionesRows, 'acciones_turno')}
          </>
        )
      case 'categorias':
        return (
          <>
            <div className="text-xs text-[#7fa8cc] mb-1">
              20 categorías oficiales según Excel. Dropdown sincronizado con CATEGORIAS_DATA.
            </div>
            {renderTable(['Categoría', ...catKeys], catRows, 'categorias_data')}
          </>
        )
      case 'razas':
        return renderTable(['Raza', ...razaStatKeys], razaRows, 'razas_data')
      case 'habs':
        return renderTable(['Grupo', 'Habilidad', 'Pen. Natural', 'Clave Cat.'], habRows, 'habilidades_secundarias')
      default: return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#1d2a3e] border border-[#3a5070] rounded w-[90vw] max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#3a5070]">
          <span className="text-[#f5b832] font-bold">Tablas de Verificación</span>
          <button className="text-[#7fa8cc] hover:text-[#f5b832] text-lg" onClick={onClose}>✕</button>
        </div>
        {/* Sub-nav */}
        <div className="flex overflow-x-auto border-b border-[#3a5070] bg-[#162030]">
          {SECCIONES.map(s => (
            <button key={s.id}
              className={`px-3 py-1.5 text-xs whitespace-nowrap ${seccion === s.id ? 'text-[#f5b832] border-b-2 border-[#f5b832]' : 'text-[#7fa8cc] hover:text-[#f5b832]'}`}
              onClick={() => setSeccion(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
