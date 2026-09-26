const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  courseCode: { type: String, default: '', trim: true },
  department: { type: String, required: true, default: 'Computer Science' },
  semester: { type: Number, default: 1 },
  category: {
    type: String,
    enum: ['notes', 'slides', 'syllabus', 'exam_paper', 'lab_manual', 'book', 'assignment_solution'],
    default: 'notes',
  },
  description: { type: String, default: '' },
  fileUrl: { type: String, required: true },
  fileType: { type: String, default: 'PDF' },
  fileSize: { type: String, default: '2.5 MB' },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  uploaderName: { type: String, default: 'Faculty Member' },
  uploaderRole: { type: String, default: 'faculty' },
  upvotes: [{ type: String }],
  upvoteCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  downloadsCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
