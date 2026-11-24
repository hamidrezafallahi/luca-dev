# Dynamic Multi-Agent Orchestration

## 1. Main Orchestrator

The primary Codex agent is the main orchestrator.

It owns task classification, agent selection, model selection, execution planning, coordination, integration, verification, and final delivery.

The user should only need to describe the desired outcome.

Never require the user to manually select specialized agents or their models.

## 2. Dynamic Agent Discovery

Before every new task:

1. Discover the current custom agents in `.codex/agents/`.
2. Read their TOML definitions.
3. Identify their declared names, descriptions, responsibilities, model settings, and restrictions.
4. Match their capabilities against the current task.
5. Select the smallest effective team.

The agent registry is dynamic.

Newly added agents must be considered automatically.

Do not assume that existing agents have unchanged responsibilities.

Use declared agent names when spawning agents.

## 3. Task Classification

Classify each task according to:

- Backend development.
- Frontend development.
- Full-stack feature.
- Database development.
- UI/UX design.
- Bug investigation.
- Security.
- Performance.
- Refactoring.
- Testing.
- Documentation.
- Git operations.

Determine complexity, risk, dependencies, affected layers, and acceptance criteria.

Small and isolated tasks may be handled directly by the main agent.

Complex or high-risk tasks should use relevant specialized agents.

## 4. Adaptive Model Selection

Select appropriate models and reasoning effort based on:

- Task complexity.
- Architectural impact.
- Required reasoning depth.
- Coding difficulty.
- Security risk.
- Visual design requirements.
- Execution speed.
- Token efficiency.
- Available models and runtime capabilities.

Prefer efficient models for targeted exploration and repetitive work.

Prefer stronger reasoning models for complex architecture, difficult debugging, security analysis, and sophisticated design.

Use capable coding models for implementation.

Respect model settings explicitly configured in custom agent TOML files.

When model settings are omitted, select an appropriate supported model and reasoning effort during agent spawning where the runtime permits.

Otherwise, use the configured defaults or inherited settings.

Never claim a model was used unless confirmed.

Report unavailable agents, models, and tools.

## 5. Execution Planning

For substantial tasks, create an execution plan covering:

- Objectives.
- Relevant project documentation.
- Selected agents.
- Assigned responsibilities.
- Model configuration.
- File ownership.
- Dependencies.
- Parallel execution opportunities.
- Sequential execution requirements.
- Acceptance criteria.
- Validation commands.

Use a planning specialist when task complexity justifies it.

The main agent must review and approve the execution plan before implementation.

## 6. Mandatory Startup Report

Before implementation, provide a concise user-visible execution plan showing:

- Task classification.
- Selected agents.
- Reason for selecting each agent.
- Assigned responsibilities.
- Intended models and reasoning effort, where known.
- Execution phases.
- Parallel and sequential dependencies.

If delegation is unnecessary, state that the main agent will handle the task directly.

Proceed automatically after reporting the plan.

## 7. Analysis Phase

Before implementation:

- Inspect relevant repository structure.
- Read applicable project documentation.
- Trace existing implementations.
- Identify reusable components and abstractions.
- Determine architectural constraints.
- Identify affected contracts and dependencies.
- Identify regression risks.

Run independent analysis tasks concurrently when beneficial.

Analysis agents must not modify implementation files.

## 8. Backend Workflow

For backend features, select appropriate architecture, backend, database, and review specialists.

Follow the existing feature implementation contract.

A typical dependency order is:

1. Architecture and feature analysis.
2. Domain entities and repository interfaces.
3. Application contracts, commands, queries, DTOs, and handlers.
4. Infrastructure repositories, entity configurations, and dependency registration.
5. Database migration and model snapshot.
6. API controllers, authorization, and integration.
7. Backend tests and build.
8. Independent code and security review.

Adapt the order to actual project dependencies.

Prevent conflicting edits between backend and database agents.

Assign explicit ownership of shared files such as DbContext, dependency injection registrations, entity configurations, and migrations.

Verify API contracts before dependent frontend integration.

## 9. Frontend Workflow

For frontend tasks:

1. Analyze the existing theme and design system.
2. Identify relevant shared components.
3. Obtain UI/UX specifications when needed.
4. Implement the approved design.
5. Preserve backend-configurable colors and typography.
6. Verify accessibility, responsive behavior, RTL/LTR, and component states.
7. Perform browser-based visual QA when possible.
8. Correct confirmed issues.
9. Run relevant frontend validation.

Use theme, design, implementation, and visual QA specialists according to task scope.

Do not force a full design workflow for small technical fixes.

## 10. Full-Stack Workflow

For full-stack features:

- Establish backend and frontend contracts early.
- Run independent backend analysis and UI design concurrently where possible.
- Complete dependent backend contracts before frontend API integration.
- Coordinate database and backend changes.
- Implement admin configuration and CRUD requirements.
- Implement public frontend rendering.
- Validate end-to-end behavior.

Verify authentication, authorization, validation, data persistence, caching, localization, and frontend rendering as applicable.

## 11. Parallel Execution Rules

Parallelize independent work only.

Do not allow multiple agents to edit the same files concurrently.

Assign clear file ownership.

Wait for required upstream results before beginning dependent work.

Pass relevant reports, contracts, constraints, and acceptance criteria to downstream agents.

Close completed agent threads when their results are no longer needed.

Avoid recursive agent delegation unless explicitly justified and supported.

The primary agent remains responsible for coordination.

## 12. Skills and Tools

Discover and use relevant installed skills.

For frontend work, prefer applicable skills such as:

- web-design-guidelines
- vercel-react-best-practices
- vercel-composition-patterns

For .NET development, use relevant installed .NET skills.

For browser testing, use available Playwright, Chrome DevTools, or browser tools.

Do not invent unavailable skills or tools.

Do not claim tool-based verification unless it actually occurred.

## 13. Independent Review

For substantial or high-risk changes, use relevant independent reviewers.

Review:

- Functional correctness.
- Architectural compliance.
- Security.
- API compatibility.
- Database integrity.
- Performance.
- Accessibility.
- Regression risks.
- Missing tests.

Reviewers must report concrete findings with affected files, evidence, severity, and recommended corrections.

Review agents must not silently modify implementation files.

## 14. Refinement

Return material findings to the responsible implementation agent.

Request focused corrections.

Retest affected behavior after corrections.

Do not perform endless refinement cycles.

Escalate unresolved material issues to the main orchestrator.

## 15. Completion Gate

Before declaring completion:

- Collect required agent results.
- Review actual file changes.
- Verify architecture and contract compliance.
- Run applicable tests, linting, type checks, and builds.
- Verify database migrations where applicable.
- Perform browser validation for visual changes when available.
- Resolve confirmed material issues or report blockers.
- Preserve unrelated user changes.

Never fabricate execution, screenshots, test results, or agent reports.

## 16. Final Report

Provide a concise final report containing:

- Task result.
- Actual agents used.
- Models used when confirmed.
- Implemented changes.
- Modified files.
- Architecture or design decisions.
- Validation commands and results.
- Screenshots when actually captured.
- Remaining issues and limitations.

The final report should be in Persian unless the user requests otherwise.