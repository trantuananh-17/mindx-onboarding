# Commit Convention

This convention applies to the entire repository and is intended for both
humans and AI coding agents.

## Format

```text
<type>(<scope>): <description>
```

Use one space after the colon. Write a short, imperative description without a
trailing period.

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
- Add a body only when the reason, tradeoff, migration, or verification needs
  explanation.
- Mark a breaking change with `!`, for example
  `feat(week_2)!: replace the ticket file format`, and explain it in the body.

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
5. Commit only when the user has requested a commit.

Do not amend or push unless the user explicitly asks for that operation.

## AI discovery

- [`AGENTS.md`](../AGENTS.md) provides repository-wide context automatically to
  compatible coding agents.
- [Repository commit skill](../.agents/skills/repository-commits/SKILL.md)
  provides the decision process for agents that support skills.
