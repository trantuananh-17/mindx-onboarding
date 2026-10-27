git push ỏ# Iterative Refinement: đề xuất → phản biện → chỉnh sửa → kiểm chứng

[← Solution Exploration](02-solution-exploration.md) · [Mục lục workflow](README.md) · [Evidence TDD →](../tdd-iterations.md)

Ví dụ phản biện cụ thể trong thực nghiệm `addTicket`:

1. **Đề xuất ban đầu của AI:** tạo ticket trực tiếp từ `input.title`, gán ID và
   status `open`, rồi lưu vào repository. Đề xuất được dùng làm implementation
   tối thiểu và vượt qua test happy path đầu tiên.
2. **Phản biện:** “Test xanh này chỉ chứng minh title hợp lệ. Điều gì xảy ra với
   `""`, `"   "`, khoảng trắng thừa, hoặc khi repository đã có ticket? Nếu lỗi
   xảy ra thì dữ liệu có bị thay đổi trước khi throw không?”
3. **Chỉnh sửa yêu cầu và test:** thêm các assertion cho title rỗng, title chỉ có
   khoảng trắng, chuẩn hóa title, ID duy nhất, không ghi đè và không tạo side
   effect khi validation thất bại. Implementation cũ cho kết quả
   `3 failed | 2 passed`, nên phản biện đã phát hiện lỗi thật chứ không chỉ thay
   đổi cách viết.
4. **Chỉnh sửa implementation:** trim title một lần, kiểm tra kết quả trước khi
   gọi `nextId()`/`save()`, rồi dùng title đã chuẩn hóa để tạo ticket.
5. **Kiểm chứng:** chạy lại toàn bộ suite đạt `5 passed`; chạy type-check không
   có lỗi; đọc lại code để xác nhận validation đứng trước side effect.

Bài học là không hỏi AI “có đúng không?” rồi chấp nhận câu trả lời tự xác nhận.
Tôi chuyển nghi ngờ thành ví dụ phản chứng và assertion có thể thất bại. Tuy
nhiên, kết quả 5/5 vẫn chỉ bảo đảm năm hành vi đang được test, không bảo đảm một
CLI hoàn chỉnh hay mọi trường hợp chưa được nghĩ tới.
