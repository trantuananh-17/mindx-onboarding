# Week 3 — Knowledge Base CLI

CLI truy vấn Knowledge Base qua **MockKBClient** (mặc định) hoặc **HttpKBClient** (HTTP JSON API).

Kế hoạch: [`docs/plans/week-3/overview.md`](../docs/plans/week-3/overview.md).

**Review thủ công:** [`docs/03-huong-dan-test-thu-cong.md`](docs/03-huong-dan-test-thu-cong.md).

## Yêu cầu

- Node.js 22+
- pnpm 12

## Cài đặt và kiểm tra

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
```

## Biến môi trường

Mẫu: [`.env.example`](.env.example). Tạo file local (không commit):

```powershell
Copy-Item .env.example .env
```

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `KB_CLIENT` | `mock` | `mock` hoặc `http` |
| `KB_API_URL` | — | URL gốc KB API; bắt buộc khi `KB_CLIENT=http` |
| `KB_STUB_PORT` | `3400` | Port cho `pnpm stub` |

CLI và stub đọc `.env` trong thư mục `week_3` khi khởi động. Biến đã set trong shell vẫn ưu tiên hơn file.

Ví dụ `.env` cho HTTP + stub:

```env
KB_CLIENT=http
KB_API_URL=http://127.0.0.1:3400
```

## Chạy CLI

Mock (development):

```bash
pnpm cli -- search "response" --top-k 3
pnpm cli -- list --node /templates/email --limit 10
pnpm cli -- retrieve doc-001
pnpm cli -- add --file ./note.md --path /templates/sms --tags sms
```

HTTP (stub local hoặc API thật):

```bash
# Terminal 1
pnpm stub

# Terminal 2 (PowerShell)
$env:KB_CLIENT = "http"
$env:KB_API_URL = "http://127.0.0.1:3928"
pnpm cli -- search "response"
```

## Cấu trúc

```text
src/domain/   Document, SearchResult, lỗi
src/kb/       KBClient, Mock, HTTP, factory
src/cli/      Parser và entry point
src/stub/     KB API stub (dev/test HTTP)
tests/        unit, integration, e2e
docs/         kiến trúc, test thủ công, TDD journal
```

Chi tiết kiến trúc: [`docs/02-kien-truc.md`](docs/02-kien-truc.md).

## Acceptance criteria

- [x] CLI query KB (template, team, guide) — mock + stub HTTP
- [x] Mock và HTTP client, đổi qua `KB_CLIENT` / `KB_API_URL`
- [x] 4 lệnh search, list, retrieve, add — test automation + hướng dẫn thủ công
- [x] Integration HTTP documented — stub + contract; API production qua mục E trong hướng dẫn test
