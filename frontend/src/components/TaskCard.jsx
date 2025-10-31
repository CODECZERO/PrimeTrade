import React from 'react';
import { FaEdit, FaTrash, FaClock, FaFlag } from 'react-icons/fa';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-blue-500',
    high: 'text-orange-500',
    urgent: 'text-red-500',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors"
            title="Edit task"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete task"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`badge ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
        <span className={`badge bg-gray-100 ${priorityColors[task.priority]} flex items-center space-x-1`}>
          <FaFlag />
          <span>{task.priority}</span>
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
        <div className="flex items-center space-x-1">
          <FaClock />
          <span>{formatDate(task.due_date)}</span>
        </div>
        {task.username && (
          <span className="text-gray-600">By: {task.username}</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
