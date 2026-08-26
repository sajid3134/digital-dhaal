// The calm "~20% cyber-security firm" band. Dark, mono-accented, node-grid
// texture — but the copy is trauma-informed and reassuring, never alarming.
// Server component (no client JS). `variant="strip"` renders a slim stat strip.

import {
  LockKeyholeIcon,
  EyeOffIcon,
  BadgeCheckIcon,
  EyeIcon,
} from "./Icons.jsx";

const ITEM_ICONS = {
  lock: LockKeyholeIcon,
  eyeOff: EyeOffIcon,
  badge: BadgeCheckIcon,
  eye: EyeIcon,
};

export default function TrustBand({ s }) {
  return (
    <section className="dd-cyber-grid text-white/90">
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyber)] secure-dot" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-cyber)]">
            {s.kicker}
          </span>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold !text-white leading-snug mb-3">
              {s.title}
            </h2>
            <p className="text-white/65 leading-relaxed max-w-md">{s.reassure}</p>

            {/* mono stat strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {s.stats.map((st) => (
                <div key={st.label}>
                  <p className="font-mono text-2xl font-semibold text-[var(--color-cyber)] leading-none">
                    {st.value}
                  </p>
                  <p className="text-[12px] text-white/55 mt-1.5 leading-tight">{st.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {s.items.map((item) => {
              const Icon = ITEM_ICONS[item.icon] ?? LockKeyholeIcon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex gap-3"
                >
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-[var(--color-cyber)]/10 text-[var(--color-cyber)] flex items-center justify-center">
                    <Icon width={18} height={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] !text-white leading-tight">
                      {item.title}
                    </p>
                    <p className="text-[13px] text-white/55 leading-snug mt-1">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
