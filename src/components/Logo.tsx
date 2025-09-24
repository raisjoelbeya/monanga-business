import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

export const Logo = ({ className = '', size = 'md', withText = true }: LogoProps) => {
  const sizeMap = {
    sm: { width: 24, height: 24 },
    md: { width: 40, height: 40 },
    lg: { width: 64, height: 64 },
  };

  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const { width, height } = sizeMap[size];
  const textSize = textSizeMap[size];

  return (
    <Link href="/" className={`flex items-center ${className} hover:opacity-90 transition-opacity`}>
      <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
        <Image
          src="/logo.svg"
          alt="Monanga Business Logo"
          width={width}
          height={height}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {withText && (
        <span className={`ml-3 font-bold text-white ${textSize}`}>
          Monanga Business
        </span>
      )}
    </Link>
  );
};
