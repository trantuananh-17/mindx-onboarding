# Unit Test, Integration Test và End-to-End Test

[← TDD và Red–Green–Refactor](01-tdd-and-red-green-refactor.md) · [Mục lục research](README.md) · [Tiếp: Test case CLI →](03-cli-test-cases.md)

## 3. So sánh Unit Test, Integration Test và End-to-End Test

Unit Test, Integration Test và End-to-End Test kiểm tra hệ thống ở các phạm vi khác nhau. Một dự án nên kết hợp cả ba loại thay vì chỉ sử dụng một loại duy nhất.

| Tiêu chí | Unit Test | Integration Test | End-to-End Test |
|---|---|---|---|
| Phạm vi | Một hàm, class hoặc module nhỏ | Nhiều module hoạt động cùng nhau | Toàn bộ hệ thống |
| Mục đích | Kiểm tra logic riêng lẻ | Kiểm tra sự kết nối giữa các thành phần | Kiểm tra luồng sử dụng thực tế |
| Phụ thuộc | Thường được mock hoặc thay thế | Có thể sử dụng file system hoặc database thật | Sử dụng hệ thống gần giống môi trường thật |
| Tốc độ | Nhanh nhất | Trung bình | Chậm nhất |
| Khả năng xác định lỗi | Dễ | Trung bình | Khó hơn |
| Độ tin cậy thực tế | Thấp hơn | Khá cao | Cao nhất đối với luồng được kiểm tra |
| Số lượng đề xuất | Nhiều | Vừa phải | Ít |

### 3.1 Unit Test

Unit Test kiểm tra một đơn vị code nhỏ trong trạng thái tương đối độc lập.

Một đơn vị có thể là:

- Một hàm
- Một class
- Một phương thức
- Một module nhỏ
- Một quy tắc nghiệp vụ

Ví dụ trong Ticket Manager:

- Kiểm tra hàm validation từ chối title rỗng
- Kiểm tra ticket mới có trạng thái `open`
- Kiểm tra hàm lọc ticket theo status
- Kiểm tra hàm cập nhật priority
- Kiểm tra hàm tạo ID
- Kiểm tra hàm chuyển ticket thành JSON

Ưu điểm:

- Chạy nhanh
- Dễ viết và chạy thường xuyên
- Dễ xác định vị trí lỗi
- Phù hợp để kiểm tra nhiều trường hợp biên
- Hỗ trợ tốt cho quá trình refactor

Hạn chế:

- Không xác nhận các module có tích hợp đúng hay không
- Không phát hiện được mọi lỗi liên quan đến file system hoặc database
- Có thể tạo cảm giác an toàn sai nếu sử dụng quá nhiều mock
- Dễ kiểm tra chi tiết triển khai thay vì hành vi

### 3.2 Integration Test

Integration Test kiểm tra sự kết hợp giữa nhiều thành phần.

Ví dụ trong Ticket Manager:

- Ticket service gọi repository để lưu ticket
- Repository ghi ticket vào file JSON
- Ticket được lưu rồi đọc lại chính xác
- Command parser chuyển arguments thành đúng dữ liệu đầu vào
- Chức năng update sửa đúng ticket trong file
- Chức năng delete không làm mất các ticket khác
- Chương trình xử lý đúng khi file JSON bị hỏng

Integration Test nên sử dụng thư mục hoặc file tạm. Điều này cho phép kiểm tra việc đọc và ghi file thật mà không ảnh hưởng đến dữ liệu của người dùng.

Ưu điểm:

- Phát hiện lỗi tại ranh giới giữa các module
- Kiểm tra được hành vi đọc và ghi dữ liệu thật
- Có độ tin cậy thực tế cao hơn Unit Test
- Phát hiện được lỗi serialization và cấu hình

Hạn chế:

- Chạy chậm hơn Unit Test
- Khó xác định nguyên nhân lỗi hơn
- Cần chuẩn bị và dọn dẹp dữ liệu test
- Có thể không ổn định nếu phụ thuộc môi trường bên ngoài

### 3.3 End-to-End Test

End-to-End Test kiểm tra toàn bộ chương trình từ góc nhìn của người dùng.

Test có thể chạy trực tiếp các command như:

- `ticket add --title "Login error"`
- `ticket list`
- `ticket show 1`
- `ticket close 1`
- `ticket delete 1`

End-to-End Test cần kiểm tra:

- Command có chạy thành công không
- Exit code có đúng không
- Nội dung được in ra `stdout`
- Thông báo lỗi được in ra `stderr`
- File dữ liệu có thay đổi đúng không
- Trạng thái cuối cùng của ticket có đúng không

Ví dụ một luồng End-to-End:

1. Người dùng tạo một ticket
2. Chương trình trả về exit code `0`
3. Output hiển thị ID của ticket mới
4. Người dùng chạy lệnh `list`
5. Ticket vừa tạo xuất hiện trong danh sách
6. Người dùng đóng ticket
7. Trạng thái ticket chuyển thành `closed`

Ưu điểm:

- Kiểm tra luồng thực tế của người dùng
- Kiểm tra được toàn bộ các lớp của ứng dụng
- Phát hiện lỗi cấu hình và tích hợp
- Tạo độ tin cậy cao cho các chức năng quan trọng

Hạn chế:

- Chạy chậm
- Khó debug khi test thất bại
- Có thể không ổn định nếu môi trường thay đổi
- Tốn công chuẩn bị và dọn dẹp dữ liệu
- Không phù hợp để kiểm tra tất cả trường hợp nhỏ

### 3.4 Khi nào sử dụng từng loại test?

Sử dụng Unit Test khi:

- Kiểm tra một quy tắc nghiệp vụ
- Kiểm tra validation
- Kiểm tra hàm chuyển đổi dữ liệu
- Cần kiểm tra nhiều trường hợp biên
- Muốn có phản hồi nhanh

Sử dụng Integration Test khi:

- Kiểm tra việc đọc và ghi file
- Kiểm tra service làm việc với repository
- Kiểm tra nhiều module kết hợp với nhau
- Kiểm tra serialization và dữ liệu lưu trữ

Sử dụng End-to-End Test khi:

- Kiểm tra một luồng nghiệp vụ quan trọng
- Kiểm tra chương trình từ command đến storage
- Kiểm tra output, error và exit code
- Xác nhận ứng dụng có thể được sử dụng thực tế

### 3.5 Chiến lược kiểm thử phù hợp

Một chiến lược hợp lý cho Ticket Manager CLI là:

- Nhiều Unit Test cho validation và logic nghiệp vụ
- Một lượng vừa phải Integration Test cho file storage và repository
- Một số ít End-to-End Test cho các luồng quan trọng

Ví dụ:

- Unit Test: title rỗng phải bị từ chối
- Integration Test: ticket được ghi và đọc lại từ file JSON
- End-to-End Test: người dùng tạo, xem và đóng ticket bằng command line
