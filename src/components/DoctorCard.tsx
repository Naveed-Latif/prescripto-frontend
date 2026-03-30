import { useNavigate } from "react-router-dom";
import type { Doctor } from "../Types";
import { FaStar } from "react-icons/fa";
import Lottie from "lottie-react"; 
import GreenPulse from "../assets/GreenPulse.json";
import RedPulse from "../assets/RedPulse.json";

interface DoctorCardProps {
  doctor: Doctor;
}

function DoctorCard({ doctor }: DoctorCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/appointment/${doctor.id}`);
        scrollTo(0, 0);
      }}
      className="border-[#C9D8FF] border rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-300"
    >
      <div className="relativeh-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 w-full overflow-hidden bg-blue-50">
        <img
          className="bg-blue-50 w-full"
          src={doctor.profile.profileImage ?? "/src/assets/dummy_doc.png"}
          alt={doctor.profile.name}
        />
        {doctor.isActive ? (
          <div className="flex gap-1.5 items-center text-green-600 text-xs font-medium absolute top-1 left-1  px-2.5 py-1 rounded-full ">
            <Lottie animationData={GreenPulse} className="w-5 h-5" />
          </div>
        ) : (
          <div className="flex gap-1.5 items-center text-red-600 text-xs font-medium absolute top-1 left-1  px-2.5 py-1 rounded-full ">
            <Lottie animationData={RedPulse} className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-gray-900 font-medium text-lg">
          {doctor.profile.name}
        </p>
        <p className="text-xs text-gray-600">{doctor.specialty}</p>
        <div className="flex items-center gap-1 mt-1">
          <FaStar className="text-yellow-400" />
          <span className="text-sm font-medium">{doctor.ratingAverage}</span>
          <span className="text-sm text-gray-500">
            ({doctor.totalReviews} reviews)
          </span>
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;
