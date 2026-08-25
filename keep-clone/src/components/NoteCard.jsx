import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Archive, ArchiveRestore, Pin, Trash2 } from 'lucide-react'
import ColorPicker, { ColorPickerTrigger } from './ColorPicker'
import { colorFor, isLightBackground } from '../utils/colors'

export default function NoteCard({ note, onUpdate, onDelete, onArchive, onOpen, isDark }) {
  const [showColors, setShowColors] = useState(false)

  const bg = colorFor(note.color, isDark)
  const light = isDark ? false : isLightBackground(note.color)
  const textColor = light ? '#202124' : '#e8eaed'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="masonry-item group relative rounded-xl border border-black/10 dark:border-white/15 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      style={{ backgroundColor: bg, color: textColor }}
      onClick={() => onOpen(note)}
    >
      {/* Pin toggle: top-right, visible on hover or when already pinned */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onUpdate({ ...note, isPinned: !note.isPinned, updatedAt: Date.now() })
        }}
        title={note.isPinned ? 'Unpin note' : 'Pin note'}
        className={`absolute top-1.5 right-1.5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-opacity
          ${note.isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <Pin size={16} className={note.isPinned ? 'fill-current' : ''} />
      </button>

      <div className="px-4 pt-4 pb-2 max-h-96 overflow-hidden">
        {note.title && <h3 className="font-medium text-base mb-1 pr-8 break-words">{note.title}</h3>}
        {note.content && <p className="text-sm whitespace-pre-wrap break-words opacity-90">{note.content}</p>}

        {note.labels?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {note.labels.map((label) => (
              <span key={label} className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hover toolbar */}
      <div
        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 px-2 py-1 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <ColorPickerTrigger onClick={() => setShowColors((s) => !s)} />
        <AnimatePresence>
          {showColors && (
            <ColorPicker
              value={note.color}
              onChange={(color) => {
                onUpdate({ ...note, color, updatedAt: Date.now() })
                setShowColors(false)
              }}
              onClose={() => setShowColors(false)}
            />
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => onArchive(note)}
          title={note.isArchived ? 'Unarchive' : 'Archive'}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
        >
          {note.isArchived ? <ArchiveRestore size={17} /> : <Archive size={17} />}
        </button>
        <button
          type="button"
          onClick={() => onDelete(note.id)}
          title="Delete note"
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </motion.div>
  )
}
