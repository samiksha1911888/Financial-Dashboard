import React from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

const formatCurrency = (value) =>
  `INR ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const formatCompactCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

function TransactionsPanel({ totalExpense, spendingData = [], transactions = [] }) {
  return (
    <section className="transactions-stack fade-in">
      <article className="spending-card glass-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Total spending</p>
            <h2>{formatCurrency(totalExpense)}</h2>
            <span>Expense trend across time</span>
          </div>
        </div>

        <div className="mini-chart-shell">
          <ResponsiveContainer width="100%" height={132}>
            <BarChart data={spendingData}>
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(14,18,28,0.94)",
                  color: "#f8fafc",
                }}
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {spendingData.map((entry, index) => (
                  <Cell
                    key={`${entry.label}-${index}`}
                    fill={index === spendingData.length - 1 ? "#E9FF54" : "rgba(255,255,255,0.28)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="recent-card glass-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Recent transactions</p>
            <h2>Live activity</h2>
          </div>
        </div>

        <div className="recent-list">
          {transactions.slice(0, 7).map((item, index) => (
            <div key={`${item.id}-${index}`} className="recent-row">
              <div className="recent-icon">{item.merchant?.slice(0, 1) || "T"}</div>
              <div className="recent-copy">
                <strong>{item.merchant || "Unknown merchant"}</strong>
                <span>{item.paymentMethod || item.category}</span>
              </div>
              <div className={`recent-amount ${item.type === "expense" ? "negative" : "positive"}`}>
                {item.type === "expense" ? "-" : "+"}
                {formatCompactCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default TransactionsPanel;
