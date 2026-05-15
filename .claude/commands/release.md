---
description: Cut a new release following AGENTS.md. Usage `/release 1.10.10`.
---

Cut a release for version `$ARGUMENTS`.

## What you do (main session)

1. **Gather context**:
   - `git log develop..main --oneline` — confirm `develop` is ahead of `main` (it should be; otherwise stop and report).
   - `git log main..develop --oneline` — list the merged PRs / commits that are about to ship.
   - `gh pr list --state merged --base develop --limit 20` — surface the PR numbers and titles for cross-reference.

2. **Draft a CHANGELOG block** for version `$ARGUMENTS`, matching the
   voice, structure, and section ordering (Added / Changed / Fixed) of the
   most recent entry in `CHANGELOG.md`. Use today's date in `YYYY-MM-DD`
   format. Reference issues and PR numbers inline like `(#103, #55)`.

3. **Show the draft to the user** and ask for approval before continuing.
   The user may want to tweak wording.

4. **Once approved**, dispatch the `release-runner` subagent (it runs on
   haiku to save tokens):

   ```
   Agent({
     subagent_type: "release-runner",
     description: "Run release $ARGUMENTS",
     prompt: "version=$ARGUMENTS\n\nchangelog_entry=<the approved block>"
   })
   ```

5. **Wait for the runner**, then surface its summary to the user. If the
   runner reports a failure, help the user recover (it stops at the first
   error and reports current state).

## What you do NOT do

- Do not skip the user-approval step on the CHANGELOG. The runner is
  mechanical; the writing is yours.
- Do not bypass `AGENTS.md`. If `develop` isn't ahead of `main`, there's
  nothing to release — surface that and stop.
- Do not add AI attribution to anything.
