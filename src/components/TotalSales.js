import React, { useEffect, useState } from "react";
import axios from "axios";

function TotalSales() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/finance/summary")
      .then((res) => {
        setSummary({
          totalIncome: Number(res.data.totalIncome) || 0,
          totalExpense: Number(res.data.totalExpense) || 0,
          netBalance: Number(res.data.netBalance) || 0,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (value) =>
    `INR ${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const healthLabel =
    summary.netBalance > 0
      ? "Healthy balance"
      : summary.netBalance < 0
        ? "Needs attention"
        : "Balanced";

  return (
    <div className="summary-shell">
      <div className="panel-head">
        <div>
          <p className="panel-kicker">Snapshot</p>
          <h2>Financial summary</h2>
        </div>
        <span className="summary-badge">{healthLabel}</span>
      </div>

      <div className="summary-grid">
        <div className="metric-card metric-income">
          <p className="metric-label">Total Income</p>
          <h3>{loading ? "..." : formatCurrency(summary.totalIncome)}</h3>
        </div>

        <div className="metric-card metric-expense">
          <p className="metric-label">Total Expense</p>
          <h3>{loading ? "..." : formatCurrency(summary.totalExpense)}</h3>
        </div>

        <div className="metric-card metric-balance">
          <p className="metric-label">Net Balance</p>
          <h3>{loading ? "..." : formatCurrency(summary.netBalance)}</h3>
        </div>
      </div>
    </div>
  );
}

export default TotalSales;
