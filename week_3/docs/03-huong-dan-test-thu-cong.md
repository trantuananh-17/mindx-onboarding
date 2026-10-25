# Hướng dẫn test thủ công (review Week 3)

Tài liệu này dùng khi review **không chỉ dựa vào CI**: chạy lệnh, quan sát stdout/stderr và exit code.

## Chuẩn bị

```bash
cd week_3
pnpm install
pnpm test
pnpm typecheck
pnpm build
```

Kỳ vọng: test automation pass, build không lỗi.

---

## A. Test tự động (smoke trước khi test tay)

```bash
pnpm test
```

Gồm unit (mock + HTTP client), integration (CLI mock + CLI HTTP + stub), E2E spawn tiến trình `kb` (mock).
Luồng HTTP qua tiến trình thật: mục C (stub + hai terminal); automation HTTP nằm ở `tests/integration/kb-cli-http.test.ts`.

---

## B. Mock client (mặc định, không cần server)

Không cần set env (hoặc `KB_CLIENT=mock`).

```bash
pnpm cli -- search "response" --top-k 3
```

**Kỳ vọng:** exit `0`, stdout có dòng chứa `doc-001` và `Customer Response Template`.

```bash
pnpm cli -- list --node /templates/email --limit 10
```

**Kỳ vọng:** exit `0`, có `doc-001`.

```bash
pnpm cli -- retrieve doc-001
```

**Kỳ vọng:** exit `0`, stdout có `Title: Customer Response Template` và nội dung email template.

```bash
pnpm cli -- add --file docs/06-nhat-ky-tdd.md --path /docs/guides --tags guide,review
```

**Kỳ vọng:** exit `0`, stdout dạng `Added document doc-00X: ...` (id tăng sau mỗi lần add trong cùng phiên mock — mock in-memory, restart CLI reset seed trừ khi dùng HTTP stub).

> **Lưu ý:** `MockKBClient` reset khi mỗi lần chạy tiến trình CLI mới. Muốn thấy document vừa `add` qua `list`, dùng **HTTP stub** (mục C) hoặc kiểm tra ngay stdout của lệnh `add`.

---

## C. HTTP client + stub cục bộ (mô phỏng API thật)

**Terminal 1** — bật stub:

```bash
cd week_3
pnpm stub
```

Ghi lại URL in ra, ví dụ `http://127.0.0.1:3928`.

**Terminal 2** — PowerShell:

```powershell
$env:KB_CLIENT = "http"
$env:KB_API_URL = "http://127.0.0.1:3928"
pnpm cli -- search "schedule" --top-k 5
pnpm cli -- list --node /team/devops --limit 5
pnpm cli -- retrieve doc-002
```

**Kỳ vọng:** exit `0`, kết quả giống mock (doc-002 = DevOps schedule).

**Add + list (stub giữ state trong một lần chạy stub):**

```powershell
pnpm cli -- add --file docs/02-kien-truc.md --path /docs/guides --title "Architecture note" --tags doc
pnpm cli -- list --node /docs/guides --limit 10
```

**Kỳ vọng:** lần list thấy document vừa thêm.

**curl (tùy chọn, kiểm contract HTTP):**

```powershell
curl -s -X POST http://127.0.0.1:3928/search -H "Content-Type: application/json" -d "{\"query\":\"response\",\"topK\":2}"
```

**Kỳ vọng:** JSON có `results` là mảng.

---

## D. Lỗi và exit code

```powershell
pnpm cli -- list
```

**Kỳ vọng:** exit `1`, stderr `node path is required`.

```powershell
$env:KB_CLIENT = "http"
Remove-Item Env:KB_API_URL -ErrorAction SilentlyContinue
pnpm cli -- search "test"
```

**Kỳ vọng:** exit `1`, stderr chứa `KB_API_URL is required`.

```powershell
$env:KB_API_URL = "http://127.0.0.1:3928"
pnpm cli -- retrieve doc-missing
```

**Kỳ vọng:** exit `1`, stderr chứa `not found` (stub/API trả 404).

---

## E. API production (khi có URL thật)

Thay URL stub bằng endpoint do team cung cấp:

```powershell
$env:KB_CLIENT = "http"
$env:KB_API_URL = "https://your-kb-server.example"
pnpm cli -- search "template" --top-k 5
```

Checklist review:

- [ ] Search trả kết quả use case thật (template / team / guide)
- [ ] List theo `nodePath` đúng
- [ ] Retrieve trả full content
- [ ] Add (nếu môi trường cho phép ghi) tạo document mới

Ghi lại URL và response mẫu (ẩn secret) vào báo cáo review nếu cần.

---

## F. Checklist acceptance Week 3

| Tiêu chí | Cách xác minh thủ công |
| --- | --- |
| CLI query KB (template, team, …) | Mục B hoặc C |
| Mock + HTTP, đổi bằng env | B vs C, và mục D |
| 4 lệnh E2E | search, list, retrieve, add trong B/C |
| Integration API documented | `02-kien-truc.md` + mục C/E tài liệu này |
