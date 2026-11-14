# Introduction to GPUs Slides

`introduction-to-gpu-slides.pptx` is an editable 16:9 PowerPoint deck designed for import into Google Slides.

## Contents

- 18 slides for the one-hour free session
- NVIDIA-inspired graphite, white, and green visual system
- No official NVIDIA logos or proprietary brand artwork
- Editable vector diagrams for workers, matrices, GPU memory, and AWS architecture
- Speaker notes with instructor prompts and questions
- No animations or transitions
- Portable Arial and Courier New font choices for safer Google Slides import

## Build From Source

From the repository root:

```bash
npm install --no-save pptxgenjs
node slides/build-deck.js
```

The generated deck is written to `slides/introduction-to-gpu-slides.pptx`.

## Google Slides

Upload the `.pptx` to Google Drive and choose **Open with Google Slides**. The deck uses standard PowerPoint shapes and safe font fallbacks so the diagrams and text remain editable after import.
