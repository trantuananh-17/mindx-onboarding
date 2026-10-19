# Mẫu nhật ký TDD

Sao chép mẫu này cho từng vòng Red–Green–Refactor quan trọng. Nhật ký ghi bằng chứng và
lý do quyết định, không cần chép toàn bộ mã nguồn hoặc toàn bộ log test.

---

## Vòng TDD: [mã và tên hành vi]

**Ngày:** [YYYY-MM-DD]  
**Yêu cầu liên quan:** [ví dụ C03 — từ chối title chỉ có khoảng trắng]  
**Cấp test:** [unit / storage integration / CLI integration]

### 1. Mục tiêu hành vi

- Given: [trạng thái ban đầu]
- When: [hành động]
- Then: [kết quả quan sát được]

### 2. Red

- Test được thêm: [tên test]
- Kết quả thất bại: [thông báo ngắn]
- Vì sao đây là lỗi thất bại mong đợi: [giải thích]
- Xác nhận test không thất bại vì setup/import/syntax: [có/không + ghi chú]

### 3. Green

- Thay đổi tối thiểu: [mô tả]
- Kết quả test mục tiêu: [qua/thất bại]
- Kết quả regression: [số test qua hoặc check đã chạy]
- Có hành vi ngoài yêu cầu được thêm không: [không/có + lý do]

### 4. Refactor

- Vấn đề được cải thiện: [duplication, tên, ranh giới trách nhiệm...]
- Hành vi công khai có thay đổi không: [không/có + lý do]
- Kết quả sau refactor: [check và kết quả]

### 5. Kiểm soát AI

- AI được hỏi điều gì: [nếu có]
- Các giả định AI đưa ra: [liệt kê]
- Đề xuất nào đã bị loại hoặc sửa: [nội dung và lý do]
- Cách kiểm chứng cuối cùng: [test, review, tài liệu chính thức, chạy thủ công]

### 6. Kết luận

- Bằng chứng đáp ứng yêu cầu: [test/check cụ thể]
- Rủi ro hoặc việc tiếp theo: [nếu có]

---

## Bảng tổng hợp tiến độ

| Vòng | Hành vi | Red đã quan sát | Green | Refactor | Regression | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 01 |  | [ ] | [ ] | [ ] | [ ] |  |
| 02 |  | [ ] | [ ] | [ ] | [ ] |  |
| 03 |  | [ ] | [ ] | [ ] | [ ] |  |

## Checklist chất lượng nhật ký

- [ ] Mỗi vòng chỉ tập trung vào một hành vi nhỏ.
- [ ] Có bằng chứng test từng thất bại đúng lý do trước khi triển khai.
- [ ] Phần Green mô tả thay đổi nhỏ nhất, không chỉ ghi “đã sửa”.
- [ ] Refactor chỉ diễn ra khi test xanh.
- [ ] Kết quả regression được ghi cụ thể.
- [ ] Đề xuất của AI được đánh giá, không được ghi như nguồn sự thật mặc định.
- [ ] Nhật ký đủ rõ để giải thích lại quá trình mà không cần dựa vào trí nhớ.
