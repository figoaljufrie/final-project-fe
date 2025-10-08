"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import clsx from "clsx";

interface ChartDataItem {
  name: string;
  value?: number;
  color?: string;
  [key: string]: string | number | undefined;
}

interface ChartKey {
  key: string;
  color: string;
}

interface ShadcnChartProps {
  data: ChartDataItem[];
  type: "line" | "area" | "bar" | "pie";
  keys: ChartKey[];
  height?: number;
  colors?: string[];
  animated?: boolean;
  className?: string;
  isCount?: boolean;
}

const defaultColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const CustomTooltip = ({
  active,
  payload,
  label,
  isCount = false,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  isCount?: boolean;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-2 shadow-md">
        <div className="grid gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-gray-500">
              {label}
            </span>
            {payload.map((entry, index: number) => (
              <div key={index} className="flex w-full flex-col gap-2">
                <div className="flex w-full flex-row items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="flex-1 text-sm font-medium">
                    {entry.name}
                  </span>
                  <span className="text-sm font-bold">
                    {typeof entry.value === "number"
                      ? isCount
                        ? `${entry.value} bookings`
                        : new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(entry.value)
                      : entry.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ShadcnChart({
  data,
  type,
  keys,
  height = 300,
  colors = defaultColors,
  animated = true,
  className = "",
  isCount = false,
}: ShadcnChartProps) {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey="name"
              className="text-xs fill-gray-500"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-xs fill-gray-500"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                typeof value === "number"
                  ? new Intl.NumberFormat("id-ID", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  : String(value)
              }
            />
            <Tooltip content={<CustomTooltip isCount={isCount} />} />
            <Legend />
            {keys.map((key, index) => (
              <Line
                key={key.key}
                type="monotone"
                dataKey={key.key}
                stroke={key.color || colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4, className: "fill-background stroke-2" }}
                activeDot={{ r: 6, className: "fill-background stroke-2" }}
              />
            ))}
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey="name"
              className="text-xs fill-gray-500"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-xs fill-gray-500"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                typeof value === "number"
                  ? new Intl.NumberFormat("id-ID", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  : String(value)
              }
            />
            <Tooltip content={<CustomTooltip isCount={isCount} />} />
            <Legend />
            {keys.map((key, index) => (
              <Area
                key={key.key}
                type="monotone"
                dataKey={key.key}
                stroke={key.color || colors[index % colors.length]}
                fillOpacity={0.4}
                fill={key.color || colors[index % colors.length]}
              />
            ))}
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey="name"
              className="text-xs fill-gray-500"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-xs fill-gray-500"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                typeof value === "number"
                  ? new Intl.NumberFormat("id-ID", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  : String(value)
              }
            />
            <Tooltip content={<CustomTooltip isCount={isCount} />} />
            <Legend />
            {keys.map((key, index) => (
              <Bar
                key={key.key}
                dataKey={key.key}
                fill={key.color || colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip isCount={isCount} />} />
            <Legend />
          </PieChart>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  const chartContent = (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={clsx("w-full", className)}
      >
        {chartContent}
      </motion.div>
    );
  }

  return <div className={clsx("w-full", className)}>{chartContent}</div>;
}
