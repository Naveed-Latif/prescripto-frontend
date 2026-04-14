const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const AppointmentRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-100">

    {/* Doctor Image */}
    <Skeleton className="w-28 h-28 rounded-lg shrink-0" />

    {/* Doctor Info */}
    <div className="flex-1 flex flex-col gap-2.5">
      <Skeleton className="h-4 w-36" />       {/* Name */}
      <Skeleton className="h-3 w-24" />       {/* Speciality */}
      <Skeleton className="h-3 w-16" />       {/* Address label */}
      <Skeleton className="h-3 w-20" />       {/* Address line 1 */}
      <Skeleton className="h-3 w-16" />       {/* Address line 2 */}
      <Skeleton className="h-3 w-52" />       {/* Date & Time */}
    </div>

    {/* Buttons */}
    <div className="flex flex-col gap-2 shrink-0">
      <Skeleton className="h-9 w-36 rounded" />   {/* Pay Online */}
      <Skeleton className="h-9 w-36 rounded" />   {/* Cancel Appointment */}
    </div>

  </div>
);

const AppointmentsSkeleton = () => (
  <div className="px-6 py-8">
    <Skeleton className="h-6 w-40 mb-6" />  {/* "My Appointments" title */}
    {Array.from({ length: 4 }).map((_, i) => (
      <AppointmentRowSkeleton key={i} />
    ))}
  </div>
);

export default AppointmentsSkeleton;