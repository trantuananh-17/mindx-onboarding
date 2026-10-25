---
name: repository-commits
description: Choose and create repository commits using the local type(scope) convention when the user asks to commit, prepare a commit message, or review commit formatting.
---

# Repository commits

Use this skill only for commit-message selection, commit preparation, or an
explicitly requested commit. It does not grant permission to commit, amend,
squash, or push.

Read [`docs/commit-convention.md`](../../../docs/commit-convention.md) before
choosing the final message.

For **`week_2` and later** folders, read and follow
[`.agents/skills/tdd-evidence/SKILL.md`](../tdd-evidence/SKILL.md) **during
implementation**. Commit messages must cite evidence captured from that workflow
(real test logs and `git diff` hunks), not after-the-fact summaries.

## Required outcome

1. Inspect the actual changed or staged files and determine the change's main
   purpose.
2. Choose the type from the purpose: `feat`, `fix`, `refactor`, `test`, `docs`,
   `perf`, `style`, `build`, `ci`, `chore`, or `revert`.
3. Use the exact top-level project folder as scope when changes are confined to
   it, for example `week_1`. Use `repo` for shared/root-level or multi-project
   changes.
4. Write the header as `<type>(<scope>): <description>` with one space after
   the colon, an imperative description, and no trailing period.
5. Add a body after a blank line. Under `Summary:`, list the material completed
   changes. Under `Verification:`, list each check and its result. A detailed
   paragraph is acceptable when it is clearer than bullets.
6. Keep one logical concern per commit. Do not stage unrelated user changes.
7. Run relevant checks and inspect the staged diff before committing.
8. Do not use `git commit -m`. For non-interactive agent work, provide the full
   message through standard input to `git commit -F -`.
9. After an explicitly requested commit, report the commit hash, header, checks,
   and whether the worktree is clean.

## TDD workflow commits

When the user applies Test-Driven Development, prefer **separate commits** per phase when
practical:

| Phase | Type | Scope example |
| --- | --- | --- |
| Red | `test` | failing test that asserts behavior (not import/syntax noise) |
| Green | `feat` or `fix` | minimal production change to pass the new test |
| Refactor | `refactor` | structure cleanup with tests still green |

Each commit body should make the phase obvious under `Summary:` and, when helpful, under a
`TDD evidence:` section:

- **Red:** test name, command run, and the assertion or error line from Vitest (or paste a
  short log excerpt). State that failure is expected.
- **Green:** point to the minimal diff hunk (file + what changed), not a vague “implemented
  feature”.
- **Refactor:** what moved or was renamed; confirm no behavior change; cite regression
  command result.

Example Green commit body excerpt:

```text
TDD evidence:
- Red: vitest … → AssertionError at create-ticket.test.ts:35 (Title is required)
- Green diff: validation.ts throws ValidationError when trimmed title is empty
- Regression: pnpm test (42 passed)
```

Do not squash Red/Green/Refactor into one commit unless the user explicitly asks for a
single deliverable commit; monolithic history makes TDD review harder.

If a single commit is required, the body **must** still include full `TDD evidence:` (Red
log, Green diff, Refactor comparison) and the agent must update
`week_N/docs/06-nhat-ky-tdd.md` with the same material so reviewers can verify without
replaying Git history.

Examples:

```text
feat(week_1): add ticket creation flow
fix(week_1): reject whitespace-only titles
refactor(week_1): separate storage from ticket logic
docs(repo): document commit conventions for AI agents
```

Full example:

```text
fix(week_1): reject whitespace-only titles

Summary:
- normalize the submitted title before validation
- prevent repository writes when validation fails
- add regression coverage for whitespace-only input

Verification:
- pnpm test (passed)
- pnpm typecheck (passed)
```
