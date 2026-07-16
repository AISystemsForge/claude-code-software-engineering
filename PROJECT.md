# Project Definition

## Problem statement

Individuals need a simple way to understand everyday spending without handing
personal financial records to an external service. The course also requires a
realistic system through which to practice AI-assisted planning, implementation,
review, and validation.

## Purpose

Build and maintain a clear, dependable expense tracker while demonstrating that
AI-assisted development can operate within explicit human governance and
engineering standards.

## Scope

- Create, edit, delete, search, filter, sort, and summarize expenses.
- Validate expense records before they enter application state.
- Persist and validate data in the local browser.
- Visualize category distribution and recent spending trends.
- Export filtered records as CSV.
- Support responsive desktop and mobile interaction.
- Document the course context and material use of AI tools.

## Out of scope

- Accounts, authentication, or multiple users.
- Backend APIs, databases, or cross-device synchronization.
- Bank, payment provider, or accounting platform integrations.
- Financial advice, budgeting recommendations, or tax reporting.
- Cloud deployment and production service-level commitments.
- Organization-wide standards duplicated as project-specific policy.

## Maturity

The project is an actively developed course application. Its core local workflow
is implemented, but it has not declared a stable public release or production
support level.

## Constraints

- Financial records remain in browser `localStorage` unless a future approved
  architecture decision establishes another storage boundary.
- The application must not imply that local persistence is backup or secure
  multi-device storage.
- The repository follows the
  [AISystemsForge standards](docs/standards/README.md) and
  [governance hierarchy](docs/standards/governance.md).
- AI-assisted changes require human review and proportionate validation.
- New dependencies and system boundaries require explicit justification.

## Success criteria

The project succeeds when:

- users can complete the documented expense lifecycle without data corruption;
- invalid or unsupported stored records do not break the application;
- analytics and exports reflect the selected expense data correctly;
- the interface remains usable across supported desktop and mobile layouts;
- a clean checkout can install dependencies and produce a production build; and
- another engineer can understand the system and continue the course exercise
  from the repository documentation.
