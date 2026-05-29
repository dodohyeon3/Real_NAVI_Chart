import type { TutorialStep } from '@/types'

export const tutorialSteps: TutorialStep[] = [

  // ══════════════════════════════════════════════════════════
  // STEP 1  캔들 직접 클릭 — "이 막대 하나가 하루예요"
  // ══════════════════════════════════════════════════════════
  {
    id:             'candle-click',
    targetSelector: '#chart-area',
    position:       'bottom',
    title:          '📊 이 막대 하나가 하루예요',
    body:           '초록 막대는 오른 날, 빨간 막대는 내린 날이에요. 막대의 길이가 그날의 가격 변동폭을 보여줘요.\n\n직접 클릭하면 그날의 시가·고가·저가·종가를 볼 수 있어요.',
    mission:        '아무 캔들이나 클릭해보세요 — 어떤 것을 눌러도 괜찮아요 🙂',
    actionRequired: 'candle-click',
    completionMessage: '이게 차트의 모든 정보가 담긴 단위예요. 이것만 알아도 차트의 절반은 읽은 거예요!',
  },

  // ══════════════════════════════════════════════════════════
  // STEP 2  MA 직접 켜기 — "평균선이 방향을 알려줘요"
  // ══════════════════════════════════════════════════════════
  {
    id:             'ma-toggle',
    targetSelector: '#btn-moving-average',
    position:       'right',
    title:          '📈 이동평균선(MA)을 켜봐요',
    body:           'MA는 "최근 N일 평균 가격"을 이은 선이에요. 선이 올라가면 평균 가격이 오르고 있다는 뜻이에요.\n\n캔들이 선 위에 있으면 지금 평균보다 비싸게 거래 중이에요.',
    mission:        'MA 버튼을 클릭해보세요 — 켜고 끄는 게 모두 안전해요',
    actionRequired: 'indicator-toggle',
    indicatorKey:   'moving-average',
    completionMessage: '4개의 선은 각각 5일·20일·60일·120일 평균이에요. 선들이 함께 위를 향하면 상승 추세 신호예요.',
  },

  // ══════════════════════════════════════════════════════════
  // STEP 3  추세 판단 — "스스로 느껴봐요"
  // ══════════════════════════════════════════════════════════
  {
    id:             'trend-judgment',
    targetSelector: '#chart-area',
    position:       'bottom',
    title:          '🤔 지금 이 차트, 어떻게 보여요?',
    body:           'MA 선들이 전체적으로 어느 방향인지 눈으로 느껴보세요. 정답이 없어요 — 내 눈에 어떻게 보이는지가 중요해요.',
    actionRequired: 'judgment',
    judgment: {
      question: '차트의 전반적인 흐름이 어떻게 보이나요?',
      choices: [
        {
          value:    'up',
          icon:     '📈',
          label:    '올라가는 것 같다',
          feedback: '좋아요! 이동평균선들이 함께 위를 향하면 상승 추세 신호예요. 주가가 선들 위에 있을수록 강한 상승 흐름이에요.',
        },
        {
          value:    'sideways',
          icon:     '➡️',
          label:    '잘 모르겠다',
          feedback: '솔직한 반응이에요! 이게 바로 차트 분석을 배우는 이유예요. RSI 같은 도구가 이 판단을 도와줄 수 있어요.',
        },
        {
          value:    'down',
          icon:     '📉',
          label:    '내려가는 것 같다',
          feedback: '그렇게 보일 수도 있어요! 어떤 기간을 보느냐에 따라 달라져요. 단기 하락도 장기 상승 추세 안에 있을 수 있어요.',
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════
  // STEP 4  RSI 직접 켜기 — "과열인지 침체인지"
  // ══════════════════════════════════════════════════════════
  {
    id:             'rsi-toggle',
    targetSelector: '#btn-rsi',
    position:       'right',
    title:          '🌡️ RSI — "지금 과열인가요?"',
    body:           'RSI는 0~100 사이 숫자로 주가가 얼마나 빠르게 움직이는지 보여줘요.\n\n• 70 이상 → 과매수(너무 많이 오름) → 조정 가능성\n• 30 이하 → 과매도(너무 많이 내림) → 반등 가능성',
    mission:        'RSI 버튼을 켜보세요 — 차트 아래에 새 그래프가 나타나요',
    actionRequired: 'indicator-toggle',
    indicatorKey:   'rsi',
    completionMessage: '보라색 선이 RSI예요. 빨간 선(70)과 초록 선(30) 사이에서 움직이는지 확인해봐요.',
  },

  // ══════════════════════════════════════════════════════════
  // STEP 5  RSI 읽기 판단 — "지금 어느 구간?"
  // ══════════════════════════════════════════════════════════
  {
    id:             'rsi-read',
    targetSelector: '#chart-area',
    position:       'bottom',
    title:          '🔍 RSI 선이 어디 있는지 찾아봐요',
    body:           'RSI 그래프에서 보라색 선의 현재 위치를 확인해보세요. 오른쪽 끝의 숫자를 보면 돼요.',
    actionRequired: 'judgment',
    judgment: {
      question: 'RSI 선이 지금 어느 구간에 있나요?',
      choices: [
        {
          value:    'overbought',
          icon:     '🔴',
          label:    '70 근처 또는 위 (과열)',
          feedback: '과매수 구간이에요! 가격이 단기간에 너무 많이 올랐다는 신호예요. 강한 상승장에선 오래 머물기도 해요. 다른 지표와 같이 봐야 해요.',
        },
        {
          value:    'neutral',
          icon:     '⚪',
          label:    '30~70 사이 (중립)',
          feedback: '중립 구간이에요. 방향을 확신하기 어려운 시점이에요. MA와 함께 보면 추세를 더 잘 파악할 수 있어요.',
        },
        {
          value:    'oversold',
          icon:     '🟢',
          label:    '30 근처 또는 아래 (침체)',
          feedback: '과매도 구간이에요! 가격이 단기간에 너무 많이 내렸다는 신호예요. 반등 가능성이 있지만, 하락 추세가 강할 땐 계속 떨어지기도 해요.',
        },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════
  // STEP 6  완료 + 시뮬레이션 연결
  // ══════════════════════════════════════════════════════════
  {
    id:             'simulate-cta',
    targetSelector: '#simulate-link',
    position:       'bottom',
    title:          '🎉 차트를 이미 읽고 있어요!',
    body:           '방금 실제 차트를 직접 만지고, 지표를 켜고, 직접 판단까지 해봤어요.\n\n이제 과거 NVDA 데이터를 보고 미래를 직접 예측해볼 수 있어요. 틀려도 괜찮아요 — 결과를 보며 배우는 게 진짜 공부예요.',
    tips: [
      '예측 시점 이후 30일이 숨겨져 있어요',
      'MA, RSI를 켜고 분석한 뒤 예측해봐요',
      '결과를 보며 왜 틀렸는지 확인하는 게 핵심이에요',
    ],
    actionRequired: 'free',
  },
]
