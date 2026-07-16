# Engineering Agent Contract

This file applies to automated engineering agents operating in this repository.
Human contributors remain responsible for reviewing and accepting changes.

## Operating principles

- Read `README.md`, `PROJECT.md`, and the relevant documentation before editing.
- Apply the
  [engineering governance hierarchy](docs/standards/governance.md) before making
  structural or policy decisions; surface conflicts instead of overriding
  documented decisions.
- Follow the
  [AI-assisted engineering standard](docs/standards/ai-assisted-engineering.md).
- Inspect the actual repository state; do not infer absent architecture.
- Preserve user changes and keep work inside the requested scope.
- Make the smallest complete change that satisfies the requirement.
- Preserve the client-only architecture unless an approved decision establishes
  a new system boundary.
- Use npm and keep `package-lock.json` synchronized with dependency changes.
- Do not commit `.next/`, `node_modules/`, local Claude settings, environment
  files, or generated TypeScript state.
- Record consequential, long-lived structural decisions as ADRs.
- Update documentation when behavior or an engineering contract changes.
- Run proportionate verification and report anything not verified.
- Never expose secrets or include sensitive values in logs, patches, or commits.

## Repository-specific constraint

This repository contains a Next.js course project. Expense data is currently
stored only in browser `localStorage`; do not add a backend, external data flow,
or authentication boundary without documenting and approving the architecture
change. Preserve validation at the storage boundary and avoid handling real
financial data in tests, prompts, or documentation.

More specific `AGENTS.md` files may refine these instructions in derived
repositories. They must not silently weaken security or review requirements.
