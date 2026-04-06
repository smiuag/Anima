import React, { useState } from 'react'
import useAppStore from '../store/useAppStore'
import { exportarFichaPDF } from '../services/pdfExport'
import TablasModal from './TablasModal'
import CharacterSummary from './CharacterSummary'
import GeneralTab from './tabs/GeneralTab'
import PrincipalTab from './tabs/PrincipalTab'
import CombateTab from './tabs/CombateTab'
import KiTab from './tabs/KiTab'
import MisticosTab from './tabs/MisticosTab'
import PsiquicosTab from './tabs/PsiquicosTab'
import PDsTab from './tabs/PDsTab'
import PersonalizacionTab from './tabs/PersonalizacionTab'

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'principal', label: 'Principal' },
  { id: 'combate', label: 'Combate' },
  { id: 'ki', label: 'Ki' },
  { id: 'misticos', label: 'Místicos' },
  { id: 'psiquicos', label: 'Psíquicos' },
  { id: 'pds', label: 'PDs' },
  { id: 'personalizacion', label: 'Personalización' },
]

export default function CharacterSheet() {
  const { activePersonajeDatos, backToPartida, savePersonaje, saveStatus } = useAppStore()
  const [activeTab, setActiveTab] = useState('general')
  const [exporting, setExporting] = useState(false)
  const [showTablas, setShowTablas] = useState(false)
  const [modoLectura, setModoLectura] = useState(false)

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      await exportarFichaPDF(activePersonajeDatos)
    } finally {
      setExporting(false)
    }
  }

  if (!activePersonajeDatos) return null

  // Tab components use useCharacterStore(s => s.updateField) which bridges to useAppStore
  // We pass char as the current datos — id is a dummy since updateField ignores it
  const char = { ...activePersonajeDatos, id: '__cloud__' }

  const renderTab = () => {
    switch (activeTab) {
      case 'general':        return <GeneralTab char={char} />
      case 'principal':      return <PrincipalTab char={char} />
      case 'combate':        return <CombateTab char={char} />
      case 'ki':             return <KiTab char={char} />
      case 'misticos':       return <MisticosTab char={char} />
      case 'psiquicos':      return <PsiquicosTab char={char} />
      case 'pds':            return <PDsTab char={char} />
      case 'personalizacion':return <PersonalizacionTab char={char} />
      default: return null
    }
  }

  const saveLabel = saveStatus === 'saving' ? '💾 Guardando...'
    : saveStatus === 'saved'   ? '✓ Guardado'
    : saveStatus === 'error'   ? '✗ Error'
    : null

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-[#162030] border-b border-[#3a5070] px-3 py-2 flex items-center gap-2 no-print">
        <button className="btn-secondary shrink-0" onClick={backToPartida}>←</button>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-[#f5b832] font-bold text-sm truncate">
            {char.nombre || 'Sin nombre'}
          </span>
          {char.categoria && <span className="text-[#7fa8cc] text-xs hidden sm:inline">{char.categoria}</span>}
          {char.nivel > 0  && <span className="text-[#7fa8cc] text-xs hidden sm:inline">Nv. {char.nivel}</span>}
          {char.raza && char.raza !== 'Humano' && <span className="text-[#7fa8cc] text-xs hidden sm:inline">· {char.raza}</span>}
        </div>
        {saveLabel && (
          <span className={`text-xs shrink-0 hidden sm:inline ${saveStatus === 'saved' ? 'text-green-400' : saveStatus === 'error' ? 'text-red-400' : 'text-[#7fa8cc]'}`}>
            {saveLabel}
          </span>
        )}
        <button className="btn-primary shrink-0" onClick={savePersonaje} title="Guardar">
          <span className="hidden sm:inline">💾 Guardar</span>
          <span className="sm:hidden">💾</span>
        </button>
        <button className="btn-secondary shrink-0" onClick={() => setShowTablas(true)} title="Tablas">
          <span className="hidden sm:inline">Tablas</span>
          <span className="sm:hidden">☰</span>
        </button>
        <button className="btn-secondary shrink-0 modo-lectura-toggle" onClick={() => setModoLectura(m => !m)}
          title={modoLectura ? 'Editar' : 'Solo lectura'}>
          <span className="hidden sm:inline">{modoLectura ? '✏️ Editar' : '👁 Lectura'}</span>
          <span className="sm:hidden">{modoLectura ? '✏️' : '👁'}</span>
        </button>
        <button className="btn-secondary shrink-0" onClick={handleExportPDF} disabled={exporting} title="PDF oficial">
          <span className="hidden sm:inline">{exporting ? 'Generando...' : '📄 PDF oficial'}</span>
          <span className="sm:hidden">📄</span>
        </button>
      </div>

      {/* Tabs — scrollable on desktop, select on mobile */}
      <div className="bg-[#1d2a3e] border-b border-[#3a5070] no-print">
        {/* Desktop */}
        <div className="hidden sm:flex overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id}
              className={activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
        {/* Mobile */}
        <div className="sm:hidden px-2 py-1">
          <select value={activeTab} onChange={e => setActiveTab(e.target.value)}
            className="w-full font-bold rounded px-2 py-1.5 text-sm">
            {TABS.map(tab => <option key={tab.id} value={tab.id}>{tab.label}</option>)}
          </select>
        </div>
      </div>

      {/* Summary bar */}
      <CharacterSummary char={char} />

      {/* Content */}
      <div className={`flex-1 overflow-y-auto${modoLectura ? ' modo-lectura' : ''}`}>
        {renderTab()}
      </div>

      {showTablas && <TablasModal onClose={() => setShowTablas(false)} />}
    </div>
  )
}
