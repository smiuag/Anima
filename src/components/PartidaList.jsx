import React, { useEffect, useState } from 'react'
import useAppStore from '../store/useAppStore'
import PinModal from './PinModal'

export default function PartidaList() {
  const { partidas, loading, error, loadPartidas, createPartida, deletePartida, openPartida } = useAppStore()
  const [showCreate, setShowCreate] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [newPublica, setNewPublica] = useState(true)
  const [creating, setCreating] = useState(false)
  const [createdPin, setCreatedPin] = useState(null) // { nombre, pin }
  const [pinModal, setPinModal] = useState(null)     // { partida }
  const [pinError, setPinError] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { loadPartidas() }, [])

  const handleCreate = async () => {
    if (!newNombre.trim()) return
    setCreating(true)
    const { partida, pin } = await createPartida({ nombre: newNombre.trim(), publica: newPublica })
    setCreating(false)
    setShowCreate(false)
    setNewNombre('')
    setNewPublica(true)
    if (!newPublica) setCreatedPin({ nombre: partida.nombre, pin })
  }

  const handleOpen = async (partida) => {
    if (partida.publica) {
      await openPartida(partida)
    } else {
      setPinModal({ partida })
      setPinError(false)
    }
  }

  const handlePinConfirm = async (pin) => {
    const ok = await openPartida(pinModal.partida, pin)
    if (!ok) { setPinError(true); return }
    setPinModal(null)
  }

  const formatDate = (iso) => iso
    ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—'

  return (
    <div className="min-h-screen bg-[#1a1410] flex flex-col">
      {/* Header */}
      <div className="bg-[#1e180f] border-b border-[#4a3520] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-[#c9a84c] text-2xl font-bold tracking-wider">⚔ ANIMA</h1>
          <p className="text-[#8a7560] text-xs mt-0.5">Gestor de Fichas — Partidas</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          + Nueva Partida
        </button>
      </div>

      {/* Modal crear partida */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="panel p-6 w-96 flex flex-col gap-4">
            <h2 className="text-[#c9a84c] font-bold text-lg">Nueva Partida</h2>
            <div className="flex flex-col gap-1">
              <label className="field-label">Nombre de la partida</label>
              <input autoFocus value={newNombre} onChange={e => setNewNombre(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="Ej: La Maldición de Gormuz" />
            </div>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center gap-2 p-3 rounded border cursor-pointer transition-colors ${newPublica ? 'border-[#c9a84c] bg-[#2a2018]' : 'border-[#4a3520]'}`}
                onClick={() => setNewPublica(true)}>
                <span className="text-xl">🌐</span>
                <div>
                  <div className="text-sm font-medium text-[#e8d5b0]">Pública</div>
                  <div className="text-xs text-[#8a7560]">Sin contraseña</div>
                </div>
              </label>
              <label className={`flex-1 flex items-center gap-2 p-3 rounded border cursor-pointer transition-colors ${!newPublica ? 'border-[#c9a84c] bg-[#2a2018]' : 'border-[#4a3520]'}`}
                onClick={() => setNewPublica(false)}>
                <span className="text-xl">🔒</span>
                <div>
                  <div className="text-sm font-medium text-[#e8d5b0]">Privada</div>
                  <div className="text-xs text-[#8a7560]">PIN de 4 dígitos</div>
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
            <h2 className="text-[#c9a84c] font-bold text-lg text-center">Partida creada</h2>
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
            <h2 className="text-red-400 font-bold text-lg">¿Eliminar partida?</h2>
            <p className="text-[#8a7560] text-sm">
              Se eliminarán también todos los personajes de <strong className="text-[#e8d5b0]">{confirmDelete.nombre}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-danger" onClick={async () => { await deletePartida(confirmDelete.id); setConfirmDelete(null) }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {pinModal && (
        <PinModal
          titulo={`Acceder a "${pinModal.partida.nombre}"`}
          onConfirm={handlePinConfirm}
          onCancel={() => { setPinModal(null); setPinError(false) }}
          error={pinError}
        />
      )}

      {/* Content */}
      <div className="flex-1 p-6">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#8a7560] text-sm">Cargando partidas...</div>
          </div>
        )}
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 rounded p-3 text-sm mb-4">
            Error al conectar con la base de datos: {error}
          </div>
        )}
        {!loading && partidas.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="text-6xl opacity-20">⚔</div>
            <p className="text-[#8a7560] text-center">
              No hay partidas todavía.<br />Crea la primera para empezar.
            </p>
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              + Crear primera partida
            </button>
          </div>
        )}
        {!loading && partidas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {partidas.map(p => (
              <div key={p.id}
                className="panel hover:border-[#c9a84c] transition-colors cursor-pointer group"
                onClick={() => handleOpen(p)}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[#e8d5b0] font-bold text-sm group-hover:text-[#c9a84c] transition-colors flex-1">
                      {p.nombre}
                    </h3>
                    <span className="text-lg ml-2">{p.publica ? '🌐' : '🔒'}</span>
                  </div>
                  <p className="text-[#4a3520] text-xs">{formatDate(p.creado_en)}</p>
                  <p className="text-[#8a7560] text-xs mt-1">
                    {p.publica ? 'Acceso libre' : 'Acceso con PIN'}
                  </p>
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

      <div className="border-t border-[#2a2018] px-6 py-2 text-center text-[#4a3520] text-xs">
        Anima: Beyond Fantasy · {partidas.length} partida{partidas.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
