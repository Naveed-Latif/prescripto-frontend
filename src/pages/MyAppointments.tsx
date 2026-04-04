import { useContext, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import type { Appointment } from "../Types";
import AppointmentsSkeleton from "../skelton/AppointmentsSkeleton";
import FeedbackModal from "../components/FeedbackModal";
import CancelConfirmModal from "../components/CancelConfirmModal";
import Pagination from "../components/Pagination";
import AppointmentsFilterPanel, { type DoctorAppointmentFilterValues } from "../components/Appointment/AppointmentsFilterPanel";
import { FiFilter } from "react-icons/fi";

function MyAppointments() {
  const { backendurl, token } = useContext(AppContext);
  const location = useLocation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackAppointmentId, setFeedbackAppointmentId] = useState<
    number | null
  >(null);
  const [cancelAppointmentId, setCancelAppointmentId] = useState<number | null>(
    null,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState<number>(1);
  const currentPage = Number(searchParams.get("page") ?? 1);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<DoctorAppointmentFilterValues>({
    statuses: [],
    fromDate: "",
    toDate: "",
  });

  //  --handle page change--
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
    window.scrollTo(0, 0);
  };

  // --submit feedback--
  const submitFeedback = async (rating: number, comment: string) => {
    if (!token || !feedbackAppointmentId) return;
    try {
      const response = await axios.post(
        `${backendurl}/reviews`,
        {
          appointmentId: feedbackAppointmentId,
          comment: comment,
          rating: rating,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.status === 200) {
        toast.success("Feedback submitted successfully");
        await fetchAppointments();
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch {
      toast.error("An error occurred while submitting feedback");
    }
  };
  // fetch appointments from backend
  const fetchAppointments = async () => {
    if (!token) {
      toast.warning("Please login to view your appointments");
      return;
    }

    try {
      const response = await axios.get(`${backendurl}/appointments`, {
        params: {
          page: currentPage,
          status: filters.statuses.join(","),
          fromDate: filters.fromDate || undefined,
          toDate: filters.toDate || undefined,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status == 200) {
        setAppointments([...response.data.appointments]);
        setTotalPages(response.data.pagination?.totalPages || 1);
        toast.success("Appointments fetched successfully");
      } else {
        toast.error("Failed to fetch appointments");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Error:", String(error));
      }
      toast.error("An error occurred while fetching appointments");
    } finally {
      setLoading(false);
    }
  };
  // cancel appointment
  const cancelAppointment = async (id: number, note: string) => {
    if (!token) {
      toast.warning("Please login to cancel an appointment");
      return;
    }

    try {
      const response = await axios.post(
        `${backendurl}/appointments/${id}`,
        {
          action: "cancel",
          note: note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status == 200) {
        toast.success("Appointment cancelled successfully");
        fetchAppointments();
      } else {
        toast.error("Failed to cancel appointment");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Error:", String(error));
      }
      toast.error("An error occurred while cancelling appointment");
    }
  };
  const activeFilterCount = [
    filters.statuses.length > 0 ? "status" : "",
    filters.fromDate,
    filters.toDate,
  ].filter(Boolean).length;
  
  const handleApplyFilters = (values: DoctorAppointmentFilterValues) => {
    setFilters(values);
    handlePageChange(1);
  };

  const handleResetFilters = () => {
    setFilters({
      statuses: [],
      fromDate: "",
      toDate: "",
    });
    handlePageChange(1);
  };
  useEffect(() => {
    const fetchAppoinmtent = async () => {
      await fetchAppointments();
    };
    fetchAppoinmtent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, currentPage, filters]);
  // console.log(appointments[0].doctor.profile.addresses)
  if (loading) {
    return <AppointmentsSkeleton />;
  }
  return (
    <div>
      <div className="flex items-center justify-between border-b border-b-gray-400">
        <p className="pb-3 mt-10 text-lg text-gray-600 ">My Appointments</p>
        <button
          onClick={() => setFilterPanelOpen(true)}
          className="relative cursor-pointer flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-600"
        >
          <FiFilter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
      {appointments.map((appointment, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_2fr] gap-4 sm:gap- sm:flex justify-between items-center py-3 border-b border-b-gray-300"
        >
          <div>
            <img
              className="w-36 bg-[#EAEFFF]"
              src={
                appointment.doctor.profile.profileImage ??
                "/src/assets/dummy_doc.png"
              }
              alt="Doc Img"
            />
          </div>
          <div className="flex-1 text-sm text-[#5E5E5E]">
            <p className="text-base text-[#262626] font-semibold flex items-center gap-2">
              {appointment.doctor.profile.name}
              {appointment.isCompleted ? (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                  Completed
                </span>
              ) : appointment.isCancel ? (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200">
                  Cancelled
                </span>
              ) : new Date(appointment.appointmentDate) < new Date() ? (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                  Expired
                </span>
              ) : (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200">
                  Pending
                </span>
              )}
            </p>
            <p>{appointment.doctor.specialty}</p>
            <p className="text-[#262626] font-medium mt-1">Address:</p>
            <p>{appointment.doctor.profile.addresses?.[0].line1 ?? "N/A"}</p>
            <p>{appointment.doctor.profile.addresses?.[0].line2 ?? "N/A"}</p>
            <p>
              <span className="text-[#262626]">Date & Time:</span>
              {new Date(appointment.appointmentDate).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div></div>
          <div className="flex flex-col justify-end gap-2">
            {appointment.isCompleted ? (
              appointment.reviews && appointment.reviews?.length > 0 ? (
                // ✅ Completed + feedback already given → show review panel
                <div className="flex-1 border-l border-gray-200 pl-6 ml-2 min-w-[220px]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-700">
                      Your Feedback
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(
                        appointment.reviews![0].createdAt!,
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${star <= appointment.reviews![0].rating ? "text-yellow-400" : "text-gray-200"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    {appointment.reviews![0].comment}
                  </p>
                </div>
              ) : (
                // ✅ Completed but no feedback yet → show Give Feedback button
                <div className="flex flex-col justify-end gap-2">
                  <button
                    onClick={() => setFeedbackAppointmentId(appointment.id)}
                    className="text-sm text-white bg-green-500 rounded-lg p-2 sm:min-w-46 cursor-pointer hover:bg-green-600 transition-all duration-300"
                  >
                    Give Feedback
                  </button>
                </div>
              )
            ) : appointment.isCancel ? null : new Date(appointment.appointmentDate) < new Date() ? null : (
              // ✅ Upcoming → show Pay Online + Cancel
              <div className="flex flex-col justify-end gap-2">
                {appointment.isPaid ? (
                  <button className="text-sm text-green-600 border border-green-600 p-2 sm:min-w-46 cursor-pointer hover:bg-green-600 hover:text-white transition-all duration-300">
                    Paid
                  </button>
                ) : (
                  <button className="text-sm text-[#5e5e5e] border border-gray-500 p-2 sm:min-w-46 cursor-pointer hover:bg-primary hover:text-white transition-all duration-300">
                    Pay Online
                  </button>
                )}
                <button
                  onClick={() => setCancelAppointmentId(appointment.id)}
                  className="text-sm text-[#5e5e5e] border border-gray-500 p-2 sm:min-w-46 cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <FeedbackModal
        isOpen={feedbackAppointmentId !== null}
        onClose={() => setFeedbackAppointmentId(null)}
        onSubmit={submitFeedback}
      />
      <CancelConfirmModal
        isOpen={cancelAppointmentId !== null}
        onClose={() => setCancelAppointmentId(null)}
        onConfirm={(note) => cancelAppointment(cancelAppointmentId!, note)}
      />
      <AppointmentsFilterPanel
        isOpen={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        values={filters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
}

export default MyAppointments;
