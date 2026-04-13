import { useMemo, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DoctorList } from "../../types/MyAppointmenttypes";
import MultiSelectWithAvatar, { type AvatarOption } from "./MultiSelectWithAvatar.tsx";

const STATUS_OPTIONS = [
  { label: "Cancelled", value: "canceled" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Rated", value: "rated" },
  { label: "Unrated", value: "unrated" },
];

const selectStyles = {
  control: (base: object, state: { isFocused: boolean }) => ({
    ...base,
    borderColor: state.isFocused ? "#5F6FFF" : "#e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    minHeight: "40px",
    boxShadow: "none",
    "&:hover": { borderColor: "#5F6FFF" },
  }),
  option: (
    base: object,
    state: { isSelected: boolean; isFocused: boolean },
  ) => ({
    ...base,
    fontSize: "0.875rem",
    backgroundColor: state.isSelected
      ? "#5F6FFF"
      : state.isFocused
        ? "#eef2ff"
        : "white",
    color: state.isSelected ? "white" : "#374151",
  }),
  multiValue: (base: object) => ({
    ...base,
    backgroundColor: "#eef2ff",
    borderRadius: "9999px",
  }),
  multiValueLabel: (base: object) => ({
    ...base,
    color: "#4f46e5",
    fontSize: "0.75rem",
  }),
  multiValueRemove: (base: object) => ({
    ...base,
    color: "#6366f1",
    borderRadius: "9999px",
    "&:hover": { backgroundColor: "#6366f1", color: "white" },
  }),
  placeholder: (base: object) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "0.875rem",
  }),
};

export interface DoctorAppointmentFilterValues {
  statuses: string[];
  doctorIds: number[];
  fromDate: string;
  toDate: string;
}

const DEFAULT_FILTERS: DoctorAppointmentFilterValues = {
  statuses: [],
  doctorIds: [],
  fromDate: "",
  toDate: "",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doctorsList: DoctorList[];
  values: DoctorAppointmentFilterValues;
  onApply: (values: DoctorAppointmentFilterValues) => void;
  onReset: () => void;
}

const AppointmentsFilterPanel = ({
  isOpen,
  onClose,
  doctorsList,
  values,
  onApply,
  onReset,
}: Props) => {
  const [draft, setDraft] = useState<DoctorAppointmentFilterValues>(values);

  const doctorOptions: AvatarOption[] = useMemo(
    () =>
      doctorsList.map((d) => ({
        value: d.id,
        label: d.name,
        color: d.profileColor,
        image: d.profileImage,
      })),
    [doctorsList],
  );

 

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft(DEFAULT_FILTERS);
    onReset();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-120 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Apply Filters</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
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
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <Select
              isMulti
              options={STATUS_OPTIONS}
              value={STATUS_OPTIONS.filter((o) =>
                draft.statuses.includes(o.value),
              )}
              onChange={(selected) =>
                setDraft((prev) => ({
                  ...prev,
                  statuses: selected.map((s) => s.value),
                }))
              }
              placeholder="Select statuses..."
              styles={selectStyles}
            />
          </div>
          {/* Doctor List */}
          <div>
            <MultiSelectWithAvatar
              label="Doctors"
              options={doctorOptions}
              selectedIds={draft.doctorIds}
              onChange={(ids) =>
                setDraft((prev) => ({ ...prev, doctorIds: ids }))
              }
              placeholder="All Doctors"
              styles={selectStyles}
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date Range
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <DatePicker
                  selected={draft.fromDate ? new Date(draft.fromDate) : null}
                  onChange={(date: Date | null) =>
                    setDraft((prev) => ({
                      ...prev,
                      fromDate: date ? date.toISOString().split("T")[0] : "",
                    }))
                  }
                  placeholderText="From"
                  dateFormat="MMM d, yyyy"
                  className="w-full border border-gray-200 rounded-lg pl-8 pr-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  popperProps={{ strategy: "fixed" }}
                />
              </div>
              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <DatePicker
                  selected={draft.toDate ? new Date(draft.toDate) : null}
                  onChange={(date: Date | null) =>
                    setDraft((prev) => ({
                      ...prev,
                      toDate: date ? date.toISOString().split("T")[0] : "",
                    }))
                  }
                  placeholderText="To"
                  dateFormat="MMM d, yyyy"
                  minDate={
                    draft.fromDate ? new Date(draft.fromDate) : undefined
                  }
                  className="w-full border border-gray-200 rounded-lg pl-8 pr-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  popperProps={{ strategy: "fixed" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 text-sm font-medium bg-primary text-white rounded-xl hover:opacity-90 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default AppointmentsFilterPanel;
