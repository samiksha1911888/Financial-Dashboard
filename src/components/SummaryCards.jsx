import React from "react";

const formatCurrency = (value) =>
  `INR ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function SummaryCards({ summary, categorySpotlight, paymentSpotlight }) {
  const cards = [
    {
      key: "income",
      label: "Total Income",
      value: formatCurrency(summary.totalIncome),
      tone: "positive",
      note: paymentSpotlight ? `Highest income category ${paymentSpotlight.paymentMethod}` : "Positive cashflow",
    },
    {
      key: "expense",
      label: "Total Expense",
      value: formatCurrency(summary.totalExpense),
      tone: "negative",
      note: categorySpotlight ? `Top spending category: ${categorySpotlight.category}` : "Expense overview",
    },
    {
      key: "balance",
      label: "Net Balance",
      value: formatCurrency(summary.netBalance),
      tone: "neutral",
      note: `Across ${summary.totalTransactions || 0} transactions`,
    },
  ];

  return (
    <section className="summary-grid fade-in">
      {cards.map((card) => (
        <article key={card.key} className={`summary-card glass-card ${card.tone}`}>
          <div className="summary-chip">{card.label}</div>
          <strong>{card.value}</strong>
          <span>{card.note}</span>
        </article>
      ))}
    </section>
  );
}

export default SummaryCards;
