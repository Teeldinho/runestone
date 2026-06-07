# Structural Lint

This directory contains deterministic structural checks that complement Biome and Steiger.

## Tool Boundaries

- Biome: formatting, import organization, basic linting.
- Steiger: FSD layer/slice/public API boundaries.
- ast-grep: AST-level convention checks.
- Node scripts: filesystem/path checks that are not AST problems.

## Rules

- `no-config-helper-declarations`: catches function declarations and function-valued constants in `config/`. Config files are static data only. False positives should be moved to `lib/` or `model/`; narrow exceptions require approval and tooling documentation.
- `no-config-runtime-constructs`: catches obvious runtime constructs such as constructors, `Object.*`, and `import.meta.env` in `config/`. Static literals are allowed. Framework-specific exceptions must be explicit.
- `no-ui-helper-declarations`: catches helper declarations in `ui/*.tsx`. UI files render components; helpers belong in `model/` or `lib/`. Component and hook declarations are allowed.
- `no-static-inline-style`: catches static inline JSX styles in UI files. Use Tailwind `className` for static styling. Runtime-only dynamic style objects may remain when Tailwind cannot express the value.
- `no-deprecated-shared-utils-import`: catches imports from `@/shared/lib/utils`. Import `cn` from `@/shared/lib/cn` or the shared public API instead.
- `no-fsd-public-api-bypass`: catches clear alias imports into FSD slice internals such as `@/features/auth/ui/Foo`. Steiger remains authoritative; this rule is a narrow supplement for obvious bypasses.

## Allowed Exceptions

Exceptions must be narrow, named, documented, implemented in tooling config where possible, and approved before merging.

## Do Not

- Do not replace Steiger with ast-grep.
- Do not add broad fragile rules without tests.
- Do not weaken rules to pass a feature.
