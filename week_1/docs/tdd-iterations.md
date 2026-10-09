# TDD Iteration Evidence

## Iteration 1: first behavior

### Red

The first test required `addTicket` to create and save an open ticket. The
function initially threw `Error: Not implemented`.

Observed result:

```text
Test Files  1 failed (1)
Tests       1 failed (1)
```

### Green

The minimum implementation created a ticket with an ID, title, and `open`
status, saved it to the repository, and returned it.

Observed result:

```text
Test Files  1 passed (1)
Tests       1 passed (1)
```

## Iteration 2: refine the behavior

Four tests were added to check empty titles, whitespace-only titles, title
normalization, unique IDs, and preservation of existing tickets.

### Red

The minimum implementation did not validate or normalize titles.

Observed result:

```text
Test Files  1 failed (1)
Tests       3 failed | 2 passed (5)
```

### Green

The implementation was refined to trim the title and reject an empty result
before creating or saving a ticket.

Observed result:

```text
Test Files  1 passed (1)
Tests       5 passed (5)
```

## Refactor result

- Validation happens before the repository is changed.
- The normalized title is used consistently.
- Repository behavior remains separate from the `addTicket` use case.
- All tests pass after the change.
