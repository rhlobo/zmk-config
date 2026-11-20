# Spec and plan: Eyelash Corne support from one `master`

Status: Phases 0–3 implemented (steps 6–8 together, see the amendments in section 1). Written 2026-11-16 after interviewing the owner.

## 1. Decisions (from the interview)

| Topic | Decision |
| --- | --- |
| Vendor module pin | `a741725193/zmk-new_corne` at `a7d93082b24f5b20e710a5db9b0e3141ade229b3` (2026-03-05, last commit before "Dev1"). At this revision the keyboard is a Zephyr **board** (`eyelash_corne_left`, `eyelash_corne_right`), not a shield; nice!view is its only shield. The pin includes the January 2026 encoder fix (steps 40, 20 triggers per rotation). |
| Base firmware | Upstream ZMK `v0.3`, unchanged. Verified: both eyelash halves build with no extra modules and with RGB, backlight, soft-off and Studio off. |
| Backlight (amended 2026-11-19) | On at 100% on the Eyelash only (`CONFIG_ZMK_BACKLIGHT=y`, `CONFIG_ZMK_BACKLIGHT_BRT_START=100`), no `&bl` keys. Device testing showed the nice!view screens stay blank unless the backlight output (P1.13) is driven. |
| Encoder (left half) | Base: volume. Move: vertical scroll. Symbol: horizontal scroll. Numeric: inherits Base. System: screen brightness. |
| Encoder push (left half, Z row) | Base: mute. Move: left click. Other layers: `&trans`. |
| Joystick (right half) | Base: mouse movement, press = left click, Shift + press = right click. Move, Symbol, Numeric: inherit Base. System: prev/next on left/right, volume on up/down, play/pause on press. |
| Macro shape | Option A: shared half-row macros per layer, composed by each keyboard's keymap around its own extra slots. |
| Shared conf settings | Duplicated in both conf files with a comment pointing at the twin. |
| Eyelash debounce | Same as the corne (1 ms press, 7 ms release); raise only on chatter. |
| Local builds | Container-local west workspace at `/zmk-ws` initialised from a copy of `config/west.yml`; the manifest is the only place a revision is written. |
| Build script | `bin/build-corne` keeps its name and reads `build.yaml`. |
| Settings reset | A dedicated `eyelash_corne_left` + `settings_reset` entry. |
| Keyboard name | `LOBO's Corne` stays; the second is `Eyelash-Corne`. NKRO and smooth scrolling are not enabled; both keyboards get the same settings. |
| Central half | Left on both boards. Flashing and pairing instructions stay the same. |

### Amendments by the owner (2026-11-20)

Agreed while carrying out steps 6–8, which were done together in one change:

- Outer columns, the joystick on Move, Symbol and Sim, and a sixth layer `Sim` (Eyelash only,
  index 5, toggled by the right outer top key on Base) are in scope. The bindings are listed in
  the comment table at the top of `config/eyelash_corne.keymap` and in the README.
- Encoder, replacing section 3.5: Base vertical scroll, push = middle click; Move horizontal
  scroll, push = right click; Symbol zoom (Ctrl+= / Ctrl+-), push = Ctrl+0; System volume,
  push = mute; Numeric scrolls as Base, push = keypad Enter; Sim sends Ctrl+Alt+F13 /
  Ctrl+Alt+F14 (monitor brightness through Twinkle Tray hotkeys), push = Ctrl+F15. Win+L moved
  to System's left outer middle key.
- Smooth scrolling is enabled on both keyboards at the same time (the TODO item).
- Step 7's direction check is done on the device with the final bindings.
- The encoder and joystick behaviours live in `eyelash_corne.keymap` (they are hardware-specific),
  not in `behaviors.dtsi`.

Out of scope: outer-column keys, RGB, backlight as a lighting feature (see the amendment above), soft-off, ZMK Studio, DYA modules.

## 2. Hardware facts used by the spec

### 2.1 Eyelash key positions

The vendor transform has 48 positions. Matrix column 12 is the joystick (right half), `RC(3,2)`
is the encoder push (left half). The 42 shared positions appear in the same visual order as on
the standard corne, so a half-row macro expands identically on both boards.

```
      -------------------------------------------------------------                     -------------------------------------------------------------
   0  |     1     |     2     |     3     |     4     |     5     |        [6]          |     7     |     8     |     9     |    10     |    11     |  12
  13  |    14     |    15     |    16     |    17     |    18     |  [19]  [20]  [21]   |    22     |    23     |    24     |    25     |    26     |  27
  28  |    29     |    30     |    31     |    32     |    33     |  (34)  [35]         |    36     |    37     |    38     |    39     |    40     |  41
      ------------------------|    42     |    43     |    44     |                     |    45     |    46     |    47     |------------------------
                              -------------------------------------                     -------------------------------------
  [6] joystick up   [19] joystick left   [20] joystick press   [21] joystick right   [35] joystick down   (34) encoder push
```

The direction labels (up, left, press, right, down) are taken from the vendor keymap and are
confirmed on the device in Phase 3 step 1.

### 2.2 Standard corne positions (unchanged)

0 to 41 as drawn in today's `config/key_positions.dtsi`.

### 2.3 Encoder behaviours available upstream

- `&inc_dec_kp A B`: taps `A` per clockwise tick and `B` per counter-clockwise tick. Accepts modified keys.
- `zmk,behavior-sensor-rotate` with `&msc` bindings: scrolling. The vendor used this before Dev1.
- A layer without `sensor-bindings` is skipped, so the lookup falls through to the next active layer (verified in `app/src/keymap.c`, v0.3).

## 3. Target file layout

### 3.1 Shared (defined once, used by both keymaps)

| File | Content |
| --- | --- |
| `config/layers.dtsi` | Layer index defines (`LDEF`..`LSYS`) and, per layer, seven macros covering the 42 common positions, each next to the layer's ASCII diagram (moved from `corne.keymap`). |
| `config/behaviors.dtsi` | The `behaviors { }` node: `hm`, `shm`, `tmt`, `tlt`, `cht`, `bspc_del_nav`, `equal_f2_f4`, `dot_colon`, `coma_semi`, plus the shared encoder rotate behaviours `enc_scroll_v` and `enc_scroll_h`. |
| `config/macros.dtsi` | The `macros { }` node: `nvim_save`, `nvim_quit`, `ccedil_xpsarch_macro`, the `UNICODE_MACRO()` uses. |
| `config/combos.dtsi` | The `combos { }` node exactly as today, written against `KL..`/`KR..` aliases. |
| `config/mouse.dtsi` | Unchanged. |
| `config/unicode.dtsi` | Unchanged. |

Each shared node file is a complete devicetree fragment (`/ { behaviors { ... }; };`). Devicetree
merges repeated root nodes, so the keymap just includes them in order.

### 3.2 Per keyboard

| Corne | Eyelash | Content |
| --- | --- | --- |
| `config/corne.keymap` | `config/eyelash_corne.keymap` | Includes, the keyboard's `keymap { }` composed from the shared macros plus its own slots, and keyboard-only behaviours. |
| `config/corne.conf` | `config/eyelash_corne.conf` | Kconfig. Common block duplicated with a header comment naming the twin file. |
| `config/corne_positions.dtsi` (renamed from `key_positions.dtsi`) | `config/eyelash_corne_positions.dtsi` | `KL..`/`KR..` aliases mapping the same names to that board's positions. The eyelash file also defines `JOY_UP`, `JOY_LEFT`, `JOY_PRESS`, `JOY_RIGHT`, `JOY_DOWN`, `ENC_PUSH`. |

### 3.3 Macro shape (option A)

`config/layers.dtsi`, Base layer excerpt:

```c
#define LDEF 0
#define LNAV 1
#define LSYM 2
#define LNUM 3
#define LSYS 4

// BASE ----------------------------------------------------------------------------------------
//       -------------------------------------------------------------     -------------------------------------------------------------
//       |     Q     |     W     |     E     |     R     |     T     |     |     Y     |     U     |     I     |     O     |     P     |
//       |     A     |     S     |     D     |     F     |     G     |     |     H     |     J     |     K     |     L     |    ' "    |
//       |     Z     |     X     |     C     |     V     |     B     |     |     N     |     M     |    = F2   |    , ;    |    . :    |
//       ------------------------|    TAB    |   ENTER   |    ESC    |     |    BSPC   |   SPACE   |   CAPSW   |------------------------
//                               -------------------------------------     -------------------------------------
#define BASE_L1  &kp Q        &kp W        &kp E        &kp R         &kp T
#define BASE_R1  &kp Y        &kp U        &kp I        &kp O         &kp P
#define BASE_L2  &kp A        &shm LALT S  &hm LCMD D   &hm LCTRL F   &hm LSHIFT G
#define BASE_R2  &hm RSHIFT H &hm LCTRL J  &hm LCMD K   &shm LALT L   &kp SQT
#define BASE_L3  &kp Z        &kp X        &kp C        &kp V         &kp B
#define BASE_R3  &kp N        &kp M        &equal_f2_f4 &coma_semi    &dot_colon
#define BASE_T   &kp TAB  &tmt LSHFT ENTER  &tlt LNUM ESC      &bspc_del_nav  &tlt LSYM SPACE  &tlt LSYS RCTRL
```

Same seven names per layer with prefixes `NAV_`, `SYM_`, `NUM_`, `SYS_`. The outer-column
`&trans` entries stay in the keyboard keymaps because the outer column is physically per board.

`config/corne.keymap`, Base layer expanded:

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

`config/eyelash_corne.keymap`, Base layer expanded (Phase 3 bindings):

```c
//  extras: joystick = mouse move, press = click (Shift: right click); encoder = volume, push = mute
        default_layer {
            display-name = "Base";
            bindings = <
&trans   BASE_L1                      &mmv MOVE_UP                     BASE_R1   &trans
&trans   BASE_L2   &mmv MOVE_LEFT     &joy_click     &mmv MOVE_RIGHT   BASE_R2   &trans
&trans   BASE_L3   &kp C_MUTE         &mmv MOVE_DOWN                   BASE_R3   &trans
         BASE_T
            >;
            sensor-bindings = <&inc_dec_kp C_VOL_UP C_VOL_DN>;
        };
```

Column alignment in the eyelash file follows the transform: row 1 has one extra slot after the
left half, row 2 has three, row 3 has the encoder push then the joystick down.

### 3.4 Eyelash-only devicetree (lives in `eyelash_corne.keymap`)

```c
/ {
    behaviors {
        // Joystick press: left click, right click while Shift is held (ENTER thumb hold)
        joy_click: joy_click {
            compatible = "zmk,behavior-mod-morph";
            #binding-cells = <0>;
            bindings = <&mkp LCLK>, <&mkp RCLK>;
            mods = <(MOD_LSFT|MOD_RSFT)>;
        };
    };
};
```

Shared encoder rotate behaviours (in `behaviors.dtsi`, harmless on the corne because they are
`/omit-if-no-ref/` style unused nodes; if the corne build complains about an unused sensor
behaviour, move them into the eyelash keymap):

```c
        enc_scroll_v: enc_scroll_v {
            compatible = "zmk,behavior-sensor-rotate";
            #sensor-binding-cells = <0>;
            bindings = <&msc SCRL_DOWN>, <&msc SCRL_UP>;
            tap-ms = <100>;
        };
        enc_scroll_h: enc_scroll_h {
            compatible = "zmk,behavior-sensor-rotate";
            #sensor-binding-cells = <0>;
            bindings = <&msc SCRL_RIGHT>, <&msc SCRL_LEFT>;
            tap-ms = <100>;
        };
```

### 3.5 Per-layer extras on the eyelash (Phase 3)

| Layer | Joystick up / down | Joystick left / right | Joystick press | Encoder push | Encoder rotation |
| --- | --- | --- | --- | --- | --- |
| Base | `&mmv MOVE_UP` / `MOVE_DOWN` | `&mmv MOVE_LEFT` / `MOVE_RIGHT` | `&joy_click` | `&kp C_MUTE` | `&inc_dec_kp C_VOL_UP C_VOL_DN` |
| Move | `&trans` | `&trans` | `&trans` | `&mkp LCLK` | `&enc_scroll_v` |
| Symbol | `&trans` | `&trans` | `&trans` | `&trans` | `&enc_scroll_h` |
| Numeric | `&trans` | `&trans` | `&trans` | `&trans` | none (inherits Base) |
| System | `&kp C_VOL_UP` / `C_VOL_DN` | `&kp C_PREV` / `C_NEXT` | `&kp C_PP` | `&trans` | `&inc_dec_kp C_BRI_UP C_BRI_DN` |

### 3.6 Position alias files

`config/corne_positions.dtsi`: today's `key_positions.dtsi`, renamed, diagram and defines unchanged.

`config/eyelash_corne_positions.dtsi`:

```c
#define KL15 1
#define KL14 2
#define KL13 3
#define KL12 4
#define KL11 5
#define KR11 7
#define KR12 8
#define KR13 9
#define KR14 10
#define KR15 11
#define KL25 14
#define KL24 15
#define KL23 16
#define KL22 17
#define KL21 18
#define KR21 22
#define KR22 23
#define KR23 24
#define KR24 25
#define KR25 26
#define KL35 29
#define KL34 30
#define KL33 31
#define KL32 32
#define KL31 33
#define KR31 36
#define KR32 37
#define KR33 38
#define KR34 39
#define KR35 40
#define KL43 42
#define KL42 43
#define KL41 44
#define KR41 45
#define KR42 46
#define KR43 47

#define JOY_UP    6
#define JOY_LEFT  19
#define JOY_PRESS 20
#define JOY_RIGHT 21
#define JOY_DOWN  35
#define ENC_PUSH  34
```

Every combo in `combos.dtsi` therefore lands on the same physical keys on both boards.

### 3.7 Include order in each keymap

```c
#include <behaviors.dtsi>
#include <dt-bindings/zmk/bt.h>
#include <dt-bindings/zmk/keys.h>
#include <dt-bindings/zmk/ext_power.h>
#include "mouse.dtsi"                    // also pulls dt-bindings/zmk/pointing.h
#include "unicode.dtsi"
#include "corne_positions.dtsi"          // or eyelash_corne_positions.dtsi
#include "layers.dtsi"                   // layer indices + row macros; must precede behaviors.dtsi
#include "behaviors.dtsi"
#include "macros.dtsi"
#include "combos.dtsi"
```

`layers.dtsi` comes before `behaviors.dtsi` because `bspc_del_nav` references `LNAV`.

## 4. Build system changes

### 4.1 `build.yaml`

```yaml
include:
  - board: nice_nano_v2
    shield: corne_left nice_view_adapter nice_view
  - board: nice_nano_v2
    shield: corne_right nice_view_adapter nice_view
  - board: nice_nano_v2
    shield: settings_reset
  - board: eyelash_corne_left
    shield: nice_view
  - board: eyelash_corne_right
    shield: nice_view
  - board: eyelash_corne_left
    shield: settings_reset
```

The eyelash flash layout matches nice_nano_v2 (code at 0x26000, storage at 0xec000), so the
existing reset image would likely work, but the dedicated entry removes the doubt.

### 4.2 `config/west.yml`

```yaml
manifest:
  remotes:
    - name: zmkfirmware
      url-base: https://github.com/zmkfirmware
  projects:
    - name: zmk
      remote: zmkfirmware
      revision: v0.3
      import: app/west.yml
    # Eyelash Peripherals Corne board definition. Pinned to the last commit before "Dev1"
    # (2026-06-05), which added cormoran's ZMK fork and DYA Studio modules.
    - name: eyelash_corne
      url: https://github.com/a741725193/zmk-new_corne
      revision: a7d93082b24f5b20e710a5db9b0e3141ade229b3
  self:
    path: config
```

### 4.3 Devcontainer: one source of truth for revisions

`.devcontainer/devcontainer.json`:

- `build.context` becomes `..` so the Dockerfile can copy `config/west.yml`.
- Build args drop `ZMK_URL` and `ZMK_BRANCH`; keep `USERNAME`, `USER_UID`, `USER_GID`.
- `containerEnv`: `ZMK_WORKSPACE=/zmk-ws`, `ZMK_PATH=/zmk-ws/zmk` (still the ZMK repo, so `bin/build-corne` keeps `cd $ZMK_PATH && west build -s app`), `WORKSPACE_PATH`, `BUILD_SUBFOLDER`. `ZMK_REF` is removed.
- `updateContentCommand`: `bin/west-sync`.

`.devcontainer/Dockerfile`:

```dockerfile
FROM docker.io/zmkfirmware/zmk-dev-arm:stable
ARG ZMK_WORKSPACE=/zmk-ws
# Seed the west workspace from the config repo's manifest so the image build caches Zephyr.
COPY config/west.yml ${ZMK_WORKSPACE}/config/west.yml
WORKDIR ${ZMK_WORKSPACE}
RUN west init -l config && (west update || west update || west update)
# ... user creation as today, chown ${ZMK_WORKSPACE} ...
USER ${USERNAME}
RUN west zephyr-export
```

New `bin/west-sync` (run inside the container):

```sh
#!/usr/bin/env bash
# Re-sync the container's west workspace with config/west.yml, which is the only place a
# revision is written. Run after changing west.yml; the devcontainer runs it on create.
set -euo pipefail
cp "${WORKSPACE_PATH}/config/west.yml" "${ZMK_WORKSPACE}/config/west.yml"
cd "${ZMK_WORKSPACE}" && west update && west zephyr-export
```

Verified in the container: `west init -l` accepts a plain copied directory (no git repo
needed). If `west update` objects to the manifest repo not being git, add `git init -q config`
before `west init` in the Dockerfile.

### 4.4 `bin/build-corne`

Reads `build.yaml` with the container's Python (PyYAML 6 is present) and builds every
`include` entry. Usage `bin/build-corne [tag] [filter]`, where `filter` is a substring matched
against `"<board> <shield>"` so a single board can be built during device verification.
Output: `build/<board>-<first shield word>-zmk-<tag>.uf2`. Build dirs: `$ZMK_PATH/build/<board>-<first shield>`.
No `ZMK_EXTRA_MODULES` is needed: the workspace already contains the module.

### 4.5 Conf files

`config/eyelash_corne.conf`: copy of `corne.conf` with `CONFIG_ZMK_KEYBOARD_NAME="Eyelash-Corne"`
and a top comment: "Shared block mirrors config/corne.conf; change both." The same comment goes
at the top of `corne.conf`. Nothing else differs: EC11 and ext power come from the board
defconfig; RGB, soft-off, Studio, NKRO and smooth scrolling are left off. Exception (2026-11-19):
`CONFIG_ZMK_BACKLIGHT=y` and `CONFIG_ZMK_BACKLIGHT_BRT_START=100`, with a comment, because the
screens need the backlight output driven.

## 5. Files

### 5.1 Change

| File | Why |
| --- | --- |
| `config/corne.keymap` | Becomes includes plus composed layers; behaviours, macros, combos and diagrams move out. |
| `config/corne.conf` | Twin-file comment at the top. |
| `config/west.yml` | Adds the `eyelash_corne` project. |
| `build.yaml` | Three new entries. |
| `bin/build-corne` | Reads `build.yaml`; optional filter. |
| `.devcontainer/Dockerfile` | West workspace from `config/west.yml`. |
| `.devcontainer/devcontainer.json` | Context, args, env and `updateContentCommand`. |
| `README.md` | Second keyboard, shared versus per-keyboard structure, build and flash procedures (section 7). |
| `CLAUDE.md` | Source of truth for the layout becomes `config/layers.dtsi`; combos in `config/combos.dtsi`. |

### 5.2 Rename

| From | To |
| --- | --- |
| `config/key_positions.dtsi` | `config/corne_positions.dtsi` |

### 5.3 New

`config/layers.dtsi`, `config/behaviors.dtsi`, `config/macros.dtsi`, `config/combos.dtsi`,
`config/eyelash_corne.keymap`, `config/eyelash_corne.conf`, `config/eyelash_corne_positions.dtsi`,
`bin/west-sync`.

### 5.4 Must not change

`config/mouse.dtsi`, `config/unicode.dtsi`, `.github/workflows/build.yml`, `.gitignore`,
`TODO.md`, anything under `reference/`.

## 6. Phased plan

Every step ends with firmware that builds for every entry in `build.yaml` (locally via
`bin/build-corne`, and in CI on push). Nothing is committed by the implementer; the owner
commits after each verified step. The pending upstream-migration changes should be committed
first so each step diffs cleanly.

### Phase 0: build tooling (no keymap change)

1. `.devcontainer` rework, `bin/west-sync`, `bin/build-corne` reading `build.yaml`. Rebuild the container.
   Verify: `bin/build-corne` produces the same two corne images as before plus the nice_nano
   settings reset; flash one half and confirm the keymap is unchanged.
2. Add the `eyelash_corne` project to `config/west.yml` and the three eyelash entries to `build.yaml`,
   with a temporary `config/eyelash_corne.keymap` that is the vendor's pre-Dev1 keymap minus
   RGB, soft-off and Studio bindings, and a two-line `eyelash_corne.conf`. Run `bin/west-sync`.
   Verify: all six entries build locally; CI is green. Nothing to flash yet.

### Phase 1: restructure the corne, no behaviour change

3. Rename `key_positions.dtsi` to `corne_positions.dtsi`; create `combos.dtsi`, `behaviors.dtsi`,
   `macros.dtsi` by moving nodes out of `corne.keymap`; update includes.
   Verify: build; compare `build/<corne-left dir>/zephyr/zephyr.dts` before and after with
   `diff` (the only expected difference is include-order noise). Flash both halves; run through
   every combo in the README table and a home-row mod roll.
4. Create `layers.dtsi` with the diagrams and macros; rewrite each corne layer as the composed
   form. Verify: same `zephyr.dts` diff check must show no change in the `keymap` node; flash and
   spot-check each layer's bindings, including mod-morphs and the Unicode macros.
5. README and CLAUDE.md updates for the shared structure. Verify: links resolve, tables match the tree.

### Phase 2: eyelash as a plain keyboard

6. Replace the temporary eyelash keymap with the composed one: shared includes,
   `eyelash_corne_positions.dtsi`, all six extra slots `&none` on every layer, no `sensor-bindings`.
   Full `eyelash_corne.conf`. Verify: all six entries build; CI green. On the device: flash left
   (central) then right, pair, type on every layer, confirm every combo fires on the same keys
   as the corne, confirm the outer columns do nothing.

### Phase 3: encoder and joystick

7. Direction check: bind the five joystick slots to `&kp UP`, `LEFT`, `ENTER`, `RIGHT`, `DOWN`
   and the encoder push to `&kp SPACE` on Base only, add `sensor-bindings = <&inc_dec_kp C_VOL_UP C_VOL_DN>`.
   Verify on the device that each physical direction produces the matching key, that the
   encoder raises volume clockwise, and fix the aliases in `eyelash_corne_positions.dtsi` if
   the vendor labels were wrong.
8. Final bindings per the table in section 3.5, including `joy_click` and the two scroll
   behaviours. Verify: Base joystick moves the pointer and clicks, right-clicks with the ENTER
   thumb held; encoder push mutes; on Move the encoder scrolls vertically and the push left-clicks;
   on Symbol the encoder scrolls horizontally; on Numeric the encoder still changes volume; on
   System the joystick drives media keys and the encoder changes brightness.
9. README: document the extras per layer. Verify: README matches the keymap comments.

## 7. README changes (carried out in steps 5 and 9)

- Title and intro: two keyboards, one layout. Name the Eyelash Peripherals Corne, its vendor
  repo, that it is not compatible with the standard corne shield, and the pin.
- Layout: the layout lives in `config/layers.dtsi`; combos in `config/combos.dtsi`; per-keyboard
  keymaps only compose. New "Eyelash extras" subsection with the section 3.5 table.
- Repository layout table: all new and renamed files; `bin/west-sync`; `EYELASH_PLAN.md` while it exists.
- Notable firmware settings: both conf files share the block; the eyelash name.
- Building: GitHub Actions builds six images; local build procedure with `bin/build-corne [tag] [filter]`;
  the west workspace is `/zmk-ws`, refreshed with `bin/west-sync` after editing `config/west.yml`.
- Flashing: same procedure for both boards; left is central on both; two settings reset images
  and which goes where.
- Development notes: the revision now lives only in `config/west.yml`; remove the "two places"
  note and the `ZMK_REF` mention.
