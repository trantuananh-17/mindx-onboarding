# Lịch thực hiện 5 ngày

## Nguyên tắc lập lịch

- Mỗi ngày tạo ra một lát cắt chạy được và có thể kiểm chứng.
- Hoàn thành hành vi bắt buộc trước phần trình bày hoặc tiện ích bổ sung.
- Cuối mỗi ngày phải có test xanh, ghi chú TDD và danh sách việc còn lại.
- Nếu chậm tiến độ, giảm phần “nên có”; không bỏ test lỗi hoặc làm dồn TDD vào cuối.

## Ngày 1 — Chốt hợp đồng và nền tảng create

### Mục tiêu

Chốt các quyết định còn mở và hoàn thành nghiệp vụ tạo ticket ở cấp unit test.

### Công việc

- Đọc lại yêu cầu và xác nhận bốn câu hỏi mở trong tài liệu yêu cầu.
- Chọn thư viện CLI sau một so sánh ngắn; ghi lý do quyết định.
- Xác định model, giá trị mặc định và ranh giới repository.
- Thiết lập bộ khung dự án TypeScript/Vitest khi bắt đầu giai đoạn code.
- Thực hiện các vòng TDD cho create: title, description, priority, tags, ID và timestamp.
- Ghi bằng chứng Red–Green–Refactor đầu tiên.

### Đầu ra cuối ngày

- Đặc tả đã chốt, không còn mâu thuẫn.
- Nghiệp vụ create qua unit test.
- Danh sách quyết định kỹ thuật ngắn gọn.

### Điểm dừng

Không chuyển sang CLI nếu validation create chưa rõ hoặc test chưa độc lập.

## Ngày 2 — List, filter, show và update

### Mục tiêu

Hoàn thành toàn bộ nghiệp vụ cốt lõi độc lập với filesystem và CLI.

### Công việc

- TDD cho list không filter và thứ tự kết quả.
- TDD lần lượt cho status, priority, tag và kết hợp filter.
- TDD cho show: thành công, ID sai và not found.
- TDD cho update status: thành công, status sai và not found.
- Kiểm tra update không làm đổi các trường không liên quan.
- Refactor phần validation dùng chung sau khi test xanh.

### Đầu ra cuối ngày

- Bốn use case hoạt động với repository trong bộ nhớ.
- Unit test bao phủ luồng chính và trường hợp biên đã định nghĩa.
- Nhật ký TDD cập nhật đầy đủ.

### Điểm dừng

Không triển khai JSON storage nếu service vẫn chứa logic định dạng output hoặc truy cập
filesystem.

## Ngày 3 — JSON storage an toàn

### Mục tiêu

Đảm bảo dữ liệu tồn tại giữa các lần chạy và lỗi storage không gây mất dữ liệu.

### Công việc

- TDD/integration test cho tệp chưa tồn tại.
- TDD cho vòng ghi–đọc và nhiều lần ghi liên tiếp.
- Test JSON sai cú pháp và JSON sai cấu trúc.
- Test lỗi ghi ở mức khả thi trên môi trường chạy.
- Bổ sung cơ chế ghi an toàn qua tệp tạm nếu không làm tăng độ phức tạp quá mức.
- Kiểm tra mọi test dùng thư mục tạm riêng.

### Đầu ra cuối ngày

- JSON repository đáp ứng hợp đồng đã định nghĩa.
- Dữ liệu cũ được giữ sau thao tác ghi.
- Tệp hỏng tạo lỗi rõ ràng và không bị ghi đè.

### Điểm dừng

Không nối CLI vào repository nếu đường dẫn dữ liệu của test chưa tách khỏi dữ liệu dùng
thật.

## Ngày 4 — CLI và hành trình tích hợp

### Mục tiêu

Nối bốn lệnh với service/storage và kiểm chứng hành vi từ terminal.

### Công việc

- Tạo entry point và help text.
- Nối lần lượt create, list, show và update.
- Chuẩn hóa stdout, stderr và mã thoát.
- Viết integration test cho hành trình thành công của từng lệnh.
- Viết integration test cho lỗi đại diện: title sai, filter sai, not found và JSON hỏng.
- Chạy thủ công hành trình create → list → show → update → show.

### Đầu ra cuối ngày

- Bốn lệnh hoạt động end-to-end trên tệp JSON tạm.
- CLI test kiểm tra kết quả, lỗi và dữ liệu đã lưu.
- Không có stack trace ở lỗi người dùng thông thường.

### Điểm dừng

Không dành thời gian làm đẹp output nếu hành trình chính hoặc error case chưa ổn định.

## Ngày 5 — Refactor, tài liệu và nghiệm thu

### Mục tiêu

Đưa dự án về trạng thái có thể bàn giao, giải thích và tiếp tục ở Week 3.

### Công việc

- Chạy toàn bộ test và type-check từ môi trường sạch.
- Review duplication, tên gọi, ranh giới module và thông báo lỗi.
- Refactor từng bước nhỏ khi test đang xanh.
- Viết README: yêu cầu môi trường, cài đặt, cấu hình đường dẫn dữ liệu, ví dụ bốn lệnh,
  lỗi thường gặp và cách chạy kiểm tra.
- Hoàn thiện nhật ký TDD và bảng đối chiếu acceptance criteria.
- Tự demo và trả lời các câu hỏi: vì sao chọn test này, AI đã được kiểm chứng ra sao,
  unit/integration test khác nhau thế nào.

### Đầu ra cuối ngày

- Toàn bộ tiêu chí hoàn thành trong README được đánh dấu bằng bằng chứng cụ thể.
- Bộ test xanh và type-check qua.
- Tài liệu đủ để người khác cài đặt và dùng CLI.
- Danh sách giới hạn và công việc dành cho Week 3.

## Kế hoạch điều chỉnh khi thiếu thời gian

Giữ nguyên:

- Bốn lệnh bắt buộc.
- Validation và lỗi not found.
- Test tệp thiếu/hỏng.
- Unit test, integration test chính và tài liệu setup.

Cắt giảm theo thứ tự:

1. Báo cáo coverage.
2. Trang trí bảng output.
3. Ghi tệp atomic nếu môi trường khiến phần này quá tốn thời gian; phải ghi rõ rủi ro.
4. Các test trùng lặp cùng một quy tắc ở nhiều tầng.

Không cắt minh chứng Red–Green–Refactor hoặc dồn toàn bộ test sang cuối tuần.

## Nhịp kiểm tra hằng ngày

### Đầu buổi

- Chọn tối đa ba kết quả cần đạt.
- Chọn vòng TDD nhỏ đầu tiên.
- Xác nhận không có thay đổi ngoài phạm vi.

### Sau mỗi vòng TDD

- Ghi trạng thái đỏ và lý do thất bại.
- Ghi thay đổi nhỏ nhất để test xanh.
- Chạy regression liên quan.
- Chỉ refactor khi tất cả test xanh.

### Cuối buổi

- Chạy toàn bộ check hiện có.
- Cập nhật nhật ký và checklist.
- Ghi blocker, giả định và quyết định cần xác nhận vào ngày tiếp theo.
