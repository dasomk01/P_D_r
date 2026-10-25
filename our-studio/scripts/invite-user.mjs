#!/usr/bin/env node
// 멤버 초대: auth 사용자 생성(또는 기존 사용자 사용) + members 등록.
// 사용법: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/invite-user.mjs <email> <password> <표시이름> [색상]
// 서비스 롤 키는 이 스크립트에서만 쓰고, 웹사이트 배포 환경변수에는 넣지 않습니다.
import { createClient } from "@supabase/supabase-js";

const [email, password, name, color = "#1b2540"] = process.argv.slice(2);
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!email || !password || !name || !url || !key) {
  console.error("usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/invite-user.mjs <email> <password> <name> [color]");
  process.exit(1);
}
const admin = createClient(url, key, { auth: { persistSession: false } });

let userId;
const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
if (created.error) {
  // 이미 있는 계정이면 찾아서 비밀번호만 갱신
  const { data: list, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!existing) throw created.error;
  userId = existing.id;
  await admin.auth.admin.updateUserById(userId, { password });
  console.log(`기존 계정 사용: ${email}`);
} else {
  userId = created.data.user.id;
  console.log(`계정 생성: ${email}`);
}

const { error } = await admin.from("members").upsert({ user_id: userId, display_name: name, color });
if (error) throw error;
console.log(`멤버 등록 완료: ${name} (${userId})`);
