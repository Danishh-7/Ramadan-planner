'use client';

import { useEffect, useState } from 'react';
import { useRamadanStore } from '@/store/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useRamadanStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme, mounted]);

    if (!mounted) {
        return <>{children}</>;
    }

    return <>{children}</>;
}
