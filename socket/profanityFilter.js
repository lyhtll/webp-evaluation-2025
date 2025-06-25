// socket/profanityFilter.js

// 마스킹 기반 욕설 필터링 시스템
// - 자연스러운 ○ 마스킹 사용
// - 복합 욕설 우선 처리로 중복 방지
// - 단어 경계 체크로 오탐 방지

const profanityPatterns = [
  // === 한글 복합 욕설 (가장 구체적인 것부터 우선 처리) ===
  { pattern: /개새끼/gi, mask: '○○○' },
  { pattern: /개씨발/gi, mask: '○○○' },
  { pattern: /개시발/gi, mask: '○○○' },
  { pattern: /개좆/gi, mask: '○○' },

  // "존나" 계열 복합어
  { pattern: /존나게/gi, mask: '정말' },
  { pattern: /존나/gi, mask: '정말' },
  { pattern: /조나게?/gi, mask: '정말' },
  { pattern: /졲나/gi, mask: '정말' },

  // "좆" 계열 복합어
  { pattern: /좆같[다네아은]/gi, mask: '○○○' },
  { pattern: /좆됐[다네어은]/gi, mask: '○○○' },
  { pattern: /좆까/gi, mask: '○○' },
  { pattern: /좆(?![가-힣])/gi, mask: '○' }, // 단독 "좆" (뒤에 한글이 없을 때만)

  // === 한글 일반 욕설 ===
  { pattern: /씨발/gi, mask: '○○' },
  { pattern: /시발/gi, mask: '○○' },
  { pattern: /병신/gi, mask: '○○' },
  { pattern: /염병/gi, mask: '○○' },
  { pattern: /꺼져/gi, mask: '○○' },
  { pattern: /엿먹어/gi, mask: '○○○' },
  { pattern: /닥쳐/gi, mask: '○○' },
  { pattern: /빡쳐/gi, mask: '○○' },

  // === 영어 욕설 (단어 경계 사용) ===
  { pattern: /\bf+u+c+k+\b/gi, mask: 'f***' },
  { pattern: /\bs+h+i+t+\b/gi, mask: 's***' },
  { pattern: /\bb+i+t+c+h+\b/gi, mask: 'b****' },
  { pattern: /\ba+s+s+h+o+l+e+\b/gi, mask: 'a******' },
  { pattern: /\bd+a+m+n+\b/gi, mask: 'd***' }
];

// 마스킹 기반 메시지 처리 함수
export const processMessage = async (text) => {
  let hasProfanity = false;
  let processed = text;
  let detectedWords = [];

  // 패턴 순차 적용 (복합어 → 단독어 순서로 중복 방지)
  for (const { pattern, mask } of profanityPatterns) {
    const matches = processed.match(pattern);
    if (matches) {
      hasProfanity = true;
      // 중복 제거하여 감지된 단어 저장
      const uniqueMatches = [...new Set(matches)];
      detectedWords.push(...uniqueMatches);
      processed = processed.replace(pattern, mask);
    }
  }

  return {
    hasProfanity,
    filteredText: processed,
    originalText: text,
    wasSanitized: hasProfanity,
    detectedWords,
    reason: hasProfanity ? '욕설 마스킹 처리' : '정상 메시지'
  };
};

// 테스트 함수
export const testFilter = () => {
  const testCases = [
    "존나게시발",
    "엄청시발",
    "개새끼야",
    "이 게임 좆같네",
    "fuck this shit",
    "정말 미친 것 같아", // 정상 표현
    "개발자입니다" // 오탐 방지 테스트
  ];

  console.log("=== 마스킹 필터 테스트 ===");
  testCases.forEach(text => {
    const result = processMessage(text);
    console.log(`원본: "${result.originalText}"`);
    console.log(`결과: "${result.filteredText}"`);
    console.log(`감지: ${result.detectedWords.join(', ')}`);
    console.log('---');
  });
};