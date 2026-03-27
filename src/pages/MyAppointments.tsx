import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import type { Appointment } from "../Types";

function MyAppointments() {
  const { backendurl, token } = useContext(AppContext);
  const location = useLocation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // fetch appointments from backend
  const fetchAppointments = async () => {
    if (!token) {
      toast.warning("Please login to view your appointments");
      return;
    }

    try {
      const response = await axios.get(`${backendurl}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status == 200) {
        setAppointments([...response.data.appointments]);
        toast.success("Appointments fetched successfully");
      } else {
        toast.error("Failed to fetch appointments");
      }
    } catch (error) {
      if(error instanceof Error){
        console.error("Error:", error.message);
      }else{
        console.error("Error:", String(error));
      }
      toast.error("An error occurred while fetching appointments");
    }
  };
// cancel appointment
  const cancelAppointment = async (id: number) => {
    if (!token) {
      toast.warning("Please login to cancel an appointment");
      return;
    }

    try {
      const response = await axios.post(`${backendurl}/appointments/${id}`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status == 200) {
        toast.success("Appointment cancelled successfully");
        fetchAppointments();
      } else {
        toast.error("Failed to cancel appointment");
      }
    } catch (error) {
      if(error instanceof Error){
        console.error("Error:", error.message);
      }else{
        console.error("Error:", String(error));
      }
      toast.error("An error occurred while cancelling appointment");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [location]);

  return (
    <div>
      <p className="pb-3 mt-10 text-lg text-gray-600 border-b border-b-gray-400">
        My Appointments
      </p>
      {appointments.map((appointment, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_2fr] gap-4 sm:gap- sm:flex justify-between items-center py-3 border-b border-b-gray-300"
        >
          {/* grid grid-col-[1fr,2fr] gap-4 sm:gap- sm:flex justify-between items-center py-3 border-b border-b-gray-300*/}
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
            <p className="text-base text-[#262626] font-semibold">
              {appointment.doctor.profile.name}
            </p>
            <p>{appointment.doctor.specialty}</p>
            <p className="text-[#262626] font-medium mt-1">Address:</p>
            <p>{appointment.doctor.profile.addresses?.[0]?.line1 ?? "N/A"}</p>
            <p>{appointment.doctor.profile.addresses?.[0]?.line2 ?? "N/A"}</p>
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
            {appointment.isCancel ? (
              <button className="text-sm text-red-600 border border-red-600 p-2 sm:min-w-46 cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-300">
                Cancelled
              </button>
            ) : (
              <>
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
                  onClick={() => cancelAppointment(appointment.id)}
                  className="text-sm text-[#5e5e5e] border border-gray-500 p-2 sm:min-w-46 cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyAppointments;
