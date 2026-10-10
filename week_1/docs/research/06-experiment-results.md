# Kết quả và bài học từ thực nghiệm `addTicket`

[← Thực nghiệm `addTicket`](05-add-ticket-experiment.md) · [Mục lục research](README.md) · [Tiếp: Lỗi testing phổ biến →](07-testing-pitfalls.md)

## 5.11.7 Tổng hợp các vòng Red–Green–Refactor

| Vòng | Trạng thái | Hoạt động | Kết quả |
|---|---|---|---|
| 1 | Red | Viết test tạo và lưu ticket | 1 test thất bại |
| 1 | Green | Viết implementation tối thiểu | 1 test thành công |
| Review | Phân tích | Phát hiện thiếu validation và trường hợp biên | Bổ sung 4 test |
| 2 | Red | Chạy test mới với implementation cũ | 3 thất bại, 2 thành công |
| 2 | Green | Thêm trim và validation | 5 test thành công |
| Refactor | Kiểm tra | Review cấu trúc và chạy type-check | Không có lỗi |

Luồng thực hiện:

```text
Viết test
    ↓
Test thất bại
    ↓
Viết implementation tối thiểu
    ↓
Test thành công
    ↓
Review code và yêu cầu
    ↓
Phát hiện trường hợp còn thiếu
    ↓
Bổ sung test
    ↓
Test thất bại
    ↓
Cải tiến implementation
    ↓
Toàn bộ test thành công
    ↓
Refactor và kiểm tra lại
```

---

## 5.11.8 Testing đã kiểm soát code AI như thế nào?

Qua thực nghiệm `addTicket`, Testing đã kiểm soát code AI theo các cách sau:

##### 1. Không để AI tự quyết định hành vi

Test được viết từ yêu cầu trước implementation. AI phải tạo code đáp ứng kết quả đã xác định, thay vì tự quyết định:

- Status mặc định.
- Cách xử lý title rỗng.
- Việc lưu ticket.
- Việc tạo ID.

##### 2. Giới hạn phạm vi thay đổi

AI chỉ cần triển khai function `addTicket`. Không cần thay đổi command parser, file storage hoặc cấu trúc toàn bộ project.

Điều này giúp hạn chế việc AI viết quá nhiều code hoặc thay đổi các phần không liên quan.

##### 3. Phát hiện trường hợp AI bỏ sót

Implementation đầu tiên vượt qua test cơ bản nhưng không xử lý title rỗng và khoảng trắng.

Các test bổ sung đã phát hiện những thiếu sót này trước khi code được chấp nhận.

##### 4. Kiểm tra side effect

Test không chỉ kiểm tra object được trả về mà còn kiểm tra:

- Ticket có được lưu hay không.
- Repository có bị thay đổi khi validation thất bại không.
- Ticket cũ có bị ghi đè không.

##### 5. Ngăn regression

Sau mỗi thay đổi, toàn bộ test được chạy lại.

Khi thêm validation, test tạo ticket ban đầu vẫn phải thành công. Điều này xác nhận chức năng mới không làm hỏng hành vi cũ.

##### 6. Tạo bằng chứng có thể chạy lại

Kết quả không chỉ dựa trên lời giải thích của AI. Người khác có thể tự chạy:

```bash
pnpm install
pnpm test
pnpm typecheck
```

Nếu implementation bị sửa sai, test sẽ thất bại và chỉ ra hành vi bị ảnh hưởng.

---

## 5.11.9 Bài học rút ra từ thực nghiệm

Qua quá trình Red–Green–Refactor với `addTicket`, tôi rút ra các bài học:

- Cần xác định hành vi trước khi yêu cầu AI viết code.
- Test phải thất bại đúng lý do trước khi viết implementation.
- Implementation đầu tiên chỉ nên đủ để test thành công.
- Test xanh không chứng minh code đã hoàn chỉnh.
- Cần review để tìm trường hợp biên mà AI bỏ sót.
- Khi phát hiện yêu cầu mới, cần viết test trước khi sửa code.
- Test phải kiểm tra cả kết quả trả về và trạng thái dữ liệu.
- Validation cần diễn ra trước khi tạo side effect.
- Sau mỗi thay đổi phải chạy lại toàn bộ test.
- Type-check hỗ trợ test nhưng không thay thế test hành vi.
- Con người vẫn chịu trách nhiệm xác định yêu cầu, review assertion và quyết định có chấp nhận code AI hay không.

Thực nghiệm cho thấy Testing không chỉ dùng để phát hiện lỗi sau khi code đã hoàn thành. Testing còn là công cụ định hướng và kiểm soát quá trình triển khai do AI hỗ trợ, từ lúc xác định yêu cầu đến khi review kết quả cuối cùng.
