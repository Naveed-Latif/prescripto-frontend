import { useState, useRef, useEffect, useCallback } from "react";
import StarRatingFilter from "./StarRatingFilter";

// ─── Specialties: label for UI, value for API ────────────────
const ALL_SPECIALTIES = [
  { label: "General Physician", value: "GeneralPhysician" },
  { label: "Gynecologist", value: "Gynecologist" },
  { label: "Dermatologist", value: "Dermatologist" },
  { label: "Pediatrician", value: "Pediatrician" },
  { label: "Neurologist", value: "Neurologist" },
  { label: "Gastroenterologist", value: "Gastroenterologist" },
  { label: "Psychologist", value: "Psychologist" },
  { label: "Cardiologist", value: "Cardiologist" },
  { label: "Orthopedic Surgeon", value: "OrthopedicSurgeon" },
];

// ─── Dual Range Slider ───────────────────────────────────────
function DualRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  prefix = "",
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (lo: number, hi: number) => void;
  prefix?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const handlePointer = useCallback(
    (which: "min" | "max") => (e: React.PointerEvent) => {
      e.preventDefault();
      const track = trackRef.current;
      if (!track) return;

      const move = (ev: PointerEvent) => {
        const rect = track.getBoundingClientRect();
        const ratio = Math.min(
          1,
          Math.max(0, (ev.clientX - rect.left) / rect.width),
        );
        const raw = Math.round(min + ratio * (max - min));
        if (which === "min") {
          onChange(Math.min(raw, valueMax), valueMax);
        } else {
          onChange(valueMin, Math.max(raw, valueMin));
        }
      };

      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [min, max, valueMin, valueMax, onChange],
  );

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-indigo-500 mb-1.5 font-medium">
        <span>
          {prefix}
          {valueMin}
        </span>
        <span>
          {prefix}
          {valueMax}
        </span>
      </div>
      <div
        ref={trackRef}
        className="relative h-1.5 bg-gray-200 rounded-full select-none touch-none"
      >
        {/* Filled range */}
        <div
          className="absolute h-full bg-indigo-500 rounded-full"
          style={{
            left: `${pct(valueMin)}%`,
            width: `${pct(valueMax) - pct(valueMin)}%`,
          }}
        />
        {/* Min thumb */}
        <div
          onPointerDown={handlePointer("min")}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-grab active:cursor-grabbing shadow-sm"
          style={{ left: `${pct(valueMin)}%`, marginLeft: "-8px" }}
        />
        {/* Max thumb */}
        <div
          onPointerDown={handlePointer("max")}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-grab active:cursor-grabbing shadow-sm"
          style={{ left: `${pct(valueMax)}%`, marginLeft: "-8px" }}
        />
      </div>
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────
export interface DoctorFiltersPanelProps {
  selectedSpecialties: string[];
  feeRange: [number, number];
  ratingRange: [number, number];
  gender: "MALE" | "FEMALE" | "";
  sortBy: "newly" | "alphabetically" | "";
  onParamsChange: (updates: Record<string, string | null>) => void;
  onClearAll: () => void;
}

// ─── Filter Panel Component ─────────────────────────────────
function DoctorFiltersPanel({
  selectedSpecialties,
  feeRange,
  ratingRange,
  gender,
  sortBy,
  onParamsChange,
  onClearAll,
}: DoctorFiltersPanelProps) {
  const [specDropdownOpen, setSpecDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedRating = ratingRange[0] > 1 ? ratingRange[0] : 0;

  // Close specialty dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setSpecDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Toggle specialty ──────────────────────────────────────
  const toggleSpecialty = (s: string) => {
    const updated = selectedSpecialties.includes(s)
      ? selectedSpecialties.filter((x) => x !== s)
      : [...selectedSpecialties, s];
    onParamsChange({
      speciality: updated.length > 0 ? updated.join(",") : null,
    });
  };

  // ── Active state check ────────────────────────────────────
  const hasActiveFilters =
    selectedSpecialties.length > 0 ||
    feeRange[0] > 0 ||
    feeRange[1] < 500 ||
    ratingRange[0] > 1 ||
    ratingRange[1] < 10 ||
    gender !== "" ||
    sortBy !== "";

  // ── Tag helpers ───────────────────────────────────────────
  const activeTags: { label: string; onRemove: () => void }[] = [];
  selectedSpecialties.forEach((val) => {
    const spec = ALL_SPECIALTIES.find((s) => s.value === val);
    activeTags.push({
      label: spec?.label ?? val,
      onRemove: () => {
        const updated = selectedSpecialties.filter((x) => x !== val);
        onParamsChange({
          speciality: updated.length > 0 ? updated.join(",") : null,
        });
      },
    });
  });
  if (gender)
    activeTags.push({
      label: gender === "MALE" ? "Male" : "Female",
      onRemove: () => onParamsChange({ gender: null }),
    });
  if (sortBy)
    activeTags.push({
      label: sortBy === "newly" ? "Newest" : "A–Z",
      onRemove: () => onParamsChange({ sortBy: null }),
    });

  return (
    <div className="w-full sm:w-64 shrink-0 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit">
      <h3 className="text-lg font-medium text-gray-700 mb-5">Filters</h3>

      {/* ── Specialty Dropdown ───────────────────────── */}
      <div className="mb-5" ref={dropdownRef}>
        <p className="text-sm font-medium text-gray-700 mb-2">Specialty</p>
        <button
          onClick={() => setSpecDropdownOpen((p) => !p)}
          className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 hover:border-indigo-300 transition"
        >
          <span>
            {selectedSpecialties.length === 0
              ? "All specialties"
              : `${selectedSpecialties.length} specialty selected`}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${specDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {specDropdownOpen && (
          <div className="mt-1 border border-gray-200 rounded-lg bg-white shadow-lg max-h-52 overflow-y-auto z-20 relative">
            {ALL_SPECIALTIES.map((spec) => (
              <label
                key={spec.value}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(spec.value)}
                  onChange={() => toggleSpecialty(spec.value)}
                  className="accent-indigo-500 w-4 h-4"
                />
                {spec.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ── Fee Range Slider ─────────────────────────── */}
      <div className="mb-5">
        <p className="text-sm font-medium text-gray-700 mb-2">Fee Range</p>
        <DualRangeSlider
          min={0}
          max={500}
          valueMin={feeRange[0]}
          valueMax={feeRange[1]}
          onChange={(lo, hi) => {
            onParamsChange({
              minFee: lo > 0 ? String(lo) : null,
              maxFee: hi < 500 ? String(hi) : null,
            });
          }}
          prefix="$"
        />
      </div>

      {/* ── Rating Range Slider ──────────────────────── */}
      <div className="mb-5">
        <p className="text-sm font-medium text-gray-700 mb-2">Rating</p>
        {/* <DualRangeSlider
          min={1}
          max={10}
          valueMin={ratingRange[0]}
          valueMax={ratingRange[1]}
          onChange={(lo, hi) => {
            onParamsChange({
              minRating: lo > 1 ? String(lo) : null,
              maxRating: hi < 10 ? String(hi) : null,
            });
          }}
        /> */}
        <StarRatingFilter
          value={selectedRating}
          onChange={(rating) => {
            onParamsChange({
              minRating: rating > 0 ? String(rating) : null,
              maxRating: rating > 0 ? "5" : null,
            });
          }}
        />
      </div>

      {/* ── Gender ──────────────────────────────────── */}
      <div className="mb-5">
        <p className="text-sm font-medium text-gray-700 mb-2">Gender</p>
        <div className="flex gap-2">
          {(["", "MALE", "FEMALE"] as const).map((g) => (
            <button
              key={g}
              onClick={() => onParamsChange({ gender: g || null })}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition font-medium ${
                gender === g
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "border-gray-300 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              {g === "" ? "All" : g === "MALE" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sort By ──────────────────────────────────── */}
      <div className="mb-5">
        <p className="text-sm font-medium text-gray-700 mb-2">Sort By</p>
        <select
          value={sortBy}
          onChange={(e) => onParamsChange({ sortBy: e.target.value || null })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-400 transition"
        >
          <option value="">Default</option>
          <option value="newly">Newest</option>
          <option value="alphabetically">A – Z</option>
        </select>
      </div>

      {/* ── Active Filter Tags ──────────────────────── */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeTags.map((tag) => (
            <span
              key={tag.label}
              className="inline-flex items-center gap-1 pl-3 pr-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {tag.label}
              <button
                onClick={tag.onRemove}
                className="ml-0.5 hover:text-red-500 transition text-gray-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

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
