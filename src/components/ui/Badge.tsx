import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'crimson' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  className = '',
  ...props
}) => {
  let badgeClass = 'badge-cyan';
  if (variant === 'emerald') badgeClass = 'badge-emerald';
  if (variant === 'violet') badgeClass = 'badge-violet';
  if (variant === 'amber') badgeClass = 'badge-amber';
  if (variant === 'crimson') badgeClass = 'badge-crimson';
  if (variant === 'outline') badgeClass = 'border border-[#2A2240] text-[#9E9AA8] bg-[#130E22]';

  return (
    <span className={`badge ${badgeClass} ${className}`} {...props}>
      {children}
    </span>
  );
};
