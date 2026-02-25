import { useContext } from "react";
import { AppContext } from "../context/AppContext";
function MyAppointments() {
  const { doctors } = useContext(AppContext);
  return (
    <div>
      <p className="pb-3 mt-10 text-lg text-gray-600 border-b border-b-gray-400">My Appointments</p>
      {doctors.slice(0, 2).map((doctor, index) => (
        <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:gap- sm:flex justify-between items-center py-3 border-b border-b-gray-300">
          {/* grid grid-col-[1fr,2fr] gap-4 sm:gap- sm:flex justify-between items-center py-3 border-b border-b-gray-300*/}
          <div>
            <img className="w-36 bg-[#EAEFFF]" src={doctor.image} alt="" />
          </div>
          <div className="flex-1 text-sm text-[#5E5E5E]">
            <p className="text-base text-[#262626] font-semibold">{doctor.name}</p>
            <p>{doctor.speciality}</p>
            <p className="text-[#262626] font-medium mt-1">Address:</p>
            <p>{doctor.address.line1}</p>
            <p>{doctor.address.line2}</p>
            <p><span className="text-[#262626]">Date & Time:</span></p>
          </div>
          <div></div>
          <div className="flex flex-col justify-end gap-2">
            <button className="text-sm text-[#5e5e5e] border border-gray-500 p-2 sm:min-w-46 cursor-pointer hover:bg-primary hover:text-white transition-all duration-300">Pay Online</button>
            <button className="text-sm text-[#5e5e5e] border border-gray-500 p-2 sm:min-w-46 cursor-pointer  hover:bg-red-600 hover:text-white transition-all duration-300">Cancel Appointment</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyAppointments;
