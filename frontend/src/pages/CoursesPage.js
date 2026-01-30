import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiPlus } from 'react-icons/fi';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    difficulty: '',
    search: '',
  });
  const { isTrainer } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.search) params.search = filters.search;

      const response = await courseAPI.getAllCourses(params);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container">
      <div className="courses-header">
        <h1>Courses</h1>
        {isTrainer() && (
          <Link to="/courses/create" className="btn btn-primary">
            <FiPlus style={{ marginRight: '0.5rem' }} />
            Create New Course
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search courses..."
            className="search-box"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            className="form-control"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select
            className="form-control"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All</option>
            <option value="TECHNICAL">Technical</option>
            <option value="SOFT_SKILLS">Soft Skills</option>
            <option value="COMPLIANCE">Compliance</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Difficulty</label>
          <select
            className="form-control"
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="">All</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <h3>No courses found</h3>
          {isTrainer() && (
            <p>
              <Link to="/courses/create">Create your first course</Link>
            </p>
          )}
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ course }) => {
  const { isTrainer } = useAuth();

  const getStatusClass = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'status-draft';
      case 'PUBLISHED':
        return 'status-published';
      case 'ARCHIVED':
        return 'status-archived';
      default:
        return '';
    }
  };

  return (
    <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card course-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">{course.title}</h3>
            <span className={`course-status ${getStatusClass(course.status)}`}>
              {course.status}
            </span>
          </div>
        </div>

        <p className="card-description">
          {course.description.length > 100
            ? `${course.description.substring(0, 100)}...`
            : course.description}
        </p>

        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            <strong>Category:</strong> {course.category}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            <strong>Difficulty:</strong> {course.difficulty}
          </div>
          {course.duration > 0 && (
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              <strong>Duration:</strong> {course.duration} hours
            </div>
          )}
        </div>

        {course.tags && course.tags.length > 0 && (
          <div className="tags-container">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {isTrainer() && (
          <div className="card-footer">
            <Link to={`/courses/${course._id}/edit`} className="btn btn-secondary btn-small">
              Edit
            </Link>
            <Link to={`/courses/${course._id}/builder`} className="btn btn-primary btn-small">
              Manage Content
            </Link>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CoursesPage;