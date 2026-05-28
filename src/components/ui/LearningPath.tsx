'use client'

import Link from 'next/link'
import { useLearnStore } from '@/stores/learnStore'

const STEPS = [
  { key: 'moving-average', label: 'MA',       icon: '📊', desc: '추세 읽기',   type: 'indicator' as const },
  { key: 'bollinger',      label: 'BB',        icon: '〰️', desc: '변동성',      type: 'indicator' as const },
  { key: 'rsi',            label: 'RSI',       icon: '🌡️', desc: '과열 신호',  type: 'indicator' as const },
  { key: 'macd',           label: 'MACD',      icon: '🔄', desc: '추세 전환',  type: 'indicator' as const },
  { key: 'drawing',        label: '작도',       icon: '✏️', desc: '직접 분석', type: 'drawing'   as const },
  { key: 'simulate',       label: '시뮬레이션', icon: '🔮', desc: '실전 예측', type: 'simulate'  as const },
]

export function LearningPath() {
  const { triedIndicators, triedDrawing, simCount } = useLearnStore()

  function isDone(key: string) {
    if (key === 'drawing')   return triedDrawing
    if (key === 'simulate')  return simCount > 0
    return triedIndicators.includes(key)
  }

  const currentIdx = STEPS.findIndex(s => !isDone(s.key))
  const allDone    = currentIdx === -1

  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[11px] font-bold text-navi-muted">학습 경로</span>
        {allDone ? (
          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
            🎉 모두 완료!
          </span>
        ) : (
          <span className="text-[10px] text-navi-muted">
            {STEPS.filter(s => isDone(s.key)).length}/{STEPS.length} 완료
          </span>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {STEPS.map((step, idx) => {
          const done    = isDone(step.key)
          const current = idx === currentIdx

          const inner = (
            <div
              key={step.key}
              className={[
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium whitespace-nowrap transition-all shrink-0',
                done
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                  : current
                  ? 'bg-indigo-500/15 border-indigo-400/50 text-indigo-300 ring-1 ring-indigo-400/30'
                  : 'bg-navi-surface border-navi-border text-navi-muted opacity-50',
              ].join(' ')}
            >
              <span>{step.icon}</span>
              <span>{step.label}</span>
              {done    && <span className="text-emerald-400">✓</span>}
              {current && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
            </div>
          )

          // 시뮬레이션은 링크로, 나머지는 그냥 표시
          if (step.type === 'simulate') {
            return (
              <Link key={step.key} href="/simulate">
                {inner}
              </Link>
            )
          }
          return inner
        })}
      </div>

      {/* 현재 단계 안내 */}
      {!allDone && currentIdx !== -1 && (
        <p className="text-[10px] text-navi-muted mt-1.5">
          다음 →{' '}
          <span className="text-indigo-400 font-medium">
            {STEPS[currentIdx].icon} {STEPS[currentIdx].desc}
          </span>
          {STEPS[currentIdx].type === 'indicator'
            ? ` — 아래 "${STEPS[currentIdx].label}" 버튼을 눌러보세요`
            : STEPS[currentIdx].type === 'drawing'
            ? ' — 작도 도구로 차트에 직접 그어보세요'
            : ' — 예측 시뮬레이션에 도전해보세요'}
        </p>
      )}
    </div>
  )
}
