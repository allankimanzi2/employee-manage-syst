/**
 * SmartJobs Payroll Calculator
 */

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
// KENYA PAYROLL STATUTORY CONFIGURATION - 2026
// ============================================================

const NSSF_RATE = 0.06;
const NSSF_MAX_PENSIONABLE_SALARY = 108000;
const NSSF_MAX_CONTRIBUTION = 6480;

const SHIF_RATE = 0.0275;
const SHIF_MINIMUM = 300;

const HOUSING_LEVY_RATE = 0.015;

const NITA_MONTHLY = 50;

const PERSONAL_RELIEF = 2400;

// PAYE monthly bands
const PAYE_BANDS = [
  { limit: 24000, rate: 0.10 },
  { limit: 8333, rate: 0.25 },
  { limit: 467667, rate: 0.30 },
  { limit: 300000, rate: 0.325 },
  { limit: Infinity, rate: 0.35 },
];

// ============================================================
// NSSF
// ============================================================

const calculateNssf = (grossSalary) => {
  const pensionableSalary = Math.min(
    toNonNegativeNumber(grossSalary),
    NSSF_MAX_PENSIONABLE_SALARY
  );

  return roundMoney(
    Math.min(
      pensionableSalary * NSSF_RATE,
      NSSF_MAX_CONTRIBUTION
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
    Math.max(gross * SHIF_RATE, SHIF_MINIMUM)
  );
};

// ============================================================
// HOUSING LEVY
// ============================================================

const calculateHousingLevy = (grossSalary) => {
  return roundMoney(
    toNonNegativeNumber(grossSalary) *
      HOUSING_LEVY_RATE
  );
};

// ============================================================
// PAYE
// ============================================================

const calculateTaxBeforeRelief = (taxableIncome) => {
  let remaining = toNonNegativeNumber(taxableIncome);
  let tax = 0;

  for (const band of PAYE_BANDS) {
    if (remaining <= 0) {
      break;
    }

    const taxableAtBand = Math.min(
      remaining,
      band.limit
    );

    tax += taxableAtBand * band.rate;
    remaining -= taxableAtBand;
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

  return roundMoney(
    Math.max(
      taxBeforeRelief - PERSONAL_RELIEF,
      0
    )
  );
};

// ============================================================
// LUNCH ALLOWANCE
// ============================================================

const calculateLunchAllowance = ({
  lunchDays,
  lunchRate,
  lunchAllowance,
}) => {
  if (lunchAllowance != null) {
    return roundMoney(
      toNonNegativeNumber(lunchAllowance)
    );
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
// MAIN CALCULATOR
// ============================================================

export const calculatePayroll = ({
  basicSalary = 0,
  allowances = 0,

  lunchDays = 0,
  lunchRate = 100,
  lunchAllowance,

  tripEarnings = 0,
  overtime = 0,
  bonuses = 0,
  otherEarnings = 0,

  advanceDeductions = 0,
  loanDeductions = 0,
  incidentDeductions = 0,
  otherDeductions = 0,
}) => {
  // ----------------------------------------------------------
  // NORMALIZE
  // ----------------------------------------------------------

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

  const advances =
    toNonNegativeNumber(advanceDeductions);

  const loans =
    toNonNegativeNumber(loanDeductions);

  const incidents =
    toNonNegativeNumber(incidentDeductions);

  const otherDeduct =
    toNonNegativeNumber(otherDeductions);

  // ----------------------------------------------------------
  // LUNCH
  // ----------------------------------------------------------

  const calculatedLunchAllowance =
    calculateLunchAllowance({
      lunchDays,
      lunchRate,
      lunchAllowance,
    });

  // ----------------------------------------------------------
  // GROSS SALARY
  // ----------------------------------------------------------

  const grossSalary = roundMoney(
    basic +
      allow +
      calculatedLunchAllowance +
      trips +
      overtimeAmount +
      bonusAmount +
      otherEarn
  );

  // ----------------------------------------------------------
  // STATUTORY DEDUCTIONS
  // ----------------------------------------------------------

  const nssf =
    calculateNssf(grossSalary);

  const shif =
    calculateShif(grossSalary);

  const housingLevy =
    calculateHousingLevy(grossSalary);

  // ----------------------------------------------------------
  // TAXABLE INCOME
  // ----------------------------------------------------------

  const taxableIncome = roundMoney(
    Math.max(
      grossSalary -
        nssf -
        shif -
        housingLevy,
      0
    )
  );

  // ----------------------------------------------------------
  // PAYE
  // ----------------------------------------------------------

  const paye =
    calculatePaye(taxableIncome);

  // ----------------------------------------------------------
  // OTHER DEDUCTIONS
  // ----------------------------------------------------------

  const calculatedAdvanceDeductions =
    roundMoney(advances);

  const calculatedLoanDeductions =
    roundMoney(loans);

  const calculatedIncidentDeductions =
    roundMoney(incidents);

  const calculatedOtherDeductions =
    roundMoney(otherDeduct);

  // ----------------------------------------------------------
  // TOTAL DEDUCTIONS
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // NET SALARY
  // ----------------------------------------------------------

  const netSalary = roundMoney(
    Math.max(
      grossSalary - totalDeductions,
      0
    )
  );

  // ----------------------------------------------------------
  // EMPLOYER CONTRIBUTIONS
  // ----------------------------------------------------------

  const employerNssf =
    calculateNssf(grossSalary);

  const employerHousingLevy =
    roundMoney(
      grossSalary * HOUSING_LEVY_RATE
    );

  const nita = NITA_MONTHLY;

  // ----------------------------------------------------------
  // TOTAL EMPLOYER CONTRIBUTIONS
  // ----------------------------------------------------------

  const totalEmployerContributions =
    roundMoney(
      employerNssf +
        employerHousingLevy +
        nita
    );

  // ----------------------------------------------------------
  // TOTAL PAYROLL COST
  // ----------------------------------------------------------

  const totalPayrollCost =
    roundMoney(
      grossSalary +
        totalEmployerContributions
    );

  // ----------------------------------------------------------
  // RETURN
  // ----------------------------------------------------------

  return {
    basicSalary: roundMoney(basic),
    allowances: roundMoney(allowances),

    lunchDays: roundMoney(lunchDays),
    lunchRate: roundMoney(lunchRate),
    lunchAllowance:
      calculatedLunchAllowance,

    tripEarnings: roundMoney(trips),
    overtime: roundMoney(overtimeAmount),
    bonuses: roundMoney(bonusAmount),
    otherEarnings: roundMoney(otherEarn),

    grossSalary,

    nssf,
    shif,
    housingLevy,
    paye,

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

    employerNssf,
    employerHousingLevy,
    nita,

    totalEmployerContributions,
    totalPayrollCost,

    taxableIncome,
  };
};

export default calculatePayroll;
