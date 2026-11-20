// Cheat-sheet labels for everything both keyboards share: the 42 keys of each layer
// (config/layers.dtsi), the combos (config/combos.dtsi), the legend and the common notes.
// Each keyboard's HTML file adds only its own slots (outer columns, joystick, encoder, extra
// layers). Update this file when layers.dtsi or combos.dtsi change.
//
// Key label syntax (one string per key):
//
//   'Q'                     tap legend
//   'F hold:⌃'              tap F, hold Ctrl (drawn in the bar at the bottom of the key)
//   ', shift:;'             top-right legend: what the key sends with Shift
//   '← cap:mouse'           small caption at the top left (on an encoder rotation: a line above the label)
//   '⎋ hold:@num'           @<layer id> in hold: hold for that layer
//   '@base cap:unlock'      @<layer id> as the tap: switch to (or toggle) that layer
//   __                      &trans: falls through to Base (drawn faded, with the Base legend)
//   XX                      &none: does nothing (drawn hatched)
//
// The parts can be combined in any order after the tap legend: '⌫ hold:@nav shift:⌦'.
// A space inside the tap legend makes a line break ('R click').
//
// Each layer mirrors its row macros in layers.dtsi:
//   left, right: 3 rows of 5 keys (<P>_L1..L3 and <P>_R1..R3)
//   thumbs:      the 6 thumb keys, left to right (<P>_T)
//   held:        index (0-5) of the thumb key that is held to reach the layer
const __ = '__', XX = 'XX';

const SHARED = {
  glossary: '⇧ Shift   ⌃ Ctrl   ⌥ Alt   ⊞ Win   ⇥ Tab   ⏎ Enter   ⎋ Esc   ⌫ Bksp   ⌦ Del   ⇪ Caps   ≣ Menu   ☀ brightness   🔊 🔉 🔇 volume   ⏮ ⏯ ⏭ ⏪ ⏩ media',

  layers: [
    {
      id: 'base', name: 'Base', short: 'Base', color: '#334155',
      reach: 'default layer · back from a locked layer: right outer thumb',
      left: [
        ['Q', 'W',        'E',        'R',        'T'],
        ['A', 'S hold:⌥', 'D hold:⊞', 'F hold:⌃', 'G hold:⇧'],
        ['Z', 'X',        'C',        'V',        'B'],
      ],
      right: [
        ['Y',        'U',        'I',                  'O',         'P'],
        ['H hold:⇧', 'J hold:⌃', 'K hold:⊞',           'L hold:⌥',  '\' shift:"'],
        ['N',        'M',        '= hold:F2 shift:F4', ', shift:;', '. shift::'],
      ],
      thumbs: ['⇥', '⏎ hold:⇧', '⎋ hold:@num',     '⌫ hold:@nav shift:⌦', 'Space hold:@sym', '⌃ hold:@sys cap:right'],
    },
    {
      id: 'nav', name: 'Move', short: 'Move', color: '#2563eb',
      reach: 'hold ⌫ · lock: ⇥ + ⌫',
      left: [
        ['R click cap:mouse', '← cap:mouse', '↓ cap:mouse', '↑ cap:mouse', '→ cap:mouse'],
        ['⌥⇥',                __,            __,            __,            __],
        ['Undo',              'Cut',         'Copy',        'Paste',       'Redo'],
      ],
      right: [
        ['Home',       'PgDn',       'PgUp',       'End',        '≣ cap:menu'],
        ['←',          '↓',          '↑',          '→',          '⏎'],
        ['← cap:type', '↓ cap:type', '↑ cap:type', '→ cap:type', '↳ cap:type'],
      ],
      thumbs: [__, __, __,     __, __, '@base cap:unlock'],
      held: 3,
    },
    {
      id: 'sym', name: 'Symbol', short: 'Sym', color: '#a21caf',
      reach: 'hold Space · lock: ⇥ + Space',
      left: [
        ['^ hold:`', '!', '@', '#',        '$'],
        ['~',        '?', '_', '( hold:)', '[ hold:]'],
        ['&',        '%', '|', '< hold:>', '{ hold:}'],
      ],
      right: [
        ['⚠ cap:type', '✅ cap:type', '❌ cap:type', '*', '/ hold:\\'],
        [__,           __,           __,           '+', '-'],
        ['· cap:type', '— cap:type', '⇒ cap:type', ';', ':'],
      ],
      thumbs: [__, __, __,     __, __, '@base cap:unlock'],
      held: 4,
    },
    {
      id: 'num', name: 'Numeric', short: 'Num', color: '#15803d',
      reach: 'hold ⎋ · lock: ⇥ + ⎋',
      left: [
        [':q! cap:nvim', ':w cap:nvim', __, __, __],
        [__,             __,            __, __, __],
        [__,             __,            __, __, __],
      ],
      right: [
        ['7', '8', '9', '*', '/ hold:\\'],
        ['4', '5', '6', '+', '-'],
        ['1', '2', '3', __,  __],
      ],
      thumbs: [__, __, __,     '0', __, '@base cap:unlock'],
      held: 2,
    },
    {
      id: 'sys', name: 'System', short: 'Sys', color: '#c2410c',
      reach: 'hold the right outer thumb (⌃) · lock: ⇥ + that key',
      left: [
        ['F1',  'F2',  'F4',  'F5',  'ScrLk'],
        ['BT1', 'BT2', 'BT3', 'BT4', 'BT5'],
        ['F8',  'F10', 'F11', 'F12', 'PrtSc'],
      ],
      right: [
        ['☀+', '🔊', '⏭', '⏩', '⌃⌥⌦'],
        ['☀−', '🔉', '⏮', '⏪', '⌃⇧⎋'],
        [XX,   '🔇', '⏯', XX,   'Ext Pwr cap:on/off'],
      ],
      thumbs: [__, __, __,     __, __, '@base cap:unlock'],
      held: 5,
    },
  ],

  // Combos (config/combos.dtsi). layer: colours the action; only: the layer the combo is limited to.
  combos: [
    { keys: '⇥ + ⏎',         does: '⇪ Caps Lock' },
    { keys: '⇥ + ⎋',         does: 'lock Numeric', layer: 'num' },
    { keys: '⇥ + ⌫',         does: 'lock Move',    layer: 'nav' },
    { keys: '⇥ + Space',     does: 'lock Symbol',  layer: 'sym' },
    { keys: '⇥ + right ⌃',   does: 'lock System',  layer: 'sys' },
    { keys: 'R + T',         does: 'left click',        only: 'Move' },
    { keys: "' + C",         does: 'ç',                 only: 'Base' },
    { keys: 'A + S + D + F', does: 'clear BT bond',     only: 'System' },
  ],

  // Legend samples: a key drawn with the syntax above, and its explanation.
  legend: [
    { key: 'F hold:⌃',       text: 'big = tap, bar = hold' },
    { key: ', shift:;',      text: 'top right = with ⇧' },
    { key: '⎋ hold:@num',    text: 'coloured bar = hold for that layer' },
    { key: '@nav cap:lock',  text: 'pill = switch to that layer' },
    { key: '⌫', held: true,  text: 'the thumb key held for this layer' },
    { key: 'A', ghost: true, text: 'faded = same as Base' },
    { key: XX,               text: 'hatched = does nothing' },
  ],

  notes: [
    '⌦ is ⌫ with the right ⇧ only (hold H).',
    ':q! and :w send ⎋ first and ⏎ after. “type” keys type that symbol.',
  ],
};
