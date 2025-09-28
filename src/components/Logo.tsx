import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
    withText?: boolean;
    fontSize?: string;
    fontWeight?: number;
    lineHeight?: string;
    gapScale?: number;
}

export const Logo = ({
                         className = '',
                         size = 'md',
                         withText = true,
                         fontSize: customFontSize,
                         fontWeight: customFontWeight,
                         lineHeight: customLineHeight,
                         gapScale = 0.25,
                     }: LogoProps) => {
    // Source de vérité (rem au lieu de px → responsive)
    const sizeMap = {
        sm: 1.5,   // 24px
        md: 2.5,   // 40px
        lg: 4,     // 64px
        xl: 5,     // 80px
        xxl: 6.25, // 100px
        xxxl: 7.5, // 120px
    };

    const logoSize = sizeMap[size] || sizeMap.md; // en rem

    // ✅ Font size proportionnelle au logo
    const defaultFontSize = `${(logoSize * 0.75).toFixed(2)}rem`;

    // ✅ Font weight : lié à la taille du logo, borné entre 500–900
    const defaultFontWeight = Math.max(500, Math.min(900, Math.round(logoSize * 500)));

    // ✅ Line height : lié à la taille mais limité (1.2 → 2 max)
    const defaultLineHeight = (1.2 + logoSize / 10).toFixed(2);

    // ✅ Gap proportionnel au logo
    const gap = `${(logoSize * gapScale).toFixed(2)}rem`;

    // Overrides si props fournies
    const fontSize = customFontSize || defaultFontSize;
    const fontWeight = customFontWeight ?? defaultFontWeight;
    const lineHeight = customLineHeight || defaultLineHeight;

    return (
        <Link
            href="/"
            className={`flex items-center ${className} hover:opacity-90 transition-opacity`}
        >
            <div 
                className="relative flex-shrink-0"
                style={{
                    width: `${logoSize}rem`,
                    height: `${logoSize}rem`,
                    minWidth: `${logoSize}rem`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div 
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        src="/logo.svg"
                        alt="Monanga Business Logo"
                        width={logoSize * 16} // Conversion rem en px (1rem = 16px)
                        height={logoSize * 16}
                        className="max-w-full max-h-full w-auto h-auto"
                        priority
                        style={{
                            objectFit: 'contain',
                            display: 'block'
                        }}
                    />
                </div>
            </div>
            {withText && (
                <span
                    className="text-white whitespace-nowrap"
                    style={{ fontSize, fontWeight, lineHeight, marginLeft: gap }}
                >
          Monanga Business
        </span>
            )}
        </Link>
    );
};
