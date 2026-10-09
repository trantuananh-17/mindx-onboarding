# Week 1 Research: Test-Driven Development for Reliable CLI Tools
## 1. TDD là gì?
TDD là viết tắt của **Test-Driven Development**, nghĩa là phát triển phần mềm dựa trên kiểm thử.

Trong TDD, lập trình viên viết bài kiểm thử trước khi viết phần code triển khai chức năng. Bài kiểm thử mô tả hành vi mà chương trình cần có. Sau đó, lập trình viên viết lượng code vừa đủ để bài kiểm thử chạy thành công.

Quy trình cơ bản:

1. Xác định một yêu cầu nhỏ
2. Viết bài kiểm thử cho yêu cầu đó
3. Chạy kiểm thử và xác nhận nó thất bại
4. Viết code để bài kiểm thử thành công
5. Cải thiện cấu trúc code
6. Chạy lại toàn bộ bài kiểm thử
7. Tiếp tục với yêu cầu tiếp theo

Giả sử chương trình có yêu cầu:

> Người dùng có thể tạo một ticket với tiêu đề hợp lệ.

Trước khi viết chức năng tạo ticket, chúng ta xác định các bài kiểm thử:

- Khi tiêu đề hợp lệ, ticket phải được tạo
- Ticket mới phải có ID
- Trạng thái mặc định của ticket phải là `open`
- Ticket phải được lưu vào nơi lưu trữ
- Khi tiêu đề rỗng, chương trình phải báo lỗi và không tạo ticket

Sau khi các yêu cầu trên được thể hiện thành bài kiểm thử, lập trình viên mới bắt đầu viết chức năng `addTicket`.

### 1.1 Mục đích của TDD

TDD giúp:

- Làm rõ yêu cầu trước khi viết code
- Chia chức năng lớn thành các phần nhỏ
- Phát hiện lỗi sớm
- Giảm lỗi hồi quy khi sửa chương trình
- Giúp việc refactor an toàn hơn
- Khuyến khích thiết kế code đơn giản và dễ kiểm thử
- Tạo tài liệu kỹ thuật thông qua các bài kiểm thử
- Kiểm chứng code do AI tạo ra

### 1.2 TDD khác gì với viết test sau khi hoàn thành code?

Trong cách phát triển thông thường:

**Viết code → Hoàn thành chức năng → Viết test**

Trong TDD:

**Viết test → Test thất bại → Viết code → Test thành công → Refactor**

Nếu viết test sau khi code đã hoàn thành, lập trình viên thường chỉ kiểm tra những gì code hiện tại đang làm. Trong TDD, test được viết từ yêu cầu trước, nên phần triển khai phải tuân theo hành vi đã xác định.

### 1.3 Vai trò của TDD khi sử dụng AI

AI có thể tạo code nhanh nhưng có thể:

- Hiểu sai yêu cầu
- Bỏ sót trường hợp biên
- Tạo logic không chính xác
- Làm hỏng chức năng cũ
- Sử dụng thư viện hoặc API không tồn tại
- Viết code chạy được nhưng không đúng nghiệp vụ

Khi áp dụng TDD, test đóng vai trò là hàng rào kiểm soát. Code do AI tạo ra chỉ được chấp nhận khi đáp ứng các hành vi đã được xác định trong test.

Tuy nhiên, test thành công không có nghĩa code chắc chắn hoàn toàn đúng. Nếu yêu cầu hoặc bài kiểm thử chưa đầy đủ, code vẫn có thể chứa lỗi. Vì vậy, TDD cần được kết hợp với review code, kiểm tra trường hợp biên và đánh giá của con người.

### Kết luận phần 1

TDD là phương pháp phát triển phần mềm trong đó bài kiểm thử được viết trước code triển khai. Mục tiêu của TDD không chỉ là tăng số lượng test mà còn làm rõ yêu cầu, cải thiện thiết kế và cung cấp phản hồi nhanh trong quá trình phát triển.

Đối với code do AI tạo ra, TDD giúp kiểm tra xem code có thực sự đáp ứng yêu cầu hay không.

## 2. Chu trình Red–Green–Refactor

Red–Green–Refactor là chu trình cốt lõi của TDD. Mỗi vòng lặp tập trung vào một yêu cầu nhỏ và gồm ba bước: viết test thất bại, viết code để test thành công, sau đó cải thiện cấu trúc code.

### 2.1 Red – Viết bài kiểm thử thất bại

Ở bước Red, lập trình viên viết một bài kiểm thử mô tả hành vi chưa được triển khai.

Sau khi viết test, cần chạy test và xác nhận nó thất bại đúng lý do.

Ví dụ, Ticket Manager CLI có yêu cầu:

> Khi người dùng tạo ticket với tiêu đề hợp lệ, hệ thống phải tạo ticket có trạng thái mặc định là `open`.

Test ban đầu sẽ thất bại vì chức năng tạo ticket chưa tồn tại.

Một bài kiểm thử tốt ở bước Red cần:

- Chỉ kiểm tra một hành vi cụ thể
- Có tên mô tả rõ điều kiện và kết quả mong đợi
- Thất bại vì chức năng chưa được triển khai
- Không thất bại vì lỗi cú pháp, cấu hình hoặc môi trường
- Có kết quả mong đợi rõ ràng

Ví dụ tên test:

- `should create a ticket with open status`
- `should reject an empty ticket title`
- `should return an error when ticket does not exist`

Bước Red quan trọng vì nó chứng minh bài kiểm thử có khả năng phát hiện chức năng đang thiếu hoặc hành vi đang sai.

Nếu test thành công ngay khi vừa được viết, cần kiểm tra lại vì có thể:

- Chức năng đã tồn tại
- Test không thực sự kiểm tra hành vi mong muốn
- Assertion quá yếu
- Test đang sử dụng dữ liệu hoặc mock không đúng

### 2.2 Green – Viết code tối thiểu để test thành công

Ở bước Green, lập trình viên viết lượng code tối thiểu cần thiết để bài kiểm thử thành công.

Mục tiêu của bước này là đáp ứng đúng hành vi đang được kiểm tra, chưa cần tối ưu hoặc xây thêm các tính năng chưa được yêu cầu.

Ví dụ, để test tạo ticket thành công, phần triển khai ban đầu chỉ cần:

- Nhận tiêu đề ticket
- Tạo ID
- Đặt trạng thái mặc định là `open`
- Trả về ticket vừa tạo

Sau khi triển khai, chạy lại test. Nếu test thành công, bước Green hoàn tất.

Nguyên tắc ở bước Green:

- Chỉ triển khai hành vi đang được kiểm tra
- Không thêm chức năng chưa có yêu cầu
- Không tối ưu quá sớm
- Ưu tiên giải pháp đơn giản và dễ hiểu
- Chạy lại cả test mới và test cũ

Code tối thiểu không có nghĩa là code cẩu thả. Nó có nghĩa là chưa mở rộng giải pháp vượt quá phạm vi của test hiện tại.

### 2.3 Refactor – Cải thiện cấu trúc code

Sau khi test thành công, lập trình viên cải thiện cấu trúc code mà không thay đổi hành vi bên ngoài.

Các hoạt động refactor có thể gồm:

- Đổi tên biến và hàm để dễ hiểu hơn
- Loại bỏ code trùng lặp
- Tách hàm quá dài thành các hàm nhỏ
- Tách logic nghiệp vụ khỏi xử lý giao diện CLI
- Tách phần lưu trữ dữ liệu thành repository
- Đơn giản hóa điều kiện
- Chuẩn hóa cách xử lý lỗi
- Giảm sự phụ thuộc giữa các module

Ví dụ, ban đầu command `add` có thể vừa kiểm tra dữ liệu, tạo ticket và ghi file. Trong bước refactor, có thể tách thành:

- `validateTicketInput`: kiểm tra dữ liệu đầu vào
- `createTicket`: tạo ticket
- `ticketRepository.save`: lưu ticket
- `addCommand`: tiếp nhận lệnh và hiển thị kết quả

Sau mỗi thay đổi, phải chạy lại toàn bộ test. Nếu tất cả test vẫn thành công, hành vi cũ đã được bảo toàn.

Nếu test thất bại sau khi refactor, cần kiểm tra:

- Refactor có làm thay đổi hành vi không?
- Test có đang phụ thuộc vào chi tiết triển khai không?
- Có trường hợp nào chưa được xử lý đúng không?

### 2.4 Ví dụ một vòng Red–Green–Refactor

Yêu cầu:

> Không cho phép tạo ticket có tiêu đề rỗng.

**Red:**

Viết test xác nhận rằng khi title rỗng, hệ thống phải trả lỗi `Title is required`.

Chạy test và xác nhận test thất bại vì chương trình vẫn cho phép tạo ticket.

**Green:**

Thêm điều kiện kiểm tra title. Nếu title rỗng hoặc chỉ chứa khoảng trắng, chương trình trả lỗi.

Chạy lại test và xác nhận test thành công.

**Refactor:**

Di chuyển logic kiểm tra title sang một hàm validation riêng để có thể tái sử dụng cho các command khác.

Sau đó chạy lại toàn bộ test để chắc chắn chức năng tạo ticket vẫn hoạt động đúng.

### 2.5 Lợi ích của chu trình ngắn

Mỗi vòng Red–Green–Refactor chỉ nên xử lý một thay đổi nhỏ. Vòng lặp ngắn mang lại các lợi ích:

- Dễ xác định nguyên nhân khi test thất bại
- Hạn chế việc AI tạo quá nhiều code ngoài yêu cầu
- Dễ review từng thay đổi
- Giảm rủi ro làm hỏng chức năng cũ
- Nhận phản hồi nhanh
- Có thể refactor thường xuyên và an toàn

### Kết luận phần 2

Red–Green–Refactor giúp phát triển phần mềm theo các bước nhỏ và có thể kiểm chứng.

- **Red:** viết test và xác nhận test thất bại
- **Green:** viết code tối thiểu để test thành công
- **Refactor:** cải thiện cấu trúc mà không làm thay đổi hành vi

Chu trình này được lặp lại cho từng yêu cầu cho đến khi chức năng hoàn chỉnh.

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

### Kết luận phần 3

Ba loại test có vai trò khác nhau:

- Unit Test kiểm tra logic nhỏ và chạy nhanh
- Integration Test kiểm tra sự kết hợp giữa các thành phần
- End-to-End Test kiểm tra toàn bộ luồng sử dụng thực tế

Kết hợp cả ba loại test giúp hệ thống vừa có phản hồi nhanh, vừa có độ tin cậy cao.

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

### Kết luận phần 4

Ticket Manager CLI cần được kiểm thử ở bốn khu vực chính:

- Command có thực hiện đúng chức năng không.
- Dữ liệu đầu vào có được kiểm tra đúng không.
- File storage có bảo toàn dữ liệu không.
- Lỗi có được xử lý rõ ràng và an toàn không.

Các bài kiểm thử không chỉ xác nhận thao tác thành công mà còn phải kiểm tra exit code, output, thông báo lỗi và trạng thái dữ liệu sau mỗi thao tác.

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

### 5.11 Thực nghiệm kiểm soát code AI bằng Red–Green–Refactor

Để kiểm chứng cách Testing kiểm soát code do AI tạo ra, tôi tạo một repository TypeScript nhỏ và áp dụng TDD cho một function duy nhất là `addTicket`.

Repository sử dụng:

- TypeScript để kiểm tra kiểu dữ liệu.
- Vitest để chạy Unit Test.
- `InMemoryTicketRepository` để lưu ticket trong bộ nhớ.
- `pnpm test` để chạy toàn bộ test.
- `pnpm typecheck` để kiểm tra lỗi TypeScript.

Mục tiêu của thực nghiệm không phải xây dựng toàn bộ Ticket Manager CLI. Mục tiêu là chứng minh rằng test có thể giới hạn phạm vi triển khai, phát hiện trường hợp AI bỏ sót và kiểm tra kết quả trước khi chấp nhận code.

#### 5.11.1 Yêu cầu của function `addTicket`

Function `addTicket` cần đáp ứng các yêu cầu:

1. Nhận title của ticket.
2. Tạo ID mới cho ticket.
3. Đặt status mặc định là `open`.
4. Lưu ticket vào repository.
5. Trả về ticket vừa được tạo.
6. Từ chối title rỗng.
7. Từ chối title chỉ chứa khoảng trắng.
8. Loại bỏ khoảng trắng thừa ở đầu và cuối title.
9. Không ghi đè các ticket đã tồn tại.

Các kiểu dữ liệu được sử dụng:

```ts
// Ticket chỉ có trạng thái "open" trong phạm vi demo này.
export type TicketStatus = "open";

// Cấu trúc của một ticket sau khi được tạo.
export interface Ticket {
  id: number;
  title: string;
  status: TicketStatus;
}

// Dữ liệu người dùng cung cấp khi tạo ticket.
export interface NewTicketInput {
  title: string;
}

// Contract mà addTicket sử dụng để làm việc với storage.
//
// addTicket không cần biết dữ liệu đang được lưu trong bộ nhớ,
// file JSON hay database. Điều này giúp function dễ kiểm thử.
export interface TicketRepository {
  nextId(): number;
  save(ticket: Ticket): void;
  findById(id: number): Ticket | undefined;
  findAll(): Ticket[];
}
```

Việc sử dụng `TicketRepository` interface giúp tách logic nghiệp vụ khỏi cách lưu trữ dữ liệu.

Trong Unit Test, tôi sử dụng `InMemoryTicketRepository` để test có thể chạy nhanh mà không cần tạo file hoặc kết nối database.

---

#### 5.11.2 Vòng thứ nhất – Red: viết test trước implementation

Yêu cầu đầu tiên được chọn là:

> Khi title hợp lệ, `addTicket` phải tạo một ticket có ID, title, status `open` và lưu ticket vào repository.

Test đầu tiên:

```ts
describe("addTicket", () => {
  let repository: InMemoryTicketRepository;

  beforeEach(() => {
    // Mỗi test sử dụng repository riêng.
    //
    // Điều này bảo đảm test không phụ thuộc vào dữ liệu
    // được tạo bởi test khác.
    repository = new InMemoryTicketRepository();
  });

  it("creates and saves an open ticket when the title is valid", () => {
    // Act:
    // Gọi function với một title hợp lệ.
    const result = addTicket(
      { title: "Login error" },
      repository,
    );

    // Assert kết quả trả về:
    // Ticket phải có đúng ID, title và status.
    expect(result).toEqual({
      id: 1,
      title: "Login error",
      status: "open",
    });

    // Assert side effect:
    // Không chỉ kiểm tra object được trả về,
    // test còn xác nhận ticket thực sự đã được lưu.
    expect(repository.findById(result.id)).toEqual(result);
  });
});
```

Ở thời điểm này, `addTicket` chưa được triển khai:

```ts
export function addTicket(
  _input: NewTicketInput,
  _repository: TicketRepository,
): Ticket {
  // Cố ý chưa triển khai.
  //
  // Test phải thất bại để chứng minh rằng test
  // có khả năng phát hiện chức năng còn thiếu.
  throw new Error("Not implemented");
}
```

Kết quả:

```text
FAIL tests/ticket.test.ts

Error: Not implemented

Test Files  1 failed (1)
Tests       1 failed (1)
```

Đây là trạng thái **Red**.

Test thất bại đúng lý do vì `addTicket` chưa được triển khai. Nếu test thành công trong trạng thái này, test có thể không thực sự kiểm tra hành vi mong muốn.

Testing đã kiểm soát AI ngay từ bước đầu vì:

- Hành vi mong muốn đã được xác định trước.
- Kết quả không do AI tự quyết định.
- AI chỉ được triển khai code để đáp ứng test cụ thể.
- Test kiểm tra cả kết quả trả về và dữ liệu trong repository.

---

#### 5.11.3 Vòng thứ nhất – Green: implementation tối thiểu

Sau khi xác nhận trạng thái Red, tôi triển khai lượng code tối thiểu để test thành công:

```ts
export function addTicket(
  input: NewTicketInput,
  repository: TicketRepository,
): Ticket {
  // Tạo một ticket theo đúng cấu trúc mà test yêu cầu.
  const ticket: Ticket = {
    // Repository chịu trách nhiệm cung cấp ID tiếp theo.
    id: repository.nextId(),

    // Phiên bản đầu tiên sử dụng trực tiếp title từ input.
    title: input.title,

    // Ticket mới luôn có trạng thái mặc định là "open".
    status: "open",
  };

  // Lưu ticket vào repository.
  repository.save(ticket);

  // Trả về ticket vừa được tạo.
  return ticket;
}
```

Kết quả:

```text
Test Files  1 passed (1)
Tests       1 passed (1)
```

Đây là trạng thái **Green**.

Implementation đã đáp ứng yêu cầu cơ bản:

- Ticket có ID.
- Ticket có title.
- Status mặc định là `open`.
- Ticket được lưu vào repository.
- Function trả về ticket vừa tạo.

Tuy nhiên, test thành công không có nghĩa implementation đã hoàn chỉnh.

Khi review code, tôi phát hiện các trường hợp chưa được kiểm tra:

- Title có thể là chuỗi rỗng.
- Title có thể chỉ chứa khoảng trắng.
- Title có thể có khoảng trắng thừa.
- Chưa kiểm tra việc tạo nhiều ticket.
- Chưa xác nhận ticket mới không ghi đè ticket cũ.

Đây là ví dụ cho thấy code AI có thể vượt qua test hiện tại nhưng vẫn chưa đáp ứng đầy đủ yêu cầu nghiệp vụ.

---

#### 5.11.4 Vòng thứ hai – Red: bổ sung trường hợp biên

Sau bước review, tôi bổ sung test cho các trường hợp mà implementation đầu tiên bỏ sót.

##### Test từ chối title rỗng

```ts
it("rejects an empty title without saving a ticket", () => {
  // Function phải phát sinh đúng lỗi khi title rỗng.
  expect(() => {
    addTicket({ title: "" }, repository);
  }).toThrow("Title is required");

  // Repository không được thay đổi nếu validation thất bại.
  expect(repository.findAll()).toHaveLength(0);
});
```

Test này kiểm tra hai hành vi:

1. Function phải thông báo lỗi.
2. Ticket không được lưu khi input không hợp lệ.

Nếu chỉ kiểm tra lỗi được throw mà không kiểm tra repository, implementation vẫn có thể lưu ticket trước khi báo lỗi.

##### Test từ chối title chỉ chứa khoảng trắng

```ts
it("rejects a title containing only spaces", () => {
  // Chuỗi có ký tự nhưng không có nội dung có ý nghĩa
  // cũng phải được xem là title không hợp lệ.
  expect(() => {
    addTicket({ title: "   " }, repository);
  }).toThrow("Title is required");

  // Không được tạo side effect khi validation thất bại.
  expect(repository.findAll()).toHaveLength(0);
});
```

Test này ngăn AI chỉ kiểm tra `title.length === 0`, vì chuỗi `"   "` có độ dài lớn hơn `0` nhưng vẫn không phải title hợp lệ.

##### Test loại bỏ khoảng trắng thừa

```ts
it("trims unnecessary spaces from the title", () => {
  const result = addTicket(
    { title: "  Login error  " },
    repository,
  );

  // Title được lưu phải là dữ liệu đã chuẩn hóa.
  expect(result.title).toBe("Login error");
});
```

Test này yêu cầu implementation chuẩn hóa dữ liệu trước khi lưu.

##### Test tạo nhiều ticket

```ts
it("creates unique IDs without overwriting existing tickets", () => {
  // Tạo ticket đầu tiên.
  const firstTicket = addTicket(
    { title: "Login error" },
    repository,
  );

  // Tạo ticket thứ hai trong cùng repository.
  const secondTicket = addTicket(
    { title: "Payment error" },
    repository,
  );

  // Hai ticket phải có ID khác nhau.
  expect(firstTicket.id).toBe(1);
  expect(secondTicket.id).toBe(2);

  // Repository phải chứa cả hai ticket.
  expect(repository.findAll()).toHaveLength(2);

  // Ticket thứ hai không được ghi đè ticket đầu tiên.
  expect(repository.findById(1)?.title).toBe("Login error");
  expect(repository.findById(2)?.title).toBe("Payment error");
});
```

Kết quả:

```text
Test Files  1 failed (1)
Tests       3 failed | 2 passed (5)
```

Ba test thất bại vì implementation hiện tại:

- Không từ chối title rỗng.
- Không từ chối title chỉ chứa khoảng trắng.
- Không loại bỏ khoảng trắng thừa.

Đây là trạng thái **Red** của vòng thứ hai.

Kết quả này chứng minh test đã phát hiện những hành vi mà implementation ban đầu chưa xử lý.

---

#### 5.11.5 Vòng thứ hai – Green: bổ sung validation

Từ kết quả test, tôi cải tiến `addTicket`:

```ts
export function addTicket(
  input: NewTicketInput,
  repository: TicketRepository,
): Ticket {
  // Loại bỏ khoảng trắng ở đầu và cuối title.
  //
  // Việc lưu giá trị vào biến title giúp tránh gọi trim()
  // nhiều lần và bảo đảm toàn bộ function sử dụng cùng
  // một giá trị đã được chuẩn hóa.
  const title = input.title.trim();

  // Validation phải chạy trước khi tạo hoặc lưu ticket.
  //
  // Nếu title rỗng sau khi trim, function dừng ngay.
  // Repository chưa bị thay đổi tại thời điểm này.
  if (title.length === 0) {
    throw new Error("Title is required");
  }

  // Chỉ tạo ticket sau khi input đã vượt qua validation.
  const ticket: Ticket = {
    id: repository.nextId(),

    // Sử dụng title đã được chuẩn hóa thay vì input gốc.
    title,

    status: "open",
  };

  // Đây là side effect duy nhất của function.
  // Lệnh này chỉ được thực hiện khi dữ liệu hợp lệ.
  repository.save(ticket);

  return ticket;
}
```

Tôi chạy lại toàn bộ test:

Kết quả:

```text
Test Files  1 passed (1)
Tests       5 passed (5)
```

Tôi tiếp tục chạy TypeScript type-check:

Kết quả:

```text
TypeScript: No errors
```

Đây là trạng thái **Green** của vòng thứ hai.

Toàn bộ các hành vi đã được kiểm chứng:

- Tạo ticket với title hợp lệ.
- Tự động tạo ID.
- Gán status mặc định là `open`.
- Lưu ticket vào repository.
- Từ chối title rỗng.
- Từ chối title chỉ chứa khoảng trắng.
- Loại bỏ khoảng trắng thừa.
- Tạo nhiều ticket với ID khác nhau.
- Không ghi đè ticket đã tồn tại.

---

#### 5.11.6 Refactor sau khi test thành công

Sau khi các test đều thành công, tôi review lại cấu trúc code.

Quy trình xử lý cuối cùng của `addTicket` là:

```text
Nhận input
    ↓
Chuẩn hóa title
    ↓
Validation title
    ↓
Tạo ticket
    ↓
Lưu ticket
    ↓
Trả về kết quả
```

Các quyết định refactor:

1. **Chuẩn hóa dữ liệu một lần**

   `input.title.trim()` được gán vào biến `title`. Điều này tránh lặp lại logic và giúp code dễ đọc hơn.

2. **Validation trước side effect**

   Function kiểm tra title trước khi gọi `repository.nextId()` hoặc `repository.save()`.

   Nếu validation thất bại, repository không bị thay đổi.

3. **Tách logic nghiệp vụ khỏi storage**

   `addTicket` phụ thuộc vào `TicketRepository` interface. Function không cần biết ticket được lưu trong bộ nhớ, file JSON hay database.

4. **Giữ function có một trách nhiệm rõ ràng**

   `addTicket` chỉ chịu trách nhiệm:

   - Kiểm tra dữ liệu tạo ticket.
   - Tạo ticket.
   - Yêu cầu repository lưu ticket.
   - Trả về kết quả.

5. **Không thêm chức năng ngoài yêu cầu**

   Function không tự thêm command parser, file storage hoặc output CLI. Điều này giữ thay đổi trong đúng phạm vi test.

Kết quả:

```text
Test Files  1 passed (1)
Tests       5 passed (5)
TypeScript  No errors
```

Việc chạy lại test sau refactor giúp xác nhận cấu trúc code được cải thiện mà không làm thay đổi hành vi đã được kiểm chứng.

---

#### 5.11.7 Tổng hợp các vòng Red–Green–Refactor

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

#### 5.11.8 Testing đã kiểm soát code AI như thế nào?

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

#### 5.11.9 Bài học rút ra từ thực nghiệm

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

### Kết luận phần 5

Testing giúp kiểm soát code do AI tạo ra bằng cách chuyển yêu cầu thành các điều kiện có thể chạy và kiểm chứng.

Thay vì chỉ yêu cầu AI viết code rồi tin rằng kết quả đúng, quy trình phù hợp là:

1. Con người xác định yêu cầu.
2. Chuyển yêu cầu thành test case.
3. Chạy test để xác nhận trạng thái Red.
4. Yêu cầu AI viết implementation trong phạm vi cụ thể.
5. Chạy test để kiểm tra trạng thái Green.
6. Review code và tìm các trường hợp bị bỏ sót.
7. Bổ sung test cho trường hợp biên.
8. Refactor và chạy lại toàn bộ test.

Thực nghiệm với function `addTicket` cho thấy implementation đầu tiên có thể vượt qua test cơ bản nhưng vẫn chưa xử lý đầy đủ title rỗng, title chỉ chứa khoảng trắng và việc chuẩn hóa dữ liệu.

Sau khi review và bổ sung test, kết quả thay đổi qua các vòng:

| Giai đoạn | Kết quả |
|---|---|
| Function chưa được triển khai | 1 test thất bại |
| Implementation tối thiểu | 1 test thành công |
| Bổ sung các trường hợp biên | 3 thất bại, 2 thành công |
| Cải tiến implementation | 5 test thành công |
| Kiểm tra TypeScript | Không có lỗi |

Kết quả này chứng minh rằng test có thể:

- Giới hạn phạm vi code do AI triển khai.
- Phát hiện logic còn thiếu.
- Kiểm tra trường hợp thành công và thất bại.
- Xác nhận trạng thái dữ liệu sau thao tác.
- Phát hiện lỗi hồi quy.
- Cung cấp bằng chứng có thể chạy lại.
- Tạo sự tự tin khi refactor.

Tuy nhiên, test thành công không chứng minh hệ thống hoàn toàn không có lỗi. Nếu yêu cầu hoặc test case chưa đầy đủ, code AI vẫn có thể sai mà toàn bộ test vẫn thành công.

Vì vậy, testing không thay thế vai trò của con người. Con người vẫn phải chịu trách nhiệm xác định yêu cầu, review test, đánh giá assertion, kiểm tra trường hợp biên và quyết định có chấp nhận code do AI tạo ra hay không.

## 6. Các lỗi Testing phổ biến và cách tránh

Một hệ thống có nhiều test chưa chắc đã được kiểm thử tốt. Test chỉ có giá trị khi nó kiểm tra đúng hành vi, có thể phát hiện lỗi và hỗ trợ việc thay đổi code.

Dưới đây là các lỗi testing phổ biến khi xây dựng Ticket Manager CLI và khi làm việc với AI.

### 6.1 Over-testing

Over-testing xảy ra khi viết quá nhiều test không mang lại giá trị tương ứng.

Các biểu hiện:

- Kiểm tra từng dòng code.
- Kiểm tra các hàm private không có hành vi độc lập.
- Lặp lại cùng một test case ở nhiều cấp độ.
- Viết quá nhiều End-to-End Test cho logic đơn giản.
- Kiểm tra cả hành vi mặc định của thư viện.
- Kiểm tra những chi tiết không ảnh hưởng đến người dùng.

Ví dụ:

Cùng một quy tắc title rỗng được kiểm tra hàng chục lần trong Unit Test, Integration Test và End-to-End Test mà không có mục đích rõ ràng.

Hậu quả:

- Test suite chạy chậm.
- Chi phí bảo trì tăng.
- Nhiều test bị hỏng khi refactor.
- Khó xác định test nào thực sự quan trọng.
- Lập trình viên mất niềm tin vào test suite.

Cách tránh:

- Ưu tiên hành vi có giá trị nghiệp vụ.
- Tập trung vào khu vực có rủi ro cao.
- Kiểm tra logic nhỏ bằng Unit Test.
- Chỉ dùng End-to-End Test cho luồng quan trọng.
- Không lặp lại cùng một trường hợp ở mọi cấp độ nếu không cần thiết.
- Xóa hoặc gộp các test không mang lại giá trị.

### 6.2 Assertion quá yếu

Assertion yếu chỉ chứng minh chương trình có chạy, không chứng minh kết quả đúng.

Ví dụ assertion yếu:

- Kết quả không phải `null`.
- Danh sách có ít nhất một phần tử.
- Command không bị crash.
- Output có chứa từ `success`.
- Hàm đã được gọi.

Một command có thể in thông báo thành công nhưng không thực sự lưu dữ liệu.

Assertion tốt hơn cần kiểm tra:

- Đúng ticket được tạo.
- Đúng title, status và ID.
- Đúng exit code.
- Đúng output.
- Đúng trạng thái trong storage.
- Các ticket khác không bị thay đổi.
- Không có dữ liệu không mong muốn.

Ví dụ:

Thay vì chỉ kiểm tra danh sách có một phần tử, cần kiểm tra phần tử đó có đúng ID, title, status và priority mong đợi.

Cách tránh:

- Xác định rõ kết quả mong đợi trước khi viết test.
- Kiểm tra giá trị cụ thể.
- Kiểm tra cả output và trạng thái dữ liệu.
- Kiểm tra side effect quan trọng.
- Bảo đảm test thất bại khi hành vi bị triển khai sai.

### 6.3 Kiểm tra chi tiết triển khai

Lỗi này xảy ra khi test kiểm tra cách code được viết thay vì hành vi mà hệ thống cung cấp.

Ví dụ:

- Kiểm tra một hàm private được gọi đúng hai lần.
- Kiểm tra tên của biến nội bộ.
- Kiểm tra thứ tự gọi các hàm dù thứ tự không ảnh hưởng kết quả.
- Mock mọi module bên trong implementation.
- Kiểm tra cấu trúc nội bộ không được người dùng quan sát.

Hậu quả:

- Test bị hỏng khi refactor.
- Lập trình viên ngại cải thiện cấu trúc code.
- Test thành công nhưng hành vi thực tế có thể vẫn sai.
- Test phụ thuộc quá chặt vào implementation.

Cách tránh:

- Kiểm tra input và output.
- Kiểm tra trạng thái có thể quan sát.
- Kiểm tra side effect quan trọng.
- Kiểm tra kết quả nghiệp vụ.
- Chỉ kiểm tra số lần gọi khi điều đó thật sự là yêu cầu.

Ví dụ, thay vì kiểm tra `saveFile` được gọi một lần, nên kiểm tra ticket đã được lưu đúng trong storage.

### 6.4 Chỉ kiểm tra Happy Path

Happy Path là trường hợp mọi dữ liệu đều hợp lệ và thao tác diễn ra thành công.

Ví dụ:

- Tạo ticket với title hợp lệ.
- Đọc một file JSON hợp lệ.
- Cập nhật ticket đang tồn tại.

Nếu chỉ kiểm tra Happy Path, chương trình có thể thất bại khi gặp dữ liệu thực tế.

Các trường hợp thất bại cần kiểm tra:

- Title rỗng.
- ID sai định dạng.
- Ticket không tồn tại.
- Command không tồn tại.
- Status không hợp lệ.
- File JSON bị hỏng.
- Không có quyền ghi file.
- Dữ liệu vượt quá giới hạn.

Cách tránh:

- Với mỗi Happy Path, xác định ít nhất một Failure Path.
- Kiểm tra giá trị biên.
- Kiểm tra input rỗng và sai kiểu.
- Kiểm tra lỗi từ các phụ thuộc bên ngoài.
- Kiểm tra trạng thái dữ liệu sau khi thao tác thất bại.

### 6.5 Test không độc lập

Test không độc lập là test phụ thuộc vào trạng thái hoặc kết quả của test khác.

Ví dụ:

- Test `update` chỉ thành công nếu test `add` đã chạy trước.
- Nhiều test sử dụng chung một file dữ liệu.
- Test sau phụ thuộc vào ID được tạo ở test trước.
- Một test không dọn dẹp dữ liệu sau khi kết thúc.

Hậu quả:

- Test thành công khi chạy cùng nhau nhưng thất bại khi chạy riêng.
- Thứ tự chạy test ảnh hưởng đến kết quả.
- Khó xác định nguyên nhân lỗi.
- Có thể tạo ra flaky test.

Cách tránh:

- Mỗi test tự chuẩn bị dữ liệu cần thiết.
- Sử dụng file và thư mục tạm.
- Dọn dẹp dữ liệu sau mỗi test.
- Không phụ thuộc vào thứ tự chạy.
- Có thể chạy riêng từng test.

### 6.6 Sử dụng quá nhiều mock

Mock giúp cô lập một đơn vị code, nhưng sử dụng quá nhiều mock khiến test khác xa hệ thống thật.

Ví dụ:

- Mock toàn bộ file system.
- Mock repository.
- Mock service.
- Mock command parser.
- Mock cả dữ liệu trả về.

Test có thể thành công dù việc đọc và ghi file thực tế không hoạt động.

Cách tránh:

- Chỉ mock những phụ thuộc thật sự cần cô lập.
- Sử dụng object thật cho logic đơn giản.
- Dùng thư mục tạm cho Integration Test.
- Bổ sung End-to-End Test cho luồng quan trọng.
- Không mock module chỉ vì việc mock dễ hơn.

### 6.7 Test không ổn định

Flaky test là test lúc thành công, lúc thất bại dù code không thay đổi.

Nguyên nhân có thể gồm:

- Dùng chung file dữ liệu.
- Phụ thuộc vào thời gian thực.
- Phụ thuộc vào thứ tự chạy.
- Sử dụng ID ngẫu nhiên mà không kiểm soát.
- Phụ thuộc vào mạng hoặc dịch vụ bên ngoài.
- Không chờ đúng thao tác bất đồng bộ.

Hậu quả:

- Nhóm phát triển mất niềm tin vào test.
- Lỗi thật bị bỏ qua.
- Quá trình phát triển và bàn giao bị chậm.

Cách tránh:

- Cô lập dữ liệu cho từng test.
- Kiểm soát thời gian và dữ liệu ngẫu nhiên.
- Mock dịch vụ mạng khi kiểm tra unit.
- Thiết lập timeout hợp lý.
- Không sửa flaky test bằng cách chỉ chạy lại nhiều lần.
- Tìm và xử lý nguyên nhân gốc.

### 6.8 Không kiểm tra trạng thái sau khi xảy ra lỗi

Một test có thể xác nhận chương trình báo lỗi nhưng không kiểm tra dữ liệu có bị thay đổi hay không.

Ví dụ:

- Chương trình báo lỗi khi title rỗng nhưng vẫn lưu ticket.
- Chương trình báo lỗi khi update thất bại nhưng file đã bị ghi một phần.
- Chương trình báo không tìm thấy ticket nhưng lại tạo file dữ liệu mới.

Cách tránh:

Sau một thao tác thất bại, cần kiểm tra:

- Storage không thay đổi.
- Không có ticket mới được tạo.
- Ticket cũ không bị sửa.
- File vẫn hợp lệ.
- Command trả exit code phù hợp.
- Error được ghi vào `stderr`.

### 6.9 Test tên không rõ ràng

Tên test như `test1`, `works correctly` hoặc `should work` không mô tả được hành vi.

Tên test tốt nên thể hiện:

- Điều kiện.
- Hành động.
- Kết quả mong đợi.

Ví dụ tên chưa tốt:

- `test add`
- `should work`
- `ticket test`

Ví dụ tên tốt:

- `should create a ticket when title is valid`
- `should reject a title containing only spaces`
- `should preserve other tickets when deleting one ticket`
- `should return a non-zero exit code when ticket does not exist`

Tên rõ ràng giúp test đóng vai trò như tài liệu của hệ thống.

### 6.10 Không chạy toàn bộ test sau khi thay đổi

Chỉ chạy test của chức năng mới có thể bỏ sót lỗi hồi quy.

Ví dụ, AI thay đổi repository để hỗ trợ command `close`, nhưng thay đổi đó làm command `add` không còn lưu dữ liệu đúng.

Cách tránh:

- Chạy test liên quan trong lúc phát triển.
- Chạy toàn bộ test suite trước khi bàn giao.
- Thiết lập CI để tự động chạy test.
- Thêm Regression Test cho mỗi bug đã phát hiện.
- Không chấp nhận thay đổi nếu test cũ bị lỗi mà chưa có giải thích hợp lý.

### 6.11 Tin tưởng mù quáng vào test do AI tạo ra

AI có thể tạo test trông hợp lý nhưng không thực sự kiểm tra yêu cầu.

Các vấn đề thường gặp:

- Test không có assertion quan trọng.
- Mock trả đúng kết quả mà implementation cần.
- Test được viết theo code hiện tại thay vì yêu cầu.
- Test case quan trọng bị bỏ sót.
- Test không được chạy thực tế.
- AI tự kết luận rằng tất cả test đều thành công.
- Test chỉ kiểm tra rằng hàm không phát sinh exception.

Cách tránh:

- Review từng test case.
- Đối chiếu test với acceptance criteria.
- Chạy test trong môi trường thực tế.
- Cố ý sửa code để kiểm tra test có thất bại không.
- Bổ sung test cho trường hợp biên.
- Không để AI tự đánh giá hoàn toàn kết quả của chính nó.

### 6.12 Viết test sau implementation chỉ để đạt coverage

Coverage cho biết phần code nào đã được chạy qua khi test, nhưng không chứng minh hành vi đã được kiểm tra đúng.

Một dự án có coverage cao vẫn có thể chứa lỗi nếu:

- Assertion yếu.
- Không kiểm tra kết quả.
- Không có trường hợp biên.
- Test chỉ gọi hàm mà không xác nhận hành vi.
- Test được viết để tăng số liệu coverage.

Cách tránh:

- Ưu tiên chất lượng test hơn tỷ lệ coverage.
- Viết test dựa trên yêu cầu.
- Kiểm tra hành vi và kết quả cụ thể.
- Sử dụng coverage để tìm khu vực chưa được kiểm tra, không xem nó là mục tiêu duy nhất.

### 6.13 Lặp lại quá nhiều code trong test

Test cũng là code và cần được bảo trì.

Nếu mỗi test lặp lại việc tạo ticket, tạo file và chuẩn bị storage, tài liệu test sẽ trở nên dài và khó đọc.

Cách tránh:

- Tạo hàm hỗ trợ cho dữ liệu dùng chung.
- Sử dụng setup phù hợp.
- Tạo factory để sinh ticket mẫu.
- Vẫn giữ dữ liệu quan trọng hiển thị rõ trong từng test.
- Không trừu tượng hóa quá mức khiến test khó hiểu.

### Bảng tổng hợp

| Lỗi phổ biến | Cách tránh |
|---|---|
| Over-testing | Ưu tiên hành vi quan trọng và khu vực rủi ro |
| Assertion yếu | Kiểm tra giá trị và trạng thái cụ thể |
| Test implementation detail | Kiểm tra hành vi có thể quan sát |
| Chỉ test Happy Path | Bổ sung lỗi và trường hợp biên |
| Test phụ thuộc nhau | Chuẩn bị dữ liệu độc lập cho từng test |
| Mock quá nhiều | Kết hợp test với phụ thuộc thật |
| Flaky test | Kiểm soát dữ liệu, thời gian và môi trường |
| Không kiểm tra trạng thái khi lỗi | Xác nhận dữ liệu không bị thay đổi |
| Tên test không rõ | Mô tả điều kiện, hành động và kết quả |
| Không chạy regression test | Chạy toàn bộ test trước khi bàn giao |
| Tin tưởng test do AI tạo | Review và đối chiếu acceptance criteria |
| Chạy theo coverage | Ưu tiên chất lượng assertion |

### Kết luận phần 6

Các lỗi testing thường không đến từ việc thiếu số lượng test mà đến từ việc test sai mục tiêu.

Một test tốt cần:

- Kiểm tra hành vi có giá trị.
- Có assertion cụ thể.
- Độc lập với test khác.
- Có thể thất bại khi code sai.
- Bao gồm cả trường hợp thành công và thất bại.
- Không phụ thuộc quá chặt vào implementation.
- Có tên rõ ràng.
- Có thể chạy ổn định và lặp lại.

Khi sử dụng AI, con người cần review cả code lẫn test, kiểm tra các giả định của AI và không coi test xanh là bằng chứng duy nhất rằng hệ thống hoàn toàn đúng.



## 7. Kết luận và bài học rút ra

Qua quá trình nghiên cứu, tôi hiểu rằng Test-Driven Development không đơn giản là viết nhiều bài kiểm thử. TDD là phương pháp phát triển phần mềm trong đó test được sử dụng để xác định và định hướng hành vi của chương trình trước khi viết implementation.

Chu trình cốt lõi của TDD gồm:

- **Red:** viết test và xác nhận test thất bại đúng lý do.
- **Green:** viết lượng code tối thiểu để test thành công.
- **Refactor:** cải thiện cấu trúc code mà không làm thay đổi hành vi đã được kiểm chứng.

Việc xác nhận trạng thái Red rất quan trọng. Nếu test thành công trước khi chức năng được triển khai, test có thể không thực sự kiểm tra yêu cầu mong muốn.

Bước Green giúp giới hạn phạm vi triển khai. Lập trình viên hoặc AI chỉ cần viết lượng code đủ để đáp ứng test hiện tại, tránh việc thêm tính năng chưa được yêu cầu hoặc thiết kế hệ thống quá mức.

Bước Refactor giúp cải thiện khả năng đọc, bảo trì và mở rộng của code. Toàn bộ test phải được chạy lại sau khi refactor để xác nhận hành vi cũ vẫn được bảo toàn.

### Các cấp độ kiểm thử

Mỗi cấp độ kiểm thử có một mục đích khác nhau:

- **Unit Test** kiểm tra một function, class hoặc quy tắc nghiệp vụ nhỏ.
- **Integration Test** kiểm tra nhiều module hoạt động cùng nhau, chẳng hạn service và repository.
- **End-to-End Test** kiểm tra toàn bộ luồng từ command line đến storage và output.

Một dự án không nên chỉ sử dụng một loại test. Chiến lược phù hợp là:

- Nhiều Unit Test cho logic và validation.
- Một lượng vừa phải Integration Test cho storage và sự kết hợp giữa các module.
- Một số ít End-to-End Test cho các luồng quan trọng của người dùng.

### Những khu vực cần kiểm thử trong CLI

Đối với Ticket Manager CLI, các khu vực chính cần kiểm thử gồm:

- Commands như `add`, `list`, `show`, `update`, `close` và `delete`.
- Validation cho title, ID, status và priority.
- Khả năng đọc và ghi dữ liệu.
- Việc bảo toàn các ticket đã tồn tại.
- Cách chương trình xử lý file bị hỏng.
- Thông báo lỗi, `stdout`, `stderr` và exit code.
- Trạng thái dữ liệu sau khi thao tác thất bại.

Test không nên chỉ kiểm tra rằng command đã chạy. Test cần xác nhận cả kết quả trả về, output, exit code và trạng thái dữ liệu sau thao tác.

### Kiểm soát code do AI tạo ra

AI có thể giúp tạo test, implementation và đề xuất refactor nhanh hơn. Tuy nhiên, AI cũng có thể hiểu sai yêu cầu, bỏ sót trường hợp biên hoặc thay đổi code ngoài phạm vi.

Testing giúp kiểm soát các rủi ro này bằng cách:

- Chuyển yêu cầu thành tiêu chí có thể kiểm chứng.
- Buộc implementation phải đáp ứng hành vi đã xác định.
- Phát hiện trường hợp AI bỏ sót.
- Kiểm tra side effect.
- Phát hiện regression sau mỗi thay đổi.
- Cung cấp kết quả có thể chạy lại.

AI nên đóng vai trò là công cụ hỗ trợ. Con người vẫn phải kiểm soát yêu cầu, phạm vi thay đổi, chất lượng test và quyết định cuối cùng.

### Kết quả thực hành

Trong phần thực hành, tôi áp dụng TDD cho function `addTicket`.

Yêu cầu của function gồm:

- Tạo ticket khi title hợp lệ.
- Tự động tạo ID.
- Gán status mặc định là `open`.
- Lưu ticket vào repository.
- Từ chối title rỗng.
- Từ chối title chỉ chứa khoảng trắng.
- Loại bỏ khoảng trắng thừa.
- Không ghi đè ticket đã tồn tại.

Kết quả qua các vòng:

| Giai đoạn | Kết quả |
|---|---|
| Red lần thứ nhất | 1 test thất bại |
| Green lần thứ nhất | 1 test thành công |
| Red lần thứ hai | 3 thất bại, 2 thành công |
| Green lần thứ hai | 5 test thành công |
| TypeScript type-check | Không có lỗi |

Thực nghiệm này cho thấy một implementation có thể vượt qua test ban đầu nhưng vẫn còn thiếu nhiều trường hợp quan trọng. Chỉ sau khi review, bổ sung test và chạy lại toàn bộ test, implementation mới đáng tin cậy hơn.

### Những lỗi cần tránh

Các lỗi testing phổ biến gồm:

- Viết quá nhiều test không có giá trị.
- Sử dụng assertion quá yếu.
- Kiểm tra chi tiết triển khai thay vì hành vi.
- Chỉ kiểm tra trường hợp thành công.
- Sử dụng quá nhiều mock.
- Để các test phụ thuộc lẫn nhau.
- Không kiểm tra trạng thái dữ liệu sau khi có lỗi.
- Chỉ quan tâm đến tỷ lệ coverage.
- Tin tưởng test do AI tạo ra mà không review.
- Không chạy lại toàn bộ test sau khi thay đổi code.

Một test tốt cần có tên rõ ràng, kiểm tra hành vi cụ thể, có assertion đủ mạnh và có khả năng thất bại khi implementation sai.

### Bài học rút ra

Sau quá trình nghiên cứu và thực hành, tôi rút ra các bài học:

1. Cần làm rõ yêu cầu trước khi viết code.
2. Nên viết test trước implementation đối với từng hành vi nhỏ.
3. Test phải thất bại đúng lý do trong bước Red.
4. Implementation đầu tiên chỉ cần đủ để đạt Green.
5. Test xanh không có nghĩa chức năng đã hoàn chỉnh.
6. Cần review và bổ sung trường hợp biên.
7. Test phải kiểm tra cả kết quả và side effect.
8. Validation cần diễn ra trước khi thay đổi dữ liệu.
9. Cần chạy lại toàn bộ test sau mỗi thay đổi.
10. Refactor chỉ an toàn khi có test bảo vệ.
11. Coverage cao không thay thế assertion có chất lượng.
12. AI có thể hỗ trợ viết code nhưng không thay thế đánh giá của con người.

TDD giúp phát triển phần mềm theo các bước nhỏ, có thể kiểm tra và dễ kiểm soát. Khi kết hợp TDD với AI, test trở thành hàng rào kỹ thuật giúp xác minh kết quả và hạn chế việc chấp nhận code chưa được kiểm chứng.

Kết quả nghiên cứu này là nền tảng để tiếp tục xây dựng Ticket Manager CLI hoàn chỉnh trong giai đoạn tiếp theo.