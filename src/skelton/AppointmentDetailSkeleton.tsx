// skelton/AppointmentDetailSkeleton.tsx
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const AppointmentDetailSkeleton = () => (
  <div>
    {/* Top Section — Doctor Info + Reviews */}
    <div className="flex gap-4">

      {/* Left — Doctor Card */}
      <div className="flex-1 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-16 h-16 rounded-full" />         {/* Avatar */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-44" />                     {/* Name */}
            <Skeleton className="h-3 w-56" />                     {/* Degree + Speciality */}
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-20 rounded-full" />          {/* Years */}
          <Skeleton className="h-6 w-16 rounded-full" />          {/* Rating */}
        </div>

        {/* About */}
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-3 w-full mb-1.5" />
        <Skeleton className="h-3 w-3/4 mb-4" />

        {/* Fee */}
        <Skeleton className="h-3 w-36" />
      </div>

      {/* Right — Reviews Card */}
      <div className="w-80 border border-gray-200 rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-16" />                       {/* Reviews */}
          <Skeleton className="h-3 w-24" />                       {/* avg rating */}
        </div>

        {/* Review items */}
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-3 mb-5">
            <Skeleton className="w-9 h-9 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />                 {/* Name */}
                <Skeleton className="h-3 w-16" />                 {/* Stars */}
              </div>
              <Skeleton className="h-2.5 w-12" />                 {/* Time ago */}
              <Skeleton className="h-3 w-full" />                 {/* Comment */}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Booking Slots */}
    <div className="mt-8">
      <Skeleton className="h-5 w-32 mb-4" />                      {/* Booking Slots title */}

      {/* Day pills */}
      <div className="flex gap-3 mb-4">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <Skeleton key={i} className="w-16 h-16 rounded-full" />
        ))}
      </div>

      {/* Time pills */}
      <div className="flex gap-3 flex-wrap mb-6">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      {/* Book button */}
      <Skeleton className="h-12 w-56 rounded-full" />
    </div>

    {/* Related Doctors */}
    <div className="mt-12">
      <Skeleton className="h-6 w-40 mx-auto mb-2" />              {/* Title */}
      <Skeleton className="h-3 w-64 mx-auto mb-6" />              {/* Subtitle */}

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
            <Skeleton className="h-48 w-full rounded-none" />     {/* Image */}
            <div className="p-4 flex flex-col gap-2">
              <Skeleton className="h-4 w-36" />                   {/* Name */}
              <Skeleton className="h-3 w-24" />                   {/* Speciality */}
              <Skeleton className="h-3 w-28" />                   {/* Rating */}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AppointmentDetailSkeleton;