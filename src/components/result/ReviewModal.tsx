import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Star, User } from 'lucide-react';
import { ReviewContentRenderer } from '../ReviewContentRenderer';

export interface ReviewData {
  id: number;
  name: string;
  age: string;
  rating: number;
  date: string;
  content: string;
  tags: string[];
  beforeImage: string;
  afterImage: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewData | null;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, review }) => {
  if (!review) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-900 border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Content - 본문에 이미지가 포함되어 있으므로 상단 이미지 제거 */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">{review.name}님</h3>
                      <span className="text-sm text-slate-400">({review.age})</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full">
                    <Calendar size={12} />
                    <span>{review.date}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {review.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <User size={14} />
                    상세 후기
                  </h4>
                  <ReviewContentRenderer content={review.content} darkMode={true} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
