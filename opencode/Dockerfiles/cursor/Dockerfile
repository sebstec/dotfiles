FROM ubuntu:24.04
# Prevent interactive prompts during build
ENV DEBIAN_FRONTEND=noninteractive
USER root

# 1. Install prerequisites
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    libgl1-mesa-dri \
    libgl1 \
    libglx-mesa0 \
    libwayland-client0 \
    libwayland-egl1 \
    libdbus-glib-1-2 \
    libgtk-3-0 \
    libasound2t64 \
    curl \
    tmux \
    locales \
     && sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen \
     && locale-gen en_US.UTF-8 \
     && apt-get clean && rm -rf /var/lib/apt/lists/*
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# TMUX
COPY .tmux.conf /root/.tmux.conf
COPY .tmux.conf /home/ubuntu/.tmux.conf

# 2. Add Mozilla APT repository and signing key
RUN install -d -m 0755 /etc/apt/keyrings && \
    wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null && \
    echo "deb [signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://packages.mozilla.org/apt mozilla main" | tee /etc/apt/sources.list.d/mozilla.list > /dev/null

# 3. Prioritize Mozilla repo over Ubuntu's Snap-transition package
RUN echo 'Package: *' > /etc/apt/preferences.d/mozilla && \
    echo 'Pin: origin packages.mozilla.org' >> /etc/apt/preferences.d/mozilla && \
    echo 'Pin-Priority: 1000' >> /etc/apt/preferences.d/mozilla

# 4. Install Firefox
RUN apt-get update && apt-get install -y firefox

# 5. Environment variables for Wayland
ENV MOZ_ENABLE_WAYLAND=1

# Cursor Desktop
RUN curl "https://downloads.cursor.com/production/fc2563ec93d793fc275eef734405a4fdf8b47b26/linux/x64/deb/amd64/deb/cursor_3.11.25_amd64.deb" -o /tmp/cursor.deb 
RUN apt update && apt install -y xdg-utils libnspr4 libnss3 libxkbfile1 && apt install /tmp/cursor.deb
USER ubuntu
# Cursor CLI
RUN curl https://cursor.com/install -fsS | bash

ENTRYPOINT ["bash", "-c", "echo 'export PATH=\"$HOME/.local/bin:$PATH\"' >> ~/.bashrc && source ~/.bashrc && exec \"$@\"", "--"]
CMD ["bash"]
