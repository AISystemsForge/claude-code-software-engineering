# Contributing

AISystemsForge welcomes changes that make a repository easier to understand,
verify, operate, or evolve.

## Before proposing a change

- Confirm that the change belongs in this repository's stated scope.
- Search existing issues and architectural decisions for prior context.
- Prefer the smallest change that completely solves the problem.
- Avoid adding dependencies, directories, or automation for hypothetical use.
- For template changes, consider whether the decision is valid across software,
  infrastructure, AI systems, and research repositories.

Discuss a change before implementation when it alters public behavior, repository
structure, security posture, licensing, or a long-lived engineering policy.

## Organization conventions

Follow the [AISystemsForge engineering standards](docs/standards/README.md) for
branch names, commit messages, documentation, and AI-assisted work. Keep
project-specific exceptions in the project's own documentation rather than
changing the organization-wide convention implicitly.

Resolve conflicting guidance according to the
[engineering governance hierarchy](docs/standards/governance.md). Changes to a
standard or an exception must be explicit, reviewable, and recorded before the
new convention is applied.

## Pull requests

A pull request should:

- explain the problem and why it matters;
- describe the chosen approach and relevant trade-offs;
- identify verification performed;
- disclose compatibility, migration, security, or operational impact; and
- update durable documentation in the same change.

Keep unrelated changes separate. Reviewability is an engineering property, not
an administrative preference.

## Architecture decisions

Create an architectural decision record when a choice is consequential, costly
to reverse, or likely to be questioned later. Follow the contract documented in
`docs/architecture/decisions/README.md`.

Routine implementation details and easily reversible edits do not require an
ADR.

## Verification

Run the repository's documented checks before requesting review. When a check
cannot be run, state that explicitly and explain why. Tests should validate
behavior and important failure modes; do not add tests solely to increase a
metric.

## Commit quality

Follow the [commit standard](docs/standards/commits.md). Do not commit secrets,
local credentials, generated artifacts without a documented reason, or changes
whose provenance cannot be established.

## Conduct and security

Follow the organization-wide code of conduct when one is published. Report
security vulnerabilities privately according to `SECURITY.md`; do not disclose
them in a public issue.
