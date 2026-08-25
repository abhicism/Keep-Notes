import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, Palette } from 'lucide-react'
import { NOTE_COLORS } from '../utils/colors'

/**
 * Popover of color swatches. Renders as an absolutely-positioned panel
 * anchored below the trigger button that opened it, and closes itself on
 * outside click or Escape.
 */
export default function ColorPicker({ value, onChange, onClose, align = 'left' }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ duration: 0.12 }}
      className={`absolute z-30 top-full mt-2 ${align === 'right' ? 'right-0' : 'left-0'}
        flex flex-wrap gap-2 w-56 p-3 rounded-xl border border-black/10 dark:border-white/10
        bg-white dark:bg-[#2d2e30] shadow-lg`}
    >
      {NOTE_COLORS.map((c) => (
        <button
          key={c.value}
          type="button"
          title={c.name}
          onClick={() => onChange(c.value)}
          className="w-7 h-7 rounded-full border border-black/10 dark:border-white/20 flex items-center justify-center
            shadow-sm hover:scale-110 transition-transform"
          style={{ backgroundColor: c.value }}
        >
          {value === c.value && <Check size={14} className="text-neutral-700" />}
        </button>
      ))}
    </motion.div>
  )
}

export function ColorPickerTrigger({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Background options"
      className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${className}`}
    >
      <Palette size={18} />
    </button>
  )
}
