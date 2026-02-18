'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

interface SearchableSelectProps {
    value: string;
    options: string[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    value,
    options,
    onChange,
    placeholder = 'Select...',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter options based on search query
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-3 rounded-2xl border-2 border-border dark:border-white bg-background focus:border-primary focus:outline-none font-black text-foreground shadow-inner flex items-center justify-between hover:border-primary transition-colors"
            >
                <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                    {value || placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-background border-2 border-border dark:border-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b-2 border-border dark:border-white/20">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border dark:border-white/30 bg-background focus:border-primary focus:outline-none font-bold text-sm"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full px-5 py-3 text-left font-bold hover:bg-primary/10 transition-colors flex items-center justify-between ${value === option ? 'bg-primary/20 text-primary' : 'text-foreground'
                                        }`}
                                >
                                    <span>{option}</span>
                                    {value === option && <Check className="w-4 h-4" />}
                                </button>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-muted-foreground font-bold">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
