"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase/client";

/**
 * 데이터를 불러오고, 지정한 테이블이 바뀌면(상대방이 수정해도) 자동으로 다시 불러옵니다.
 * Supabase Realtime(postgres_changes) 구독을 사용합니다.
 */
export function useLive<T>(
  key: string,
  fetcher: () => Promise<T>,
  tables: string[],
): { data: T | undefined; error: string | null; loading: boolean; reload: () => Promise<void> } {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const reload = useCallback(async () => {
    try {
      const value = await fetcherRef.current();
      setData(value);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const tableKey = tables.join(",");
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load for this key
    setLoading(true);
    void reload();
    const sb = supabase();
    const channel = sb.channel(`live:${key}:${Math.random().toString(36).slice(2)}`);
    for (const table of tableKey.split(",").filter(Boolean)) {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, () => {
        if (cancelled) return;
        clearTimeout(timer);
        timer = setTimeout(() => void reload(), 250);
      });
    }
    // RLS 는 구독한 사용자 기준으로 이벤트를 걸러냅니다. 세션이 복원되기 전에 구독하면
    // 익명으로 붙어 이벤트를 하나도 못 받으므로, 토큰을 먼저 설정한 뒤 구독합니다.
    void sb.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      if (data.session) await sb.realtime.setAuth(data.session.access_token);
      // 구독이 연결되기 전에 생긴 변경을 놓치지 않도록 연결 직후 한 번 더 불러옴
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED" && !cancelled) void reload();
      });
    });
    // 탭을 다시 보거나 네트워크가 돌아오면 최신화 (모바일 백그라운드 복귀 등)
    const onWake = () => {
      if (document.visibilityState === "visible" && !cancelled) void reload();
    };
    document.addEventListener("visibilitychange", onWake);
    window.addEventListener("online", onWake);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onWake);
      window.removeEventListener("online", onWake);
      void sb.removeChannel(channel);
    };
  }, [key, tableKey, reload]);

  return { data, error, loading, reload };
}

/** PostgREST 응답에서 에러를 throw 로 바꿉니다. */
export function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}
