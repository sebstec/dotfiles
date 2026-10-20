# container

## isolated from host

```
docker run -it \
            --rm \
            -e XDG_RUNTIME_DIR=/tmp \
            -e WAYLAND_DISPLAY=$WAYLAND_DISPLAY \
            -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/tmp/$WAYLAND_DISPLAY  \
            --user=$(id -u):$(id -g) \
            --device /dev/dri \
            --name cursor \
            cursor
```

## with some directories shared with host (volumes)

```
docker run -it \
            --rm \
            -e XDG_RUNTIME_DIR=/tmp \
            -e WAYLAND_DISPLAY=$WAYLAND_DISPLAY \
            -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/tmp/$WAYLAND_DISPLAY  \
            --user=$(id -u):$(id -g) \
            --device /dev/dri \
            --name cursor \
            -v ~/setup/dotfiles/opencode/.cursor:/code/.cursor \
            -v $(pwd):/code/frontend \
            cursor
```

# cursor
## run with debug options
```
LIBGL_ALWAYS_SOFTWARE=1 cursor --no-sandbox --disable-gpu --disable-gpu-compositing --disable-dev-shm-usage --ozone-platform=wayland --enable-features=UseOzonePlatform,WaylandWindowDecorations
```
## run with wayland socket forwarding into container
```
cd /code && cursor --no-sandbox --ozone-platform=wayland --enable-features=UseOzonePlatform,WaylandWindowDecoration
```
# cli
```
agent
```
