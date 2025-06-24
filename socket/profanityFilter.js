// socket/profanityFilter.js

// 완성형 욕설 + 변형만 필터 (자음/모음 조합 패턴 제거)
const profanityPatterns = [
  { pattern: /씨[\s\W_0-9]*발/gi, polite: '정말 너무 화가 나' },
  { pattern: /시[\s\W_0-9]*발/gi, polite: '정말 너무 화가 나' },
  { pattern: /병[\s\W_0-9]*신/gi, polite: '이상한 사람이야' },
  { pattern: /개[\s\W_0-9]*새[\s\W_0-9]*끼/gi, polite: '정말 나쁜 사람이야' },
  { pattern: /좆/gi, polite: '정말 불쾌해' },
  { pattern: /존[\s\W_0-9]*나/gi, polite: '엄청' },
  { pattern: /염[\s\W_0-9]*병/gi, polite: '정말 어이없다' },
  { pattern: /꺼[\s\W_0-9]*져/gi, polite: '나가주세요' },
  { pattern: /엿[\s\W_0-9]*먹/gi, polite: '기분 나쁘다' },
  // 영어
  { pattern: /\bfuck\b/gi, polite: "I really don't like you" },
  { pattern: /\bshit\b/gi, polite: "This is so bad" },
  { pattern: /\bbitch\b/gi, polite: "bad person" }
];

export const processMessage = async (text) => {
  let hasProfanity = false;
  let sanitized = text;

  profanityPatterns.forEach(({ pattern, polite }) => {
    let prev;
    do {
      prev = sanitized;
      sanitized = sanitized.replace(pattern, polite);
      if (prev !== sanitized) hasProfanity = true;
    } while (prev !== sanitized);
  });

  return {
    hasProfanity,
    filteredText: sanitized,
    originalText: text,
    wasSanitized: hasProfanity,
    reason: hasProfanity ? '키워드 순화' : '정상 메시지'
  };
}; 