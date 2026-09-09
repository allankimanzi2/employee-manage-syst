import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
  } from "recharts";
  
  const DepartmentChart = ({ data = [] }) => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold mb-6">
          Employees by Department
        </h2>
  
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            No department data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="employees"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  };
  
  export default DepartmentChart;