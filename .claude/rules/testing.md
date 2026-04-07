---
paths:
  - "src/**/*.spec.ts"
---

# Testing Conventions

Framework: Vitest with `@vitest/coverage-v8`. Coverage: **100%** on all metrics.

## Rules

```
RULE-01  No redundant "should create" / "should be created" tests.
RULE-02  Nested describes group tests by state or scenario.
         Never flat — always at least one level of nesting.
RULE-03  Each describe that changes state has its own beforeEach.
         beforeEach performs EXACTLY ONE action or state change.
RULE-04  User actions → describe starts with "when the user..."
RULE-05  Programmatic state changes → describe starts with "when..."
RULE-06  restoreMocks: true in vitest config — no manual
         afterEach(vi.restoreAllMocks()) needed.
RULE-07  Prefer vi.spyOn over vi.mock. vi.mock is hoisted, global,
         and confusing. Only use for dynamic imports.
RULE-08  One logical assertion per "it". Related expects on the SAME
         subject are OK (e.g. language + extlang from same parse).
RULE-09  vi.fn() for mocks. Never third-party spy libraries.
RULE-10  Spec files use suffix *.spec.ts.
RULE-11  No comments in spec files unless logic is extremely complex.
         Use semantic function names and describe text instead.
         Exception: RFC section references for standards traceability.
RULE-12  Root describe contains ONLY the entity name under test.
         describe('parse', () => { ... })
         NOT: describe('bcp47', () => { ... })
RULE-13  Describe text uses semantic, human-readable names.
         Never expose property names or variable names in text.
RULE-14  No conditional logic (if/switch) in spec files.
RULE-15  Avoid type casts (as Xxx) in specs — type correctly upfront.
RULE-16  Each test should be independent — no shared mutable state
         across it blocks.
RULE-17  Nested describe blocks start with "when...".
RULE-18  it blocks start with "should...".
```

## File Ordering

```
1. Imports
2. describe('EntityName', () => {
3.   let variables
4.   Helper functions
5.   beforeEach
6.   Nested describes
7. })
```

## Spec Location

Test files live alongside source files in `src/` directory.
