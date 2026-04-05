import { create } from 'zustand'
import {
  fetchPartidas, createPartida as apiCreatePartida, deletePartida as apiDeletePartida,
  verifyPartidaPin, fetchPersonajes, fetchPersonaje,
  createPersonaje as apiCreatePersonaje, savePersonaje as apiSavePersonaje,
  deletePersonaje as apiDeletePersonaje, verifyPersonajePin,
} from '../services/supabase'
import { createDefaultCharacter } from '../data/defaultCharacter'

export const generatePin = () => String(Math.floor(1000 + Math.random() * 9000))

const useAppStore = create((set, get) => ({
  // ── Navegación ──────────────────────────────────────────────────────────────
  view: 'partidas',           // 'partidas' | 'partida' | 'personaje'
  activePartida: null,        // { id, nombre, publica }
  activePersonaje: null,      // { id, nombre, ... }
  activePersonajeDatos: null, // full character datos

  // ── Datos ───────────────────────────────────────────────────────────────────
  partidas: [],
  personajes: [],

  // ── UI ──────────────────────────────────────────────────────────────────────
  loading: false,
  saving: false,
  error: null,
  saveStatus: null, // 'saving' | 'saved' | 'error'

  // ── Partidas ─────────────────────────────────────────────────────────────────
  loadPartidas: async () => {
    set({ loading: true, error: null })
    try {
      const partidas = await fetchPartidas()
      set({ partidas, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  createPartida: async ({ nombre, publica }) => {
    const pin = publica ? null : generatePin()
    const partida = await apiCreatePartida({ nombre, publica, pin })
    set(s => ({ partidas: [partida, ...s.partidas] }))
    return { partida, pin }
  },

  deletePartida: async (id) => {
    await apiDeletePartida(id)
    set(s => ({ partidas: s.partidas.filter(p => p.id !== id) }))
  },

  // ── Navegación a partida ──────────────────────────────────────────────────
  openPartida: async (partida, pin = null) => {
    if (!partida.publica) {
      const ok = await verifyPartidaPin(partida.id, pin)
      if (!ok) return false
    }
    set({ loading: true })
    const personajes = await fetchPersonajes(partida.id)
    set({ view: 'partida', activePartida: partida, personajes, loading: false })
    return true
  },

  backToPartidas: () => {
    set({ view: 'partidas', activePartida: null, personajes: [] })
  },

  // ── Personajes ────────────────────────────────────────────────────────────
  createPersonaje: async ({ nombre, publica }) => {
    const { activePartida } = get()
    const pin = publica ? null : generatePin()
    const datos = createDefaultCharacter()
    datos.nombre = nombre
    const personaje = await apiCreatePersonaje({
      partidaId: activePartida.id,
      nombre,
      publica,
      pin,
      datos,
    })
    set(s => ({ personajes: [personaje, ...s.personajes] }))
    return { personaje, pin }
  },

  deletePersonaje: async (id) => {
    await apiDeletePersonaje(id)
    set(s => ({ personajes: s.personajes.filter(p => p.id !== id) }))
  },

  // ── Navegación a personaje ────────────────────────────────────────────────
  openPersonaje: async (personaje, pin = null) => {
    if (!personaje.publica) {
      const ok = await verifyPersonajePin(personaje.id, pin)
      if (!ok) return false
    }
    set({ loading: true })
    const full = await fetchPersonaje(personaje.id)
    set({
      view: 'personaje',
      activePersonaje: full,
      activePersonajeDatos: full.datos,
      loading: false,
    })
    return true
  },

  backToPartida: () => {
    set({ view: 'partida', activePersonaje: null, activePersonajeDatos: null, saveStatus: null })
  },

  // ── Guardar personaje ─────────────────────────────────────────────────────
  updatePersonajeDatos: (datos) => {
    set({ activePersonajeDatos: datos })
  },

  savePersonaje: async () => {
    const { activePersonaje, activePersonajeDatos } = get()
    if (!activePersonaje || !activePersonajeDatos) return
    set({ saveStatus: 'saving' })
    try {
      await apiSavePersonaje(activePersonaje.id, activePersonajeDatos)
      // Update personajes list with new name/nivel
      set(s => ({
        saveStatus: 'saved',
        personajes: s.personajes.map(p =>
          p.id === activePersonaje.id
            ? { ...p, nombre: activePersonajeDatos.nombre || p.nombre, nivel: activePersonajeDatos.nivel || p.nivel, categoria: activePersonajeDatos.categoria || p.categoria }
            : p
        )
      }))
      setTimeout(() => set({ saveStatus: null }), 2000)
    } catch (e) {
      set({ saveStatus: 'error' })
    }
  },
}))

export default useAppStore
