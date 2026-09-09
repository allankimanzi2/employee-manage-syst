import mongoose from "mongoose";

const { Schema } = mongoose;

const salarySchema = new Schema(
  {
    // ========================================================
    // EMPLOYEE
    // ========================================================

    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },

    // ========================================================
    // PAYROLL PERIOD
    // ========================================================

    payrollMonth: {
      type: String,
      required: true,
      enum: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },

    payrollYear: {
      type: Number,
      required: true,
    },

    // ========================================================
    // EARNINGS
    // ========================================================

    basicSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    allowances: {
      type: Number,
      default: 0,
      min: 0,
    },

    tripEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },

    overtime: {
      type: Number,
      default: 0,
      min: 0,
    },

    bonuses: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================================
    // LUNCH ALLOWANCE
    // KSH 100 FOR EACH QUALIFYING ON-SITE WORKDAY
    // ========================================================

    lunchDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    lunchRate: {
      type: Number,
      default: 100,
      min: 0,
    },

    lunchAllowance: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================================
    // GROSS SALARY
    // ========================================================

    grossSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    // ========================================================
    // EMPLOYEE STATUTORY DEDUCTIONS
    // ========================================================

    nssf: {
      type: Number,
      default: 0,
      min: 0,
    },

    shif: {
      type: Number,
      default: 0,
      min: 0,
    },

    housingLevy: {
      type: Number,
      default: 0,
      min: 0,
    },

    paye: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================================
    // OTHER EMPLOYEE DEDUCTIONS
    // ========================================================

    // Monthly employee advance
    advance: {
      type: Number,
      default: 0,
      min: 0,
    },
    advanceDeductions: {
      type: Number,
      default: 0,
      min: 0,
    },

    loanDeductions: {
      type: Number,
      default: 0,
      min: 0,
    },

    incidentDeductions: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherDeductions: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================================
    // TOTAL DEDUCTIONS
    // ========================================================

    deductions: {
      type: Number,
      required: true,
      min: 0,
    },

    // ========================================================
    // NET SALARY
    // ========================================================

    netSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    // ========================================================
    // EMPLOYER CONTRIBUTIONS
    // ========================================================

    employerNssf: {
      type: Number,
      default: 0,
      min: 0,
    },

    employerHousingLevy: {
      type: Number,
      default: 0,
      min: 0,
    },

    nita: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================================
    // TOTAL EMPLOYER COST
    // ========================================================

    totalEmployerContributions: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPayrollCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================================
    // PAYMENT
    // ========================================================

    payDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processed",
        "Paid",
      ],
      default: "Pending",
    },

    // ========================================================
    // OPTIONAL NOTES
    // ========================================================

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// PREVENT DUPLICATE PAYROLL
// ONE PAYROLL PER EMPLOYEE PER MONTH/YEAR
// ============================================================

salarySchema.index(
  {
    employeeId: 1,
    payrollMonth: 1,
    payrollYear: 1,
  },
  {
    unique: true,
  }
);

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;