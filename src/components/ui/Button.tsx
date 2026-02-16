import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 hover:scale-[1.01] flex-shrink-0';

    const variantStyles = {
        primary: 'bg-[#8D6E63] hover:bg-[#795548] text-white shadow-xl shadow-brown-900/10',
        secondary: 'bg-gradient-to-br from-secondary to-orange-600 text-secondary-foreground shadow-lg hover:shadow-secondary/20',
        ghost: 'bg-transparent hover:bg-muted text-foreground border border-border/10',
        danger: 'bg-gradient-to-br from-missed to-rose-700 text-white shadow-lg hover:shadow-missed/20',
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
