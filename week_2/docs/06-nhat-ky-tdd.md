# Nhật ký TDD thực tế

## Quyết định khởi tạo project

- Runtime: Node.js.
- Ngôn ngữ: TypeScript.
- Test runner: Vitest.
- Package manager: pnpm.
- Chưa dùng Express, Hono hoặc NestJS vì đây là ứng dụng CLI, còn ba lựa chọn đó phục vụ
  HTTP server. Việc thêm một HTTP framework ở Week 2 không hỗ trợ parse lệnh terminal và
  tạo dependency không cần thiết.
- Parser dự kiến: `node:util.parseArgs`; chưa cần thêm thư viện CLI ở vòng nghiệp vụ đầu
  tiên. Sẽ cân nhắc Commander hoặc CAC nếu phần subcommand/help trở nên phức tạp.

## Test doubles dùng chung

Các test doubles nằm tại `tests/helpers/ticket-test-doubles.ts`:

- `createMockTicketRepository`: repository trong bộ nhớ kết hợp spy cho `nextId`,
  `save`, `findById` và `findAll`; hỗ trợ kiểm tra trạng thái bằng `snapshot`.
- `createFixedClock`: trả thời gian cố định và cho phép kiểm tra số lần gọi.
- `createTicketFixture`: tạo dữ liệu ticket chuẩn, có thể override từng trường.
- `createMockCliIO`: spy cho stdout, stderr và exit code khi bắt đầu test command
  handler.

Không tạo mock filesystem. Theo kế hoạch kiểm thử, JSON repository phải được kiểm tra
trên thư mục tạm và tệp thật để tránh test xanh giả.

## Vòng TDD 01 — Tạo ticket với giá trị mặc định

**Ngày:** 2026-10-17  
**Yêu cầu liên quan:** C01 — tạo ticket tối thiểu chỉ với title  
**Cấp test:** Unit test

### 1. Mục tiêu hành vi

- Given: kho dữ liệu chưa có ticket, ID tiếp theo là `1` và thời gian được cố định.
- When: tạo ticket với title có khoảng trắng thừa.
- Then: title được chuẩn hóa; description, status, priority và tags nhận giá trị mặc
  định; timestamp đúng; ticket được lưu đúng một lần.

### 2. Red

- Test được thêm: `tạo và lưu ticket với các giá trị mặc định`.
- Lệnh kiểm tra: `pnpm test`.
- Kết quả: thất bại, exit code `1`.
- Lý do thất bại:

```text
Cannot find module '../../src/services/create-ticket'
```

- Vitest phát hiện một test file nhưng chưa chạy test case vì module implementation chưa
  tồn tại.
- Đây là bootstrap Red có chủ đích: test đã định nghĩa hợp đồng đầu tiên, còn production
  code chưa được tạo theo yêu cầu dừng trước Green.

### 3. Green

Implementation tối thiểu tạo ticket với ID, giá trị mặc định và timestamp cố định, sau
đó lưu qua repository. Kết quả: `1 passed`.

### 4. Refactor

Validation và chuẩn hóa được tách sang domain sau khi các test create đều xanh.

### 5. Bước tiếp theo khi được yêu cầu

Đã hoàn thành. Các vòng tiếp theo được tổng hợp bên dưới.

## Tổng hợp các vòng tiếp theo

| Vòng | Red đã quan sát | Green và regression |
| --- | --- | --- |
| Create happy path | `1 failed`: `Not implemented` | `1 passed` |
| Create validation và dữ liệu tùy chọn | `5 failed, 1 passed` | `6 passed` |
| Description tối đa và bảo toàn ticket cũ | `1 failed, 7 passed` | `8 passed` |
| List, show, update status | `12 failed, 8 passed` | `20 passed` |
| JSON repository | `5 failed, 20 passed` | `25 passed` |
| CLI parser và error boundary | `5 failed, 25 passed` | `30 passed` |
| Tiến trình CLI thật | `2 failed, 30 passed` | `32 passed` |
| Bổ sung ma trận L02–L06, J05, CLI lỗi show/update | (test mới trên code đã xanh) | `42 passed` |

## Lỗi được E2E phát hiện

Lần chạy E2E đầu tiên sau khi thêm entry point vẫn đỏ dù unit test, integration test và
type-check đều xanh. Node.js strip-only không hỗ trợ TypeScript constructor parameter
property trong JSON repository. Class được refactor sang khai báo property tường minh;
hành vi không đổi và toàn bộ `32/32` test qua sau sửa đổi.

Trường hợp này minh họa lý do Week 1 yêu cầu nhiều cấp kiểm thử: type-check và test gọi
module trực tiếp không thay thế được việc khởi chạy tiến trình người dùng thật.

## Phụ lục — Vòng TDD xác minh (tái hiện 2026-10-25)

Lịch sử Git Week 2 hiện gom toàn bộ triển khai trong commit `06b3158` (31 tệp). Phần
dưới tái hiện **một vòng Red → Green → Refactor** có thể kiểm chứng lại trên working tree,
không cần sửa lịch sử cũ. Vòng chọn: **từ chối title không có nội dung** (C03).

### Red — assertion thất bại do hành vi sai

**Cách tái hiện:** tạm thời bỏ `throw` trong `normalizeTitle` khi title rỗng (ví dụ trả
`"placeholder"`), rồi chạy:

```bash
pnpm exec vitest run tests/unit/create-ticket.test.ts -t "từ chối title không có nội dung" --reporter=verbose
```

**Log gốc (2026-10-25, exit code 1):**

```text
 × createTicket > từ chối title không có nội dung mà không thay đổi repository
   → expected [Function] to throw an error

AssertionError: expected [Function] to throw an error
 ❯ tests/unit/create-ticket.test.ts:35:64
     35|       expect(() => createTicket({ title }, repository, clock)).toThrow(
     36|         "Title is required",

 Test Files  1 failed (1)
      Tests  2 failed | 6 skipped (8)
```

Đây là Red do **assertion/hành vi**, không phải lỗi import hay cú pháp.

### Green — khôi phục validation tối thiểu

**Diff tối thiểu (khôi phục):**

```diff
   if (title.length === 0) {
-    return "placeholder";
+    throw new ValidationError("Title is required");
   }
```

**Log sau Green (exit code 0):**

```text
 ✓ createTicket > từ chối title không có nội dung mà không thay đổi repository
 Test Files  1 passed (1)
      Tests  2 passed | 6 skipped (8)
```

### Refactor — tách validation khỏi service

Sau khi các test create xanh, validation được gom vào `src/domain/validation.ts`; service
`create-ticket.ts` chỉ gọi `normalizeTitle`, `normalizeDescription`, `parsePriority`. Hành
vi công khai không đổi; regression: `pnpm test` (42 passed tại thời điểm review).

### Ghi chú Git (P3)

Các lần sau nên tách commit theo hành vi (`test` → `feat` → `refactor`) thay vì một commit
lớn. Skill commit repository đã bổ sung hướng dẫn ghi Red/Green/Refactor trong body khi
áp dụng TDD.
