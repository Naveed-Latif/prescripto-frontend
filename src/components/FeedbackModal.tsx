import { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

const FeedbackModal = ({ isOpen, onClose, onSubmit }: FeedbackModalProps) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) return;
    setSubmitting(true);
    await onSubmit(rating, comment);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="bg-linear-to-b from-indigo-500 to-indigo-400 px-8 py-7 text-center">
          <div className="w-10 h-10 border-2 border-white/60 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-1">Share Your Feedback</h2>
          <p className="text-indigo-100 text-sm">Your feedback helps us enhance our services and patient experience</p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">

          {/* Comment */}
          <label className="block text-sm font-semibold text-gray-800 mb-2">Your Experience</label>
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="Write your experience..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <span className="absolute bottom-3 right-3 text-xs text-gray-400">
              {comment.length}/500 characters
            </span>
          </div>

          {/* Rating */}
          <div className="mt-5">
            <p className="text-sm text-gray-600 mb-3">
              How likely are you to recommend this doctor and our clinic to your friends or family?
            </p>
            <div className="flex items-center justify-between px-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{star}</span>
                  <button
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className="w-9 h-9 transition-colors"
                      fill={(hovered || rating) >= star ? '#6366f1' : '#e5e7eb'}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 cursor-pointer text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !rating || !comment.trim()}
              className="flex-1 py-3 rounded-xl bg-indigo-400 cursor-pointer text-white text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;