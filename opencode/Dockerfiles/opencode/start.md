## global config

The host directory `$DOTFILES/opencode/opencode` is mounted read-only at `/etc/opencode`.
OpenCode v2 treats `/etc/opencode` as managed configuration with the highest precedence.

- Shared config, skills, rules, and `AGENTS.md` live there.
- Workspace-specific instructions are mounted at `/code/AGENTS.md`.
- Optional workspace-specific settings are mounted at `/code/opencode.json`.
- A workspace must not try to override conflicting `/etc/opencode` keys. Keep workspace additions additive.
- Mount `/code/.opencode` only for workspace-specific agents, commands, or skills. Do not mount the global config there.

## isolated from host

```
docker run -it \
            --rm \
            -e XDG_RUNTIME_DIR=/tmp \
            -e WAYLAND_DISPLAY=$WAYLAND_DISPLAY \
            -e TERM=tmux-256color \
            -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/tmp/$WAYLAND_DISPLAY  \
            --user=$(id -u):$(id -g) \
            --device /dev/dri \
            --name ocoderaw \
            -v ~/dotfiles/opencode/opencode:/etc/opencode:ro \
            ocode
```

## with some directories shared with host (volumes)

```
docker run -it \
            --rm \
            -e XDG_RUNTIME_DIR=/tmp \
            -e WAYLAND_DISPLAY=$WAYLAND_DISPLAY \
            -e TERM=tmux-256color \
            -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/tmp/$WAYLAND_DISPLAY  \
            --user=$(id -u):$(id -g) \
            --device /dev/dri \
            --name ocodeproject \
            -v ~/dotfiles/opencode/opencode:/etc/opencode:ro \
            -v $PATH_TO_WORKSPACE_AGENTS.md:/code/AGENTS.md:ro \
            -v $PATH_TO_WORKSPACE/opencode.json:/code/opencode.json:ro" \
            -v $PATH_TO_WORKSPACE_API:/code/api \
            -v $PATH_TO_WORKSPACE_FE:/code/frontend \
            ocode
```

# opencode
## cli
```
cd /code && opencode
```
