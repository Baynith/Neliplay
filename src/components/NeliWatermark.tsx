import React from 'react';

interface NeliWatermarkProps {
  position?: 'bottom-right' | 'top-right' | 'top-left' | 'bottom-left' | 'center' | 'backdrop';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero-sky';
  opacity?: number;
  className?: string;
  glow?: boolean;
}

export const NeliWatermark: React.FC<NeliWatermarkProps> = ({
  position = 'bottom-right',
  size = 'sm',
  opacity = 0.25,
  className = '',
  glow = false,
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-3 right-3',
    'top-right': 'top-3 right-3',
    'top-left': 'top-3 left-3',
    'bottom-left': 'bottom-3 left-3',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'backdrop': 'top-12 right-12 md:right-24 lg:right-32',
  }[position];

  const sizeClasses = {
    'xs': 'w-5 h-5 rounded-md',
    'sm': 'w-7 h-7 rounded-lg',
    'md': 'w-10 h-10 rounded-xl',
    'lg': 'w-14 h-14 rounded-2xl',
    'xl': 'w-20 h-20 rounded-3xl',
    'hero-sky': 'w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-[42px]',
  }[size];

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none z-10 transition-opacity duration-300 ${positionClasses} ${className}`}
      style={{ opacity }}
    >
      <div className={`relative overflow-hidden ${sizeClasses} ${glow ? 'shadow-[0_0_35px_rgba(0,180,216,0.35)]' : ''}`}>
        <img
          src="/assets/aistudio/media_1792487075393_11596c6f_ab3db261.png"
          alt=""
          className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          loading="lazy"
        />
      </div>
    </div>
  );
};
