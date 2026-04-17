import React from "react";

const formatCompactCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

function SavingsCard({ savingsMeta }) {
  return (
    <article className="utility-card glass-card fade-in">
      <div className="card-head">
        <div>
          <p className="eyebrow">My savings</p>
          <h2>Goal progress</h2>
          <span>Track how close the current balance is to the next savings milestone.</span>
        </div>
      </div>

      <div className="savings-value">INR {formatCompactCurrency(savingsMeta.current)}</div>
      <div className="progress-bar">
        <span style={{ width: `${savingsMeta.progress}%` }} />
      </div>
      <div className="progress-meta">
        <span>{savingsMeta.progress}% complete</span>
        <span>Goal INR {formatCompactCurrency(savingsMeta.goal)}</span>
      </div>
    </article>
  );
}

export default SavingsCard;
