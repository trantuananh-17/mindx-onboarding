# Nguồn tham khảo và cách kiểm chứng

[← Mục lục tài liệu Week 1](README.md)

## Nguồn đã dùng

| Nguồn | Nhận định được tham khảo |
|---|---|
| [Agile Alliance – Test-Driven Development](https://agilealliance.org/glossary/tdd/) | TDD đan xen test, code và thiết kế; vòng lặp viết một test, thấy nó fail, viết vừa đủ code rồi refactor |
| [Martin Fowler – Test Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html) | Red–Green–Refactor và việc lập danh sách test case nhỏ trước khi lặp |
| [Martin Fowler – Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html) | Nên có nhiều test cấp thấp hơn broad-stack/E2E vì test cấp cao thường chậm, tốn kém và dễ không ổn định hơn |
| [Vitest – Writing Tests](https://vitest.dev/guide/learn/writing-tests) | Cách tổ chức `test`/`it`, `expect` và assertion trong demo |
| [TypeScript – `tsc` CLI options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) | `--noEmit` cho phép kiểm tra bằng compiler mà không tạo output JavaScript |
| [Node.js – Process](https://nodejs.org/api/process.html) | Ý nghĩa của `stdout`, `stderr`, exit code và lưu ý khi kết thúc process CLI |
| [NIST AI 600-1 – Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1) | GenAI có thể tạo nội dung hoặc lập luận sai nhưng trình bày tự tin; output cần được đánh giá và kiểm chứng |

Các nguồn trên được dùng làm nền cho định nghĩa và nguyên tắc chung. Các quyết
định riêng của bài — chọn `addTicket`, dùng repository trong bộ nhớ, các test
case cụ thể và nhận xét về kết quả `1 failed`, `3 failed | 2 passed`, `5 passed`
— là **tự đúc kết từ thực nghiệm trong repository**, không phải kết luận trích
từ các nguồn trên.

## Cách xác minh thông tin do AI cung cấp

1. Tách câu trả lời AI thành claim có thể kiểm tra: định nghĩa, API/tool option,
   hành vi nghiệp vụ và kết quả chạy.
2. Với kiến thức TDD, ưu tiên sách/tổ chức chuyên môn và tài liệu tác giả uy tín;
   với Vitest, TypeScript và Node.js, ưu tiên tài liệu chính thức thay vì blog.
3. Mở đúng trang nguồn và kiểm tra nguồn thực sự hỗ trợ claim; không dùng một
   link chỉ vì tiêu đề có vẻ liên quan.
4. Với claim về code, dùng test có assertion cụ thể, type-check và review trạng
   thái dữ liệu. Kết quả chạy trong máy quan trọng hơn lời khẳng định của AI.
5. Nếu nguồn và AI mâu thuẫn, sửa hoặc loại bỏ câu trả lời AI; nếu chưa thể kiểm
   chứng, ghi rõ đó là giả định thay vì trình bày như sự thật.
