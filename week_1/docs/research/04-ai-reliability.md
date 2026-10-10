# Testing kiểm soát code do AI tạo ra

[← Test case CLI](03-cli-test-cases.md) · [Mục lục research](README.md) · [Tiếp: Thực nghiệm `addTicket` →](05-add-ticket-experiment.md)

## 5. Cách Testing kiểm soát code do AI tạo ra

AI có thể tạo code nhanh, nhưng không đảm bảo code luôn đúng với yêu cầu. Code do AI tạo ra có thể chạy được nhưng vẫn sai logic nghiệp vụ, thiếu trường hợp biên hoặc làm hỏng chức năng cũ.

Testing đóng vai trò như một hàng rào kiểm soát. Nó giúp xác minh code do AI tạo ra có thực sự đáp ứng các hành vi đã được xác định hay không.

### 5.1 Những rủi ro khi sử dụng code do AI tạo ra

AI có thể tạo ra code với các vấn đề sau:

- Hiểu sai hoặc hiểu thiếu yêu cầu.
- Tự đưa ra giả định mà người dùng không yêu cầu.
- Chỉ xử lý trường hợp thành công.
- Bỏ sót trường hợp biên.
- Xử lý lỗi không đầy đủ.
- Sử dụng API hoặc thư viện không tồn tại.
- Thay đổi code ngoài phạm vi được giao.
- Làm hỏng chức năng đang hoạt động.
- Tạo code quá phức tạp.
- Tạo lỗ hổng bảo mật.
- Viết test chỉ để phù hợp với implementation hiện tại.
- Khẳng định code đúng mà chưa thực sự chạy kiểm tra.

Ví dụ, khi được yêu cầu viết chức năng xóa ticket, AI có thể tạo code xóa đúng ticket nhưng vô tình ghi đè hoặc làm mất các ticket còn lại.

Nếu chỉ kiểm tra ticket cần xóa đã biến mất, lỗi này có thể không được phát hiện. Cần kiểm tra thêm rằng những ticket khác vẫn được giữ nguyên.

### 5.2 Test biến yêu cầu thành tiêu chí có thể kiểm chứng

Một yêu cầu viết bằng ngôn ngữ tự nhiên có thể được hiểu theo nhiều cách.

Ví dụ:

> Hệ thống phải cho phép người dùng tạo ticket.

Yêu cầu này chưa nói rõ:

- Title có bắt buộc không?
- Status mặc định là gì?
- ID được tạo như thế nào?
- Ticket được lưu ở đâu?
- Điều gì xảy ra khi title rỗng?
- Command thành công trả exit code nào?

Khi chuyển yêu cầu thành test case, hành vi mong muốn trở nên cụ thể hơn:

- Title hợp lệ tạo được ticket.
- Ticket mới có ID duy nhất.
- Status mặc định là `open`.
- Ticket được lưu vào storage.
- Title rỗng bị từ chối.
- Command thành công trả exit code `0`.
- Command thất bại trả exit code khác `0`.

AI phải triển khai code đáp ứng các điều kiện cụ thể này thay vì tự suy đoán yêu cầu.

### 5.3 Kiểm soát phạm vi triển khai của AI

Trước khi yêu cầu AI viết code, nên xác định test và phạm vi thay đổi.

Ví dụ:

> Chỉ triển khai chức năng kiểm tra title rỗng. Không thay đổi repository, command parser hoặc cấu trúc dữ liệu ticket.

Test liên quan chỉ cần xác nhận:

- Title rỗng bị từ chối.
- Title chỉ có khoảng trắng bị từ chối.
- Title hợp lệ được chấp nhận.
- Các test cũ vẫn thành công.

Nếu AI thay đổi những phần không liên quan và làm test cũ thất bại, thay đổi đó không nên được chấp nhận.

Cách này giúp tránh việc AI:

- Viết quá nhiều code.
- Thay đổi kiến trúc không cần thiết.
- Thêm tính năng ngoài yêu cầu.
- Làm hỏng hành vi đang hoạt động.

### 5.4 Sử dụng TDD với AI

Quy trình TDD khi sử dụng AI có thể thực hiện như sau:

1. Con người xác định một yêu cầu nhỏ.
2. Viết acceptance criteria cho yêu cầu.
3. Chuyển acceptance criteria thành test.
4. Chạy test và xác nhận trạng thái Red.
5. Yêu cầu AI đề xuất implementation tối thiểu.
6. Review code do AI tạo ra.
7. Chạy test để kiểm tra trạng thái Green.
8. Bổ sung test cho các trường hợp biên.
9. Refactor nếu cần thiết.
10. Chạy lại toàn bộ test để phát hiện regression.

Con người phải giữ quyền quyết định đối với:

- Yêu cầu nghiệp vụ.
- Kết quả mong đợi.
- Acceptance criteria.
- Test case quan trọng.
- Phạm vi thay đổi.
- Quyết định chấp nhận hoặc từ chối code.

AI có thể hỗ trợ:

- Đề xuất test case.
- Tìm trường hợp biên.
- Viết test ban đầu.
- Đề xuất implementation.
- Giải thích nguyên nhân test thất bại.
- Đề xuất refactor.
- Tìm code trùng lặp.

### 5.5 Kiểm tra code AI bằng nhiều cấp độ test

Không nên chỉ sử dụng một loại test để kiểm tra code AI.

#### Unit Test

Unit Test kiểm tra logic nhỏ do AI tạo ra, chẳng hạn:

- Validation title.
- Tạo ID.
- Chuyển trạng thái ticket.
- Lọc ticket.
- Kiểm tra priority.

Unit Test giúp phát hiện nhanh lỗi logic và trường hợp biên.

#### Integration Test

Integration Test kiểm tra các module do AI tạo ra có làm việc đúng với nhau hay không.

Ví dụ:

- Service có gọi đúng repository không.
- Repository có ghi đúng file JSON không.
- Dữ liệu có được đọc lại chính xác không.
- Cập nhật một ticket có giữ nguyên các ticket khác không.

#### End-to-End Test

End-to-End Test kiểm tra code AI từ góc nhìn người dùng.

Ví dụ:

- Người dùng chạy command `add`.
- CLI trả exit code `0`.
- Output hiển thị ID của ticket mới.
- Ticket được lưu vào file.
- Command `list` hiển thị ticket vừa tạo.

Sự kết hợp của ba cấp độ test tạo ra độ tin cậy cao hơn so với chỉ kiểm tra từng hàm riêng lẻ.

### 5.6 Sử dụng Regression Test

Regression Test là các test xác nhận chức năng cũ vẫn hoạt động sau khi có thay đổi mới.

Ví dụ, AI được yêu cầu thêm chức năng `close ticket`. Sau khi triển khai, cần chạy lại các test của:

- `add`.
- `list`.
- `show`.
- `update`.
- `delete`.
- File storage.
- Error handling.

Nếu test của chức năng cũ thất bại, code mới có thể đã tạo ra regression.

Mỗi khi phát hiện một bug, nên thêm một test mô tả bug đó trước khi sửa. Test này ngăn cùng một lỗi xuất hiện trở lại trong tương lai.

### 5.7 Kiểm tra trường hợp thành công và thất bại

AI thường tập trung vào luồng thành công. Vì vậy, test cần bao gồm cả hai nhóm.

Trường hợp thành công:

- Tạo ticket với dữ liệu hợp lệ.
- Cập nhật ticket đang tồn tại.
- Đóng ticket có trạng thái `open`.
- Đọc file JSON hợp lệ.

Trường hợp thất bại:

- Title rỗng.
- ID sai định dạng.
- Ticket không tồn tại.
- Status không hợp lệ.
- File JSON bị hỏng.
- Không có quyền ghi file.
- Command không tồn tại.

Test trường hợp thất bại giúp xác nhận code AI xử lý lỗi có kiểm soát và không làm hỏng dữ liệu.

### 5.8 Test phải kiểm tra trạng thái dữ liệu

Không nên chỉ kiểm tra thông báo mà AI trả về.

Ví dụ, command có thể in:

> Ticket deleted successfully.

Nhưng ticket vẫn còn trong file hoặc toàn bộ file đã bị xóa.

Một test đầy đủ cho thao tác xóa cần xác nhận:

- Command trả exit code `0`.
- Output thông báo thành công.
- Ticket mục tiêu không còn trong storage.
- Các ticket khác vẫn tồn tại.
- File vẫn có cấu trúc hợp lệ.

Điều này ngăn AI viết code chỉ tạo output đúng nhưng không thực hiện đúng nghiệp vụ.

### 5.9 Test không thay thế việc review code

Test thành công không chứng minh code hoàn toàn đúng. Code vẫn có thể chứa lỗi nếu test chưa bao phủ yêu cầu quan trọng.

Ngoài việc chạy test, cần review:

- AI có hiểu đúng yêu cầu không?
- Code có thay đổi ngoài phạm vi không?
- Có logic trùng lặp không?
- Có dữ liệu nhạy cảm được ghi log không?
- Có xử lý lỗi đầy đủ không?
- Có sử dụng API thực sự tồn tại không?
- Code có dễ đọc và bảo trì không?
- Các test có kiểm tra đúng hành vi không?

Không nên cho AI tự viết implementation, tự viết test rồi tự kết luận rằng kết quả đã đúng mà không có sự đánh giá của con người.

### 5.10 Ví dụ kiểm soát một chức năng do AI tạo ra

Yêu cầu:

> AI triển khai chức năng xóa ticket theo ID.

Các test cần có:

- Xóa thành công ticket tồn tại.
- Ticket bị xóa không còn trong storage.
- Các ticket khác vẫn tồn tại.
- Xóa ID không tồn tại phải báo lỗi.
- Xóa ID không hợp lệ phải báo lỗi.
- Khi xóa thất bại, storage không thay đổi.
- File JSON vẫn hợp lệ sau khi xóa.
- Command thành công trả exit code `0`.
- Command thất bại trả exit code khác `0`.

Sau khi AI tạo code:

1. Review phạm vi thay đổi.
2. Chạy toàn bộ test.
3. Kiểm tra kết quả trong file.
4. Bổ sung test nếu phát hiện trường hợp bị bỏ sót.
5. Chỉ chấp nhận code khi hành vi đúng và không tạo regression.

Phần áp dụng cụ thể được trình bày trong
[thực nghiệm `addTicket`](05-add-ticket-experiment.md).
