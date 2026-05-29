import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navi: {
          bg:             '#030617',
          surface:        '#070D1F',
          surface2:       '#0A1026',
          surface3:       '#11182E',
          border:         '#0D1828',
          border2:        '#1A2540',
          accent:         '#2D4198',
          'accent-hover': '#3D54BF',
          text:           '#F8F9F7',
          secondary:      '#8892AA',
          muted:          '#525C73',
          green:          '#26a69a',
          red:            '#ef5350',
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
      },
      animation: {
        'navi-slide-up': 'navi-slide-up 200ms cubic-bezier(0.16,1,0.3,1) forwards',
        'navi-fade':     'navi-fade 150ms ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
