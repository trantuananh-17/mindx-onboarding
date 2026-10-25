# Kiến trúc Week 3 — KB CLI

## Luồng tổng quan

```text
┌─────────────┐
│  kb CLI     │  parseArgs, stdout/stderr, exit code
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  KBClient   │  search, list, retrieve, add
└──────┬──────┘
       │
   ┌───┴───┐
   ▼       ▼
 Mock    HttpKBClient ──POST JSON──► KB API (stub hoặc server thật)
```

## Thư mục mã nguồn

| Thư mục | Trách nhiệm |
| --- | --- |
| `src/domain/` | `Document`, `SearchResult`, lỗi nghiệp vụ |
| `src/kb/` | Interface client, Mock, HTTP, factory env |
| `src/cli/` | Entry point và parser lệnh |
| `src/stub/` | KB API stub cục bộ (dev + test integration) |

## API contract (HTTP)

Tất cả endpoint dùng **POST** + `Content-Type: application/json`.

### Search

Request: `{ "query": "response", "topK": 5 }`  
Response: `{ "results": [ SearchResult | { id, title, nodePath, ... } ] }`

`HttpKBClient` chấp nhận cả kết quả đầy đủ (`document` + `matchType`) hoặc dạng rút gọn
theo plan (`id`, `title`, `nodePath`).

### List

Request: `{ "nodePath": "/templates/email", "limit": 10 }`  
Response: `{ "documents": [ Document, ... ] }`

### Retrieve

Request: `{ "docId": "doc-001" }`  
Response: `{ "document": Document }`  
Lỗi: `{ "error": "..." }` với HTTP 404 khi không tìm thấy.

### Add

Request: `{ "title", "content", "nodePath", "tags" }`  
Response: `{ "document": Document }`

## Biến môi trường

| Biến | Giá trị | Ý nghĩa |
| --- | --- | --- |
| `KB_CLIENT` | `mock` (mặc định) | Dùng `MockKBClient` |
| `KB_CLIENT` | `http` | Dùng `HttpKBClient` |
| `KB_API_URL` | URL gốc | Bắt buộc khi `KB_CLIENT=http` |
| `KB_STUB_PORT` | số port | Port cho `pnpm stub` (mặc định 3928) |

## Stub vs API production

- **Stub** (`pnpm stub`): triển khai contract trên, backend in-memory (`MockKBClient`).
  Dùng cho test tự động và review thủ công HTTP mà không cần server MindX.
- **API thật**: cùng contract; trỏ `KB_API_URL` tới endpoint do DevOps cung cấp.
