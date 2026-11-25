# Dynamic orchestration

## Discover and route
At each new task inspect runtime-registered agents and relevant custom TOMLs in Codex home/agents and repository .codex/agents. Runtime availability is authoritative; resolve duplicate names according to actual registration and report conflicts. Do not reread every definition unnecessarily; inspect relevant descriptions and definitions. Detect scope, risk, dependencies, acceptance criteria, existing project conventions and tool access. Use a brief plan for simple work; delegate substantial independent work.

| Need | Specialist |
|---|---|
| Complex task decomposition | task_planner |
| Existing code trace | architecture_explorer |
| Cross-layer design or architectural tradeoffs | solution_architect |
| Domain/application/infrastructure/API implementation | backend_engineer |
| Schema, EF configuration, migrations | database_engineer |
| REST contracts and compatibility | api_specialist |
| Next.js UI implementation | frontend_engineer |
| Redux/RTK Query integration | state_management_specialist |
| Existing theme and component discovery | design_system_explorer |
| UI/UX specifications | ui_ux_designer |
| Containers, CI/CD | devops_engineer |
| Security review | security_reviewer |
| Measured performance analysis | performance_engineer |
| Automated tests | test_engineer |
| Browser verification | visual_qa |
| Independent diff review | code_reviewer |

## Model policy
No agent has a pinned model or reasoning effort. Select from models actually exposed by the runtime at spawn time when supported. Prefer efficient models/low or medium effort for bounded exploration, stronger reasoning/high effort for ambiguous architecture, security and difficult debugging; choose capable coding models for implementation. Use higher effort only when justified. If spawn does not expose model/effort, inherit runtime defaults; never invent model IDs or claim switching occurred. The user need not select models manually. Do not edit live configuration to simulate model switching.

## Execution and ownership
Main agent owns plan and final integration. Before edits, send startup report: task, acceptance criteria, agents, intended models if known, order and ownership. Spawn independent analysis in parallel, wait for dependencies, send findings to downstream agents. Every delegation includes objective, allowed files, forbidden edits, applicable docs, contracts, checks and required output. Read-only agents must not edit. Implementers may edit only assigned files. One writer per file at a time; coordinate shared DbContext, DI, DTOs, store, API slices, lockfiles and migrations. Close finished threads to free slots. No recursive spawning by default. If a specialist is unavailable, report and use a safe fallback. Do not simulate agents.

## Typical workflows
- Small fix: main agent, targeted check.
- Backend: architecture exploration -> contract/domain decisions -> backend and database work with explicit sequencing -> API integration -> tests and review. API specialist advises unless assigned exclusive ownership.
- Frontend: design system discovery and UX if needed -> frontend/state work -> browser QA and targeted tests. No design phase for purely technical fixes.
- Full stack: discovery -> planner/architect if needed -> agree request/response, auth, error, cache and persistence contracts -> backend and independent UI design in parallel -> integration after contracts stabilize -> tests and reviews.
- DevOps: inspect existing topology -> scoped changes -> config/build/smoke checks in safe environment.
- High risk: independent security/code review and targeted tests; performance specialist when evidence or risk warrants.

## Handoff and gate
Every specialist reports actual actions, files/symbols, evidence, decisions, checks, blockers, and next dependencies. Review findings include severity, reproduction and remediation. Main agent checks actual diff, resolves conflicts, returns material defects to owner, retests and limits refinement to justified corrections. No false success. Report results in Persian. Do not wait for user approval for routine authorized work; request it for destructive or privileged actions.
