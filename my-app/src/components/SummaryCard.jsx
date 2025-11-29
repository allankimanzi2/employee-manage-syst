import React from 'react';

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="rounded flex bg-white shadow p-2">
      <div className={`text-3xl flex justify-center items-center ${color} text-white px-4 py-4`}>
        {icon}
      </div>
      <div className="pl-4 py-2">
        <p className="text-lg font-semibold">{text}</p>
        <p className="text-xl font-bold">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
