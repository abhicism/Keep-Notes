// Google Keep's signature pastel palette. `value` is what gets stored on the
// note; `swatch` / `swatchDark` are what the color-picker dot renders as
// (dark mode nudges each pastel down slightly so it doesn't glow against
// the dark background, the same way Keep's own dark theme does).
export const NOTE_COLORS = [
  { name: 'Default', value: '#ffffff', dark: '#202124' },
  { name: 'Coral', value: '#f28b82', dark: '#5c2b29' },
  { name: 'Peach', value: '#fbbc04', dark: '#614a19' },
  { name: 'Sand', value: '#fff475', dark: '#635d19' },
  { name: 'Sage', value: '#ccff90', dark: '#345920' },
  { name: 'Mint', value: '#a7ffeb', dark: '#16504b' },
  { name: 'Dusk', value: '#cbf0f8', dark: '#2d555e' },
  { name: 'Sky', value: '#aecbfa', dark: '#1e3a5f' },
  { name: 'Blossom', value: '#d7aefb', dark: '#42275e' },
]

export function colorFor(hex, isDark) {
  const entry = NOTE_COLORS.find((c) => c.value === hex) || NOTE_COLORS[0]
  return isDark ? entry.dark : entry.value
}

// A note's own text/icon color needs to stay readable against whichever
// pastel it's sitting on, independent of the app's light/dark theme.
export function isLightBackground(hex) {
  if (!hex) return true
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6
}
