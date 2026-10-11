export default function Logo({ className = '' }) {
  return (
    <span className={`group flex items-center gap-3 ${className}`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-600 text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 21s-7-4.4-7-10.2C5 7.4 7.2 5.5 9.4 5.5c1.3 0 2.4.6 2.6 1.6.2-1 1.3-1.6 2.6-1.6 2.2 0 4.4 1.9 4.4 5.3C19 16.6 12 21 12 21Z"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="serif block text-lg text-ink-900">Ana</span>
        <span className="block text-[11px] uppercase tracking-[0.18em] text-sage-600">
          Terapia e Mentoria
        </span>
      </span>
    </span>
  )
}
