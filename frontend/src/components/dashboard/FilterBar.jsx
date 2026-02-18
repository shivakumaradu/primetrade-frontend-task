import { useRef } from 'react';
import { debounce } from '../../utils/helpers';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const SortIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'title', label: 'Title' },
  { value: 'priority', label: 'Priority' },
  { value: 'dueDate', label: 'Due Date' },
];

export default function FilterBar({ filters, onChange }) {
  const searchRef = useRef(null);

  const debouncedSearch = useRef(
    debounce((val) => onChange({ search: val }), 350)
  ).current;

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  const clearAll = () => {
    if (searchRef.current) searchRef.current.value = '';
    onChange({ search: '', status: '', priority: '', sortBy: 'createdAt', sortOrder: 'desc' });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          ref={searchRef}
          type="search"
          placeholder="Search tasks…"
          defaultValue={filters.search}
          onChange={handleSearch}
          className="input-field pl-10 w-full"
        />
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-slate-600">
          <FilterIcon />
        </div>

        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="input-field py-2 text-xs cursor-pointer min-w-0 w-auto"
        >
          {STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value} className="bg-slate-800">{label}</option>
          ))}
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onChange({ priority: e.target.value })}
          className="input-field py-2 text-xs cursor-pointer min-w-0 w-auto"
        >
          {PRIORITY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value} className="bg-slate-800">{label}</option>
          ))}
        </select>

        <div className="flex items-center gap-1 text-slate-600">
          <SortIcon />
        </div>

        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value })}
          className="input-field py-2 text-xs cursor-pointer min-w-0 w-auto"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value} className="bg-slate-800">{label}</option>
          ))}
        </select>

        <button
          onClick={() => onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
          className="btn-ghost py-2 px-2.5 text-xs"
          title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          {filters.sortOrder === 'asc' ? '↑' : '↓'}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="btn-ghost py-2 px-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-1"
            title="Clear filters"
          >
            <XIcon />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
