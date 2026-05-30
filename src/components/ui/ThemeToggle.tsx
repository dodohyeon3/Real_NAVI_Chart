'use client'

import { useTheme } from '@/hooks/useTheme'
import type { ThemeMode } from '@/stores/themeStore'
import { clsx } from 'clsx'

const MODES: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'dark',   label: '다크',   icon: '🌙' },
  { value: 'system', label: '시스템', icon: '⬛' },
  { value: 'light',  label: '라이트', icon: '☀️' },
]

export function ThemeToggle() {
  const { mode, setMode } = useTheme()

  return (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-lg
                 bg-navi-surface2 border border-navi-border"
      aria-label="테마 선택"
    >
      {MODES.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setMode(value)}
          title={label}
          aria-pressed={mode === value}
          className={clsx(
            'w-7 h-6 flex items-center justify-center rounded-md text-[12px]',
            'transition-all duration-150',
            mode === value
              ? 'bg-navi-surface text-navi-text shadow-sm border border-navi-border'
              : 'text-navi-muted hover:text-navi-secondary',
          )}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}
