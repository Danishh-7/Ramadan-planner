import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glass?: boolean | 'light' | 'dark';
    glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    glow = false,
    glass = false,
    ...props
}) => {
    const glassClass = glass === 'dark' ? 'glass-dark' : glass ? 'glass-morphism' : '';

    return (
        <div
            className={`
        bg-card text-card-foreground rounded-3xl p-6 shadow-xl border border-border/50
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${glassClass}
        ${glow ? 'glow-primary' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};
