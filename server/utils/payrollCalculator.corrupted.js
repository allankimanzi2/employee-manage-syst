<<'EOF'
/**
 * ============================================================
 * SMARTJOBS PAYROLL CALCULATOR
 * ============================================================
 *
 * Pure payroll calculation utility.
 *
 * IMPORTANT:
 * - No Express/controller logic here.
 * - No MongoDB/Mongoose logic here.
 * - No database calls here.
 * - All inputs are normalized to non-negative numbers.
 *
 * Current statutory configuration:
 *
 * NSSF 2026 Year 4:
 *   Employee: 6% of pensionable pay
 *   Maximum employee contribution: KSh 6,480
 *   Maximum employer contribution: KSh 6,480
 *
 * SHIF:
 *   2.75% of gross salary
 *   Minimum KSh 300
 *
 * Affordable Housing Levy:
 *   Employee: 1.5% of gross salary
 *   Employer: 1.5% of gross salary
 *
 * NITA:
 *   Employer: KSh 50 per employee/month
 *
 * PAYE:
 *   First KSh 24,000       -> 10%
 *   Next KSh 8,333         -> 25%
 *   Next KSh 467,667       -> 30%
 *   Next KSh 300,000       -> 32.5%
 *   Above KSh 800,000      -> 35%
 *
 * Personal relief:
 *   KSh 2,400/month
 * ============================================================
 */

// ============================================================
// HELPERS
// ============================================================

const toNonNegativeNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(number, 0);
};

const roundMoney = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.round((number + Number.EPSILON) * 100) / 100;
};

// ============================================================
// CURRENT STATUTORY CONFIGURATION
// ============================================================

const PAYROLL_CONFIG = {
  // ----------------------------------------------------------
  // NSSF - 2026 YEAR 4
  // ----------------------------------------------------------

  nssf: {
    rate: 0.06,
    maximumPensionableSalary: 108000,
    maximumEmployeeContribution: 6480,
    maximumEmployerContribution: 6480,
  },

  // ----------------------------------------------------------
  // SHIF
  // ----------------------------------------------------------

  shif: {
    rate: 0.0275,
    minimumContribution: 300,
  },

  // ----------------------------------------------------------
  // AFFORDABLE HOUSING LEVY
  // ----------------------------------------------------------

  housingLevy: {
    employeeRate: 0.015,
    employerRate: 0.015,
  },

  // ----------------------------------------------------------
  // NITA
  // ----------------------------------------------------------

  nita: {
    monthlyPerEmployee: 50,
  },

  // ----------------------------------------------------------
  // PAYE
  // ----------------------------------------------------------

  paye: {
    personalRelief: 2400,

    bands: [
      {
        limit: 24000,
        rate: 0.10,
      },
      {
        limit: 8333,
        rate: 0.25,
      },
      {
        limit: 467667,
        rate: 0.30,
      },
      {
        limit: 300000,
        rate: 0.325,
      },
      {
        limit: Infinity,
        rate: 0.35,
      },
    ],
  },
};

// ============================================================
// NSSF
// ============================================================

const calculateNssf = (grossSalary) => {
  const pensionableSalary = Math.min(
    toNonNegativeNumber(grossSalary),
    PAYROLL_CONFIG.nssf.maximumPensionableSalary
  );

  return roundMoney(
    Math.min(
      pensionableSalary *
        PAYROLL_CONFIG.nssf.rate,
      PAYROLL_CONFIG.nssf.maximumEmployeeContribution
    )
  );
};

// ============================================================
// SHIF
// ============================================================

const calculateShif = (grossSalary) => {
  const gross = toNonNegativeNumber(grossSalary);

  if (gross <= 0) {
    return 0;
  }

  return roundMoney(
    Math.max(
      gross * PAYROLL_CONFIG.shif.rate,
      PAYROLL_CONFIG.shif.minimumContribution
    )
  );
};

// ============================================================
// HOUSING LEVY
// ============================================================

const calculateHousingLevy = (grossSalary) => {
  const gross = toNonNegativeNumber(grossSalary);

  return roundMoney(
    gross * PAYROLL_CONFIG.housingLevy.employeeRate
  );
};

const calculateEmployerHousingLevy = (grossSalary) => {
  const gross = toNonNegativeNumber(grossSalary);

  return roundMoney(
    gross * PAYROLL_CONFIG.housingLevy.employerRate
  );
};

// ============================================================
// PAYE
// ============================================================

const calculateTaxBeforeRelief = (taxableIncome) => {
  let remaining = toNonNegativeNumber(taxableIncome);
  let tax = 0;

  for (const band of PAYROLL_CONFIG.paye.bands) {
    if (remaining <= 0) {
      break;
    }

    const taxableAtThisBand = Math.min(
      remaining,
      band.limit
    );

    tax += taxableAtThisBand * band.rate;
    remaining -= taxableAtThisBand;
  }

  return roundMoney(tax);
};

const calculatePaye = (taxableIncome) => {
  const taxable = toNonNegativeNumber(taxableIncome);

  if (taxable <= 0) {
    return 0;
  }

  const taxBeforeRelief =
    calculateTaxBeforeRelief(taxable);

  const paye =
    taxBeforeRelief -
    PAYROLL_CONFIG.paye.personalRelief;

  return roundMoney(Math.max(paye, 0));
};

// ============================================================
// LUNCH ALLOWANCE
// ============================================================

const calculateLunchAllowance = ({
  lunchDays,
  lunchRate,
  lunchAllowance,
}) => {
  const explicitAllowance =
    lunchAllowance == null
      ? undefined
      : toNonNegativeNumber(lunchAllowance);

  if (explicitAllowance !== undefined) {
    return roundMoney(explicitAllowance);
  }

  const days =
    toNonNegativeNumber(lunchDays);

  const rate =
    lunchRate == null
      ? 100
      : toNonNegativeNumber(lunchRate);

  return roundMoney(days * rate);
};

// ============================================================
// MAIN PAYROLL CALCULATOR
// ============================================================

export const calculatePayroll = ({
  // ----------------------------------------------------------
  // EARNINGS
  // ----------------------------------------------------------

  basicSalary = 0,
  allowances = 0,

  // ----------------------------------------------------------
  // LUNCH
  // ----------------------------------------------------------

  lunchDays = 0,
  lunchRate = 100,
  lunchAllowance,

  // ----------------------------------------------------------
  // OTHER EARNINGS
  // ----------------------------------------------------------

  tripEarnings = 0,
  overtime = 0,
  bonuses = 0,
  otherEarnings = 0,

  // ----------------------------------------------------------
  // DEDUCTIONS
  // ----------------------------------------------------------

  advanceDeductions = 0,
  loanDeductions = 0,
  incidentDeductions = 0,
  otherDeductions = 0,
}) => {
  // ==========================================================
  // NORMALIZE INPUTS
  // ==========================================================

  const basic =
    toNonNegativeNumber(basicSalary);

  const allow =
    toNonNegativeNumber(allowances);

  const days =
    toNonNegativeNumber(lunchDays);

  const rate =
    lunchRate == null
      ? 100
      : toNonNegativeNumber(lunchRate);

  const trips =
    toNonNegativeNumber(tripEarnings);

  const overtimeAmount =
    toNonNegativeNumber(overtime);

  const bonusAmount =
    toNonNegativeNumber(bonuses);

  const otherEarn =
    toNonNegativeNumber(otherEarnings);

  const advances =
    toNonNegativeNumber(advanceDeductions);

  const loans =
    toNonNegativeNumber(loanDeductions);

  const incidents =
    toNonNegativeNumber(incidentDeductions);

  const otherDeduct =
    toNonNegativeNumber(otherDeductions);

  // ==========================================================
  // LUNCH
  // ==========================================================

  const calculatedLunchAllowance =
    calculateLunchAllowance({
      lunchDays: days,
      lunchRate: rate,
      lunchAllowance,
    });

  // ==========================================================
  // GROSS SALARY
  // ==========================================================

  const grossSalary = roundMoney(
    basic +
      allow +
      calculatedLunchAllowance +
      trips +
      overtimeAmount +
      bonusAmount +
      otherEarn
  );

  // ==========================================================
  // STATUTORY EMPLOYEE DEDUCTIONS
  // ==========================================================

  const nssf =
    calculateNssf(grossSalary);

  const shif =
    calculateShif(grossSalary);

  const housingLevy =
    calculateHousingLevy(grossSalary);

  // ==========================================================
  // TAXABLE INCOME
  // ==========================================================
  //
  // Current KRA treatment:
  //
  // Gross employment income
  //   - NSSF/pension deduction
  //   - SHIF
  //   - Affordable Housing Levy
  //   = taxable income
  //
  // Other company deductions such as loans, advances and
  // incident deductions are NOT automatically treated as
  // PAYE deductions here.
  // ==========================================================

  const taxableIncome = roundMoney(
    Math.max(
      grossSalary -
        nssf -
        shif -
        housingLevy,
      0
    )
  );

  // ==========================================================
  // PAYE
  // ==========================================================

  const paye =
    calculatePaye(taxableIncome);

  // ==========================================================
  // OTHER EMPLOYEE DEDUCTIONS
  // ==========================================================

  const calculatedAdvanceDeductions =
    roundMoney(advances);

  const calculatedLoanDeductions =
    roundMoney(loans);

  const calculatedIncidentDeductions =
    roundMoney(incidents);

  const calculatedOtherDeductions =
    roundMoney(otherDeduct);

  // ==========================================================
  // TOTAL EMPLOYEE DEDUCTIONS
  // ==========================================================

  const totalDeductions = roundMoney(
    nssf +
      shif +
      housingLevy +
      paye +
      calculatedAdvanceDeductions +
      calculatedLoanDeductions +
      calculatedIncidentDeductions +
      calculatedOtherDeductions
  );

  // ==========================================================
  // NET SALARY
  // ==========================================================

  const netSalary = roundMoney(
    Math.max(
      grossSalary - totalDeductions,
      0
    )
  );

  // ==========================================================
  // EMPLOYER CONTRIBUTIONS
  // ==========================================================

  const employerNssf =
    roundMoney(
      Math.min(
        Math.min(
          grossSalary,
          PAYROLL_CONFIG.nssf.maximumPensionableSalary
        ) *
          PAYROLL_CONFIG.nssf.rate,
        PAYROLL_CONFIG.nssf.maximumEmployerContribution
      )
    );

  const employerHousingLevy =
    calculateEmployerHousingLevy(
      grossSalary
    );

  const nita =
    PAYROLL_CONFIG.nita.monthlyPerEmployee;

  // ==========================================================
  // TOTAL EMPLOYER CONTRIBUTIONS
  // ==========================================================

  const totalEmployerContributions =
    roundMoney(
      employerNssf +
        employerHousingLevy +
        nita
    );

  // ==========================================================
  // TOTAL PAYROLL COST
  // ==========================================================

  const totalPayrollCost =
    roundMoney(
      grossSalary +
        totalEmployerContributions
    );

  // ==========================================================
  // RETURN COMPLETE CALCULATION
  // ==========================================================

  return {
    // Earnings
    basicSalary: roundMoney(basic),
    allowances: roundMoney(allow),
    lunchDays: roundMoney(days),
    lunchRate: roundMoney(rate),
    lunchAllowance:
      calculatedLunchAllowance,

    tripEarnings: roundMoney(trips),
    overtime: roundMoney(overtimeAmount),
    bonuses: roundMoney(bonusAmount),
    otherEarnings: roundMoney(otherEarn),

    grossSalary,

    // Employee statutory deductions
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

    // Employer contributions
    employerNssf,
    employerHousingLevy,
    nita,

    totalEmployerContributions,

    totalPayrollCost,

    // Tax
    taxableIncome,
  };
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default calculatePayroll;
EOF