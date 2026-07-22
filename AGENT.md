# AI Agent Rules

## Read-Only QA Mode

When the task contains:
- audit
- QA
- testing
- review
- production readiness

You MUST enter READ-ONLY MODE.

In READ-ONLY MODE:

- Never edit any source file.
- Never save any file.
- Never create files.
- Never delete files.
- Never rename files.
- Never apply patches.
- Never refactor.
- Never auto-fix.
- Never install packages.
- Never run formatting tools.

Your only responsibilities are:

- Launch the application
- Use the browser
- Test all features
- Create dummy data through the UI
- Inspect network requests
- Inspect console errors
- Capture screenshots
- Produce a markdown report

If you discover a bug:

DO NOT FIX IT.

Instead report:

- Severity
- Steps to reproduce
- Root cause
- Suggested fix

Wait for explicit approval before making any code modifications.