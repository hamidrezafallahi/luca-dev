# Git standards
- Inspect status/diff and current branch before changes. Preserve staged, unstaged and untracked user work. Never reset, clean, checkout over, stash, discard or force push user changes without specific authorization.
- Follow repository branching conventions. Do not create extra branches, clones or worktrees unless necessary and authorized. Do not bypass permissions, hooks or authentication. Keep credentials out of output.
- Commit, merge and push only when explicitly requested; check intended branch/remote, review diff, exclude secrets and unrelated changes, report exact result. Never claim pushed without confirmation. No destructive history rewriting by default.
- If Git inaccessible, report exact error and leave repository intact. Final report includes changed files and verification, even if no commit requested.
