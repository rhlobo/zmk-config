# LOBO's Corne — ZMK config

Personal [ZMK](https://zmk.dev) firmware configuration for a 42-key Corne split keyboard
running on nice!nano v2 controllers with nice!view displays.

The firmware is built from [urob's ZMK fork](https://github.com/urob/zmk) (see
[`config/west.yml`](config/west.yml)), which carries mouse emulation and a few display
patches ahead of upstream. The upstream remote is kept commented out in the same file if you
want to switch back.

## Layout

QWERTY base with home-row mods, mod-morphs for shifted punctuation, and thumb keys that act as
modifiers or layer-taps when held. Layers are reached by holding a thumb key, or locked on with
a combo (see [Combos](#combos)); the right outer thumb key returns to Base from any locked layer.

Each layer is drawn as an ASCII diagram directly above its bindings in
[`config/corne.keymap`](config/corne.keymap); that file is the source of truth for the layout.

### Combos

All layer combos use the left inner thumb (TAB) plus one other thumb key and lock the layer
with `&to`. Press the right outer thumb key on that layer to return to Base.

| Keys                  | Action                                  |
| --------------------- | --------------------------------------- |
| TAB + ESC             | Lock Numeric layer                      |
| TAB + ENTER           | Caps lock                               |
| TAB + BSPC            | Lock Move layer                         |
| TAB + SPACE           | Lock Symbol layer                       |
| TAB + RCTL            | Lock System layer                       |
| M DOWN + M UP + M RGT | Left mouse click                        |
| `'` + C               | ç (via RALT+`,` then `c`, for xps-arch) |
| A + S + D + F         | Clear Bluetooth bond (System layer only)|

## Repository layout

| Path                                            | Purpose                                                        |
| ----------------------------------------------- | -------------------------------------------------------------- |
| [`config/corne.keymap`](config/corne.keymap)    | Layers, behaviors, macros, and combo definitions                |
| [`config/key_positions.dtsi`](config/key_positions.dtsi) | Key-position aliases (`KL11`…`KR43`) used by combos    |
| [`config/mouse.dtsi`](config/mouse.dtsi)        | Mouse acceleration profiles and movement/scroll defines         |
| [`config/corne.conf`](config/corne.conf)        | Kconfig options, with most options documented inline            |
| [`config/west.yml`](config/west.yml)            | West manifest selecting the ZMK fork                            |
| [`build.yaml`](build.yaml)                      | Board/shield matrix for GitHub Actions                          |
| [`bin/build-corne`](bin/build-corne)            | Local build script used inside the devcontainer                 |
| [`.devcontainer/`](.devcontainer/)              | Docker image with ZMK and the Zephyr toolchain preinstalled     |
| [`TODO.md`](TODO.md)                            | Planned additions                                               |
| `build/` (untracked)                            | Output of local builds                                          |
| `reference/` (untracked)                        | Other people's configs kept locally for inspiration             |

## Notable firmware settings

From [`config/corne.conf`](config/corne.conf):

- Key debounce of 1 ms on press and 7 ms on release.
- Mouse emulation enabled; acceleration is tuned in `config/mouse.dtsi`.
- Inverted nice!view display.
- Bluetooth transmit power raised by 8 dBm and 2M PHY disabled, trading battery for range.
- Idle after 60 s, deep sleep after 5 h.
- Profile selection is written to flash only after 90 s to reduce wear.

## Building

### GitHub Actions

Every push builds `corne_left`, `corne_right` (both with the nice!view shields) and a
`settings_reset` image through ZMK's reusable `build-user-config` workflow, which reads
`build.yaml` and `config/west.yml`. Download the `.uf2` files from the workflow run artifacts.

### Locally with the devcontainer

Open the repo in VS Code and reopen in the container. The image clones the ZMK fork into
`/zmk`, runs `west update`, and creates a non-root user whose uid/gid match the host user so
files written to the workspace stay owned by you. Then, from the repository root:

```sh
bin/build-corne [tag]
```

This builds both halves and writes them to `build/nice_nano_v2-corne-{left,right}-zmk-<tag>.uf2`.
The tag defaults to today's date.

To build from a plain terminal without VS Code, use the devcontainer CLI:

```sh
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . bin/build-corne
```

### Flashing

Double-tap the reset button on a nice!nano to enter the bootloader, then copy the matching
`.uf2` onto the USB drive that appears. Flash the left half first; it is the central side.
Use the `settings_reset` image on both halves if they stop pairing with each other.

## Development notes

- `west.yml` tracks the fork's `main` branch and the devcontainer resets to it on every
  rebuild, so a build can break without any change here. If that happens, pin `revision` in
  [`config/west.yml`](config/west.yml) to the last known-good commit.
- Mouse emulation uses the input-subsystem behaviors (`&mmv`, `&msc`, `&mkp`). The older
  `&mwh` scroll behavior and the `CONFIG_ZMK_MOUSE_*` thread options no longer exist in the
  fork; the latter are left commented in `corne.conf` for reference.
- Zephyr's CMake package is registered per user with `west zephyr-export`. The Dockerfile
  runs it for the container user; if a build fails with "Could not find a package
  configuration file provided by Zephyr", run it again inside `/zmk`.
- `CONFIG_ZMK_DISPLAY_INVERT=y` is reported as ignored at build time because the nice!view
  status screen does not use the LVGL mono theme the option depends on. It is harmless.
- Behaviors and macros still carry `label` properties. Newer ZMK ignores them, so they can be
  dropped once the fork is updated.
