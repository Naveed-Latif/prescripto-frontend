import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import type { Doctor, WeeklyBooking } from "../types/Types.ts";
import RelatedDoctors from "../components/Appointment/RelatedDoctors.tsx";
import axios from "axios";
import { toast } from "react-toastify";
import Reviews from "../components/Appointment/Reviews.tsx";
import AppointmentDetailSkeleton from "../skelton/AppointmentDetailSkeleton.tsx";
import { formatAppointmentDate } from "../utils/Formaters.tsx";
// imgs
import verifiedIcon from "../assets/verified_icon.svg";
import dummyDoc from "../assets/dummy_doc.png";
import infoIcon from "../assets/info_icon.svg";

type Slot = { datetime: Date; time: string };

function Appointment() {
  const [docInfo, setDocInfo] = useState<Doctor>();
  const [relDocs, setRelDocs] = useState<Doctor[]>([]);
  const [bookingData, setBookingData] = useState<WeeklyBooking[]>([]);
  const { currencySymbol, backendurl, token } = useContext(AppContext);
  const { id } = useParams();
  const [docSlots, SetDocSlots] = useState<Slot[][]>([]);
  const [slotIndex, SetSlotIndex] = useState<number>(0);
  const [slotTime, SetSlotTime] = useState<string>("");
  const [docLoading, setDocLoading] = useState<boolean>(true);
  const daysOfTheWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();

  // load Doctor Profile

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        const response = await axios.get(`${backendurl}/doctors/${id}`);
        if (response.data.status == 200) {
          setDocInfo(response.data.doctor);
          setRelDocs(response.data.related_doctors || []);
          setBookingData(response.data.weeklyBookings || []);
        } else {
          toast.error("Failed to load doctor profile");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.error;
          toast.error(message || "Failed to load doctor profile");
        }
      } finally {
        setDocLoading(false);
      }
    };
    loadDoctorProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // book Appointment
  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Please login to book an appointment");
      return;
    }

    if (!slotTime) {
      toast.warning("Please select a time slot");
      return;
    }

    try {
      // Find the full Slot object so we can use its Date object
      const selectedSlot = docSlots[slotIndex].find(
        (slot) => slot.time === slotTime,
      );

      if (!selectedSlot) return;

      const appointmentDate = formatAppointmentDate(selectedSlot.datetime);

      const response = await axios.post(
        `${backendurl}/appointments`,
        {
          doctorId: Number(id),
          appointmentDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status == 200) {
        toast.success("Appointment booked successfully");
        navigate("/myappointments");
      } else {
        toast.error("Failed to book appointment");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error;
        toast.error(message || "Failed to book appointment");
      }
    }
  };

  useEffect(() => {
    const getAvailableSlots = async () => {
      SetDocSlots([]);

      const today = new Date();
      //getting current date with index
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        //getting end time of the date index
        const endTime = new Date(currentDate);
        endTime.setHours(21, 0, 0, 0);

        //seting hours
        if (today.getDate() === currentDate.getDate()) {
          currentDate.setHours(
            currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10,
          );
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currentDate.setHours(10);
          currentDate.setMinutes(0);
        }
        const timeSlots: Slot[] = [];
        while (currentDate < endTime) {
          const formattedTime = currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });

          //increment current time by 30 minutes
          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        SetDocSlots((prev) => [...prev, timeSlots]);
      }
    };
    getAvailableSlots();
  }, []);
  const bookedTimes = bookingData
    .filter((b) => !b.isCancel) // ignore cancelled bookings
    .map((b) => new Date(b.appointmentDate).toISOString());

  const isSlotBooked = (slotDatetime: Date): boolean => {
    return bookedTimes.some((booked) => {
      const bookedDate = new Date(booked);
      return (
        bookedDate.getFullYear() === slotDatetime.getFullYear() &&
        bookedDate.getMonth() === slotDatetime.getMonth() &&
        bookedDate.getDate() === slotDatetime.getDate() &&
        bookedDate.getHours() === slotDatetime.getHours() &&
        bookedDate.getMinutes() === slotDatetime.getMinutes()
      );
    });
  };
  if (docLoading) {
    return <AppointmentDetailSkeleton />;
  }

  return (
    docInfo && (
      <div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex-col gap-4 p-7 py-8 text-sm bg-white rounded-lg border border-gray-300">
            <div className="flex items-center gap-2">
              <img
                className="bg-primary w-14 h-14 rounded-full"
                src={
                  docInfo.profile.profileImage ?? dummyDoc
                }
                alt=""
              />
              <p className="text-gray-700 text-3xl font-medium">
                {docInfo.profile.name}
              </p>
              <img className="w-5" src={verifiedIcon} alt="" />
            </div>
            <div className="flex gap-2 my-2 text-gray-600 ">
              <p>
                {docInfo.degree}-{docInfo.specialty}
              </p>
              <button className="border border-gray-400 py-0.5 px-2 text-xs rounded-full">
                {docInfo.experience} years
              </button>
              <button className="border border-gray-400 py-0.5 px-2 text-xs rounded-full">
                {docInfo.ratingAverage ?? 0} ⭐
              </button>
            </div>

            <div className="">
              <p className="flex gap-2 text-sm font-medium">
                About{" "}
                <img className="w-3" src={infoIcon} alt="" />
              </p>
              <p className="text-gray-600 text-sm max-w-175 mt-2">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-600 mt-4">
              Appointment fee:
              <span className="font-medium text-gray-900">
                {currencySymbol}
                {docInfo.fee}
              </span>
            </p>
          </div>
          <div className="flex-1 flex-col md:max-w-100 text-sm bg-white rounded-lg">
            {id && <Reviews id={id} />}
          </div>
        </div>
        {/* <BookingSlots/> */}
        <div className="sm:ml-2 sm:pl-4 mt-4 font-medium w-[579px] text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-2 items-center overflow-x-scroll w-full mt-4 ">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => SetSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-primary text-white" : "text-gray-600 border border-gray-300"}`}
                  key={index}
                >
                  <p>{item[0] && daysOfTheWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex gap-3 items-center overflow-x-scroll w-full mt-4 ">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => {
                const booked = isSlotBooked(item.datetime);
                return (
                  <p
                    key={index}
                    onClick={() => !booked && SetSlotTime(item.time)}
                    className={`text-sm font-light shrink-0 py-2 px-2 rounded-full ${
                      booked
                        ? "bg-red-50 text-red-300 border border-red-200 cursor-not-allowed"
                        : item.time === slotTime
                          ? "bg-primary text-white cursor-pointer"
                          : "text-[#949494] border border-gray-500 cursor-pointer"
                    }`}
                  >
                    {booked ? "Booked" : item.time.toLowerCase()}
                  </p>
                );
              })}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-20 py-3 cursor-pointer rounded-full my-6"
          >
            Book Appointment
          </button>
        </div>
        <RelatedDoctors Docinfo={relDocs} />
      </div>
    )
  );
}

export default Appointment;
