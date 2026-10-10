# Các bài kiểm thử cho Ticket Manager CLI

[← Các cấp kiểm thử](02-testing-levels.md) · [Mục lục research](README.md) · [Tiếp: AI reliability →](04-ai-reliability.md)

## 4. Các bài kiểm thử cho Ticket Manager CLI

Ticket Manager CLI là công cụ dòng lệnh cho phép người dùng tạo, xem, cập nhật, đóng và xóa ticket.

Các nhóm chức năng cần kiểm thử gồm:

- Commands
- Input Validation
- File Storage
- Error Handling

### 4.1 Commands

#### Command `add`

Các trường hợp cần kiểm tra:

- Tạo ticket thành công khi title hợp lệ
- Ticket mới có ID duy nhất
- Ticket mới có trạng thái mặc định là `open`
- Ticket được lưu vào storage
- Output hiển thị thông báo tạo thành công
- Command trả exit code `0`
- Có thể tạo nhiều ticket liên tiếp
- Ticket mới không ghi đè ticket cũ

Ví dụ test case:

> Cho title là `Login error`, khi người dùng chạy command `add`, hệ thống phải tạo một ticket có title `Login error`, trạng thái `open`, ID hợp lệ và trả exit code `0`.

#### Command `list`

Các trường hợp cần kiểm tra:

- Hiển thị toàn bộ ticket
- Hiển thị thông báo phù hợp khi danh sách rỗng
- Lọc ticket theo trạng thái
- Lọc ticket theo priority
- Không thay đổi dữ liệu khi chỉ xem danh sách
- Kết quả được hiển thị theo đúng định dạng

Ví dụ test case:

> Khi storage có hai ticket, command `list` phải hiển thị đầy đủ ID, title và status của cả hai ticket.

#### Command `show`

Các trường hợp cần kiểm tra:

- Hiển thị đúng ticket theo ID
- Hiển thị đầy đủ thông tin của ticket
- Báo lỗi khi ID không tồn tại
- Báo lỗi khi ID sai định dạng

Ví dụ test case:

> Khi ticket có ID `1` tồn tại, command `show 1` phải hiển thị đúng thông tin của ticket đó.

#### Command `update`

Các trường hợp cần kiểm tra:

- Cập nhật title thành công
- Cập nhật priority thành công
- Cập nhật đúng ticket được chọn
- Không thay đổi các ticket khác
- Báo lỗi khi ticket không tồn tại
- Không lưu dữ liệu nếu giá trị mới không hợp lệ

Ví dụ test case:

> Khi cập nhật title của ticket `1`, chỉ ticket `1` thay đổi và các ticket còn lại phải được giữ nguyên.

#### Command `close`

Các trường hợp cần kiểm tra:

- Chuyển ticket từ `open` sang `closed`
- Lưu trạng thái mới vào storage
- Báo lỗi khi ticket không tồn tại
- Xử lý phù hợp khi ticket đã ở trạng thái `closed`
- Không làm thay đổi title và các trường khác

Ví dụ test case:

> Khi đóng ticket có ID `1`, status phải chuyển thành `closed`, còn title và priority phải được giữ nguyên.

#### Command `delete`

Các trường hợp cần kiểm tra:

- Xóa đúng ticket theo ID
- Không xóa các ticket khác
- Lưu danh sách mới vào storage
- Báo lỗi khi ticket không tồn tại
- Không thay đổi dữ liệu nếu thao tác xóa thất bại

Ví dụ test case:

> Khi xóa ticket `1` trong danh sách có ticket `1` và `2`, ticket `1` phải biến mất nhưng ticket `2` vẫn tồn tại.

#### Command `help` và `version`

Các trường hợp cần kiểm tra:

- `help` hiển thị danh sách command
- `help` mô tả các argument bắt buộc
- `version` hiển thị đúng phiên bản
- Hai command này trả exit code `0`
- Hai command này không làm thay đổi storage

### 4.2 Input Validation

Input Validation đảm bảo chương trình chỉ xử lý dữ liệu hợp lệ.

Các trường hợp cần kiểm tra cho title:

- Title không được để trống
- Title không được chỉ chứa khoảng trắng
- Title phải thuộc kiểu dữ liệu hợp lệ
- Title không được vượt quá giới hạn độ dài
- Title có thể chứa ký tự đặc biệt hợp lệ
- Khoảng trắng thừa được xử lý đúng

Các trường hợp cần kiểm tra cho ID:

- ID phải là số nguyên dương
- ID không được rỗng
- ID không được là số âm
- ID không được bằng `0`
- ID không được chứa chữ
- ID không được chứa ký tự đặc biệt

Các trường hợp cần kiểm tra cho status:

- Chỉ chấp nhận các trạng thái được hỗ trợ
- Từ chối trạng thái không tồn tại
- Xử lý chữ hoa và chữ thường theo quy định
- Không thay đổi dữ liệu khi status không hợp lệ

Các trường hợp cần kiểm tra cho priority:

- Chỉ chấp nhận các mức priority được hỗ trợ
- Từ chối priority rỗng nếu trường này bắt buộc
- Từ chối giá trị không xác định
- Áp dụng priority mặc định nếu người dùng không nhập

Ví dụ test case:

> Khi người dùng nhập title chỉ chứa khoảng trắng, hệ thống phải báo lỗi `Title is required`, trả exit code khác `0` và không tạo ticket.

### 4.3 File Storage

Nếu Ticket Manager lưu dữ liệu trong file JSON, cần kiểm tra cả việc đọc và ghi file.

Các trường hợp cần kiểm tra:

- Tạo file dữ liệu khi file chưa tồn tại
- Khởi tạo danh sách rỗng cho lần chạy đầu tiên
- Ghi đúng cấu trúc JSON
- Đọc lại đúng dữ liệu đã lưu
- Thêm ticket mới mà không ghi đè ticket cũ
- Cập nhật đúng ticket
- Xóa đúng ticket
- Không làm mất dữ liệu khác
- Không để file ở trạng thái không hợp lệ nếu ghi dữ liệu thất bại
- Xử lý file rỗng
- Xử lý file JSON bị hỏng
- Xử lý lỗi không có quyền đọc hoặc ghi file

Ví dụ test case tạo ticket:

> Cho storage đang chứa một ticket, khi thêm ticket thứ hai, file phải chứa cả hai ticket và mỗi ticket phải có ID riêng.

Ví dụ test case cập nhật:

> Khi cập nhật ticket `1`, dữ liệu của ticket `1` phải thay đổi nhưng ticket `2` phải được giữ nguyên.

Ví dụ test case file hỏng:

> Khi file storage chứa JSON không hợp lệ, chương trình phải hiển thị lỗi có ý nghĩa, trả exit code khác `0` và không ghi đè file bằng dữ liệu rỗng.

Khi kiểm thử file storage, nên sử dụng thư mục tạm để:

- Không làm thay đổi dữ liệu thật
- Có thể tạo trạng thái ban đầu riêng cho từng test
- Dễ dọn dẹp dữ liệu sau khi test
- Giúp các test không ảnh hưởng lẫn nhau

### 4.4 Error Handling

Error Handling đảm bảo lỗi được xử lý rõ ràng và không làm hỏng dữ liệu.

Các trường hợp cần kiểm tra:

- Command không tồn tại
- Thiếu argument bắt buộc
- Argument sai định dạng
- Ticket không tồn tại
- File dữ liệu không tồn tại
- File dữ liệu bị hỏng
- Không có quyền đọc file
- Không có quyền ghi file
- Thao tác nghiệp vụ không hợp lệ
- Lỗi xảy ra trong lúc cập nhật dữ liệu

Một CLI tốt nên tuân theo quy ước:

- `stdout` chứa kết quả thành công
- `stderr` chứa cảnh báo hoặc thông báo lỗi
- Exit code `0` thể hiện thao tác thành công
- Exit code khác `0` thể hiện thao tác thất bại

Ví dụ test case command không hợp lệ:

> Khi người dùng chạy command không tồn tại, chương trình phải hiển thị hướng dẫn sử dụng trên `stderr`, trả exit code khác `0` và không thay đổi dữ liệu.

Ví dụ test case ticket không tồn tại:

> Khi người dùng chạy `show 999` nhưng ticket `999` không tồn tại, chương trình phải báo `Ticket not found`, trả exit code khác `0` và không tạo ticket mới.

Ví dụ test case lỗi ghi file:

> Khi storage không thể ghi dữ liệu, chương trình phải thông báo lỗi, trả exit code khác `0` và không báo thao tác thành công.

### 4.5 Phân loại các bài kiểm thử

Một số bài kiểm thử có thể được phân loại như sau:

| Bài kiểm thử | Loại test phù hợp |
|---|---|
| Title rỗng bị từ chối | Unit Test |
| Ticket mới có trạng thái `open` | Unit Test |
| Lọc ticket theo status | Unit Test |
| Ghi và đọc lại ticket từ file JSON | Integration Test |
| Cập nhật ticket không làm mất ticket khác | Integration Test |
| Xử lý file JSON bị hỏng | Integration Test |
| Chạy command `add` từ terminal | End-to-End Test |
| Tạo ticket rồi hiển thị bằng `list` | End-to-End Test |
| Tạo, cập nhật và đóng ticket | End-to-End Test |
| Kiểm tra exit code và output của CLI | End-to-End Test |
