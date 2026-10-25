# Nhật ký TDD Week 3

## Vòng 01 — MockKBClient search

**Ngày:** 2026-10-25  
**Cấp test:** Unit

Red → Green: test search + topK trước implementation. Regression: `mock-kb-client.test.ts`.

## Vòng 02 — HTTP integration qua stub

**Ngày:** 2026-10-25  
**Yêu cầu:** Days 3–4 — HTTP client cùng hành vi mock  
**Cấp test:** Integration

### Red

Test `http-kb-integration.test.ts`: gọi 4 operation qua `HttpKBClient` tới URL stub.
Ban đầu **fail** vì chưa có `startKbApiStub`.

### Green

Implement `src/stub/kb-api-stub.ts` map POST `/search|list|retrieve|add` → `KBClient`.

### Refactor

Dùng chung `MockKBClient` làm backend stub để so sánh parity mock vs HTTP trong cùng test.

**Regression:** `pnpm test` (toàn bộ week_3).

## Vòng 03 — Search response rút gọn

**Ngày:** 2026-10-25  
**Cấp test:** Unit `http-kb-client.test.ts`

### Red

Test expect chuẩn hóa `{ id, title, nodePath }` → `SearchResult`.

### Green

Thêm `normalizeSearchResults` trong `http-kb-client.ts`.

## Vòng 04 — CLI + HTTP E2E

**Ngày:** 2026-10-25  
**Cấp test:** Integration + E2E process

Test `kb-cli-http.test.ts` với stub; E2E process chỉ mock (xem integration HTTP).

---

## Phụ lục — Vòng TDD xác minh (tái hiện 2026-10-25)

Vòng mẫu cho **Week 3+**: chuẩn hóa search API rút gọn. Các week sau phải có ít nhất
một phụ lục kiểu này; agent workflow: [`.agents/skills/tdd-evidence/SKILL.md`](../../.agents/skills/tdd-evidence/SKILL.md).

### Red — assertion (hành vi sai)

Thêm test `chuẩn hóa kết quả search rút gọn từ API` trước `normalizeSearchResults`.
Tạm thời trả thẳng `payload.results` (không map) để tái hiện Red:

```bash
pnpm exec vitest run tests/unit/http-kb-client.test.ts -t "chuẩn hóa" --reporter=verbose
```

**Log gốc (exit code 1):**

```text
 × HttpKBClient > chuẩn hóa kết quả search rút gọn từ API
   → expected undefined to be 'title'

AssertionError: expected undefined to be 'title'
 ❯ tests/unit/http-kb-client.test.ts:58:35
     58|     expect(results[0]?.matchType).toBe("title");
```

### Green — diff tối thiểu

```diff
+function normalizeSearchResults(rawResults: unknown[]): SearchResult[] { ... }
 async search(...) {
-  return payload.results ?? [];
+  return normalizeSearchResults(payload.results ?? []);
 }
```

**Log Green:** `1 passed` cho test trên; regression `pnpm test` (21 passed).

### Refactor

Không tách file thêm; giữ helper cùng `http-kb-client.ts` vì một consumer. Hành vi không đổi.

### Git mong đợi (từ Week 2 trở đi)

Ba commit (hoặc một commit + phụ lục này nếu user yêu cầu gom):

1. `test(week_3): expect slim search rows mapped to SearchResult`
2. `feat(week_3): normalize slim KB search API results`
3. `refactor(week_3): …` (bỏ qua nếu không refactor)

**Lưu ý:** Lịch sử hiện tại gom stub + HTTP trong `5a0d437` — coi phụ lục + skill mới là
chuẩn cho các thay đổi **tiếp theo**, không rewrite history cũ.
