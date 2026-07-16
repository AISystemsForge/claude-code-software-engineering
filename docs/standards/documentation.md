# Documentation

Public AISystemsForge repositories use English by default so their work remains
accessible to the broadest contributor community. A project may add other
languages when its audience requires them, while keeping the canonical version
clear.

Standard documents have separate responsibilities:

- `README.md` explains what the repository is, who it serves, and how to use it.
- `PROJECT.md` defines scope, maturity, constraints, and success criteria.
- `CONTRIBUTING.md` explains how to propose, verify, and review changes.
- `SECURITY.md` defines private vulnerability reporting and security support.
- `AGENTS.md` gives engineering agents repository-specific operating
  instructions.
- `CHANGELOG.md` records notable user-visible or contract-level changes.
- `docs/` contains durable technical knowledge that is too detailed for the
  repository entry points.
- Architecture decision records preserve the context, decision, alternatives,
  and consequences of choices that are costly or confusing to reverse.

Link to the authoritative document instead of repeating its rules. Keep
documentation close to the responsibility it describes and update it in the
same change as the behavior or contract.

Avoid placeholders, empty directories, speculative documentation, and files
that exist only to make a repository look complete. Add documentation when it
answers a real question for users, contributors, operators, or maintainers.
