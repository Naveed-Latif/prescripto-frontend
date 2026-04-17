import Select from 'react-select';
import StarRatingFilter from './StarRatingFilter';
import DualRangeSlider from './DualRangeSlider';

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

// react-select custom styles to match the reference design
const selectStyles = {
  control: (base: object, state: { isFocused: boolean }) => ({
    ...base,
    borderColor: state.isFocused ? '#6366f1' : '#e5e7eb',
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff',
    boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
    fontSize: '0.875rem',
    minHeight: '40px',
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
  experienceRange: [number, number];
  consultationType: 'online' | 'clinic' | '';
  name: string;
}

function DoctorFiltersPanel({
  selectedSpecialties, feeRange, ratingRange, gender, sortBy,
  onParamsChange, onClearAll,
  experienceRange, consultationType, name,
}: DoctorFiltersPanelProps) {
  const selectedRating = ratingRange[0] >= 1 ? ratingRange[0] : 0;

  const hasActiveFilters =
    selectedSpecialties.length > 0 ||
    feeRange[0] > 0 || feeRange[1] < 500 ||
    ratingRange[0] > 1 ||
    experienceRange[0] > 0 || experienceRange[1] < 30 ||
    gender !== '' || sortBy !== '' ||
    consultationType !== '' ||
    name !== '';

  return (
    <div className="w-full sm:w-64 shrink-0 bg-white border border-gray-100 rounded-2xl shadow-sm h-fit overflow-hidden">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h3 className="text-lg font-bold text-indigo-600">Filters</h3>
        {hasActiveFilters && (
           <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer font-medium hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
        )}
      </div>

      {/* ── Name Search ─────────────────────────────── */}
      <div className="border-t border-gray-100 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Search by Name</p>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            value={name}
            onChange={(e) => onParamsChange({ name: e.target.value || null })}
            placeholder="Search doctor..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition"
          />
        </div>
      </div>

      {/* ── Specialty ────────────────────────────────── */}
      <div className="px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Specialty</p>
        <Select
          isMulti
          options={ALL_SPECIALTIES}
          value={ALL_SPECIALTIES.filter(s => selectedSpecialties.includes(s.value))}
          onChange={(selected) => {
            const values = selected.map(s => s.value);
            onParamsChange({ speciality: values.length > 0 ? values.join(',') : null });
          }}
          placeholder="All Specialties"
          styles={selectStyles}
          classNamePrefix="react-select"
        />
      </div>

      {/* ── Sort By ──────────────────────────────────── */}
      <div className="px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Sort By</p>
        <Select
          options={SORT_OPTIONS}
          value={SORT_OPTIONS.find(o => o.value === sortBy) ?? SORT_OPTIONS[0]}
          onChange={(selected) => onParamsChange({ sortBy: selected?.value || null })}
          styles={selectStyles}
          classNamePrefix="react-select"
        />
      </div>

      {/* ── Fee Range ────────────────────────────────── */}
      <div className="border-t border-gray-100 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Fee Range</p>
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
      <div className="px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Experience (Years)</p>
        <DualRangeSlider
          min={0} max={30}
          valueMin={experienceRange[0]} valueMax={experienceRange[1]}
          onChange={(lo, hi) => onParamsChange({
            minExperience: lo > 0 ? String(lo) : null,
            maxExperience: hi < 30 ? String(hi) : null,
          })}
          suffix=" yrs"
        />
      </div>

      {/* ── Rating ───────────────────────────────────── */}
      <div className="px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Rating</p>
        <StarRatingFilter
          value={selectedRating}
          onChange={(rating) => onParamsChange({
            minRating: rating > 0 ? String(rating) : null,
            maxRating: rating > 0 ? '5' : null,
          })}
        />
      </div>

      {/* ── Gender ───────────────────────────────────── */}
      <div className="border-t border-gray-100 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Gender</p>
        <div className="flex gap-2">
          {(['', 'MALE', 'FEMALE'] as const).map((g) => (
            <button
              key={g}
              onClick={() => onParamsChange({ gender: g || null })}
              className={`px-4 py-1.5 text-xs rounded-full border transition-all font-medium ${
                gender === g
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                  : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-500'
              }`}
            >
              {g === '' ? 'All' : g === 'MALE' ? 'Male' : 'Female'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Consultation Type ────────────────────────── */}
      <div className="px-5 py-4 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-3">Consultation Type</p>
        <div className="flex gap-2">
          {(['', 'online', 'clinic'] as const).map((c) => (
            <button
              key={c}
              onClick={() => onParamsChange({ consultationType: c || null })}
              className={`px-4 py-1.5 text-xs rounded-full border transition-all font-medium ${
                consultationType === c
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                  : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-500'
              }`}
            >
              {c === '' ? 'Both' : c === 'online' ? 'Online' : 'Clinic'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorFiltersPanel;