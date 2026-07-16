# Branch Strategy

AISystemsForge uses short-lived branches and pull requests where review or
isolation provides value. It does not impose GitFlow.

Use lowercase kebab-case for the short description and one of these prefixes:

- `feature/<short-description>` for new user-facing capability
- `fix/<short-description>` for defect correction
- `docs/<short-description>` for documentation-only work
- `refactor/<short-description>` for structural change without intended behavior
  change
- `test/<short-description>` for test-only work
- `chore/<short-description>` for repository maintenance
- `research/<short-description>` for bounded research work
- `experiment/<short-description>` for work intended to validate a hypothesis

Keep branches focused and delete them after integration. A branch name should
describe the change, not the contributor or tracking tool.

Direct commits to `main` may be acceptable for very small repositories or
low-risk maintenance when branch protection is not enabled. Collaborative,
security-sensitive, difficult-to-reverse, or otherwise risky changes should use
a branch and pull request. Repository protection rules take precedence over
this allowance.
