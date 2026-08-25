import { useMemo, useState } from 'react'
import { Check, ListTodo, Plus, Trash2 } from 'lucide-react'

export default function TodoList({ tasks, onAdd, onToggle, onDelete }) {
  const [text, setText] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)

  const activeTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks])
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks])

  function submit(event) {
    event.preventDefault()
    const value = text.trim()
    if (!value) return
    onAdd(value)
    setText('')
  }

  return (
    <section className="mx-auto w-full max-w-xl">
      <div className="mb-5 flex items-center gap-3 px-1">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
          <ListTodo size={21} />
        </span>
        <div>
          <h1 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">To-do list</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {activeTasks.length === 0 ? 'All caught up' : `${activeTasks.length} task${activeTasks.length === 1 ? '' : 's'} left`}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mb-4 flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/10 dark:bg-[#2d2e30] dark:ring-white/15">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a task..."
          aria-label="New task"
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Plus size={17} /> Add
        </button>
      </form>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/10 dark:bg-[#2d2e30] dark:ring-white/15">
        {activeTasks.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-neutral-400">
            Add your first task to get started.
          </div>
        ) : (
          <TaskItems tasks={activeTasks} onToggle={onToggle} onDelete={onDelete} />
        )}

        {completedTasks.length > 0 && (
          <div className="border-t border-black/5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setShowCompleted((shown) => !shown)}
              className="w-full px-5 py-3 text-left text-xs font-semibold tracking-wider text-neutral-500 hover:bg-black/[.02] dark:text-neutral-400 dark:hover:bg-white/[.03]"
            >
              {showCompleted ? 'HIDE' : 'SHOW'} COMPLETED ({completedTasks.length})
            </button>
            {showCompleted && <TaskItems tasks={completedTasks} onToggle={onToggle} onDelete={onDelete} />}
          </div>
        )}
      </div>
    </section>
  )
}

function TaskItems({ tasks, onToggle, onDelete }) {
  return (
    <ul>
      {tasks.map((task, index) => (
        <li
          key={task.id}
          className={`group flex items-center gap-3 px-4 py-3 ${index > 0 ? 'border-t border-black/5 dark:border-white/10' : ''}`}
        >
          <button
            type="button"
            onClick={() => onToggle(task.id)}
            aria-label={task.completed ? `Mark ${task.text} as active` : `Mark ${task.text} as complete`}
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition ${
              task.completed
                ? 'border-amber-500 bg-amber-500 text-white'
                : 'border-neutral-400 text-transparent hover:border-amber-500 dark:border-neutral-500'
            }`}
          >
            <Check size={14} strokeWidth={3} />
          </button>
          <span className={`min-w-0 flex-1 break-words text-sm ${task.completed ? 'text-neutral-400 line-through dark:text-neutral-500' : 'text-neutral-700 dark:text-neutral-100'}`}>
            {task.text}
          </span>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete ${task.text}`}
            className="rounded-full p-1.5 text-neutral-400 opacity-0 transition hover:bg-black/5 hover:text-red-500 group-hover:opacity-100 focus:opacity-100 dark:hover:bg-white/10"
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  )
}
