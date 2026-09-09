import React from "react";

const QuickActions = () => {

    return (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
           
        <h2 className="text-xl font-bold mb-5">

                Quick Actions

            </h2>

            <div className="grid grid-cols-2 gap-4">

                <button className="bg-emerald-600 text-white rounded-xl p-4 hover:bg-emerald-700">
                    Add Employee
                </button>

                <button className="bg-blue-600 text-white rounded-xl p-4 hover:bg-blue-700">
                    New Department
                </button>

                <button className="bg-purple-600 text-white rounded-xl p-4 hover:bg-purple-700">
                    Process Payroll
                </button>

                <button className="bg-orange-600 text-white rounded-xl p-4 hover:bg-orange-700">
                    Approve Leave
                </button>

            </div>

        </div>

    );

};

export default QuickActions;