import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import DoctorCard from "./DoctorCard";

interface RelatedDocProps {
  docId: string | undefined;
  speciality: string;
}

function RelatedDoctors({ docId, speciality }: RelatedDocProps) {
  const { doctors } = useContext(AppContext);
  const relatedDoc = doctors.filter(
    (doc) => doc.specialty === speciality && doc.id !== Number(docId),
  );

  return (
    <div>
      <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 ">
        <h1 className="text-3xl font-medium">Related Doctors</h1>
        <p className="md:w-1/3 text-sm text-center text-gray-500">
          Simply browse through our extensive list of trusted doctors.
        </p>
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0 ">
          {relatedDoc.slice(0, 5).map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RelatedDoctors;
