# Introduction to GPUs Slides

`introduction-to-gpu-slides.pptx` is an editable 16:9 PowerPoint deck designed for import into Google Slides.

## Contents

- 18 slides: 14 beginner-first main slides and 4 optional appendix slides
- Warm workshop visual system built around cream, coral, green, blue, and ink
- Open-source Lucide SVG icons with no proprietary brand artwork
- Metaphor-led visuals for workers, factories, delivery routes, experiments, and production
- Speaker notes with instructor prompts and questions
- No animations or transitions
- Portable Arial and Courier New font choices for safer Google Slides import

## Build From Source

From the repository root:

```bash
npm install
npm run build:slides
npm run validate:slides
```

The generated deck is written to `slides/introduction-to-gpu-slides.pptx`.

The Markdown teaching materials are mapped to slide IDs in [`slide-source-map.json`](slide-source-map.json). The build writes `build-manifest.json`, validates declared content-box collisions, and uses open-source Lucide SVG icons. The validator reports source files changed since the last deck build, missing mappings, missing headings, and missing slide markers.

## Keeping Slides Aligned

When a numbered Markdown file changes:

1. Run `npm run validate:slides` to identify affected material.
2. Update the mapped slide or speaker notes in `build-deck.js`.
3. Update `slide-source-map.json` if the teaching structure changed.
4. Run `npm run build:slides` and then `npm run validate:slides` again.
5. Render the PowerPoint and inspect the slides visually before sharing it.

The repository-local `.agents/skills/md-to-slides/SKILL.md` contains the complete workflow for future Markdown-to-slide changes.

## Google Slides

Upload the `.pptx` to Google Drive and choose **Open with Google Slides**. The deck uses standard PowerPoint shapes and safe font fallbacks so the diagrams and text remain editable after import.
