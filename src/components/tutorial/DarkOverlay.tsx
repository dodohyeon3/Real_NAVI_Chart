'use client'

import { motion } from 'framer-motion'

/**
 * 튜토리얼 배경 딤 레이어
 * pointer-events: none → 사용자가 차트·버튼을 자유롭게 클릭할 수 있음
 * (액션 기반 튜토리얼에서는 실제 UI 조작이 필요하므로 클릭을 가로채지 않음)
 */
export function DarkOverlay() {
  return (
    <motion.div
      key="dark-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/25 z-40 pointer-events-none"
    />
  )
}
