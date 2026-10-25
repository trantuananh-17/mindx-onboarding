# Commit Convention

This convention applies to the entire repository and is intended for both
humans and AI coding agents.

## Format

```text
<type>(<scope>): <description>

Summary:
- <completed change>
- <completed change>

Verification:
- <check and result>
```

Use one space after the colon. Write a short, imperative description without a
trailing period. The first line is the summary header; the body records the
details needed to understand the commit later.

Examples:

```text
feat(week_1): add ticket creation flow
fix(week_1): prevent duplicate ticket IDs
refactor(week_1): extract ticket repository interface
test(week_1): cover invalid ticket titles
docs(week_1): split TDD research by topic
docs(repo): add AI commit instructions
chore(repo): update shared development settings
```

## Required body

Every commit must include a body. Leave one blank line after the header, then
describe the completed work in enough detail that a later reviewer can
understand the change without reopening every file.

Use this default structure:

```text
feat(week_1): add ticket creation flow

Summary:
- add the command handler and title validation
- persist new tickets through the repository interface
- document the supported inputs and failure behavior

Verification:
- pnpm test (5 tests passed)
- pnpm typecheck (passed)
```

The body may be a detailed paragraph instead of bullets when that communicates
the change more clearly. Do not repeat the header without adding information.
Mention important decisions, limitations, migrations, or breaking behavior
when relevant.

## Creating the commit

Do not use `git commit -m`, including repeated `-m` flags. For AI and other
non-interactive automation, pass the complete message through standard input:

```powershell
@'
docs(repo): improve commit documentation

Summary:
- require detailed commit bodies
- document non-interactive commit creation for AI agents

Verification:
- repository commit skill validation passed
'@ | git commit -F -
```

A human working interactively may run `git commit` and write the same structure
in the configured editor. `git commit -F <path>` is also acceptable when a
temporary message file is already available; do not add that file to the
repository.

## Types

| Type | Use when |
|---|---|
| `feat` | Adding or extending user-visible behavior |
| `fix` | Correcting a defect or unintended behavior |
| `refactor` | Restructuring code without changing its intended behavior |
| `test` | Adding or changing tests without production behavior changes |
| `docs` | Changing documentation, examples, AI context, or repository guidance |
| `perf` | Improving performance without changing intended behavior |
| `style` | Formatting code without changing behavior |
| `build` | Changing build tooling, package metadata, or dependencies |
| `ci` | Changing continuous-integration configuration |
| `chore` | Repository maintenance not covered by another type |
| `revert` | Reverting an earlier commit |

Choose the type from the purpose of the change, not merely from the file
extension. For example, fixing incorrect instructions in a Markdown file is
normally `docs`, while changing a fixture that corrects application behavior
may be `fix` or `test` depending on the actual change.

## Scope

Scope identifies the folder or repository area affected:

1. If all changed files belong to one top-level project folder, use that exact
   folder name: `week_1`, `week_2`, and so on.
2. Use `repo` for root-level instructions/configuration, shared tooling, or a
   change spanning multiple top-level project folders.
3. Do not invent a person name, ticket number, or vague scope such as `misc`.

Examples:

```text
feat(week_2): add list command
fix(week_2): preserve tickets when storage write fails
docs(repo): define shared contribution workflow
```

## Description and body

- Keep the header concise; aim for 72 characters or fewer when practical.
- Start the description with a lowercase imperative verb such as `add`, `fix`,
  `extract`, `document`, or `remove`.
- Describe the outcome, not implementation trivia such as “update files”.
- Always add a body describing completed changes. Add further explanation when
  the reason, tradeoff, migration, or verification needs context.
- Mark a breaking change with `!`, for example
  `feat(week_2)!: replace the ticket file format`, and explain it in the body.

## TDD and Week 2+ projects

For `week_2`, `week_3`, and later weekly folders, agents follow
[`.agents/skills/tdd-evidence/SKILL.md`](../.agents/skills/tdd-evidence/SKILL.md):

- Capture Red test logs, Green `git diff`, and Refactor comparison while working.
- Prefer separate commits: `test(week_N)` → `feat`/`fix(week_N)` → `refactor(week_N)`.
- Record at least one verifiable cycle in `week_N/docs/06-nhat-ky-tdd.md`.

A single squashed commit is allowed only when the user asks for it; the commit body and
journal must still include full `TDD evidence:`.

## Selecting commit boundaries

A commit should represent one logical change. Split unrelated work when it has
different purposes or would require different types. Keep related tests and
documentation with the feature or fix they explain when they are part of the
same deliverable.

Before committing:

1. Inspect `git status` and the staged diff.
2. Exclude unrelated user changes.
3. Run checks appropriate to the affected project.
4. Verify the header matches the actual staged change.
5. Prepare a body that lists the material changes and verification results.
6. Commit without `-m`, and only when the user has requested a commit.

Do not amend or push unless the user explicitly asks for that operation.

## AI discovery

- [`AGENTS.md`](../AGENTS.md) provides repository-wide context automatically to
  compatible coding agents.
- [Repository commit skill](../.agents/skills/repository-commits/SKILL.md)
  provides the decision process for agents that support skills.
- [TDD evidence skill](../.agents/skills/tdd-evidence/SKILL.md) governs Red-Green-Refactor
  verification for Week 2 onward.
