# Các lỗi Testing phổ biến và cách tránh

[← Kết quả thực nghiệm](06-experiment-results.md) · [Mục lục research](README.md) · [Ba workflow AI →](../workflows/README.md)

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
