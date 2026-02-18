import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tasksAPI } from '../../services/api';
import { getErrorMessage } from '../../utils/helpers';
import { Spinner, Alert, EmptyState } from '../ui';
import TaskCard from './TaskCard';
import TaskFormModal from './TaskFormModal';
import FilterBar from './FilterBar';
import StatsCards from './StatsCards';

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const DEFAULT_FILTERS = {
  search: '',
  status: '',
  priority: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // ─── Fetch Tasks ────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async (appliedFilters = filters) => {
    setIsLoading(true);
    setError('');
    try {
      const params = {};
      if (appliedFilters.search) params.search = appliedFilters.search;
      if (appliedFilters.status) params.status = appliedFilters.status;
      if (appliedFilters.priority) params.priority = appliedFilters.priority;
      params.sortBy = appliedFilters.sortBy;
      params.sortOrder = appliedFilters.sortOrder;
      params.limit = 50;

      const { data } = await tasksAPI.getAll(params);
      setTasks(data.data.tasks);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const { data } = await tasksAPI.getStats();
      setStats(data.data.stats);
    } catch {
      // non-critical, ignore
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  // ─── Filter Changes ─────────────────────────────────────────────────────────
  const handleFilterChange = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    fetchTasks(updated);
  };

  // ─── CRUD Operations ────────────────────────────────────────────────────────
  const handleSave = async (payload, taskId) => {
    if (taskId) {
      const { data } = await tasksAPI.update(taskId, payload);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data.data.task : t)));
    } else {
      const { data } = await tasksAPI.create(payload);
      setTasks((prev) => [data.data.task, ...prev]);
      fetchStats();
    }
    fetchStats();
  };

  const handleDelete = async (taskId) => {
    await tasksAPI.delete(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    fetchStats();
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 animate-fade-in">
        <div>
          <p className="text-slate-500 text-sm mb-0.5">{greeting},</p>
          <h1 className="font-display font-bold text-2xl text-white">
            {user?.name?.split(' ')[0]} <span className="text-gradient">👋</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {pagination?.total ?? 0} task{pagination?.total !== 1 ? 's' : ''} in total
          </p>
        </div>
        <button className="btn-primary flex-shrink-0" onClick={openCreate}>
          <PlusIcon />
          New Task
        </button>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} isLoading={isStatsLoading} />

      {/* Filters */}
      <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
        <FilterBar filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Error */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Task Grid */}
      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon="📭"
            title={filters.search || filters.status || filters.priority ? 'No tasks match your filters' : 'No tasks yet'}
            description={
              filters.search || filters.status || filters.priority
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Create your first task to get started with TaskFlow.'
            }
            action={
              !filters.search && !filters.status && !filters.priority ? (
                <button className="btn-primary" onClick={openCreate}>
                  <PlusIcon />
                  Create your first task
                </button>
              ) : null
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}
