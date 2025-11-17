import Department from "../models/Department.js";

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    console.error("Get departments error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch departments from server",
    });
  }
};

// Add a new department
const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    if (!dep_name) {
      return res.status(400).json({ success: false, error: "Department name is required" });
    }

    const newDep = new Department({ dep_name, description });
    await newDep.save();
    return res.status(201).json({ success: true, department: newDep });
  } catch (error) {
    console.error("Add department error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to add department",
    });
  }
};

// Get a single department by ID
const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, error: "Invalid department ID" });
    }

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, department });
  } catch (error) {
    console.error("Get single department error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch department",
    });
  }
};

// Update a department by ID
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, error: "Invalid department ID" });
    }

    const updateDep = await Department.findByIdAndUpdate(
      id,
      { dep_name, description },
      { new: true }
    );

    if (!updateDep) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, department: updateDep });
  } catch (error) {
    console.error("Update department error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update department",
    });
  }
};

// Delete a department by ID
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, error: "Invalid department ID" });
    }

    const deletedDep = await Department.findById(id);

    if (!deletedDep) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    await deletedDep.deleteOne();
    return res.status(200).json({ success: true, department: deletedDep });
  } catch (error) {
    console.error("Delete department error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete department",
    });
  }
};

// ✅ Export all functions
export {
  addDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
