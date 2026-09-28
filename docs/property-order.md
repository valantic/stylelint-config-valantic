# Property order groups (`property-groups/`)

The [fix config](./fix-config.md) enforces one strict, flat property order via `order/properties-order`. That array
is built by concatenating seven files under `property-groups/`, each exporting a flat array of property names (or
patterns) via `module.exports = [...]`. **File order, and the order of entries within each file, directly becomes
the enforced declaration order** — `order/properties-order` flags any declaration order that doesn't follow the
array's sequence.

The grouping follows an "outside-in" mental model of how a box is built up on screen: where it sits, its own
dimensions, how it looks, then its text, then animation, then anything left over. When adding a new property, decide
(1) which group it conceptually belongs to, and (2) where within that group's array it belongs relative to related
properties (e.g. a shorthand like `margin` before its longhands `margin-top`/`margin-right`/`margin-bottom`/
`margin-left`).

## `0_reset.js` — Reset

Just `all` — the CSS reset property, since it must come before anything else that sets a specific property.

## `1_positioning-layout.js` — Positioning & layout

Where the element sits and how it lays out its children: `position`, `top`/`right`/`bottom`/`left`, `z-index`,
`display`, `visibility`, `content`, the full Grid property set (`grid`, `grid-template*`, `grid-column*`,
`grid-row*`, `grid-gap`/`gap`, `grid-auto-*`, `grid-area`), the full Flexbox property set (`flex`, `flex-grow`,
`flex-shrink`, `flex-basis`, `flex-flow`, `flex-direction`, `flex-wrap`, `justify-content`, `align-content`,
`align-items`, `align-self`, `order`), and `float`/`clear`.

## `2_boxModel.js` — Box model

The box's own dimensions and spacing: `box-sizing`, `width`/`min-width`/`max-width`, `height`/`min-height`/
`max-height`, `margin` and its longhands, `padding` and its longhands, `overflow`/`overflow-x`/`overflow-y`.

## `3_visual.js` — Visual

How the box looks, independent of its content: table/list-specific properties (`table-layout`, `empty-cells`,
`list-style*`, `caption-side`, `box-decoration-break`), `opacity`, `outline*`, the full `border*` set (including
per-side and `border-radius`/`border-image*`), `border-collapse`/`border-spacing`, SVG `stroke*`/`fill*`, the
`background*` set, `backdrop-filter`, `box-shadow`, `transform*`/`backface-visibility`/`perspective*`, `filter`, and
`cursor`.

## `4_typography.js` — Typography

How text inside the box looks: `color`, the `font*` family, `direction`, `line-height`, `letter-spacing`,
`word-spacing`, `tab-size`, `text-*` (align/transform/decoration/emphasis/indent/shadow/overflow/…), `word-wrap`,
`word-break`, `white-space`, `hyphens`, `vertical-align`, the `column*` (multi-column layout) set, `unicode-bidi`,
`src`.

## `5_animation.js` — Animation

`transition*` (delay, timing-function, duration, property) and `animation*` (name, duration, play-state,
timing-function, delay, iteration-count, direction, fill-mode).

## `6_misc.js` — Misc

Anything left over: `appearance`, `clip`/`clip-path`, `counter-reset`/`counter-increment`, `resize`,
`user-select`, the `nav-*` CSS3 spatial-navigation properties, `pointer-events`, `quotes`, `touch-action`,
`will-change`, `zoom`.
