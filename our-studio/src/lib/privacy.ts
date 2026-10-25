/**
 * 인스타툰 익명성 검수 (규칙 기반). 공개 콘텐츠에 실명·학교명·학번·구체적 날짜 등
 * 개인 식별 정보가 들어갔는지 찾습니다. AI 검수와 별개로 항상 동작합니다.
 */

export interface PrivacyFinding {
  kind: "sensitive_term" | "school" | "student_id" | "phone" | "email" | "exact_date" | "relationship_timeline";
  match: string;
  message: string;
}

const RULES: { kind: PrivacyFinding["kind"]; re: RegExp; message: string }[] = [
  { kind: "school", re: /[가-힣A-Za-z]{1,10}(의과대학|의대|대학교|대학병원|병원)(?![가-힣]*생)/g, message: "학교·병원 이름으로 보이는 표현" },
  { kind: "student_id", re: /\b(19|20)\d{6,8}\b/g, message: "학번으로 보이는 숫자" },
  { kind: "student_id", re: /\d{2}학번/g, message: "학번 표현" },
  { kind: "phone", re: /01[016789][-\s]?\d{3,4}[-\s]?\d{4}/g, message: "전화번호" },
  { kind: "email", re: /[\w.+-]+@[\w-]+\.[\w.]+/g, message: "이메일 주소" },
  { kind: "exact_date", re: /(19|20)\d{2}[.\-/년 ]\s?\d{1,2}[.\-/월 ]\s?\d{1,2}일?/g, message: "구체적인 날짜" },
  { kind: "relationship_timeline", re: /(사귄\s?지|연애\s?시작|처음\s?사귄|1일\s?된|100일)/g, message: "연애 시점을 드러낼 수 있는 표현" },
];

// '의대생', '의대 생활' 같은 일반 명사는 허용
const GENERIC_OK = /^(의과대학|의대|대학교|대학병원|병원)$/;

export function scanPrivacy(text: string, sensitiveTerms: string[] = []): PrivacyFinding[] {
  const findings: PrivacyFinding[] = [];
  const seen = new Set<string>();
  const push = (f: PrivacyFinding) => {
    const key = `${f.kind}:${f.match}`;
    if (!seen.has(key)) {
      seen.add(key);
      findings.push(f);
    }
  };

  for (const term of sensitiveTerms.map((t) => t.trim()).filter(Boolean)) {
    if (text.includes(term)) push({ kind: "sensitive_term", match: term, message: "등록된 금지어 (실명 등)" });
  }
  for (const rule of RULES) {
    for (const m of text.matchAll(rule.re)) {
      const match = m[0].trim();
      if (rule.kind === "school" && (GENERIC_OK.test(match) || /^(우리|같은|다른|본)/.test(match))) continue;
      push({ kind: rule.kind, match, message: rule.message });
    }
  }
  return findings;
}
