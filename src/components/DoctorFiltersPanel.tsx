import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StarRatingFilter from './StarRatingFilter';
import DualRangeSlider from './DualRangeSlider';
import Toggle from './Toggle';

const ALL_SPECIALTIES = [
  { label: 'General Physician', value: 'GeneralPhysician' },
  { label: 'Gynecologist', value: 'Gynecologist' },
  { label: 'Dermatologist', value: 'Dermatologist' },
  { label: 'Pediatrician', value: 'Pediatrician' },
  { label: 'Neurologist', value: 'Neurologist' },
  { label: 'Gastroenterologist', value: 'Gastroenterologist' },
  { label: 'Psychologist', value: 'Psychologist' },
  { label: 'Cardiologist', value: 'Cardiologist' },
  { label: 'Orthopedic Surgeon', value: 'OrthopedicSurgeon' },
];

const SORT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Newest', value: 'newly' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Alphabetically', value: 'alphabetically' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Reviews', value: 'reviews' },
  { label: 'Fee: Low to High', value: 'fee_low' },
  { label: 'Fee: High to Low', value: 'fee_high' },
];

// react-select custom styles to match indigo theme
const selectStyles = {
  control: (base: object, state: { isFocused: boolean }) => ({
    ...base,
    borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
    borderRadius: '0.5rem',
    backgroundColor: '#f9fafb',
    boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
    fontSize: '0.875rem',
    minHeight: '38px',
    '&:hover': { borderColor: '#a5b4fc' },
  }),
  option: (base: object, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#eef2ff' : 'white',
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




export interface DoctorFiltersPanelProps {
  selectedSpecialties: string[];
  feeRange: [number, number];
  ratingRange: [number, number];
  gender: 'MALE' | 'FEMALE' | '';
  sortBy: string;
  onParamsChange: (updates: Record<string, string | null>) => void;
  onClearAll: () => void;
  // new props
  experienceRange: [number, number];
  consultationType: 'online' | 'clinic' | '';
  joinFromDate: string;
  joinToDate: string;
  hasAppointments: boolean;
  name: string;
}

function DoctorFiltersPanel({
  selectedSpecialties, feeRange, ratingRange, gender, sortBy,
  onParamsChange, onClearAll,
  experienceRange, consultationType, joinFromDate, joinToDate,
  hasAppointments, name,
}: DoctorFiltersPanelProps) {
  const selectedRating = ratingRange[0] >= 1 ? ratingRange[0] : 0;

  const hasActiveFilters =
    selectedSpecialties.length > 0 ||
    feeRange[0] > 0 || feeRange[1] < 500 ||
    ratingRange[0] > 1 ||
    experienceRange[0] > 0 || experienceRange[1] < 30 ||
    gender !== '' || sortBy !== '' ||
    consultationType !== '' ||
    joinFromDate !== '' || joinToDate !== '' ||
    hasAppointments || name !== '';

  return (
    <div className="w-full sm:w-64 shrink-0 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit space-y-5">
      <h3 className="text-lg font-medium text-gray-700">Filters</h3>

      {/* ── Name Search ─────────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Search by Name</p>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            value={name}
            onChange={(e) => onParamsChange({ name: e.target.value || null })}
            placeholder="Doctor name..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* ── Specialty ────────────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Specialty</p>
        <Select
          isMulti
          options={ALL_SPECIALTIES}
          value={ALL_SPECIALTIES.filter(s => selectedSpecialties.includes(s.value))}
          onChange={(selected) => {
            const values = selected.map(s => s.value);
            onParamsChange({ speciality: values.length > 0 ? values.join(',') : null });
          }}
          placeholder="All specialties"
          styles={selectStyles}
          classNamePrefix="react-select"
        />
      </div>

      {/* ── Sort By ──────────────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Sort By</p>
        <Select
          options={SORT_OPTIONS}
          value={SORT_OPTIONS.find(o => o.value === sortBy) ?? SORT_OPTIONS[0]}
          onChange={(selected) => onParamsChange({ sortBy: selected?.value || null })}
          styles={selectStyles}
          classNamePrefix="react-select"
        />
      </div>

      {/* ── Fee Range ────────────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Fee Range</p>
        <DualRangeSlider
          min={0} max={500}
          valueMin={feeRange[0]} valueMax={feeRange[1]}
          onChange={(lo, hi) => onParamsChange({
            minFee: lo > 0 ? String(lo) : null,
            maxFee: hi < 500 ? String(hi) : null,
          })}
          prefix="$"
        />
      </div>

      {/* ── Experience Range ─────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Experience (years)</p>
        <DualRangeSlider
          min={0} max={30}
          valueMin={experienceRange[0]} valueMax={experienceRange[1]}
          onChange={(lo, hi) => onParamsChange({
            minExperience: lo > 0 ? String(lo) : null,
            maxExperience: hi < 30 ? String(hi) : null,
          })}
        />
      </div>

      {/* ── Rating ───────────────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Rating</p>
        <StarRatingFilter
          value={selectedRating}
          onChange={(rating) => onParamsChange({
            minRating: rating > 0 ? String(rating) : null,
            maxRating: rating > 0 ? '5' : null,
          })}
        />
      </div>

      {/* ── Gender ───────────────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Gender</p>
        <div className="flex gap-2">
          {(['', 'MALE', 'FEMALE'] as const).map((g) => (
            <button
              key={g}
              onClick={() => onParamsChange({ gender: g || null })}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition font-medium ${
                gender === g
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'border-gray-300 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              {g === '' ? 'All' : g === 'MALE' ? 'Male' : 'Female'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Consultation Type ────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Consultation Type</p>
        <div className="flex gap-2">
          {(['', 'online', 'clinic'] as const).map((c) => (
            <button
              key={c}
              onClick={() => onParamsChange({ consultationType: c || null })}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition font-medium ${
                consultationType === c
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'border-gray-300 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              {c === '' ? 'Both' : c === 'online' ? 'Online' : 'Clinic'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Join Date Range ──────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Joined Between</p>
        <div className="flex flex-col gap-2">
          <DatePicker
            selected={joinFromDate ? new Date(joinFromDate) : null}
            onChange={(date: Date | null) => onParamsChange({
              joinFromDate: date ? date.toISOString().split('T')[0] : null
            })}
            placeholderText="From date"
            dateFormat="MMM d, yyyy"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <DatePicker
            selected={joinToDate ? new Date(joinToDate) : null}
            onChange={(date: Date | null) => onParamsChange({
              joinToDate: date ? date.toISOString().split('T')[0] : null
            })}
            placeholderText="To date"
            dateFormat="MMM d, yyyy"
            minDate={joinFromDate ? new Date(joinFromDate) : undefined}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* ── Has Appointments Toggle ──────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Has Appointments</p>
        <Toggle
          checked={hasAppointments}
          onChange={(v) => onParamsChange({ hasAppointments: v ? 'true' : null })}
        />
      </div>

      {/* ── Clear All ────────────────────────────────── */}
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="w-full py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default DoctorFiltersPanel;