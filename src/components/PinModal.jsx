import React, { useState, useRef, useEffect } from 'react'

export default function PinModal({ titulo, onConfirm, onCancel, error }) {
  const [pin, setPin] = useState(['', '', '', ''])
  const refs = [useRef(), useRef(), useRef(), useRef()]

  useEffect(() => { refs[0].current?.focus() }, [])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...pin]
    next[i] = val
    setPin(next)
    if (val && i < 3) refs[i + 1].current?.focus()
    if (next.every(d => d !== '') ) {
      // auto-submit when all 4 filled
      setTimeout(() => onConfirm(next.join('')), 50)
    }
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !pin[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
    if (e.key === 'Enter' && pin.every(d => d !== '')) {
      onConfirm(pin.join(''))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="panel p-6 w-80 flex flex-col items-center gap-4">
        <div className="text-4xl">🔒</div>
        <h2 className="text-[#f5b832] font-bold text-lg text-center">{titulo}</h2>
        <p className="text-[#7fa8cc] text-sm text-center">Introduce el PIN de 4 dígitos</p>

        <div className="flex gap-3 mt-1">
          {pin.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-2xl font-bold rounded border-2 border-[#3a5070] focus:border-[#f5b832] bg-[#1d2a3e] text-[#dce8f5]"
              style={{ border: '2px solid', borderColor: error ? '#8b1a1a' : undefined }}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm">PIN incorrecto</p>
        )}

        <div className="flex gap-2 w-full mt-1">
          <button className="btn-secondary flex-1" onClick={onCancel}>Cancelar</button>
          <button
            className="btn-primary flex-1"
            onClick={() => onConfirm(pin.join(''))}
            disabled={pin.some(d => d === '')}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}
