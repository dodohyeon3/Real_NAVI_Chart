'use client'

import { useEffect, useState } from 'react'
import { useThemeStore, type ThemeMode } from '@/stores/themeStore'

/** 시스템 선호 모드 감지 */
function getSystemIsDark(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** 모드 → 실제 적용 테마 (dark | light) */
function resolveTheme(mode: ThemeMode): 'dark' | 'light' {
  if (mode === 'system') return getSystemIsDark() ? 'dark' : 'light'
  return mode
}

/** 현재 해상 테마를 반환하고 html 클래스를 동기화하는 훅 */
export function useTheme() {
  const { mode, setMode } = useThemeStore()
  const [resolved, setResolved] = useState<'dark' | 'light'>(() =>
    typeof window === 'undefined' ? 'dark' : resolveTheme(mode)
  )

  useEffect(() => {
    const next = resolveTheme(mode)
    setResolved(next)
    const html = document.documentElement
    if (next === 'light') {
      html.classList.add('light')
    } else {
      html.classList.remove('light')
    }
  }, [mode])

  // system 선택 시 미디어 쿼리 변경 감지
  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const next = resolveTheme('system')
      setResolved(next)
      if (next === 'light') document.documentElement.classList.add('light')
      else document.documentElement.classList.remove('light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  return { mode, resolved, isDark: resolved === 'dark', setMode }
}
