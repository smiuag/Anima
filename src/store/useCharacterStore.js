import { create } from 'zustand'
import { createDefaultCharacter } from '../data/defaultCharacter'

const STORAGE_KEY = 'anima_fichas_v1'

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { characters: [], activeId: null }
}

const save = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      characters: state.characters,
      activeId: state.activeId
    }))
  } catch {}
}

const useCharacterStore = create((set, get) => ({
  ...load(),

  // ── Selectors ──────────────────────────────────────────────────────────────
  getActive: () => {
    const { characters, activeId } = get()
    return characters.find(c => c.id === activeId) || null
  },

  // ── Actions ────────────────────────────────────────────────────────────────
  createCharacter: (name = 'Nuevo Personaje') => {
    const char = createDefaultCharacter()
    char.nombre = name
    set(state => {
      const next = { characters: [...state.characters, char], activeId: char.id }
      save(next)
      return next
    })
    return char.id
  },

  deleteCharacter: (id) => {
    set(state => {
      const characters = state.characters.filter(c => c.id !== id)
      const activeId = state.activeId === id
        ? (characters[0]?.id || null)
        : state.activeId
      const next = { characters, activeId }
      save(next)
      return next
    })
  },

  setActiveCharacter: (id) => {
    set(state => {
      const next = { ...state, activeId: id }
      save(next)
      return next
    })
  },

  updateCharacter: (id, updates) => {
    set(state => {
      const characters = state.characters.map(c =>
        c.id === id
          ? { ...c, ...updates, meta: { ...c.meta, updatedAt: new Date().toISOString() } }
          : c
      )
      const next = { ...state, characters }
      save(next)
      return next
    })
  },

  // Deep update: updateField(id, 'caracteristicas.AGI.base', 12)
  updateField: (id, path, value) => {
    set(state => {
      const char = state.characters.find(c => c.id === id)
      if (!char) return state
      const updated = deepSet({ ...char }, path, value)
      updated.meta = { ...updated.meta, updatedAt: new Date().toISOString() }
      const characters = state.characters.map(c => c.id === id ? updated : c)
      const next = { ...state, characters }
      save(next)
      return next
    })
  },

  duplicateCharacter: (id) => {
    const char = get().characters.find(c => c.id === id)
    if (!char) return
    const dup = { ...JSON.parse(JSON.stringify(char)), id: crypto.randomUUID(), nombre: char.nombre + ' (copia)' }
    dup.meta = { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    set(state => {
      const next = { characters: [...state.characters, dup], activeId: dup.id }
      save(next)
      return next
    })
  },

  exportCharacter: (id) => {
    const char = get().characters.find(c => c.id === id)
    if (!char) return
    const blob = new Blob([JSON.stringify(char, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${char.nombre || 'personaje'}.json`
    a.click()
    URL.revokeObjectURL(url)
  },

  importCharacter: (json) => {
    try {
      const char = JSON.parse(json)
      char.id = crypto.randomUUID() // always new id on import
      char.meta = { ...char.meta, updatedAt: new Date().toISOString() }
      set(state => {
        const next = { characters: [...state.characters, char], activeId: char.id }
        save(next)
        return next
      })
      return true
    } catch {
      return false
    }
  },

  exportAll: () => {
    const { characters } = get()
    const blob = new Blob([JSON.stringify(characters, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'anima_fichas_backup.json'
    a.click()
    URL.revokeObjectURL(url)
  },
}))

function deepSet(obj, path, value) {
  const parts = path.split('.')
  const last = parts.pop()
  let cur = obj
  for (const p of parts) {
    if (cur[p] === undefined || cur[p] === null) cur[p] = {}
    else cur[p] = Array.isArray(cur[p]) ? [...cur[p]] : { ...cur[p] }
    cur = cur[p]
  }
  cur[last] = value
  return obj
}

export default useCharacterStore
