# Thực nghiệm `addTicket` bằng Red–Green–Refactor

[← AI reliability](04-ai-reliability.md) · [Mục lục research](README.md) · [Tiếp: Kết quả thực nghiệm →](06-experiment-results.md)

## 5.11 Thực nghiệm kiểm soát code AI bằng Red–Green–Refactor

Để kiểm chứng cách Testing kiểm soát code do AI tạo ra, tôi tạo một repository TypeScript nhỏ và áp dụng TDD cho một function duy nhất là `addTicket`.

Repository sử dụng:

- TypeScript để kiểm tra kiểu dữ liệu.
- Vitest để chạy Unit Test.
- `InMemoryTicketRepository` để lưu ticket trong bộ nhớ.
- `pnpm test` để chạy toàn bộ test.
- `pnpm typecheck` để kiểm tra lỗi TypeScript.

Mục tiêu của thực nghiệm không phải xây dựng toàn bộ Ticket Manager CLI. Mục tiêu là chứng minh rằng test có thể giới hạn phạm vi triển khai, phát hiện trường hợp AI bỏ sót và kiểm tra kết quả trước khi chấp nhận code.

## 5.11.1 Yêu cầu của function `addTicket`

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

## 5.11.2 Vòng thứ nhất – Red: viết test trước implementation

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

## 5.11.3 Vòng thứ nhất – Green: implementation tối thiểu

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

## 5.11.4 Vòng thứ hai – Red: bổ sung trường hợp biên

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

## 5.11.5 Vòng thứ hai – Green: bổ sung validation

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

## 5.11.6 Refactor sau khi test thành công

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
