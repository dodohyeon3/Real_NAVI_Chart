/**
 * NAVI 앱 아이콘 심볼 — NAVI앱로고.svg의 날개 폴리곤 3개를 인라인으로
 * 배경 rect 없음 / fill="currentColor" 로 CSS 색상 상속
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
      <polygon points="80.16 102.53 126.02 270.96 189.14 313.31 164.69 320.95 116.56 391.34 207.69 357.28 231.76 327.41 242.66 238.7 225.8 195.38 80.16 102.53" />
      {/* 우측 날개 */}
      <polygon points="257.02 264.74 251.7 329.74 383.16 285.1 466.23 139.6 314.84 187.55 257.02 264.74" />
      {/* 접합 다이아몬드 */}
      <polygon points="298.84 319.45 258.2 339.75 266.68 371.84 321.09 405.58 339.5 383.89 340.21 332.96 298.84 319.45" />
    </svg>
  )
}
