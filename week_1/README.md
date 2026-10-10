# Week 1 TDD Demo

Small TypeScript project demonstrating Test-Driven Development for a Ticket
Manager CLI domain.

This Week 1 submission is primarily a research exercise about TDD and working
with AI. The TypeScript/Vitest project is optional, runnable evidence for one
small `addTicket` use case; it is not a complete CLI.

## Documentation

- [Week 1 documentation index](docs/README.md)
- [TDD research index](docs/research/README.md)
- [Three AI workflows](docs/workflows/README.md)
- [Red–Green–Refactor iteration evidence](docs/tdd-iterations.md)

## Requirements

- Node.js 22.12 or newer
- pnpm

## Install

```bash
pnpm install
```

## Run checks

Run the tests once:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Check TypeScript types:

```bash
pnpm typecheck
```

## Project structure

```text
src/ticket.ts          Ticket model, repository, and addTicket function
tests/ticket.test.ts   Unit tests for addTicket
docs/README.md         Documentation index
docs/research/         TDD research split by topic
docs/workflows/        One file for each AI workflow
docs/tdd-iterations.md Red-Green-Refactor evidence
```

The documentation records the three AI workflows used in this exercise:
Layered Questioning, Solution Exploration, and Iterative Refinement. Separate
research and reference files distinguish externally sourced claims from
conclusions drawn from this demo.
