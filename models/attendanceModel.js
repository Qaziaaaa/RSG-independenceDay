const mongoose = require('mongoose');

const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Late'];

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ATTENDANCE_STATUSES,
      default: 'Present',
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
module.exports.ATTENDANCE_STATUSES = ATTENDANCE_STATUSES;
