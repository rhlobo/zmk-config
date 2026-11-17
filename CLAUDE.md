# CLAUDE.md

Personal ZMK firmware config for a Corne keyboard, with Eyelash Corne support being added
from the same layout ([EYELASH_PLAN.md](EYELASH_PLAN.md)). Read [README.md](README.md) for the
project overview, file layout, and build instructions.

## Rules

- Keep [README.md](README.md) up to date. Any change to files, build steps, combos, or
  behavior described there must be reflected in the README in the same change.

- Ignore the `reference/` directory; it holds third-party configs for inspiration only.
- Commit only when explicitly asked. Never add a `Co-Authored-By` line or any other
  attribution to commit messages.
- [`config/layers.dtsi`](config/layers.dtsi) is the source of truth for the layout. Keep the ASCII
  diagram above each layer's row macros in sync when changing bindings. Combos live in
  [`config/combos.dtsi`](config/combos.dtsi).
- Only hardware-specific material goes in a per-keyboard file (keymap, conf, positions). Never
  duplicate a layer row, behavior, macro, mod-morph or combo across keymaps; put it in the
  shared files instead.
