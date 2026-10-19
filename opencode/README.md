# OpenCode dotfiles

## Layout

```text
opencode/
├── opencode/                      # mounted read-only at /etc/opencode
│   ├── opencode.json              # shared OpenCode v2 config
│   ├── AGENTS.md                  # shared behavior and engineering rules
│   ├── rules/                     # modular rule files, loaded by instructions
│   └── skills/                    # shared skills
├── EQ_WORKSPACE_AGENTS.md         # EQ-only instructions
├── PUNK_AGENTS.md                 # PUNK-only instructions
├── workspaces/                    # optional per-workspace settings
│   └── <name>/opencode.json
└── Dockerfiles/opencode/start.md  # container launch examples
```

## Global configuration

Mount `opencode/opencode` at `/etc/opencode`:

```sh
-v "$DOTFILES/opencode/opencode:/etc/opencode:ro"
```

OpenCode v2 loads `/etc/opencode` as managed configuration. It has the highest configuration precedence, so workspace configs cannot override conflicting global keys.

The global directory provides:

- `opencode.json`: shared providers, models, and the `instructions` list.
- `AGENTS.md`: behavior that applies to every workspace.
- `rules/`: modular rule files. `/etc/opencode/rules/forbidden_commands.md` is the authoritative shell/search limit.
- `skills/`: shared skills.

## Workspace configuration

Each workspace adds only its specific instructions and settings:

```sh
-v "$DOTFILES/EQ_WORKSPACE_AGENTS.md:/code/AGENTS.md:ro"
-v "$DOTFILES/workspaces/eq/opencode.json:/code/opencode.json:ro"
```

The second mount is optional. Create `workspaces/<name>/opencode.json` only when a workspace needs its own settings, and keep those settings additive to the global config.

Mount `/code/.opencode` only for workspace-specific agents, commands, or skills:

```sh
-v "$DOTFILES/workspaces/eq/.opencode:/code/.opencode:ro"
```

Do not mount the global config at `/code/.opencode`; that would duplicate or shadow the `/etc/opencode` config.

## Notes

- `/etc/opencode` wins on conflicting config keys. If a workspace must override a global provider or model setting, move that setting out of the global config instead of relying on the workspace file.
- Global and workspace `AGENTS.md` are additive. Workspace files may specialize global rules but must not weaken the shell/search, binary-analysis, or failure-logging rules.
- Container launch examples are in `Dockerfiles/opencode/start.md`.
