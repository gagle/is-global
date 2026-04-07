# is-global

Zero-dependency check for globally-installed Node.js modules. Dual ESM/CJS, TypeScript-first npm package.

## Workflow Orchestration

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update the relevant `.claude/rules/*.md` file with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Do not create separate lesson/task files — conventions live in .claude/rules

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Run `npm run lint && npm run build && npm test` after EACH change, not just at the end
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Use Claude Code plan mode for non-trivial tasks
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Summarize outcomes in plan mode

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **No Premature Abstractions**: Don't add helpers, utilities, or abstractions for one-time operations. Three similar lines of code is better than an early abstraction. Design for current requirements, not hypothetical future ones.

## Tech Stack

| Tool | Purpose |
|------|---------|
| TypeScript | Language (strict mode) |
| tsdown | Bundler (Rolldown-based, ESM + CJS) |
| tsc | Type declarations (.d.ts) |
| Vitest | Tests (v8 coverage, 100% thresholds) |
| np | Release (interactive publish) |
| GitHub Actions | CI (Node 20, 22) |

## Commands

| Task | Command |
|------|---------|
| Build | `npm run build` |
| Test | `npm test` |
| Test (watch) | `npm run test:watch` |
| Test (coverage) | `npm run test:coverage` |
| Type-check | `npm run lint` |
| Release | `npm run release` |

## Conventions

Convention files live in `.claude/rules/` and are automatically loaded by Claude Code when editing matching file patterns:

| Topic | Loads when editing | File |
|-------|-------------------|------|
| TypeScript | `src/**/*.ts` | [.claude/rules/typescript.md](.claude/rules/typescript.md) |
| Testing | `src/**/*.spec.ts` | [.claude/rules/testing.md](.claude/rules/testing.md) |

## Verification

After generating or modifying code, always run:

```bash
npm run lint && npm run build && npm test
```
