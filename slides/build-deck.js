const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Learn With Raghu';
pptx.company = 'Learn With Raghu';
pptx.subject = 'Introduction to GPUs';
pptx.title = 'Introduction to GPUs';
pptx.lang = 'en-US';
pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'en-US' };

const S = pptx.ShapeType;
const W = 10;
const H = 5.625;
const ICON_DIR = path.join(path.dirname(require.resolve('lucide-static/package.json')), 'icons');
const C = {
  ink: '182A3A',
  paper: 'F8F2E8',
  white: 'FFFFFF',
  coral: 'E9694B',
  coralLight: 'F7C7B7',
  green: '6BAE75',
  greenLight: 'D8EBD5',
  blue: '5B91B8',
  blueLight: 'D9EAF3',
  yellow: 'F3C969',
  muted: '647382',
  line: 'D9D2C6',
  darkPanel: '223646',
};
const SLIDE_IDS = [
  'title', 'examples', 'metaphor', 'pattern', 'fit', 'workers', 'prediction', 'setup', 'vector',
  'matrix', 'warehouse', 'benchmark', 'production', 'close', 'appendix-anatomy', 'appendix-troubleshooting',
  'appendix-pitfalls', 'appendix-course',
];

function slideId(id) {
  if (!SLIDE_IDS.includes(id)) throw new Error(`Unknown slide id: ${id}`);
}

function tx(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x, y, w, h, margin: opts.margin ?? 0,
    fontFace: opts.fontFace || 'Aptos', fontSize: opts.fontSize || 16,
    color: opts.color || C.ink, bold: opts.bold || false, italic: opts.italic || false,
    align: opts.align || 'left', valign: opts.valign || 'mid', fit: 'shrink',
    breakLine: false, charSpacing: opts.charSpacing || 0,
  });
}

function rect(slide, x, y, w, h, fill, radius = false, line = null) {
  slide.addShape(radius ? S.roundRect : S.rect, {
    x, y, w, h, fill: { color: fill },
    line: line ? { color: line.color || line, width: line.width || 1 } : { color: fill, transparency: 100 },
  });
}

function line(slide, x1, y1, x2, y2, color = C.ink, width = 1.5, arrow = false) {
  slide.addShape(S.line, {
    x: x1, y: y1, w: x2 - x1, h: y2 - y1,
    line: { color, width, beginArrowType: 'none', endArrowType: arrow ? 'triangle' : 'none' },
  });
}

function circle(slide, x, y, d, fill, lineColor = fill, width = 1) {
  slide.addShape(S.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: lineColor, width } });
}

function iconData(name, color = C.ink) {
  const svg = fs.readFileSync(path.join(ICON_DIR, `${name}.svg`), 'utf8')
    .replace(/currentColor/g, `#${color}`);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function icon(slide, name, x, y, size, color = C.ink) {
  slide.addImage({ data: iconData(name, color), x, y, w: size, h: size });
}

function newSlide(id, dark = false) {
  slideId(id);
  const slide = pptx.addSlide();
  slide.background = { color: dark ? C.darkPanel : C.paper };
  return { slide, boxes: [], dark };
}

function contentBox(ctx, name, x, y, w, h) {
  ctx.boxes.push({ name, x, y, w, h });
  return { x, y, w, h };
}

function heading(ctx, kicker, title, subtitle = '') {
  const color = ctx.dark ? C.white : C.ink;
  tx(ctx.slide, kicker.toUpperCase(), 0.65, 0.42, 2.8, 0.2, { fontSize: 10, bold: true, color: ctx.dark ? C.yellow : C.coral, charSpacing: 1.5 });
  contentBox(ctx, 'title', 0.65, 0.78, 8.7, 0.62);
  tx(ctx.slide, title, 0.65, 0.78, 8.7, 0.62, { fontSize: 27, bold: true, color });
  if (subtitle) {
    contentBox(ctx, 'subtitle', 0.65, 1.48, 8.2, 0.3);
    tx(ctx.slide, subtitle, 0.65, 1.48, 8.2, 0.3, { fontSize: 12, color: ctx.dark ? 'C8D4DD' : C.muted });
  }
}

function footer(ctx, label = 'INTRODUCTION TO GPUS') {
  line(ctx.slide, 0.65, 5.04, 9.35, 5.04, ctx.dark ? '466070' : C.line, 0.8);
  tx(ctx.slide, label, 0.65, 5.15, 4.5, 0.16, { fontSize: 7, bold: true, color: ctx.dark ? '9EB3C0' : C.muted, charSpacing: 1.1 });
}

function note(ctx, text) {
  ctx.slide.addNotes(text);
}

function finish(ctx) {
  const errors = [];
  for (let i = 0; i < ctx.boxes.length; i += 1) {
    for (let j = i + 1; j < ctx.boxes.length; j += 1) {
      const a = ctx.boxes[i];
      const b = ctx.boxes[j];
      const overlap = a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
      if (overlap) errors.push(`${a.name} overlaps ${b.name}`);
    }
  }
  if (errors.length) throw new Error(`Layout collision on slide: ${errors.join('; ')}`);
}

function card(ctx, name, x, y, w, h, fill, iconName, iconColor, titleText, bodyText) {
  contentBox(ctx, name, x, y, w, h);
  rect(ctx.slide, x, y, w, h, fill, true, { color: fill === C.white ? C.line : fill, width: 1 });
  circle(ctx.slide, x + 0.2, y + 0.2, 0.55, iconColor);
  icon(ctx.slide, iconName, x + 0.32, y + 0.32, 0.31, C.white);
  tx(ctx.slide, titleText, x + 0.2, y + 0.9, w - 0.4, 0.24, { fontSize: 13, bold: true, color: fill === C.ink ? C.white : C.ink });
  tx(ctx.slide, bodyText, x + 0.2, y + 1.2, w - 0.4, h - 1.38, { fontSize: 10, color: fill === C.ink ? 'D6E0E5' : C.muted, valign: 'top' });
}

// 1. Title
{
  const c = newSlide('title', true);
  tx(c.slide, 'A BEGINNER-FRIENDLY GPU STORY', 0.68, 0.55, 4.4, 0.2, { fontSize: 10, bold: true, color: C.yellow, charSpacing: 1.4 });
  contentBox(c, 'title', 0.68, 1.25, 5.2, 1.15);
  tx(c.slide, 'When one job\nbecomes a million', 0.68, 1.25, 5.2, 1.15, { fontSize: 35, bold: true, color: C.white });
  contentBox(c, 'subtitle', 0.7, 2.72, 4.9, 0.7);
  tx(c.slide, 'A practical introduction to choosing the right kind of worker.', 0.7, 2.72, 4.9, 0.7, { fontSize: 17, color: 'D6E0E5' });
  const x = 6.2;
  circle(c.slide, x + 0.3, 1.18, 2.6, C.coral);
  icon(c.slide, 'chef-hat', x + 1.0, 1.86, 1.15, C.white);
  circle(c.slide, x + 2.35, 2.55, 2.6, C.green);
  icon(c.slide, 'factory', x + 3.04, 3.23, 1.15, C.white);
  line(c.slide, x + 2.0, 2.55, x + 2.55, 3.02, C.yellow, 3, true);
  tx(c.slide, 'one careful worker', x + 0.2, 4.15, 2.8, 0.2, { fontSize: 11, color: C.coralLight, align: 'center' });
  tx(c.slide, 'many repeatable workers', x + 2.15, 4.86, 3.1, 0.2, { fontSize: 11, color: C.greenLight, align: 'center' });
  note(c, 'Open with a familiar problem, not hardware terminology. Ask what happens when the same photo adjustment must be applied to ten million pixels.');
  finish(c);
}

// 2. Examples
{
  const c = newSlide('examples');
  heading(c, 'START WITH THE WORK', 'You have already seen GPU-shaped problems', 'The pattern is not “advanced hardware.” It is repeated work at scale.');
  card(c, 'image', 0.72, 2.18, 2.05, 1.85, C.white, 'image', C.coral, 'Photo filters', 'Apply the same adjustment to every pixel.');
  card(c, 'video', 2.98, 2.18, 2.05, 1.85, C.white, 'video', C.blue, 'Video frames', 'Repeat the same work across a stream of frames.');
  card(c, 'recommendations', 5.24, 2.18, 2.05, 1.85, C.white, 'shopping-bag', C.green, 'Recommendations', 'Score many users and items in parallel.');
  card(c, 'ml', 7.5, 2.18, 1.78, 1.85, C.white, 'brain', C.yellow, 'ML', 'Many repeated calculations.');
  contentBox(c, 'callout', 1.4, 4.45, 7.2, 0.38);
  tx(c.slide, 'Same idea: many items need a similar operation.', 1.4, 4.45, 7.2, 0.38, { fontSize: 16, bold: true, color: C.ink, align: 'center' });
  footer(c);
  note(c, 'Invite learners to add examples from their own field. Do not introduce CUDA or matrix terminology yet.');
  finish(c);
}

// 3. Metaphor
{
  const c = newSlide('metaphor', true);
  heading(c, 'THE METAPHOR', 'One sandwich or ten thousand?', 'The right worker depends on how much similar work we have.', true);
  contentBox(c, 'cook', 0.8, 2.25, 3.25, 2.0);
  rect(c.slide, 0.8, 2.25, 3.25, 2.0, C.coral, true);
  icon(c.slide, 'chef-hat', 1.12, 2.6, 0.72, C.white);
  tx(c.slide, 'ONE COOK', 2.0, 2.63, 1.55, 0.23, { fontSize: 13, bold: true, color: C.white });
  tx(c.slide, 'Flexible, careful, good at decisions.', 1.12, 3.45, 2.55, 0.42, { fontSize: 14, color: C.white });
  tx(c.slide, 'One sandwich is fine.', 1.12, 4.0, 2.55, 0.2, { fontSize: 11, color: C.coralLight });
  contentBox(c, 'factory', 5.0, 2.25, 4.2, 2.0);
  rect(c.slide, 5.0, 2.25, 4.2, 2.0, C.green, true);
  icon(c.slide, 'factory', 5.34, 2.6, 0.72, C.white);
  tx(c.slide, 'ASSEMBLY LINE', 6.22, 2.63, 2.25, 0.23, { fontSize: 13, bold: true, color: C.white });
  tx(c.slide, 'Many stations repeating simple steps.', 5.34, 3.45, 3.2, 0.42, { fontSize: 14, color: C.white });
  tx(c.slide, 'Ten thousand identical sandwiches fit.', 5.34, 4.0, 3.2, 0.2, { fontSize: 11, color: C.greenLight });
  line(c.slide, 4.25, 3.22, 4.82, 3.22, C.yellow, 3, true);
  note(c, 'The CPU is the versatile cook. The GPU is the assembly line. Both are useful. The workload decides which one fits.');
  finish(c);
}

// 4. Pattern
{
  const c = newSlide('pattern');
  heading(c, 'THE PATTERN', 'Look for the same job repeated many times', 'Independent items are the easiest work to spread across many workers.');
  contentBox(c, 'input', 0.78, 2.28, 1.42, 1.5);
  rect(c.slide, 0.78, 2.28, 1.42, 1.5, C.blueLight, true);
  icon(c.slide, 'package', 1.17, 2.55, 0.62, C.blue);
  tx(c.slide, 'many\nitems', 0.98, 3.22, 1.02, 0.4, { fontSize: 15, bold: true, color: C.ink, align: 'center' });
  line(c.slide, 2.3, 3.02, 3.0, 3.02, C.blue, 2, true);
  contentBox(c, 'operation', 3.18, 2.28, 2.0, 1.5);
  rect(c.slide, 3.18, 2.28, 2.0, 1.5, C.yellow, true);
  icon(c.slide, 'zap', 3.86, 2.52, 0.62, C.ink);
  tx(c.slide, 'same\noperation', 3.42, 3.22, 1.52, 0.4, { fontSize: 15, bold: true, color: C.ink, align: 'center' });
  line(c.slide, 5.28, 3.02, 5.98, 3.02, C.green, 2, true);
  contentBox(c, 'outputs', 6.18, 2.28, 2.72, 1.5);
  rect(c.slide, 6.18, 2.28, 2.72, 1.5, C.greenLight, true);
  icon(c.slide, 'layers', 6.54, 2.58, 0.62, C.green);
  tx(c.slide, 'many independent\noutputs', 7.35, 2.76, 1.2, 0.5, { fontSize: 14, bold: true, color: C.ink, align: 'center' });
  contentBox(c, 'rule', 1.32, 4.46, 7.35, 0.38);
  tx(c.slide, 'Same job + many items + little coordination = a GPU-shaped workload', 1.32, 4.46, 7.35, 0.38, { fontSize: 14, bold: true, color: C.ink, align: 'center' });
  footer(c);
  note(c, 'Ask learners to name the item, the repeated operation, and the output in one workload from their own field.');
  finish(c);
}

// 5. Fit
{
  const c = newSlide('fit', true);
  heading(c, 'CHOOSE THE WORKER', 'A GPU is not automatically faster', 'The assembly line must earn back setup and delivery costs.', true);
  card(c, 'good', 0.78, 2.18, 3.85, 2.12, C.green, 'check', C.ink, 'Good fit', 'Large batches\nRegular operations\nIndependent items');
  card(c, 'poor', 5.38, 2.18, 3.85, 2.12, C.coral, 'triangle-alert', C.ink, 'Poor fit', 'Tiny jobs\nWaiting on input\nIrregular decisions');
  contentBox(c, 'question', 1.1, 4.68, 7.8, 0.25);
  tx(c.slide, 'Do we have enough repeatable work to keep the line busy?', 1.1, 4.68, 7.8, 0.25, { fontSize: 15, bold: true, color: C.yellow, align: 'center' });
  note(c, 'Use examples: add ten numbers, wait for an API, process ten million pixels, multiply large matrices. The answer is workload-dependent.');
  finish(c);
}

// 6. Workers
{
  const c = newSlide('workers');
  heading(c, 'ONE IDEA', 'CPU and GPU optimize for different jobs', 'Do not ask “which is faster?” Ask “which worker fits?”');
  contentBox(c, 'cpu', 0.8, 2.12, 3.75, 2.28);
  rect(c.slide, 0.8, 2.12, 3.75, 2.28, C.coralLight, true);
  icon(c.slide, 'chef-hat', 1.18, 2.52, 0.72, C.coral);
  tx(c.slide, 'CPU', 2.08, 2.57, 1.8, 0.3, { fontSize: 23, bold: true, color: C.ink });
  tx(c.slide, 'A few flexible workers', 1.18, 3.35, 2.8, 0.28, { fontSize: 16, bold: true, color: C.ink });
  tx(c.slide, 'Good at decisions, irregular logic, and one-off jobs.', 1.18, 3.82, 2.85, 0.34, { fontSize: 11, color: C.muted });
  contentBox(c, 'gpu', 5.42, 2.12, 3.75, 2.28);
  rect(c.slide, 5.42, 2.12, 3.75, 2.28, C.greenLight, true);
  icon(c.slide, 'factory', 5.8, 2.52, 0.72, C.green);
  tx(c.slide, 'GPU', 6.7, 2.57, 1.8, 0.3, { fontSize: 23, bold: true, color: C.ink });
  tx(c.slide, 'Many repeatable workers', 5.8, 3.35, 3.0, 0.28, { fontSize: 16, bold: true, color: C.ink });
  tx(c.slide, 'Good at regular work over large batches.', 5.8, 3.82, 2.85, 0.34, { fontSize: 11, color: C.muted });
  footer(c, 'CPU VS GPU');
  note(c, 'This is the entire mental model for the main session. Hardware vocabulary belongs in the appendix.');
  finish(c);
}

// 7. Prediction
{
  const c = newSlide('prediction', true);
  heading(c, 'BEFORE THE LAB', 'Make a prediction before touching the code', 'The discussion is more valuable than one universal benchmark number.', true);
  const rows = [
    ['Add 10 numbers', 'CPU', C.coral],
    ['Add 10 million numbers', 'GPU may help', C.green],
    ['Wait for a web request', 'Neither solves the wait', C.blue],
    ['Multiply large matrices', 'GPU often helps', C.green],
  ];
  rows.forEach((row, i) => {
    const y = 2.2 + i * 0.52;
    contentBox(c, `row-${i}`, 1.0, y, 8.0, 0.38);
    rect(c.slide, 1.0, y, 8.0, 0.38, i % 2 === 0 ? '2B4353' : '29404F', true);
    circle(c.slide, 1.22, y + 0.09, 0.2, row[2]);
    tx(c.slide, row[0], 1.62, y + 0.08, 3.35, 0.18, { fontSize: 12, color: C.white, bold: true });
    tx(c.slide, row[1], 5.4, y + 0.08, 3.25, 0.18, { fontSize: 12, color: row[2] === C.coral ? C.coralLight : row[2] === C.green ? C.greenLight : C.blueLight, bold: true, align: 'right' });
  });
  contentBox(c, 'prompt', 1.3, 4.55, 7.4, 0.28);
  tx(c.slide, 'Write down your guess. Then let the notebook surprise you.', 1.3, 4.55, 7.4, 0.28, { fontSize: 15, bold: true, color: C.yellow, align: 'center' });
  note(c, 'Ask for a show of hands or chat responses before the code runs. Do not reveal the answer first.');
  finish(c);
}

// 8. Setup
{
  const c = newSlide('setup');
  heading(c, 'LIVE LAB', 'Get the GPU in three simple steps', 'We verify the worker before asking it to do the job.');
  const steps = [
    ['1', 'Open notebook', 'notebook', C.blue],
    ['2', 'Choose GPU', 'cpu', C.green],
    ['3', 'Run the check', 'check', C.coral],
  ];
  steps.forEach((step, i) => {
    const x = 0.95 + i * 3.0;
    contentBox(c, `step-${i}`, x, 2.22, 2.15, 1.7);
    rect(c.slide, x, 2.22, 2.15, 1.7, C.white, true, { color: C.line, width: 1 });
    circle(c.slide, x + 0.18, 2.42, 0.42, step[3]);
    tx(c.slide, step[0], x + 0.18, 2.53, 0.42, 0.18, { fontSize: 12, bold: true, color: C.white, align: 'center' });
    icon(c.slide, step[2], x + 0.8, 2.42, 0.5, step[3]);
    tx(c.slide, step[1], x + 0.2, 3.12, 1.75, 0.2, { fontSize: 13, bold: true, color: C.ink, align: 'center' });
    if (i < 2) line(c.slide, x + 2.22, 3.05, x + 2.78, 3.05, C.muted, 1.5, true);
  });
  contentBox(c, 'check', 2.0, 4.42, 6.0, 0.4);
  rect(c.slide, 2.0, 4.42, 6.0, 0.4, C.ink, true);
  tx(c.slide, 'torch.cuda.is_available()', 2.0, 4.52, 6.0, 0.18, { fontFace: 'Courier New', fontSize: 12, color: C.greenLight, align: 'center' });
  footer(c, 'GOOGLE COLAB');
  note(c, 'Mention that Colab is shared infrastructure. GPU type and timing vary. If unavailable, use the CPU fallback and keep the lesson moving.');
  finish(c);
}

// 9. Vector
{
  const c = newSlide('vector', true);
  heading(c, 'EXPERIMENT 1', 'One output item can have one worker', 'Vector addition is simple enough to see the pattern.', true);
  contentBox(c, 'arrays', 0.82, 2.18, 3.15, 1.56);
  rect(c.slide, 0.82, 2.18, 3.15, 1.56, '2B4353', true);
  tx(c.slide, 'a + b = c', 1.17, 2.48, 2.45, 0.34, { fontFace: 'Courier New', fontSize: 22, bold: true, color: C.white, align: 'center' });
  tx(c.slide, '[2, 4, 6, 8] + [1, 3, 5, 7]', 1.0, 3.2, 2.8, 0.2, { fontFace: 'Courier New', fontSize: 10, color: C.blueLight, align: 'center' });
  line(c.slide, 4.25, 2.96, 4.92, 2.96, C.yellow, 2, true);
  contentBox(c, 'workers', 5.18, 2.18, 3.45, 1.56);
  rect(c.slide, 5.18, 2.18, 3.45, 1.56, C.green, true);
  ['T0', 'T1', 'T2', 'T3'].forEach((label, i) => {
    const x = 5.42 + i * 0.73;
    circle(c.slide, x, 2.53, 0.42, C.white);
    tx(c.slide, label, x, 2.65, 0.42, 0.16, { fontSize: 9, bold: true, color: C.green, align: 'center' });
  });
  tx(c.slide, 'one item each', 5.45, 3.22, 2.8, 0.2, { fontSize: 13, bold: true, color: C.white, align: 'center' });
  contentBox(c, 'question', 1.18, 4.45, 7.6, 0.28);
  tx(c.slide, 'What happens when the vector has ten million items?', 1.18, 4.45, 7.6, 0.28, { fontSize: 15, bold: true, color: C.yellow, align: 'center' });
  note(c, 'Ask what T2 calculates. Connect the visual to the notebook, where PyTorch maps the same operation to CPU or GPU.');
  finish(c);
}

// 10. Matrix
{
  const c = newSlide('matrix');
  heading(c, 'EXPERIMENT 2', 'Give the assembly line more work', 'Matrix multiplication creates many more small calculations at once.');
  contentBox(c, 'left-matrix', 0.95, 2.28, 1.75, 1.75);
  contentBox(c, 'right-matrix', 3.55, 2.28, 1.75, 1.75);
  contentBox(c, 'result-matrix', 7.0, 2.28, 1.75, 1.75);
  drawMatrix(c.slide, 0.95, 2.28, C.coral);
  drawMatrix(c.slide, 3.55, 2.28, C.blue);
  drawMatrix(c.slide, 7.0, 2.28, C.green);
  tx(c.slide, 'A', 1.65, 4.16, 0.35, 0.2, { fontSize: 14, bold: true, color: C.coral, align: 'center' });
  tx(c.slide, 'B', 4.25, 4.16, 0.35, 0.2, { fontSize: 14, bold: true, color: C.blue, align: 'center' });
  tx(c.slide, 'A x B', 7.62, 4.16, 0.7, 0.2, { fontSize: 14, bold: true, color: C.green, align: 'center' });
  tx(c.slide, '+', 2.88, 3.0, 0.5, 0.4, { fontSize: 28, bold: true, color: C.ink, align: 'center' });
  tx(c.slide, '=', 6.35, 3.0, 0.5, 0.4, { fontSize: 28, bold: true, color: C.ink, align: 'center' });
  contentBox(c, 'lesson', 1.35, 4.72, 7.25, 0.23);
  tx(c.slide, 'More arithmetic per batch gives the GPU room to earn its keep.', 1.35, 4.72, 7.25, 0.23, { fontSize: 14, bold: true, color: C.ink, align: 'center' });
  footer(c, 'MATRIX MULTIPLICATION');
  note(c, 'Avoid teaching dot products here. Say that each output cell is built from repeated arithmetic and that a large result contains many such cells.');
  finish(c);
}

function drawMatrix(slide, x, y, accent) {
  for (let r = 0; r < 5; r += 1) for (let col = 0; col < 5; col += 1) {
    const hot = (r + col) % 3 === 0;
    rect(slide, x + col * 0.32, y + r * 0.32, 0.25, 0.25, hot ? accent : 'E5E0D7', true);
  }
}

// 11. Warehouse
{
  const c = newSlide('warehouse', true);
  heading(c, 'THE CATCH', 'The factory can wait for the truck', 'Compute is only one part of the time a real application spends.', true);
  contentBox(c, 'warehouse', 0.8, 2.18, 2.2, 1.9);
  rect(c.slide, 0.8, 2.18, 2.2, 1.9, C.blue, true);
  icon(c.slide, 'package', 1.52, 2.52, 0.72, C.white);
  tx(c.slide, 'WAREHOUSE', 1.02, 3.38, 1.75, 0.2, { fontSize: 12, bold: true, color: C.white, align: 'center' });
  tx(c.slide, 'CPU memory', 1.02, 3.68, 1.75, 0.18, { fontSize: 10, color: C.blueLight, align: 'center' });
  contentBox(c, 'road', 3.35, 2.18, 2.1, 1.9);
  rect(c.slide, 3.35, 2.18, 2.1, 1.9, C.yellow, true);
  icon(c.slide, 'truck', 4.04, 2.55, 0.72, C.ink);
  tx(c.slide, 'THE ROAD', 3.72, 3.38, 1.35, 0.2, { fontSize: 12, bold: true, color: C.ink, align: 'center' });
  tx(c.slide, 'transfer', 3.72, 3.68, 1.35, 0.18, { fontSize: 10, color: C.ink, align: 'center' });
  contentBox(c, 'factory', 5.8, 2.18, 2.4, 1.9);
  rect(c.slide, 5.8, 2.18, 2.4, 1.9, C.green, true);
  icon(c.slide, 'factory', 6.62, 2.52, 0.72, C.white);
  tx(c.slide, 'FACTORY', 6.1, 3.38, 1.8, 0.2, { fontSize: 12, bold: true, color: C.white, align: 'center' });
  tx(c.slide, 'GPU memory + compute', 6.1, 3.68, 1.8, 0.18, { fontSize: 10, color: C.greenLight, align: 'center' });
  line(c.slide, 3.05, 3.12, 3.3, 3.12, C.white, 2, true);
  line(c.slide, 5.53, 3.12, 5.75, 3.12, C.white, 2, true);
  contentBox(c, 'equation', 1.05, 4.55, 7.85, 0.28);
  tx(c.slide, 'total time = input delivery + factory work + result delivery', 1.05, 4.55, 7.85, 0.28, { fontFace: 'Courier New', fontSize: 13, bold: true, color: C.yellow, align: 'center' });
  note(c, 'Use the warehouse analogy. Kernel-only timing and end-to-end timing answer different questions.');
  finish(c);
}

// 12. Benchmark
{
  const c = newSlide('benchmark');
  heading(c, 'MEASURE HONESTLY', 'A benchmark is a question, not a trophy', 'The right timing depends on what the application is trying to learn.');
  const metrics = [
    ['Kernel time', 'How fast is the operation after data arrives?', 'gauge', C.green],
    ['End-to-end time', 'How fast is the real application path?', 'route', C.blue],
    ['Reproducibility', 'What hardware and settings produced the result?', 'clipboard-check', C.coral],
  ];
  metrics.forEach((m, i) => card(c, `metric-${i}`, 0.78 + i * 3.02, 2.2, 2.72, 1.92, C.white, m[2], m[3], m[0], m[1]));
  contentBox(c, 'callout', 1.0, 4.55, 8.0, 0.25);
  tx(c.slide, 'Surprising results are invitations to ask a better question.', 1.0, 4.55, 8.0, 0.25, { fontSize: 15, bold: true, color: C.ink, align: 'center' });
  footer(c, 'BENCHMARKING');
  note(c, 'Mention synchronization, warmups, transfer inclusion, and repeated measurements only after the learners understand the question each measurement answers.');
  finish(c);
}

// 13. Production
{
  const c = newSlide('production', true);
  heading(c, 'NEXT STEP', 'The notebook is the lab, not the factory', 'The production version makes the experiment repeatable, observable, and cost-aware.', true);
  const nodes = [
    ['notebook', 'COLAB', 'discover', C.blue],
    ['package', 'DOCKER', 'package', C.coral],
    ['cloud', 'AWS BATCH', 'run on GPU', C.green],
    ['cloud', 'S3', 'store results', C.yellow],
  ];
  nodes.forEach((node, i) => {
    const x = 0.72 + i * 2.3;
    contentBox(c, `node-${i}`, x, 2.3, 1.8, 1.55);
    rect(c.slide, x, 2.3, 1.8, 1.55, node[3], true);
    icon(c.slide, node[0], x + 0.62, 2.55, 0.55, C.ink);
    tx(c.slide, node[1], x + 0.12, 3.25, 1.56, 0.18, { fontSize: 11, bold: true, color: C.ink, align: 'center' });
    tx(c.slide, node[2], x + 0.12, 3.57, 1.56, 0.16, { fontSize: 9, color: C.ink, align: 'center' });
    if (i < nodes.length - 1) line(c.slide, x + 1.86, 3.07, x + 2.22, 3.07, C.yellow, 1.7, true);
  });
  contentBox(c, 'lambda', 3.18, 4.4, 3.65, 0.35);
  tx(c.slide, 'Lambda coordinates the job; AWS Batch runs the GPU work.', 3.18, 4.4, 3.65, 0.35, { fontSize: 11, bold: true, color: C.greenLight, align: 'center' });
  note(c, 'Do not teach AWS architecture during the free session. Use this as a one-sentence bridge to the next engineering step.');
  finish(c);
}

// 14. Close
{
  const c = newSlide('close', true);
  contentBox(c, 'title', 0.75, 1.0, 5.5, 1.0);
  tx(c.slide, 'The question is not\n“GPU or CPU?”', 0.75, 1.0, 5.5, 1.0, { fontSize: 31, bold: true, color: C.white });
  contentBox(c, 'question', 0.78, 2.62, 5.2, 0.45);
  tx(c.slide, 'What does this workload need?', 0.78, 2.62, 5.2, 0.45, { fontSize: 22, bold: true, color: C.yellow });
  contentBox(c, 'takeaway', 0.78, 3.55, 5.3, 0.55);
  tx(c.slide, 'Predict -> run -> measure -> explain', 0.78, 3.55, 5.3, 0.55, { fontSize: 16, bold: true, color: C.greenLight });
  circle(c.slide, 7.15, 1.2, 1.65, C.coral);
  icon(c.slide, 'chef-hat', 7.58, 1.63, 0.8, C.white);
  circle(c.slide, 7.85, 2.75, 1.65, C.green);
  icon(c.slide, 'factory', 8.28, 3.18, 0.8, C.white);
  line(c.slide, 8.3, 2.57, 8.2, 2.8, C.yellow, 2.5, true);
  tx(c.slide, 'Find the right worker for the job.', 6.48, 4.65, 3.0, 0.25, { fontSize: 13, bold: true, color: C.white, align: 'center' });
  note(c, 'Ask each learner to name one workload that might contain repeated independent work. Invite them to continue with the notebook.');
  finish(c);
}

// 15. Appendix anatomy
{
  const c = newSlide('appendix-anatomy');
  heading(c, 'APPENDIX', 'How the GPU divides work', 'Useful vocabulary after the main mental model is clear.');
  const labels = [
    ['GPU', 'the whole device', C.green],
    ['group', 'related work', C.blue],
    ['thread', 'one small item', C.coral],
  ];
  labels.forEach((item, i) => {
    const x = 0.85 + i * 2.95;
    contentBox(c, `anatomy-${i}`, x, 2.25, 2.35, 1.65);
    rect(c.slide, x, 2.25, 2.35, 1.65, item[2], true);
    icon(c.slide, i === 0 ? 'cpu' : i === 1 ? 'layers' : 'zap', x + 0.87, 2.52, 0.55, C.white);
    tx(c.slide, item[0], x + 0.2, 3.28, 1.95, 0.22, { fontSize: 15, bold: true, color: C.white, align: 'center' });
    tx(c.slide, item[1], x + 0.2, 3.62, 1.95, 0.16, { fontSize: 10, color: C.white, align: 'center' });
  });
  footer(c, 'OPTIONAL HARDWARE MAP');
  note(c, 'Keep this appendix short. The learner only needs to understand that large work is divided into smaller pieces.');
  finish(c);
}

// 16. Appendix troubleshooting
{
  const c = newSlide('appendix-troubleshooting', true);
  heading(c, 'APPENDIX', 'If the Colab runtime misbehaves', 'Troubleshooting belongs here so the main story stays calm.', true);
  const items = [
    ['Recheck runtime', 'Choose GPU under Change runtime type.', 'settings'],
    ['Reconnect', 'Restart if CUDA is unavailable.', 'refresh-cw'],
    ['Use fallback', 'Run the CPU cells while waiting.', 'shield-check'],
  ];
  items.forEach((item, i) => card(c, `trouble-${i}`, 0.8 + i * 3.02, 2.25, 2.72, 1.9, C.darkPanel, item[2], i === 0 ? C.yellow : C.green, item[0], item[1]));
  note(c, 'Also remind learners that shared GPU type, memory, and timing vary.');
  finish(c);
}

// 17. Appendix pitfalls
{
  const c = newSlide('appendix-pitfalls');
  heading(c, 'APPENDIX', 'Three honest performance lessons', 'Keep these as the learner checklist after the live experiment.');
  card(c, 'pitfall-1', 0.8, 2.25, 2.72, 1.92, C.white, 'gauge', C.green, 'Measure honestly', 'Include the costs that matter to the application.');
  card(c, 'pitfall-2', 3.64, 2.25, 2.72, 1.92, C.white, 'package', C.blue, 'Batch enough work', 'Keep the factory busy, but stay within memory.');
  card(c, 'pitfall-3', 6.48, 2.25, 2.72, 1.92, C.white, 'cloud-off', C.coral, 'Do not ship Colab', 'Use it to learn, not as a durable production system.');
  footer(c, 'PERFORMANCE CHECKLIST');
  note(c, 'These are the three takeaways from the longer pitfalls document.');
  finish(c);
}

// 18. Appendix course
{
  const c = newSlide('appendix-course');
  heading(c, 'APPENDIX', 'From experiment to operated workload', 'The paid course is the engineering next step, not more hardware vocabulary.');
  const steps = [
    ['1', 'Application', 'notebook -> app'], ['2', 'Package', 'Docker'], ['3', 'Data', 'S3'],
    ['4', 'Run', 'AWS Batch'], ['5', 'Trigger', 'Lambda'], ['6', 'Operate', 'metrics + cost'],
  ];
  steps.forEach((step, i) => {
    const x = 0.72 + (i % 3) * 3.05;
    const y = 2.2 + Math.floor(i / 3) * 1.03;
    contentBox(c, `course-${i}`, x, y, 2.55, 0.74);
    rect(c.slide, x, y, 2.55, 0.74, i === 3 ? C.greenLight : C.white, true, { color: C.line, width: 1 });
    tx(c.slide, step[0], x + 0.15, y + 0.2, 0.25, 0.2, { fontSize: 14, bold: true, color: C.coral });
    tx(c.slide, step[1], x + 0.55, y + 0.14, 1.75, 0.18, { fontSize: 11, bold: true, color: C.ink });
    tx(c.slide, step[2], x + 0.55, y + 0.42, 1.75, 0.16, { fontSize: 9, color: C.muted });
  });
  footer(c, 'OPTIONAL COURSE BRIDGE');
  note(c, 'Close the course bridge by emphasizing repeatability, observability, and cost control.');
  finish(c);
}

async function build() {
  const outputPath = path.join(__dirname, 'introduction-to-gpu-slides.pptx');
  await pptx.writeFile({ fileName: outputPath });
  const root = path.join(__dirname, '..');
  const materialFiles = fs.readdirSync(path.join(root, 'introduction-to-gpu'))
    .filter((file) => file.endsWith('.md') || file.endsWith('.ipynb'))
    .map((file) => `introduction-to-gpu/${file}`);
  const trackedSources = ['slides/build-deck.js', 'slides/slide-source-map.json', ...materialFiles];
  const sources = Object.fromEntries(trackedSources.map((file) => [
    file,
    crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex'),
  ]));
  fs.writeFileSync(path.join(__dirname, 'build-manifest.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), sources }, null, 2)}\n`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
