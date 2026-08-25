# Keep Clone

A Google Keep clone built with React (Vite), Tailwind CSS, Lucide icons, and Framer Motion.

## Setup

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview the production build
```

## Structure

```
src/
  App.jsx                    top bar, search, PINNED/OTHERS sections, archive view
  components/
    CreateNote.jsx            expandable "Take a note..." composer
    NoteCard.jsx               individual note card + hover toolbar
    MasonryGrid.jsx            responsive CSS-columns masonry layout
    ColorPicker.jsx            shared color-swatch popover
    EditNoteModal.jsx          full note editor modal
    EmptyState.jsx             empty / no-results placeholder
  hooks/
    useLocalStorage.js         localStorage-backed useState
  utils/
    colors.js                  Keep pastel palette + contrast helpers
```

## Notes on implementation choices

- **Masonry**: implemented with plain CSS `columns-N` (via `MasonryGrid`)
  rather than a JS masonry library. It's dependency-free and never causes
  layout thrash while typing, since it doesn't re-measure card heights.
- **Persistence**: all notes and the dark-mode preference live in
  `localStorage` under `keep-clone.notes` / `keep-clone.dark`.
- **Auto-save**: both `CreateNote` and `EditNoteModal` hold their edits in
  local component state and only commit to the note list on close
  (Close button, outside click, or Escape) — matching Keep's own behavior.
- **Dark mode**: each pastel color has a muted "dark" counterpart (see
  `utils/colors.js`) so notes stay readable against the dark theme,
  the same way Keep's own dark mode remaps its palette.
