// components/ProfileSkeleton.tsx
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const ProfileSkeleton = () => (
  <div className="max-w-2xl  px-6 py-8">

    {/* Profile Image */}
    <Skeleton className="w-36 h-36 rounded-lg mb-6" />

    {/* Name */}
    <Skeleton className="h-8 w-48 mb-2" />
    {/* Divider */}
    <div className="border-b border-gray-100 mb-6" />

    {/* CONTACT INFORMATION */}
    <Skeleton className="h-3 w-40 mb-4" />

    <div className="flex flex-col gap-4 mb-6">
      {/* Email */}
      <div className="flex gap-16">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-44" />
      </div>
      {/* Phone */}
      <div className="flex gap-16">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-6" />
      </div>
      {/* Address */}
      <div className="flex gap-16">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-6" />
      </div>
    </div>

    {/* BASIC INFORMATION */}
    <Skeleton className="h-3 w-36 mb-4" />

    <div className="flex flex-col gap-4 mb-8">
      {/* Gender */}
      <div className="flex gap-16">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-16" />
      </div>
      {/* Birthday */}
      <div className="flex gap-16">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>

    {/* Edit Button */}
    <Skeleton className="h-9 w-20 rounded-full" />
  </div>
);

export default ProfileSkeleton;