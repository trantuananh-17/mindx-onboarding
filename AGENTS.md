# Repository instructions for AI agents

These instructions apply to the entire repository.

## TDD evidence (Week 2 onward)

When implementing or extending **`week_2`**, **`week_3`**, or later weekly projects, read
[`.agents/skills/tdd-evidence/SKILL.md`](.agents/skills/tdd-evidence/SKILL.md) **before
writing production code** for a new behavior.

Requirements in short:

- Red: run tests, save assertion failure log (not import/syntax noise).
- Green: minimal code, save `git diff` hunk, run full project tests.
- Refactor: separate step; diff must not change behavior under test.
- Prefer **separate commits** (`test` → `feat`/`fix` → `refactor`) with `TDD evidence:` in
  each body; update `week_N/docs/06-nhat-ky-tdd.md` for at least one verifiable cycle.

Do not deliver one large `feat(week_N)` commit without logs/diffs unless the user explicitly
asks for a single commit—and then evidence still belongs in the commit body and journal.

## Commit convention

Before creating a commit, read:

1. [`docs/commit-convention.md`](docs/commit-convention.md)
2. [`.agents/skills/repository-commits/SKILL.md`](.agents/skills/repository-commits/SKILL.md)
3. [`.agents/skills/tdd-evidence/SKILL.md`](.agents/skills/tdd-evidence/SKILL.md) when the
   change is in a Week 2+ project using TDD

Use this header format:

```text
<type>(<scope>): <description>

Summary:
- <completed change>
- <completed change>

Verification:
- <check and result>
```

The scope is normally the exact top-level folder affected, such as `week_1`.
Use `repo` when a change affects repository-wide instructions, configuration,
or more than one top-level project folder.

Examples:

```text
feat(week_1): add ticket creation flow
fix(week_1): reject whitespace-only ticket titles
refactor(week_1): separate ticket storage from domain logic
docs(repo): document commit conventions for AI agents
```

Every commit must include a body that explains what changed. Prefer concrete
bullet points and include verification results when checks were run. AI agents
must not use `git commit -m`; use `git commit -F -` with the complete message
provided through standard input so the commit remains non-interactive and can
contain a detailed body.

Do not create, amend, squash, or push a commit unless the user has requested
that Git operation. Never include unrelated user changes in a commit.
