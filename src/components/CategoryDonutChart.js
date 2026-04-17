import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const donutColors = ["#0ea5a4", "#38bdf8", "#f59e0b", "#f97316", "#22c55e", "#94a3b8"];

function CategoryDonutChart({ data = [], total = 0 }) {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={70}
            outerRadius={104}
            paddingAngle={3}
            stroke="transparent"
          >
            {data.map((entry, index) => (
              <Cell key={`${entry.label}-${index}`} fill={donutColors[index % donutColors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `INR ${Number(value || 0).toLocaleString("en-IN")}`}
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              backgroundColor: "#08111f",
              color: "#f8fafc",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-copy">
        <strong>INR {Number(total || 0).toLocaleString("en-IN")}</strong>
        <span>Total category spend</span>
      </div>
    </div>
  );
}

export default CategoryDonutChart;
