# Week 1 — TDD & AI Training Documentation

## Phạm vi

Week 1 là bài nghiên cứu TDD và thực hành cách làm việc với AI. Phần
TypeScript/Vitest chỉ là demo nhỏ để kiểm chứng lập luận, không phải một Ticket
Manager CLI hoàn chỉnh.

## Tóm tắt

- TDD sử dụng vòng lặp Red–Green–Refactor để mô tả, triển khai và cải thiện từng
  hành vi nhỏ.
- Unit, Integration và E2E Test trả lời các câu hỏi khác nhau; không loại nào
  thay thế hoàn toàn hai loại còn lại.
- Test xanh chỉ chứng minh những hành vi đã được test. Kết quả AI vẫn cần được
  phản biện, review, chạy kiểm chứng và đối chiếu nguồn.
- Demo `addTicket` đạt 5/5 test và type-check, nhưng không đại diện cho một CLI
  hoàn chỉnh.

## Mục lục

### 1. Nghiên cứu TDD

Xem [mục lục phần nghiên cứu](research/README.md), gồm:

1. [TDD và Red–Green–Refactor](research/01-tdd-and-red-green-refactor.md)
2. [Unit Test, Integration Test và E2E Test](research/02-testing-levels.md)
3. [Test case cho Ticket Manager CLI](research/03-cli-test-cases.md)
4. [Testing kiểm soát code do AI tạo ra](research/04-ai-reliability.md)
5. [Thực nghiệm `addTicket`](research/05-add-ticket-experiment.md)
6. [Kết quả và bài học từ thực nghiệm](research/06-experiment-results.md)
7. [Các lỗi testing phổ biến](research/07-testing-pitfalls.md)

### 2. Ba workflow làm việc với AI

Xem [mục lục workflow](workflows/README.md), hoặc mở trực tiếp:

1. [Layered Questioning](workflows/01-layered-questioning.md)
2. [Solution Exploration](workflows/02-solution-exploration.md)
3. [Iterative Refinement](workflows/03-iterative-refinement.md)

### 3. Evidence và nguồn

- [Minh chứng Red–Green–Refactor](tdd-iterations.md)
- [Nguồn tham khảo và cách kiểm chứng thông tin AI](references.md)
- [Unit Test đang chạy](../tests/ticket.test.ts)
- [Implementation `addTicket`](../src/ticket.ts)

## Thứ tự đọc đề xuất

Nếu cần review nhanh, đọc phần tóm tắt trên, ba workflow AI, kết quả thực nghiệm
và nguồn tham khảo. Các file research còn lại dùng để tra cứu chi tiết.

## Kết luận ngắn

TDD giúp biến yêu cầu thành phản hồi có thể chạy lại, nhưng chất lượng kết quả
vẫn phụ thuộc vào chất lượng yêu cầu và assertion. Khi làm việc với AI, con
người vẫn chịu trách nhiệm phản biện, xác minh nguồn, kiểm tra side effect và
quyết định có chấp nhận kết quả hay không.
