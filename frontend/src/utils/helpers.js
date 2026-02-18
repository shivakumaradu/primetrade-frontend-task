/**
 * Extract a user-friendly error message from an Axios error response.
 */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.errors?.length) {
    return error.response.data.errors.map((e) => e.message).join(', ');
  }
  if (error?.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your connection.';
  }
  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }
  return error?.message || 'An unexpected error occurred.';
};

/**
 * Format a date string to a readable format.
 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date)) return null;

  const defaults = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-US', { ...defaults, ...options });
};

/**
 * Format a date as a relative time string (e.g. "3 days ago").
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
};

/**
 * Check if a due date is overdue (past today, not completed).
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date();
};

/**
 * Get initials from a full name.
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

/**
 * Debounce a function call.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Truncate a string to a max length.
 */
export const truncate = (str, maxLen = 100) => {
  if (!str || str.length <= maxLen) return str;
  return str.substring(0, maxLen).trimEnd() + '…';
};

/**
 * Priority metadata for UI rendering.
 */
export const PRIORITY_META = {
  high: { label: 'High', className: 'priority-high', dot: 'bg-red-400' },
  medium: { label: 'Medium', className: 'priority-medium', dot: 'bg-blue-400' },
  low: { label: 'Low', className: 'priority-low', dot: 'bg-slate-400' },
};

/**
 * Status metadata for UI rendering.
 */
export const STATUS_META = {
  todo: { label: 'To Do', className: 'status-todo' },
  'in-progress': { label: 'In Progress', className: 'status-in-progress' },
  completed: { label: 'Completed', className: 'status-completed' },
};
