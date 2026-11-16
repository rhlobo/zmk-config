FROM docker.io/zmkfirmware/zmk-dev-arm:stable

ARG ZMK_WORKSPACE=/zmk-ws
ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=1000

# Seed the west workspace from the config repo's manifest so the image build caches ZMK,
# Zephyr and every module. config/west.yml is the only place a revision is written; after
# editing it, run bin/west-sync inside the container (the devcontainer also runs it on create).
COPY config/west.yml ${ZMK_WORKSPACE}/config/west.yml
WORKDIR ${ZMK_WORKSPACE}
RUN west init -l config && (west update || west update || west update)

# Non-root user matching the host uid/gid, so files written to the mounted
# workspace are owned by the host user rather than root. The base image already
# ships an "ubuntu" user at 1000:1000, so an existing user/group at the requested
# ids is renamed rather than recreated.
RUN set -eu; \
    if getent group "${USER_GID}" >/dev/null; then \
        groupmod -n "${USERNAME}" "$(getent group "${USER_GID}" | cut -d: -f1)"; \
    else \
        groupadd --gid "${USER_GID}" "${USERNAME}"; \
    fi; \
    if getent passwd "${USER_UID}" >/dev/null; then \
        old="$(getent passwd "${USER_UID}" | cut -d: -f1)"; \
        usermod -l "${USERNAME}" -g "${USER_GID}" -d "/home/${USERNAME}" -m -s /bin/bash "${old}"; \
    else \
        useradd --uid "${USER_UID}" --gid "${USER_GID}" -m -s /bin/bash "${USERNAME}"; \
    fi; \
    chown -R "${USER_UID}:${USER_GID}" "${ZMK_WORKSPACE}"
USER ${USERNAME}

# Register Zephyr's CMake package for this user; the registry is per-user.
RUN west zephyr-export

RUN git config --global user.name "Roberto Lobo" \
    && git config --global user.email "rhlobo@gmail.com"
