import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const barColors = ["#d7f24a", "#cde94a", "#c4df49", "#bad548", "#b1cb47", "#a8c246"];

const formatAxisValue = (value) => {
  const num = Number(value || 0);

  if (num >= 100000) {
    return `${(num / 100000).toFixed(num >= 1000000 ? 0 : 1)}L`;
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K`;
  }

  return `${num}`;
};

function TopProductsChart({
  data = [],
  labelKey = "category",
  dataKey = "value",
  height = 280,
}) {
  return (
    <div className="chart-wrapper dark-chart" style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 24 }}
        >
          <CartesianGrid
            stroke="rgba(148, 163, 184, 0.12)"
            vertical={false}
          />

          <XAxis
            dataKey={labelKey}
            stroke="rgba(148, 163, 184, 0.85)"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(148, 163, 184, 0.9)", fontSize: 12 }}
            interval={0}
          />

          <YAxis
            stroke="rgba(148, 163, 184, 0.85)"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(148, 163, 184, 0.9)", fontSize: 12 }}
            tickFormatter={formatAxisValue}
            width={52}
          />

          <Tooltip
            cursor={{ fill: "rgba(148, 163, 184, 0.05)" }}
            formatter={(value) => [`INR ${Number(value || 0).toLocaleString("en-IN")}`, "Amount"]}
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              backgroundColor: "#08111f",
              color: "#f8fafc",
            }}
            labelStyle={{ color: "#f8fafc" }}
          />

          <Bar dataKey={dataKey} radius={[14, 14, 0, 0]} barSize={42}>
            {data.map((entry, index) => (
              <Cell
                key={`${entry[labelKey]}-${index}`}
                fill={barColors[index % barColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TopProductsChart;
