import React from 'react';
import { Link } from 'react-router-dom';

const TaskCard = ({ task, onStatusChange, onDelete, currentUserId, userRole }) => {
  const isCreator = task.createdBy && task.createdBy.id === currentUserId;
  const isAssignee = task.assignedTo && task.assignedTo.id === currentUserId;
  const isAdmin = userRole === 'ADMIN';

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
    <div className="task-card">
      <div>
        <div className="task-card-header">
          <h3 className="task-title">{task.title}</h3>
        </div>

        <div className="task-badges">
          <span className={`badge ${getStatusClass(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
          <span className={`badge ${getPriorityClass(task.priority)}`}>
            {task.priority} Priority
          </span>
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        <div className="task-meta">
          <div className="meta-item">
            <span className="meta-label">Assigned to:</span>
            <span className="meta-val">
              {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created by:</span>
            <span className="meta-val">
              {task.createdBy ? task.createdBy.name : 'Unknown'}
            </span>
          </div>
          {task.dueDate && (
            <div className="meta-item">
              <span className="meta-label">Due Date:</span>
              <span className="meta-val">{task.dueDate}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        {/* Status quick select */}
        <div style={{ marginBottom: '0.75rem' }}>
          <select
            className="form-select"
            style={{ fontSize: '0.8125rem', padding: '0.35rem 0.6rem' }}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="task-actions">
          <Link to={`/tasks/${task.id}`} className="btn btn-secondary btn-sm">
            View
          </Link>
          
          {canEdit && (
            <Link to={`/edit-task/${task.id}`} className="btn btn-secondary btn-sm">
              Edit
            </Link>
          )}

          {canDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="btn btn-danger btn-sm"
              title="Delete task"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
