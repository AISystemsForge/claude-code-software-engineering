# AI-Assisted Engineering

AI tools, including coding agents and language models, may support planning,
implementation, refactoring, testing, documentation, and review. Their output is
an input to engineering judgment, not evidence that a change is correct.

## Required practices

- A human must review AI-assisted changes before they are accepted.
- Validate generated changes before commit using checks proportionate to their
  risk and scope.
- Never include secrets, credentials, private keys, restricted data, or other
  sensitive material in prompts or committed files.
- Do not accept generated code or claims without understanding their effect.
- Verify important technical, security, research, and compatibility claims
  against primary evidence.
- Maintain repository-specific agent instructions in `AGENTS.md`.
- Disclose materially relevant AI use in `README.md`, including limitations or
  provenance concerns that affect how users should interpret the work.

Material relevance depends on impact, not the amount of generated text. Examples
include AI-generated research findings, datasets, model evaluations, safety
decisions, or substantial system behavior. Routine editing assistance generally
does not require disclosure.

Repository policies and human accountability apply regardless of tool vendor.
Add vendor-specific instructions only when a repository has a real dependency or
workflow constraint that requires them.
