import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Partidas ──────────────────────────────────────────────────────────────────

export const fetchPartidas = async () => {
  const { data, error } = await supabase
    .from('partidas')
    .select('id, nombre, publica, creado_en')
    .order('creado_en', { ascending: false })
  if (error) throw error
  return data
}

export const createPartida = async ({ nombre, publica, pin }) => {
  const { data, error } = await supabase
    .from('partidas')
    .insert({ nombre, publica, pin: pin || null })
    .select()
    .single()
  if (error) throw error
  return data
}

export const deletePartida = async (id) => {
  const { error } = await supabase.from('partidas').delete().eq('id', id)
  if (error) throw error
}

export const verifyPartidaPin = async (id, pin) => {
  const { data, error } = await supabase
    .from('partidas')
    .select('pin')
    .eq('id', id)
    .single()
  if (error) throw error
  return data.pin === null || data.pin === pin
}

// ── Personajes ────────────────────────────────────────────────────────────────

export const fetchPersonajes = async (partidaId) => {
  const { data, error } = await supabase
    .from('personajes')
    .select('id, nombre, categoria, nivel, raza, publica, actualizado_en')
    .eq('partida_id', partidaId)
    .order('actualizado_en', { ascending: false })
  if (error) throw error
  return data
}

export const fetchPersonaje = async (id) => {
  const { data, error } = await supabase
    .from('personajes')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export const createPersonaje = async ({ partidaId, nombre, publica, pin, datos }) => {
  const { data, error } = await supabase
    .from('personajes')
    .insert({
      partida_id: partidaId,
      nombre,
      publica,
      pin: pin || null,
      datos: datos || {},
      categoria: datos?.categoria || '',
      nivel: datos?.nivel || 0,
      raza: datos?.raza || 'Humano',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export const savePersonaje = async (id, datos) => {
  const { error } = await supabase
    .from('personajes')
    .update({
      datos,
      nombre: datos.nombre || '',
      categoria: datos.categoria || '',
      nivel: datos.nivel || 0,
      raza: datos.raza || 'Humano',
      actualizado_en: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) throw error
}

export const deletePersonaje = async (id) => {
  const { error } = await supabase.from('personajes').delete().eq('id', id)
  if (error) throw error
}

export const verifyPersonajePin = async (id, pin) => {
  const { data, error } = await supabase
    .from('personajes')
    .select('pin')
    .eq('id', id)
    .single()
  if (error) throw error
  return data.pin === null || data.pin === pin
}
