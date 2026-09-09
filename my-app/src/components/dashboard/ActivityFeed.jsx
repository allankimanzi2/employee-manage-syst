import {
    FaUserPlus,
    FaCheckCircle,
    FaBuilding,
    FaCalendarAlt,
  } from "react-icons/fa";
  
  const ActivityFeed = () => {
    const activities = [
      {
        icon: <FaUserPlus />,
        color: "bg-blue-100 text-blue-600",
        title: "New employee added",
        time: "10 minutes ago",
      },
      {
        icon: <FaCheckCircle />,
        color: "bg-green-100 text-green-600",
        title: "Leave approved",
        time: "45 minutes ago",
      },
      {
        icon: <FaBuilding />,
        color: "bg-purple-100 text-purple-600",
        title: "Department updated",
        time: "Today",
      },
      {
        icon: <FaCalendarAlt />,
        color: "bg-amber-100 text-amber-600",
        title: "Payroll processed",
        time: "Yesterday",
      },
    ];
  
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
  
        <h2 className="text-xl font-bold mb-6">
          Recent Activity
        </h2>
  
        <div className="space-y-5">
  
          {activities.map((activity, index) => (
  
            <div
              key={index}
              className="flex items-center gap-4"
            >
  
              <div
                className={`${activity.color} p-3 rounded-xl text-lg`}
              >
                {activity.icon}
              </div>
  
              <div className="flex-1">
  
                <p className="font-medium text-slate-700">
                  {activity.title}
                </p>
  
                <p className="text-sm text-slate-400">
                  {activity.time}
                </p>
  
              </div>
  
            </div>
  
          ))}
  
        </div>
  
      </div>
    );
  };
  
  export default ActivityFeed;