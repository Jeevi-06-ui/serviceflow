'use client';

import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';

interface FeedbackModalProps {
  ticketNumber: string;
  technicianName?: string;
  productName?: string;
  onClose: () => void;
  onSubmit: (data: {
    rating: number;
    comment: string;
    resolutionSatisfaction: number;
    timelyArrivalSatisfaction: number;
  }) => void;
}

export function FeedbackModal({
  ticketNumber,
  technicianName,
  productName,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [resolutionSatisfaction, setResolutionSatisfaction] = useState(5);
  const [timelyArrivalSatisfaction, setTimelyArrivalSatisfaction] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      comment: comment.trim() || 'Service completed satisfactorily.',
      resolutionSatisfaction,
      timelyArrivalSatisfaction,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Rate Your Service Experience</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ticket #{ticketNumber} {productName && `• ${productName}`}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star Rating */}
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700 mb-2">Overall Service Satisfaction</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-600 mt-1">
              {rating === 5
                ? 'Excellent (5/5)'
                : rating === 4
                ? 'Very Good (4/5)'
                : rating === 3
                ? 'Average (3/5)'
                : rating === 2
                ? 'Poor (2/5)'
                : 'Very Poor (1/5)'}
            </p>
          </div>

          {/* Sub-ratings */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Technical Issue Resolution</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setResolutionSatisfaction(val)}
                    className={`w-6 h-6 rounded text-[11px] font-bold ${
                      resolutionSatisfaction === val
                        ? 'bg-teal-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Punctuality & Behavior {technicianName && `(${technicianName})`}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTimelyArrivalSatisfaction(val)}
                    className={`w-6 h-6 rounded text-[11px] font-bold ${
                      timelyArrivalSatisfaction === val
                        ? 'bg-teal-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Feedback & Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked about the technician or service experience..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              rows={3}
              required
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Submit Rating & Close Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
