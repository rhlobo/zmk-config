# LOBO's Corne — ZMK config

Personal [ZMK](https://zmk.dev) firmware configuration for two split keyboards sharing one
layout: a 42-key Corne on nice!nano v2 controllers with nice!view displays, and an Eyelash
Peripherals Corne (48 positions: the same 42 keys plus outer columns, a five-way joystick and an
encoder), whose board definition comes from the vendor (see [GitHub Actions](#github-actions)).
The Eyelash is not compatible with the standard corne shield. The plan behind the second
keyboard is in [`EYELASH_PLAN.md`](EYELASH_PLAN.md).

The firmware is built from upstream ZMK, pinned to the `v0.3` branch in
[`config/west.yml`](config/west.yml), the only place a revision is written. CI and the
devcontainer both read it.

## Layout

QWERTY base with home-row mods, mod-morphs for shifted punctuation, and thumb keys that act as
modifiers or layer-taps when held. Layers are reached by holding a thumb key, or locked on with
a combo (see [Combos](#combos)); the right outer thumb key returns to Base from any locked layer.

Each layer is drawn as an ASCII diagram directly above its row macros in
[`config/layers.dtsi`](config/layers.dtsi); that file is the source of truth for the layout.
Combos live in [`config/combos.dtsi`](config/combos.dtsi).

### Shared and per-keyboard files

Everything that is part of the layout is defined once and shared by every keyboard's keymap.
A per-keyboard file holds only what depends on that keyboard's hardware.

- Shared: [`config/layers.dtsi`](config/layers.dtsi) (layer indices, diagrams and row macros),
  [`config/behaviors.dtsi`](config/behaviors.dtsi) (hold-taps and mod-morphs),
  [`config/macros.dtsi`](config/macros.dtsi), [`config/combos.dtsi`](config/combos.dtsi),
  [`config/mouse.dtsi`](config/mouse.dtsi) and [`config/unicode.dtsi`](config/unicode.dtsi).
- Per keyboard: the keymap, which includes the shared files and composes each layer from the
  row macros plus its own extra slots; the Kconfig file; and a positions file that maps the
  `KL..`/`KR..` aliases used by the combos to that board's key positions.

`layers.dtsi` defines seven macros per layer, named `<P>_L1`…`<P>_L3` and `<P>_R1`…`<P>_R3`
(left and right half, top to bottom row) and `<P>_T` (the six thumb keys), where `<P>` is
`BASE`, `NAV`, `SYM`, `NUM` or `SYS`. The corne composes a layer like this, adding only its
outer columns, which are unused on every layer:

```c
default_layer {
    display-name = "Base";
    bindings = <
&trans   BASE_L1   BASE_R1   &trans
&trans   BASE_L2   BASE_R2   &trans
&trans   BASE_L3   BASE_R3   &trans
         BASE_T
    >;
};
```

To change a binding, edit the macro and its diagram in `layers.dtsi`; never copy a row, behavior,
macro or combo into a keyboard's keymap.

### Cheat sheets

[`docs/corne-cheatsheet.html`](docs/corne-cheatsheet.html) and
[`docs/eyelash-cheatsheet.html`](docs/eyelash-cheatsheet.html) draw every layer on one A4
landscape page. They follow the same split as the firmware: the labels of the 42 shared keys and
the combos are written once in [`docs/cheatsheet/shared-layout.js`](docs/cheatsheet/shared-layout.js),
and each HTML file holds only its keyboard's own slots (outer columns, joystick, encoder, Sim
layer). After changing `layers.dtsi` or `combos.dtsi`, update `shared-layout.js`; after changing
a keymap's own slots, update the data block in that keyboard's HTML file. The label syntax is
described at the top of `shared-layout.js`.

### Eyelash extras

The Eyelash keymap composes the same layers and adds its own keys around them. A comment table
at the top of [`config/eyelash_corne.keymap`](config/eyelash_corne.keymap) lists them per layer.
The shortcuts are for Windows, where this keyboard is mostly used (a sim rig).

- **Outer columns:** on Base, the right column toggles the Sim layer (the same key turns it
  off), sends Alt+Tab once, and opens Explorer (Win+E). Move locks Base, Move or Numeric;
  Symbol has Game Bar capture keys; Numeric has `\` and two typed-text macros; System has
  Windows tools (display mode, Settings, graphics-driver reset, Win+X, Alt+F4).
- **Joystick:** mouse movement on Base (press = left click, Shift + press = right click).
  On Move: down/up cycle windows like Alt+Tab, with Alt kept held; the press switches to the
  highlighted window, or opens Task View (Win+Tab) when not cycling; left/right switch virtual
  desktops. On Symbol: Win+arrows to snap, maximize and restore windows, press = snap layouts.
  On System: media keys. On Sim: arrow keys and Enter.
- **Encoder:** one detent scrolls one notch. Vertical scroll on Base (push = middle click),
  horizontal scroll on Move (push = right click), volume on Symbol (push = mute), brightness on
  System (push = lock, Win+L). On Numeric the push is keypad Enter; on Sim the encoder sends
  Ctrl+F13 / Ctrl+F14 and the push Ctrl+F15, for the sim to bind.
- **Sim layer** (Eyelash only, index 5): the left half stays Base; the right half sends
  F13–F24 and keypad 1–5, keys meant to be bound in the sim or in SimHub.

After cycling windows on Move, press the joystick before leaving the layer. Otherwise Alt
stays held and changes the next keys you type.

### Combos

Defined in [`config/combos.dtsi`](config/combos.dtsi). All layer combos use the left outer
thumb (TAB) plus one other thumb key and lock the layer with `&to`. Press the right outer thumb key on that layer to return to Base.

| Keys                  | Action                                  |
| --------------------- | --------------------------------------- |
| TAB + ESC             | Lock Numeric layer                      |
| TAB + ENTER           | Caps lock                               |
| TAB + BSPC            | Lock Move layer                         |
| TAB + SPACE           | Lock Symbol layer                       |
| TAB + RCTL            | Lock System layer                       |
| R + T (Move layer only: M UP + M RIGHT) | Left mouse click      |
| `'` + C               | ç (via RALT+`,` then `c`, for xps-arch) |
| A + S + D + F         | Clear Bluetooth bond (System layer only)|

## Repository layout

| Path                                            | Purpose                                                        |
| ----------------------------------------------- | -------------------------------------------------------------- |
| [`config/layers.dtsi`](config/layers.dtsi)      | Shared layout: layer indices, diagrams and row macros           |
| [`config/corne.keymap`](config/corne.keymap)    | Corne keymap: composes the layers, adds the outer columns       |
| [`config/behaviors.dtsi`](config/behaviors.dtsi) | Shared hold-taps and mod-morphs                                |
| [`config/macros.dtsi`](config/macros.dtsi)      | Shared macros (nvim, ç workaround, typed text, Unicode symbols) |
| [`config/combos.dtsi`](config/combos.dtsi)      | Shared combos, written against the `KL..`/`KR..` aliases        |
| [`config/corne_positions.dtsi`](config/corne_positions.dtsi) | Corne key-position aliases (`KL11`…`KR43`) used by combos |
| [`config/mouse.dtsi`](config/mouse.dtsi)        | Mouse acceleration profiles and movement/scroll defines         |
| [`config/unicode.dtsi`](config/unicode.dtsi)    | `UNICODE_MACRO()` helper: types a code point via Ctrl+Shift+U   |
| [`config/corne.conf`](config/corne.conf)        | Corne Kconfig, with most options documented inline              |
| [`config/eyelash_corne.keymap`](config/eyelash_corne.keymap) | Eyelash keymap: composes the layers, adds the outer columns, joystick, encoder and Sim layer |
| [`config/eyelash_corne.conf`](config/eyelash_corne.conf) | Eyelash Kconfig: twin of `corne.conf`, plus the backlight the screens need |
| [`config/eyelash_corne_positions.dtsi`](config/eyelash_corne_positions.dtsi) | Eyelash key-position aliases, plus the joystick and encoder-push slots |
| [`docs/corne-cheatsheet.html`](docs/corne-cheatsheet.html), [`docs/eyelash-cheatsheet.html`](docs/eyelash-cheatsheet.html) | One-page cheat sheet of every layer, one per keyboard. Print: browser → Print → A4 landscape, no headers/footers, background graphics on |
| [`docs/cheatsheet/`](docs/cheatsheet/) | What the two sheets share: `shared-layout.js` (labels of the 42 shared keys, combos, legend) and the drawing code (`sheet.js`, `sheet.css`) |
| [`config/west.yml`](config/west.yml)            | West manifest: ZMK and Eyelash board revisions, used by CI and the devcontainer |
| [`build.yaml`](build.yaml)                      | Board/shield matrix for GitHub Actions and `bin/build-corne`    |
| [`bin/build-corne`](bin/build-corne)            | Local build script: builds every `build.yaml` entry             |
| [`bin/west-sync`](bin/west-sync)                | Re-syncs the container's west workspace with `config/west.yml`  |
| [`.devcontainer/`](.devcontainer/)              | Docker image with the west workspace and Zephyr toolchain       |
| [`.dockerignore`](.dockerignore)                | Keeps `reference/` out of the Docker build context              |
| [`TODO.md`](TODO.md)                            | Planned additions                                               |
| [`EYELASH_PLAN.md`](EYELASH_PLAN.md)            | Spec and phased plan for Eyelash Corne support (in progress)    |
| `build/` (untracked)                            | Output of local builds                                          |
| `reference/` (untracked)                        | Other people's configs kept locally for inspiration             |

## Notable firmware settings

From [`config/corne.conf`](config/corne.conf). [`config/eyelash_corne.conf`](config/eyelash_corne.conf)
is its twin: only the keyboard name (`Eyelash-Corne`) and the backlight block differ, so change
both files together.

- Key debounce of 1 ms on press and 7 ms on release.
- Mouse emulation enabled; acceleration is tuned in `config/mouse.dtsi`.
- Smooth (high-resolution) scrolling, supported by Windows and Linux but not macOS. Scroll
  speeds are tuned for it.
- Inverted nice!view display.
- Bluetooth transmit power raised by 8 dBm and 2M PHY disabled, trading battery for range.
- Idle after 60 s, deep sleep after 5 h.
- Profile selection is written to flash only after 90 s to reduce wear.

## Building

### GitHub Actions

Every push builds six images through ZMK's reusable `build-user-config` workflow, which reads
`build.yaml` and `config/west.yml`: `corne_left`, `corne_right` (both with the nice!view
shields) and `settings_reset` on `nice_nano_v2`, plus `eyelash_corne_left`,
`eyelash_corne_right` (both with `nice_view`) and an `eyelash_corne_left` `settings_reset`.
The Eyelash Corne board definition comes from
[a741725193/zmk-new_corne](https://github.com/a741725193/zmk-new_corne), pinned to `a7d9308`
in `config/west.yml`. Download the `.uf2` files from the workflow run artifacts.

### Locally with the devcontainer

Open the repo in VS Code and reopen in the container. The image copies `config/west.yml`
into a west workspace at `/zmk-ws` and runs `west update` there, so ZMK lands in `/zmk-ws/zmk`
at the revision the manifest names. It also creates a non-root user whose uid/gid match the
host user so files written to the workspace stay owned by you. Then, from the repository root:

```sh
bin/build-corne [tag] [filter]
```

This builds every `include` entry in `build.yaml` and writes each image to
`build/<board>-<first shield>-zmk-<tag>.uf2`, for example
`build/nice_nano_v2-corne_left-zmk-<tag>.uf2`. The tag defaults to today's date. `filter` is
an optional substring matched against `"<board> <shield>"` to build only some entries, e.g.
`bin/build-corne test corne_right`. Build directories are kept in `/zmk-ws/zmk/build/`.

After editing `config/west.yml`, run `bin/west-sync` inside the container to update the
workspace; the devcontainer also runs it every time the container is created.

To build from a plain terminal without VS Code, use the devcontainer CLI:

```sh
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . bin/build-corne
```

### Flashing

Both keyboards flash the same way. Double-tap the reset button on a half to enter the
bootloader, then copy the matching `.uf2` onto the `NICENANO` USB drive that appears. Flash
the left half first; it is the central side on both keyboards. If the halves stop pairing with
each other, flash the keyboard's `settings_reset` image on both halves, then the normal images
again: `nice_nano_v2-settings_reset` for the corne, `eyelash_corne_left-settings_reset` for
the Eyelash.

## Development notes

- The ZMK revision lives only in `config/west.yml`. The Docker image seeds its west
  workspace from that file (the build context is the repo root for this reason), and
  `bin/west-sync` re-applies it to a running container.
- Until November 2026 the firmware was built from urob's ZMK fork on Zephyr 3.5. The tag
  `corne-working-2026-11-16` marks the last commit on that fork, built and tested on the
  device, in case the upstream build misbehaves.
- Mouse emulation uses upstream's pointing behaviors (`&mmv`, `&msc`, `&mkp`) with speeds
  set through `ZMK_POINTING_DEFAULT_*_VAL` in `config/mouse.dtsi`.
- Zephyr's CMake package is registered per user with `west zephyr-export`. The Dockerfile
  runs it for the container user; if a build fails with "Could not find a package
  configuration file provided by Zephyr", run `bin/west-sync`, which runs it again.
- On the Eyelash Corne the nice!view screens stay blank unless the backlight output (P1.13)
  is driven, so `config/eyelash_corne.conf` enables the backlight at 100%. Do not bind `&bl`
  keys on it; dimming or switching the backlight off blanks the screens.
- `CONFIG_ZMK_DISPLAY_INVERT=y` is reported as ignored at build time because the nice!view
  status screen does not use the LVGL mono theme the option depends on. It is harmless.
