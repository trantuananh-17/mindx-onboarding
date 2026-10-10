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
5. Keep one logical concern per commit. Do not stage unrelated user changes.
6. Run relevant checks and inspect the staged diff before committing.
7. After an explicitly requested commit, report the commit hash, header, checks,
   and whether the worktree is clean.

Examples:

```text
feat(week_1): add ticket creation flow
fix(week_1): reject whitespace-only titles
refactor(week_1): separate storage from ticket logic
docs(repo): document commit conventions for AI agents
```
