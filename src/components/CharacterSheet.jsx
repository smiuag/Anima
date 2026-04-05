import React, { useState } from 'react'
import useCharacterStore from '../store/useCharacterStore'
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

export default function CharacterSheet({ char, onBack }) {
  const [activeTab, setActiveTab] = useState('general')
  const { exportCharacter } = useCharacterStore()

  const renderTab = () => {
    switch (activeTab) {
      case 'general': return <GeneralTab char={char} />
      case 'principal': return <PrincipalTab char={char} />
      case 'combate': return <CombateTab char={char} />
      case 'ki': return <KiTab char={char} />
      case 'misticos': return <MisticosTab char={char} />
      case 'psiquicos': return <PsiquicosTab char={char} />
      case 'pds': return <PDsTab char={char} />
      case 'personalizacion': return <PersonalizacionTab char={char} />
      default: return null
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-[#1e180f] border-b border-[#4a3520] px-3 py-2 flex items-center gap-3 no-print">
        <button className="btn-secondary" onClick={onBack}>← Personajes</button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[#c9a84c] font-bold text-sm">
            {char.nombre || 'Sin nombre'}
          </span>
          {char.categoria && (
            <span className="text-[#8a7560] text-xs">{char.categoria}</span>
          )}
          {char.nivel > 0 && (
            <span className="text-[#8a7560] text-xs">Nv. {char.nivel}</span>
          )}
          {char.raza && char.raza !== 'Humano' && (
            <span className="text-[#8a7560] text-xs">· {char.raza}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => exportCharacter(char.id)}>
            Exportar JSON
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            Imprimir
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-[#1a1410] border-b border-[#4a3520] flex overflow-x-auto no-print">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTab()}
      </div>
    </div>
  )
}
