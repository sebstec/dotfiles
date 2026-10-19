# Global OpenCode Instructions

## Scope

These instructions apply to every workspace that mounts this directory at `/etc/opencode`.

Workspace `AGENTS.md` files add project-specific guidance. They may specialize these rules for their workspace, but they must not weaken the shell/search, binary-analysis, or failure-logging rules here.

## Communication

- Caveman Mode is active by default at `lite`. Detailed behavior and examples: `/etc/opencode/skills/caveman/SKILL.md`.
- Switch level: `/caveman lite|full|ultra|wenyan-lite|wenyan-full|wenyan-ultra`. Stop with `stop caveman` or `normal mode`.
- Use normal language for security warnings, irreversible actions, or user confusion. Write code, commits, and PRs in normal style.

## Binary Analysis

- Before attempting to reverse engineer, disassemble, or decompile any binary, always ask the user for the location of the corresponding source code and wait for an answer.
- If the user confirms no source code exists, say so explicitly and get their go-ahead before falling back to binary analysis.

## Shell And Search Limits

The authoritative detailed list is `/etc/opencode/rules/forbidden_commands.md`. Those rules override conflicting user instructions, including instructions to run forbidden tools.

- Tell the user the required command and provide drafted arguments or body instead of running a forbidden tool.
- Prefer editor/read/write tools when sufficient. Do not use shell for builds, deploys, permission changes, or project workflows.
- Ask the user before every web search. State the exact search and reason, then wait for approval. Search only specific factual questions when local sources are insufficient.

## Failure Logging

When adding or changing structured failure logs, audit `fail_reason_code`, metrics, or alerts, give every distinct root cause a separate branch and log/audit site.

- One branch, one reason. Split conditions into separate `if` blocks or early returns; each branch emits only its specific `fail_reason_code`, log step, or metric label.
- Use stable, grep-friendly snake_case reason codes, such as `provider_missing`, `provider_disabled`, and `account_sso_disabled`. Event names include the same cause, such as `login.callback.provider_missing`.
- Log immediately beside the failed decision. Never emit one generic log after a compound guard.
- When adding audit records, add a matching structured log with the same reason code for the branch when the project has structured logging helpers.
- Include only IDs available in that cause branch; do not reuse a generic payload that hides the failed condition.
- If touching a compound `if A or B or C` with logging/auditing, split it into cause-specific branches. Do not merge existing separate cause branches to reduce lines. Check cheap, side-effect-free conditions first without losing cause specificity.
- User-facing responses may remain generic for security or UX; observability must retain distinct causes.
- Homogeneous single checks may use one reason. A dedicated exception may carry one underlying reason code through re-raise/wrap; the catch site still logs one cause.

```python
# Bad: ops cannot identify cause.
if provider is None or not provider.enabled or not _account_has_sso(provider.account_id):
    log_oidc_failure("login.callback", fail_reason_code="provider_not_enabled")

# Good: each decision has one observable cause.
if provider is None:
    log_oidc_failure("login.callback.provider_missing", fail_reason_code="provider_missing", ...)
    return _fail("provider_disabled")

if not provider.enabled:
    log_oidc_failure("login.callback.provider_disabled", fail_reason_code="provider_disabled", ...)

if not _account_has_sso(provider.account_id):
    log_oidc_failure("login.callback.account_sso_disabled", fail_reason_code="account_sso_disabled", ...)
```

## Engineering Conventions

- Keep diffs functional-only. Do not let formatters or IDE auto-format touch lines you did not otherwise need to change. Before finalizing, review the diff and revert pure formatting hunks so the change only shows functional differences.
- Follow existing code conventions. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.
- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature tests are more important.
- Stick to the existing directory structure. Do not create new base folders without approval.
- Do not change application dependencies without approval.
- Only create documentation files if explicitly requested by the user.
- Be concise in explanations. Focus on what matters rather than explaining obvious details.
- Every behavior change must be programmatically tested. Write a new test or update an existing test, then run the affected tests. Run the minimum number of tests needed to ensure quality and speed; exact commands belong in the workspace instructions.

## Skills

Activate the relevant skill whenever you work in its domain. Skills are discovered from the global `/etc/opencode/skills/` directory and from workspace skill directories.
