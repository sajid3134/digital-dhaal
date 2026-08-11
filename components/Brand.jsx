// The Digital Dhaal brand mark, inlined as SVG so it renders crisply at any
// size, inherits no external request, and works inside server components.
// Source of truth for the vector is public/brand/dhaal-logo.svg (full mark)
// and public/brand/dhaal-icon.svg (simplified). Keep the two in sync.

// Full mark: shield + verification check + cyber nodes. Use for headers,
// footers, auth panels, and anywhere the logo has room to breathe.
export function DhaalMark({ size = 40, className = "", title = "Digital Dhaal" }) {
  const height = Math.round((size * 220) / 200);
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id="ddShieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12A99B" />
          <stop offset="1" stopColor="#0B5750" />
        </linearGradient>
      </defs>
      <path
        d="M100 16 L174 44 L174 116 C174 170 140 198 100 214 C60 198 26 170 26 116 L26 44 Z"
        fill="url(#ddShieldGrad)"
      />
      <path
        d="M100 26 L165 51 L165 115 C165 162 135 187 100 202 C65 187 35 162 35 115 L35 51 Z"
        fill="none"
        stroke="#ffffff"
        strokeOpacity=".2"
        strokeWidth="2"
      />
      <g stroke="#6EE0D2" strokeWidth="2.6" strokeLinecap="round" opacity=".9">
        <line x1="68" y1="112" x2="47" y2="133" />
        <line x1="135" y1="84" x2="157" y2="64" />
        <line x1="91" y1="136" x2="100" y2="170" />
      </g>
      <g fill="#6EE0D2">
        <circle cx="45" cy="135" r="4" />
        <circle cx="159" cy="62" r="4" />
        <circle cx="100" cy="172" r="4" />
      </g>
      <path
        d="M68 112 L91 136 L135 84"
        fill="none"
        stroke="#ffffff"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Simplified mark: shield + check only. Use for tiny avatars (chat bubbles)
// where the cyber nodes would turn to mud.
export function DhaalIcon({ size = 28, className = "", title = "Digital Dhaal" }) {
  const height = Math.round((size * 220) / 200);
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id="ddIconGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12A99B" />
          <stop offset="1" stopColor="#0B5750" />
        </linearGradient>
      </defs>
      <path
        d="M100 16 L174 44 L174 116 C174 170 140 198 100 214 C60 198 26 170 26 116 L26 44 Z"
        fill="url(#ddIconGrad)"
      />
      <path
        d="M68 112 L91 136 L135 84"
        fill="none"
        stroke="#ffffff"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Mark + wordmark, the standard app lockup. `subtitle` shows a small mono
// tagline under the name — used to carry the calm "security" register.
export function DhaalLockup({
  size = 34,
  className = "",
  nameClass = "font-bold text-lg tracking-tight",
  subtitle = null,
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <DhaalMark size={size} />
      <span className="leading-tight">
        <span className={nameClass}>Digital Dhaal</span>
        {subtitle && (
          <span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--color-muted)]">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
