const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const NotificationEngine = require('../services/NotificationEngine');
const StudyMaterial = require('../models/StudyMaterial');

// Preloaded demo materials for offline/in-memory mode
let demoMaterials = [
  {
    _id: 'mat_1',
    title: 'Data Structures & Algorithms - Complete Lecture Notes',
    subject: 'Data Structures & Algorithms',
    courseCode: 'CS201',
    department: 'Computer Science',
    semester: 3,
    category: 'notes',
    description: 'Comprehensive notes covering Arrays, Linked Lists, Trees, Graphs, Sorting Algorithms, Dynamic Programming, and Big-O Complexity.',
    fileUrl: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-notes/',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    uploaderName: 'Dr. Robert Singh',
    uploaderRole: 'faculty',
    uploadedBy: 'seed_faculty_1',
    upvotes: ['seed_student_1'],
    upvoteCount: 14,
    downloadsCount: 128,
    tags: ['DSA', 'Trees', 'Graphs', 'Dynamic Programming', 'Exam Prep'],
    createdAt: new Date(Date.now() - 7 * 86400000),
  },
  {
    _id: 'mat_2',
    title: 'Operating Systems - Previous Year Midterm & Final Solved Papers',
    subject: 'Operating Systems',
    courseCode: 'CS302',
    department: 'Computer Science',
    semester: 5,
    category: 'exam_paper',
    description: 'Solved question papers with detailed step-by-step answers for CPU Scheduling, Deadlocks, Virtual Memory, and Paging problems.',
    fileUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    fileType: 'PDF',
    fileSize: '3.2 MB',
    uploaderName: 'Alice Johnson',
    uploaderRole: 'student',
    uploadedBy: 'seed_student_1',
    upvotes: ['seed_faculty_1', 'seed_student_1'],
    upvoteCount: 29,
    downloadsCount: 245,
    tags: ['Past Papers', 'Deadlocks', 'Virtual Memory', 'Solved Papers'],
    createdAt: new Date(Date.now() - 5 * 86400000),
  },
  {
    _id: 'mat_3',
    title: 'Database Management Systems - SQL Queries & Normalization Guide',
    subject: 'Database Systems',
    courseCode: 'CS204',
    department: 'Computer Science',
    semester: 4,
    category: 'notes',
    description: 'Cheat sheet for Complex SQL Joins, Triggers, Indexes, B-Trees, and 1NF through BCNF Normalization walkthroughs with real schema examples.',
    fileUrl: 'https://web.stanford.edu/class/cs145/',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    uploaderName: 'Dr. Robert Singh',
    uploaderRole: 'faculty',
    uploadedBy: 'seed_faculty_1',
    upvotes: [],
    upvoteCount: 19,
    downloadsCount: 180,
    tags: ['SQL', 'Normalization', 'Relational Algebra', 'Transactions'],
    createdAt: new Date(Date.now() - 4 * 86400000),
  },
  {
    _id: 'mat_4',
    title: 'Computer Networks - Packet Tracer Lab Manual & Subnetting Cheat Sheet',
    subject: 'Computer Networks',
    courseCode: 'CS306',
    department: 'Computer Science',
    semester: 5,
    category: 'lab_manual',
    description: 'Practical lab setup guides, Cisco Packet Tracer simulations, IPv4/IPv6 CIDR subnetting calculations, and socket programming in Python.',
    fileUrl: 'https://www.cisco.com/c/en/us/support/index.html',
    fileType: 'PDF',
    fileSize: '6.4 MB',
    uploaderName: 'Admin Kumar',
    uploaderRole: 'admin',
    uploadedBy: 'seed_admin_1',
    upvotes: ['seed_student_1'],
    upvoteCount: 22,
    downloadsCount: 164,
    tags: ['Networking', 'Subnetting', 'Packet Tracer', 'Lab Guide'],
    createdAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    _id: 'mat_5',
    title: 'Artificial Intelligence & Machine Learning - Presentation Slides',
    subject: 'Artificial Intelligence',
    courseCode: 'CS401',
    department: 'Computer Science',
    semester: 7,
    category: 'slides',
    description: 'Lecture slides covering Neural Networks, Backpropagation, Gradient Descent, CNNs, Transformers, and LLM architectural fundamentals.',
    fileUrl: 'https://cs229.stanford.edu/syllabus.html',
    fileType: 'PPTX',
    fileSize: '18.5 MB',
    uploaderName: 'Dr. Robert Singh',
    uploaderRole: 'faculty',
    uploadedBy: 'seed_faculty_1',
    upvotes: [],
    upvoteCount: 37,
    downloadsCount: 310,
    tags: ['Machine Learning', 'Deep Learning', 'Transformers', 'Slides'],
    createdAt: new Date(Date.now() - 1 * 86400000),
  },
  {
    _id: 'mat_6',
    title: 'Engineering Mathematics III - Formula Sheet & Handbook',
    subject: 'Engineering Mathematics',
    courseCode: 'MATH301',
    department: 'General',
    semester: 3,
    category: 'notes',
    description: 'Quick reference guide for Laplace Transforms, Fourier Series, Partial Differential Equations, and Vector Calculus formulas.',
    fileUrl: 'https://tutorial.math.lamar.edu/',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    uploaderName: 'Dr. Robert Singh',
    uploaderRole: 'faculty',
    uploadedBy: 'seed_faculty_1',
    upvotes: [],
    upvoteCount: 42,
    downloadsCount: 420,
    tags: ['Math', 'Laplace', 'Fourier', 'Formula Sheet'],
    createdAt: new Date(Date.now() - 10 * 86400000),
  }
];

// @route  GET /api/study-materials
// @desc   Get study materials with search and filters
router.get('/', protect, async (req, res) => {
  try {
    const { q, department, semester, category } = req.query;

    let materials;
    try {
      const query = {};
      if (department && department !== 'All') {
        query.department = department;
      }
      if (semester && semester !== 'All') {
        query.semester = Number(semester);
      }
      if (category && category !== 'All') {
        query.category = category;
      }
      if (q) {
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { subject: { $regex: q, $options: 'i' } },
          { courseCode: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } },
        ];
      }
      materials = await StudyMaterial.find(query).sort({ createdAt: -1 });
    } catch {
      // In-memory fallback
      materials = demoMaterials.filter(item => {
        if (department && department !== 'All' && item.department !== department) return false;
        if (semester && semester !== 'All' && item.semester !== Number(semester)) return false;
        if (category && category !== 'All' && item.category !== category) return false;
        if (q) {
          const queryLower = q.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(queryLower);
          const matchSubject = item.subject.toLowerCase().includes(queryLower);
          const matchCode = (item.courseCode || '').toLowerCase().includes(queryLower);
          const matchTag = item.tags.some(t => t.toLowerCase().includes(queryLower));
          if (!matchTitle && !matchSubject && !matchCode && !matchTag) return false;
        }
        return true;
      });
    }

    res.json({ materials, total: materials.length });
  } catch (err) {
    console.error('Fetch study materials error:', err);
    res.status(500).json({ message: 'Error retrieving study materials' });
  }
});

// @route  POST /api/study-materials
// @desc   Upload / Share new study material
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      subject,
      courseCode,
      department,
      semester,
      category,
      description,
      fileUrl,
      fileType,
      fileSize,
      tags,
    } = req.body;

    if (!title || !subject || !fileUrl) {
      return res.status(400).json({ message: 'Title, Subject, and File/Resource Link are required' });
    }

    const userId = req.user._id || req.user.id;
    const uploaderName = req.user.name || 'Campus Member';
    const uploaderRole = req.user.role || 'student';

    const parsedTags = Array.isArray(tags)
      ? tags
      : (tags || '')
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);

    let material;
    try {
      material = await StudyMaterial.create({
        title,
        subject,
        courseCode: courseCode || '',
        department: department || 'Computer Science',
        semester: Number(semester) || 1,
        category: category || 'notes',
        description: description || '',
        fileUrl,
        fileType: fileType || 'PDF',
        fileSize: fileSize || '2.0 MB',
        uploadedBy: userId,
        uploaderName,
        uploaderRole,
        tags: parsedTags,
      });
    } catch {
      // In-memory fallback
      material = {
        _id: `mat_${Date.now()}`,
        title,
        subject,
        courseCode: courseCode || '',
        department: department || 'Computer Science',
        semester: Number(semester) || 1,
        category: category || 'notes',
        description: description || '',
        fileUrl,
        fileType: fileType || 'PDF',
        fileSize: fileSize || '2.0 MB',
        uploadedBy: userId,
        uploaderName,
        uploaderRole,
        upvotes: [],
        upvoteCount: 0,
        downloadsCount: 0,
        tags: parsedTags,
        createdAt: new Date(),
      };
      demoMaterials.unshift(material);
    }

    // Publish notification to all students / department
    const io = req.app.get('io');
    if (io) {
      await NotificationEngine.publish(io, {
        source_module: 'study_materials',
        type: 'info',
        title: 'New Study Material Uploaded',
        message: `${uploaderName} shared "${title}" for ${subject} (Semester ${semester || 1})`,
        target_role: 'all',
        data: { materialId: material._id, subject, courseCode },
      });
    }

    res.status(201).json({ material, message: 'Study material uploaded successfully' });
  } catch (err) {
    console.error('Upload study material error:', err);
    res.status(500).json({ message: 'Error uploading study material' });
  }
});

// @route  POST /api/study-materials/:id/upvote
// @desc   Toggle upvote for a study material
router.post('/:id/upvote', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user._id || req.user.id).toString();

    let upvoted = false;
    let upvoteCount = 0;

    try {
      const material = await StudyMaterial.findById(id);
      if (!material) return res.status(404).json({ message: 'Material not found' });

      const idx = material.upvotes.indexOf(userId);
      if (idx === -1) {
        material.upvotes.push(userId);
        upvoted = true;
      } else {
        material.upvotes.splice(idx, 1);
        upvoted = false;
      }
      material.upvoteCount = material.upvotes.length;
      await material.save();
      upvoteCount = material.upvoteCount;
    } catch {
      // In-memory fallback
      const item = demoMaterials.find(m => m._id === id);
      if (!item) return res.status(404).json({ message: 'Material not found' });
      item.upvotes = item.upvotes || [];
      const idx = item.upvotes.indexOf(userId);
      if (idx === -1) {
        item.upvotes.push(userId);
        upvoted = true;
      } else {
        item.upvotes.splice(idx, 1);
        upvoted = false;
      }
      item.upvoteCount = item.upvotes.length;
      upvoteCount = item.upvoteCount;
    }

    res.json({ upvoted, upvoteCount });
  } catch (err) {
    console.error('Upvote error:', err);
    res.status(500).json({ message: 'Error registering upvote' });
  }
});

// @route  POST /api/study-materials/:id/download
// @desc   Record download/view count
router.post('/:id/download', protect, async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await StudyMaterial.findByIdAndUpdate(id, { $inc: { downloadsCount: 1 } });
    } catch {
      const item = demoMaterials.find(m => m._id === id);
      if (item) item.downloadsCount = (item.downloadsCount || 0) + 1;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error recording download' });
  }
});

// @route  DELETE /api/study-materials/:id
// @desc   Delete study material
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user._id || req.user.id).toString();
    const isAdmin = req.user.role === 'admin';

    try {
      const material = await StudyMaterial.findById(id);
      if (!material) return res.status(404).json({ message: 'Material not found' });

      if (material.uploadedBy && material.uploadedBy.toString() !== userId && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized to delete this material' });
      }
      await StudyMaterial.findByIdAndDelete(id);
    } catch {
      const idx = demoMaterials.findIndex(m => m._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Material not found' });
      if (demoMaterials[idx].uploadedBy !== userId && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized to delete this material' });
      }
      demoMaterials.splice(idx, 1);
    }

    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting study material' });
  }
});

module.exports = router;
