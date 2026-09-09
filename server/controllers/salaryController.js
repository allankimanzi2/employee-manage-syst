import mongoose from "mongoose";
import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";
import { calculatePayroll } from "../utils/payrollCalculator.js";

// ============================================================
// MONTHS
// ============================================================

const MONTHS = [
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
];

// ============================================================
// HELPERS
// ============================================================

const normalizePayrollMonth = (month) => {
  if (month == null) {
    return null;
  }

  const value = String(month).trim();

  // Accept "January", "january", etc.
  const exactMonth = MONTHS.find(
    (item) =>
      item.toLowerCase() === value.toLowerCase()
  );

  if (exactMonth) {
    return exactMonth;
  }

  // Accept 1 - 12
  const numericMonth = Number(value);

  if (
    Number.isInteger(numericMonth) &&
    numericMonth >= 1 &&
    numericMonth <= 12
  ) {
    return MONTHS[numericMonth - 1];
  }

  return null;
};

// ------------------------------------------------------------
// NUMBER NORMALIZER
// ------------------------------------------------------------

const toNonNegativeNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(number, 0);
};

// ------------------------------------------------------------
// POPULATE SALARY
// ------------------------------------------------------------

const populateSalary = (query) =>
  query.populate({
    path: "employeeId",
    populate: [
      {
        path: "userId",
        select: "name email profileImage",
      },
      {
        path: "department",
        select: "dep_name",
      },
    ],
  });

// ============================================================
// ADD PAYROLL
// ADMIN ONLY
// ============================================================

const addSalary = async (req, res) => {
  try {
    // ========================================================
    // ADMIN CHECK
    // ========================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error:
          "Only administrators can create payroll records",
      });
    }

    // ========================================================
    // REQUEST BODY
    // ========================================================

    const {
      employeeId,
      payrollMonth,
      payrollYear,

      // ------------------------------------------------------
      // EARNINGS
      // ------------------------------------------------------

      basicSalary,
      allowances,

      // Lunch allowance
      lunchDays,
      lunchRate,
      lunchAllowance,

      tripEarnings,
      overtime,
      bonuses,
      otherEarnings,

      // ------------------------------------------------------
      // DEDUCTIONS
      // ------------------------------------------------------

      advance,
      advanceDeductions,

      loanDeductions,
      incidentDeductions,
      otherDeductions,

      // ------------------------------------------------------
      // PAYMENT
      // ------------------------------------------------------

      payDate,
      status,
      notes,
    } = req.body;

    // ========================================================
    // REQUIRED FIELDS
    // ========================================================

    if (
      !employeeId ||
      !payrollMonth ||
      payrollYear == null ||
      basicSalary == null ||
      !payDate
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Employee, payroll month, year, basic salary and pay date are required",
      });
    }

    // ========================================================
    // VALIDATE EMPLOYEE ID
    // ========================================================

    if (
      !mongoose.Types.ObjectId.isValid(
        employeeId
      )
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid employee ID",
      });
    }

    // ========================================================
    // FIND EMPLOYEE
    // ========================================================

    const employee =
      await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    // ========================================================
    // VALIDATE YEAR
    // ========================================================

    const year = Number(payrollYear);

    if (
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid payroll year",
      });
    }

    // ========================================================
    // VALIDATE MONTH
    // ========================================================

    const normalizedMonth =
      normalizePayrollMonth(payrollMonth);

    if (!normalizedMonth) {
      return res.status(400).json({
        success: false,
        error: "Invalid payroll month",
      });
    }

    // ========================================================
    // NORMALIZE EARNINGS
    // ========================================================

    const basic =
      toNonNegativeNumber(basicSalary);

    const allow =
      toNonNegativeNumber(allowances);

    const trips =
      toNonNegativeNumber(tripEarnings);

    const overtimeAmount =
      toNonNegativeNumber(overtime);

    const bonusAmount =
      toNonNegativeNumber(bonuses);

    const otherEarn =
      toNonNegativeNumber(otherEarnings);

    // ========================================================
    // NORMALIZE LUNCH
    // ========================================================

    const normalizedLunchDays =
      toNonNegativeNumber(lunchDays);

    const normalizedLunchRate =
      lunchRate == null
        ? 100
        : toNonNegativeNumber(lunchRate);

    const normalizedLunchAllowance =
      lunchAllowance == null
        ? undefined
        : toNonNegativeNumber(
            lunchAllowance
          );

    // ========================================================
    // NORMALIZE DEDUCTIONS
    // ========================================================

    const normalizedAdvance =
      toNonNegativeNumber(advance);

    /*
     * If advanceDeductions is explicitly supplied,
     * use it.
     *
     * Otherwise, use the advance amount as the
     * monthly deduction.
     */
    const normalizedAdvanceDeductions =
      advanceDeductions != null
        ? toNonNegativeNumber(
            advanceDeductions
          )
        : normalizedAdvance;

    const loans =
      toNonNegativeNumber(loanDeductions);

    const incidents =
      toNonNegativeNumber(
        incidentDeductions
      );

    const otherDeduct =
      toNonNegativeNumber(
        otherDeductions
      );

    // ========================================================
    // BASIC SALARY VALIDATION
    // ========================================================

    if (basic <= 0) {
      return res.status(400).json({
        success: false,
        error:
          "Basic salary must be greater than zero",
      });
    }

    // ========================================================
    // CHECK DUPLICATE PAYROLL
    // ========================================================

    const existingPayroll =
      await Salary.findOne({
        employeeId,
        payrollMonth: normalizedMonth,
        payrollYear: year,
      });

    if (existingPayroll) {
      return res.status(409).json({
        success: false,
        error:
          `Payroll for ${normalizedMonth} ${year} already exists for this employee`,
      });
    }

    // ========================================================
    // CALCULATE COMPLETE PAYROLL
    // ========================================================

    const payroll =
      calculatePayroll({
        // Earnings
        basicSalary: basic,
        allowances: allow,

        // Lunch
        lunchDays:
          normalizedLunchDays,

        lunchRate:
          normalizedLunchRate,

        lunchAllowance:
          normalizedLunchAllowance,

        // Other earnings
        tripEarnings: trips,
        overtime: overtimeAmount,
        bonuses: bonusAmount,
        otherEarnings: otherEarn,

        // Deductions
        advanceDeductions:
          normalizedAdvanceDeductions,

        loanDeductions: loans,
        incidentDeductions: incidents,
        otherDeductions: otherDeduct,
      });

    // ========================================================
    // EXTRACT CALCULATED VALUES
    // ========================================================

    const {
      grossSalary,

      // Lunch
      lunchAllowance:
        calculatedLunchAllowance,

      // Statutory deductions
      nssf,
      shif,
      housingLevy,
      paye,

      // Other deductions
      advanceDeductions:
        calculatedAdvanceDeductions,

      loanDeductions:
        calculatedLoanDeductions,

      incidentDeductions:
        calculatedIncidentDeductions,

      otherDeductions:
        calculatedOtherDeductions,

      totalDeductions,
      netSalary,

      // Employer
      employerNssf,
      employerHousingLevy,
      nita,

      totalEmployerContributions,
      totalPayrollCost,

      taxableIncome,
    } = payroll;

    // ========================================================
    // VALIDATE CALCULATION
    // ========================================================

    if (
      !Number.isFinite(grossSalary) ||
      !Number.isFinite(totalDeductions) ||
      !Number.isFinite(netSalary)
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Payroll calculation produced invalid values",
      });
    }

    // ========================================================
    // VALIDATE NET SALARY
    // ========================================================

    if (netSalary < 0) {
      return res.status(400).json({
        success: false,
        error:
          "Total deductions cannot exceed gross salary",
      });
    }

    // ========================================================
    // VALIDATE STATUS
    // ========================================================

    const validStatuses = [
      "Pending",
      "Processed",
      "Paid",
    ];

    const payrollStatus =
      status || "Pending";

    if (
      !validStatuses.includes(
        payrollStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid payroll status",
      });
    }

    // ========================================================
    // CREATE PAYROLL
    // ========================================================

    const newSalary = new Salary({
      employeeId,

      payrollMonth:
        normalizedMonth,

      payrollYear:
        year,

      // ======================================================
      // EARNINGS
      // ======================================================

      basicSalary: basic,

      allowances: allow,

      tripEarnings: trips,

      overtime: overtimeAmount,

      bonuses: bonusAmount,

      otherEarnings: otherEarn,

      // ======================================================
      // LUNCH ALLOWANCE
      // ======================================================

      lunchDays:
        normalizedLunchDays,

      lunchRate:
        normalizedLunchRate,

      lunchAllowance:
        calculatedLunchAllowance || 0,

      // ======================================================
      // GROSS
      // ======================================================

      grossSalary,

      // ======================================================
      // STATUTORY DEDUCTIONS
      // ======================================================

      nssf,

      shif,

      housingLevy,

      paye,

      // ======================================================
      // OTHER DEDUCTIONS
      // ======================================================

      advance:
        normalizedAdvance,

      advanceDeductions:
        calculatedAdvanceDeductions ||
        0,

      loanDeductions:
        calculatedLoanDeductions || 0,

      incidentDeductions:
        calculatedIncidentDeductions ||
        0,

      otherDeductions:
        calculatedOtherDeductions || 0,

      // ======================================================
      // TOTAL DEDUCTIONS
      // ======================================================

      deductions:
        totalDeductions,

      // ======================================================
      // NET
      // ======================================================

      netSalary,

      // ======================================================
      // EMPLOYER CONTRIBUTIONS
      // ======================================================

      employerNssf,

      employerHousingLevy,

      nita,

      totalEmployerContributions,

      totalPayrollCost,

      // ======================================================
      // PAYMENT
      // ======================================================

      payDate,

      status: payrollStatus,

      notes:
        typeof notes === "string"
          ? notes.trim()
          : "",
    });

    // ========================================================
    // SAVE
    // ========================================================

    await newSalary.save();

    // ========================================================
    // POPULATE
    // ========================================================

    const populatedSalary =
      await populateSalary(
        Salary.findById(
          newSalary._id
        )
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(201).json({
      success: true,

      message:
        "Payroll created successfully",

      salary:
        populatedSalary,

      calculation: {
        taxableIncome,

        grossSalary,

        lunchAllowance:
          calculatedLunchAllowance || 0,

        nssf,

        shif,

        housingLevy,

        paye,

        advanceDeductions:
          calculatedAdvanceDeductions ||
          0,

        totalDeductions,

        netSalary,

        totalEmployerContributions,

        totalPayrollCost,
      },
    });
  } catch (error) {
    console.error(
      "ADD PAYROLL ERROR:",
      error
    );

    // Duplicate unique index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error:
          "A payroll record already exists for this employee and period",
      });
    }

    return res.status(500).json({
      success: false,
      error:
        "Server error while creating payroll",
    });
  }
};

// ============================================================
// GET PAYROLL
// ADMIN → SELECTED EMPLOYEE
// EMPLOYEE → OWN PAYROLL
// ============================================================

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error:
          "Employee ID is required",
      });
    }

    // ========================================================
    // ADMIN
    // ========================================================

    if (req.user.role === "admin") {
      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid employee ID",
        });
      }

      const employee =
        await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          error:
            "Employee not found",
        });
      }

      const salaries =
        await populateSalary(
          Salary.find({
            employeeId: employee._id,
          }).sort({
            payrollYear: -1,
            createdAt: -1,
          })
        );

      return res.status(200).json({
        success: true,
        salary: salaries,
      });
    }

    // ========================================================
    // EMPLOYEE
    // ========================================================

    const employee =
      await Employee.findOne({
        userId: req.user._id,
      });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error:
          "Employee profile not found",
      });
    }

    const salaries =
      await populateSalary(
        Salary.find({
          employeeId: employee._id,
        }).sort({
          payrollYear: -1,
          createdAt: -1,
        })
      );

    return res.status(200).json({
      success: true,
      salary: salaries,
    });
  } catch (error) {
    console.error(
      "GET PAYROLL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Server error while fetching payroll",
    });
  }
};

// ============================================================
// GET PAYSLIP
// ============================================================

const getPayslip = async (
  req,
  res
) => {
  try {
    const { salaryId } = req.params;

    // ========================================================
    // VALIDATE ID
    // ========================================================

    if (
      !salaryId ||
      !mongoose.Types.ObjectId.isValid(
        salaryId
      )
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid salary ID",
      });
    }

    // ========================================================
    // FIND PAYROLL
    // ========================================================

    const salary =
      await populateSalary(
        Salary.findById(salaryId)
      );

    if (!salary) {
      return res.status(404).json({
        success: false,
        error:
          "Payroll record not found",
      });
    }

    // ========================================================
    // ONLY PAID PAYROLL
    // ========================================================

    if (salary.status !== "Paid") {
      return res.status(403).json({
        success: false,
        error:
          "Payslip is only available after payroll has been paid",
      });
    }

    // ========================================================
    // ADMIN
    // ========================================================

    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        salary,
      });
    }

    // ========================================================
    // EMPLOYEE
    // ========================================================

    const employee =
      await Employee.findOne({
        userId: req.user._id,
      });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error:
          "Employee profile not found",
      });
    }

    // ========================================================
    // PREVENT ACCESS TO OTHER EMPLOYEE
    // ========================================================

    if (
      salary.employeeId._id.toString() !==
      employee._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error:
          "You are not authorized to access this payslip",
      });
    }

    return res.status(200).json({
      success: true,
      salary,
    });
  } catch (error) {
    console.error(
      "GET PAYSLIP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Server error while fetching payslip",
    });
  }
};

// ============================================================
// GET PAYROLL REPORTS
// ADMIN ONLY
// ============================================================

const getPayrollReports = async (
  req,
  res
) => {
  try {
    // ========================================================
    // ADMIN CHECK
    // ========================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error:
          "Only administrators can view payroll reports",
      });
    }

    // ========================================================
    // QUERY PARAMETERS
    // ========================================================

    const {
      month,
      year,
      status,
      department,
    } = req.query;

    const filter = {};

    // ========================================================
    // YEAR
    // ========================================================

    if (year) {
      const payrollYear =
        Number(year);

      if (
        !Number.isInteger(
          payrollYear
        ) ||
        payrollYear < 2000 ||
        payrollYear > 2100
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid payroll year",
        });
      }

      filter.payrollYear =
        payrollYear;
    }

    // ========================================================
    // MONTH
    // ========================================================

    let normalizedMonth = null;

    if (month) {
      normalizedMonth =
        normalizePayrollMonth(month);

      if (!normalizedMonth) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid payroll month",
        });
      }

      filter.payrollMonth =
        normalizedMonth;
    }

    // ========================================================
    // STATUS
    // ========================================================

    if (status) {
      const validStatuses = [
        "Pending",
        "Processed",
        "Paid",
      ];

      if (
        !validStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid payroll status",
        });
      }

      filter.status = status;
    }

    // ========================================================
    // DEPARTMENT
    // ========================================================

    if (department) {
      if (
        !mongoose.Types.ObjectId.isValid(
          department
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid department ID",
        });
      }

      const employees =
        await Employee.find({
          department,
        }).select("_id");

      const employeeIds =
        employees.map(
          (employee) => employee._id
        );

      filter.employeeId = {
        $in: employeeIds,
      };
    }

    // ========================================================
    // FETCH PAYROLL
    // ========================================================

    const salaries =
      await populateSalary(
        Salary.find(filter).sort({
          payrollYear: -1,
          createdAt: -1,
        })
      );

    // ========================================================
    // TOTALS
    // ========================================================

    const totals =
      salaries.reduce(
        (acc, salary) => {
          // --------------------------------------------------
          // EARNINGS
          // --------------------------------------------------

          const grossSalary =
            Number(
              salary.grossSalary
            ) || 0;

          const basicSalary =
            Number(
              salary.basicSalary
            ) || 0;

          const allowances =
            Number(
              salary.allowances
            ) || 0;

          const lunchDays =
            Number(
              salary.lunchDays
            ) || 0;

          const lunchRate =
            Number(
              salary.lunchRate
            ) || 0;

          const lunchAllowance =
            Number(
              salary.lunchAllowance
            ) || 0;

          const tripEarnings =
            Number(
              salary.tripEarnings
            ) || 0;

          const overtime =
            Number(
              salary.overtime
            ) || 0;

          const bonuses =
            Number(
              salary.bonuses
            ) || 0;

          const otherEarnings =
            Number(
              salary.otherEarnings
            ) || 0;

          // --------------------------------------------------
          // DEDUCTIONS
          // --------------------------------------------------

          const nssf =
            Number(
              salary.nssf
            ) || 0;

          const shif =
            Number(
              salary.shif
            ) || 0;

          const housingLevy =
            Number(
              salary.housingLevy
            ) || 0;

          const paye =
            Number(
              salary.paye
            ) || 0;

          const advance =
            Number(
              salary.advance
            ) || 0;

          const advanceDeductions =
            Number(
              salary.advanceDeductions
            ) || 0;

          const loanDeductions =
            Number(
              salary.loanDeductions
            ) || 0;

          const incidentDeductions =
            Number(
              salary.incidentDeductions
            ) || 0;

          const otherDeductions =
            Number(
              salary.otherDeductions
            ) || 0;

          const totalDeductions =
            Number(
              salary.deductions
            ) || 0;

          const netSalary =
            Number(
              salary.netSalary
            ) || 0;

          // --------------------------------------------------
          // EMPLOYER
          // --------------------------------------------------

          const employerNssf =
            Number(
              salary.employerNssf
            ) || 0;

          const employerHousingLevy =
            Number(
              salary.employerHousingLevy
            ) || 0;

          const nita =
            Number(
              salary.nita
            ) || 0;

          const totalEmployerContributions =
            employerNssf +
            employerHousingLevy +
            nita;

          const totalPayrollCost =
            grossSalary +
            totalEmployerContributions;

          // --------------------------------------------------
          // ADD TOTALS
          // --------------------------------------------------

          acc.grossSalary +=
            grossSalary;

          acc.basicSalary +=
            basicSalary;

          acc.allowances +=
            allowances;

          acc.lunchDays +=
            lunchDays;

          acc.lunchAllowance +=
            lunchAllowance;

          acc.tripEarnings +=
            tripEarnings;

          acc.overtime +=
            overtime;

          acc.bonuses +=
            bonuses;

          acc.otherEarnings +=
            otherEarnings;

          acc.nssf +=
            nssf;

          acc.shif +=
            shif;

          acc.housingLevy +=
            housingLevy;

          acc.paye +=
            paye;

          acc.advance +=
            advance;

          acc.advanceDeductions +=
            advanceDeductions;

          acc.loanDeductions +=
            loanDeductions;

          acc.incidentDeductions +=
            incidentDeductions;

          acc.otherDeductions +=
            otherDeductions;

          acc.totalDeductions +=
            totalDeductions;

          acc.netSalary +=
            netSalary;

          acc.employerNssf +=
            employerNssf;

          acc.employerHousingLevy +=
            employerHousingLevy;

          acc.nita +=
            nita;

          acc.totalEmployerContributions +=
            totalEmployerContributions;

          acc.totalPayrollCost +=
            totalPayrollCost;

          return acc;
        },
        {
          grossSalary: 0,

          basicSalary: 0,
          allowances: 0,

          lunchDays: 0,
          lunchAllowance: 0,

          tripEarnings: 0,
          overtime: 0,
          bonuses: 0,
          otherEarnings: 0,

          nssf: 0,
          shif: 0,
          housingLevy: 0,
          paye: 0,

          advance: 0,
          advanceDeductions: 0,

          loanDeductions: 0,
          incidentDeductions: 0,
          otherDeductions: 0,

          totalDeductions: 0,
          netSalary: 0,

          employerNssf: 0,
          employerHousingLevy: 0,
          nita: 0,

          totalEmployerContributions: 0,
          totalPayrollCost: 0,
        }
      );

    // ========================================================
    // STATUS SUMMARY
    // ========================================================

    const statusSummary = {
      Pending: 0,
      Processed: 0,
      Paid: 0,
    };

    salaries.forEach((salary) => {
      if (
        Object.prototype.hasOwnProperty.call(
          statusSummary,
          salary.status
        )
      ) {
        statusSummary[
          salary.status
        ]++;
      }
    });

    // ========================================================
    // DEPARTMENT BREAKDOWN
    // ========================================================

    const departmentSummary = {};

    salaries.forEach((salary) => {
      const departmentId =
        salary.employeeId
          ?.department?._id
          ?.toString() ||
        "unassigned";

      const departmentName =
        salary.employeeId
          ?.department
          ?.dep_name ||
        "Unassigned";

      if (
        !departmentSummary[
          departmentId
        ]
      ) {
        departmentSummary[
          departmentId
        ] = {
          departmentId,

          departmentName,

          employeeCount: 0,

          grossSalary: 0,

          totalDeductions: 0,

          netSalary: 0,

          employerContributions: 0,

          totalPayrollCost: 0,
        };
      }

      const grossSalary =
        Number(
          salary.grossSalary
        ) || 0;

      const deductions =
        Number(
          salary.deductions
        ) || 0;

      const netSalary =
        Number(
          salary.netSalary
        ) || 0;

      const employerNssf =
        Number(
          salary.employerNssf
        ) || 0;

      const employerHousingLevy =
        Number(
          salary.employerHousingLevy
        ) || 0;

      const nita =
        Number(
          salary.nita
        ) || 0;

      const employerContributions =
        employerNssf +
        employerHousingLevy +
        nita;

      const totalPayrollCost =
        grossSalary +
        employerContributions;

      // ------------------------------------------------------
      // ADD DEPARTMENT TOTALS
      // ------------------------------------------------------

      departmentSummary[
        departmentId
      ].employeeCount += 1;

      departmentSummary[
        departmentId
      ].grossSalary +=
        grossSalary;

      departmentSummary[
        departmentId
      ].totalDeductions +=
        deductions;

      departmentSummary[
        departmentId
      ].netSalary +=
        netSalary;

      departmentSummary[
        departmentId
      ].employerContributions +=
        employerContributions;

      departmentSummary[
        departmentId
      ].totalPayrollCost +=
        totalPayrollCost;
    });

    const departmentBreakdown =
      Object.values(
        departmentSummary
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({
      success: true,

      filters: {
        month:
          normalizedMonth || "All",

        year:
          year
            ? Number(year)
            : "All",

        status:
          status || "All",

        department:
          department || "All",
      },

      summary: {
        employeeCount:
          salaries.length,

        ...totals,
      },

      statusSummary,

      departmentBreakdown,

      salaries,
    });
  } catch (error) {
    console.error(
      "GET PAYROLL REPORTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Server error while generating payroll report",
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

export {
  addSalary,
  getSalary,
  getPayslip,
  getPayrollReports,
};