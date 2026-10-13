import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let widthClass = 'max-w-md';
  if (maxWidth === 'sm') widthClass = 'max-w-sm';
  if (maxWidth === 'lg') widthClass = 'max-w-2xl';
  if (maxWidth === 'xl') widthClass = 'max-w-4xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090611]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full ${widthClass} rounded-2xl bg-[#0F0B1E] border border-[#3A2D5C] shadow-2xl p-6 relative overflow-hidden`}
      >
        {/* Top ambient highlight */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2A2240] mb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">{title}</h3>
            {description && <p className="text-xs text-[#9E9AA8] mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9E9AA8] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
