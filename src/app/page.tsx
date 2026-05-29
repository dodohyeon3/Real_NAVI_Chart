import Link from 'next/link'
import { NaviSymbol } from '@/components/ui/NaviSymbol'

export default function LandingPage() {
  return (
    <main className="
      min-h-screen bg-navi-bg navi-grid-bg
      flex flex-col items-center justify-center
      px-6 py-16 text-center relative overflow-hidden
    ">
      {/* 심볼 */}
      <div className="mb-7">
        <NaviSymbol className="w-14 h-14 text-navi-text" />
      </div>

      {/* 워드마크 */}
      <div className="flex items-baseline gap-2.5 mb-2">
        <span className="text-[38px] font-black tracking-[-0.03em] text-navi-text leading-none">
          NAVI
        </span>
        <span className="text-[18px] font-semibold tracking-[-0.01em] text-navi-secondary leading-none">
          Chart
        </span>
      </div>

      {/* 태그라인 */}
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-navi-muted mb-10">
        차트 읽기 능력 학습 플랫폼
      </p>

      {/* 헤드라인 */}
      <h1 className="
        text-[28px] sm:text-[32px] font-black
        text-navi-text tracking-[-0.025em] leading-[1.15]
        max-w-sm mb-4
      ">
        <span className="text-navi-secondary">"RSI를 배웠다"</span>가 아닌<br />
        <span className="text-navi-accent">"차트를 읽을 수 있다"</span>
      </h1>

      <p className="text-[13px] text-navi-secondary leading-relaxed max-w-xs mb-10">
        직접 클릭하고, 판단하고, 틀리면서<br />
        차트 읽기 능력이 자연스럽게 생겨요.
      </p>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
        <Link
          href="/tutorial"
          className="
            flex-1 flex items-center justify-center gap-2
            h-11 px-6
            bg-navi-accent text-navi-text
            text-[13px] font-semibold tracking-wide
            rounded-lg border border-navi-accent
            hover:bg-navi-accent-hover
            transition-colors duration-150
            active:scale-[0.98]
          "
        >
          튜토리얼 시작
          <span className="text-navi-text/50 text-[10px] font-normal">15단계</span>
        </Link>
        <Link
          href="/chart"
          className="
            flex-1 flex items-center justify-center
            h-11 px-6
            bg-transparent text-navi-secondary
            text-[13px] font-medium
            rounded-lg border border-navi-border
            hover:border-navi-border2 hover:text-navi-text
            transition-all duration-150
          "
        >
          차트 바로 보기
        </Link>
      </div>

      {/* 학습 단계 미리보기 */}
      <div className="mt-12 flex items-center flex-wrap justify-center gap-2 max-w-sm">
        {['캔들', 'MA', 'RSI', 'MACD', 'BB', '종합 테스트', '시뮬레이션'].map((step, i, arr) => (
          <span key={step} className="flex items-center gap-2">
            <span className="text-[11px] text-navi-muted tracking-wide">{step}</span>
            {i < arr.length - 1 && (
              <span
                className="w-1 h-1 bg-navi-border2 flex-shrink-0"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              />
            )}
          </span>
        ))}
      </div>

      {/* 신뢰 문구 */}
      <p className="mt-8 text-[10px] text-navi-muted/50 tracking-wide">
        틀려도 괜찮아요 · 어떤 버튼을 눌러도 데이터는 사라지지 않아요
      </p>
    </main>
  )
}
