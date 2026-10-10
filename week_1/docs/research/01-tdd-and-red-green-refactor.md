# TDD và Red–Green–Refactor

[← Mục lục research](README.md) · [Mục lục Week 1](../README.md) · [Tiếp: Các cấp kiểm thử →](02-testing-levels.md)

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
