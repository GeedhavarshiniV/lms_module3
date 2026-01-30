import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { FiX } from 'react-icons/fi';

const CourseFormPage = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL',
    difficulty: 'BEGINNER',
    duration: 0,
    thumbnailUrl: '',
    tags: [],
    prerequisites: [],
    learningObjectives: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [prerequisiteInput, setPrerequisiteInput] = useState('');
  const [objectiveInput, setObjectiveInput] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      fetchCourse();
    }
  }, [isEdit, id]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getCourseById(id);
      const course = response.data.course;
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty,
        duration: course.duration || 0,
        thumbnailUrl: course.thumbnailUrl || '',
        tags: course.tags || [],
        prerequisites: course.prerequisites || [],
        learningObjectives: course.learningObjectives || [],
      });
    } catch (error) {
      setError('Failed to fetch course details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addPrerequisite = () => {
    if (prerequisiteInput.trim() && !formData.prerequisites.includes(prerequisiteInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()],
      }));
      setPrerequisiteInput('');
    }
  };

  const removePrerequisite = (item) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((p) => p !== item),
    }));
  };

  const addObjective = () => {
    if (objectiveInput.trim() && !formData.learningObjectives.includes(objectiveInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, objectiveInput.trim()],
      }));
      setObjectiveInput('');
    }
  };

  const removeObjective = (item) => {
    setFormData((prev) => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((o) => o !== item),
    }));
  };

  const handleSubmit = async (e, asDraft = true) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await courseAPI.updateCourse(id, formData);
        setSuccess('Course updated successfully!');
      } else {
        const response = await courseAPI.createCourse(formData);
        setSuccess('Course created successfully!');
        setTimeout(() => {
          navigate(`/courses/${response.data.course._id}`);
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>{isEdit ? 'Edit Course' : 'Create New Course'}</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ marginTop: '2rem' }}>
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter course title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what students will learn in this course"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Category</label>
              <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
                <option value="TECHNICAL">Technical</option>
                <option value="SOFT_SKILLS">Soft Skills</option>
                <option value="COMPLIANCE">Compliance</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <select name="difficulty" className="form-control" value={formData.difficulty} onChange={handleChange}>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration (hours)</label>
              <input
                type="number"
                name="duration"
                className="form-control"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Thumbnail URL (optional)</label>
            <input
              type="url"
              name="thumbnailUrl"
              className="form-control"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>Tags</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag and press Enter"
              />
              <button type="button" onClick={addTag} className="btn btn-secondary">
                Add
              </button>
            </div>
            <div className="tags-container">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <FiX className="tag-remove" onClick={() => removeTag(tag)} />
                </span>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="form-group">
            <label>Prerequisites</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                value={prerequisiteInput}
                onChange={(e) => setPrerequisiteInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                placeholder="Add a prerequisite and press Enter"
              />
              <button type="button" onClick={addPrerequisite} className="btn btn-secondary">
                Add
              </button>
            </div>
            <div className="tags-container">
              {formData.prerequisites.map((item, index) => (
                <span key={index} className="tag">
                  {item}
                  <FiX className="tag-remove" onClick={() => removePrerequisite(item)} />
                </span>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="form-group">
            <label>Learning Objectives</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                placeholder="Add a learning objective and press Enter"
              />
              <button type="button" onClick={addObjective} className="btn btn-secondary">
                Add
              </button>
            </div>
            <div className="tags-container">
              {formData.learningObjectives.map((item, index) => (
                <span key={index} className="tag">
                  {item}
                  <FiX className="tag-remove" onClick={() => removeObjective(item)} />
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/courses')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormPage;