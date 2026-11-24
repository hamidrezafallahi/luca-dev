# Global Software Engineering Instructions

## 1. Mandatory Custom Agent Discovery

At the beginning of every new user task, the primary agent MUST discover the available custom agents before planning or implementing changes.

Resolve the Codex home directory using the following priority:

1. The `CODEX_HOME` environment variable, if defined.
2. Otherwise, `~/.codex`.
3. On the current Windows environment, the expected default path is `C:\Users\h.falahi\.codex`.

### Global Custom Agents

Discover all `*.toml` agent definitions inside:

`<CODEX_HOME>/agents/`

The expected Windows path is:

`C:\Users\h.falahi\.codex\agents`

Enumerate all TOML files and inspect their current definitions, including:

- Agent name.
- Description.
- Developer instructions.
- Specialization and capabilities.
- Model configuration, if explicitly defined.
- Reasoning effort, if explicitly defined.
- Responsibilities and restrictions.

Do not rely on a hardcoded list of agent names or previous task assumptions.

The current TOML definitions are the source of truth for configured agent capabilities.

Automatically consider newly added, renamed, updated, or removed agents.

### Project-Specific Custom Agents

Also discover project-specific agents, when available, inside:

`<REPOSITORY_ROOT>/.codex/agents/`

Consider both global and project-specific agents when selecting the execution team.

Resolve naming conflicts according to the actual Codex runtime precedence rules.

### Runtime Registration Verification

Distinguish between:

- Agent definitions discovered on disk.
- Agents registered and available in the current runtime.
- Agents selected for the current task.
- Agents actually spawned and executed.

A TOML file existing on disk does not prove that its agent is registered or executable.

Use the actual runtime-registered agent names when spawning subagents.

Report unavailable agents, unsupported models, missing permissions, and runtime limitations explicitly.

Never simulate subagent execution.

## 2. Main Orchestrator Responsibilities

The primary agent acts as the main orchestrator.

Automatically determine:

- Task classification.
- Task complexity and risk.
- Relevant project architecture.
- Required specialized agents.
- Appropriate models and reasoning effort, where supported.
- Execution phases.
- Dependencies.
- Parallel and sequential execution.
- File ownership.
- Acceptance criteria.
- Validation strategy.

Do not require the user to manually select planners, implementers, reviewers, models, or reasoning effort.

Use the smallest effective team.

Simple and isolated tasks may be completed directly.

Complex, multi-layer, or high-risk tasks should use appropriate specialized agents.

Subagents execute only their delegated scope. They must not restart global orchestration or recursively spawn additional agents by default.

## 3. Mandatory Task Startup Report

Before implementation, provide a concise user-visible startup report containing:

- Global custom agents discovered.
- Project-specific custom agents discovered.
- Runtime-available agents, where verifiable.
- Task classification and complexity.
- Selected agents.
- Assigned responsibilities.
- Intended model and reasoning effort, where known.
- Execution dependencies and parallel work.

Do not print the complete contents of agent TOML files.

If no specialized agent is required, briefly explain why.

Proceed automatically without waiting for approval unless required by the user or runtime permissions.

## 4. Dynamic Model Selection

Automatically select appropriate models and reasoning effort based on task complexity, risk, specialization, and available runtime capabilities.

Prefer efficient models for simple exploration and routine tasks.

Prefer stronger reasoning for complex architecture, difficult debugging, security analysis, and critical implementation.

Respect explicit model settings in individual agent TOML definitions.

When model settings are omitted, select an appropriate supported model dynamically if the runtime exposes that capability.

Otherwise, use the runtime defaults or inherited settings.

Never invent model identifiers or claim that a particular model was used without confirmation.

## 5. Global Engineering Standards

Resolve all global documentation paths relative to the Codex home directory, not the current repository.

Before planning substantial work, read:

- `.docs/agent-orchestration.md`

Before changing files, read all relevant standards:

- `.docs/backend-standards.md`: .NET, DDD, Clean Architecture, CQRS, MediatR, REST.
- `.docs/frontend-standards.md`: Next.js App Router, TypeScript, Atomic Design, Redux Toolkit, RTK Query, Tailwind, next-intl, server-first.
- `.docs/database-standards.md`: PostgreSQL, EF Core Code First, migrations.
- `.docs/devops-standards.md`: Docker Compose, Linux, environment, CI/CD.
- `.docs/security-standards.md`: authorization, secrets, input and data protection.
- `.docs/testing-standards.md`: xUnit, project frontend runner, Playwright.
- `.docs/git-standards.md`: preserve work, no unauthorized commit or push.

Pass the relevant standards and project constraints to every delegated agent.

## 6. Project Awareness

Inspect applicable repository AGENTS.md files, project documentation, actual dependencies, scripts, architecture, and conventions.

Repository-specific requirements refine global defaults.

Never migrate an existing technology stack solely to match a global preference.

Trace an existing analogous feature before implementing a new one.

Explicit user scope and runtime permissions remain binding.

## 7. Execution and Coordination

Run independent analysis tasks concurrently when beneficial.

Wait for required upstream agent results before starting dependent work.

Assign clear responsibilities and exclusive file ownership where necessary.

Do not run conflicting file edits concurrently.

Pass relevant analysis, contracts, specifications, constraints, and acceptance criteria to downstream agents.

The main orchestrator remains responsible for integration, review, and final correctness.

Use independent review for substantial or high-risk changes.

Return confirmed material defects to the responsible implementation agent and retest after corrections.

## 8. Non-Negotiable Engineering Behavior

- Preserve existing user edits.
- Preserve public contracts and business invariants.
- Preserve accessibility and localization.
- Preserve existing security requirements.
- Prefer small coherent changes and reuse over unnecessary abstractions.
- Follow SOLID, DRY, KISS, and Clean Code pragmatically.
- Do not expose secrets.
- Do not disable safeguards.
- Do not introduce unrelated modifications.
- Do not apply migrations to shared or production databases without explicit authorization.
- Do not deploy, commit, merge, or push without explicit authorization.
- Do not invent test results, screenshots, tools, models, or agent execution.
- Use relevant installed skills and MCP tools when available.
- Verify version-sensitive APIs against actual installed versions.

## 9. Completion and Verification

Before declaring completion:

- Collect required agent results.
- Review the actual implementation and diff.
- Run relevant tests, builds, linting, and type checks.
- Verify architecture and contract compliance.
- Fix confirmed material defects.
- Retest affected behavior.
- Report blockers and unexecuted checks.

Do not claim completion if acceptance criteria remain unmet.

## 10. Final Report

Provide the final summary in Persian unless the user requests another language.

Include:

- Task outcome.
- Actual agents used.
- Confirmed models and reasoning effort, where available.
- Modified files.
- Important architectural or design decisions.
- Validation commands and actual results.
- Screenshots when actually captured.
- Remaining risks, limitations, or blockers.








# Project-Specific Instructions

Follow the global software engineering and multi-agent orchestration instructions defined in the Codex home directory.

## Project Architecture

- Backend: `BackEnd/`
- Frontend: `FrontEnd/`

## Project Documentation

Before implementing new features, read:

- `.docs/feature-implementation.md`

Before creating or modifying frontend UI, read:

- `.docs/frontend-design-system.md`

Preserve the existing backend-configurable theme system, typography, CSS tokens, API contracts, and business logic.

Follow all repository-specific architectural conventions.

## Project Restrictions

Keep existing user changes intact.

Do not introduce unrelated modifications.

Do not commit, merge, or push unless explicitly requested.