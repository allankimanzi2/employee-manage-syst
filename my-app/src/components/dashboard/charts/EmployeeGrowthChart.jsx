import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const EmployeeGrowthChart = ({ data = [] }) => {
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = data.map((item) => ({
    month: `${months[item._id.month]} ${item._id.year}`,
    employees: item.employees,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      <h2 className="text-xl font-bold mb-6">
        Employee Growth
      </h2>

      {chartData.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-slate-500">
          No employee growth data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={chartData}>

          <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              allowDecimals={false}
            />

<Tooltip
    contentStyle={{
        borderRadius: "12px",
        border: "none",
        boxShadow: "0 10px 25px rgba(0,0,0,.12)",
    }}
/>

            <Line
    type="monotone"
    dataKey="employees"
    stroke="#2563eb"
    strokeWidth={3}
    dot={{
        r: 5,
        fill: "#2563eb",
    }}
    activeDot={{
        r: 8,
    }}
/>

          </LineChart>

        </ResponsiveContainer>
      )}

    </div>
  );
};

export default EmployeeGrowthChart;