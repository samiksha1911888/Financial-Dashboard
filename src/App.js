import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AnalyticsChart from "./components/AnalyticsChart";
import SummaryCards from "./components/SummaryCards";
import TransactionsPanel from "./components/TransactionsPanel";
import AIChatPanel from "./components/AIChatPanel";
import SavingsCard from "./components/SavingsCard";
import AccountsCard from "./components/AccountsCard";
import TopProductsChart from "./components/TopProductsChart";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("month");
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    totalTransactions: 0,
    categoryCount: 0,
  });
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [payments, setPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [chartPreview, setChartPreview] = useState(null);
  const [lastQuestion, setLastQuestion] = useState("");
  const [queryCount, setQueryCount] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [summaryRes, trendsRes, categoriesRes, paymentsRes, recordsRes] = await Promise.all([
          axios.get("/api/finance/summary"),
          axios.get("/api/finance/trends"),
          axios.get("/api/finance/categories"),
          axios.get("/api/finance/payment-methods"),
          axios.get("/api/records?limit=7"),
        ]);

        setSummary(summaryRes.data || {});
        setTrends(Array.isArray(trendsRes.data) ? trendsRes.data : []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
        setTransactions(Array.isArray(recordsRes.data) ? recordsRes.data : []);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const topCategories = useMemo(
    () =>
      categories.slice(0, 4).map((item) => ({
        ...item,
        value: Number(item.expense || Math.abs(item.net) || 0),
      })),
    [categories]
  );

  const savingsMeta = useMemo(() => {
    const current = Math.max(Number(summary.netBalance || 0), 0);
    const goal = Math.max(Number(summary.totalIncome || 0) * 0.4, current * 1.15, 100000);
    const progress = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;

    return { current, goal, progress };
  }, [summary]);

  const spendingData = useMemo(
    () =>
      trends.map((item) => ({
        label: item.month?.split(" ")[0] || item.month,
        value: Number(item.expense || 0),
      })),
    [trends]
  );

  const categorySpotlight = topCategories[0];
  const paymentSpotlight = payments[0];
  const paymentChartData = useMemo(
    () =>
      payments.map((item) => ({
        ...item,
        label: item.paymentMethod,
        value: Number(item.expense || item.total || 0),
      })),
    [payments]
  );
  const quickInsight = useMemo(() => {
    if (summary.totalExpense > summary.totalIncome) {
      const difference = Number(summary.totalExpense || 0) - Number(summary.totalIncome || 0);
      return `Expenses exceed income by INR ${difference.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      })}`;
    }

    if (categorySpotlight && summary.totalExpense) {
      const share = Math.round((Number(categorySpotlight.value || 0) / Number(summary.totalExpense || 1)) * 100);
      return `${categorySpotlight.category} category contributes ${share}% of total spend`;
    }

    return `Across ${summary.totalTransactions || 0} transactions, your dashboard is ready for analysis`;
  }, [categorySpotlight, summary.totalExpense, summary.totalIncome, summary.totalTransactions]);

  return (
    <div className="dashboard-shell dark-theme">
      <div className="dashboard-frame">
        <Sidebar />

        <div className="dashboard-content">
          <Header
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            totalBalance={summary.netBalance}
          />

          <section className="dashboard-hero">
            <SummaryCards
              summary={summary}
              categorySpotlight={categorySpotlight}
              paymentSpotlight={paymentSpotlight}
            />
            <div className="insight-line glass-card fade-in">
              <span className="insight-bullet" />
              <p>{quickInsight}</p>
            </div>
          </section>

        <section className="dashboard-main balanced-grid">
  <div className="grid-card grid-span-large">
    <AIChatPanel
      setChartPreview={setChartPreview}
      setLastQuestion={setLastQuestion}
      incrementQueryCount={() => setQueryCount((prev) => prev + 1)}
      lastQuestion={lastQuestion}
      queryCount={queryCount}
      chartPreview={chartPreview}
    />
  </div>

  <div className="grid-card">
    <TransactionsPanel
      totalExpense={summary.totalExpense}
      spendingData={spendingData}
      transactions={transactions}
    />
  </div>

  <div className="grid-card">
    <AnalyticsChart
      loading={loading}
      trends={trends}
      categories={topCategories}
      payments={payments}
      chartPreview={chartPreview}
    />
  </div>

  <div className="grid-card payment-methods-card glass-card fade-in">
    <div className="card-head">
      <div>
        <p className="eyebrow">Payment methods</p>
        <h2>How expenses are paid</h2>
        <span>Track spend across UPI, card, and cash in one compact view.</span>
      </div>
    </div>

    <div className="chart-wrapper-fixed">
      <TopProductsChart
        data={paymentChartData}
        labelKey="label"
        dataKey="value"
        height={260}
      />
    </div>
  </div>

  <div className="grid-card">
    <SavingsCard savingsMeta={savingsMeta} />
  </div>

  <div className="grid-card">
    <AccountsCard />
  </div>
</section>
        </div>
      </div>
    </div>
  );
}

export default App;
