---
paths: ['packages/shared/supabase/admin*', 'packages/*/actions/admin*']
---

# Supabase 管理者クライアント使用規約

`createAdminClient`（`@todo-list-app/shared/supabase/admin`）は `SUPABASE_SERVICE_ROLE_KEY` を使用し、RLS を完全にバイパスする。

## 使用が許可される場所

- `packages/*/actions/admin*.ts`（管理者向け Server Action）
- `packages/feature-admin/` 配下のコード

## 使用が禁止される場所

- ブラウザ（クライアントコンポーネント）
- 一般ユーザー向け Server Action / Route Handler
- ミドルウェア

## 必須チェック

`createAdminClient` を使用する全ての関数は、呼び出し前に管理者認証を検証すること。
