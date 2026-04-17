import React from "react";

const cards = [
  { number: "8892", holder: "Black Card", brand: "VISA", tone: "dark" },
  { number: "2241", holder: "Growth Card", brand: "VISA", tone: "lime" },
];

function AccountsCard() {
  return (
    <article className="utility-card glass-card fade-in">
      <div className="card-head">
        <div>
          <p className="eyebrow">My accounts</p>
          <h2>Premium cards</h2>
        </div>
      </div>

      <div className="account-stack">
        {cards.map((card) => (
          <div key={card.number} className={`account-card ${card.tone}`}>
            <div className="account-row">
              <span>**** {card.number}</span>
              <strong>{card.brand}</strong>
            </div>
            <div className="account-holder">{card.holder}</div>
            <div className="account-row muted">
              <span>Smart Finance</span>
              <span>04/25</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default AccountsCard;
