import { useState, useEffect } from 'react';
import { InputField, SelectField, TextareaField, Alert, Spinner } from '../ui';
import { getErrorMessage } from '../../utils/helpers';

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const DEFAULT_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  tags: '',
};

export default function TaskFormModal({ isOpen, onClose, onSave, task }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(task);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags?.join(', ') || '',
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
    setServerError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    else if (form.title.length > 200) newErrors.title = 'Title is too long';
    if (form.description && form.description.length > 2000)
      newErrors.description = 'Description is too long';
    if (form.dueDate && isNaN(new Date(form.dueDate)))
      newErrors.dueDate = 'Invalid date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setServerError('');

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 10)
          : [],
      };

      await onSave(payload, task?._id);
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-card animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <h2 className="font-display font-semibold text-white text-lg">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="btn-ghost p-2"
            disabled={isLoading}
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {serverError && (
              <Alert type="error" message={serverError} onClose={() => setServerError('')} />
            )}

            <InputField
              id="title"
              name="title"
              label="Title *"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              error={errors.title}
              disabled={isLoading}
              autoFocus
            />

            <TextareaField
              id="description"
              name="description"
              label="Description"
              placeholder="Add more context (optional)"
              value={form.description}
              onChange={handleChange}
              error={errors.description}
              disabled={isLoading}
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                id="status"
                name="status"
                label="Status"
                value={form.status}
                onChange={handleChange}
                options={STATUS_OPTIONS}
                disabled={isLoading}
              />

              <SelectField
                id="priority"
                name="priority"
                label="Priority"
                value={form.priority}
                onChange={handleChange}
                options={PRIORITY_OPTIONS}
                disabled={isLoading}
              />
            </div>

            <InputField
              id="dueDate"
              name="dueDate"
              type="date"
              label="Due Date"
              value={form.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
              disabled={isLoading}
            />

            <InputField
              id="tags"
              name="tags"
              label="Tags"
              placeholder="design, frontend, urgent (comma-separated)"
              value={form.tags}
              onChange={handleChange}
              hint="Up to 10 tags, comma-separated"
              disabled={isLoading}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-5 border-t border-slate-700/50 justify-end">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  {isEditing ? 'Saving…' : 'Creating…'}
                </>
              ) : (
                isEditing ? 'Save changes' : 'Create task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
