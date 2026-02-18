import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { getErrorMessage, formatDate } from '../../utils/helpers';
import { InputField, Alert, Spinner, Avatar } from '../ui';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    setMessage('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((p) => ({ ...p, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors((p) => ({ ...p, [name]: '' }));
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordForm.password) newErrors.password = 'Password is required';
    else if (passwordForm.password.length < 6) newErrors.password = 'Must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.password))
      newErrors.password = 'Must contain uppercase, lowercase, and number';
    if (!passwordForm.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (passwordForm.password !== passwordForm.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setIsLoading(true);
    setMessage('');
    try {
      const { data } = await userAPI.updateProfile({ name: form.name.trim(), email: form.email.trim().toLowerCase() });
      updateUser(data.data.user);
      setMessage('Profile updated successfully.');
      setMessageType('success');
    } catch (err) {
      setMessage(getErrorMessage(err));
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setIsPasswordLoading(true);
    setMessage('');
    try {
      await userAPI.updateProfile({ password: passwordForm.password });
      setPasswordForm({ password: '', confirmPassword: '' });
      setMessage('Password changed successfully.');
      setMessageType('success');
    } catch (err) {
      setMessage(getErrorMessage(err));
      setMessageType('error');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Profile</h1>
        <p className="text-slate-500 text-sm">Manage your account information</p>
      </div>

      {message && (
        <Alert
          type={messageType}
          message={message}
          onClose={() => setMessage('')}
        />
      )}

      {/* Profile Card */}
      <div className="glass-card p-6 animate-slide-up">
        {/* Avatar section */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700/50">
          <Avatar name={user?.name} size="xl" />
          <div>
            <h2 className="font-display font-semibold text-white text-lg">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            {user?.role && (
              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-500/15 text-brand-400 border border-brand-500/25 capitalize">
                {user.role}
              </span>
            )}
          </div>
        </div>

        {/* Profile form */}
        <form onSubmit={handleProfileSave} noValidate className="space-y-4">
          <h3 className="font-display font-semibold text-slate-200 text-sm uppercase tracking-wider mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="name"
              name="name"
              label="Full Name"
              value={form.name}
              onChange={handleProfileChange}
              error={errors.name}
              disabled={isLoading}
            />
            <InputField
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={form.email}
              onChange={handleProfileChange}
              error={errors.email}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Member Since</label>
              <div className="input-field opacity-60 cursor-not-allowed">
                {formatDate(user?.createdAt) || '—'}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Last Login</label>
              <div className="input-field opacity-60 cursor-not-allowed">
                {formatDate(user?.lastLogin) || '—'}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? <><Spinner size="sm" /> Saving…</> : 'Save changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Card */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <form onSubmit={handlePasswordSave} noValidate className="space-y-4">
          <h3 className="font-display font-semibold text-slate-200 text-sm uppercase tracking-wider mb-4">
            Change Password
          </h3>

          <InputField
            id="password"
            name="password"
            type="password"
            label="New Password"
            placeholder="Enter a new password"
            value={passwordForm.password}
            onChange={handlePasswordChange}
            error={passwordErrors.password}
            disabled={isPasswordLoading}
            autoComplete="new-password"
          />

          <InputField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.confirmPassword}
            disabled={isPasswordLoading}
            autoComplete="new-password"
          />

          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={isPasswordLoading}>
              {isPasswordLoading ? <><Spinner size="sm" /> Updating…</> : 'Update password'}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-red-500/10 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h3 className="font-display font-semibold text-red-400 text-sm uppercase tracking-wider mb-2">
          Account
        </h3>
        <p className="text-slate-500 text-sm mb-4">
          Account details and member information
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500 text-xs mb-1">Account ID</p>
            <p className="font-mono text-xs text-slate-400 break-all">{user?._id?.slice(-8) || '—'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Account Status</p>
            <p className="text-brand-400 font-medium text-xs">● Active</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Role</p>
            <p className="text-slate-300 text-xs capitalize">{user?.role || 'user'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
