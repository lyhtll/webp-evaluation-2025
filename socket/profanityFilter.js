// socket/profanityFilter.js

// 욕설 및 비속어를 감지하고 순화하는 패턴 목록 (한글/영어 포함)
const profanityPatterns = [
  // 한글 욕설 패턴 및 순화 문구
  { pattern: /씨[\s\W_0-9]*발/gi, polite: '정말 너무 화가 나' },
  { pattern: /시[\s\W_0-9]*발/gi, polite: '정말 너무 화가 나' },
  { pattern: /병[\s\W_0-9]*신/gi, polite: '이상한 사람이야' },
  { pattern: /개[\s\W_0-9]*새[\s\W_0-9]*끼/gi, polite: '정말 나쁜 사람이야' },
  { pattern: /좆/gi, polite: '정말 불쾌해' },
  { pattern: /존[\s\W_0-9]*나/gi, polite: '엄청' },
  { pattern: /염[\s\W_0-9]*병/gi, polite: '정말 어이없다' },
  { pattern: /꺼[\s\W_0-9]*져/gi, polite: '나가주세요' },
  { pattern: /엿[\s\W_0-9]*먹/gi, polite: '기분 나쁘다' },
  // 영어 욕설 패턴 및 순화 문구
  { pattern: /\bfuck\b/gi, polite: "I really don't like you" },
  { pattern: /\bshit\b/gi, polite: "This is so bad" },
  { pattern: /\bbitch\b/gi, polite: "bad person" }
];

// 메시지에서 욕설을 감지하고 순화된 메시지로 변환하는 함수
export const processMessage = async (text) => {
  let hasProfanity = false; // 욕설 포함 여부
  let sanitized = text;     // 순화된 메시지(초기값은 원본)

  // 각 패턴에 대해 반복적으로 순화 적용
  profanityPatterns.forEach(({ pattern, polite }) => {
    let prev;
    do {
      prev = sanitized;
      sanitized = sanitized.replace(pattern, polite);
      if (prev !== sanitized) hasProfanity = true; // 순화 발생 시 true
    } while (prev !== sanitized);
  });

  // 결과 객체 반환
  return {
    hasProfanity,           // 욕설 포함 여부
    filteredText: sanitized, // 순화된 메시지
    originalText: text,      // 원본 메시지
    wasSanitized: hasProfanity, // 순화 여부
    reason: hasProfanity ? '키워드 순화' : '정상 메시지' // 사유
  };
}; 