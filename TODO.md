---
tasks_version: "0.4"
---

# LOBO's Corne — TODO

> Symbols to add to the keymap, plus the work needed to type them at all. Sections and tasks
> are ordered by suggested priority, highest first. Each bullet gives the symbol, its name,
> and its most common meaning. Layout placement is a later decision.
>
> Firmware changes not tied to a symbol are listed under [Firmware](#firmware) at the end.

## Prerequisite

- [x] **Pick a Unicode input mechanism** — `UNICODE_MACRO()` in `config/unicode.dtsi` sends Ctrl+Shift+U, the hex code point, then Space. Works in VS Code; does not work in the terminal or over RDP to Windows (abandoned for now). (done 2026-11-16) #P1
  - [x] Write a reusable `unicode` macro that takes the code point (done 2026-11-13)
  - [x] Confirm it works in the terminal, browser, and editor you use most (done 2026-11-16)

## Typography

- [ ] **Dashes and dots** — the punctuation you reach for in prose. #P1
  - [x] `—` em dash: parenthetical break in a sentence (done 2026-11-16)
  - [ ] `–` en dash: ranges (10–20) and compound links (suggested addition)
  - [x] `·` middle dot: list separator, multiplication in some notations (done 2026-11-16)
  - [ ] `…` ellipsis: trailing-off or omitted text (suggested addition)
- [x] **Status marks** — chat, notes, and commit messages. (done 2026-11-17) #P2
  - [x] `✅` check mark: done, approved (done 2026-11-17)
  - [x] `❌` cross mark: failed, rejected (done 2026-11-17)
  - [x] `⚠` warning sign (suggested addition) (done 2026-11-17)

## Ordinals, degrees and superscripts

- [ ] **Portuguese ordinals** — `1º`, `2ª`, used daily in Portuguese text. #P1
  - [ ] `º` masculine ordinal indicator
  - [ ] `ª` feminine ordinal indicator
  - [ ] `°` degree sign: temperature and angles; distinct from `º` (suggested addition)
- [ ] **Superscripts** — powers and footnote markers. #P2
  - [ ] `¹` superscript one
  - [ ] `²` superscript two: squared
  - [ ] `³` superscript three: cubed
- [ ] **Fractions** — single-glyph fractions for recipes and measurements. #P3
  - [ ] `¼` one quarter
  - [ ] `½` one half
  - [ ] `¾` three quarters

## Math

- [ ] **Everyday arithmetic and comparison** — the symbols most likely to appear outside formal math. #P2
  - [ ] `±` plus-minus: tolerance, error margin
  - [ ] `×` multiplication sign: dimensions (3×4), products (suggested addition)
  - [ ] `÷` division sign (suggested addition)
  - [ ] `≠` not equal to
  - [ ] `≈` approximately equal to
  - [ ] `≤` less than or equal to
  - [ ] `≥` greater than or equal to
  - [ ] `∞` infinity
  - [ ] `√` square root (suggested addition)
- [ ] **Calculus and series** — notation for formulas in notes and documentation. #P3
  - [ ] `∑` n-ary summation: sum over a series
  - [ ] `∏` n-ary product: product over a series
  - [ ] `∫` integral
  - [ ] `∂` partial differential
  - [ ] `∝` proportional to
  - [ ] `∆` increment: change in a quantity (suggested addition)
  - [ ] `π` pi (suggested addition)

## Sets and logic

- [ ] **Set membership and operations** — discrete math, type theory, documentation. #P2
  - [ ] `∈` element of
  - [ ] `∉` not an element of
  - [ ] `∋` contains as member (reversed ∈)
  - [ ] `∌` does not contain as member
  - [ ] `∅` empty set
  - [ ] `∩` intersection
  - [ ] `∪` union
  - [ ] `∁` complement
  - [ ] `⊂` `⊆` subset, subset or equal (suggested addition)
  - [ ] `⊃` `⊇` superset, superset or equal (suggested addition)
- [ ] **Logical operators** — boolean logic, proofs, and spec writing. #P2
  - [ ] `¬` not
  - [ ] `∧` and
  - [ ] `∨` or
  - [ ] `⊻` xor: exclusive or
  - [ ] `⊼` nand
  - [ ] `⊽` nor
  - [ ] `⊕` circled plus: xor in many texts, direct sum (suggested addition)
  - [ ] `∀` for all
  - [ ] `∃` there exists (suggested addition)
  - [ ] `∴` therefore
  - [ ] `∵` because
  - [ ] `⊤` `⊥` top and bottom: true/false, also "undefined" in type theory (suggested addition)
  - [ ] `⊢` `⊨` proves, entails (suggested addition)

## Arrows

- [ ] **Basic arrows** — directions, "leads to", keyboard-shortcut docs. #P1
  - [x] `→` rightwards arrow: maps to, then, result (done 2026-11-17)
  - [x] `←` leftwards arrow (done 2026-11-17)
  - [x] `↑` upwards arrow (done 2026-11-17)
  - [x] `↓` downwards arrow (done 2026-11-17)
  - [ ] `↔` left-right arrow: bidirectional, equivalent
- [ ] **Double arrows** — implication in logic and "therefore" in prose. #P2
  - [x] `⇒` implies (done 2026-11-17)
  - [ ] `⇔` if and only if
  - [ ] `⇏` does not imply
  - [ ] `⇎` not equivalent
  - [ ] `↮` not bidirectional: not equivalent (single-stroke form)
  - [ ] `⇐` leftwards double arrow: is implied by (suggested addition)
- [ ] **Function and flow arrows** — code and diagrams. #P2
  - [ ] `↦` maps to: function definition (x ↦ x²)
  - [x] `↳` down-right arrow: nested reply, tree child, "continued below" (done 2026-11-17)
  - [ ] `↪` right hook arrow: inclusion map, "redirects to"
  - [ ] `↣` right tail arrow: injective function
  - [ ] `↠` two-headed arrow: surjective function (suggested addition)
  - [ ] `⟶` long rightwards arrow (suggested addition)

## Legal and commercial

- [ ] **Legal reference signs** — citing laws and contracts. #P2
  - [ ] `§` section sign: references a section of a law or document
  - [ ] `¶` pilcrow: paragraph mark (suggested addition)

## Firmware

- [ ] **Scroll keys** — the Move layer lost its scroll keys (and WIN+S) when row 1 became mouse click and movement on 2026-11-17, so the corne has no way to scroll. Find them a place in `config/layers.dtsi`; the Eyelash will also scroll with its encoder (Eyelash plan, Phase 3). #P2
- [ ] **Smooth scrolling** — enable `CONFIG_ZMK_POINTING_SMOOTH_SCROLLING` (high-resolution scroll) in both `config/corne.conf` and `config/eyelash_corne.conf`, then retune the scroll values in `config/mouse.dtsi`, since the option changes the scroll scale. Do it after the Eyelash plan's Phase 3, so the eyelash encoder scrolling is tuned at the same time. Check on the Arch machine; macOS support is weaker. #P3
