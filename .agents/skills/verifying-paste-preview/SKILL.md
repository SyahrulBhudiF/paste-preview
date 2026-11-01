---
name: verifying-paste-preview
description: Runs the Paste Preview type, test, lint, format, build, and UI checks needed before reporting a change complete. Use after implementing or refactoring application behavior.
---

# Verifying Paste Preview

Run checks against the actual repository and report failures without hiding
them.

## Static checks

Run these from the repository root:

```sh
vp run check
vp run test:run
vp exec tsc --noEmit --pretty false -p tsconfig.json
vp build
```

For React changes, also run the changed-files scan:

```sh
vp run doctor --verbose --scope changed
```

Treat diagnostics as evidence to inspect, not as a reason to suppress a rule
without reading the affected code.

## UI changes

When a change affects the rendered interface, run the app with `vp dev` and
inspect the affected route using the available browser workflow. Exercise the
states the change touches, not only the default state. For password-protected
pastes, check that content remains hidden before unlock, a wrong password keeps
it hidden, and a correct password reveals it. Inspect any captured screenshot;
a capture that was not inspected is not verification.
