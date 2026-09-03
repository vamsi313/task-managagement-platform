import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTaskByIdApi, updateTaskStatusApi, deleteTaskApi } from '../services/api';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await getTaskByIdApi(id);
      setTask(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load task details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTaskStatusApi(id, newStatus);
      setTask({ ...task, status: newStatus });
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTaskApi(id);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Failed to delete task.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6b7280' }}>
        Loading task details...
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          <span>{error || 'Task not found.'}</span>
        </div>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isCreator = task.createdBy && task.createdBy.id === currentUser.id;
  const isAssignee = task.assignedTo && task.assignedTo.id === currentUser.id;
  const isAdmin = currentUser.role === 'ADMIN';
  const canEdit = isCreator || isAssignee || isAdmin;
  const canDelete = isCreator || isAdmin;

  const getStatusClass = (status) => {
    switch (status) {
      case 'TODO': return 'badge-status-TODO';
      case 'IN_PROGRESS': return 'badge-status-IN_PROGRESS';
      case 'COMPLETED': return 'badge-status-COMPLETED';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'LOW': return 'badge-priority-LOW';
      case 'MEDIUM': return 'badge-priority-MEDIUM';
      case 'HIGH': return 'badge-priority-HIGH';
      default: return '';
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="details-card">
        <div className="details-header">
          <div>
            <h1 style={{ fontSize: '1.65rem', marginBottom: '0.5rem' }}>{task.title}</h1>
            <div className="task-badges">
              <span className={`badge ${getStatusClass(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
              <span className={`badge ${getPriorityClass(task.priority)}`}>
                {task.priority} Priority
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {canEdit && (
              <Link to={`/edit-task/${task.id}`} className="btn btn-secondary btn-sm">
                Edit
              </Link>
            )}
            {canDelete && (
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="details-body">
          <div style={{ marginBottom: '1.75rem' }}>
            <div className="details-desc-title">Description</div>
            <div className="details-desc-content">
              {task.description || 'No description provided.'}
            </div>
          </div>

          {/* Quick status toggle buttons */}
          {canEdit && (
            <div style={{ marginBottom: '1.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Change Task Status:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${task.status === 'TODO' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleStatusChange('TODO')}
                >
                  To Do
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${task.status === 'IN_PROGRESS' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${task.status === 'COMPLETED' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleStatusChange('COMPLETED')}
                >
                  Completed
                </button>
              </div>
            </div>
          )}

          <div className="details-meta-grid">
            <div>
              <span className="meta-label">Created By:</span>
              <div className="meta-val" style={{ marginTop: '0.2rem' }}>
                {task.createdBy ? `${task.createdBy.name} (${task.createdBy.email})` : 'Unknown'}
              </div>
            </div>

            <div>
              <span className="meta-label">Assigned To:</span>
              <div className="meta-val" style={{ marginTop: '0.2rem' }}>
                {task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.email})` : 'Unassigned'}
              </div>
            </div>

            <div>
              <span className="meta-label">Due Date:</span>
              <div className="meta-val" style={{ marginTop: '0.2rem' }}>
                {task.dueDate ? task.dueDate : 'Not specified'}
              </div>
            </div>

            <div>
              <span className="meta-label">Created At:</span>
              <div className="meta-val" style={{ marginTop: '0.2rem' }}>
                {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div>
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
