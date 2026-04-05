// Bridge store: tab components call useCharacterStore(s => s.updateField)
// updateField routes to useAppStore to update the active character in Supabase
import { create } from 'zustand'
import useAppStore from './useAppStore'

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

const useCharacterStore = create((set, get) => ({
  // saveTimer for debounce
  _saveTimer: null,

  updateField: (_id, path, value) => {
    const appStore = useAppStore.getState()
    const current = appStore.activePersonajeDatos
    if (!current) return

    const updated = deepSet(JSON.parse(JSON.stringify(current)), path, value)
    appStore.updatePersonajeDatos(updated)

    // Debounced auto-save 3 seconds after last change
    const { _saveTimer } = get()
    if (_saveTimer) clearTimeout(_saveTimer)
    const timer = setTimeout(() => {
      useAppStore.getState().savePersonaje()
    }, 3000)
    set({ _saveTimer: timer })
  },
}))

export default useCharacterStore
