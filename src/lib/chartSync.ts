/**
 * 메인 차트 ↔ 서브 차트(RSI, MACD) 타임스케일 동기화 모듈
 *
 * ※ 시간 기반(Time Range) 동기화 사용
 *    - LogicalRange(bar index) 기반 동기화는 RSI(14봉 후 시작) / MACD(26봉 후 시작) 처럼
 *      데이터 시작점이 서로 다를 때 날짜가 어긋남
 *    - Time Range 기반은 절대 날짜값으로 맞추므로 항상 정확하게 동기화됨
 *
 * 사용법:
 *   - 메인 차트 생성 후: chartSync.register(chart)
 *   - 서브 차트에서:    const unsub = chartSync.subscribe(range => subChart.timeScale().setVisibleRange(range))
 *   - 정리 시:         unsub() / chartSync.unregister()
 */

import type { IChartApi, Range, Time } from 'lightweight-charts'

type TimeRange    = Range<Time>
type RangeHandler = (range: TimeRange) => void

let _main: IChartApi | null = null
const _subs: RangeHandler[] = []

export const chartSync = {
  /** 메인 차트 등록 & 시간 범위 변경 감지 시작 */
  register(chart: IChartApi) {
    _main = chart
    chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
      if (!range) return
      _subs.forEach((fn) => {
        try { fn(range) } catch {}
      })
    })
  },

  /** 메인 차트 해제 */
  unregister() {
    _main = null
    _subs.length = 0
  },

  /**
   * 서브 차트 구독
   * - 등록 즉시 현재 메인 차트의 시간 범위를 적용
   * - 반환값(함수)을 호출하면 구독 해제
   */
  subscribe(fn: RangeHandler): () => void {
    _subs.push(fn)

    // 이미 메인 차트가 있다면 현재 시간 범위 즉시 동기화
    const current = _main?.timeScale().getVisibleRange()
    if (current) {
      try { fn(current) } catch {}
    }

    return () => {
      const idx = _subs.indexOf(fn)
      if (idx >= 0) _subs.splice(idx, 1)
    }
  },
}
