# Security Policy

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability.

Use GitHub's private vulnerability reporting feature for the repository when it
is enabled. If that channel is unavailable, contact the repository maintainers
through a private organization channel listed on the AISystemsForge GitHub
profile.

Include the affected component or document, impact, reproduction conditions,
and any known mitigation. Share only the minimum sensitive material required to
evaluate the report.

Maintainers should acknowledge a report, assess severity and scope, coordinate
a fix, and disclose the issue responsibly. Response targets and supported
versions must be defined by each derived repository once it has releases and a
maintainer rotation; this template does not invent guarantees it cannot enforce.

## Repository responsibilities

- Never commit credentials, tokens, private keys, or non-public datasets.
- Treat prompts, model artifacts, training data, and evaluation data according
  to their provenance and access restrictions.
- Review new dependencies and automation for permissions and supply-chain risk.
- Give CI jobs the minimum permissions required for their task.
- Document project-specific security boundaries and threat models when the
  system handles untrusted input, sensitive data, or privileged operations.
