import React from "react";

const filters = [
  { key: "today", label: "Today" },
  { key: "month", label: "This Month" },
  { key: "custom", label: "Custom Date" },
];

const formatCurrency = (value) =>
  `INR ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function Header({ activeFilter, setActiveFilter, totalBalance }) {
  return (
    <header className="header-card glass-card">
      <div className="header-copy">
        <p className="eyebrow">AI Finance Intelligence</p>
        <h1>Financial Overview</h1>
        <span>Analyze your financial data, track trends, and generate insights using AI.</span>
      </div>

      <div className="header-actions">
        <div className="filter-group">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`filter-chip ${activeFilter === filter.key ? "active" : ""}`}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="header-balance">
          <div>
            <span>Total balance</span>
            <strong>{formatCurrency(totalBalance)}</strong>
          </div>
          <div className="user-avatar">AK</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
