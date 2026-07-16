# Architecture Decision Records

Architecture decision records preserve why consequential technical and
structural choices were made.

## When to write an ADR

Use an ADR when a decision:

- establishes or changes a system boundary;
- introduces a significant dependency or operational commitment;
- affects security, privacy, data governance, or compatibility;
- selects among alternatives with meaningful trade-offs; or
- would be expensive or confusing to reverse without its original context.

Do not create ADRs for routine edits or to restate documentation.

The [engineering governance policy](../../standards/governance.md) determines
when a project decision or exception must be documented before implementation.
An ADR records a project decision; it does not silently override an
organization-wide standard.

## Required content

Each ADR must identify its title, status, date, context, decision, alternatives
considered, and consequences. Consequences include costs, risks, and follow-up
work, not only benefits.

Use immutable, sequentially numbered Markdown files with short descriptive names.
When a decision changes, add a new ADR and mark the old record as superseded;
preserve the historical rationale.

The first ADR number is assigned when the first real architecture decision is
accepted. This template intentionally contains no fictional decision record.
