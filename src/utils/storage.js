const PREFIX = 'ssdg_'

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // storage unavailable, fail silently
  }
}

export function clearState(key) {
  localStorage.removeItem(PREFIX + key)
}
