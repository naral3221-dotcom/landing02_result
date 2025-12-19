import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "../ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface ReviewData {
  id: number;
  name: string;
  age: string;
  tags: string[];
  beforeImg: string;
  afterImg: string;
  content: string;
  date: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewData | null;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, review }) => {
  if (!review) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#2A2415] border border-[#D4B86A]/30 text-[#F5D88E] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-[#D4B86A]/20 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold text-[#D4B86A]">
            CASE REVIEW
          </DialogTitle>
          {/* Close button is handled by DialogContent's default close or we can add a custom one if needed, 
              but shadcn DialogContent usually has an X. We can hide the default one and use ours or just style the default.
              For now, let's stick to the default behavior but styled.
           */}
        </DialogHeader>

        <div className="p-0 overflow-y-auto max-h-[80vh]">
          {/* Images */}
          <div className="grid grid-cols-2 gap-0.5">
            <div className="relative aspect-square">
              <img src={review.beforeImg} alt="Before" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 text-xs text-white rounded">Before</div>
            </div>
            <div className="relative aspect-square">
              <img src={review.afterImg} alt="After" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-[#D4B86A] px-2 py-0.5 text-xs text-[#3D2E0F] font-bold rounded">After</div>
            </div>
          </div>

          {/* Info */}
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">{review.name}님 ({review.age})</h3>
                <p className="text-sm text-[#D4B86A]/80">{review.date}</p>
              </div>
              <div className="bg-[#D4B86A]/10 px-3 py-1 rounded-full border border-[#D4B86A]/30 text-xs text-[#D4B86A]">
                AI 매칭 98%
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-[#1A160F] text-[#F5D88E] px-2 py-1 rounded border border-[#D4B86A]/20">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="bg-[#1A160F] p-4 rounded-lg border border-[#D4B86A]/10 text-sm leading-relaxed text-gray-300">
              {review.content}
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-[#D4B86A]/20 bg-[#221D12]">
          <Button 
            onClick={onClose} 
            className="w-full bg-[#D4B86A] hover:bg-[#C9A962] text-[#3D2E0F] font-bold"
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
