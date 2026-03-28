import { useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.tsx";
import type { DoctorFilters } from "../Types.ts";
import DoctorCard from "../components/DoctorCard.tsx";
import Pagination from "../components/Pagination.tsx";
import DoctorFiltersPanel from "../components/DoctorFiltersPanel.tsx";

// ─── Specialties: used only for homepage label → API value normalisation
const SPECIALTY_LABEL_MAP: Record<string, string> = {
  "general physician": "GeneralPhysician",
  gynecologist: "Gynecologist",
  dermatologist: "Dermatologist",
  pediatrician: "Pediatrician",
  neurologist: "Neurologist",
  gastroenterologist: "Gastroenterologist",
  psychologist: "Psychologist",
  cardiologist: "Cardiologist",
  "orthopedic surgeon": "OrthopedicSurgeon",
};

// ═════════════════════════════════════════════════════════════
// ─── Doctors Page ────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════
function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { doctors, doctorsPagination, loadDoctors } = useContext(AppContext);

  // ── Derive filter state from URL ──────────────────────────
  const selectedSpecialties =
    searchParams.get("speciality")?.split(",").filter(Boolean) ?? [];
  const minFee = Number(searchParams.get("minFee") ?? 0);
  const maxFee = Number(searchParams.get("maxFee") ?? 500);
  const feeRange: [number, number] = [minFee, maxFee];
  const minRating = Number(searchParams.get("minRating") ?? 1);
  const maxRating = Number(searchParams.get("maxRating") ?? 5);
  const ratingRange: [number, number] = [minRating, maxRating];
  const gender = (searchParams.get("gender") ?? "") as "MALE" | "FEMALE" | "";
  const sortBy = (searchParams.get("sortBy") ?? "") as
    | "newly"
    | "alphabetically"
    | "";
  const currentPage = Number(searchParams.get("page") ?? 1);

  // ── Helper: update URL search params ──────────────────────
  const updateParams = (
    updates: Record<string, string | null>,
    resetPage = true,
  ) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      if (resetPage) {
        next.delete("page");
      }
      return next;
    });
  };

  // ── UI state ──────────────────────────────────────────────
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ── Normalize specialty from homepage label → API value ───
  useEffect(() => {
    const raw = searchParams.get("speciality") || "";
    if (!raw) return;
    const mapped = SPECIALTY_LABEL_MAP[raw.toLowerCase()];
    if (mapped) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("speciality", mapped);
          return next;
        },
        { replace: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run only on mount

  // ── Build filters object ──────────────────────────────────
  const buildFilters = (): DoctorFilters => {
    const f: DoctorFilters = {};
    if (selectedSpecialties.length > 0) f.specialties = selectedSpecialties;
    if (feeRange[0] > 0) f.min_fee = feeRange[0];
    if (feeRange[1] < 500) f.max_fee = feeRange[1];
    if (ratingRange[0] > 1) f.min_rating = ratingRange[0];
    if (ratingRange[1] < 10) f.max_rating = ratingRange[1];
    if (gender) f.gender = gender;
    if (sortBy) f.sort_by = sortBy;
    return f;
  };

  // ── Fetch on page / filter change ─────────────────────────
  useEffect(() => {
    loadDoctors(currentPage, buildFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ── Pagination data ───────────────────────────────────────
  const totalPages = doctorsPagination?.totalPages ?? 1;
  const total = doctorsPagination?.total ?? doctors.length;

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
          <DoctorFiltersPanel
            selectedSpecialties={selectedSpecialties}
            feeRange={feeRange}
            ratingRange={ratingRange}
            gender={gender}
            sortBy={sortBy}
            onParamsChange={(updates) => updateParams(updates)}
            onClearAll={() => setSearchParams({})}
          />
        </div>

        {/* ─── Doctor Cards + Pagination ──────────────── */}
        <div className="w-full flex flex-col gap-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          {/* ─── Pagination Bar ────────────────────────── */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => updateParams({ page: String(page) }, false)}
          />
        </div>
      </div>
    </div>
  );
}

export default Doctors;
