---
paths:
  - "src/**/*.ts"
---

# TypeScript Conventions

## Rules

```
RULE-01  Array<T> not T[]. Consistent generic syntax.
RULE-02  readonly on every non-reassigned field and property.
RULE-03  No any — use unions, domain types, or unknown.
RULE-04  No enum — use string unions: type Foo = 'a' | 'b'.
RULE-05  import type for type-only imports (verbatimModuleSyntax).
RULE-06  Prefer null over undefined in return types. undefined is for
         unset/optional properties, null is for intentional absence.
RULE-07  Explicit return types on exported functions.
RULE-08  Export input/output types of exported functions — parameter
         interfaces and return type interfaces must also be exported.
RULE-09  Only export what has external consumers — internal
         implementation details stay unexported.
RULE-10  No comments unless logic is extremely complex and cannot be
         clarified through naming. No triple-slash references.
RULE-11  const by default, let only when reassignment is needed.
RULE-12  Early returns first — handle errors/guards at the top.
         Main logic follows unindented.
RULE-13  No inline if + return — always use braces and break
         if/return into separate lines. Never: if (x) return y;
RULE-14  Readability over cleverness — no nested ternaries, chained
         reduce+??, or one-liner clever solutions. Prefer explicit
         control flow (if, for, early returns).
RULE-15  async/await over .then()/.catch(). Always await in an
         async function. Never ignore a Promise.
RULE-16  No single-letter variables. No cryptic abbreviations. No
         generic names like data, result, item. Name after what they
         represent. Example: scope not s, entry not r.
RULE-17  No backwards-compatibility shims — no re-exports, aliases,
         or wrappers. Update all consumers directly.
RULE-18  Explicit types on external returns — when a function from an
         external dependency returns any, add a type annotation.
RULE-19  No blank lines between imports.
RULE-20  Empty catch blocks — add // noop comment to clarify intent.
```

## Naming

| Target | Convention | Example |
|--------|-----------|---------|
| Files | `kebab-case.ts` | `global-dirs.ts` |
| Interfaces | `PascalCase` | `IsGlobalContext` |
| Functions | `camelCase` | `checkIsGlobal` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES` |
| Private members | `_camelCase` | `_cache` |

## Imports

Order: Node built-ins → third-party packages → relative imports.

No blank lines between imports.

## Formatting

Single quotes, trailing commas, 2-space indent.
