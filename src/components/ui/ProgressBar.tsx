import React from 'react';

interface ProgressBarProps {
    value: number;
    max?: number;
    showPercentage?: boolean;
    className?: string;
    color?: 'primary' | 'secondary' | 'completed';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    showPercentage = true,
    className = '',
    color = 'primary',
}) => {
    const percentage = Math.min(Math.round((value / max) * 100), 100);

    const colorStyles = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        completed: 'bg-completed',
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between mb-2">
                {showPercentage && (
                    <span className="text-sm font-semibold text-muted-foreground">
                        {percentage}%
                    </span>
                )}
            </div>
            <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm border border-border/30">
                <div
                    className={`h-full ${colorStyles[color]} transition-all duration-700 ease-out rounded-full relative overflow-hidden`}
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
            </div>
        </div>
    );
};
