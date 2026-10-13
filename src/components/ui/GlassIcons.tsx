import React from 'react';

export interface GlassIconItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
  onClick: () => void;
}

interface GlassIconsProps {
  items: GlassIconItem[];
  className?: string;
}

export const GlassIcons: React.FC<GlassIconsProps> = ({ items, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-[#19122E]/80 to-[#0F0B1C]/90 border border-[#2A2240] hover:border-[#00E5FF]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,229,255,0.15)] text-center cursor-pointer overflow-hidden"
          >
            {/* Top specular glow effect */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {item.badge && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#7C3AED]/30 text-[#C4B5FD] border border-[#7C3AED]/40">
                {item.badge}
              </span>
            )}

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110 shadow-inner"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${item.color}33, #130E22)`,
                border: `1px solid ${item.color}44`,
              }}
            >
              <Icon className="w-6 h-6 transition-colors" />
            </div>

            <span className="font-heading font-semibold text-xs text-white group-hover:text-[#00E5FF] transition-colors">
              {item.label}
            </span>
            <span className="text-[10px] text-[#9E9AA8] mt-0.5 line-clamp-1">
              {item.description}
            </span>
          </button>
        );
      })}
    </div>
  );
};
