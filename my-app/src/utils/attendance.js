import API from "./api";

// Check an employee in for today
export const checkInEmployee = async (employeeId, workMode = "On-site") => {
  const { data } = await API.post("/attendance/check-in", {
    employeeId,
    workMode,
  });

  return data;
};

// Check an employee out for today
export const checkOutEmployee = async (employeeId) => {
  const { data } = await API.post("/attendance/check-out", {
    employeeId,
  });

  return data;
};

// Get today's attendance records
export const getTodayAttendance = async () => {
  const { data } = await API.get("/attendance/today");

  return data;
};
