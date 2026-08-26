"use client";

import { useState } from "react";
import {
  ShieldCheckIcon,
  AlertIcon,
  SearchIcon,
  EyeOffIcon,
  GlobeIcon,
} from "./Icons.jsx";

// Engineer-only reference for intimate-image / deepfake cases (Pillar B).
// It encodes the constant procedure + per-surface takedown routes so any
// engineer works these consistently. Open by default for Pillar B cases.
// External links can change — always confirm the current flow on the site.
const STEPS = [
  ["Never take the image", "Do NOT ask the victim to send the content, and never store it on the case. You work with a hash and with links/usernames — the image stays on the victim's device."],
  ["Stabilise & advise", "It's a crime and it's not their fault. Tell them: don't delete anything, don't pay or reply to any demand, don't confront the suspect."],
  ["Find where it is", "Use reverse-image search (Google Images / Lens, Bing) and search their name/handles. You can't take down what you can't locate; a link is your evidence pointer."],
  ["Hash it on their device (StopNCII)", "The victim selects the images at stopncii.org — only a fingerprint is sent, never the photo. Partner platforms then detect & block it, including re-uploads. Works for real and AI-edited images."],
  ["Report on the exact platform", "File the platform's own non-consensual-intimate-image report for each location (see routes below). Report the manipulated/deepfake ones the same way."],
  ["De-index from Google", "Even if a host is slow, Google can remove the URLs from Search fast — use its 'remove explicit content about me' tool. This cuts most of the real-world harm."],
  ["Escalate to police & law", "Route to CID Cyber Police Centre / 999. They have law-enforcement channels to the platforms and can preserve evidence. (Deepfakes are covered too.)"],
  ["Log pointers, not images", "On the case, record: StopNCII case no., platform report refs, URLs, usernames, timestamps. Then message the victim the plan + a realistic timeline."],
];

const ROUTES = [
  ["StopNCII (hash-block, all partners)", "https://stopncii.org"],
  ["Meta / Facebook — NCII report", "https://www.facebook.com/help/1216349518398524"],
  ["Instagram — help & report", "https://help.instagram.com/"],
  ["Google — remove explicit content", "https://support.google.com/websearch/answer/9116649"],
  ["Google — remove a URL from Search", "https://support.google.com/websearch/troubleshooter/3111061"],
  ["Telegram — report abuse", "https://telegram.org/faq#q-there-039s-illegal-content-on-telegram-how-do-i-take-it-down"],
  ["X / Twitter — report NCII", "https://help.twitter.com/en/safety-and-security/intimate-media"],
  ["Under-18 victim? Take It Down (NCMEC)", "https://takeitdown.ncmec.org/"],
];

const BD = [
  ["CID Cyber Police Centre", "cyber@police.gov.bd"],
  ["National emergency", "999"],
  ["Police Cyber Support for Women (women only)", "01320-000888"],
  ["Legal basis", "Pornography Control Act 2012 · Cyber Security Act 2023"],
];

export default function TakedownPlaybook({ pillar }) {
  const isB = pillar === "B";
  const [open, setOpen] = useState(isB);

  return (
    <div className="dd-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className="w-8 h-8 shrink-0 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] flex items-center justify-center">
          <ShieldCheckIcon width={18} height={18} />
        </span>
        <span className="min-w-0">
          <span className="font-semibold text-sm flex items-center gap-2">
            Image-takedown toolkit
            {isB && (
              <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)] text-[11px] font-semibold">
                Pillar B
              </span>
            )}
          </span>
          <span className="block text-xs text-gray-500">The constant procedure + where to report, per platform</span>
        </span>
        <span className="ml-auto text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-black/5 pt-4">
          {/* Golden rule */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 flex gap-3 text-sm text-amber-900">
            <EyeOffIcon width={18} height={18} className="shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Never receive or store the image.</strong> The whole method is built so the
              content stays on the victim's device — you work with a hash and with links/usernames.
              Handling the intimate content yourself is a legal risk and re-traumatises the victim.
            </p>
          </div>

          {/* Constant procedure */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              The constant procedure (same every case)
            </h3>
            <ol className="space-y-2.5">
              {STEPS.map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-[var(--color-primary)] text-white text-xs font-mono font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t}</p>
                    <p className="text-sm text-gray-600 leading-snug">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Per-platform routes */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-2">
              <GlobeIcon width={14} height={14} /> Where to report — by platform
            </h3>
            <div className="grid sm:grid-cols-2 gap-1.5">
              {ROUTES.map(([label, url]) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary-soft)]/50 transition-colors"
                >
                  <span className="text-[var(--color-primary)] font-mono text-xs">↗</span>
                  <span className="truncate">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* "No evidence yet" note */}
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3.5 flex gap-3 text-sm text-sky-900">
            <SearchIcon width={17} height={17} className="shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Only a fear it leaked, no link yet?</strong> Do reverse-image &amp; name searches
              to locate it, and have the victim <strong>pre-hash the images at StopNCII now</strong> —
              partner platforms will then block it the moment it's uploaded, before it spreads.
            </p>
          </div>

          {/* Bangladesh contacts */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Bangladesh — escalate here
            </h3>
            <div className="rounded-xl border border-black/10 divide-y divide-black/5">
              {BD.map(([label, val]) => (
                <div key={label} className="flex items-center justify-between gap-3 px-3.5 py-2 text-sm">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-mono font-medium text-gray-800">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="flex items-start gap-2 text-xs text-gray-400">
            <AlertIcon width={13} height={13} className="shrink-0 mt-0.5" />
            General guidance, not legal advice. Report flows change — confirm the current steps on
            each site. Takedowns can take hours to days and re-uploads may recur; StopNCII keeps
            re-blocking them.
          </p>
        </div>
      )}
    </div>
  );
}
