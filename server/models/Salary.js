import mongoose from "mongoose";

const { Schema } = mongoose;

const salarySchema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    payDate: { type: Date, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Pre-save hook to ensure netSalary is always correct
salarySchema.pre("save", function (next) {
  // Ensure numbers are valid
  const basic = Number(this.basicSalary) || 0;
  const allow = Number(this.allowances) || 0;
  const deduct = Number(this.deductions) || 0;

  this.netSalary = basic + allow - deduct;
  next();
});

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;

