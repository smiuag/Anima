import React, { useState } from 'react'
import useAppStore, { generatePin } from '../store/useAppStore'
import PinModal from './PinModal'

export default function PartidaDetail() {
  const { activePartida, personajes, loading, backToPartidas, createPersonaje, deletePersonaje, openPersonaje } = useAppStore()
  const [showCreate, setShowCreate] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [newPublica, setNewPublica] = useState(true)
  const [creating, setCreating] = useState(false)
  const [createdPin, setCreatedPin] = useState(null)
  const [pinModal, setPinModal] = useState(null)
  const [pinError, setPinError] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleCreate = async () => {
    if (!newNombre.trim()) return
    setCreating(true)
    const { personaje, pin } = await createPersonaje({ nombre: newNombre.trim(), publica: newPublica })
    setCreating(false)
    setShowCreate(false)
    setNewNombre('')
    setNewPublica(true)
    if (!newPublica) setCreatedPin({ nombre: personaje.nombre, pin })
  }

  const handleOpen = async (personaje) => {
    if (personaje.publica) {
      await openPersonaje(personaje)
    } else {
      setPinModal({ personaje })
      setPinError(false)
    }
  }

  const handlePinConfirm = async (pin) => {
    const ok = await openPersonaje(pinModal.personaje, pin)
    if (!ok) { setPinError(true); return }
    setPinModal(null)
  }

  const formatDate = (iso) => iso
    ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—'

  return (
    <div className="min-h-screen bg-[#1a1410] flex flex-col">
      {/* Header */}
      <div className="bg-[#1e180f] border-b border-[#4a3520] px-6 py-4 flex items-center gap-4">
        <button className="btn-secondary" onClick={backToPartidas}>← Partidas</button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[#c9a84c] font-bold">{activePartida?.nombre}</span>
          <span className="text-lg">{activePartida?.publica ? '🌐' : '🔒'}</span>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          + Nuevo Personaje
        </button>
      </div>

      {/* Modal crear personaje */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="panel p-6 w-96 flex flex-col gap-4">
            <h2 className="text-[#c9a84c] font-bold text-lg">Nuevo Personaje</h2>
            <div className="flex flex-col gap-1">
              <label className="field-label">Nombre del personaje</label>
              <input autoFocus value={newNombre} onChange={e => setNewNombre(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="Ej: Kael el Sombrío" />
            </div>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center gap-2 p-3 rounded border cursor-pointer transition-colors ${newPublica ? 'border-[#c9a84c] bg-[#2a2018]' : 'border-[#4a3520]'}`}
                onClick={() => setNewPublica(true)}>
                <span className="text-xl">🌐</span>
                <div>
                  <div className="text-sm font-medium text-[#e8d5b0]">Público</div>
                  <div className="text-xs text-[#8a7560]">Todos pueden ver la ficha</div>
                </div>
              </label>
              <label className={`flex-1 flex items-center gap-2 p-3 rounded border cursor-pointer transition-colors ${!newPublica ? 'border-[#c9a84c] bg-[#2a2018]' : 'border-[#4a3520]'}`}
                onClick={() => setNewPublica(false)}>
                <span className="text-xl">🔒</span>
                <div>
                  <div className="text-sm font-medium text-[#e8d5b0]">Privado</div>
                  <div className="text-xs text-[#8a7560]">Solo con PIN</div>
                </div>
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => { setShowCreate(false); setNewNombre('') }}>Cancelar</button>
              <button className="btn-primary" onClick={handleCreate} disabled={!newNombre.trim() || creating}>
                {creating ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal PIN creado */}
      {createdPin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="panel p-6 w-80 flex flex-col items-center gap-4">
            <div className="text-4xl">🔑</div>
            <h2 className="text-[#c9a84c] font-bold text-lg text-center">Personaje creado</h2>
            <p className="text-[#8a7560] text-sm text-center">
              El PIN para <strong className="text-[#e8d5b0]">{createdPin.nombre}</strong> es:
            </p>
            <div className="text-5xl font-bold tracking-[0.3em] text-[#c9a84c] bg-[#1a1410] px-6 py-3 rounded border border-[#4a3520]">
              {createdPin.pin}
            </div>
            <p className="text-[#8a7560] text-xs text-center">Guárdalo — no se puede recuperar</p>
            <button className="btn-primary w-full" onClick={() => setCreatedPin(null)}>Entendido</button>
          </div>
        </div>
      )}

      {/* Modal confirmar borrado */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="panel p-6 w-96 flex flex-col gap-4">
            <h2 className="text-red-400 font-bold text-lg">¿Eliminar personaje?</h2>
            <p className="text-[#8a7560] text-sm">
              Se eliminará <strong className="text-[#e8d5b0]">{confirmDelete.nombre}</strong> y toda su ficha. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-danger" onClick={async () => { await deletePersonaje(confirmDelete.id); setConfirmDelete(null) }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {pinModal && (
        <PinModal
          titulo={`Acceder a "${pinModal.personaje.nombre}"`}
          onConfirm={handlePinConfirm}
          onCancel={() => { setPinModal(null); setPinError(false) }}
          error={pinError}
        />
      )}

      {/* Lista personajes */}
      <div className="flex-1 p-6">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#8a7560] text-sm">Cargando personajes...</div>
          </div>
        )}
        {!loading && personajes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="text-5xl opacity-20">🧙</div>
            <p className="text-[#8a7560] text-center">
              No hay personajes en esta partida.<br />Crea el primero.
            </p>
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              + Crear personaje
            </button>
          </div>
        )}
        {!loading && personajes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {personajes.map(p => (
              <div key={p.id}
                className="panel hover:border-[#c9a84c] transition-colors cursor-pointer group"
                onClick={() => handleOpen(p)}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded bg-[#2a2018] border border-[#4a3520] flex items-center justify-center text-[#c9a84c] font-bold text-lg flex-shrink-0 mr-3">
                      {(p.nombre || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#e8d5b0] font-bold text-sm group-hover:text-[#c9a84c] transition-colors">
                        {p.nombre}
                      </h3>
                      <p className="text-[#8a7560] text-xs">
                        {p.categoria || 'Sin categoría'}
                        {p.nivel > 0 && ` · Nv. ${p.nivel}`}
                      </p>
                    </div>
                    <span className="text-sm ml-1">{p.publica ? '🌐' : '🔒'}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-[#4a3520]">{p.raza || 'Humano'}</span>
                    <span className="text-[#4a3520]">{formatDate(p.actualizado_en)}</span>
                  </div>
                </div>
                <div className="border-t border-[#2a2018] px-3 py-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => e.stopPropagation()}>
                  <button className="text-[#8a7560] hover:text-red-400 text-xs transition-colors"
                    onClick={() => setConfirmDelete(p)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
