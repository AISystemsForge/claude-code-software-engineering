# AISystemsForge Project Template

The baseline repository for projects maintained by AISystemsForge, an open-source
laboratory focused on AI systems engineering.

This template establishes organization-wide engineering contracts without
selecting a programming language, framework, deployment platform, or project
topology. Repositories derived from it should remain small and add structure
only when the project has a concrete need for it.

## Start a repository

After creating a repository from this template:

1. Rewrite this README for the project's users and maintainers.
2. Replace the template definition in `PROJECT.md` with the project's scope,
   maturity, constraints, and success criteria.
3. Review `LICENSE` and confirm that MIT is appropriate for the project and its
   dependencies, data, models, and research outputs.
4. Keep, adapt, or remove repository automation deliberately. A workflow must
   enforce a policy the project intends to maintain.
5. Add implementation directories only after the project has selected an
   architecture. Do not keep empty directories to imply future work.
6. Record consequential structural decisions in
   `docs/architecture/decisions/`.
7. Make the initialization changes the repository's first intentional commit.

## Repository contract

The root documents answer distinct questions:

- `README.md`: What is this repository, and how does someone use it?
- `PROJECT.md`: What is in scope, what is not, and how is success evaluated?
- `CONTRIBUTING.md`: How are changes proposed, verified, and reviewed?
- `SECURITY.md`: How are vulnerabilities reported and handled?
- `AGENTS.md`: What constraints apply to automated engineering agents?
- `CHANGELOG.md`: What user-visible changes have shipped?
- `docs/`: What durable technical knowledge is needed beyond the root files?

These documents are contracts, not decoration. Remove a document only when its
responsibility is intentionally handled elsewhere and that location is clear.

## Template maintenance

Changes to this repository affect future projects across AISystemsForge.
Proposals should reduce ambiguity or recurring setup cost without imposing
technology-specific decisions on unrelated projects. Structural changes require
an architectural decision record when the rationale will matter to future
maintainers.

See `CONTRIBUTING.md` for the review standard and `PROJECT.md` for the current
scope of the template.

## Engineering standards

AISystemsForge repositories share a small set of conventions for naming,
branches, commits, documentation, and AI-assisted engineering. The canonical
standards are indexed in [docs/standards/README.md](docs/standards/README.md).

Derived repositories should adopt these defaults unless a documented project
constraint requires a different convention.
