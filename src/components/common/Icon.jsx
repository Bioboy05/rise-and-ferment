/**
 * SVG Icon System — Professional icons replacing emojis.
 * All icons use currentColor for stroke, adapting to theme automatically.
 * Usage: <Icon name="home" size={24} />
 */

const icons = {
  // Navigation icons
  home: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>
  ),
  history: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  recipes: (
    <>
      <ellipse cx="12" cy="8" rx="7" ry="5" />
      <path d="M5 8v6c0 3.5 3.1 6 7 6s7-2.5 7-6V8" />
      <line x1="12" y1="8" x2="12" y2="20" />
    </>
  ),
  planner: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  stats: (
    <>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),

  // Theme icons
  sun: (
    <>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </>
  ),
  moon: (
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  ),

  // Action icons
  close: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  minus: (
    <line x1="5" y1="12" x2="19" y2="12" />
  ),
  check: (
    <polyline points="20 6 9 17 4 12" />
  ),

  // Content icons
  thermometer: (
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  ),
  wheat: (
    <>
      <path d="M12 22V8" />
      <path d="M5 12s2.5-5 7-5 7 5 7 5" />
      <circle cx="12" cy="5" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  alert: (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  star: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  ),
  "star-filled": (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" />
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  clipboard: (
    <>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  "chevron-left": (
    <polyline points="15 18 9 12 15 6" />
  ),
  "chevron-right": (
    <polyline points="9 18 15 12 9 6" />
  ),

  // Feeding / food icons
  droplet: (
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  ),
  flask: (
    <>
      <path d="M9 3h6v5l4 9a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l4-9V3" />
      <line x1="9" y1="3" x2="15" y2="3" />
    </>
  ),
  bread: (
    <>
      <ellipse cx="12" cy="10" rx="9" ry="6" />
      <path d="M3 10v6c0 3.3 4 6 9 6s9-2.7 9-6v-6" />
    </>
  ),
  utensils: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </>
  ),

  // ==========================================
  // NEW premium icons (replacing emojis)
  // ==========================================

  // Milestone icons
  seedling: (
    <>
      <path d="M12 22V12" />
      <path d="M12 12C12 8 8 5 4 5c0 4 3 7 8 7" />
      <path d="M12 12c0-4 4-7 8-7-0 4-3 7-8 7" />
    </>
  ),
  "trending-up": (
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>
  ),
  muscle: (
    <>
      <path d="M7 11c-1.5 0-3-1-3-3s1.5-3 3-3c.8 0 1.5.3 2 .8" />
      <path d="M17 11c1.5 0 3-1 3-3s-1.5-3-3-3c-.8 0-1.5.3-2 .8" />
      <path d="M7 11v5c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4v-5" />
      <line x1="9" y1="8" x2="15" y2="8" />
    </>
  ),
  loaf: (
    <>
      <path d="M5 12c0-3 3.1-5.5 7-5.5s7 2.5 7 5.5" />
      <path d="M5 12v5c0 2 3.1 4 7 4s7-2 7-4v-5" />
      <path d="M9 10c0 0 1.5-2 3-2s3 2 3 2" />
    </>
  ),

  // Status / indicator icons
  fire: (
    <path d="M12 22c-4-2-7-5.5-7-9.5 0-3 2-5.5 4-6.5 0 3 1.5 4.5 3 5 -.5-3 1-7 3-9 1.5 2 4 5.5 4 10.5 0 4-3 7.5-7 9.5z" />
  ),
  snowflake: (
    <>
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  hourglass: (
    <>
      <path d="M6 2h12" />
      <path d="M6 22h12" />
      <path d="M7 2v4.4c0 1.1.4 2.1 1.2 2.8L12 12l-3.8 2.8c-.8.7-1.2 1.7-1.2 2.8V22" />
      <path d="M17 2v4.4c0 1.1-.4 2.1-1.2 2.8L12 12l3.8 2.8c.8.7 1.2 1.7 1.2 2.8V22" />
    </>
  ),

  // Utility icons
  scale: (
    <>
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M4 7l8-4 8 4" />
      <path d="M4 7v0a4 4 0 0 0 4 4h0" />
      <path d="M20 7v0a4 4 0 0 1-4 4h0" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </>
  ),
  jar: (
    <>
      <rect x="6" y="2" width="12" height="3" rx="1" />
      <path d="M6 5v13c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4V5" />
      <path d="M8 12h8" />
    </>
  ),
  note: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 22V10" />
      <path d="M6 14c0-3.3 2.7-6 6-6" />
      <path d="M18 14c0-3.3-2.7-6-6-6" />
      <path d="M6 6c0 0 3 0 6 4" />
      <path d="M18 6c0 0-3 0-6 4" />
    </>
  ),
  handshake: (
    <>
      <path d="M11 17l-2-2" />
      <path d="M2 9l5-2 3 3 4-4 3 3 5-2" />
      <path d="M7 7l3.5 3.5" />
      <path d="M14 14l3.5-3.5" />
      <path d="M7 17l5-5" />
      <path d="M17 7l-5 5" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  store: (
    <>
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9h18v12H3z" />
      <path d="M9 21V13h6v8" />
      <path d="M3 9c0 1.1.9 2 2 2s2-.9 2-2" />
      <path d="M7 9c0 1.1.9 2 2 2s2-.9 2-2" />
      <path d="M11 9c0 1.1.9 2 2 2s2-.9 2-2" />
      <path d="M15 9c0 1.1.9 2 2 2s2-.9 2-2" />
    </>
  ),
  phone: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </>
  ),
  "circle-check": (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 12 15 16 9" />
    </>
  ),
  "circle-dot": (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
  "arrow-left": (
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </>
  ),
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  bowl: (
    <>
      <path d="M3 12a9 9 0 0 0 18 0" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </>
  ),
  leaf: (
    <>
      <path d="M6 21c3-8 9-12 15-12-3 8-9 12-15 12z" />
      <path d="M6 21c0-4 2-8 6-12" />
    </>
  ),
  shop: (
    <>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </>
  ),
};


function Icon({ name, size = 24, className = "", style = {} }) {
  const paths = icons[name];
  if (!paths) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

export default Icon;
