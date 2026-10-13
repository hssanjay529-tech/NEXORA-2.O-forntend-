import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HoldButtonProps {
  onHoldComplete: () => void;
  label: string;
  confirmedLabel?: string;
  durationMs?: number; // default 1500ms
  variant?: 'cyan' | 'emerald' | 'crimson';
  className?: string;
  disabled?: boolean;
}

export const HoldButton: React.FC<HoldButtonProps> = ({
  onHoldComplete,
  label,
  confirmedLabel = 'Confirmed & Dispatched',
  durationMs = 1500,
  variant = 'cyan',
  className = '',
  disabled = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHolding && !isComplete && !disabled) {
      const stepMs = 30;
      const increment = (stepMs / durationMs) * 100;

      timerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsHolding(false);
            setIsComplete(true);
            onHoldComplete();
            return 100;
          }
          return prev + increment;
        });
      }, stepMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (!isComplete) {
        setProgress(0);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHolding, isComplete, disabled, durationMs, onHoldComplete]);

  const handleMouseDown = () => {
    if (!disabled && !isComplete) setIsHolding(true);
  };

  const handleMouseUp = () => {
    if (!isComplete) setIsHolding(false);
  };

  let fillColor = 'bg-gradient-to-r from-[#00E5FF] to-[#10B981]';
  let borderColor = 'border-[#00E5FF]/40';
  if (variant === 'crimson') {
    fillColor = 'bg-gradient-to-r from-red-600 to-rose-500';
    borderColor = 'border-red-500/40';
  } else if (variant === 'emerald') {
    fillColor = 'bg-gradient-to-r from-[#10B981] to-[#34D399]';
    borderColor = 'border-emerald-500/40';
  }

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <button
        type="button"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        disabled={disabled || isComplete}
        className={`relative overflow-hidden px-5 py-2.5 rounded-xl border ${borderColor} bg-[#130E22] text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-white/50'
        }`}
      >
        {/* Animated fill background */}
        <span
          className={`absolute left-0 top-0 bottom-0 ${fillColor} opacity-40 transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {isComplete ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#10B981] animate-bounce" />
              <span className="text-[#34D399]">{confirmedLabel}</span>
            </>
          ) : (
            <>
              <ShieldAlert
                className={`w-4 h-4 ${
                  isHolding ? 'text-[#00E5FF] animate-pulse' : 'text-[#9E9AA8]'
                }`}
              />
              <span>{isHolding ? `Hold to confirm (${Math.round(progress)}%)` : label}</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
