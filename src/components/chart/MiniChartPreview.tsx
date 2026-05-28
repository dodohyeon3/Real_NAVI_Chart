'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, CrosshairMode, type IChartApi, type Time } from 'lightweight-charts'
import { calcBollingerBands, calcMA, calcRSI, calcMACD } from '@/lib/indicators'
import type { IndicatorSlug, CandleData } from '@/types'

// ═══════════════════════════════════════════════════════════════
// 교육용 합성 데이터 생성기 — 결정론적(매번 동일한 차트)
// ═══════════════════════════════════════════════════════════════

/** 주말을 제외한 n개 거래일 날짜 배열 */
function workdayDates(start: string, count: number): string[] {
  const dates: string[] = []
  const d = new Date(start + 'T12:00:00Z')
  while (dates.length < count) {
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
      dates.push(d.toISOString().split('T')[0])
    d.setDate(d.getDate() + 1)
  }
  return dates
}

/** 결정론적 노이즈 [-1, 1] — 같은 seed → 항상 같은 값 */
function dn(seed: number): number {
  return Math.sin(seed * 127.1 + 31.7) * Math.cos(seed * 0.317 + 2.71)
}

const r2 = (v: number) => Math.round(v * 100) / 100

/**
 * 추세선 예시 데이터 (60봉)
 * - 봉당 +1pt 상승하는 명확한 추세선
 * - bars 3 · 19 · 37 · 54 에서 추세선을 정확히 터치 후 강하게 반등
 */
function makeTrendlineExample(): CandleData[] {
  const dates      = workdayDates('2024-01-02', 60)
  const T0         = 150
  const SLOPE      = 1.0
  const TOUCH_BARS = new Set([3, 19, 37, 54])

  return dates.map((time, i) => {
    const tl = T0 + i * SLOPE
    const n1 = dn(i * 3 + 1)
    const n2 = dn(i * 7 + 50)

    let open: number, close: number, high: number, low: number

    if (TOUCH_BARS.has(i)) {
      // 터치봉: 저점이 추세선에 닿고, 장대 양봉으로 강한 반등
      low   = r2(tl + 0.3)
      open  = r2(tl + 4  + Math.abs(n2) * 2)
      close = r2(tl + 15 + Math.abs(n1) * 5)
      high  = r2(close   + 3 + Math.abs(n2) * 2)
    } else {
      // 일반봉: 추세선 위에서 자연스러운 등락
      const bodyMid   = tl + 11 + n1 * 5
      const bodyRange = 3  + Math.abs(n2) * 2
      open  = r2(bodyMid + bodyRange * n2)
      close = r2(bodyMid - bodyRange * n1 * 0.6)
      high  = r2(Math.max(open, close) + 2 + Math.abs(n1) * 4)
      low   = r2(Math.max(Math.min(open, close) - 2 - Math.abs(n2) * 3, tl + 2.5))
    }

    return { time, open, high, low, close }
  })
}

/**
 * 피보나치 예시 데이터 (60봉)
 * - 0~24봉: BASE(150) → PEAK(240) 상승
 * - 25~43봉: PEAK → 61.8% 레벨(≈184) 되돌림
 * - 40~44봉: 61.8% 근처 횡보(지지 확인)
 * - 45~59봉: 반등
 */
function makeFibExample(): CandleData[] {
  const dates  = workdayDates('2024-01-02', 60)
  const BASE   = 150
  const PEAK   = 240
  const RANGE  = PEAK - BASE            // 90
  const FIB618 = PEAK - RANGE * 0.618   // ≈ 184.4

  return dates.map((time, i) => {
    const n1 = dn(i * 5 + 3)
    const n2 = dn(i * 11 + 77)

    let mid: number, spread: number

    if (i <= 24) {
      // 상승
      mid    = BASE + RANGE * (i / 24)
      spread = 5 + Math.abs(n1) * 3
    } else if (i <= 39) {
      // 되돌림 (61.8%를 향해)
      const t = (i - 25) / 14
      mid    = PEAK - (PEAK - FIB618) * t
      spread = 4 + Math.abs(n1) * 2
    } else if (i <= 44) {
      // 61.8% 횡보 (지지 구간)
      mid    = FIB618 + dn(i * 3 + 9) * 2.5
      spread = 3
    } else {
      // 반등
      const t = (i - 45) / 14
      mid    = FIB618 + (PEAK - 25 - FIB618) * t
      spread = 5 + Math.abs(n1) * 3
    }

    const open  = r2(mid + spread * n2)
    const close = r2(mid - spread * n1 * 0.5)
    const high  = r2(Math.max(open, close) + 2 + Math.abs(n1) * 2)
    const low   = r2(Math.min(open, close) - 2 - Math.abs(n2) * 2)
    return { time, open, high, low, close }
  })
}

// ═══════════════════════════════════════════════════════════════
const FIB_LEVELS = [
  { ratio: 0,     label: '0%',    color: '#94a3b8' },
  { ratio: 0.236, label: '23.6%', color: '#60a5fa' },
  { ratio: 0.382, label: '38.2%', color: '#34d399' },
  { ratio: 0.5,   label: '50%',   color: '#fbbf24' },
  { ratio: 0.618, label: '61.8%', color: '#f97316' },
  { ratio: 1,     label: '100%',  color: '#94a3b8' },
]

function makeChart(el: HTMLDivElement, height: number): IChartApi {
  return createChart(el, {
    layout: { background: { type: ColorType.Solid, color: '#0d1117' }, textColor: '#6b7280' },
    grid:   { vertLines: { color: '#161b22' }, horzLines: { color: '#161b22' } },
    crosshair:       { mode: CrosshairMode.Magnet },
    rightPriceScale: { borderColor: '#2a2a45', scaleMargins: { top: 0.08, bottom: 0.08 } },
    timeScale:       { borderColor: '#2a2a45', timeVisible: false, rightOffset: 3 },
    handleScroll: false,
    handleScale:  false,
    width:  el.clientWidth,
    height,
  })
}

interface Props { slug: IndicatorSlug }

export function MiniChartPreview({ slug }: Props) {
  const mainRef = useRef<HTMLDivElement>(null)
  const subRef  = useRef<HTMLDivElement>(null)
  const [data,    setData]    = useState<CandleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const needsSub = slug === 'rsi' || slug === 'macd'

  // ── 데이터 준비 ────────────────────────────────────────────
  useEffect(() => {
    // 추세선·피보나치: 교육용 합성 데이터 (API 불필요, 즉시 표시)
    if (slug === 'trendline') { setData(makeTrendlineExample()); setLoading(false); return }
    if (slug === 'fibonacci') { setData(makeFibExample());       setLoading(false); return }

    fetch('/api/candles?symbol=NVDA&period=1Y&timeUnit=daily')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [slug])

  // ── 차트 렌더 ──────────────────────────────────────────────
  useEffect(() => {
    if (!mainRef.current || data.length === 0) return

    const isMock  = slug === 'trendline' || slug === 'fibonacci'
    const preview = isMock
      ? data
      : slug === 'moving-average'
        ? data.slice(-200)
        : data.slice(-90)

    const mainHeight = needsSub ? 240 : 320
    const mainChart  = makeChart(mainRef.current, mainHeight)

    const candleSeries = mainChart.addCandlestickSeries({
      upColor: '#26a69a', downColor: '#ef5350',
      borderUpColor: '#26a69a', borderDownColor: '#ef5350',
      wickUpColor:   '#26a69a', wickDownColor:   '#ef5350',
    })
    candleSeries.setData(preview as any)

    // ── 볼린저 밴드 ──────────────────────────────────────────
    if (slug === 'bollinger') {
      const { upper, middle, lower } = calcBollingerBands(preview)
      ;[
        { d: upper,  color: '#60a5fa', dash: false },
        { d: middle, color: '#94a3b8', dash: true  },
        { d: lower,  color: '#60a5fa', dash: false },
      ].forEach(({ d, color, dash }) =>
        mainChart.addLineSeries({
          color, lineWidth: 1, lineStyle: dash ? 2 : 0,
          lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false,
        }).setData(d as any)
      )
    }

    // ── 이동평균선 ────────────────────────────────────────────
    if (slug === 'moving-average') {
      ;[
        { d: calcMA(preview, 5),   color: '#facc15' },
        { d: calcMA(preview, 20),  color: '#f97316' },
        { d: calcMA(preview, 60),  color: '#a78bfa' },
        { d: calcMA(preview, 120), color: '#f43f5e' },
      ].forEach(({ d, color }) =>
        mainChart.addLineSeries({
          color, lineWidth: 2,
          lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false,
        }).setData(d as any)
      )
      const ma5  = calcMA(preview, 5)
      const ma20 = calcMA(preview, 20)
      const markers: any[] = []
      for (let i = 1; i < Math.min(ma5.length, ma20.length); i++) {
        if (ma5[i-1].value < ma20[i-1].value && ma5[i].value >= ma20[i].value)
          markers.push({ time: ma5[i].time, position: 'belowBar', color: '#fbbf24', shape: 'arrowUp', text: '골든크로스' })
      }
      if (markers.length) candleSeries.setMarkers(markers.slice(-1) as any)
    }

    // ── 추세선 (합성 데이터) — 장기 상승 추세 ────────────────
    if (slug === 'trendline') {
      const T0 = 150, SLOPE = 1.0
      const last = preview.length - 1
      // 전체 차트 너비로 추세선 연장
      mainChart.addLineSeries({
        color: '#6c63ff', lineWidth: 2,
        lastValueVisible: false, priceLineVisible: false,
      }).setData([
        { time: preview[0].time,    value: T0 },
        { time: preview[last].time, value: T0 + last * SLOPE },
      ] as any)
      // 4번의 터치 포인트 마커
      candleSeries.setMarkers(
        [3, 19, 37, 54].map(b => ({
          time: preview[b].time, position: 'belowBar',
          color: '#6c63ff', shape: 'circle', size: 1.2, text: '지지',
        })) as any
      )
    }

    // ── 피보나치 (합성 데이터) — 61.8% 지지 반등 ────────────
    if (slug === 'fibonacci') {
      const BASE = 150, PEAK = 240, RANGE = 90
      const t0 = preview[0].time                as Time
      const t1 = preview[preview.length-1].time as Time

      FIB_LEVELS.forEach(({ ratio, label, color }) => {
        const value  = PEAK - RANGE * ratio
        const is618  = ratio === 0.618
        mainChart.addLineSeries({
          color,
          lineWidth: is618 ? 2 : 1,
          lineStyle: 2,
          title: label,
          lastValueVisible: true,
          priceLineVisible: false,
        }).setData([{ time: t0, value }, { time: t1, value }] as any)
      })
      // 61.8% 지지 확인 후 반등 화살표
      candleSeries.setMarkers([{
        time: preview[45].time, position: 'belowBar',
        color: '#f97316', shape: 'arrowUp', text: '61.8% 지지 → 반등',
      }] as any)
    }

    // ── 시간축 범위 설정 ──────────────────────────────────────
    if (slug === 'moving-average') {
      // 200일 계산, 최근 60일만 표시
      const from = preview[Math.max(0, preview.length - 60)].time as Time
      const to   = preview[preview.length - 1].time             as Time
      mainChart.timeScale().setVisibleRange({ from, to })
    } else {
      mainChart.timeScale().fitContent()
    }

    // ── 서브 차트 (RSI / MACD) ────────────────────────────────
    let subChart: IChartApi | null = null

    if (slug === 'rsi' && subRef.current) {
      subChart = makeChart(subRef.current, 130)
      const rsiData = calcRSI(preview)
      subChart.addLineSeries({ color: '#a78bfa', lineWidth: 2, lastValueVisible: true, priceLineVisible: false })
        .setData(rsiData as any)
      if (rsiData.length > 0) {
        const [t0, t1] = [rsiData[0].time, rsiData[rsiData.length-1].time]
        subChart.addLineSeries({ color: '#ef4444', lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false })
          .setData([{ time: t0, value: 70 }, { time: t1, value: 70 }] as any)
        subChart.addLineSeries({ color: '#22c55e', lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false })
          .setData([{ time: t0, value: 30 }, { time: t1, value: 30 }] as any)
      }
      subChart.timeScale().fitContent()
    }

    if (slug === 'macd' && subRef.current) {
      subChart = makeChart(subRef.current, 130)
      const md = calcMACD(preview)
      subChart.addHistogramSeries({ color: '#26a69a', lastValueVisible: false, priceLineVisible: false })
        .setData(md.filter(d => d.histogram !== null)
          .map(d => ({ time: d.time, value: d.histogram!, color: d.histogram! >= 0 ? '#26a69a' : '#ef5350' })) as any)
      subChart.addLineSeries({ color: '#60a5fa', lineWidth: 2, lastValueVisible: true, priceLineVisible: false })
        .setData(md.map(d => ({ time: d.time, value: d.macd })) as any)
      subChart.addLineSeries({ color: '#f97316', lineWidth: 1, lastValueVisible: true, priceLineVisible: false })
        .setData(md.filter(d => d.signal !== null).map(d => ({ time: d.time, value: d.signal! })) as any)
      subChart.timeScale().fitContent()
    }

    const onResize = () => {
      if (mainRef.current)               mainChart.applyOptions({ width: mainRef.current.clientWidth })
      if (subChart && subRef.current) subChart.applyOptions({ width: subRef.current.clientWidth })
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      mainChart.remove()
      subChart?.remove()
    }
  }, [data, slug, needsSub])

  // ── 범례 ───────────────────────────────────────────────────
  const legends: { color: string; label: string }[] = []
  if (slug === 'bollinger')
    legends.push({ color: '#60a5fa', label: '밴드' }, { color: '#94a3b8', label: '중심(MA20)' })
  if (slug === 'moving-average')
    legends.push(
      { color: '#facc15', label: 'MA 5' }, { color: '#f97316', label: 'MA 20' },
      { color: '#a78bfa', label: 'MA 60' }, { color: '#f43f5e', label: 'MA 120' },
    )
  if (slug === 'rsi')
    legends.push({ color: '#a78bfa', label: 'RSI(14)' }, { color: '#ef4444', label: '70' }, { color: '#22c55e', label: '30' })
  if (slug === 'macd')
    legends.push({ color: '#60a5fa', label: 'MACD' }, { color: '#f97316', label: '시그널' })
  if (slug === 'trendline')
    legends.push({ color: '#6c63ff', label: '상승 추세선' })
  if (slug === 'fibonacci')
    legends.push(
      { color: '#f97316', label: '61.8% ★ 지지' }, { color: '#fbbf24', label: '50%' },
      { color: '#34d399', label: '38.2%' },          { color: '#60a5fa', label: '23.6%' },
    )

  if (loading) return (
    <div className="w-full h-48 flex items-center justify-center rounded-xl bg-navi-bg">
      <div className="flex flex-col items-center gap-2">
        <div className="w-5 h-5 border-2 border-navi-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-navi-muted">차트 준비 중...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="w-full h-48 flex items-center justify-center rounded-xl bg-navi-bg">
      <p className="text-xs text-navi-muted">차트를 불러오지 못했어요</p>
    </div>
  )

  return (
    <div className="w-full space-y-1">
      {legends.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-2">
          {legends.map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-xs text-navi-muted">{l.label}</span>
            </div>
          ))}
        </div>
      )}
      <div ref={mainRef} className="w-full rounded-xl overflow-hidden" />
      {needsSub && <div ref={subRef} className="w-full rounded-xl overflow-hidden mt-0.5" />}
      <p className="text-right text-xs text-navi-border mt-1">
        {slug === 'trendline' || slug === 'fibonacci'
          ? '교육용 예시 데이터'
          : 'NVDA · 실제 데이터 최근 90일'}
      </p>
    </div>
  )
}
