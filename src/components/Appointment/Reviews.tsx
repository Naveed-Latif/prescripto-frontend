import { useState, useEffect } from "react";
import type { Review, ReviewResponse } from "../../types/Types.ts";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import ReviewCard from "./ReviewCard";
import ReviewsSkeleton from "../../skelton/ReviewsSkeleton.tsx";

// --- Reviews Box ---
const Reviews = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRes, setReviewRes] = useState<ReviewResponse | null>(null);
  const { backendurl } = useContext(AppContext);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendurl}/reviews`, {
        params: {
          doctorId: Number(id),
          page: 1,
          pageSize: 10,
        },
      });
      if (response.data.status == 200) {
        setReviews(response.data.reviews);
        setReviewRes(response.data);
      } else {
        toast.error("Failed to load reviews");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetch = async () => {
      await fetchReviews();
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (loading) return <ReviewsSkeleton />;
  return (
    <div className="border border-gray-200 rounded-2xl p-6 max-h-[350px] overflow-y-auto scroll-smooth">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Reviews</h2>
        {reviewRes && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="text-yellow-400">★</span>
            <span className="font-medium text-gray-700">
              {reviewRes.averageRating}
            </span>
            <span>· {reviewRes.totalReviews} reviews</span>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          No reviews yet.
        </p>
      ) : (
        reviews.map((review) => <ReviewCard key={review.id} review={review} />)
      )}
    </div>
  );
};

export default Reviews;
