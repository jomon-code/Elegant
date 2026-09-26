import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  BookOpen,
  Search,
  Plus,
  X,
  FileText,
  Download,
  ThumbsUp,
  Tag,
  Share2,
  Trash2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle,
  FileCode,
  SlidersHorizontal,
  BookmarkCheck,
  Calendar,
} from 'lucide-react';
import { StudyMaterial, StudyMaterialCategory } from '../types';

const CATEGORIES: { key: StudyMaterialCategory | 'All'; label: string; icon: any }[] = [
  { key: 'All', label: 'All Resources', icon: Layers },
  { key: 'notes', label: 'Lecture Notes', icon: FileText },
  { key: 'exam_paper', label: 'Past Exam Papers', icon: GraduationCap },
  { key: 'lab_manual', label: 'Lab Manuals', icon: FileCode },
  { key: 'slides', label: 'Presentation Slides', icon: Layers },
  { key: 'book', label: 'Reference Books', icon: BookOpen },
  { key: 'assignment_solution', label: 'Solutions', icon: BookmarkCheck },
];

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Management',
  'General',
];

const SEMESTERS = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];

const CATEGORY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  notes: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  exam_paper: { bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8' },
  lab_manual: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  slides: { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
  book: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  assignment_solution: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
};

const StudyMaterialsPage: React.FC = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedSem, setSelectedSem] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form, setForm] = useState({
    title: '',
    subject: '',
    courseCode: '',
    department: user?.department || 'Computer Science',
    semester: 3,
    category: 'notes' as StudyMaterialCategory,
    description: '',
    fileUrl: '',
    fileType: 'PDF',
    fileSize: '3.5 MB',
    tags: '',
  });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDept !== 'All') params.append('department', selectedDept);
      if (selectedSem !== 'All') params.append('semester', selectedSem);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const res = await api.get(`/study-materials?${params.toString()}`);
      setMaterials(res.data.materials || []);
    } catch (err: any) {
      toast.error('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [selectedDept, selectedSem, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMaterials();
  };

  const handleUpvote = async (id: string) => {
    try {
      const res = await api.post(`/study-materials/${id}/upvote`);
      const { upvoted, upvoteCount } = res.data;
      setMaterials(prev =>
        prev.map(m => {
          if (m._id === id) {
            const currentUpvotes = m.upvotes || [];
            const userId = user?._id || user?.id || '';
            const newUpvotes = upvoted
              ? [...currentUpvotes, userId]
              : currentUpvotes.filter(uid => uid !== userId);
            return { ...m, upvoteCount, upvotes: newUpvotes };
          }
          return m;
        })
      );
      toast.success(upvoted ? 'Upvoted material! 👍' : 'Removed upvote');
    } catch {
      toast.error('Unable to register upvote');
    }
  };

  const handleDownload = async (mat: StudyMaterial) => {
    try {
      await api.post(`/study-materials/${mat._id}/download`);
      setMaterials(prev =>
        prev.map(m => (m._id === mat._id ? { ...m, downloadsCount: (m.downloadsCount || 0) + 1 } : m))
      );
    } catch {
      // ignore tracking error
    }
    window.open(mat.fileUrl, '_blank', 'noopener,noreferrer');
    toast.success(`Opening ${mat.title}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this study material?')) return;
    try {
      await api.delete(`/study-materials/${id}`);
      setMaterials(prev => prev.filter(m => m._id !== id));
      toast.success('Study material deleted');
    } catch {
      toast.error('Failed to delete study material');
    }
  };

  const handleCopyLink = (mat: StudyMaterial) => {
    navigator.clipboard.writeText(mat.fileUrl);
    toast.success('Resource URL copied to clipboard! 📋');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.subject.trim() || !form.fileUrl.trim()) {
      toast.error('Please fill in Title, Subject, and Resource URL');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/study-materials', form);
      toast.success('Study material shared with campus! 🚀');
      setShowUploadModal(false);
      setForm({
        title: '',
        subject: '',
        courseCode: '',
        department: user?.department || 'Computer Science',
        semester: 3,
        category: 'notes',
        description: '',
        fileUrl: '',
        fileType: 'PDF',
        fileSize: '3.5 MB',
        tags: '',
      });
      fetchMaterials();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error uploading material');
    } finally {
      setSubmitting(false);
    }
  };

  const prefillSample = () => {
    setForm({
      title: 'Cloud Computing Architecture & AWS Cheatsheet',
      subject: 'Cloud Computing',
      courseCode: 'CS412',
      department: 'Computer Science',
      semester: 6,
      category: 'notes',
      description: 'Concise guide covering EC2, S3, IAM policies, Lambda serverless patterns, and Docker deployment steps.',
      fileUrl: 'https://docs.aws.amazon.com/whitepapers/latest/architecting-for-the-cloud/',
      fileType: 'PDF',
      fileSize: '3.8 MB',
      tags: 'Cloud, AWS, S3, Docker, Serverless',
    });
    toast.success('Filled with sample data!');
  };

  const stats = useMemo(() => {
    const totalMaterials = materials.length;
    const totalUpvotes = materials.reduce((acc, m) => acc + (m.upvoteCount || 0), 0);
    const totalDownloads = materials.reduce((acc, m) => acc + (m.downloadsCount || 0), 0);
    const examPapersCount = materials.filter(m => m.category === 'exam_paper').length;
    return { totalMaterials, totalUpvotes, totalDownloads, examPapersCount };
  }, [materials]);

  return (
    <div className="page-content animate-in">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex' }}>
              <BookOpen size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 800 }}>Study Materials & Academic Vault</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: 0 }}>
            Curated repository of syllabus notes, verified question banks, lab experiments, and lecture slides.
          </p>
        </div>

        <button
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.4rem', fontWeight: 700 }}
          onClick={() => setShowUploadModal(true)}
          id="upload-material-btn"
        >
          <Plus size={18} />
          <span>Share Study Material</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.8rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalMaterials}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Documents</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fce7f3', color: '#be185d', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.examPapersCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Solved Past Papers</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#ecfdf5', color: '#047857', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
            <Download size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalDownloads}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resource Accesses</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fef3c7', color: '#b45309', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
            <ThumbsUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalUpvotes}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Peer Endorsements</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: '1.2rem', marginBottom: '1.8rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.8rem' }}
              placeholder="Search by topic, subject, course code (e.g. CS201), or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.4rem' }}>
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All');
                setSelectedSem('All');
                setSelectedCategory('All');
              }}
            >
              Reset
            </button>
          )}
        </form>

        <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid var(--surface-glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Department:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Semester:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              value={selectedSem}
              onChange={e => setSelectedSem(e.target.value)}
            >
              {SEMESTERS.map(s => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Semesters' : `Semester ${s}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: active ? '1px solid var(--primary)' : '1px solid var(--surface-glass-border)',
                  background: active ? 'var(--primary-gradient)' : 'var(--bg-subtle)',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'var(--transition)',
                }}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Materials List / Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Retrieving academic resources...</p>
        </div>
      ) : materials.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', color: 'var(--text-light)' }}>
            <Search size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Study Materials Found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            No documents match your active search and filter criteria. Try adjusting filters or be the first to share resources for this subject!
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('All');
              setSelectedSem('All');
              setSelectedCategory('All');
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.4rem' }}>
          {materials.map(mat => {
            const catStyle = CATEGORY_STYLES[mat.category] || { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
            const userId = user?._id || user?.id || '';
            const isUpvoted = (mat.upvotes || []).includes(userId);
            const canDelete = user?.role === 'admin' || mat.uploadedBy === userId;

            return (
              <div
                key={mat._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.6rem',
                  border: '1px solid var(--surface-glass-border)',
                  transition: 'var(--transition)',
                }}
              >
                <div>
                  {/* Top Bar: Badges & Category */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: catStyle.bg,
                          color: catStyle.color,
                          border: `1px solid ${catStyle.border}`,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-xs)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {mat.category.replace('_', ' ')}
                      </span>
                      {mat.courseCode && (
                        <span
                          style={{
                            background: 'var(--bg-subtle)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-xs)',
                          }}
                        >
                          {mat.courseCode}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          background: '#fee2e2',
                          color: '#b91c1c',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-xs)',
                        }}
                      >
                        {mat.fileType || 'PDF'}
                      </span>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(mat._id)}
                          title="Delete material"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-light)',
                            cursor: 'pointer',
                            padding: '0.2rem',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Subject */}
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                    {mat.subject} • Sem {mat.semester}
                  </div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                    {mat.title}
                  </h3>

                  {/* Description */}
                  {mat.description && (
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.9rem' }}>
                      {mat.description}
                    </p>
                  )}

                  {/* Tags */}
                  {mat.tags && mat.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                      {mat.tags.map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.72rem',
                            background: 'var(--bg-subtle)',
                            color: 'var(--text-muted)',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                        >
                          <Tag size={10} />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Section */}
                <div style={{ borderTop: '1px solid var(--surface-glass-border)', paddingTop: '1rem', marginTop: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                    <span>By {mat.uploaderName || 'Faculty'}</span>
                    <span>{mat.fileSize || 'Direct Link'}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.55rem', fontSize: '0.84rem' }}
                      onClick={() => handleDownload(mat)}
                    >
                      <Download size={15} />
                      <span>Access File</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpvote(mat._id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: isUpvoted ? '1px solid var(--primary)' : '1px solid var(--surface-glass-border)',
                        background: isUpvoted ? 'var(--primary-light)' : 'var(--bg-subtle)',
                        color: isUpvoted ? 'var(--primary)' : 'var(--text-secondary)',
                      }}
                      title="Endorse this resource"
                    >
                      <ThumbsUp size={14} />
                      <span>{mat.upvoteCount || 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(mat)}
                      style={{
                        padding: '0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--surface-glass-border)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                      title="Copy Resource Link"
                    >
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="modal-backdrop animate-in" onClick={() => setShowUploadModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px', width: '100%' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.4rem', borderRadius: 'var(--radius-xs)' }}>
                  <Plus size={20} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>Share Study Material</h2>
              </div>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setShowUploadModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '0.9rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Material Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Operating Systems Solved Midterms & Formula Sheet"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject / Course Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Operating Systems"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Course Code (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CS302"
                    value={form.courseCode}
                    onChange={e => setForm(f => ({ ...f, courseCode: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    className="form-select"
                    value={form.department}
                    onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                  >
                    {DEPARTMENTS.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Semester *</label>
                  <select
                    className="form-select"
                    value={form.semester}
                    onChange={e => setForm(f => ({ ...f, semester: Number(e.target.value) }))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as StudyMaterialCategory }))}
                  >
                    <option value="notes">Lecture Notes</option>
                    <option value="exam_paper">Past Exam Paper</option>
                    <option value="lab_manual">Lab Manual</option>
                    <option value="slides">Presentation Slides</option>
                    <option value="book">Reference Book</option>
                    <option value="assignment_solution">Assignment Solution</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Format / Type</label>
                  <select
                    className="form-select"
                    value={form.fileType}
                    onChange={e => setForm(f => ({ ...f, fileType: e.target.value }))}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="PPTX">PowerPoint (PPTX)</option>
                    <option value="DOCX">Word Document</option>
                    <option value="ZIP">ZIP Archive</option>
                    <option value="LINK">Online Resource Link</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Resource Link / File URL *</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://drive.google.com/... or https://..."
                    value={form.fileUrl}
                    onChange={e => setForm(f => ({ ...f, fileUrl: e.target.value }))}
                    required
                  />
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    Tip: Google Drive, Dropbox, Notion, GitHub repo, or direct download link.
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">File Size</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 4.2 MB"
                    value={form.fileSize}
                    onChange={e => setForm(f => ({ ...f, fileSize: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. OS, Midterm, Solved"
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Description / Topics Covered</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="Summarize key chapters, questions included, or professor instructions..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-glass-border)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={prefillSample}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}
                >
                  <Sparkles size={14} />
                  <span>Sample Data</span>
                </button>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Sharing...' : 'Publish Material'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialsPage;
