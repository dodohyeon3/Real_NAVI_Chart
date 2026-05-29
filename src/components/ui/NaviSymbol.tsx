/**
 * NAVI 브랜드 심볼 — 세 폴리곤 그대로 인라인 SVG
 * fill="currentColor" 로 텍스트 컬러 상속
 */
interface Props {
  className?: string
}

export function NaviSymbol({ className = 'w-6 h-6' }: Props) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      aria-label="NAVI"
      fill="currentColor"
    >
      {/* 좌측 날개 */}
      <polygon points="62.14 114.89 128.19 276.47 195.99 310.82 172.66 321.38 133.47 397.11 219.77 352.2 240.02 319.62 240.02 230.24 218.01 189.3 62.14 114.89" />
      {/* 우측 날개 */}
      <polygon points="257.45 254.33 260.09 319.5 385.13 259.18 449.86 104.63 305.44 170.68 257.45 254.33" />
      {/* 접합 다이아몬드 */}
      <polygon points="305.63 303.54 267.76 328.64 280.09 359.46 338.21 386.32 353.84 362.54 348.34 311.91 305.63 303.54" />
    </svg>
  )
}
