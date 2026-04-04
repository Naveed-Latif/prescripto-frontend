import { FaStar } from "react-icons/fa";

export default function StarRatingFilter({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(value === star ? 0 : star)}
          className="transition-transform hover:scale-110"
        >
          <FaStar
            size={28}
            className={
              star <= value
                ? "text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}