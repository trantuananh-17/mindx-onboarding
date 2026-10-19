# Yêu cầu và quy tắc nghiệp vụ

## 1. Người dùng và nhu cầu

Người dùng là một cá nhân muốn quản lý ticket cục bộ từ terminal mà không cần server
hoặc tài khoản. Người dùng cần tạo, tra cứu, lọc và thay đổi trạng thái ticket; dữ liệu
phải còn nguyên giữa các lần chạy.

## 2. Mô hình ticket dự kiến

| Thuộc tính | Bắt buộc | Quy tắc dự kiến |
| --- | --- | --- |
| `id` | Có | Số nguyên dương, duy nhất, do hệ thống cấp và không tái sử dụng |
| `title` | Có | Cắt khoảng trắng hai đầu; sau khi cắt phải dài 1–100 ký tự |
| `description` | Không | Mặc định rỗng; cắt khoảng trắng hai đầu; tối đa 1.000 ký tự |
| `status` | Có | Một trong `open`, `in-progress`, `closed`; mặc định `open` |
| `priority` | Có | Một trong `low`, `medium`, `high`; mặc định `medium` |
| `tags` | Có | Danh sách mặc định rỗng; chuẩn hóa chữ thường, bỏ khoảng trắng và phần tử trùng |
| `createdAt` | Có | Thời điểm tạo theo ISO 8601, do hệ thống cấp |
| `updatedAt` | Có | Thời điểm cập nhật gần nhất theo ISO 8601 |

Các giới hạn độ dài là quyết định đề xuất cho Week 2. Trước khi triển khai vòng TDD đầu
tiên, cần xác nhận lại với người hướng dẫn nếu đề bài chính thức quy định khác.

## 3. Đặc tả lệnh

### 3.1. Tạo ticket

Lệnh mục tiêu:

```text
tickets create --title <title> [--description <text>] [--priority <value>] [--tags <list>]
```

Hành vi:

- Từ chối khi thiếu `title`, title rỗng hoặc chỉ có khoảng trắng.
- Từ chối priority ngoài tập giá trị cho phép.
- Nhận tags dưới dạng danh sách phân tách bằng dấu phẩy.
- Tạo ticket với trạng thái `open`.
- Lưu ticket trước khi báo thành công.
- In tối thiểu `id` và `title` của ticket vừa tạo.
- Không thay đổi kho dữ liệu nếu validation thất bại.

### 3.2. Liệt kê ticket

Lệnh mục tiêu:

```text
tickets list [--status <value>] [--priority <value>] [--tag <value>]
```

Hành vi:

- Không có bộ lọc thì trả tất cả ticket.
- Nhiều bộ lọc khác loại được kết hợp theo điều kiện AND.
- `--tag` khớp chính xác sau khi chuẩn hóa chữ thường.
- Từ chối status hoặc priority không hợp lệ.
- Kết quả sắp xếp theo `id` tăng dần để đầu ra ổn định.
- Kho dữ liệu rỗng trả thông báo dễ hiểu và vẫn được xem là thành công.

### 3.3. Xem chi tiết

Lệnh mục tiêu:

```text
tickets show <id>
```

Hành vi:

- Hiển thị toàn bộ thuộc tính của ticket khi tìm thấy.
- Từ chối `id` không phải số nguyên dương.
- Báo lỗi rõ ràng khi ticket không tồn tại.

### 3.4. Cập nhật trạng thái

Lệnh mục tiêu:

```text
tickets update <id> --status <value>
```

Hành vi:

- Chỉ cập nhật trạng thái trong phạm vi Week 2.
- Từ chối `id` hoặc status không hợp lệ.
- Báo lỗi khi ticket không tồn tại.
- Cập nhật `updatedAt` khi thay đổi thành công.
- Không thay đổi dữ liệu nếu bất kỳ validation nào thất bại.

## 4. Quy tắc lưu trữ JSON

- Đường dẫn tệp dữ liệu có giá trị mặc định và có thể được thay bằng cấu hình để test
  không đụng dữ liệu thật.
- Nếu tệp chưa tồn tại, hệ thống coi đó là kho dữ liệu rỗng.
- Nếu tệp rỗng, JSON sai cú pháp hoặc cấu trúc không hợp lệ, hệ thống báo lỗi; không tự
  động ghi đè tệp.
- Sau mỗi thao tác ghi thành công, JSON phải đọc lại được và giữ đầy đủ ticket cũ.
- Mỗi test dùng thư mục tạm riêng và dọn tài nguyên sau khi chạy.
- Nên ghi vào tệp tạm rồi thay thế tệp chính để giảm nguy cơ hỏng dữ liệu khi tiến trình
  bị gián đoạn.

## 5. Đầu ra và lỗi

- Kết quả thành công đi ra standard output.
- Thông báo lỗi đi ra standard error.
- Thông báo lỗi nêu được nguyên nhân và cách sửa ngắn gọn; không lộ stack trace trong
  luồng sử dụng bình thường.
- Mã thoát `0` cho thành công và mã khác `0` cho lỗi.
- Câu chữ đầu ra phải ổn định để integration test có thể kiểm tra phần thông tin quan
  trọng mà không phụ thuộc toàn bộ định dạng trình bày.

## 6. Tiêu chí chấp nhận theo tính năng

### Create

- [x] Tạo được ticket tối thiểu chỉ với title.
- [x] Lưu đúng giá trị mặc định.
- [x] Chuẩn hóa title và tags.
- [x] Từ chối title và priority không hợp lệ mà không ghi dữ liệu.

### List

- [x] Liệt kê được toàn bộ ticket.
- [x] Mỗi bộ lọc hoạt động độc lập.
- [x] Nhiều bộ lọc kết hợp đúng quy tắc AND.
- [x] Kho rỗng và kết quả lọc rỗng được xử lý rõ ràng.

### Show

- [x] Hiển thị đúng ticket theo ID.
- [x] Phân biệt ID sai định dạng và ticket không tồn tại.

### Update

- [x] Cập nhật và lưu trạng thái hợp lệ.
- [x] Không làm thay đổi các trường khác ngoài status và `updatedAt`.
- [x] Từ chối trạng thái sai hoặc ticket không tồn tại mà không làm hỏng dữ liệu.

## 7. Câu hỏi cần chốt trước khi triển khai

- Tên tệp và vị trí dữ liệu mặc định là gì? **`data/tickets.json` (cwd); override bằng `TICKETS_DATA_FILE`.**
- Có bắt buộc dùng một thư viện CLI cụ thể không? **Không; dùng `node:util.parseArgs`.**
- Đầu ra chỉ cần dạng văn bản hay cần thêm JSON? **Chỉ văn bản cho Week 2.**
- Quy tắc chuyển trạng thái có tự do hay phải theo chuỗi
  `open → in-progress → closed`? **Chuyển tự do giữa các status hợp lệ.**

Nếu không có yêu cầu bổ sung, kế hoạch mặc định cho phép chuyển giữa mọi trạng thái hợp
lệ và chỉ cung cấp đầu ra văn bản.
