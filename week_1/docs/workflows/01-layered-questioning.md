# Layered Questioning: Research → Brief → Example → Validation

[← Mục lục workflow](README.md) · [Mục lục Week 1](../README.md) · [Tiếp: Solution Exploration →](02-solution-exploration.md)

Tôi không bắt đầu bằng yêu cầu chung như “hãy làm TDD”. Câu hỏi được thu hẹp
qua bốn lớp:

| Lớp | Câu hỏi/tác vụ tóm tắt | Kết quả được giữ lại | Cách kiểm soát |
|---|---|---|---|
| Research | TDD là gì, Red–Green–Refactor vận hành ra sao, Unit/Integration/E2E khác nhau thế nào, AI có thể sai ở đâu? | [Khung nghiên cứu TDD](../research/README.md) | Đối chiếu định nghĩa và khuyến nghị với [nguồn tham khảo](../references.md) |
| Brief | Trong phạm vi Week 1, cần chứng minh điều gì mà không xây cả CLI? | Chỉ chọn một use case `addTicket` và một repository trong bộ nhớ | Ghi rõ phạm vi trong README và đầu tài liệu |
| Example | Với `addTicket`, hành vi nào quan sát được và trường hợp biên nào quan trọng? | Happy path, ID duy nhất, status `open`, lưu dữ liệu, trim và từ chối title rỗng | Chuyển từng hành vi thành assertion, kể cả side effect |
| Validation | Làm sao biết câu trả lời/implementation dùng được? | Red thất bại đúng lý do; Green đạt 5/5 test; type-check không lỗi | Chạy `pnpm test`, `pnpm typecheck` và review lại yêu cầu |

Workflow này hữu ích vì mỗi lớp tạo đầu vào cụ thể cho lớp tiếp theo. Research
không được chấp nhận chỉ vì nghe hợp lý; nó phải dẫn tới brief có phạm vi, ví dụ
có thể quan sát và bước validation có thể chạy lại.
