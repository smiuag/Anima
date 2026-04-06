import React, { useState } from 'react'

export default function CollapsiblePanel({ title, defaultOpen = true, actions, children, className = '' }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`panel ${className}`}>
      <div
        className="panel-title flex items-center justify-between cursor-pointer select-none"
        onClick={() => setOpen(o => !o)}
      >
        <span>{title}</span>
        <div className="flex items-center gap-2">
          {actions && <span onClick={e => e.stopPropagation()}>{actions}</span>}
          <span className="text-[#5580a0] text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </div>
      {open && children}
    </div>
  )
}
