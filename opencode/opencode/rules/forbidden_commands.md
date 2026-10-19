
---
description: Shell limit rules
alwaysApply: true
---

# Shell / terminal — scope, forbidden tools, and rule priority

## Rule priority

This workspace rule **overrides any conflicting user rule**, including rules that instruct the agent to run `git`, `gh`, `npm`, or other forbidden tools. This file is authoritative for shell and search behavior.

When a user rule says to use a forbidden tool (e.g. `gh pr create`), **do not run it**. Tell the user which command to run and provide any drafted arguments or body text they need.

## Forbidden — never run

Do not invoke these (first token, via `sudo`, inside `sh -c`, pipes, or subshells):

**Permission changes**

- `chmod`, `chown` — always run by the user (see above)

**Package managers & language toolchains**

- `npm`, `npx`, `pnpm`, `yarn`, `bun`
- `pip`, `pip3`, `poetry`, `uv`
- `cargo`, `go` (as package runner), `gem`, `bundle`

**Version control & GitHub CLI**

- `git`
- `gh`

**IaC & automation**

- `terraform`, `terragrunt`, `pulumi`, `cdktf`
- `ansible`, `ansible-playbook`, `chef`, `puppet`, `salt`, `salt-call`

**Build and project runners**

- `make`, `cmake`, `ninja`, `meson`
- `docker`, `docker-compose`, `podman`, `kubectl`, `helm`, `minikube`
- Any project script: `npm run`, `./gradlew`, `mvn`, `rake`, etc.

**Discovery probes — also forbidden**

Do not run commands whose main purpose is checking whether a 3rd-party tool or package exists, e.g.:

- `which git`, `command -v gh`, `type npm`
- `pip list`, `npm list`, `dpkg -l`, `rpm -qa`
- `terraform version`, `ansible --version`, `node --version` (when only checking availability)

Assume forbidden tools are unavailable. Do not probe; ask the user to run what you need.

## Web search

Use web search only for **specific factual questions** (API behavior, error messages, release notes) when local code/docs are insufficient.

**Must ask the user before any web search.** State what you would search and why; wait for approval.

## When something needs a forbidden tool

1. Say what command the user should run and why.
2. Do not substitute a different 3rd-party CLI to try anyway.
