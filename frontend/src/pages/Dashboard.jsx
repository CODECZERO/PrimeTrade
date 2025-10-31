import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaPlus, FaFilter, FaChartBar } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  // Fetch stats only once on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks(filters);
      setTasks(response.data.data.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await tasksAPI.getStats();
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await tasksAPI.createTask(taskData);
      toast.success('Task created successfully');
      setIsModalOpen(false);
      // Add new task to state instead of refetching all tasks
      setTasks([response.data.data.task, ...tasks]);
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await tasksAPI.updateTask(selectedTask.id, taskData);
      toast.success('Task updated successfully');
      setIsModalOpen(false);
      setSelectedTask(null);
      // Update task in state instead of refetching all tasks
      setTasks(tasks.map(t => t.id === selectedTask.id ? response.data.data.task : t));
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.deleteTask(taskId);
      toast.success('Task deleted successfully');
      // Remove task from state instead of refetching all tasks
      setTasks(tasks.filter(t => t.id !== taskId));
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">Manage your tasks and stay productive</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold mt-1">{stats.total_tasks}</p>
                </div>
                <FaChartBar className="text-4xl text-blue-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Pending</p>
                  <p className="text-3xl font-bold mt-1">{stats.pending}</p>
                </div>
                <FaChartBar className="text-4xl text-yellow-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completed</p>
                  <p className="text-3xl font-bold mt-1">{stats.completed}</p>
                </div>
                <FaChartBar className="text-4xl text-green-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Overdue</p>
                  <p className="text-3xl font-bold mt-1">{stats.overdue}</p>
                </div>
                <FaChartBar className="text-4xl text-red-200" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <FaFilter className="text-gray-400" />
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              {(filters.status || filters.priority) && (
                <button onClick={clearFilters} className="btn-secondary">
                  Clear Filters
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedTask(null);
                setIsModalOpen(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <FaPlus />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No tasks found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <FaPlus />
              <span>Create Your First Task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;
