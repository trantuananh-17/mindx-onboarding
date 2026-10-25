---
name: tdd-evidence
description: Run Test-Driven Development with verifiable Red-Green-Refactor evidence (test logs and git diffs) for week_2 and later projects. Use when implementing features, fixing behavior with tests, or completing weekly TDD deliverables.
---

# TDD evidence (Week 2+)

Apply this skill **while coding**, not only when writing commit messages. Goal: every
meaningful behavior change leaves **proof** that Red failed for the right reason, Green
was minimal, and Refactor did not change behavior.

Week 1 may stay as-is; **from `week_2` onward** (including `week_3`, `week_4`, …) agents
must follow this workflow unless the user explicitly opts out.

## One cycle (single small behavior)

Work in **one behavior at a time** (one test case or one `it` block worth of intent).

### 1. Red — failing test first

1. Add or extend a test that asserts the **observable behavior** (not implementation trivia).
2. Run the **narrowest** test command and capture output:

   ```bash
   pnpm exec vitest run <path-to-test> -t "<test name fragment>" --reporter=verbose
   ```

3. Confirm failure is **assertion or expected error**, not import/syntax/setup:
   - Good: `AssertionError`, `expected … to throw`, business error message.
   - Bad: `Cannot find module`, parse error — fix setup first; that is not a valid Red.
4. Save for the commit/journal:
   - command run,
   - 5–15 lines of log including file:line,
   - exit code (expect non-zero).

Do **not** write production code for this behavior before Red is recorded.

### 2. Green — minimal production change

1. Implement the **smallest** change to pass the new test only.
2. Re-run the same test command → must pass.
3. Run regression in that project: `pnpm test` (and `pnpm typecheck` when types touched).
4. Capture **`git diff`** for production files only (the Green hunk):

   ```bash
   git diff -- <production paths>
   ```

   Paste the minimal hunk into the commit body or `docs/06-nhat-ky-tdd.md` for the week.

Do **not** refactor or “clean up” in the same edit as Green.

### 3. Refactor — structure only

1. Improve names, extract functions, move files — **no intended behavior change**.
2. Run the same targeted test + full `pnpm test`.
3. Capture diff and **compare** to Green:
   - Refactor diff should not add new branches/rules that the Red test was written to drive.
   - If behavior changed, that is a new cycle (new Red), not Refactor.

4. Optional check:

   ```bash
   git diff <green-commit-or-stash> -- <paths>
   ```

   Narrate in one line: “Refactor: moved X to Y; tests unchanged.”

## Commits (pair with repository-commits skill)

**Default:** three commits per cycle when the user asked for TDD or the week plan requires it:

| Order | Type | Stages |
| --- | --- | --- |
| 1 | `test(week_N)` | Red only — new/changed tests, still failing if reverted without prod |
| 2 | `feat` or `fix(week_N)` | Green — minimal prod + passing tests |
| 3 | `refactor(week_N)` | Refactor — optional; skip if nothing to refactor |

Each commit body includes **`TDD evidence:`** with real captured log/diff snippets (not
“implemented feature”).

**Do not** squash Red+Green+Refactor into one `feat` commit for weekly homework unless the
user explicitly requests a single deliverable commit; even then, append full `TDD evidence`
and update `week_N/docs/06-nhat-ky-tdd.md`.

## Weekly journal

For each week folder that uses TDD, maintain `docs/06-nhat-ky-tdd.md`:

- At least **one** fully documented cycle with Red log, Green diff, Refactor note (same
  format as `week_2/docs/06-nhat-ky-tdd.md` appendix “Vòng TDD xác minh”).
- Shorter rows in a summary table for other cycles are fine.

## Agent checklist before claiming “done”

- [ ] At least one Red failure log pasted or committed in journal/commit.
- [ ] Green diff hunk shown; regression test count recorded.
- [ ] Refactor either absent with reason, or diff shows no behavior change.
- [ ] Commits split by phase OR user explicitly allowed monolithic + evidence complete.

## Example `TDD evidence` block (commit body)

```text
TDD evidence:
- Red: pnpm exec vitest run tests/unit/http-kb-client.test.ts -t "chuẩn hóa" --reporter=verbose
  → AssertionError: expected 'title' to be 'content' (http-kb-client.test.ts:48)
- Green diff: http-kb-client.ts adds normalizeSearchResults for slim API rows
- Refactor: none (cycle complete)
- Regression: pnpm test in week_3 (21 passed)
```
