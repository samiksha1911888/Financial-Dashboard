import React from "react";

const items = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13h7V4H4zm9 7h7v-9h-7zM4 20h7v-5H4zm9-11h7V4h-7z" />
      </svg>
    ),
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19h14v2H3V3h2zm3-2H6v-7h2zm5 0h-2V7h2zm5 0h-2v-4h2z" />
      </svg>
    ),
  },
  {
    key: "ai",
    label: "AI Assistant",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l2.1 4.6L19 9l-4.9 2.4L12 16l-2.1-4.6L5 9l4.9-2.4zM5 18l1 2 2 1-2 1-1 2-1-2-2-1 2-1zm14 0l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
      </svg>
    ),
  },
  {
    key: "transactions",
    label: "Transactions",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7zM5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2" />
      </svg>
    ),
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-orb">TD</div>

      <nav className="sidebar-nav">
        {items.map((item, index) => (
          <button
            key={item.key}
            className={`sidebar-link ${index === 0 ? "active" : ""}`}
            type="button"
            aria-label={item.label}
            title={item.label}
          >
            {item.icon}
            <span>{item.label.slice(0, 2)}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-pill">AI</div>
    </aside>
  );
}

export default Sidebar;
