import { createContext, useCallback, useContext, useState } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const push = useCallback((message, type = 'ok') => {
    const id = crypto.randomUUID()
    setItems((prev) => [...prev, { id, message, type }])
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3800)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-80 flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`rounded-2xl px-4 py-3 text-sm shadow-soft ${
              t.type === 'err' ? 'bg-clay-500 text-white' : 'bg-sage-700 text-white'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}
