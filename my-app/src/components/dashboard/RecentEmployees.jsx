import React from "react";
const RecentEmployees = ({ employees = [] }) => {
  

        // Show only the latest 5 employees
        setEmployees(response.data.employees.slice(0, 5));
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      <h2 className="text-xl font-bold mb-5">
        Recent Employees
      </h2>

      <table className="w-full">

        <thead>
          <tr className="border-b">
            <th className="text-left pb-3">Employee</th>
            <th className="text-left pb-3">Department</th>
            <th className="text-left pb-3">Status</th>
          </tr>
        </thead>

        <tbody>

          {employees.map((employee) => (

            <tr
              key={employee._id}
              className="border-b last:border-none"
            >

              <td className="py-4">
                {employee.userId?.name}
              </td>

              <td>
                {employee.department?.dep_name}
              </td>

              <td>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  Active
                </span>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};


export default RecentEmployees;