'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    onChange,
    label,
    className = '',
}) => {
    return (
        <label className={`flex items-center cursor-pointer group ${className}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only"
                />
                <div
                    className={`
            w-6 h-6 rounded-md border-2 transition-all duration-200
            ${checked
                            ? 'bg-primary border-primary'
                            : 'bg-transparent border-muted-foreground group-hover:border-primary'
                        }
          `}
                >
                    {checked && (
                        <Check className="w-full h-full text-primary-foreground p-0.5" />
                    )}
                </div>
            </div>
            {label && (
                <span className="ml-3 text-foreground group-hover:text-primary transition-colors">
                    {label}
                </span>
            )}
        </label>
    );
};
