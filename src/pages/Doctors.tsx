import { useNavigate,useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.tsx";
import type { Doctor } from "../Types.ts";



function Doctors() {
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [showFilter, setShowfilter] = useState<boolean>(false)

  
  
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const { speciality } = useParams();

  useEffect(()=>{
    const filterDocsBySpeciality = (speciality?: string) => {
   if(speciality){
    const filtered = doctors.filter((doctor) => doctor.speciality === speciality);
    setFilteredDoctors(filtered);
   }else{
    setFilteredDoctors(doctors);
   }
  }
    filterDocsBySpeciality(speciality);
  },[doctors,speciality])

  return (
    <div className="">
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row gap-5 mt-5">
      {/* -----Left Bar----- */}
      <button onClick={()=>setShowfilter((prev)=>!prev)} className={`py-1 px-3 rounded border border-gray-500 text-sm transition-all sm:hidden ${showFilter?'bg-primary': ''}`}>Filter</button>
      <div className={` flex-col gap-4 text-sm text-gray-600 ${showFilter?'flex': 'hidden sm:flex'}`}>
        <p onClick={()=>speciality === 'General physician'? navigate('/doctors'):navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-500 rounded-md cursor-pointer transition-all ${speciality === 'General physician' ? 'bg-indigo-100 text-black' : ''}`}>General physician</p>
        <p onClick={()=>speciality === 'Gynecologist'? navigate('/doctors'):navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-500 rounded-md cursor-pointer transition-all ${speciality === 'Gynecologist' ? 'bg-indigo-100 text-black' : ''}`}>Gynecologist</p>
        <p onClick={()=>speciality === 'Dermatologist'? navigate('/doctors'):navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-500 rounded-md cursor-pointer transition-all ${speciality === 'Dermatologist' ? 'bg-indigo-100 text-black' : ''}`}>Dermatologist</p>
        <p onClick={()=>speciality === 'Pediatricians'? navigate('/doctors'):navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-500 rounded-md cursor-pointer transition-all ${speciality === 'Pediatricians' ? 'bg-indigo-100 text-black' : ''}`}>Pediatricians</p>
        <p onClick={()=>speciality === 'Neurologist'? navigate('/doctors'):navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-500 rounded-md cursor-pointer transition-all ${speciality === 'Neurologist' ? 'bg-indigo-100 text-black' : ''}`}>Neurologist</p>
        <p onClick={()=>speciality === 'Gastroenterologist'? navigate('/doctors'):navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-500 rounded-md cursor-pointer transition-all ${speciality === 'Gastroenterologist' ? 'bg-indigo-100 text-black' : ''}`}>Gastroenterologist</p>

      </div>
      {/* -----Right Bar----- */}
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6  ">
        {filteredDoctors.map((doctor, index) => (
            <div
                onClick={() => navigate(`/appointment/${doctor._id}`)}
              key={index}
              className="border-[#C9D8FF] border rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 translate-all duration-300"
            >
              <img className="bg-blue-50" src={doctor.image} alt="" />
              <div className="p-4">
                <div className="flex gap-2 items-center text-green-500 text-center text-sm">
                  <p className="w-2 h-2 rounded-full bg-green-500"></p>
                  <p>Available</p>
                </div>
                <p className="text-gray-900 font-medium text-lg">
                  {doctor.name}
                </p>
                <p className="text-xs text-gray-600">{doctor.speciality}</p>
              </div>
            </div>
          ))}

      </div>
      </div>
    </div>
  )
}

export default Doctors
