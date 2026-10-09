# Week 1 TDD Demo

Small TypeScript project demonstrating Test-Driven Development for a Ticket
Manager CLI domain.

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
docs/tdd-iterations.md Red-Green-Refactor evidence
```

This repository intentionally implements only one small use case. It is
evidence for the Week 1 research assignment, not a complete Ticket Manager
CLI.
