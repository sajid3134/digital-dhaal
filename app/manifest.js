export default function manifest() {
  return {
    name: "Digital Dhaal — ডিজিটাল ঢাল",
    short_name: "Digital Dhaal",
    description: "Bangla-first cyber incident response intake",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fb",
    theme_color: "#0f766e",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
