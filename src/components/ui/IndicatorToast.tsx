'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastInfo {
  slug:    string
  icon:    string
  title:   string
  body:    string
  hint:    string
}

const TOAST_MAP: Record<string, Omit<ToastInfo, 'slug'>> = {
  'moving-average': {
    icon:  '📊',
    title: '이동평균선(MA) 켜짐',
    body:  '노란선(MA20)은 최근 20일 평균, 보라선(MA60)은 최근 60일 평균이에요.',
    hint:  '두 선이 교차하는 순간이 추세 전환 신호예요!',
  },
  'bollinger': {
    icon:  '〰️',
    title: '볼린저 밴드(BB) 켜짐',
    body:  '주가를 감싸는 상·하단 밴드가 생겼어요. 밴드 폭이 핵심이에요.',
    hint:  '밴드가 가장 좁아지는 구간을 찾아보세요 → 큰 움직임의 예고!',
  },
  'rsi': {
    icon:  '🌡️',
    title: 'RSI 켜짐',
    body:  '차트 아래 0~100 사이의 선이 과열 정도를 보여줘요.',
    hint:  '70 이상 = 과매수(빨간선) / 30 이하 = 과매도(초록선)',
  },
  'macd': {
    icon:  '🔄',
    title: 'MACD 켜짐',
    body:  '차트 아래에 파란선(MACD)과 주황선(시그널)이 나타났어요.',
    hint:  '파란선이 주황선을 위로 뚫으면 매수 신호 → 교차점을 찾아보세요!',
  },
}

interface Props {
  slug:    string | null   // null이면 표시 안 함
  onDone:  () => void
}

export function IndicatorToast({ slug, onDone }: Props) {
  const [visible, setVisible] = useState(false)
  const info = slug ? TOAST_MAP[slug] : null

  useEffect(() => {
    if (!slug || !info) return
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300) }, 5500)
    return () => clearTimeout(t)
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {visible && info && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          exit={{   opacity: 0, y: 16  }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]
                     w-[min(360px,calc(100vw-32px))]
                     bg-navi-surface border border-navi-border rounded-2xl
                     shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-4 py-3"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0 mt-0.5">{info.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-navi-text mb-0.5">{info.title}</p>
              <p className="text-[11px] text-navi-muted leading-relaxed">{info.body}</p>
              <p className="text-[11px] text-indigo-400 mt-1 font-medium">{info.hint}</p>
            </div>
            <button
              onClick={() => { setVisible(false); setTimeout(onDone, 300) }}
              className="text-navi-muted hover:text-navi-text text-[11px] shrink-0"
            >
              ✕
            </button>
          </div>
          {/* progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-indigo-500/50 rounded-b-2xl"
            initial={{ width: '100%' }}
            animate={{ width: '0%'   }}
            transition={{ duration: 5.5, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
