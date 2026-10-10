# Solution Exploration: so sánh ít nhất hai hướng

[← Layered Questioning](01-layered-questioning.md) · [Mục lục workflow](README.md) · [Tiếp: Iterative Refinement →](03-iterative-refinement.md)

Trước khi thực hành, tôi cân nhắc hai hướng:

| Hướng | Ưu điểm | Nhược điểm |
|---|---|---|
| A. Làm CLI hoàn chỉnh, dùng file JSON và kiểm tra qua process | Gần trải nghiệm người dùng; có thể kiểm tra parser, `stdout`, `stderr`, exit code và persistence | Phạm vi lớn, setup chậm, lỗi khó cô lập; dễ biến bài nghiên cứu Week 1 thành bài xây sản phẩm |
| B. Thực nghiệm một use case `addTicket` với `InMemoryTicketRepository` | Nhỏ, chạy nhanh, dễ quan sát Red–Green–Refactor và side effect; phù hợp mục tiêu nghiên cứu | Chưa chứng minh command parser, file system và toàn bộ luồng CLI hoạt động |

Tôi chọn **hướng B** vì acceptance criteria của Week 1 tập trung vào nghiên cứu
TDD và cách làm việc với AI, không yêu cầu CLI hoàn chỉnh. Nhược điểm của hướng
B được ghi rõ thay vì bị che giấu: 5 Unit Test hiện tại không thay thế
Integration Test hoặc E2E Test cho một CLI thật.

Nếu chuyển sang giai đoạn xây CLI, tôi sẽ phân tầng như sau:

- **Unit Test** cho `validateTitle`, cấp ID và quy tắc đổi trạng thái vì đây là
  logic nhỏ, cần phản hồi nhanh và dễ cô lập.
- **Integration Test** cho `addTicket` kết hợp JSON repository trong thư mục tạm
  vì rủi ro nằm ở ranh giới serialize/ghi/đọc file và bảo toàn dữ liệu cũ.
- **E2E Test** cho một luồng quan trọng như
  `ticket add "Login error"` → `ticket list`: spawn CLI thật, kiểm tra `stdout`,
  `stderr`, exit code và file kết quả. E2E cho độ tin cậy cao nhất ở luồng này
  nhưng chậm và khó chẩn đoán hơn, nên chỉ dùng cho vài hành trình chính.

Đây cũng là lý do không chọn duy nhất một cấp test: mỗi cấp trả lời một loại câu
hỏi khác nhau.
