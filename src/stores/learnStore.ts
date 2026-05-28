import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** 사용자의 학습 진행 상태를 영속 저장하는 스토어 */
interface LearnState {
  /** 한 번이라도 켜본 지표 슬러그 목록 (moving-average, bollinger, rsi, macd) */
  triedIndicators: string[]
  /** 작도 도구를 한 번이라도 사용했는지 */
  triedDrawing: boolean
  /** 시뮬레이션 예측 완료 횟수 */
  simCount: number

  markIndicator: (slug: string) => void
  markDrawing:   () => void
  markSim:       () => void
  reset:         () => void
}

export const useLearnStore = create<LearnState>()(
  persist(
    (set, get) => ({
      triedIndicators: [],
      triedDrawing:    false,
      simCount:        0,

      markIndicator: (slug) => {
        if (!get().triedIndicators.includes(slug)) {
          set({ triedIndicators: [...get().triedIndicators, slug] })
        }
      },
      markDrawing: () => set({ triedDrawing: true }),
      markSim:     () => set(s => ({ simCount: s.simCount + 1 })),
      reset:       () => set({ triedIndicators: [], triedDrawing: false, simCount: 0 }),
    }),
    { name: 'navi-learn-v1' }
  )
)
