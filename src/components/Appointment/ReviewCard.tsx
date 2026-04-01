import { useState } from "react";
import type { Review } from "../../Types";

function formatRelativeDate(iso: string, now: number): string {
  const date = new Date(iso);
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// --- Single Review Card ---
const ReviewCard = ({ review }: { review: Review }) => {
  const { patient, rating, comment, createdAt } = review;
  const [formattedDate] = useState(() =>
    formatRelativeDate(createdAt, Date.now()),
  );

  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="py-4 border-b border-gray-100 last:border-none">
      <div className="flex items-center gap-3 mb-2">
        {/* Avatar */}
        {patient.profileImage ? (
          <img
            src={patient.profileImage}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            style={{ backgroundColor: patient.profileColor }}
          >
            {initials}
          </div>
        )}

        {/* Name + Date */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{patient.name}</p>
          <p className="text-xs text-gray-400">{formattedDate}</p>
        </div>

        {/* Stars */}
        <div className="text-sm">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={i < rating ? "text-yellow-400" : "text-gray-200"}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-500 pl-12 leading-relaxed">{comment}</p>
    </div>
  );
};

export default ReviewCard;
