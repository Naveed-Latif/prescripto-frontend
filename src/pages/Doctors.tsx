import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { AppContext } from "../context/AppContext.tsx";
import type { DoctorFilters } from "../Types.ts";

// ─── Specialties: label for UI, value for API ────────────────
const ALL_SPECIALTIES = [
  { label: "General Physician", value: "GeneralPhysician" },
  { label: "Gynecologist", value: "Gynecologist" },
  { label: "Dermatologist", value: "Dermatologist" },
  { label: "Pediatricians", value: "Pediatricians" },
  { label: "Neurologist", value: "Neurologist" },
  { label: "Gastroenterologist", value: "Gastroenterologist" },
  { label: "Psychologist", value: "Psychologist" },
  { label: "Cardiologist", value: "Cardiologist" },
  { label: "Orthopedic Surgeon", value: "OrthopedicSurgeon" },
];

// ─── Pagination helper ───────────────────────────────────────
function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  const add = (p: number) => {
    if (!pages.includes(p)) pages.push(p);
  };
  add(1);
  if (current - 2 > 2) pages.push("...");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  )
    add(p);
  if (current + 2 < total - 1) pages.push("...");
  add(total);
  return pages;
}

// ─── Dual Range Slider Component ─────────────────────────────
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

// ═════════════════════════════════════════════════════════════
// ─── Doctors Page ────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════
function Doctors() {
  const navigate = useNavigate();
  const { doctors, doctorsPagination, loadDoctors } = useContext(AppContext);

  // ── Filter state ──────────────────────────────────────────
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [feeRange, setFeeRange] = useState<[number, number]>([0, 500]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([1, 10]);
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [sortBy, setSortBy] = useState<"newly" | "alphabetically" | "">("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── UI state ──────────────────────────────────────────────
  const [specDropdownOpen, setSpecDropdownOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // ── Build filters object ──────────────────────────────────
  const buildFilters = useCallback((): DoctorFilters => {
    const f: DoctorFilters = {};
    if (selectedSpecialties.length > 0) f.specialties = selectedSpecialties;
    if (feeRange[0] > 0) f.min_fee = feeRange[0];
    if (feeRange[1] < 500) f.max_fee = feeRange[1];
    if (ratingRange[0] > 1) f.min_rating = ratingRange[0];
    if (ratingRange[1] < 10) f.max_rating = ratingRange[1];
    if (gender) f.gender = gender;
    if (sortBy) f.sort_by = sortBy;
    return f;
  }, [selectedSpecialties, feeRange, ratingRange, gender, sortBy]);

  // ── Fetch on page / filter change ─────────────────────────
  useEffect(() => {
    loadDoctors(currentPage, buildFilters());
  }, [currentPage, selectedSpecialties, feeRange, ratingRange, gender, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpecialties, feeRange, ratingRange, gender, sortBy]);

  // ── Toggle specialty ──────────────────────────────────────
  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  // ── Clear all filters ─────────────────────────────────────
  const clearAllFilters = () => {
    setSelectedSpecialties([]);
    setFeeRange([0, 500]);
    setRatingRange([1, 10]);
    setGender("");
    setSortBy("");
  };

  const hasActiveFilters =
    selectedSpecialties.length > 0 ||
    feeRange[0] > 0 ||
    feeRange[1] < 500 ||
    ratingRange[0] > 1 ||
    ratingRange[1] < 10 ||
    gender !== "" ||
    sortBy !== "";

  // ── Pagination data ───────────────────────────────────────
  const totalPages = doctorsPagination?.totalPages ?? 1;
  const total = doctorsPagination?.total ?? doctors.length;
  const pageRange = buildPageRange(currentPage, totalPages);

  // ── Tag helpers ───────────────────────────────────────────
  const activeTags: { label: string; onRemove: () => void }[] = [];
  selectedSpecialties.forEach((val) => {
    const spec = ALL_SPECIALTIES.find((s) => s.value === val);
    activeTags.push({
      label: spec?.label ?? val,
      onRemove: () =>
        setSelectedSpecialties((prev) => prev.filter((x) => x !== val)),
    });
  });
  if (gender)
    activeTags.push({
      label: gender === "MALE" ? "Male" : "Female",
      onRemove: () => setGender(""),
    });
  if (sortBy)
    activeTags.push({
      label: sortBy === "newly" ? "Newest" : "A–Z",
      onRemove: () => setSortBy(""),
    });

  // ═════════════════════════════════════════════════════════
  // ─── Filter Panel JSX ──────────────────────────────────
  // ═════════════════════════════════════════════════════════
  const filterPanel = (
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
          onChange={(lo, hi) => setFeeRange([lo, hi])}
          prefix="$"
        />
      </div>

      {/* ── Rating Range Slider ──────────────────────── */}
      <div className="mb-5">
        <p className="text-sm font-medium text-gray-700 mb-2">Rating</p>
        <DualRangeSlider
          min={1}
          max={10}
          valueMin={ratingRange[0]}
          valueMax={ratingRange[1]}
          onChange={(lo, hi) => setRatingRange([lo, hi])}
        />
      </div>

      {/* ── Gender ──────────────────────────────────── */}
      <div className="mb-5">
        <p className="text-sm font-medium text-gray-700 mb-2">Gender</p>
        <div className="flex gap-2">
          {(["", "MALE", "FEMALE"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g as typeof gender)}
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
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
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
          onClick={clearAllFilters}
          className="w-full py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  // ═════════════════════════════════════════════════════════
  // ─── Render ────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-gray-600">Browse through the doctors specialist.</p>
        <p className="text-sm text-gray-400">{total} total doctors</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 mt-5">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowMobileFilters((p) => !p)}
          className={`py-2 px-4 rounded-lg border border-gray-300 text-sm font-medium transition-all sm:hidden ${
            showMobileFilters
              ? "bg-indigo-500 text-white border-indigo-500"
              : "text-gray-600"
          }`}
        >
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Filter panel — desktop always visible, mobile toggled */}
        <div className={`${showMobileFilters ? "block" : "hidden"} sm:block`}>
          {filterPanel}
        </div>

        {/* ─── Doctor Cards + Pagination ──────────────── */}
        <div className="w-full flex flex-col gap-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6">
            {doctors.map((doctor) => (
              <div
                onClick={() => navigate(`/appointment/${doctor.id}`)}
                key={doctor.id}
                className="border-[#C9D8FF] border rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-300"
              >
                <img
                  className="bg-blue-50"
                  src={
                    doctor.profile.profileImage ?? "/src/assets/dummy_doc.png"
                  }
                  alt={doctor.profile.name}
                />
                <div className="p-4">
                  <div className="flex gap-2 items-center text-green-500 text-center text-sm">
                    <p className="w-2 h-2 rounded-full bg-green-500"></p>
                    <p>Available</p>
                  </div>
                  <p className="text-gray-900 font-medium text-lg">
                    {doctor.profile.name}
                  </p>
                  <p className="text-xs text-gray-600">{doctor.specialty}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Pagination Bar ────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-md text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ‹
                </button>

                {pageRange.map((item, i) =>
                  item === "..." ? (
                    <span
                      key={`e-${i}`}
                      className="px-2 text-gray-400 text-sm select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className={`px-3 py-1.5 rounded-md text-sm border transition ${
                        currentPage === item
                          ? "bg-indigo-500 text-white border-indigo-500"
                          : "border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-md text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ›
                </button>
              </div>

              <div className="w-24 hidden sm:block" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
