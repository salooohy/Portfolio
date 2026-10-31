---
name: Salih Al-Tak
description: A career drawn as one engineering drawing at its third revision, on vellum or in blueprint.
colors:
  desk: "#e3e4de"
  sheet-vellum: "#f4f5f1"
  ink: "#14161a"
  ink-secondary: "#474b52"
  rule: "rgba(20, 22, 26, 0.16)"
  hatch: "rgba(20, 22, 26, 0.06)"
  dimension-blue: "#1f4fd1"
  redline: "#c4311d"
  blueprint-desk: "#0a1f47"
  blueprint-sheet: "#10336e"
  blueprint-ink: "#eef3ff"
  blueprint-ink-secondary: "#bccbeb"
  blueprint-dimension: "#9fd3ff"
  blueprint-redline: "#ff9a84"
typography:
  display:
    fontFamily: "Osi, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  display-detail:
    fontFamily: "Osi, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.6vw, 4.8rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)"
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 108"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.25
    fontVariation: "'wdth' 105"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Osi, Archivo, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.05em"
  field-label:
    fontFamily: "Osi, Archivo, system-ui, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 400
    letterSpacing: "0.04em"
  signature:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    fontVariation: "'wdth' 80"
rounded:
  none: "0px"
  balloon: "50%"
spacing:
  frame: "clamp(10px, 1.6vw, 22px)"
  gutter: "clamp(16px, 3vw, 40px)"
  cell-x: "12px"
  cell-y: "8px"
  cmd: "9px 14px"
components:
  cmd:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "9px 14px"
  cmd-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet-vellum}"
  cmd-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet-vellum}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "9px 14px"
  cmd-primary-hover:
    backgroundColor: "{colors.dimension-blue}"
    textColor: "{colors.sheet-vellum}"
  view-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.none}"
    padding: "7px 12px"
    height: "40px"
  view-button-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet-vellum}"
  balloon:
    backgroundColor: "{colors.sheet-vellum}"
    textColor: "{colors.dimension-blue}"
    rounded: "{rounded.balloon}"
    size: "44px"
  balloon-active:
    backgroundColor: "{colors.dimension-blue}"
    textColor: "{colors.sheet-vellum}"
---

# Design System: Salih Al-Tak

## Overview

**Creative North Star: "The Drawing at Revision C"**

The whole site is one engineering drawing at its third revision. Every surface is a sheet: a vellum page lying on a slightly darker desk, framed by a heavy drawing border with zone numbers across and zone letters down. Content is not laid out in cards or sections; it is entered into the furniture a drafter would use: a title block, a revision table, general notes, a parts list (BOM), a specifications grid, an approvals block, numbered views.

The material is linework. Ink at two weights carries structure, blue carries dimensions, leaders and item balloons, and red is the redline: it marks only the current revision and live state. There is no fill, no gradient, no radius on rectangles, and depth comes from line weight, not from shadow. A second print, Blueprint, inverts the drawing into diazo blue with pale ink; it is a full peer of vellum, chosen in the index bar or picked up from the OS dark preference.

Motion is the drafter's hand: strokes draw themselves in, the gear tweens between projections, dimensions appear only when a view is square to them. Everything eases out exponentially and settles; nothing bounces. Reduced motion gets the finished drawing.

**Key Characteristics:**
- Vellum sheet on a desk, heavy border, JS-generated zone markers (numbers right to left, letters top to bottom).
- ISO 3098 lettering (osifont) for every drawing annotation; Archivo for notes and prose.
- Ink at two weights (2px heavy, 1px light); blue for dimensions, leaders, balloons; red only for the current revision.
- Drawing furniture as layout: title block, revision table, notes, BOM, specs, approvals.
- Vellum and Blueprint prints, both complete.
- Line-draw reveals and exponential ease-out; reduced motion respected.

## Colors

A drafting palette: warm-neutral vellum and cool near-black ink, one blue for measurement, one red for change.

### Primary
- **Dimension Blue** (`dimension-blue`): dimensions, extension lines and arrowheads, leaders, item balloon rings and numerals, system-schematic connectors, link hover, focus outlines, text selection, primary command hover. It is the color of annotation that points at something.

### Secondary
- **Redline** (`redline`): the current revision only: the Rev C row in the revision table, the Rev C mark in the index bar and title block, the revision cloud, the revision triangle of the current entry, the "Current" status lamp, and the underline marking the sheet in view in the index bar.

### Neutral
- **Vellum Sheet** (`sheet-vellum`): the drawing sheet, balloon fills, label knock-outs over linework, inverted text on ink.
- **Drafting Desk** (`desk`): the page behind the sheets, the sticky index bar, scrollbar track.
- **Drawing Ink** (`ink`): all linework, borders, body text, filled (pressed) controls.
- **Secondary Ink** (`ink-secondary`): field labels, zone markers, metadata, stack lists, inactive controls.
- **Rule** (`rule`, 16% ink): soft separators between revision entries and inside segmented controls.
- **Hatch** (`hatch`, 6% ink): row hover and active-row wash in tables and segmented controls.

### Blueprint print
The same roles remapped for diazo: `blueprint-desk`, `blueprint-sheet`, `blueprint-ink`, `blueprint-ink-secondary`, `blueprint-dimension`, `blueprint-redline`; rule and hatch become 20% and 7% of blueprint ink. Applied by `[data-print="blueprint"]` on the root, or by `prefers-color-scheme: dark` unless vellum is chosen explicitly. The Three.js materials re-read the custom properties on print change.

### Named Rules
**The Redline Rule.** Red marks what is current or live and nothing else. If an element is not the current revision or a live state, it is not red.

**The Two Prints Rule.** Every color is a custom property with a vellum and a blueprint value. Never hard-code a color in a component; a new surface must read correctly in both prints.

**The Annotation Blue Rule.** Blue belongs to things that measure or point: dimensions, leaders, balloons, links on hover, focus. It never fills a surface.

## Typography

**Display Font:** osifont, ISO 3098 drawing lettering (with Archivo, system-ui)
**Body Font:** Archivo variable, weight 100 to 900, width 62% to 125% (with system-ui)

**Character:** The lettering is the drafter's hand: uppercase, slightly tracked, used for everything a drawing would letter (titles, labels, table heads, zone markers, dimensions, buttons). Archivo is the engineer's notes: plain, legible prose, with a wide heavy cut for headings.

### Hierarchy
- **Display** (osifont, uppercase, `clamp(2rem, 4.2vw, 3.4rem)`, line-height 1, tracking 0.04em, stroked 0.028em): sheet titles, the name in the title block (`clamp(2.2rem, 3.3vw, 3.4rem)`), the approvals headline; on detail sheets the part name runs larger (`display-detail`). Display lettering is thickened with a text stroke in its own color so the single-weight drafting font holds at size.
- **Headline** (Archivo 750, width 108%, `clamp(1.5rem, 2.4vw, 2.1rem)`, line-height 1.1, tracking -0.015em): role titles in revision entries; content-block headings on detail sheets run one step smaller (`clamp(1.35rem, 2vw, 1.75rem)`).
- **Title** (Archivo 700, width 105%, 1.12 to 1.15rem): part names in the BOM, spec terms, next/previous part names.
- **Body** (Archivo 400, 1.0625rem, line-height 1.6; 1rem under 760px): notes and prose, measured to 58 to 72ch.
- **Label** (osifont, uppercase, 0.78 to 0.95rem, tracking 0.04 to 0.06em): table heads, metadata, view labels, buttons, index bar. **Field labels** (0.68rem, secondary ink) sit above values in title-block and detail-header cells, as on a real title block.
- **Signature** (Archivo italic 500, width 80%, 1.5rem): the Drawn and Based fields of the approvals block only.

### Named Rules
**The Lettered Annotation Rule.** Anything a drafter would letter on the drawing is set in osifont uppercase; anything a person would write as prose is Archivo. Never set paragraphs in osifont, never set drawing labels in Archivo.

**The Stroked Display Rule.** osifont at display size always carries its own-color text stroke (0.028em, paint-order stroke fill); at label sizes it is never stroked.

## Layout

The page is a stack of sheets on the desk, each inset by the gutter (`clamp(16px, 3vw, 40px)`) and framed by a drawing border inset by the frame (`clamp(10px, 1.6vw, 22px)`). Zone markers are generated per sheet from its rendered size (4 to 8 columns at roughly 200px each, numbered right to left; rows lettered at roughly 260px, skipping I and O) and rebuilt on resize and font load. A sticky index bar (52px; 48px on mobile) lists the four sheets and the print toggle; the sheet in view is marked with a red underline.

The home is four sheets. Sheet 1, the general arrangement, fills the viewport: drawing view on the left, a side column (`clamp(360px, 34vw, 500px)`) with revision table, notes and title block on the right, separated by a heavy rule. Sheet 2 is the revision history in a label column (150 to 220px) plus a 72ch text column. Sheet 3 is the BOM table beside a sticky detail view (top 76px) that swaps a photo or schematic with a clip-path wipe. Sheet 4 is a two-column specs grid and the approvals block. Detail sheets share one template: header with balloon and title plus a meta block, a main numbered view, content blocks in a 160 to 260px heading column and a 70ch body column, galleries on an auto-fit 320px grid, and part-to-part navigation under a heavy rule.

Responsive: under 1100px the general arrangement stacks and the detail view is dropped; under 760px the sheet index collapses to the drawing ID, the title block moves to the top of the side column, the BOM table becomes item-balloon rows, and two-column grids become one.

## Elevation & Depth

The drawing is flat: hierarchy comes from line weight (2px heavy for borders, block edges and table frames, 1px light for internal cells) and from Secondary Ink, never from shadow or tint. One object has physical depth: the sheet itself lies on the desk.

### Shadow Vocabulary
- **Sheet on desk** (`box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 18px 40px -24px rgba(0,0,0,0.35)`): the sheet only.

### Named Rules
**The Line Weight Rule.** To raise importance, go from light to heavy line, or from secondary to primary ink. Nothing inside a sheet takes a shadow.

## Shapes

Rectangles are square-cornered: frames, cells, buttons, segmented controls and image frames have no radius. Circles are reserved for drawing symbols with a meaning: item balloons, leader dots, and the status lamp. The revision symbol is an outlined triangle carrying its letter. The current revision is wrapped in a scalloped revision cloud generated from the block's size. Image and figure frames carry a short half-opacity center mark at the top edge. Dashes have specific meanings: hidden lines and center lines on the part, the focus outline (2px dashed blue, offset 3px), and the private-data note border.

## Components

### Buttons (commands)
Lettered, square, outlined in ink, like a stamped field.
- **Shape:** square corners, 1px ink border, 9px 14px padding, osifont uppercase tracked 0.06em.
- **Primary:** filled ink with sheet text; hover turns blue (fill and border).
- **Secondary:** transparent; hover fills with ink and inverts text.
- **Focus:** the global 2px dashed blue outline.

### Segmented controls (projection views, print toggle)
- **Style:** a 1px ink-bordered group; segments split by Rule; lettering in Secondary Ink.
- **State:** the pressed segment fills ink with sheet text (`aria-pressed`); hover on others darkens text and adds Hatch. View buttons are at least 40px tall.

### Item balloons
- **Style:** a 44px circle (36px on mobile, 38px in the BOM, 48px in detail headers), 1.5px blue ring, blue numeral, sheet fill, paired with a label knocked out on sheet.
- **Behavior:** on the general arrangement they ride leaders tied to gear teeth and fade in once placed; on hover or focus, or when their BOM row is active, the circle fills blue. The number is the item number everywhere it appears.

### Tables (revision table, BOM)
- **Style:** 1px ink cell rules inside a heavy frame; lettered uppercase heads in Secondary Ink.
- **Revision table:** the current row is red and carries a revision triangle.
- **BOM:** the whole row is a link; hover and the active row take Hatch and turn the part name blue; the active row drives the sticky detail view.

### Title block, approvals
Ink-ruled cells. The title block holds only the name at display size, the current role and location, and the contact commands. The approvals block holds the lettered headline, the contact call and the contact commands.

### Revision entries
A revision triangle and lettered dates in the left column, Archivo headline, lettered organization, and numbered notes with lettered markers. The current entry carries the red cloud, drawn in on scroll, and a red status lamp.

### Figures
Every image is a numbered view: heavy ink frame, center mark, internal padding, image contained (never cropped), caption in lettering with "View n" bold and underlined.

### Drawing view (signature)
An orthographic Three.js spur gear: visible edges in ink at 1.6, hidden edges dashed at 32% opacity, center lines dash-dot, faces filled with the sheet color. ISO, Front, Top and Right projection buttons tween the part; it auto-rotates slowly when idle and pauses off-screen. Only in the Front view does the dimension overlay appear (OD, PCD, bore, in blue lettering with arrowheads and extension lines). Without WebGL, a static SVG front view replaces it.

### Motion
One curve: exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`; in JS, `1 - 2^(-10t)`). Line-draw reveals animate stroke-dashoffset over 1.6s when a stroke enters view; dimensions fade in over 0.6s; balloons fade in over 0.5s; the detail image wipes in over 0.7s; color transitions on controls take 0.2s and print changes 0.5s. With `prefers-reduced-motion`, strokes appear drawn, projection changes snap, idle rotation stops, and smooth scroll is off.

## Do's and Don'ts

### Do:
- **Do** put new content into drawing furniture (a sheet with its border and zones; title-block cells; tables; numbered views) rather than inventing a new container.
- **Do** read every color from a custom property so it holds in both Vellum and Blueprint.
- **Do** letter annotations in osifont uppercase and write prose in Archivo, per the Lettered Annotation Rule.
- **Do** caption every image as a numbered view and contain it in a heavy ink frame.
- **Do** reveal linework by drawing it (stroke-dashoffset) on the exponential ease-out, and show it finished under reduced motion.
- **Do** keep item numbers consistent: a project's balloon number is its BOM item and its detail-sheet number.

### Don't:
- **Don't** use red for anything but the current revision and live state.
- **Don't** round rectangles; circles are for balloons, leader dots and the lamp.
- **Don't** add shadows inside a sheet; depth comes from line weight.
- **Don't** fill surfaces with blue or add gradients; blue is for annotation.
- **Don't** set display lettering without its stroke, or body text in osifont.
- **Don't** crop project images to fill a frame; drawings show the whole part.


### Kept off the page
No drawing number, plot date, drafter, revision letter cells or sheet strips: the owner removed them as fluff. Drawing furniture carries real content only.
