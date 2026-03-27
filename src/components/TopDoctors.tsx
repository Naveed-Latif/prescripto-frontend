import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { useNavigate } from "react-router-dom";
function TopDoctors() {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  return (
    <div>
      <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 ">
        <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
        <p className="md:w-1/3 text-sm text-center text-gray-500">
          Simply browse through our extensive list of trusted doctors.
        </p>
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0 ">
          {doctors.slice(0, 10).map((doctor, index) => (
            <div
                onClick={() => {navigate(`/appointment/${doctor.id}`); scrollTo(0,0);}}
              key={index}
              className="border-[#C9D8FF] border rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 translate-all duration-300"
            >
              <img className="bg-blue-50" src={doctor.profile.profileImage ?? "/src/assets/dummy_doc.png"} alt="" />
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
        <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 cursor-pointer">
          More
        </button>
      </div>
    </div>
  );
}

export default TopDoctors;
