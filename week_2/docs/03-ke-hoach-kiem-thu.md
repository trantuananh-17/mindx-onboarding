# Kế hoạch kiểm thử

## 1. Mục tiêu

Bộ test phải chứng minh các hành vi người dùng quan sát được, các quy tắc nghiệp vụ quan
trọng và độ an toàn của lưu trữ JSON. Test không nên khóa chặt cấu trúc nội bộ hoặc chỉ
kiểm tra rằng một mock đã được gọi.

## 2. Phân tầng test

### Unit test

Phạm vi: model, validation, service và filter.

- Chạy nhanh, không chạm filesystem.
- Dùng repository trong bộ nhớ và clock cố định.
- Tập trung vào một quy tắc hoặc hành vi trong mỗi test.

### Integration test cho storage

Phạm vi: JSON repository và filesystem thật trong thư mục tạm.

- Kiểm tra vòng đọc–ghi.
- Kiểm tra tệp thiếu, tệp hỏng và cấu trúc JSON sai.
- Kiểm tra dữ liệu cũ không bị mất sau khi ghi.

### Integration test cho CLI

Phạm vi: tham số dòng lệnh đến đầu ra và dữ liệu lưu.

- Kiểm tra stdout, stderr và mã thoát.
- Dùng đường dẫn dữ liệu tạm cho từng test.
- Ưu tiên một số hành trình quan trọng thay vì lặp lại toàn bộ unit test.

## 3. Ma trận test tối thiểu

| Mã | Hành vi | Cấp test | Kết quả mong đợi |
| --- | --- | --- | --- |
| C01 | Tạo chỉ với title hợp lệ | Unit + CLI | Có ID; status `open`; priority `medium`; đã lưu |
| C02 | Title được cắt khoảng trắng | Unit | Giá trị lưu đã chuẩn hóa |
| C03 | Thiếu/rỗng/chỉ khoảng trắng ở title | Unit + CLI | Báo validation; không ghi dữ liệu |
| C04 | Priority không hợp lệ | Unit + CLI | Báo validation; không ghi dữ liệu |
| C05 | Tags có hoa, khoảng trắng và trùng | Unit | Danh sách chữ thường, sạch và duy nhất |
| C06 | Tạo nhiều ticket | Unit + Storage | ID tăng, không ghi đè ticket cũ |
| L01 | List không filter | Unit + CLI | Trả tất cả theo ID tăng dần |
| L02 | Filter riêng theo status | Unit | Chỉ trả ticket khớp |
| L03 | Filter riêng theo priority | Unit | Chỉ trả ticket khớp |
| L04 | Filter riêng theo tag | Unit | Khớp chính xác sau chuẩn hóa |
| L05 | Kết hợp nhiều filter | Unit + CLI | Áp dụng AND giữa các loại filter |
| L06 | Kho hoặc kết quả lọc rỗng | Unit + CLI | Thông báo rỗng; mã thoát thành công |
| S01 | Show với ID tồn tại | Unit + CLI | Hiển thị đúng toàn bộ ticket |
| S02 | Show với ID sai định dạng | Unit + CLI | Báo validation; mã thoát lỗi |
| S03 | Show với ID không tồn tại | Unit + CLI | Báo not found; mã thoát lỗi |
| U01 | Update sang status hợp lệ | Unit + CLI | Status và `updatedAt` đổi; các trường khác giữ nguyên |
| U02 | Update với status sai | Unit + CLI | Báo validation; dữ liệu không đổi |
| U03 | Update ticket không tồn tại | Unit + CLI | Báo not found; dữ liệu không đổi |
| J01 | Đọc khi tệp chưa tồn tại | Storage | Trả kho rỗng |
| J02 | Ghi rồi đọc lại | Storage | Dữ liệu round-trip không mất |
| J03 | JSON sai cú pháp | Storage + CLI | Báo storage error; tệp gốc giữ nguyên |
| J04 | JSON đúng cú pháp nhưng sai cấu trúc | Storage | Báo storage error; không coi là dữ liệu hợp lệ |
| J05 | Không có quyền ghi hoặc ghi thất bại | Storage | Báo lỗi có ngữ cảnh; không báo thành công giả |

## 4. Thứ tự vòng TDD đề xuất

1. Tạo ticket hợp lệ với giá trị mặc định.
2. Validation và chuẩn hóa title.
3. Priority, description và tags.
4. Cấp ID duy nhất và giữ ticket đã có.
5. List toàn bộ và thứ tự ổn định.
6. Từng filter độc lập, sau đó kết hợp filter.
7. Show ticket và not found.
8. Update status và giữ nguyên các trường còn lại.
9. JSON repository: tệp thiếu, round-trip, tệp hỏng.
10. CLI integration cho bốn hành trình chính và lỗi tiêu biểu.

Mỗi mục có thể cần nhiều vòng Red–Green–Refactor nhỏ. Không viết toàn bộ test của một
tính năng rồi mới triển khai tất cả cùng lúc.

## 5. Chuẩn chất lượng test

Mỗi test cần trả lời được:

- Hành vi hoặc rủi ro nào đang được bảo vệ?
- Nếu implementation sai, assertion nào sẽ thất bại?
- Test có độc lập với thứ tự chạy không?
- Test có dùng dữ liệu và thời gian cố định không?
- Tên test có mô tả điều kiện và kết quả mong đợi không?

Tránh:

- Assertion quá yếu như chỉ kiểm tra kết quả tồn tại.
- Kiểm tra private function hoặc cấu trúc nội bộ không quan sát được.
- Snapshot lớn cho toàn bộ output CLI.
- Dùng chung tệp dữ liệu giữa các test.
- Mock mọi dependency đến mức test không còn kiểm tra hành vi thật.

## 6. Cổng chất lượng trước khi hoàn thành

- [x] Test mới từng được quan sát ở trạng thái đỏ đúng lý do.
- [x] Toàn bộ unit test qua.
- [x] Toàn bộ integration test qua trên thư mục tạm sạch.
- [x] Type-check qua.
- [x] Chạy thủ công một hành trình create → list → show → update → show.
- [x] Kiểm tra thủ công một tệp JSON hỏng không bị ghi đè.
- [x] Không còn test bị skip hoặc chỉ chạy riêng.
- [x] Không có test phụ thuộc dữ liệu từ lần chạy trước.
- [x] Minh chứng và kết quả kiểm tra được ghi vào nhật ký TDD/README.

## 7. Truy vết tiêu chí của kế hoạch gốc

| Tiêu chí Week 2 | Bằng chứng dự kiến |
| --- | --- |
| Có quy trình Red–Green–Refactor | Nhật ký TDD ghi test đỏ, thay đổi tối thiểu, test xanh và refactor |
| Bốn lệnh CLI hoạt động | CLI integration test và kiểm tra thủ công |
| Unit test nghiệp vụ/validation | Nhóm test C, L, S và U |
| Integration test JSON/CLI | Nhóm J và các test CLI |
| Error case đầy đủ | C03–C04, S02–S03, U02–U03, J01–J05 |
| Có hướng dẫn setup/usage | README hoàn thiện ở Ngày 5 |
| Giải thích được TDD và validation AI | Nhật ký quyết định, review test và phần tổng kết |
