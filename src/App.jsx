import React from 'react'
import useAppStore from './store/useAppStore'
import PartidaList from './components/PartidaList'
import PartidaDetail from './components/PartidaDetail'
import CharacterSheet from './components/CharacterSheet'

export default function App() {
  const view = useAppStore(s => s.view)

  if (view === 'personaje') return <CharacterSheet />
  if (view === 'partida')   return <PartidaDetail />
  return <PartidaList />
}
