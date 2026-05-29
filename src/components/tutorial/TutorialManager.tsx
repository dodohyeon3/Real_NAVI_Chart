'use client'

import { AnimatePresence } from 'framer-motion'
import { DarkOverlay } from './DarkOverlay'
import { TutorialStep } from './TutorialStep'
import { useTutorialStore } from '@/stores/tutorialStore'

export function TutorialManager() {
  const { isActive } = useTutorialStore()

  return (
    <AnimatePresence>
      {isActive && (
        <>
          <DarkOverlay />
          <TutorialStep />
        </>
      )}
    </AnimatePresence>
  )
}
