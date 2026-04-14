// components/CancelConfirmModal.tsx
import { useState } from 'react';

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
}

const CancelConfirmModal = ({ isOpen, onClose, onConfirm }: CancelConfirmModalProps) => {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(note);
    setNote(''); // reset after submit
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">

        {/* Icon */}
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">Cancel Appointment?</h3>
        <p className="text-sm text-gray-500 mb-5 text-center">Are you sure you want to cancel? This action cannot be undone.</p>

        {/* Note */}
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Reason for cancellation <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Schedule conflict, feeling better..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-red-200 mb-5"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Keep It
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Yes, Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default CancelConfirmModal;