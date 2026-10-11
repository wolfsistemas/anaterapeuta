const KEY = 'ana.logs'

export function readLogs() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function writeLog(action, detail, actor = 'sistema') {
  const row = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    actor,
    action,
    detail,
  }
  const next = [row, ...readLogs()].slice(0, 400)
  localStorage.setItem(KEY, JSON.stringify(next))
  return row
}

export function clearLogs() {
  localStorage.setItem(KEY, '[]')
}
