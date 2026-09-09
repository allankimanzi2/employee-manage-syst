import {
  FaUserCheck,
  FaHome,
  FaUmbrellaBeach,
  FaUserTimes,
  FaBirthdayCake,
  FaAward,
} from "react-icons/fa";

const WorkforceOverview = () => {
  const items = [
    {
      label: "Present",
      value: 128,
      icon: <FaUserCheck />,
      color: "text-green-600",
    },
    {
      label: "Remote",
      value: 16,
      icon: <FaHome />,
      color: "text-blue-600",
    },
    {
      label: "On Leave",
      value: 9,
      icon: <FaUmbrellaBeach />,
      color: "text-amber-600",
    },
    {
      label: "Absent",
      value: 2,
      icon: <FaUserTimes />,
      color: "text-red-600",
    },
    {
      label: "Birthdays",
      value: 1,
      icon: <FaBirthdayCake />,
      color: "text-pink-600",
    },
    {
      label: "Anniversaries",
      value: 3,
      icon: <FaAward />,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Today's Workforce</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <div className={`text-2xl ${item.color}`}>{item.icon}</div>

            <div>
              <div className="text-2xl font-bold">{item.value}</div>

              <div className="text-sm text-slate-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkforceOverview;