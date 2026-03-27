import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import type { Doctor } from "../Types.ts";
import RelatedDoctors from "../components/RelatedDoctors.tsx";
import axios from "axios";
import { toast } from "react-toastify";
// import BookingSlots from '../components/BookingSlots.tsx'
type Slot = { datetime: Date; time: string };

const formatAppointmentDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

function Appointment() {
  const [docInfo, setDocInfo] = useState<Doctor>();
  const { doctors, currencySymbol, backendurl, token } = useContext(AppContext);
  const { id } = useParams();
  const [docSlots, SetDocSlots] = useState<Slot[][]>([]);
  const [slotIndex, SetSlotIndex] = useState<number>(0);
  const [slotTime, SetSlotTime] = useState<string>("");
  const daysOfTheWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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
      } else {
        toast.error("Failed to book appointment");
      }
    } catch (error) {
      toast.error("An error occurred while booking");
    }
  };

  useEffect(() => {
    if (!doctors || !id) return;
    const findDoctor = (id?: string) => {
      const doctor: Doctor | undefined = doctors.find(
        (doc) => doc.id === Number(id),
      );
      setDocInfo(doctor);
    };
    findDoctor(id);
  }, [id, doctors]);

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

  return (
    docInfo && (
      <div>
        <div className="flex flex-col md:flex-row gap-4">
          <img
            className="bg-primary w-full md:max-w-72 rounded-lg"
            src={docInfo.profile.profileImage ?? "/src/assets/dummy_doc.png"}
            alt=""
          />
          <div className="flex-1 flex-col gap-4 p-7 py-8 text-sm bg-white rounded-lg border border-gray-300">
            <div className="flex items-center gap-2">
              <p className="text-gray-700 text-3xl font-medium">
                {docInfo.profile.name}
              </p>
              <img className="w-5" src="/src/assets/verified_icon.svg" alt="" />
            </div>
            <div className="flex gap-2 my-2 text-gray-600 ">
              <p>
                {docInfo.degree}-{docInfo.specialty}
              </p>
              <button className="border border-gray-400 py-0.5 px-2 text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <div className="">
              <p className="flex gap-2 text-sm font-medium">
                About{" "}
                <img className="w-3" src="/src/assets/info_icon.svg" alt="" />
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
        </div>
        {/* <BookingSlots/> */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
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
              docSlots[slotIndex].map((item, index) => (
                <p
                  key={index}
                  onClick={() => SetSlotTime(item.time)}
                  className={`text-sm font-light shrink-0 py-2 px-2 cursor-pointer rounded-full ${item.time === slotTime ? "bg-primary text-white" : "text-[#949494] border border-gray-500"}`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
          >
            Book Appointment
          </button>
        </div>
        <RelatedDoctors docId={id} speciality={docInfo.specialty} />
      </div>
    )
  );
}

export default Appointment;
