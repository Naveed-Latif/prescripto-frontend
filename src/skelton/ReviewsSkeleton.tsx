const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const ReviewsSkeleton = () => (
  <div className="border border-gray-200 rounded-xl p-6 w-full">  
    
    {/* Header */}
    <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
      <Skeleton className="h-5 w-20" />       
      <Skeleton className="h-4 w-28" />       
    </div>

    {/* Review items */}
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-3 mb-6">   
        <Skeleton className="w-11 h-11 rounded-full shrink-0" />  
        <div className="flex-1 flex flex-col gap-2">              
          <div className="flex justify-between">
            <Skeleton className="h-3.5 w-28" />                  
            <Skeleton className="h-3.5 w-20" />                  
          </div>
          <Skeleton className="h-3 w-16" />                      
          <Skeleton className="h-3.5 w-full" />                  
        </div>
      </div>
    ))}

  </div>
);
export default ReviewsSkeleton;