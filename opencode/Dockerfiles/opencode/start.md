## global config

The host directory `~/setup/dotfiles/opencode/opencode` is mounted read-only at `/etc/opencode`.
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
            -e XDG_RUNTIME_DIR=/run/wl \
            -e WAYLAND_DISPLAY=wayland-0 \
            -e TERM=tmux-256color \
            -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/run/wl/wayland-0:ro \
            --user=$(id -u):$(id -g) \
            --device /dev/dri \
            --name ocoderaw \
            -v ~/setup/dotfiles/opencode/opencode:/etc/opencode:ro \
            ocode
```

## wayland socket

The mount is for GUI applications such as Firefox. The mount pins the socket inode at container start. GNOME recreates `wayland-0` when the session restarts (logout/login, shell crash, reboot), and the container then keeps a dead socket. Recreate the container after re-login if a GUI application loses the display. A stale mount shows up immediately:

## clipboard

OpenCode copies into the system clipboard through a CLI plugin at `/etc/opencode/plugins/osc52`, declared in `opencode.json` under `plugins`. The CLI loads the plugin's `tui.ts` entrypoint automatically; no `cli.json` entry is needed. The plugin lives in the managed config directory, so no extra volume and no write access to the user config directory are required.

The plugin replaces the renderer's OSC 52 writer. OpenTUI otherwise wraps OSC 52 in a tmux DCS passthrough envelope, and tmux drops that envelope unless `allow-passthrough` is enabled. The plugin emits plain OSC 52 instead, so tmux handles it itself with the existing `set-clipboard on` and forwards it to the terminal. With the outer terminal supporting OSC 52, selecting text in OpenCode copies it to the system clipboard.

The plugin patches `renderer.copyToClipboardOSC52`. If a future OpenCode version removes that method, the plugin does nothing and copy falls back to the native path.

Paste into OpenCode with the terminal's own paste binding (`ctrl+shift+v`), not `ctrl+v`; the TUI clipboard read is the same unsupported Wayland path.

## with some directories shared with host (volumes)

```
docker run -it \
            --rm \
            -e XDG_RUNTIME_DIR=/run/wl \
            -e WAYLAND_DISPLAY=wayland-0 \
            -e TERM=tmux-256color \
            -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/run/wl/wayland-0:ro \
            --user=$(id -u):$(id -g) \
            --device /dev/dri \
            --name ocodeproject \
            -v ~/setup/dotfiles/opencode/opencode:/etc/opencode:ro \
            -v $PATH_TO_WORKSPACE_AGENTS.md:/code/AGENTS.md:ro \
            -v $PATH_TO_WORKSPACE/opencode.json:/code/opencode.json:ro" \
            -v $PATH_TO_WORKSPACE_API:/code/api \
            -v $PATH_TO_WORKSPACE_FE:/code/frontend \
            ocode

docker run -it \
            --rm \
            -e XDG_RUNTIME_DIR=/run/wl \
            -e WAYLAND_DISPLAY=wayland-0 \
            -e TERM=tmux-256color \
            -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/run/wl/wayland-0:ro \
            --user=$(id -u):$(id -g) \
            --device /dev/dri \
            --name ocodedotfiles \
            -v ~/setup/dotfiles/opencode/opencode:/etc/opencode:ro \
            -v ~/setup/dotfiles:/code/dotfiles \
            ocode

```

# opencode
## cli
```
cd /code && opencode
```
