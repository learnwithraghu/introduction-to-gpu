---
name: md-to-slides
description: Keep the GPU teaching Markdown and editable PowerPoint deck aligned.
disable-model-invocation: true
---

# Markdown to Slides

Use this skill whenever a file under `introduction-to-gpu/` changes and the change may affect teaching content, diagrams, lab instructions, speaker notes, or the course progression.

## Source Rules

- Treat the numbered Markdown files as the teaching source of truth.
- Treat `slides/build-deck.js` as the editable presentation source.
- Treat `slides/introduction-to-gpu-slides.pptx` as generated output.
- Use `slides/slide-source-map.json` to find the slides and notes affected by a Markdown section.
- Do not convert every paragraph into bullets. Keep the main deck beginner-first, use one metaphor or idea per slide, and use speaker notes or appendix slides for instructor-only and technical material.
- Use the pinned open-source Lucide icon set for visual examples; do not introduce proprietary artwork.

## Workflow

1. Inspect the changed Markdown and identify changed headings, diagrams, questions, lab steps, or claims.
2. Run `npm run validate:slides` to identify mapped sources and stale build state.
3. Decide the treatment for each change:
   - Slide: learner-facing concept, diagram, table, experiment, or sequence change.
   - Notes: instructor wording, discussion prompts, troubleshooting, or timing guidance.
   - Both: a concept that needs a concise visual plus teaching context.
4. Update `slides/build-deck.js` using the layout helpers, a stable `slideId(...)` marker, and explicit non-overlapping content boxes.
5. Update `slides/slide-source-map.json` when adding, removing, or remapping source material.
6. Build with `npm run build:slides`. The build must fail if declared content boxes overlap.
7. Run `npm run validate:slides` again. A clean validation must report no mapped source drift.
8. Render the deck to PDF or slide images and inspect for overflow, overlap, low contrast, missing diagrams, and unreadable notes-to-slide translations.
9. Update `slides/README.md` if the deck structure or workflow changes.

## Teaching Alignment Checks

- Keep the session rhythm: predict -> model -> run -> interpret -> connect.
- Lead with familiar examples before using GPU vocabulary.
- Keep detailed GPU anatomy, troubleshooting, and cloud architecture in the appendix or notes.
- Use generous whitespace and never rely on text shrinking to conceal overflow.
- Keep the run of show aligned with `00-session-overview.md`.
- Ensure major Markdown diagrams have a visible slide treatment or an explicit speaker-note treatment.
- Keep benchmark claims conceptual unless they come from a recorded run; Colab timings vary.
- Preserve the technical distinction that Lambda orchestrates AWS Batch and does not run GPU computation itself.

## Completion Report

Report:

- Markdown files and sections considered.
- Slides and speaker notes changed.
- Validation result.
- Build and visual QA result.
- Any source material intentionally left notes-only and why.
