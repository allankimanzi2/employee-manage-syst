import mongoose from "mongoose";
import Salary from "../models/Salary.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./server/.env",
});

const MONGO_URI = process.env.MONGODB_URL;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined");
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ Connected to MongoDB");

    const salaries = await Salary.find({});

    console.log(
      `📊 Found ${salaries.length} payroll records`
    );

    let updated = 0;
    let skipped = 0;

    for (const salary of salaries) {
      const employerNssf =
        Number(salary.employerNssf) || 0;

      const employerHousingLevy =
        Number(salary.employerHousingLevy) || 0;

      const nita =
        Number(salary.nita) || 0;

      const grossSalary =
        Number(salary.grossSalary) || 0;

      const totalEmployerContributions =
        employerNssf +
        employerHousingLevy +
        nita;

      const totalPayrollCost =
        grossSalary +
        totalEmployerContributions;

      const alreadyCorrect =
        Number(salary.totalEmployerContributions) ===
          totalEmployerContributions &&
        Number(salary.totalPayrollCost) ===
          totalPayrollCost;

      if (alreadyCorrect) {
        skipped++;
        continue;
      }

      salary.totalEmployerContributions =
        totalEmployerContributions;

      salary.totalPayrollCost =
        totalPayrollCost;

      await salary.save();

      updated++;

      console.log(
        `✅ Updated ${
          salary._id
        } | Gross: ${grossSalary} | Employer contributions: ${totalEmployerContributions} | Payroll cost: ${totalPayrollCost}`
      );
    }

    console.log("\n=================================");
    console.log("🎉 PAYROLL MIGRATION COMPLETE");
    console.log("=================================");
    console.log(`Total records: ${salaries.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Already correct: ${skipped}`);
    console.log("=================================");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Migration failed:",
      error
    );

    await mongoose.disconnect();

    process.exit(1);
  }
};

run();
