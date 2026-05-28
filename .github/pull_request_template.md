<!--
PR title MUST follow Conventional Commits:
  feat: ...     -> minor version bump
  fix: ...      -> patch version bump
  feat!: ...    -> major version bump
  chore/docs/refactor/test/ci/perf: ... -> no release

release-please uses this to compute the next version.
-->

## Summary

<!-- 1-3 bullets describing what changed and why -->

## Test plan

- [ ] `bun run check` passes (lint + fmt + typecheck + test)
- [ ] Manual smoke test: `bun run dev deck <code>` works
- [ ] If touching data layer: tested against real HearthstoneJSON cache

## Related issues

<!-- Closes #123 / Refs #456 -->
