import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { getTasksApi, updateTaskStatusApi, deleteTaskApi } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, ASSIGNED_TO_ME, CREATED_BY_ME
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, TODO, IN_PROGRESS, COMPLETED

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasksApi();
      setTasks(data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatusApi(taskId, newStatus);
      // Update local state smoothly
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTaskApi(taskId);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert(err.message || 'Failed to delete task.');
    }
  };

  // Metrics Calculation
  const totalCount = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    // Role / ownership filter
    if (filterType === 'ASSIGNED_TO_ME') {
      if (!task.assignedTo || task.assignedTo.id !== currentUser.id) return false;
    } else if (filterType === 'CREATED_BY_ME') {
      if (!task.createdBy || task.createdBy.id !== currentUser.id) return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && task.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Welcome, {currentUser.name || 'User'}!</h1>
          <p>Here is an overview of your active tasks and assignments.</p>
        </div>

        <Link to="/create-task" className="btn btn-primary">
          + Create Task
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card total">
          <span className="metric-label">Total Accessible Tasks</span>
          <span className="metric-value">{totalCount}</span>
        </div>
        <div className="metric-card todo">
          <span className="metric-label">To Do</span>
          <span className="metric-value">{todoCount}</span>
        </div>
        <div className="metric-card inprogress">
          <span className="metric-label">In Progress</span>
          <span className="metric-value">{inProgressCount}</span>
        </div>
        <div className="metric-card completed">
          <span className="metric-label">Completed</span>
          <span className="metric-value">{completedCount}</span>
        </div>
      </div>

      {/* Controls / Filter Bar */}
      <div className="controls-bar">
        <div className="filters-group">
          <button
            className={`filter-chip ${filterType === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterType('ALL')}
          >
            All Tasks
          </button>
          <button
            className={`filter-chip ${filterType === 'ASSIGNED_TO_ME' ? 'active' : ''}`}
            onClick={() => setFilterType('ASSIGNED_TO_ME')}
          >
            Assigned to Me
          </button>
          <button
            className={`filter-chip ${filterType === 'CREATED_BY_ME' ? 'active' : ''}`}
            onClick={() => setFilterType('CREATED_BY_ME')}
          >
            Created by Me
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="statusFilterSelect" style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Filter by Status:
          </label>
          <select
            id="statusFilterSelect"
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List Section */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6b7280' }}>
          Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            {tasks.length === 0
              ? "You don't have any tasks yet. Create one to get started!"
              : 'No tasks match the selected filters.'}
          </p>
          <Link to="/create-task" className="btn btn-primary">
            + Create Your First Task
          </Link>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
              currentUserId={currentUser.id}
              userRole={currentUser.role}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
