import React from 'react'
import useCharacterStore from './store/useCharacterStore'
import CharacterList from './components/CharacterList'
import CharacterSheet from './components/CharacterSheet'

export default function App() {
  const { activeId, setActiveCharacter, getActive } = useCharacterStore()
  const activeChar = getActive()

  const handleSelect = (id) => setActiveCharacter(id)
  const handleBack = () => setActiveCharacter(null)

  if (activeId && activeChar) {
    return <CharacterSheet char={activeChar} onBack={handleBack} />
  }

  return <CharacterList onSelect={handleSelect} />
}
