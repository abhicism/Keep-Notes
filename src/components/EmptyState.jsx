import { Lightbulb, SearchX } from 'lucide-react'

export default function EmptyState({ searching }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-28 text-neutral-400 dark:text-neutral-600">
      {searching ? <SearchX size={72} strokeWidth={1} /> : <Lightbulb size={72} strokeWidth={1} />}
      <p className="text-xl font-medium">
        {searching ? 'No matching notes' : 'Notes you add appear here'}
      </p>
      {!searching && (
        <p className="text-sm max-w-xs">
          Click "Take a note..." above to capture an idea before it slips away.
        </p>
      )}
    </div>
  )
}
