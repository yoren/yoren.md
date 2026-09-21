---
name: yoren.md
description: A continuous personal instruction document with a compact rule index.
colors:
  paper: "#fafafa"
  ink: "#292e2b"
  muted: "#606963"
  accent: "#276348"
  line: "#dedfdd"
  selection: "#d8e8d8"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 500
    lineHeight: 1.22
    letterSpacing: "-0.035em"
  intro-purpose:
    fontSize: "1.5rem"
    lineHeight: 1.5
  intro-note:
    fontSize: ".9375rem"
    lineHeight: 1.6
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.7
---

# Design System: yoren.md

## Overview

A reading-first document with a subtle personal touch, not a themed publication.
The neutral field and dark prose keep attention on the writing. Modest serif
headings, a small green filename extension, and the opening sentence provide
character without an oversized masthead, decorative marks, or a colored sidebar.

## Colors

Paper provides the neutral background; ink carries prose, headings, and major
navigation. Muted green-gray carries secondary links and the introductory note.
Pine accent marks the filename extension, links, current location, and keyboard
focus. Line is reserved for structural separators; selection supplies highlighted
text and code-block backgrounds.

## Typography

Source Serif 4 is self-hosted for headings and the introductory purpose sentence.
System sans-serif supports longer paragraphs, the index, and the supporting note.
The desktop title uses 3rem, with its filename extension at 70% of that size.
The purpose sentence uses 1.5rem and its supporting note .9375rem on separate lines.
Second- and third-level headings use 1.9375rem and 1.625rem. On narrow screens those
headings use 1.75rem and 1.5rem, with 1rem body text. Balanced headings and generous
line height preserve readability.

## Layout

Desktop uses a 220px index, a reading column up to 680px, and a 72px gap inside
a 1092px container. The index stays visible while the continuous document scrolls.
At 800px and below, the layout becomes one column with 24px side padding and a
sticky mobile disclosure. Rules have more space above their heading than below.
Print removes navigation and the footer.

## Elevation & Depth

Flat surfaces, no shadows. Whitespace separates instructions; fine rules separate
the mobile navigation and footer from the document.

## Components

Navigation uses compact sans-serif links and indented subordinate rules. Current
location has a heavier weight and underline, not color alone. Mobile navigation
has at least 44px-high links and a scrollable expanded list. Section permalinks
appear on heading hover or keyboard focus. Focus rings use the accent color.

## Do's and Don'ts

- Do keep the whole document readable and every rule directly linkable.
- Do preserve the neutral field, dark prose, and clear serif/sans hierarchy.
- Do keep navigation usable without JavaScript; enhancements add selection and focus behavior.
- Don't introduce marketing sections, numbered cards, oversized mastheads, textures, or decorative motion.
- Don't duplicate document text in templates; README.md owns the content.
