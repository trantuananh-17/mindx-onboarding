# Kiến trúc dự kiến

## 1. Mục tiêu kiến trúc

- Giữ command handler mỏng và dễ kiểm thử.
- Tách quy tắc nghiệp vụ khỏi chi tiết đọc/ghi tệp.
- Cho phép test nghiệp vụ bằng kho dữ liệu trong bộ nhớ.
- Cho phép test JSON storage trong thư mục tạm.
- Tạo nền tảng để Week 3 thêm client API mà không phải viết lại toàn bộ CLI.

## 2. Luồng phụ thuộc

```text
Người dùng
    ↓
CLI / command handler
    ↓
Service / use case
    ↓
Ticket repository (hợp đồng)
    ↓
JSON repository (triển khai cục bộ)
    ↓
Tệp dữ liệu
```

Chiều phụ thuộc đi từ lớp bên ngoài vào hợp đồng nghiệp vụ. Service không biết cú pháp
CLI và không phụ thuộc trực tiếp vào API đọc/ghi tệp.

## 3. Trách nhiệm từng phần

### Model và validation

- Định nghĩa cấu trúc Ticket, Status, Priority và đầu vào của từng use case.
- Chuẩn hóa và kiểm tra dữ liệu nghiệp vụ.
- Không đọc tham số CLI và không truy cập filesystem.

### Service / use case

- Điều phối `create`, `list`, `show` và `update status`.
- Gọi repository qua hợp đồng.
- Phân biệt lỗi validation, không tìm thấy và lỗi lưu trữ.
- Không quyết định cách trình bày đầu ra terminal.

### Repository contract

- Cung cấp các thao tác tối thiểu mà use case cần: lấy danh sách, tìm theo ID, cấp ID
  tiếp theo và lưu tập dữ liệu.
- Không chứa chi tiết về cờ CLI.
- Có thể có triển khai trong bộ nhớ cho unit test và triển khai JSON cho ứng dụng.

### JSON repository

- Đọc, kiểm tra cấu trúc và ghi dữ liệu JSON.
- Xử lý tệp chưa tồn tại như dữ liệu rỗng.
- Báo lỗi có kiểm soát khi tệp hỏng.
- Không áp dụng quy tắc title, status, priority hoặc filter.

### CLI / command handler

- Khai báo lệnh và option.
- Chuyển đổi chuỗi đầu vào thành kiểu mà service cần.
- Gọi đúng use case, định dạng kết quả và ánh xạ lỗi sang standard error/mã thoát.
- Không tự sửa dữ liệu hoặc đọc/ghi JSON trực tiếp.

## 4. Cấu trúc thư mục dự kiến khi triển khai

```text
week_2/
├── src/
│   ├── cli/
│   ├── domain/
│   ├── services/
│   └── storage/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/
├── README.md
└── các tệp cấu hình dự án
```

Đây là bản đồ trách nhiệm, không phải yêu cầu phải tạo nhiều tệp ngay từ đầu. Chỉ tách
module khi hành vi hoặc dependency thực sự cần đến.

## 5. Quyết định kỹ thuật đề xuất

| Chủ đề | Quyết định | Lý do |
| --- | --- | --- |
| Ngôn ngữ | TypeScript trên Node.js | Tiếp nối Week 1 và phù hợp đầu vào Week 3 |
| Package manager | pnpm | Giữ nhất quán với Week 1 |
| Test runner | Vitest | Đã được dùng và kiểm chứng ở Week 1 |
| Lưu trữ | Một tệp JSON | Đúng phạm vi bài tập, dễ quan sát trong integration test |
| ID | Số nguyên tăng dần | Tiếp nối demo Week 1 và dễ thao tác trên CLI |
| Thời gian | ISO 8601 | Dễ lưu trữ, so sánh và đọc độc lập múi giờ |
| Dependency injection | Truyền repository/clock vào service | Test quyết định được dữ liệu và thời gian |

Không dùng Express, Hono hoặc NestJS cho CLI vì chúng giải quyết bài toán HTTP server.
Với bốn lệnh trong phạm vi hiện tại, TypeScript chạy trên Node.js và
`node:util.parseArgs` là đủ. Chỉ cân nhắc Commander hoặc CAC nếu số lượng subcommand,
option và help text tăng đến mức parser thuần làm command handler khó đọc hoặc khó test.

## 6. Ranh giới test

- Unit test gọi trực tiếp model/service với repository trong bộ nhớ và clock giả.
- Test double dùng `vi.fn` tại các boundary như repository, clock và CLI I/O để vừa cung
  cấp hành vi kiểm soát được, vừa kiểm tra tương tác quan trọng.
- Storage integration test gọi JSON repository trên tệp tạm thật.
- CLI integration test chạy entry point với tham số và tệp dữ liệu tạm, sau đó kiểm tra
  stdout, stderr, mã thoát và dữ liệu đã lưu.
- Không mock filesystem trong integration test vì mục tiêu chính là kiểm tra hành vi đọc
  và ghi thực tế.
- Không mock chính service/use case đang được kiểm tra; nếu làm vậy, test chỉ xác nhận
  cấu hình mock thay vì xác nhận nghiệp vụ.

## 7. Chiến lược lỗi

Nhóm lỗi cần phân biệt:

- Validation: đầu vào không đúng quy tắc.
- Not found: ID hợp lệ nhưng không có ticket.
- Storage: không đọc/ghi được hoặc dữ liệu JSON hỏng.
- Unexpected: lỗi lập trình hoặc tình huống chưa dự kiến.

Lớp nghiệp vụ trả lỗi có ý nghĩa; lớp CLI chịu trách nhiệm biến lỗi thành thông báo và
mã thoát. Chỉ boundary ngoài cùng mới quyết định cách hiển thị lỗi.

## 8. Khả năng mở rộng sang Week 3

Week 3 thêm Knowledge Base API chứ không thay đổi bản chất ticket. Những nguyên tắc cần
giữ từ Week 2:

- Command không gọi trực tiếp filesystem hoặc HTTP.
- Dependency bên ngoài đứng sau một hợp đồng rõ ràng.
- Có thể thay triển khai thật bằng mock/fake trong test.
- Lỗi hạ tầng được chuyển thành lỗi có ngữ cảnh trước khi hiển thị.

Không cần xây dựng HTTP abstraction trong Week 2; chỉ cần kiến trúc không cản trở việc
thêm nó sau này.
