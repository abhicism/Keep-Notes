import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pin, Tag, X } from 'lucide-react'
import ColorPicker, { ColorPickerTrigger } from './ColorPicker'
import { colorFor, isLightBackground } from '../utils/colors'

const EMPTY_DRAFT = { title: '', content: '', isPinned: false, color: '#ffffff', labels: [] }

/**
 * Collapsed: a single "Take a note..." bar.
 * Expanded (on focus/click): title + body + pin/color/label controls.
 * Closing (via the Close button, Escape, or a click outside) commits the
 * draft as a new note if it has any content, then resets to collapsed.
 */
export default function CreateNote({ onCreate, isDark }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [showColors, setShowColors] = useState(false)
  const [labelInput, setLabelInput] = useState('')
  const containerRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    if (open) titleRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) commitAndClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, draft])

  function commitAndClose() {
    const hasContent = draft.title.trim() || draft.content.trim() || draft.labels.length > 0
    if (hasContent) {
      onCreate({
        id: crypto.randomUUID(),
        title: draft.title.trim(),
        content: draft.content.trim(),
        isPinned: draft.isPinned,
        color: draft.color,
        labels: draft.labels,
        updatedAt: Date.now(),
      })
    }
    setDraft(EMPTY_DRAFT)
    setLabelInput('')
    setShowColors(false)
    setOpen(false)
  }

  function addLabel() {
    const v = labelInput.trim()
    if (v && !draft.labels.includes(v)) {
      setDraft((d) => ({ ...d, labels: [...d.labels, v] }))
    }
    setLabelInput('')
  }

  const bg = colorFor(draft.color, isDark)
  const light = isDark ? false : isLightBackground(draft.color)

  return (
    <div className="flex justify-center mb-10">
      <div
        ref={containerRef}
        className="w-full max-w-xl rounded-xl border border-black/10 dark:border-white/15 shadow-md transition-colors"
        style={{ backgroundColor: bg, color: light ? '#202124' : '#e8eaed' }}
      >
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full text-left px-4 py-3.5 flex items-center justify-between rounded-xl"
          >
            <span className="opacity-70">Take a note...</span>
            <Pin size={18} className="opacity-40" />
          </button>
        ) : (
          <div className="px-4 pt-3 pb-2">
            <input
              ref={titleRef}
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="Title"
              className="w-full bg-transparent outline-none font-medium text-base placeholder:opacity-50 mb-1"
            />
            <div className="flex items-start justify-between gap-2">
              <textarea
                value={draft.content}
                onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                placeholder="Take a note..."
                rows={3}
                className="w-full bg-transparent outline-none resize-none placeholder:opacity-50 text-sm"
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

            {draft.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 mb-1">
                {draft.labels.map((label) => (
                  <span
                    key={label}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10"
                  >
                    {label}
                    <button type="button" onClick={() => setDraft((d) => ({ ...d, labels: d.labels.filter((l) => l !== label) }))}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1 mt-2">
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
                className="flex-1 bg-transparent outline-none text-xs placeholder:opacity-50 py-1"
              />
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10 dark:border-white/10 relative">
              <ColorPickerTrigger onClick={() => setShowColors((s) => !s)} />
              <AnimatePresence>
                {showColors && (
                  <ColorPicker
                    value={draft.color}
                    onChange={(color) => {
                      setDraft((d) => ({ ...d, color }))
                      setShowColors(false)
                    }}
                    onClose={() => setShowColors(false)}
                  />
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={commitAndClose}
                className="px-4 py-1.5 text-sm font-medium rounded hover:bg-black/5 dark:hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
