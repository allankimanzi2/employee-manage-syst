import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const SummaryCard = ({
  icon,
  text,
  number,
  color,
  trend,
}) => {
  const isPositive = trend?.startsWith("+");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>

          <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">
            {text}
          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-3">
            {number}
          </h2>

        </div>

        <div
          className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}
        >
          {icon}
        </div>

      </div>

      {/* Footer */}

      <div className="flex justify-between items-center mt-6">

        <span className="text-sm text-slate-400">
          Compared to last month
        </span>

        {trend && (
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
              isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isPositive ? (
              <FaArrowUp size={10} />
            ) : (
              <FaArrowDown size={10} />
            )}

            {trend}
          </div>
        )}

      </div>

    </div>
  );
};

export default SummaryCard;