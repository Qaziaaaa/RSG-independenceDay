const Attendance = require('../models/attendanceModel');
const Student = require('../models/studentModel');
const ApiError = require('../utils/apiError');
const { paginate, buildPaginationMeta } = require('../utils/pagination');

const STUDENT_FIELDS = 'name email regNo phone status';

exports.markAttendance = async (payload) => {
  const student = await Student.findById(payload.studentId);
  if (!student) {
    throw new ApiError('Student not found', 404);
  }

  const date = payload.date ? new Date(payload.date) : new Date();
  if (Number.isNaN(date.getTime())) {
    throw new ApiError('Invalid date', 400);
  }
  date.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOneAndUpdate(
    { student: payload.studentId, date },
    { status: payload.status || 'Present' },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return attendance;
};

exports.listAttendance = async (query) => {
  const { pageNum, limitNum, skip } = paginate(query.page, query.limit);

  const filter = {};
  if (query.date) {
    const date = new Date(query.date);
    if (Number.isNaN(date.getTime())) {
      throw new ApiError('Invalid date, use YYYY-MM-DD format', 400);
    }
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.date = { $gte: start, $lt: end };
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.studentId) {
    filter.student = query.studentId;
  }

  const [items, total] = await Promise.all([
    Attendance.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ date: -1 })
      .populate('student', STUDENT_FIELDS),
    Attendance.countDocuments(filter),
  ]);

  return { items, pagination: buildPaginationMeta(total, pageNum, limitNum) };
};

exports.getStudentAttendance = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError('Student not found', 404);
  }

  const records = await Attendance.find({ student: studentId })
    .sort({ date: -1 })
    .populate('student', STUDENT_FIELDS);

  return {
    records,
    summary: {
      total: records.length,
      present: records.filter((r) => r.status === 'Present').length,
      absent: records.filter((r) => r.status === 'Absent').length,
      late: records.filter((r) => r.status === 'Late').length,
    },
  };
};
