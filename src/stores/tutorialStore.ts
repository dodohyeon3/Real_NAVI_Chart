import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tutorialSteps } from '@/data/tutorialSteps'
import type { TutorialStep, CandleData } from '@/types'

interface TutorialState {
  isActive:         boolean
  currentIndex:     number
  hasCompletedOnce: boolean
  steps:            TutorialStep[]
  currentStep:      TutorialStep | null

  // ── 인터랙티브 상태 ──────────────────────────────────
  stepDone:       boolean                // 현재 단계 행동 완료 여부
  candleData:     CandleData | null      // candle-click 시 클릭된 캔들 데이터
  chosenJudgment: string | null          // judgment 선택값

  // ── 액션 ──────────────────────────────────────────────
  start:  () => void
  next:   () => void
  prev:   () => void
  skip:   () => void
  reset:  () => void

  markStepDone:      () => void
  notifyCandleClick: (data: CandleData) => void
  notifyJudgment:    (value: string)    => void
}

const INITIAL_ACTION_STATE = {
  stepDone:       false,
  candleData:     null,
  chosenJudgment: null,
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set, get) => ({
      isActive:         false,
      currentIndex:     0,
      hasCompletedOnce: false,
      steps:            tutorialSteps,
      currentStep:      null,
      ...INITIAL_ACTION_STATE,

      start: () =>
        set({
          isActive:     true,
          currentIndex: 0,
          currentStep:  tutorialSteps[0],
          ...INITIAL_ACTION_STATE,
        }),

      next: () => {
        const { currentIndex, steps } = get()
        const nextIndex = currentIndex + 1
        if (nextIndex >= steps.length) {
          set({ isActive: false, hasCompletedOnce: true, currentStep: null, ...INITIAL_ACTION_STATE })
        } else {
          set({ currentIndex: nextIndex, currentStep: steps[nextIndex], ...INITIAL_ACTION_STATE })
        }
      },

      prev: () => {
        const { currentIndex, steps } = get()
        const prevIndex = Math.max(0, currentIndex - 1)
        set({ currentIndex: prevIndex, currentStep: steps[prevIndex], ...INITIAL_ACTION_STATE })
      },

      skip: () =>
        set({ isActive: false, hasCompletedOnce: true, currentStep: null, ...INITIAL_ACTION_STATE }),

      reset: () =>
        set({ isActive: false, currentIndex: 0, currentStep: null, ...INITIAL_ACTION_STATE }),

      markStepDone: () => set({ stepDone: true }),

      notifyCandleClick: (data) => {
        const { isActive, currentStep } = get()
        if (isActive && currentStep?.actionRequired === 'candle-click') {
          set({ stepDone: true, candleData: data })
        }
      },

      notifyJudgment: (value) => {
        const { isActive, currentStep } = get()
        if (isActive && currentStep?.actionRequired === 'judgment') {
          set({ stepDone: true, chosenJudgment: value })
        }
      },
    }),
    {
      name: 'navi-tutorial',
      partialize: (state) => ({ hasCompletedOnce: state.hasCompletedOnce }),
    }
  )
)
