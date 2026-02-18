import { useState } from 'react';
import { STATUS_META, PRIORITY_META, formatDate, isOverdue, truncate } from '../../utils/helpers';
import { ConfirmModal } from '../ui';

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function TaskCard({ task, onEdit, onDelete }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const overdue = isOverdue(task.dueDate, task.status);
  const statusMeta = STATUS_META[task.status];
  const priorityMeta = PRIORITY_META[task.priority];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <div className="glass-card-hover p-4 group animate-fade-in">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3
            className={`font-display font-semibold text-sm leading-snug flex-1 ${
              task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-100'
            }`}
          >
            {task.title}
          </h3>
          {/* Actions - visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-all duration-200"
              title="Edit task"
            >
              <EditIcon />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              title="Delete task"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            {truncate(task.description, 120)}
          </p>
        )}

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={statusMeta.className}>{statusMeta.label}</span>
          <span className={priorityMeta.className}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityMeta.dot} inline-block mr-1`} />
            {priorityMeta.label}
          </span>
        </div>

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {task.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md border border-slate-700/50">
                #{tag}
              </span>
            ))}
            {task.tags.length > 4 && (
              <span className="text-xs text-slate-600">+{task.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer: due date */}
        {task.dueDate && (
          <div className={`flex items-center gap-1.5 text-xs ${overdue ? 'text-red-400' : 'text-slate-500'}`}>
            <CalendarIcon />
            {overdue && <span className="font-medium">Overdue · </span>}
            Due {formatDate(task.dueDate)}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete task?"
        message={`"${task.title}" will be permanently removed.`}
        confirmLabel="Delete"
        isDanger
        isLoading={isDeleting}
      />
    </>
  );
}
