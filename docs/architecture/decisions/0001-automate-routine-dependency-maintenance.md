# ADR 0001: Automate routine dependency maintenance

- Status: Accepted
- Date: 2026-07-16

## Context

Dependabot originally opened one pull request per outdated package. Updates to
the shared npm lockfile competed with one another, routine updates had no
application validation, and every pull request required the same manual work.
The repository is private on a GitHub plan that does not provide branch
protection or required status checks, so native auto-merge cannot safely wait on
enforced checks.

Dependency updates still have different risk levels. Patch and minor updates can
usually be accepted after reproducible install, lint, build, and critical audit
checks. Major updates can require application or toolchain migrations and must
not be accepted solely because generic checks pass.

## Decision

- Run npm and GitHub Actions version checks monthly, with cooldown periods that
  avoid newly published releases and automatic Dependabot rebasing.
- Group all patch and minor version updates per ecosystem. Group npm major
  updates by migration domain so related framework packages move together while
  unrelated migrations remain reviewable.
- Group security updates separately because GitHub evaluates security and
  version update groups independently.
- Run application CI for every pull request and every push to `main`.
- After CI succeeds, a privileged `workflow_run` job may squash-merge only a
  Dependabot pull request whose commit metadata contains exclusively patch or
  minor updates and whose files are limited to recognized dependency manifests,
  lockfiles, or workflow definitions.
- Leave major updates, unexpected file changes, missing metadata, and failed
  checks open for human validation.
- Pin third-party Actions to immutable commit SHAs and keep workflow permissions
  read-only except for the narrowly scoped merge job.

## Alternatives considered

- One pull request per dependency was rejected because it fragments review and
  repeatedly conflicts on `package-lock.json`.
- Native GitHub auto-merge plus required checks was preferred, but the current
  private-repository plan does not expose branch protection. It should replace
  direct workflow merging if the repository becomes eligible.
- Automatic major-version merging was rejected because generic CI cannot prove
  migration compatibility or detect all behavior and styling regressions.
- Automatic approval was rejected as redundant without an enforced review rule
  and because granting workflows approval authority would broaden permissions
  without improving the current safety gate.
- Merge queue was rejected for the current update volume and because it also
  depends on protected-branch configuration unavailable on the current plan.

## Consequences

Routine updates normally produce one pull request per ecosystem and merge after
validation without maintainer action. Related major framework packages are
updated together, reducing lockfile conflicts, but major migrations and failing
checks remain visible work for maintainers.

The merge workflow compensates for unavailable branch protection with strict
actor, base branch, tested commit, SemVer metadata, and changed-file checks. This
is intentionally narrower than general auto-merge. A future plan upgrade should
enable required checks and native auto-merge, then retire the direct merge step
after recording a superseding decision.
