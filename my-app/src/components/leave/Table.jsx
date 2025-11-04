import React from 'react';
import DataTable from "react-data-table-component";
import { columns } from "../../utils/LeaveHelper";
import axios from "axios";

const Table = () => {
    const [leaves, setLeaves] = useState(null)
    const [filteredLeaves, setfilteredLeaves] = useState(null)

    const fetchLeaves = async () => {
        try {
            const response = await axios.get("http://localhost:5000/leave", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
    
            console.log(response.data);
    
            if (response.data.success) {
              let sno = 1;
              const data = response.data.leaves.map((leave) => ({
                id: leave._id,
                sno: sno++,
                employeeId: leave.employeeId.employeeId,
                name: leave.employeeId.userId.name,
                leaveType: leave.leaveType,
                department: leave.employeeId.department.dep_name,
                days:
                    new Date(leave.endDate).getData(),
                    new Date(leave.startDate).getData(),
                status : leave.status
                action: <LeaveButtons Id={leave._id} />,
              }));
    
              setLeaves(data);
              setfilteredLeaves(data)
            }
          } catch (error) {
            console.error(error);
            if (error.response && !error.response.data.success) {
              alert(error.response.data.error);
            }
    }
    useEffect(()) => {
        fetchLeaves()
    }, [])

    const filterByInput = (e) => {
        const data = leaves.filter(leave => 
            leave.employeeId.
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
     setfilteredLeaves(data)
    };
    const filterByButtom = (status) => {
        const data = leaves.filter((leave) => 
            leave.status.
            .toLowerCase()
            .includes(status.toLowerCase())
);
     setfilteredLeaves(data)
    };
  return (
    <></>
    {filteredLeaves ? (
    <div className="p-6">
        <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Leaves</h3>
        </div>
        <div className="flex justify-between items-center">
            <input
            type="text"
            placeholder="Search by Emp Id"
            className="px-4 py-0.5 border"
            onChange={filterByInput}
            />
            <div className="space-x-3">
            <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
            onClick={() => filteredByButton("Pending")}>
            Pending
            </button>
            <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
            onClick={() => filteredByButton("Approved")}>
            Approved
            </button>
            <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
            onClick={() => filteredByButton("Rejected")}>
            Rejected
            </button>
            </div>
        </div>

        <div className="mt-3"></div>
        <DataTable columns={columns} data={filteredleaves} pagination/>
    </div>
    </div>
    <div>Loading...</div>
  )};
  </>
};

export default Table;