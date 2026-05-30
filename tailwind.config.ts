import type { Config } from 'tailwindcss'

/**
 * NAVI Design System — CSS Variable 기반 테마 시스템
 *
 * 모든 navi-* 색상은 CSS 변수로 정의되어 Dark/Light 전환을 지원합니다.
 * ─────────────────────────────────────────────────────────────
 * 불투명도 수정자가 필요한 색상 (bg-navi-action/10 등):
 *   rgb(var(--navi-*) / <alpha-value>)  → CSS 변수는 공백 구분 RGB 채널값
 *
 * 불투명도 수정자 불필요 (text-navi-secondary 등):
 *   var(--navi-*)  → CSS 변수는 완성형 색상값
 * ─────────────────────────────────────────────────────────────
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        navi: {
          /* ── 공간 (Space) ───────────────────────────────── */
          bg:       'rgb(var(--navi-bg) / <alpha-value>)',
          surface:  'rgb(var(--navi-surface) / <alpha-value>)',
          surface2: 'rgb(var(--navi-surface2) / <alpha-value>)',
          surface3: 'rgb(var(--navi-surface3) / <alpha-value>)',
          border:   'rgb(var(--navi-border) / <alpha-value>)',
          border2:  'rgb(var(--navi-border2) / <alpha-value>)',

          /* ── 브랜드 (Brand) ─────────────────────────────── */
          accent:         'rgb(var(--navi-accent) / <alpha-value>)',
          'accent-hover': 'rgb(var(--navi-accent-hover) / <alpha-value>)',
          'accent-dim':   'rgb(var(--navi-accent) / 0.14)',

          /* ── 행동 (Action) ──────────────────────────────── */
          action:         'rgb(var(--navi-action) / <alpha-value>)',
          'action-hover': 'rgb(var(--navi-action-hover) / <alpha-value>)',
          'action-dim':   'rgb(var(--navi-action) / 0.12)',

          /* ── 시맨틱 상태 (Semantic) ─────────────────────── */
          success:       'rgb(var(--navi-success) / <alpha-value>)',
          'success-dim': 'rgb(var(--navi-success) / 0.12)',
          info:          'rgb(var(--navi-info) / <alpha-value>)',
          'info-dim':    'rgb(var(--navi-info) / 0.10)',
          warning:       'rgb(var(--navi-warning) / <alpha-value>)',
          'warning-dim': 'rgb(var(--navi-warning) / 0.12)',
          danger:        'rgb(var(--navi-danger) / <alpha-value>)',
          'danger-dim':  'rgb(var(--navi-danger) / 0.12)',

          /* ── 텍스트 위계 (Text hierarchy) ───────────────── */
          text:      'rgb(var(--navi-text) / <alpha-value>)',
          secondary: 'var(--navi-secondary)',  // 완성형 rgba — 수정자 불필요
          muted:     'var(--navi-muted)',
          disabled:  'var(--navi-disabled)',

          /* ── 차트 캔들 ──────────────────────────────────── */
          bullish: 'rgb(var(--navi-bullish) / <alpha-value>)',
          bearish: 'rgb(var(--navi-bearish) / <alpha-value>)',
          green:   'rgb(var(--navi-bullish) / <alpha-value>)',
          red:     'rgb(var(--navi-bearish) / <alpha-value>)',
        },
      },
      keyframes: {
        'navi-slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'navi-fade': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'navi-pulse-ring': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.15)' },
        },
      },
      animation: {
        'navi-slide-up':   'navi-slide-up 200ms cubic-bezier(0.16,1,0.3,1) forwards',
        'navi-fade':       'navi-fade 150ms ease-out forwards',
        'navi-pulse-ring': 'navi-pulse-ring 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
