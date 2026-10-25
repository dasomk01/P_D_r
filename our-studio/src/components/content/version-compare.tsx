"use client";

import { useState } from "react";
import { unitTexts } from "@/lib/content-template";
import { formatDateTime } from "@/lib/dates";
import type { Approval, Asset, ContentVersion } from "@/lib/types";
import { useStudio } from "../studio-context";
import { AssetImage } from "../asset-image";
import { Avatar, Chip } from "../ui";

export function VersionCompare({ versions, approvals, assets }: { versions: ContentVersion[]; approvals: Approval[]; assets: Map<string, Asset> }) {
  const { memberById } = useStudio();
  const [a, setA] = useState(versions[1]?.version_no ?? versions[0]?.version_no);
  const [b, setB] = useState(versions[0]?.version_no);
  const va = versions.find((v) => v.version_no === a);
  const vb = versions.find((v) => v.version_no === b);
  const ua = va ? unitTexts(va.data) : [];
  const ub = vb ? unitTexts(vb.data) : [];
  const rows = Math.max(ua.length, ub.length);

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">버전 이력</p>
        <ul className="divide-y hairline border-y hairline">
          {versions.map((v) => {
            const ap = approvals.find((x) => x.version_id === v.id);
            return (
              <li key={v.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                <span className="display w-10 text-xl text-navy">v{v.version_no}</span>
                <Avatar member={memberById(v.created_by)} size={18} />
                <span className="text-xs text-muted">{formatDateTime(v.created_at)}</span>
                <span className="flex-1 truncate">{v.change_note}</span>
                {v.locked && <Chip tone="navy">잠금</Chip>}
                {ap && (
                  <Chip tone="ok">
                    {memberById(ap.approved_by)?.display_name} 승인 · {formatDateTime(ap.approved_at)}
                  </Chip>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {versions.length > 1 && (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="eyebrow">버전 비교</p>
            <select className="input !w-auto" value={a} onChange={(e) => setA(Number(e.target.value))} aria-label="이전 버전">
              {versions.map((v) => (
                <option key={v.id} value={v.version_no}>
                  v{v.version_no}
                </option>
              ))}
            </select>
            <span className="text-muted">→</span>
            <select className="input !w-auto" value={b} onChange={(e) => setB(Number(e.target.value))} aria-label="비교할 버전">
              {versions.map((v) => (
                <option key={v.id} value={v.version_no}>
                  v{v.version_no}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            {Array.from({ length: rows }, (_, i) => {
              const x = ua[i];
              const y = ub[i];
              const changed = x?.text !== y?.text || x?.asset_id !== y?.asset_id;
              return (
                <div key={i} className={`grid gap-3 rounded-[3px] border p-3 md:grid-cols-[110px_1fr_1fr] ${changed ? "border-warn/40 bg-[#fbf3e8]" : "hairline"}`} data-testid="compare-row">
                  <div className="text-xs text-muted">
                    {(y ?? x)?.label}
                    {changed && <span className="mt-1 block text-warn">변경됨</span>}
                  </div>
                  {[x, y].map((u, k) => (
                    <div key={k} className="flex gap-2">
                      {u?.asset_id && assets.get(u.asset_id) && <AssetImage asset={assets.get(u.asset_id)!} className="ratio-45 w-12 shrink-0" />}
                      <p className="whitespace-pre-wrap text-sm">{u?.text || <span className="text-muted">—</span>}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
