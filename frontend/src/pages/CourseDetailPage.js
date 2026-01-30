import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiEdit, FiSettings, FiPlay, FiClock, FiBarChart } from 'react-icons/fi';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isTrainer } = useAuth();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      const response = await courseAPI.getCourseById(id);
      setCourse(response.data.course);
      setModules(response.data.modules || []);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await courseAPI.toggleCourseStatus(id, newStatus);
      setCourse({ ...course, status: newStatus });
      alert(`Course ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      alert('Failed to update course status');
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading course...</div></div>;
  }

  if (!course) {
    return <div className="container"><div className="alert alert-error">Course not found</div></div>;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'DRAFT': return 'status-draft';
      case 'PUBLISHED': return 'status-published';
      case 'ARCHIVED': return 'status-archived';
      default: return '';
    }
  };

  const totalLessons = modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);

  return (
    <div className="container">
      {/* Course Header */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <h1 style={{ margin: 0 }}>{course.title}</h1>
              <span className={`course-status ${getStatusClass(course.status)}`}>
                {course.status}
              </span>
            </div>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>{course.description}</p>
          </div>

          {isTrainer() && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/courses/${id}/edit`} className="btn btn-secondary btn-small">
                <FiEdit /> Edit
              </Link>
              <Link to={`/courses/${id}/builder`} className="btn btn-primary btn-small">
                <FiSettings /> Manage Content
              </Link>
            </div>
          )}
        </div>

        {/* Course Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E8E8E8' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem' }}>Category</div>
            <div style={{ fontWeight: '600' }}>{course.category}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem' }}>Difficulty</div>
            <div style={{ fontWeight: '600' }}>{course.difficulty}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem' }}>Duration</div>
            <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiClock /> {course.duration} hours
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem' }}>Content</div>
            <div style={{ fontWeight: '600' }}>
              {modules.length} modules, {totalLessons} lessons
            </div>
          </div>
        </div>

        {course.tags && course.tags.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem' }}>Tags</div>
            <div className="tags-container">
              {course.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {isTrainer() && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E8E8E8' }}>
            <button
              onClick={handlePublishToggle}
              className={course.status === 'PUBLISHED' ? 'btn btn-secondary' : 'btn btn-success'}
            >
              {course.status === 'PUBLISHED' ? 'Unpublish Course' : 'Publish Course'}
            </button>
          </div>
        )}
      </div>

      {/* Learning Objectives */}
      {course.learningObjectives && course.learningObjectives.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>What You'll Learn</h3>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {course.learningObjectives.map((objective, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', color: '#555' }}>{objective}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Prerequisites */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Prerequisites</h3>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {course.prerequisites.map((prereq, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', color: '#555' }}>{prereq}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Course Content */}
      <div className="card">
        <h2>Course Content</h2>
        {modules.length === 0 ? (
          <div className="empty-state">
            <h3>No content yet</h3>
            {isTrainer() && (
              <Link to={`/courses/${id}/builder`} className="btn btn-primary">
                Add Modules and Lessons
              </Link>
            )}
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem' }}>
            {modules.map((module, index) => (
              <ModuleAccordion
                key={module._id}
                module={module}
                isExpanded={expandedModule === module._id}
                onToggle={() => setExpandedModule(expandedModule === module._id ? null : module._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ModuleAccordion = ({ module, isExpanded, onToggle }) => {
  return (
    <div style={{ border: '1px solid #E8E8E8', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden' }}>
      <div
        onClick={onToggle}
        style={{
          padding: '1rem 1.5rem',
          cursor: 'pointer',
          backgroundColor: isExpanded ? '#F8F9FA' : 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background-color 0.3s'
        }}
      >
        <div>
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>{module.title}</h4>
          {module.description && <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{module.description}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            {module.lessons?.length || 0} lessons
          </span>
          <span style={{ fontSize: '1.5rem', color: '#666' }}>
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '0 1.5rem 1rem', backgroundColor: '#FAFAFA' }}>
          {module.lessons && module.lessons.length > 0 ? (
            module.lessons.map((lesson, index) => (
              <div
                key={lesson._id}
                style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <FiPlay size={16} color="#4A90E2" />
                    <span style={{ fontWeight: '500' }}>{lesson.title}</span>
                    {lesson.isPreview && (
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#D1F2EB', color: '#0C5460', padding: '0.125rem 0.5rem', borderRadius: '8px' }}>
                        Preview
                      </span>
                    )}
                  </div>
                  {lesson.description && (
                    <p style={{ margin: 0, color: '#666', fontSize: '0.85rem', marginLeft: '1.5rem' }}>
                      {lesson.description}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase' }}>
                    {lesson.contentType}
                  </span>
                  {lesson.duration > 0 && (
                    <span style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FiClock size={14} /> {lesson.duration}min
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#999', fontSize: '0.9rem', padding: '1rem', textAlign: 'center' }}>
              No lessons in this module yet
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;