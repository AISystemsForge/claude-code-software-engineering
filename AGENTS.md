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
- Do not introduce application code, examples, dependencies, or directories
  without a concrete responsibility.
- Do not select a language, framework, cloud, model provider, or deployment
  strategy on behalf of future repositories.
- Record consequential, long-lived structural decisions as ADRs.
- Update documentation when behavior or an engineering contract changes.
- Run proportionate verification and report anything not verified.
- Never expose secrets or include sensitive values in logs, patches, or commits.

## Repository-specific constraint

This repository is an upstream template. Evaluate every proposed default for its
effect on unrelated future projects. A convention that belongs to one derived
repository should remain there.

More specific `AGENTS.md` files may refine these instructions in derived
repositories. They must not silently weaken security or review requirements.
