# Commits

AISystemsForge uses Conventional Commits so history communicates intent and can
support future automation without requiring it today.

Use this form:

```text
<type>(optional-scope): <description>
```

Primary types are:

- `feat` for new capability
- `fix` for a defect correction
- `docs` for documentation-only changes
- `refactor` for internal restructuring without intended behavior change
- `test` for test additions or corrections
- `chore` for maintenance not covered by another type
- `ci` for continuous integration configuration
- `build` for build systems or external dependencies
- `perf` for performance improvements
- `revert` for reverting an earlier commit

Examples:

```text
feat(retrieval): add hybrid search ranking
fix(api): reject expired access tokens
docs: define repository naming standard
docs(research): record evaluation methodology
```

Use an imperative, concise description and omit the final period. Describe the
intent of the change, not implementation noise such as edited filenames or
routine formatting. Keep a commit focused enough to review and revert safely.

Use a body when the motivation, trade-offs, or migration impact are not obvious.
Mark breaking changes according to the Conventional Commits specification when
compatibility is intentionally broken.
