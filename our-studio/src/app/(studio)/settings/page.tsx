"use client";

import { useEffect, useState } from "react";
import JSZip from "jszip";
import { supabase } from "@/lib/supabase/client";
import { must } from "@/lib/live";
import { downloadBlob, saveBlob } from "@/lib/storage";
import { kstToday } from "@/lib/dates";
import type { Asset, ProjectId } from "@/lib/types";
import { useStudio } from "@/components/studio-context";
import { Button, Chip, ErrorNote, Field, PageHeader, SectionTitle, TagInput } from "@/components/ui";

const TABLES = [
  "members",
  "projects",
  "ideas",
  "idea_votes",
  "trips",
  "places",
  "place_research",
  "assets",
  "characters",
  "contents",
  "content_versions",
  "approvals",
  "comments",
  "ai_runs",
  "activity",
] as const;

export default function SettingsPage() {
  const { me, project, ai } = useStudio();
  const toon = project("med-toon");
  const [name, setName] = useState(me.display_name);
  const [color, setColor] = useState(me.color);
  const [terms, setTerms] = useState<string[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function exportJson() {
    setBusy("json");
    setError(null);
    try {
      const out: Record<string, unknown[]> = {};
      for (const t of TABLES) {
        const rows: unknown[] = [];
        for (let from = 0; ; from += 1000) {
          const page = must(await supabase().from(t).select("*").range(from, from + 999)) as unknown[];
          rows.push(...page);
          if (page.length < 1000) break;
        }
        out[t] = rows;
      }
      const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), app: "OUR STUDIO", tables: out }, null, 2)], {
        type: "application/json",
      });
      saveBlob(blob, `our-studio-backup-${kstToday()}.json`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  async function exportFiles(pid: ProjectId) {
    setBusy(pid);
    setError(null);
    try {
      const assets = must(await supabase().from("assets").select("*").eq("project_id", pid)) as Asset[];
      const zip = new JSZip();
      const manifest = ["file,original_name,kind,origin,usage_allowed,rights_holder,license,source_url,caption"];
      let i = 0;
      for (const a of assets) {
        setMsg(`${pid} 파일 ${++i}/${assets.length} 내려받는 중…`);
        zip.file(a.storage_path, await downloadBlob(a.storage_path));
        manifest.push(
          [a.storage_path, a.file_name, a.kind, a.origin, a.usage_allowed, a.rights_holder, a.license, a.source_url ?? "", a.caption]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(","),
        );
      }
      zip.file("manifest.csv", "﻿" + manifest.join("\n"));
      saveBlob(await zip.generateAsync({ type: "blob" }), `our-studio-files-${pid}-${kstToday()}.zip`);
      setMsg(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  const status: [string, boolean, string][] = [
    ["데이터베이스·로그인·파일 저장 (Supabase)", true, "연결됨 — 두 사람의 데이터가 실시간으로 동기화됩니다."],
    ["AI 기획·문구·조사 (Claude API)", ai.configured, ai.configured ? `연결됨 · ${ai.model}` : "ANTHROPIC_API_KEY 미설정 — 관련 버튼은 '연동 준비 중'으로 표시됩니다."],
    [
      "ChatGPT 연결 (MCP 커넥터)",
      ai.features.mcp,
      ai.features.mcp ? "준비됨 — 아래 주소로 ChatGPT 에 커넥터를 추가하세요." : "MCP_AUTH_SECRET, SUPABASE_SERVICE_ROLE_KEY 미설정",
    ],
    ["AI 이미지 생성", false, "연결된 서비스 없음 — 완성 이미지는 직접 업로드합니다."],
    ["자동 제작 스케줄 (ChatGPT 예약 연동)", false, "연결 안 됨 — 캘린더의 17:00/23:00 는 목표 시간 표시용입니다."],
    ["Instagram / Metricool 게시", false, "의도적으로 구현하지 않음 — ZIP 으로 내려받아 직접 게시합니다."],
  ];

  return (
    <div className="space-y-14">
      <PageHeader eyebrow="Settings" title="설정 · 백업" />

      <section className="max-w-xl space-y-4">
        <SectionTitle>내 프로필</SectionTitle>
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <Field label="표시 이름">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="색상">
            <input className="input !h-[42px] !w-16 !p-1" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </Field>
        </div>
        <Button
          size="sm"
          busy={busy === "profile"}
          onClick={async () => {
            setBusy("profile");
            const { error } = await supabase().from("members").update({ display_name: name, color }).eq("user_id", me.user_id);
            setBusy(null);
            if (error) setError(error.message);
            else setMsg("프로필을 저장했습니다.");
          }}
        >
          저장
        </Button>
        <p className="text-xs text-muted">비밀번호 변경이나 멤버 초대는 README 의 안내(Supabase 대시보드 / scripts/invite-user.mjs)를 따르세요.</p>
      </section>

      <section className="max-w-xl space-y-4">
        <SectionTitle>인스타툰 금지어 (실명 등)</SectionTitle>
        <p className="text-sm text-muted">
          공개 콘텐츠에 들어가면 안 되는 실명·학교명·별명 등을 등록하면 익명성 검수에서 경고합니다. 이 목록은 두 사람만 볼 수 있습니다.
        </p>
        <TagInput value={terms ?? toon?.settings.sensitive_terms ?? []} onChange={setTerms} placeholder="실명, 학교 이름…" />
        <Button
          size="sm"
          disabled={terms === null}
          onClick={async () => {
            const { error } = await supabase()
              .from("projects")
              .update({ settings: { ...toon!.settings, sensitive_terms: terms } })
              .eq("id", "med-toon");
            if (error) return setError(error.message);
            setTerms(null);
            setMsg("금지어를 저장했습니다.");
          }}
        >
          금지어 저장
        </Button>
      </section>

      <section className="space-y-4">
        <SectionTitle>연동 상태</SectionTitle>
        <ul className="divide-y hairline border-y hairline">
          {status.map(([k, on, d]) => (
            <li key={k} className="flex flex-col gap-1 py-3 md:flex-row md:items-center md:gap-4">
              <span className="w-80 shrink-0 text-sm">{k}</span>
              <Chip tone={on ? "ok" : "plain"}>{on ? "작동 중" : "연동 준비 중"}</Chip>
              <span className="text-xs text-muted">{d}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-2xl space-y-3">
        <SectionTitle>ChatGPT 에서 쓰기</SectionTitle>
        <p className="text-sm text-muted">
          ChatGPT → 설정 → 앱(Apps) → 고급 설정에서 개발자 모드를 켠 뒤, 새 앱(커넥터)을 만들고 아래 주소를 넣으세요. 인증은 OAuth 입니다. 연결하면 이
          사이트의 허용 화면이 뜨고, 허용하면 ChatGPT 가 아이디어·아카이브를 읽고 콘텐츠 <b>초안</b>을 제작실에 저장할 수 있습니다(승인·게시는 불가).
        </p>
        <McpUrl />
      </section>

      <section className="space-y-4">
        <SectionTitle>백업 · 내보내기</SectionTitle>
        <p className="text-sm text-muted">모든 데이터(아이디어·장소·후기·조사 자료·콘텐츠 버전·승인 이력·댓글)를 JSON 으로, 업로드한 원본 파일은 프로젝트별 ZIP(출처·권리 manifest 포함)으로 내려받습니다.</p>
        <div className="flex flex-wrap gap-2">
          <Button busy={busy === "json"} onClick={exportJson}>
            전체 데이터 JSON
          </Button>
          <Button variant="outline" busy={busy === "korea-trip"} onClick={() => exportFiles("korea-trip")}>
            KOREA TRIP 파일 ZIP
          </Button>
          <Button variant="outline" busy={busy === "med-toon"} onClick={() => exportFiles("med-toon")}>
            MED SCHOOL TOON 파일 ZIP
          </Button>
        </div>
      </section>
      {msg && <p className="text-sm text-ok">{msg}</p>}
      <ErrorNote error={error} />
    </div>
  );
}

function McpUrl() {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("/api/mcp");
  // eslint-disable-next-line react-hooks/set-state-in-effect -- origin is only known in the browser
  useEffect(() => setUrl(`${window.location.origin}/api/mcp`), []);
  return (
    <div className="flex gap-2">
      <input className="input" readOnly value={url} onFocus={(e) => e.target.select()} aria-label="MCP 주소" />
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
        }}
      >
        {copied ? "복사됨" : "복사"}
      </Button>
    </div>
  );
}
