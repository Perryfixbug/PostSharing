'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = theme === 'system' ? systemTheme : theme;

  return (
    <Button
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className={cn(
        'p-2 rounded-full w-18 relative text-xl',
        current == 'dark' ? 'bg-secondary hover:bg-secondary/50' : 'bg-accent hover:bg-accent/60'
      )}
    >
      <div
        className={`
            absolute top-1/2 left-2 -translate-y-1/2 
            transition-transform duration-300 ease-in-out
            ${current === 'dark' ? 'translate-x-0' : 'translate-x-8'}
        `}
      >
        <Badge className="rounded-full w-7 h-7 flex items-center justify-center text-lg bg-primary">
          {current === 'dark' ? '🌙' : '🌞'}
        </Badge>
      </div>
    </Button>
  );
}
