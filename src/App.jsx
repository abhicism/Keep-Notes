import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Archive, Moon, Search, StickyNote, Sun, X } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import MasonryGrid from './components/MasonryGrid'
import CreateNote from './components/CreateNote'
import NoteCard from './components/NoteCard'
import EditNoteModal from './components/EditNoteModal'
import EmptyState from './components/EmptyState'

export default function App() {
  const [notes, setNotes] = useLocalStorage('keep-clone.notes', [])
  const [isDark, setIsDark] = useLocalStorage('keep-clone.dark', false)
  const [query, setQuery] = useState('')
  const [view, setView] = useState('notes') // 'notes' | 'archive'
  const [activeNote, setActiveNote] = useState(null)

  function addNote(note) {
    setNotes((prev) => [note, ...prev])
  }

  function updateNote(updated) {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
    setActiveNote((cur) => (cur && cur.id === updated.id ? updated : cur))
  }

  function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  function toggleArchive(note) {
    updateNote({ ...note, isArchived: !note.isArchived, updatedAt: Date.now() })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return notes
      .filter((n) => (view === 'archive' ? n.isArchived : !n.isArchived))
      .filter((n) => !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
  }, [notes, query, view])

  const pinned = filtered.filter((n) => n.isPinned)
  const others = filtered.filter((n) => !n.isPinned)

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#202124] transition-colors">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#f0f4f9]/90 dark:bg-[#202124]/90 backdrop-blur border-b border-black/5 dark:border-white/10">
          <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 py-3">
            <div className="flex items-center gap-2 shrink-0">
              <StickyNote size={26} className="text-amber-500" />
              <span className="hidden sm:block text-xl text-neutral-700 dark:text-neutral-200 tracking-tight">Keep</span>
            </div>

            <div className="flex-1 max-w-2xl mx-auto relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes"
                className="w-full bg-white dark:bg-[#2d2e30] rounded-lg pl-10 pr-9 py-2.5 text-sm outline-none
                  text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 shadow-sm
                  focus:shadow-md transition-shadow"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X size={15} className="text-neutral-400" />
                </button>
              )}
            </div>

            <button
              onClick={() => setView((v) => (v === 'notes' ? 'archive' : 'notes'))}
              title={view === 'notes' ? 'View archive' : 'Back to notes'}
              className={`p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0 ${
                view === 'archive' ? 'text-amber-500' : 'text-neutral-600 dark:text-neutral-300'
              }`}
            >
              <Archive size={20} />
            </button>
            <button
              onClick={() => setIsDark((d) => !d)}
              title="Toggle theme"
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 shrink-0"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {view === 'notes' && <CreateNote onCreate={addNote} isDark={isDark} />}

          {view === 'archive' && (
            <p className="text-center text-sm text-neutral-400 mb-8">Archived notes stay here until you delete or restore them.</p>
          )}

          {filtered.length === 0 ? (
            <EmptyState searching={!!query.trim()} />
          ) : (
            <div className="space-y-8">
              {pinned.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold tracking-widest text-neutral-500 dark:text-neutral-400 mb-3 px-1">PINNED</h2>
                  <MasonryGrid>
                    <AnimatePresence>
                      {pinned.map((note) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          isDark={isDark}
                          onUpdate={updateNote}
                          onDelete={deleteNote}
                          onArchive={toggleArchive}
                          onOpen={setActiveNote}
                        />
                      ))}
                    </AnimatePresence>
                  </MasonryGrid>
                </section>
              )}

              {others.length > 0 && (
                <section>
                  {pinned.length > 0 && (
                    <h2 className="text-xs font-semibold tracking-widest text-neutral-500 dark:text-neutral-400 mb-3 px-1">OTHERS</h2>
                  )}
                  <MasonryGrid>
                    <AnimatePresence>
                      {others.map((note) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          isDark={isDark}
                          onUpdate={updateNote}
                          onDelete={deleteNote}
                          onArchive={toggleArchive}
                          onOpen={setActiveNote}
                        />
                      ))}
                    </AnimatePresence>
                  </MasonryGrid>
                </section>
              )}
            </div>
          )}
        </main>

        <AnimatePresence>
          {activeNote && (
            <EditNoteModal
              note={activeNote}
              isDark={isDark}
              onSave={updateNote}
              onDelete={deleteNote}
              onArchive={toggleArchive}
              onClose={() => setActiveNote(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
