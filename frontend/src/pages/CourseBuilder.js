import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, moduleAPI, lessonAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const CourseBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const response = await courseAPI.getCourseById(id);
      setCourse(response.data.course);
      setModules(response.data.modules || []);
      if (response.data.modules?.length > 0) {
        setSelectedModule(response.data.modules[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleSaved = () => {
    setShowModuleForm(false);
    setEditingModule(null);
    fetchCourseData();
  };

  const handleLessonSaved = () => {
    setShowLessonForm(false);
    setEditingLesson(null);
    fetchCourseData();
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await moduleAPI.deleteModule(moduleId);
        fetchCourseData();
      } catch (error) {
        alert('Failed to delete module');
      }
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await lessonAPI.deleteLesson(lessonId);
        fetchCourseData();
      } catch (error) {
        alert('Failed to delete lesson');
      }
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading course...</div></div>;
  }

  if (!course) {
    return <div className="container"><div className="alert alert-error">Course not found</div></div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(`/courses/${id}`)} className="btn btn-secondary">
          ← Back to Course
        </button>
        <h1 style={{ marginTop: '1rem' }}>Course Builder: {course.title}</h1>
        <p style={{ color: '#666' }}>Manage modules and lessons for your course</p>
      </div>

      <div className="builder-container">
        {/* Modules Sidebar */}
        <div className="modules-sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Modules</h3>
            <button className="btn btn-primary btn-small" onClick={() => setShowModuleForm(true)}>
              <FiPlus /> Add
            </button>
          </div>

          {modules.length === 0 ? (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>No modules yet. Create your first module!</p>
          ) : (
            modules.map((module) => (
              <div
                key={module._id}
                className={`module-item ${selectedModule?._id === module._id ? 'active' : ''}`}
                onClick={() => setSelectedModule(module)}
              >
                <div className="module-header">
                  <span className="module-title">{module.title}</span>
                  <div className="module-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="icon-btn" onClick={() => { setEditingModule(module); setShowModuleForm(true); }}>
                      <FiEdit2 />
                    </button>
                    <button className="icon-btn" onClick={() => handleDeleteModule(module._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#999' }}>
                  Order: {module.order} | {module.lessons?.length || 0} lessons
                </div>
              </div>
            ))
          )}
        </div>

        {/* Lessons Panel */}
        <div>
          {selectedModule ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2>{selectedModule.title}</h2>
                  <p style={{ color: '#666' }}>{selectedModule.description}</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowLessonForm(true)}>
                  <FiPlus /> Add Lesson
                </button>
              </div>

              {selectedModule.lessons?.length === 0 ? (
                <div className="empty-state">
                  <h3>No lessons in this module</h3>
                  <button className="btn btn-primary" onClick={() => setShowLessonForm(true)}>
                    Create First Lesson
                  </button>
                </div>
              ) : (
                <div className="lessons-list">
                  {selectedModule.lessons?.map((lesson) => (
                    <div key={lesson._id} className="card lesson-item">
                      <div className="lesson-info">
                        <div className="lesson-title">{lesson.title}</div>
                        <div className="lesson-type">{lesson.contentType}</div>
                        {lesson.description && <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>{lesson.description}</p>}
                      </div>
                      <div className="module-actions">
                        <button className="icon-btn" onClick={() => { setEditingLesson(lesson); setShowLessonForm(true); }}>
                          <FiEdit2 />
                        </button>
                        <button className="icon-btn" onClick={() => handleDeleteLesson(lesson._id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h3>Select a module to view lessons</h3>
              <p>or create a new module to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Module Form Modal */}
      {showModuleForm && (
        <ModuleForm
          courseId={id}
          module={editingModule}
          onClose={() => { setShowModuleForm(false); setEditingModule(null); }}
          onSaved={handleModuleSaved}
        />
      )}

      {/* Lesson Form Modal */}
      {showLessonForm && selectedModule && (
        <LessonForm
          moduleId={selectedModule._id}
          lesson={editingLesson}
          onClose={() => { setShowLessonForm(false); setEditingLesson(null); }}
          onSaved={handleLessonSaved}
        />
      )}
    </div>
  );
};

const ModuleForm = ({ courseId, module, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    title: module?.title || '',
    description: module?.description || '',
    order: module?.order || 1,
    duration: module?.duration || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (module) {
        await moduleAPI.updateModule(module._id, formData);
      } else {
        await moduleAPI.createModule(courseId, formData);
      }
      onSaved();
    } catch (error) {
      alert('Failed to save module');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{module ? 'Edit Module' : 'Create Module'}</h2>
          <button className="icon-btn" onClick={onClose}><FiX size={24} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Module Title *</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Order</label>
              <input
                type="number"
                className="form-control"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                min="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Module'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LessonForm = ({ moduleId, lesson, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    description: lesson?.description || '',
    contentType: lesson?.contentType || 'VIDEO',
    contentUrl: lesson?.contentUrl || '',
    textContent: lesson?.textContent || '',
    duration: lesson?.duration || 0,
    order: lesson?.order || 1,
    isPreview: lesson?.isPreview || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (lesson) {
        await lessonAPI.updateLesson(lesson._id, formData);
      } else {
        await lessonAPI.createLesson(moduleId, formData);
      }
      onSaved();
    } catch (error) {
      alert('Failed to save lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{lesson ? 'Edit Lesson' : 'Create Lesson'}</h2>
          <button className="icon-btn" onClick={onClose}><FiX size={24} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Lesson Title *</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Content Type *</label>
            <select
              className="form-control"
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
            >
              <option value="VIDEO">Video</option>
              <option value="PDF">PDF</option>
              <option value="LINK">Link</option>
              <option value="TEXT">Text</option>
              <option value="QUIZ">Quiz</option>
            </select>
          </div>

          {formData.contentType !== 'TEXT' ? (
            <div className="form-group">
              <label>Content URL *</label>
              <input
                type="url"
                className="form-control"
                value={formData.contentUrl}
                onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Text Content *</label>
              <textarea
                className="form-control"
                value={formData.textContent}
                onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                rows="6"
                required
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Order</label>
              <input
                type="number"
                className="form-control"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.isPreview}
                onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
              />
              Allow preview (learners can view without enrolling)
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Lesson'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseBuilder;