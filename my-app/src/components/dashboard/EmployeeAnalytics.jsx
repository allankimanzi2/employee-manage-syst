import {
    FaUserPlus,
    FaUserCheck,
    FaBirthdayCake,
    FaSignOutAlt,
  } from "react-icons/fa";
  
  const EmployeeAnalytics = ({ summary }) => {
    const cards = [
      {
        title: "New Hires",
        value: summary?.recentEmployees?.length || 0,
        subtitle: "Last few additions",
        icon: <FaUserPlus />,
        color: "bg-blue-600",
      },
      {
        title: "Active Employees",
        value: summary?.totalEmployees || 0,
        subtitle: "Currently employed",
        icon: <FaUserCheck />,
        color: "bg-emerald-600",
      },
      {
        title: "Upcoming Birthdays",
        value: 0,
        subtitle: "Next 30 days",
        icon: <FaBirthdayCake />,
        color: "bg-pink-500",
      },
      {
        title: "Turnover",
        value: "0%",
        subtitle: "This month",
        icon: <FaSignOutAlt />,
        color: "bg-red-500",
      },
    ];
  
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
  
        {cards.map((card) => (
  
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
          >
  
            <div
              className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4`}
            >
              {card.icon}
            </div>
  
            <h3 className="text-3xl font-bold text-slate-800">
              {card.value}
            </h3>
  
            <p className="font-medium mt-2">
              {card.title}
            </p>
  
            <p className="text-sm text-slate-500">
              {card.subtitle}
            </p>
  
          </div>
  
        ))}
  
      </div>
    );
  };
  
  export default EmployeeAnalytics;