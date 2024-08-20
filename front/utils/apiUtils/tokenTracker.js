let totalTokensUsed = 0; // 누적 토큰 사용량
let isTrackingTokens = false; // 현재 토큰 사용량 추적 여부
let tokenUsageLog = []; // 개별 요청의 토큰 사용 기록

export function startTokenUsageTracking() {
    if (!isTrackingTokens) {
        isTrackingTokens = true;
        console.log("===== Starting Token Usage Tracking =====");
    }
}

export function endTokenUsageTracking() {
  isTrackingTokens = false;
  console.log("===== Token Usage Summary =====");
  console.log("Total tokens used in this session:", totalTokensUsed);
  console.log("===============================");
  return {
    totalTokens: totalTokensUsed, // 이번 세션 동안의 총 토큰 사용량 반환
    log: tokenUsageLog // 이번 세션의 사용 로그 반환
  };
}

export function trackTokenUsage(usage, question) {
  if (isTrackingTokens && usage) {
    totalTokensUsed += usage.total_tokens; // 누적 토큰 사용량 갱신
    tokenUsageLog.push({
      timestamp: new Date().toISOString(),
      question: question,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens
    });
    console.log("Token usage for this request:", usage);
    console.log("Total tokens used so far:", totalTokensUsed);
  }
}

export function isTracking() {
  return isTrackingTokens; // 현재 토큰 추적 여부 반환
}

export function getAccumulatedTokenUsage() {
  return totalTokensUsed; // 누적된 토큰 사용량 반환
}
