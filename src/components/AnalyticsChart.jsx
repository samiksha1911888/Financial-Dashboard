import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatCurrency = (value) =>
  `INR ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const formatAxisValue = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

function AnalyticsChart({ loading, trends = [], categories = [], payments = [], chartPreview }) {
  const chartType = chartPreview?.type || "monthly";

  const mainData = useMemo(() => {
    if (chartPreview?.data?.length) {
      return chartPreview.data.map((item) => ({
        ...item,
        label: item.category || item.paymentMethod || item.month,
        month: item.month || item.label,
        value: Number(item.value ?? item.expense ?? item.total ?? Math.abs(item.net ?? 0)),
        income: Number(item.income || 0),
        expense: Number(item.expense || 0),
      }));
    }

    if (chartType === "payment") {
      return payments.map((item) => ({
        ...item,
        label: item.paymentMethod,
        value: Number(item.expense || item.total || 0),
      }));
    }

    if (chartType === "category") {
      return categories.map((item) => ({
        ...item,
        label: item.category,
        value: Number(item.value || item.expense || 0),
      }));
    }

    return trends.map((item) => ({
      ...item,
      month: item.month,
      income: Number(item.income || 0),
      expense: Number(item.expense || 0),
    }));
  }, [categories, chartPreview, chartType, payments, trends]);

  const titleMap = {
    monthly: "Analytics",
    category: "Top category view",
    payment: "Payment methods",
  };

  const subtitleMap = {
    monthly: "Income and expense trend",
    category: "Highest-spend categories",
    payment: "How transactions are paid",
  };

  const hasChartData = Array.isArray(mainData) && mainData.length > 0;

  return (
    <section className="analytics-card glass-card fade-in">
      <div className="card-head">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2>{chartPreview?.title || titleMap[chartType]}</h2>
          <span>{chartPreview?.subtitle || subtitleMap[chartType]}</span>
        </div>
        <div className="card-actions">
          <button className="icon-button" type="button" aria-label="Expand analytics">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17h10V7h-4V5h6v14H5v-6h2zM9 5v2H6.4l6.3 6.3-1.4 1.4L5 8.4V11H3V5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="metric-pill-row">
        {categories.map((item) => (
          <div key={item.category} className="metric-pill">
            <span>{item.category}</span>
            <strong>{formatCurrency(item.value)}</strong>
          </div>
        ))}
      </div>

      <div className="chart-surface compact-chart-surface">
        {loading ? (
          <div className="chart-empty-state">Loading analytics...</div>
        ) : !hasChartData ? (
          <div className="chart-empty-state">No chart data available</div>
        ) : chartType === "monthly" ? (
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mainData} margin={{ top: 12, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.72)"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.72)"
                  tickLine={false}
                  axisLine={false}
                  width={54}
                  tickFormatter={formatAxisValue}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(14,18,28,0.96)",
                    color: "#f8fafc",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#6CFF8F"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: "#E9FF54", stroke: "#0f1118", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#FF7070"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: "#E9FF54", stroke: "#0f1118", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mainData} margin={{ top: 10, right: 10, left: 24, bottom: 20 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="rgba(255,255,255,0.72)"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  interval={0}
                  minTickGap={16}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.72)"
                  tickLine={false}
                  axisLine={false}
                  width={72}
                  tickFormatter={formatAxisValue}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(14,18,28,0.96)",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#E9FF54" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

export default AnalyticsChart;
