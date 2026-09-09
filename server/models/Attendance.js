import mongoose from "mongoose";
import { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "On Leave"],
      default: "Present",
    },

    workMode: {
      type: String,
      enum: ["On-site", "Remote"],
      default: "On-site",
    },

    checkIn: {
      type: Date,
    },

    checkOut: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// One attendance record per employee per day
attendanceSchema.index(
  { employeeId: 1, date: 1 },
  { unique: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
