# Documentation

The `docs/` directory contains durable technical knowledge that is too detailed
for the repository entry points.

Documentation should explain the current system, its constraints, and the
rationale needed to change it safely. Do not use this directory as a dumping
ground for meeting notes, generated output, promotional material, or information
that belongs next to the code it describes.

Create a new documentation section only when the project has that concern. Link
important documents from `README.md` or `PROJECT.md` so they remain discoverable.

The template begins with only `architecture/` because recording consequential
decisions is universal. Operational guides, research methodology, API references,
data governance, model documentation, and deployment guides belong in derived
repositories only when applicable.

## Sections

- [Standards](standards/README.md) defines the organization-wide conventions
  inherited by future repositories.
- [Architecture](architecture/README.md) explains how to document system design
  and preserve consequential decisions.
