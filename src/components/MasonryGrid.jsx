// Tailwind's compiler only picks up class names that appear as complete
// string literals in source, so the breakpoint -> column-count mapping is
// spelled out here instead of built with a template string.
const COLUMN_CLASSES = {
  sm: { 1: 'sm:columns-1', 2: 'sm:columns-2', 3: 'sm:columns-3', 4: 'sm:columns-4', 5: 'sm:columns-5' },
  md: { 1: 'md:columns-1', 2: 'md:columns-2', 3: 'md:columns-3', 4: 'md:columns-4', 5: 'md:columns-5' },
  lg: { 1: 'lg:columns-1', 2: 'lg:columns-2', 3: 'lg:columns-3', 4: 'lg:columns-4', 5: 'lg:columns-5' },
  xl: { 1: 'xl:columns-1', 2: 'xl:columns-2', 3: 'xl:columns-3', 4: 'xl:columns-4', 5: 'xl:columns-5' },
}

/**
 * Staggered "masonry" layout built on plain CSS columns instead of a JS
 * masonry library. Cards flow top-to-bottom within a column, then wrap to
 * the next column -- the Keep look -- without the layout thrash a
 * JS-measured masonry grid causes whenever a note's height changes.
 *
 * columns: { sm, md, lg, xl } -- number of columns at each breakpoint.
 * Mobile (base) is always a single column.
 */
export default function MasonryGrid({ children, columns = { sm: 2, md: 3, lg: 4, xl: 5 } }) {
  const colClass = [
    'columns-1',
    COLUMN_CLASSES.sm[columns.sm],
    COLUMN_CLASSES.md[columns.md],
    COLUMN_CLASSES.lg[columns.lg],
    COLUMN_CLASSES.xl[columns.xl],
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={`masonry-columns ${colClass}`}>{children}</div>
}
