import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Archive, ArchiveRestore, Pin, Tag, Trash2, X } from 'lucide-react'
import ColorPicker, { ColorPickerTrigger } from './ColorPicker'
import { colorFor, isLightBackground } from '../utils/colors'

/**
 * Full-screen-scrim modal for editing an existing note. Local `draft` state
 * lets typing feel instant; changes commit to the note list on close
 * (backdrop click, Escape, or the Close button) — the same auto-save
 * contract as CreateNote.
 */
export default function EditNoteModal({ note, onSave, onDelete, onArchive, onClose, isDark }) {
  const [draft, setDraft] = useState(note)
  const [showColors, setShowColors] = useState(false)
  const [labelInput, setLabelInput] = useState('')
  const panelRef = useRef(null)

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  function handleClose() {
    onSave({ ...draft, updatedAt: Date.now() })
    onClose()
  }

  function addLabel() {
    const v = labelInput.trim()
    if (v && !draft.labels.includes(v)) setDraft((d) => ({ ...d, labels: [...d.labels, v] }))
    setLabelInput('')
  }

  const bg = colorFor(draft.color, isDark)
  const light = isDark ? false : isLightBackground(draft.color)
  const textColor = light ? '#202124' : '#e8eaed'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (!panelRef.current?.contains(e.target)) handleClose()
      }}
    >
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-xl border border-black/10 dark:border-white/15 shadow-2xl overflow-hidden"
        style={{ backgroundColor: bg, color: textColor }}
      >
        <div className="flex items-start justify-between px-5 pt-4">
          <input
            autoFocus
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Title"
            className="w-full bg-transparent outline-none font-medium text-lg placeholder:opacity-50"
          />
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, isPinned: !d.isPinned }))}
            title={draft.isPinned ? 'Unpin note' : 'Pin note'}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
          >
            <Pin size={18} className={draft.isPinned ? 'fill-current' : ''} />
          </button>
        </div>

        <textarea
          value={draft.content}
          onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
          placeholder="Take a note..."
          className="thin-scroll flex-1 min-h-[10rem] bg-transparent outline-none resize-none placeholder:opacity-50 text-sm px-5 py-3"
        />

        {draft.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-5 mb-1">
            {draft.labels.map((label) => (
              <span key={label} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                {label}
                <button type="button" onClick={() => setDraft((d) => ({ ...d, labels: d.labels.filter((l) => l !== label) }))}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 px-4 mb-1">
          <Tag size={16} className="opacity-60 ml-1" />
          <input
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addLabel()
              }
            }}
            onBlur={addLabel}
            placeholder="Add label, press Enter"
            className="flex-1 bg-transparent outline-none text-xs placeholder:opacity-50 py-1.5"
          />
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t border-black/10 dark:border-white/10 relative">
          <div className="flex items-center gap-0.5">
            <ColorPickerTrigger onClick={() => setShowColors((s) => !s)} />
            <AnimatePresence>
              {showColors && (
                <ColorPicker value={draft.color} onChange={(color) => setDraft((d) => ({ ...d, color }))} onClose={() => setShowColors(false)} />
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => {
                onArchive(draft)
                onClose()
              }}
              title={draft.isArchived ? 'Unarchive' : 'Archive'}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            >
              {draft.isArchived ? <ArchiveRestore size={18} /> : <Archive size={18} />}
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(draft.id)
                onClose()
              }}
              title="Delete note"
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <button type="button" onClick={handleClose} className="px-4 py-1.5 text-sm font-medium rounded hover:bg-black/5 dark:hover:bg-white/10">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
