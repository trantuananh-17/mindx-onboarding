# Repository instructions for AI agents

These instructions apply to the entire repository.

## Commit convention

Before creating a commit, read:

1. [`docs/commit-convention.md`](docs/commit-convention.md)
2. [`.agents/skills/repository-commits/SKILL.md`](.agents/skills/repository-commits/SKILL.md)

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
