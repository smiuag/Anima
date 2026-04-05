import React, { useState, useRef } from 'react'
import useCharacterStore from '../store/useCharacterStore'

export default function CharacterList({ onSelect }) {
  const { characters, createCharacter, deleteCharacter, duplicateCharacter, importCharacter, exportAll } = useCharacterStore()
  const [newName, setNewName] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const fileRef = useRef()

  const handleCreate = () => {
    if (!newName.trim()) return
    createCharacter(newName.trim())
    setNewName('')
    setShowCreate(false)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const ok = importCharacter(ev.target.result)
      if (!ok) alert('Error al importar: JSON inválido')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    try {
      return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch { return '—' }
  }

  return (
    <div className="min-h-screen bg-[#1a1410] flex flex-col">
      {/* Header */}
      <div className="bg-[#1e180f] border-b border-[#4a3520] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-[#c9a84c] text-2xl font-bold tracking-wider">⚔ ANIMA</h1>
          <p className="text-[#8a7560] text-xs mt-0.5">Gestor de Fichas de Personaje</p>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button className="btn-secondary" onClick={() => fileRef.current?.click()}>
            Importar JSON
          </button>
          {characters.length > 0 && (
            <button className="btn-secondary" onClick={exportAll}>
              Exportar todo
            </button>
          )}
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            + Nuevo Personaje
          </button>
        </div>
      </div>

      {/* Modal crear personaje */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="panel p-6 w-96">
            <h2 className="text-[#c9a84c] font-bold text-lg mb-4">Nuevo Personaje</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="field-label block mb-1">Nombre del personaje</label>
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder="Ej: Kael el Sombrío"
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button className="btn-secondary" onClick={() => { setShowCreate(false); setNewName('') }}>
                  Cancelar
                </button>
                <button className="btn-primary" onClick={handleCreate} disabled={!newName.trim()}>
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar borrado */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="panel p-6 w-96">
            <h2 className="text-red-400 font-bold text-lg mb-2">¿Eliminar personaje?</h2>
            <p className="text-[#8a7560] text-sm mb-4">
              Esta acción no se puede deshacer. ¿Seguro que quieres eliminar a <strong className="text-[#e8d5b0]">{confirmDelete.nombre || 'este personaje'}</strong>?
            </p>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-danger" onClick={() => { deleteCharacter(confirmDelete.id); setConfirmDelete(null) }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de personajes */}
      <div className="flex-1 p-6">
        {characters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="text-6xl opacity-20">⚔</div>
            <p className="text-[#8a7560] text-center">
              No hay personajes todavía.<br />
              Crea uno nuevo o importa una ficha en JSON.
            </p>
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              + Crear primer personaje
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {characters.map(char => (
              <div key={char.id} className="panel hover:border-[#c9a84c] transition-colors cursor-pointer group"
                onClick={() => onSelect(char.id)}>
                <div className="p-4">
                  {/* Avatar / iniciales */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded bg-[#2a2018] border border-[#4a3520] flex items-center justify-center text-[#c9a84c] font-bold text-lg flex-shrink-0">
                      {(char.nombre || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#e8d5b0] font-bold text-sm truncate group-hover:text-[#c9a84c] transition-colors">
                        {char.nombre || 'Sin nombre'}
                      </h3>
                      <p className="text-[#8a7560] text-xs truncate">
                        {char.categoria || 'Sin categoría'}
                        {char.nivel > 0 && ` · Nv. ${char.nivel}`}
                      </p>
                      {char.raza && (
                        <p className="text-[#4a3520] text-xs">{char.raza}</p>
                      )}
                    </div>
                  </div>

                  {/* Stats rápidos */}
                  <div className="grid grid-cols-4 gap-1 mb-3">
                    {['AGI', 'CON', 'FUE', 'VOL'].map(stat => {
                      const val = char.caracteristicas?.[stat]?.base || 10
                      return (
                        <div key={stat} className="text-center">
                          <div className="text-[#4a3520] text-xs">{stat}</div>
                          <div className="text-[#c9a84c] font-bold text-sm">{val}</div>
                        </div>
                      )
                    })}
                  </div>

                  {/* PV y Fecha */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8a7560]">
                      PV: <span className="text-[#e8d5b0]">{char.puntosVida?.total || 20}</span>
                    </span>
                    <span className="text-[#4a3520]">
                      {formatDate(char.meta?.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="border-t border-[#2a2018] px-3 py-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => e.stopPropagation()}>
                  <button className="text-[#8a7560] hover:text-[#c9a84c] text-xs transition-colors"
                    onClick={() => duplicateCharacter(char.id)}>
                    Duplicar
                  </button>
                  <button className="text-[#8a7560] hover:text-red-400 text-xs transition-colors"
                    onClick={() => setConfirmDelete(char)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#2a2018] px-6 py-2 text-center text-[#4a3520] text-xs">
        Anima: Beyond Fantasy · Fichas guardadas localmente · {characters.length} personaje{characters.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
