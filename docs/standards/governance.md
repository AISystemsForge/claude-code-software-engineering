# Engineering Governance

This policy defines how AISystemsForge resolves conflicting engineering guidance.
It applies to maintainers, contributors, and AI agents.

## Source-of-truth hierarchy

When guidance conflicts, the higher level prevails:

1. Published AISystemsForge engineering standards and repository policies.
2. Approved architecture decision records and other explicitly recorded project
   decisions.
3. Maintainer instructions that do not conflict with levels 1 or 2.
4. AI-agent recommendations and implementation proposals.
5. Implementation details and temporary local conventions.

A chat message, AI output, local convention, undocumented preference, or existing
implementation detail does not supersede a published standard or approved
decision.

## Documented-first workflow

Before proposing or implementing a recurring convention, architectural pattern,
naming rule, workflow, or policy:

1. Check whether the subject is already documented.
2. If a decision exists, follow it.
3. If the situation requires an exception, identify the conflict instead of
   silently ignoring the existing decision.
4. Record the approved exception or new decision in the governing document or an
   ADR, as appropriate.
5. Only then implement the change.

In short: **Check the documented standard first. If a decision exists, follow
it. If no decision exists, decide, document, and then implement.**

## Organizational policy and project decisions

An organizational policy applies across AISystemsForge repositories. Change it
only when the new rule should apply broadly, and update the authoritative
standard and changelog explicitly.

A project decision addresses the architecture, risks, audience, or delivery model
of one repository. Record it locally. Use an ADR when the decision is
consequential, difficult to reverse, establishes a recurring pattern, or matches
the criteria in the
[ADR guidance](../architecture/decisions/README.md#when-to-write-an-adr).
Routine, reversible implementation choices do not create organization-wide
policy merely because they appear in code.

Exceptions to organizational standards must be narrow, justified, and documented
at the project level. If an exception is expected to become the general rule,
propose a versioned change to the organizational standard instead.

## Maintainer responsibilities

Maintainers may approve exceptions and change standards within their authority.
They must make consequential changes explicit, reviewable, and versioned through
repository history. They must also update the governing document or ADR before
an implementation relies on the new rule.

Maintainer instructions remain valid only when they are consistent with higher
levels of the hierarchy.

## AI-agent responsibilities

Before making a structural decision, an engineering agent must inspect the
repository standards and recorded decisions. Documented rules are constraints,
not suggestions.

An agent must:

- identify conflicts explicitly and avoid inventing policy during implementation;
- distinguish a local implementation choice from an organization-wide policy;
- propose a documented decision when no applicable policy exists;
- validate work against the governing documents; and
- never override an approved standard silently.

An agent may recommend changing a standard. It must identify the current rule,
explain why it may no longer be adequate, propose the documented change, and wait
for approval when the change is consequential. The governing standard or ADR
must be updated before the new convention is applied.
