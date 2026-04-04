import { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const STATUS_OPTIONS = [
  { label: 'Cancelled', value: 'canceled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Rated', value: 'rated' },
  { label: 'Unrated', value: 'unrated' },
];

const selectStyles = {
  control: (base: object, state: { isFocused: boolean }) => ({
    ...base,
    borderColor: state.isFocused ? '#5F6FFF' : '#e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    minHeight: '40px',
    boxShadow: 'none',
    '&:hover': { borderColor: '#5F6FFF' },
  }),
  option: (base: object, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: state.isSelected ? '#5F6FFF' : state.isFocused ? '#eef2ff' : 'white',
    color: state.isSelected ? 'white' : '#374151',
  }),
  multiValue: (base: object) => ({ ...base, backgroundColor: '#eef2ff', borderRadius: '9999px' }),
  multiValueLabel: (base: object) => ({ ...base, color: '#4f46e5', fontSize: '0.75rem' }),
  multiValueRemove: (base: object) => ({
    ...base, color: '#6366f1', borderRadius: '9999px',
    '&:hover': { backgroundColor: '#6366f1', color: 'white' },
  }),
  placeholder: (base: object) => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' }),
};

export interface DoctorAppointmentFilterValues {
  statuses: string[];
  fromDate: string;
  toDate: string;
}

const DEFAULT_FILTERS: DoctorAppointmentFilterValues = {
  statuses: [],
  fromDate: '',
  toDate: '',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  values: DoctorAppointmentFilterValues;
  onApply: (values: DoctorAppointmentFilterValues) => void;
  onReset: () => void;
}

const AppointmentsFilterPanel = ({ isOpen, onClose, values, onApply, onReset }: Props) => {
  const [draft, setDraft] = useState<DoctorAppointmentFilterValues>(values);

  const handleApply = () => { onApply(draft); onClose(); };

  const handleReset = () => {
    setDraft(DEFAULT_FILTERS);
    onReset();
    onClose();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}

      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Apply Filters</h2>
          <div className="flex items-center gap-4">
            <button onClick={handleReset} className="text-sm text-primary font-medium hover:underline">
              Reset All
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <Select
              isMulti
              options={STATUS_OPTIONS}
              value={STATUS_OPTIONS.filter(o => draft.statuses.includes(o.value))}
              onChange={(selected) => setDraft(prev => ({
                ...prev, statuses: selected.map(s => s.value)
              }))}
              placeholder="Select statuses..."
              styles={selectStyles}
            />
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
            <DatePicker
              selected={draft.fromDate ? new Date(draft.fromDate) : null}
              onChange={(date: Date | null) => setDraft(prev => ({
                ...prev, fromDate: date ? date.toISOString().split('T')[0] : ''
              }))}
              placeholderText="Select from date"
              dateFormat="MMM d, yyyy"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
            <DatePicker
              selected={draft.toDate ? new Date(draft.toDate) : null}
              onChange={(date: Date | null) => setDraft(prev => ({
                ...prev, toDate: date ? date.toISOString().split('T')[0] : ''
              }))}
              placeholderText="Select to date"
              dateFormat="MMM d, yyyy"
              minDate={draft.fromDate ? new Date(draft.fromDate) : undefined}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleApply} className="flex-1 py-2.5 text-sm font-medium bg-primary text-white rounded-xl hover:opacity-90 transition-colors">
            Apply
          </button>
        </div>

      </div>
    </>
  );
};

export default AppointmentsFilterPanel;