// components/DoctorCardSkeleton.tsx
const DoctorCardSkeleton = () => (
  <div className="border border-gray-100 rounded-xl overflow-hidden">
    
    {/* Image area - blue-50 bg like your cards */}
    <div className="bg-blue-50 h-48 w-full animate-pulse" />

    {/* Info area */}
    <div className="p-4 flex flex-col gap-2">
      {/* Available dot */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-2.5 w-14 bg-gray-200 rounded animate-pulse" />
      </div>
      {/* Doctor name */}
      <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
      {/* Speciality */}
      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
      {/* Star + reviews */}
      <div className="flex items-center gap-2 mt-1">
        <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

export default DoctorCardSkeleton;