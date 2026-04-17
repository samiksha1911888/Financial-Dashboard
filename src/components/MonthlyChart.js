import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MonthlyChart({ data = [] }) {
  return (
    <div className="chart-wrapper dark-chart">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5a4" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#0ea5a4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="rgba(148, 163, 184, 0.9)"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="rgba(148, 163, 184, 0.9)"
            tickLine={false}
            axisLine={false}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: "12px", color: "#94a3b8" }}
          />
          <Tooltip
            cursor={{ stroke: "rgba(148, 163, 184, 0.25)", strokeWidth: 1 }}
            formatter={(value) => `INR ${Number(value || 0).toLocaleString("en-IN")}`}
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              backgroundColor: "#08111f",
              color: "#f8fafc",
            }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#14b8a6"
            strokeWidth={2.4}
            fill="url(#incomeFill)"
            name="Income"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#f59e0b"
            strokeWidth={2.2}
            fill="url(#expenseFill)"
            name="Expense"
          />
          <Line
            type="monotone"
            dataKey="net"
            stroke="#e2e8f0"
            strokeWidth={2}
            dot={{ r: 0 }}
            activeDot={{ r: 4 }}
            name="Net"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyChart;
