import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  let baseClass = 'btn-primary';
  if (variant === 'secondary') baseClass = 'btn-secondary';
  if (variant === 'outline') baseClass = 'btn-outline';
  if (variant === 'destructive') baseClass = 'btn-primary !bg-gradient-to-r !from-red-600 !to-rose-700 !text-white';
  if (variant === 'ghost') baseClass = 'text-[#9E9AA8] hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors';

  let sizeClass = 'text-sm py-2 px-4';
  if (size === 'sm') sizeClass = 'text-xs py-1.5 px-3';
  if (size === 'lg') sizeClass = 'text-base py-2.5 px-6';

  return (
    <button
      className={`${baseClass} ${sizeClass} ${isLoading ? 'opacity-70 pointer-events-none' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </button>
  );
};
