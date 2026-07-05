// Lightweight stroke icon set (Feather-style, 24x24, currentColor).
// One place for every vector icon so the app never needs emoji glyphs.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const LockIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const ShieldIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const ShieldCheckIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const UsersIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const BanknoteIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

export const AlertIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

export const PhoneIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <path d="M11 18h2" />
  </svg>
);

export const CheckIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const CheckCircleIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m8.5 12 2.5 2.5 5-5" />
  </svg>
);

export const CoffeeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
    <path d="M7 2v2M11 2v2M15 2v2" />
  </svg>
);

export const HeartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const SendIcon = (p) => (
  <svg {...base} {...p}>
    <path d="m22 2-7 20-4-9-9-4 20-7z" />
  </svg>
);

export const MenuIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const XIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const MailIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

export const ClockIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export const FileIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h6" />
  </svg>
);

export const PlusIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const GoogleIcon = ({ size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" {...p}>
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.8 6.1C12.2 13.2 17.6 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
    <path fill="#FBBC05" d="M10.3 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1z" />
    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.5-5.9l-7.6-5.9c-2.1 1.4-4.8 2.3-7.9 2.3-6.4 0-11.8-3.7-13.7-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

// Filled latte cup with saucer — the one richer illustration we keep.
export const LatteCup = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M10 18h24v14a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8V18z" fill="#8B5A2B" />
    <path d="M10 18h24v5H10z" fill="#EBD9C3" />
    <path d="M34 21h3a5 5 0 0 1 0 10h-3v-4h3a1 1 0 0 0 0-2h-3v-4z" fill="#8B5A2B" />
    <path
      d="M17 8c0 2-2 2.5-2 4.5S17 15 17 15M24 8c0 2-2 2.5-2 4.5S24 15 24 15M31 8c0 2-2 2.5-2 4.5S31 15 31 15"
      stroke="#B08968"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const ICONS = {
  lock: LockIcon,
  shield: ShieldIcon,
  shieldCheck: ShieldCheckIcon,
  users: UsersIcon,
  money: BanknoteIcon,
  alert: AlertIcon,
  phone: PhoneIcon,
  check: CheckIcon,
  mail: MailIcon,
  file: FileIcon,
};
