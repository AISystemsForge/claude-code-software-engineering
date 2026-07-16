# Project Definition

## Purpose

`forge-project-template` defines the smallest shared engineering baseline for
AISystemsForge repositories. Its purpose is to make a new repository legible,
governable, and safe to evolve before technology-specific architecture is
selected.

## Status

The template is under active development. Changes should be conservative
because every retained decision can propagate to future repositories.

## In scope

- Repository-level documentation contracts.
- Technology-neutral collaboration and review conventions.
- A lightweight mechanism for recording architectural decisions.
- Baseline repository hygiene that applies across operating systems and editors.
- Automation that validates universal repository policies.

## Out of scope

- Application or library code.
- Example, demonstration, or tutorial projects.
- Language, framework, cloud, packaging, or deployment defaults.
- Empty directories reserved for hypothetical future work.
- Tooling that has no enforceable organization-wide policy.
- Organization-wide community health files that are better maintained in the
  organization's dedicated `.github` repository.

## Design constraints

- A new engineer should understand a derived repository's purpose and working
  agreements within five minutes.
- The template must support software, infrastructure, AI systems, and research
  repositories without treating them as structurally identical.
- Every inherited file must have a current owner and responsibility.
- Project-specific architecture belongs in the derived repository, not here.
- New complexity must solve an observed recurring problem.

## Success criteria

The template succeeds when derived repositories:

- begin with explicit scope and contribution expectations;
- can evolve without undoing irrelevant technology assumptions;
- retain the rationale for consequential architecture decisions;
- provide predictable entry points for humans and engineering agents; and
- add only the structure required by their actual system.

## Evolution policy

Evaluate changes against multiple repository types before accepting them. A
useful convention for one ecosystem is not automatically a template standard.
Breaking changes to inherited contracts must be documented in `CHANGELOG.md`
and justified in an architectural decision record.

Derived repositories should replace this document with their own project
definition while preserving the responsibilities represented by its sections.
