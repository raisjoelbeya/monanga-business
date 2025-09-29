import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  withText?: boolean;
}

export const Logo = ({
  className = '',
  size = 'md',
  withText = true,
}: LogoProps) => {
  // --- Mappings from size prop to RESPONSIVE Tailwind classes ---
	
	const logoSizeClasses = {
		sm: 'w-3 h-3',
		md: 'w-5 h-5 sm:w-6 sm:h-6',
		lg: 'w-7 h-7 sm:w-11 sm:h-11',
		xl: 'w-9 h-9 sm:w-13 sm:h-13',
		xxl: 'w-11 h-11 sm:w-17 sm:h-17',
		xxxl: 'w-13 h-13 sm:w-21 sm:h-21',
	};
	
	const textSizeClasses = {
		sm: 'text-lg font-extrabold',
		md: 'text-xl sm:text-2xl font-extrabold',
		lg: 'text-2xl sm:text-4xl font-extrabold',
		xl: 'text-3xl sm:text-5xl font-extrabold',
		xxl: 'text-4xl sm:text-6xl font-extrabold',
		xxxl: 'text-5xl sm:text-7xl font-extrabold',
	};

  const gapClasses = {
    sm: 'ml-2',
    md: 'ml-3',
    lg: 'ml-3 sm:ml-4',
    xl: 'ml-4',
    xxl: 'ml-4 sm:ml-5',
    xxxl: 'ml-5 sm:ml-6',
  };

  // --- Select the correct classes based on the size prop ---

  const finalLogoClasses = logoSizeClasses[size] || logoSizeClasses.md;
  const finalTextClasses = textSizeClasses[size] || textSizeClasses.md;
  const finalGapClasses = gapClasses[size] || gapClasses.md;

  return (
    <Link
      href="/"
      className={`flex items-center hover:opacity-90 transition-opacity ${className}`}
    >
      <div className={`relative flex-shrink-0 ${finalLogoClasses}`}>
        <Image
          src="/logo.svg"
          alt="Monanga Business Logo"
          fill
          priority
          className="object-contain"
        />
      </div>
      {withText && (
        <span className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 whitespace-nowrap font-bold ${finalTextClasses} ${finalGapClasses}`}>
          Monanga Business
        </span>
      )}
    </Link>
  );
};
