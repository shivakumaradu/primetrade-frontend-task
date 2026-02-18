import { forwardRef } from 'react';

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div
      className={`${sizes[size]} border-2 border-brand-500 border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

// ─── Input Field ──────────────────────────────────────────────────────────────
export const InputField = forwardRef(
  ({ label, error, hint, icon: Icon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-300" htmlFor={props.id || props.name}>
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            className={`input-field ${Icon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${
              error ? 'input-error' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1 animate-fade-in">
            <span>⚠</span> {error}
          </p>
        )}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);
InputField.displayName = 'InputField';

// ─── Select Field ─────────────────────────────────────────────────────────────
export const SelectField = ({ label, error, options = [], className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-300" htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      <select
        className={`input-field cursor-pointer ${error ? 'input-error' : ''} ${className}`}
        {...props}
      >
        {options.map(({ value, label: optLabel }) => (
          <option key={value} value={value} className="bg-slate-800">
            {optLabel}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

// ─── Textarea Field ───────────────────────────────────────────────────────────
export const TextareaField = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-300" htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      <textarea
        className={`input-field resize-none ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

// ─── Alert / Toast ────────────────────────────────────────────────────────────
export const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    success: 'bg-brand-500/10 border-brand-500/30 text-brand-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  const icons = { error: '⚠', success: '✓', warning: '⚠', info: 'ℹ' };

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm animate-fade-in ${styles[type]}`}
      role="alert"
    >
      <span className="flex-shrink-0 mt-0.5">{icons[type]}</span>
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    {icon && (
      <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-4">
        <span className="text-3xl opacity-60">{icon}</span>
      </div>
    )}
    <h3 className="font-display font-semibold text-slate-200 text-lg mb-2">{title}</h3>
    {description && <p className="text-slate-500 text-sm max-w-sm mb-6">{description}</p>}
    {action}
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', isDanger = false, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 w-full max-w-sm animate-slide-up">
        <h3 className="font-display font-semibold text-slate-100 text-lg mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button className="btn-secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className={isDanger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
export const Avatar = ({ name = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-brand-500 to-teal-600 flex items-center justify-center font-display font-semibold text-slate-900 flex-shrink-0`}
    >
      {initials || '?'}
    </div>
  );
};
