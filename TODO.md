---
tasks_version: "0.4"
---

# LOBO's Corne — TODO

> Symbols to add to the keymap, plus the work needed to type them at all. Sections and tasks
> are ordered by suggested priority, highest first. Each bullet gives the symbol, its name,
> and its most common meaning. Layout placement is a later decision.

## Prerequisite

- [ ] **Pick a Unicode input mechanism** — none of the symbols below are plain keycodes, so a macro is needed. On Linux (xps-arch) the usual route is a macro that sends Ctrl+Shift+U, the hex code point, then Space, which works in GTK, Qt, and most terminals. Decide this before adding any symbol. #P1
  - [ ] Write a reusable `unicode` macro that takes the code point
  - [ ] Confirm it works in the terminal, browser, and editor you use most

## Typography

- [ ] **Dashes and dots** — the punctuation you reach for in prose. #P1
  - [ ] `—` em dash: parenthetical break in a sentence
  - [ ] `–` en dash: ranges (10–20) and compound links (suggested addition)
  - [ ] `·` middle dot: list separator, multiplication in some notations
  - [ ] `…` ellipsis: trailing-off or omitted text (suggested addition)
- [ ] **Status marks** — chat, notes, and commit messages. #P2
  - [ ] `✅` check mark: done, approved
  - [ ] `❌` cross mark: failed, rejected
  - [ ] `⚠` warning sign (suggested addition)

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
  - [ ] `→` rightwards arrow: maps to, then, result
  - [ ] `←` leftwards arrow
  - [ ] `↑` upwards arrow
  - [ ] `↓` downwards arrow
  - [ ] `↔` left-right arrow: bidirectional, equivalent
- [ ] **Double arrows** — implication in logic and "therefore" in prose. #P2
  - [ ] `⇒` implies
  - [ ] `⇔` if and only if
  - [ ] `⇏` does not imply
  - [ ] `⇎` not equivalent
  - [ ] `↮` not bidirectional: not equivalent (single-stroke form)
  - [ ] `⇐` leftwards double arrow: is implied by (suggested addition)
- [ ] **Function and flow arrows** — code and diagrams. #P2
  - [ ] `↦` maps to: function definition (x ↦ x²)
  - [ ] `↳` down-right arrow: nested reply, tree child, "continued below"
  - [ ] `↪` right hook arrow: inclusion map, "redirects to"
  - [ ] `↣` right tail arrow: injective function
  - [ ] `↠` two-headed arrow: surjective function (suggested addition)
  - [ ] `⟶` long rightwards arrow (suggested addition)

## Legal and commercial

- [ ] **Legal reference signs** — citing laws and contracts. #P2
  - [ ] `§` section sign: references a section of a law or document
  - [ ] `¶` pilcrow: paragraph mark (suggested addition)
