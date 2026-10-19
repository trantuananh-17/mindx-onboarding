# Kế hoạch Week 2 — Ticket Manager CLI với TDD

## Trạng thái triển khai

Ticket Manager CLI đã có đủ bốn lệnh bắt buộc, lưu trữ JSON, unit test,
integration test và E2E test. CLI dùng TypeScript/Node.js thuần; không dùng Express,
Hono hoặc NestJS vì không chạy HTTP server.

### Yêu cầu môi trường

- Node.js 22.18 trở lên.
- pnpm 12.

### Cài đặt và kiểm tra

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
```

### Sử dụng

Lệnh `pnpm cli -- ...` tự build trước khi chạy. Dữ liệu mặc định được lưu tại
`data/tickets.json` trong thư mục hiện tại. Có thể đặt biến môi trường
`TICKETS_DATA_FILE` để chọn tệp khác.

```bash
pnpm cli -- create --title "Lỗi đăng nhập" --description "Không thể đăng nhập" --priority high --tags "auth,urgent"
pnpm cli -- list
pnpm cli -- list --status open --priority high --tag auth
pnpm cli -- show 1
pnpm cli -- update 1 --status in-progress
```

Quy ước:

- Kết quả thành công được in ra stdout và trả exit code `0`.
- Lỗi được in ra stderr và trả exit code `1`.
- Tệp chưa tồn tại được xem là danh sách rỗng.
- JSON hỏng bị từ chối và không bị ghi đè.

### Lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| `Title is required` | Title thiếu hoặc chỉ khoảng trắng | Truyền `--title` có nội dung |
| `Ticket #N not found` | ID không tồn tại | `list` để xem ID hiện có |
| `Ticket data contains invalid JSON` | Tệp dữ liệu hỏng | Sửa hoặc sao lưu tệp JSON thủ công; CLI không tự ghi đè |
| `Cannot write ticket data` | Không ghi được tệp (quyền, ổ đĩa) | Kiểm tra quyền thư mục/`TICKETS_DATA_FILE` |
| `No tickets found.` | Kho rỗng hoặc filter không khớp | Bình thường; exit code vẫn là `0` |

### Cấu trúc triển khai

```text
src/domain/       Kiểu dữ liệu, lỗi và validation
src/services/     Bốn use case nghiệp vụ
src/storage/      JSON repository
src/cli/          Parser command và entry point
tests/unit/       Test nghiệp vụ độc lập
tests/integration/Test storage và CLI kết hợp nhiều lớp
tests/e2e/        Test spawn tiến trình CLI thật
```

## 1. Mục tiêu

Week 2 chuyển phần thực hành nhỏ `addTicket` của Week 1 thành một Ticket Manager CLI
hoàn chỉnh ở mức nền tảng. Quá trình phát triển phải thể hiện rõ TDD, kiểm soát đầu ra
của AI và tách trách nhiệm giữa giao diện dòng lệnh, nghiệp vụ và lưu trữ JSON.

Kết thúc tuần, sản phẩm dự kiến hỗ trợ:

- Tạo ticket với tiêu đề, mô tả, trạng thái, độ ưu tiên và nhãn.
- Liệt kê ticket, có thể lọc theo trạng thái, độ ưu tiên hoặc nhãn.
- Xem chi tiết một ticket theo mã định danh.
- Cập nhật trạng thái của một ticket.
- Lưu và đọc dữ liệu từ tệp JSON cục bộ.
- Báo lỗi rõ ràng khi đầu vào không hợp lệ, không tìm thấy ticket hoặc tệp dữ liệu lỗi.

## 2. Căn cứ lập kế hoạch

Kế hoạch này được xây dựng sau khi đối chiếu:

- Kế hoạch gốc tại `docs/plans/week-2/overview.md`.
- Kết quả Week 1: nghiên cứu TDD và demo nhỏ cho hành vi `addTicket`.
- Yêu cầu đầu vào của Week 3: tiếp tục dùng cấu trúc phân lớp và TDD để tích hợp API.

## 3. Phạm vi

### Trong phạm vi

- Bốn lệnh: `tickets create`, `tickets list`, `tickets show <id>` và
  `tickets update <id>`.
- Mô hình ticket và các quy tắc kiểm tra dữ liệu.
- Kho lưu trữ JSON cục bộ.
- Unit test cho nghiệp vụ và validation.
- Integration test cho lưu trữ JSON và hành vi CLI.
- Ghi lại minh chứng Red–Green–Refactor.
- README hướng dẫn cài đặt, cấu hình và sử dụng khi triển khai.

### Ngoài phạm vi

- Giao diện web hoặc desktop.
- Đăng nhập, phân quyền và nhiều người dùng.
- Đồng bộ cloud, database hoặc Knowledge Base API.
- Xóa ticket, sửa toàn bộ nội dung ticket và lịch sử thay đổi.
- Tối ưu cho khối lượng dữ liệu lớn.

Các nội dung ngoài phạm vi được hoãn để giữ Week 2 tập trung vào TDD và nền tảng CLI.

## 4. Tài liệu kế hoạch

Đọc theo thứ tự sau:

1. [Yêu cầu và quy tắc nghiệp vụ](docs/01-yeu-cau.md)
2. [Kiến trúc dự kiến](docs/02-kien-truc.md)
3. [Kế hoạch kiểm thử](docs/03-ke-hoach-kiem-thu.md)
4. [Lịch thực hiện 5 ngày](docs/04-lich-thuc-hien.md)
5. [Mẫu nhật ký TDD](docs/05-mau-nhat-ky-tdd.md)
6. [Nhật ký TDD thực tế](docs/06-nhat-ky-tdd.md)

## 5. Chiến lược thực hiện

Mỗi hành vi được triển khai bằng một vòng lặp nhỏ:

1. Chọn đúng một hành vi có thể quan sát được.
2. Viết test mô tả hành vi và xác nhận test thất bại đúng lý do.
3. Viết phần triển khai nhỏ nhất để test qua.
4. Chạy lại toàn bộ test liên quan để ngăn regression.
5. Refactor khi tất cả test đang xanh.
6. Ghi lại bằng chứng vào nhật ký TDD.

Không triển khai đồng thời nhiều tính năng trong một vòng lặp. Không refactor khi test
đang đỏ.

## 6. Thứ tự ưu tiên

### Bắt buộc

- Bốn lệnh CLI hoạt động đúng.
- Quy tắc validation nhất quán.
- Dữ liệu tồn tại sau khi tiến trình kết thúc.
- Test bao phủ luồng thành công và các lỗi bắt buộc.
- Không làm mất hoặc ghi đè dữ liệu khi tệp JSON hỏng.
- Có hướng dẫn sử dụng và minh chứng TDD.

### Nên có nếu còn thời gian

- Ghi tệp an toàn qua tệp tạm rồi thay thế tệp chính.
- Kết quả `list` có thứ tự ổn định.
- Thông báo lỗi và mã thoát CLI nhất quán.
- Báo cáo coverage để tìm vùng chưa được kiểm thử; không dùng phần trăm coverage làm
  mục tiêu thay cho chất lượng assertion.

### Không làm trong tuần này

- Mở rộng tính năng chỉ để tăng số lượng lệnh.
- Tạo abstraction chưa có nhu cầu thực tế.
- Đưa framework lớn vào dự án khi thư viện nhỏ đã đủ.

## 7. Tiêu chí hoàn thành Week 2

- [x] Có minh chứng ít nhất một vòng Red–Green–Refactor cho từng nhóm tính năng chính
  (`docs/06-nhat-ky-tdd.md`).
- [x] `create`, `list`, `show` và `update` đáp ứng đặc tả đã chốt (`docs/01-yeu-cau.md`).
- [x] Unit test kiểm tra nghiệp vụ và validation (`tests/unit/`).
- [x] Integration test kiểm tra JSON storage và CLI từ đầu vào đến đầu ra
  (`tests/integration/`, `tests/e2e/`).
- [x] Có test cho đầu vào sai, ticket không tồn tại, tệp thiếu, tệp JSON hỏng và ghi
  thất bại (J05).
- [x] Tệp thiếu được xử lý như kho dữ liệu rỗng; tệp hỏng trả lỗi và được giữ nguyên.
- [x] Toàn bộ test và type-check đều qua (`pnpm test`: 42 passed; `pnpm typecheck`).
- [x] README triển khai mô tả cài đặt, cấu hình, lệnh sử dụng và lỗi thường gặp.
- [x] Có thể giải thích vì sao mỗi test tồn tại — xem ma trận `docs/03-ke-hoach-kiem-thu.md`
  và mô tả từng nhóm trong `tests/`.
- [x] Kiến trúc đủ rõ để Week 3 thay hoặc bổ sung nguồn dữ liệu mà không trộn logic API
  vào command handler (`docs/02-kien-truc.md`).

## 8. Nguyên tắc sử dụng AI

- Người thực hiện quyết định yêu cầu, ranh giới và tiêu chí chấp nhận trước khi hỏi AI.
- Yêu cầu AI giải thích giả định và các phương án, không chấp nhận đề xuất đầu tiên ngay.
- Chỉ giao một vòng TDD nhỏ trong mỗi yêu cầu.
- Luôn tự đọc diff, chạy test và kiểm tra hành vi CLI sau thay đổi do AI đề xuất.
- Test do AI tạo phải được kiểm tra assertion, trường hợp biên và khả năng báo lỗi giả.
- Không xem test xanh là bằng chứng cho hành vi chưa được test.

## 9. Kết quả bàn giao dự kiến

- Mã nguồn Ticket Manager CLI trong `week_2` khi giai đoạn triển khai bắt đầu.
- Bộ unit test và integration test.
- Tệp dữ liệu mẫu hoặc fixture chỉ phục vụ test.
- README hướng dẫn sử dụng.
- Nhật ký các vòng TDD và bảng đối chiếu tiêu chí chấp nhận.

Trạng thái hiện tại: Week 2 đã nghiệm thu ở mức nền tảng — bốn lệnh CLI, JSON storage,
42 test (unit + integration + E2E), type-check pass. Chi tiết TDD: `docs/06-nhat-ky-tdd.md`.
