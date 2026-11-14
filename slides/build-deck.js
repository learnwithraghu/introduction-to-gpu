const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Learn With Raghu';
pptx.company = 'Learn With Raghu';
pptx.subject = 'Introduction to GPUs';
pptx.title = 'Introduction to GPUs';
pptx.lang = 'en-US';
pptx.theme = {
  headFontFace: 'Arial',
  bodyFontFace: 'Arial',
  lang: 'en-US',
};
pptx.defineSlideMaster({
  title: 'BLANK',
  background: { color: '111111' },
  objects: [],
  slideNumber: { x: 9.05, y: 5.15, color: '6E767D', fontFace: 'Arial', fontSize: 8 },
});

const S = pptx.ShapeType;
const W = 10;
const H = 5.625;
const C = {
  black: '050505',
  graphite: '111111',
  panel: '1E2428',
  panel2: '252D32',
  green: '76B900',
  green2: 'A6D83B',
  white: 'F5F7FA',
  muted: 'A7AFB8',
  faint: '657078',
  orange: 'FFB000',
  red: 'F2665E',
  cyan: '54D6D6',
};

function tx(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    margin: opts.margin ?? 0,
    fontFace: opts.fontFace || 'Arial',
    fontSize: opts.fontSize || 16,
    color: opts.color || C.white,
    bold: opts.bold || false,
    italic: opts.italic || false,
    breakLine: false,
    fit: 'shrink',
    valign: opts.valign || 'mid',
    align: opts.align || 'left',
    charSpacing: opts.charSpacing || 0,
    bullet: opts.bullet,
    paraSpaceAfterPt: opts.paraSpaceAfterPt,
  });
}

function rect(slide, x, y, w, h, fill, radius = false, line = null, transparency = 0) {
  slide.addShape(radius ? S.roundRect : S.rect, {
    x, y, w, h,
    rectRadius: radius ? 0.08 : undefined,
    fill: { color: fill, transparency },
    line: line ? { color: line.color || line, width: line.width || 1, transparency: line.transparency || 0 } : { color: fill, transparency: 100 },
  });
}

function line(slide, x1, y1, x2, y2, color = C.green, width = 1.5, dashType) {
  slide.addShape(S.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width, dashType, beginArrowType: 'none', endArrowType: 'none' } });
}

function circle(slide, x, y, d, fill, lineColor = fill, width = 1) {
  slide.addShape(S.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: lineColor, width } });
}

function tag(slide, text, x, y, color = C.green) {
  const label = text.toUpperCase();
  const width = Math.min(2.9, Math.max(1.05, 0.34 + label.length * 0.065));
  const textColor = color === C.black ? C.white : C.black;
  rect(slide, x, y, width, 0.28, color, true);
  tx(slide, label, x + 0.06, y + 0.01, width - 0.12, 0.24, { fontSize: 8, bold: true, color: textColor, align: 'center', charSpacing: 1.05 });
}

function title(slide, kicker, heading, sub = '', dark = true) {
  tag(slide, kicker, 0.55, 0.38, dark ? C.green : C.black);
  const longHeading = heading.length > 42;
  const headingHeight = longHeading ? 0.82 : 0.52;
  const subtitleY = longHeading ? 1.64 : 1.4;
  tx(slide, heading, 0.55, 0.8, 8.8, headingHeight, { fontSize: longHeading ? 25 : 29, bold: true, color: dark ? C.white : C.graphite });
  if (sub) tx(slide, sub, 0.55, subtitleY, 8.6, 0.3, { fontSize: 12, color: dark ? C.muted : '53606A' });
}

function footer(slide, text = 'INTRODUCTION TO GPUS') {
  line(slide, 0.55, 5.08, 9.05, 5.08, C.panel2, 0.8);
  tx(slide, text, 0.55, 5.17, 5.5, 0.18, { fontSize: 7, bold: true, color: C.faint, charSpacing: 1.2 });
}

function note(slide, text) {
  slide.addNotes(text);
}

function darkSlide() {
  const slide = pptx.addSlide('BLANK');
  slide.background = { color: C.graphite };
  return slide;
}

function lightSlide() {
  const slide = pptx.addSlide('BLANK');
  slide.background = { color: 'F1F4F2' };
  return slide;
}

function grid(slide, x, y, cols, rows, size, gap, colors = [C.green, C.panel2]) {
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const color = (r + c) % 5 === 0 ? colors[0] : colors[1];
      rect(slide, x + c * (size + gap), y + r * (size + gap), size, size, color, true, null, color === colors[1] ? 10 : 0);
    }
  }
}

function worker(slide, x, y, label, fill = C.panel2, accent = C.green) {
  rect(slide, x, y, 0.72, 0.5, fill, true, { color: accent, width: 1.2 });
  circle(slide, x + 0.1, y + 0.13, 0.22, accent);
  tx(slide, label, x + 0.36, y + 0.12, 0.3, 0.2, { fontSize: 9, bold: true, color: C.white, align: 'center' });
}

function matrix(slide, x, y, rows, cols, cell, accent = C.green, secondary = C.panel2) {
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const hot = (r * 3 + c * 5) % 7 === 0;
      rect(slide, x + c * (cell + 0.04), y + r * (cell + 0.04), cell, cell, hot ? accent : secondary, true, null, hot ? 0 : 10);
    }
  }
}

// 1. Title
{
  const s = darkSlide();
  tx(s, 'GPU / 01', 0.58, 0.48, 1.2, 0.22, { fontSize: 9, color: C.green, bold: true, charSpacing: 2 });
  tx(s, 'Introduction\nto GPUs', 0.58, 1.15, 5.25, 1.45, { fontSize: 38, bold: true });
  tx(s, 'From parallel pixels to production workloads', 0.6, 2.8, 4.8, 0.35, { fontSize: 16, color: C.muted });
  tx(s, 'A one-hour hands-on session with Google Colab', 0.6, 3.27, 4.8, 0.3, { fontSize: 11, color: C.green2, bold: true });
  grid(s, 6.2, 1.02, 8, 7, 0.36, 0.1);
  for (let i = 0; i < 5; i += 1) line(s, 6.15, 4.16 + i * 0.15, 9.45, 2.65 + i * 0.15, C.green, 1.2);
  tx(s, 'LEARN  /  PREDICT  /  MEASURE', 0.6, 4.82, 4.8, 0.22, { fontSize: 8, color: C.faint, bold: true, charSpacing: 1.5 });
  note(s, 'Opening: welcome learners from every background. Frame this as a practical mental-model session, not a hardware vocabulary test. Tell learners they will run a real GPU experiment in Colab.');
}

// 2. Hook
{
  const s = darkSlide();
  title(s, 'THE HOOK', 'What happens when one calculation runs 10 million times?', 'The problem is not always a smarter worker. Sometimes it is more workers.');
  tx(s, 'ONE WORKER', 0.72, 2.18, 1.8, 0.24, { fontSize: 9, bold: true, color: C.muted, charSpacing: 1.3 });
  worker(s, 0.78, 2.63, '01', C.panel2, C.orange);
  line(s, 1.55, 2.88, 3.45, 2.88, C.orange, 2);
  tx(s, '10M items', 1.82, 2.45, 1.1, 0.25, { fontSize: 10, bold: true, color: C.orange, align: 'center' });
  rect(s, 3.65, 2.12, 5.58, 1.7, C.panel, true, { color: C.panel2, width: 1 });
  tx(s, 'MANY WORKERS', 3.92, 2.32, 1.8, 0.24, { fontSize: 9, bold: true, color: C.green, charSpacing: 1.3 });
  for (let i = 0; i < 12; i += 1) worker(s, 3.95 + (i % 4) * 1.18, 2.75 + Math.floor(i / 4) * 0.35, String(i + 1).padStart(2, '0'), C.panel2, i % 4 === 0 ? C.green2 : C.green);
  tx(s, 'Same operation  /  different items  /  at the same time', 2.38, 4.28, 5.2, 0.28, { fontSize: 14, color: C.white, bold: true, align: 'center' });
  note(s, 'Ask: If you had to apply the same calculation to ten million pixels, would you choose one very clever worker or thousands of workers doing simple pieces? Let students answer before introducing the word parallelism.');
}

// 3. Journey
{
  const s = lightSlide();
  title(s, 'THE JOURNEY', 'Today: build one useful GPU mental model', 'We will move from intuition to experiment to production.', false);
  const steps = [
    ['01', 'Mental model', 'What is a GPU?'],
    ['02', 'Architecture', 'How work is divided'],
    ['03', 'Experiment', 'Measure CPU vs GPU'],
    ['04', 'Production', 'Colab to AWS Batch'],
  ];
  steps.forEach((step, i) => {
    const x = 0.7 + i * 2.32;
    rect(s, x, 2.38, 1.88, 1.56, i === 2 ? C.green : C.white, true, { color: i === 2 ? C.green : 'D1D8D3', width: 1 });
    tx(s, step[0], x + 0.17, 2.58, 0.55, 0.34, { fontSize: 19, bold: true, color: i === 2 ? C.black : C.green });
    tx(s, step[1], x + 0.17, 3.08, 1.52, 0.22, { fontSize: 11, bold: true, color: i === 2 ? C.black : C.graphite });
    tx(s, step[2], x + 0.17, 3.4, 1.54, 0.28, { fontSize: 9, color: i === 2 ? C.black : '53606A' });
    if (i < 3) line(s, x + 1.9, 3.16, x + 2.2, 3.16, C.green, 1.5);
  });
  tx(s, 'PREDICT  →  RUN  →  EXPLAIN', 2.72, 4.65, 4.5, 0.23, { fontSize: 10, bold: true, color: C.graphite, align: 'center', charSpacing: 1.5 });
  footer(s);
  note(s, 'Set expectations: learners do not need CUDA expertise. The rhythm is predict, run, explain. Tell them the benchmark result is less important than understanding why it happened.');
}

// 4. What is GPU
{
  const s = darkSlide();
  title(s, 'MENTAL MODEL', 'A GPU is a throughput machine', 'It is not simply a faster CPU. It is a different trade-off.');
  rect(s, 0.7, 2.18, 3.22, 2.22, C.panel, true, { color: C.panel2, width: 1 });
  tx(s, 'CPU', 0.98, 2.48, 0.8, 0.38, { fontSize: 25, bold: true, color: C.orange });
  tx(s, 'A few powerful, flexible workers', 0.98, 2.99, 2.3, 0.28, { fontSize: 13, bold: true });
  tx(s, 'Great for sequential logic, decisions, and general application work.', 0.98, 3.43, 2.4, 0.48, { fontSize: 10, color: C.muted });
  worker(s, 2.65, 2.56, 'A', C.panel2, C.orange);
  worker(s, 2.65, 3.18, 'B', C.panel2, C.orange);
  rect(s, 4.25, 2.18, 4.98, 2.22, C.green, true);
  tx(s, 'GPU', 4.55, 2.48, 0.8, 0.38, { fontSize: 25, bold: true, color: C.black });
  tx(s, 'Many lightweight parallel workers', 4.55, 2.99, 3.15, 0.28, { fontSize: 13, bold: true, color: C.black });
  tx(s, 'Great for regular, repeated operations over large batches of data.', 4.55, 3.43, 3.25, 0.48, { fontSize: 10, color: C.black });
  grid(s, 7.05, 2.58, 6, 3, 0.27, 0.06, [C.black, 'B5E56B']);
  tx(s, 'many lightweight workers', 6.95, 3.85, 2.05, 0.2, { fontSize: 9, bold: true, color: C.black, align: 'center' });
  tx(s, 'The fit matters.', 3.6, 4.82, 2.8, 0.28, { fontSize: 16, bold: true, color: C.green2, align: 'center' });
  note(s, 'Say: A GPU is optimized for high-throughput parallel workloads. Avoid saying every operation becomes faster. Ask learners for a workload where the same calculation repeats across many items.');
}

// 5. CPU vs GPU
{
  const s = lightSlide();
  title(s, 'TRADE-OFFS', 'Latency vs throughput', 'One task quickly is different from many tasks efficiently.', false);
  tx(s, 'LATENCY', 0.72, 2.06, 1.4, 0.22, { fontSize: 10, bold: true, color: '53606A', charSpacing: 1.3 });
  tx(s, 'How long does one task take?', 0.72, 2.36, 2.1, 0.26, { fontSize: 13, bold: true, color: C.graphite });
  line(s, 0.78, 3.18, 3.35, 3.18, C.orange, 3);
  circle(s, 0.82, 3.02, 0.32, C.orange);
  tx(s, 'one task', 0.78, 3.55, 0.8, 0.2, { fontSize: 9, color: '53606A' });
  tx(s, 'THROUGHPUT', 5.18, 2.06, 1.6, 0.22, { fontSize: 10, bold: true, color: C.green, charSpacing: 1.3 });
  tx(s, 'How much work finishes per second?', 5.18, 2.36, 2.8, 0.26, { fontSize: 13, bold: true, color: C.graphite });
  for (let i = 0; i < 8; i += 1) {
    circle(s, 5.2 + i * 0.44, 3.03, 0.28, i % 2 === 0 ? C.green : C.green2);
  }
  tx(s, 'many tasks', 5.18, 3.55, 1.0, 0.2, { fontSize: 9, color: '53606A' });
  rect(s, 0.72, 4.25, 8.5, 0.58, C.white, true, { color: 'D1D8D3', width: 1 });
  tx(s, 'A GPU wins when there is enough regular work to keep the parallel workers busy.', 1.02, 4.43, 7.9, 0.2, { fontSize: 12, bold: true, color: C.graphite, align: 'center' });
  footer(s, 'CPU VS GPU');
  note(s, 'Ask: Which matters more for a web request, latency or throughput? Which matters more for processing a million images? Emphasize that the answer depends on the workload and the product goal.');
}

// 6. Where GPUs help
{
  const s = darkSlide();
  title(s, 'WORKLOAD FIT', 'Where GPUs help', 'Look for the same operation repeated across many data items.');
  const cards = [
    ['IMAGE', 'Pixels', C.green], ['ML', 'Tensors', C.green2], ['SIM', 'Particles', C.cyan], ['VIDEO', 'Frames', C.orange],
  ];
  cards.forEach((c, i) => {
    const x = 0.7 + i * 2.2;
    rect(s, x, 2.28, 1.76, 1.72, C.panel, true, { color: C.panel2, width: 1 });
    matrix(s, x + 0.25, 2.52, 3, 4, 0.25, c[2], C.panel2);
    tx(s, c[0], x + 0.23, 3.38, 1.3, 0.2, { fontSize: 9, bold: true, color: c[2], charSpacing: 1.1 });
    tx(s, c[1], x + 0.23, 3.64, 1.3, 0.2, { fontSize: 12, bold: true });
  });
  tx(s, 'parallelism = repeated work + low coordination', 2.15, 4.63, 5.7, 0.25, { fontSize: 13, color: C.green2, bold: true, align: 'center' });
  note(s, 'Invite examples from students: image filters, recommendation scoring, scientific simulations, video processing. Keep the common pattern visible: the operation repeats and the items can be processed independently.');
}

// 7. Where not automatically
{
  const s = lightSlide();
  title(s, 'WORKLOAD FIT', 'A GPU is not automatically faster', 'The accelerator must earn back its launch and data-movement costs.', false);
  const items = [
    ['TINY', 'Too little work'], ['WAITING', 'Network or user input'], ['BRANCHY', 'Irregular decisions'], ['MOVING', 'Too much transfer'],
  ];
  items.forEach((it, i) => {
    const x = 0.7 + i * 2.22;
    const bad = i === 0 || i === 3;
    rect(s, x, 2.4, 1.82, 1.38, C.white, true, { color: bad ? 'F0C5B8' : 'D1D8D3', width: 1 });
    circle(s, x + 0.2, 2.68, 0.38, bad ? C.red : C.orange);
    tx(s, bad ? '!' : '?', x + 0.2, 2.71, 0.38, 0.28, { fontSize: 14, bold: true, color: C.white, align: 'center' });
    tx(s, it[0], x + 0.2, 3.23, 1.3, 0.18, { fontSize: 9, bold: true, color: bad ? C.red : C.orange, charSpacing: 1.1 });
    tx(s, it[1], x + 0.2, 3.48, 1.35, 0.2, { fontSize: 11, bold: true, color: C.graphite });
  });
  rect(s, 1.35, 4.3, 7.25, 0.56, C.graphite, true);
  tx(s, 'Rule of thumb: benchmark the workload you actually care about.', 1.55, 4.48, 6.85, 0.18, { fontSize: 12, bold: true, color: C.white, align: 'center' });
  footer(s, 'WORKLOAD FIT');
  note(s, 'Ask learners to classify: adding ten numbers, waiting for an API, multiplying large matrices, and processing ten million pixels. The desired answer is not always GPU.');
}

// 8. Vector addition
{
  const s = darkSlide();
  title(s, 'PARALLEL PATTERN', 'Vector addition: one item per worker', 'Each output element can be calculated independently.');
  tx(s, 'a', 0.75, 2.0, 0.25, 0.28, { fontSize: 18, bold: true, color: C.orange });
  tx(s, '[ 2   4   6   8 ]', 1.15, 2.0, 2.3, 0.28, { fontSize: 18, bold: true, color: C.white, fontFace: 'Courier New' });
  tx(s, '+', 0.82, 2.65, 0.2, 0.25, { fontSize: 18, bold: true, color: C.green });
  tx(s, 'b', 1.15, 2.65, 0.25, 0.28, { fontSize: 18, bold: true, color: C.green });
  tx(s, '[ 1   3   5   7 ]', 1.55, 2.65, 2.3, 0.28, { fontSize: 18, bold: true, color: C.white, fontFace: 'Courier New' });
  line(s, 3.75, 2.2, 4.45, 2.2, C.green, 2);
  tx(s, 'c[i] = a[i] + b[i]', 4.78, 2.05, 2.25, 0.35, { fontSize: 16, bold: true, color: C.green2, fontFace: 'Courier New' });
  for (let i = 0; i < 4; i += 1) {
    worker(s, 4.72 + i * 1.02, 2.76, `T${i}`, C.panel2, i === 0 ? C.green2 : C.green);
    line(s, 5.08 + i * 1.02, 3.27, 5.08 + i * 1.02, 3.68, C.green, 1.2);
    tx(s, String([3, 7, 11, 15][i]), 4.85 + i * 1.02, 3.78, 0.48, 0.25, { fontSize: 16, bold: true, color: C.white, align: 'center', fontFace: 'Courier New' });
  }
  tx(s, 'PREDICT BEFORE RUNNING', 3.55, 4.65, 3.3, 0.2, { fontSize: 9, color: C.green, bold: true, charSpacing: 1.4, align: 'center' });
  note(s, 'Ask: What does thread T2 calculate? What happens if the vector has ten million elements? Connect the diagram to the notebook, where PyTorch maps this operation to the selected device.');
}

// 9. Anatomy
{
  const s = lightSlide();
  title(s, 'UNDER THE HOOD', 'How the GPU divides work', 'You do not need to write a kernel today. You need the map.', false);
  rect(s, 0.74, 2.05, 8.5, 2.5, C.white, true, { color: 'D1D8D3', width: 1 });
  tx(s, 'GPU DEVICE', 1.0, 2.32, 1.6, 0.23, { fontSize: 10, bold: true, color: C.graphite, charSpacing: 1.2 });
  rect(s, 1.0, 2.75, 3.4, 1.3, 'E9F3E0', true, { color: C.green, width: 1.2 });
  tx(s, 'STREAMING\nMULTIPROCESSOR', 1.25, 3.01, 1.48, 0.56, { fontSize: 12, bold: true, color: C.graphite, align: 'center' });
  rect(s, 2.95, 2.99, 1.16, 0.78, C.green, true);
  tx(s, 'BLOCK', 3.04, 3.23, 0.95, 0.18, { fontSize: 10, bold: true, color: C.black, align: 'center' });
  line(s, 4.42, 3.4, 5.05, 3.4, C.green, 2);
  tx(s, 'many blocks', 4.5, 3.05, 0.9, 0.2, { fontSize: 9, color: '53606A', align: 'center' });
  for (let r = 0; r < 2; r += 1) for (let c = 0; c < 6; c += 1) worker(s, 5.18 + c * 0.58, 2.65 + r * 0.65, '', C.panel2, C.green);
  tx(s, 'THREADS', 5.75, 4.02, 1.2, 0.18, { fontSize: 9, bold: true, color: C.green, align: 'center', charSpacing: 1.1 });
  tx(s, 'thread  →  block  →  multiprocessor  →  GPU', 2.35, 4.68, 5.5, 0.22, { fontSize: 12, bold: true, color: C.graphite, align: 'center' });
  footer(s, 'GPU ANATOMY');
  note(s, 'Keep this deliberately simplified. Say that frameworks hide most scheduling details. Ask what one thread would calculate in vector addition. Do not spend time on every core or cache type in this free session.');
}

// 10. Memory
{
  const s = darkSlide();
  title(s, 'PERFORMANCE', 'The GPU can be fast and still spend time waiting', 'Data has to reach the factory floor.');
  rect(s, 0.72, 2.16, 2.18, 1.75, C.panel, true, { color: C.panel2, width: 1 });
  tx(s, 'CPU MEMORY', 1.0, 2.47, 1.3, 0.2, { fontSize: 10, bold: true, color: C.orange, charSpacing: 1.2 });
  grid(s, 1.0, 2.96, 4, 2, 0.25, 0.08, [C.orange, C.panel2]);
  line(s, 3.07, 3.02, 4.06, 3.02, C.green, 2);
  tx(s, 'transfer', 3.27, 2.72, 0.75, 0.2, { fontSize: 9, bold: true, color: C.green, align: 'center' });
  rect(s, 4.2, 2.16, 4.55, 1.75, C.green, true);
  tx(s, 'GPU MEMORY', 4.5, 2.47, 1.45, 0.2, { fontSize: 10, bold: true, color: C.black, charSpacing: 1.2 });
  grid(s, 4.5, 2.96, 7, 2, 0.25, 0.08, [C.black, 'A6D83B']);
  tx(s, 'input transfer + computation + output transfer', 1.0, 4.42, 7.8, 0.28, { fontSize: 15, bold: true, color: C.green2, align: 'center' });
  tx(s, 'Batching often helps: send a truckload, not one box at a time.', 1.45, 4.83, 6.9, 0.2, { fontSize: 10, color: C.muted, align: 'center' });
  note(s, 'Use the warehouse analogy: CPU memory is the warehouse and GPU memory is the factory floor. Ask whether a benchmark is fair if it excludes transfer time. Explain that both kernel-only and end-to-end timings can be useful, but they answer different questions.');
}

// 11. Colab setup
{
  const s = lightSlide();
  title(s, 'LIVE LAB', 'Google Colab: get a GPU in minutes', 'The runtime is temporary, shared infrastructure. That is fine for learning.', false);
  const steps = [
    ['1', 'Open notebook', 'Colab'], ['2', 'Change runtime', 'GPU'], ['3', 'Run check', 'CUDA'],
  ];
  steps.forEach((st, i) => {
    const x = 0.72 + i * 2.95;
    circle(s, x, 2.28, 0.55, i === 1 ? C.green : C.graphite);
    tx(s, st[0], x, 2.42, 0.55, 0.22, { fontSize: 16, bold: true, color: i === 1 ? C.black : C.white, align: 'center' });
    tx(s, st[1], x, 3.08, 1.72, 0.23, { fontSize: 13, bold: true, color: C.graphite });
    tx(s, st[2], x, 3.43, 1.72, 0.2, { fontSize: 10, color: '53606A' });
    if (i < 2) line(s, x + 0.7, 2.55, x + 2.4, 2.55, C.green, 1.5);
  });
  rect(s, 1.0, 4.27, 7.9, 0.54, C.graphite, true);
  tx(s, 'Check: torch.cuda.is_available()', 1.2, 4.44, 7.5, 0.2, { fontSize: 12, bold: true, color: C.green2, fontFace: 'Courier New', align: 'center' });
  footer(s, 'GOOGLE COLAB');
  note(s, 'Walk learners through Runtime > Change runtime type > GPU. Ask: what does available mean? Hardware exists, or our code is using it? Mention that GPU model and timing vary between Colab sessions.');
}

// 12. Benchmark design
{
  const s = darkSlide();
  title(s, 'LIVE LAB', 'One experiment. Three execution paths.', 'Same intent, different device and framework.',);
  const paths = [
    ['NUMPY', 'CPU', C.orange], ['PYTORCH', 'CPU', C.cyan], ['PYTORCH', 'GPU', C.green],
  ];
  paths.forEach((p, i) => {
    const x = 0.8 + i * 2.95;
    rect(s, x, 2.12, 2.3, 1.56, C.panel, true, { color: p[2], width: 1.2 });
    tx(s, p[0], x + 0.2, 2.48, 1.8, 0.22, { fontSize: 11, bold: true, color: p[2], charSpacing: 1.2 });
    tx(s, p[1], x + 0.2, 2.86, 1.8, 0.34, { fontSize: 21, bold: true });
    for (let j = 0; j < 5; j += 1) circle(s, x + 0.2 + j * 0.34, 3.36, 0.18, j === 0 ? p[2] : C.panel2, p[2]);
  });
  line(s, 1.1, 4.26, 8.85, 4.26, C.green, 1.5);
  tx(s, 'same operation  →  measure  →  explain the difference', 1.15, 4.5, 7.65, 0.25, { fontSize: 14, color: C.green2, bold: true, align: 'center' });
  note(s, 'Before running, ask learners to predict the winner. Explain that NumPy is a familiar CPU baseline, PyTorch CPU shows the framework change, and PyTorch GPU shows the device change.');
}

// 13. Vector results
{
  const s = lightSlide();
  title(s, 'LIVE LAB', 'Vector addition: small work can surprise you', 'The GPU may not win when arithmetic is cheap and overhead dominates.', false);
  tx(s, 'relative time', 0.8, 2.02, 1.3, 0.18, { fontSize: 9, bold: true, color: '53606A', charSpacing: 1 });
  const bars = [
    ['NumPy CPU', 2.8, C.orange], ['PyTorch CPU', 2.2, C.cyan], ['PyTorch GPU', 1.55, C.green],
  ];
  bars.forEach((b, i) => {
    const y = 2.48 + i * 0.6;
    tx(s, b[0], 0.8, y + 0.08, 1.3, 0.2, { fontSize: 10, color: C.graphite, bold: true });
    rect(s, 2.3, y, b[1], 0.34, b[2], true);
    tx(s, 'measure it', 2.3 + b[1] + 0.15, y + 0.08, 1.0, 0.16, { fontSize: 9, color: '53606A' });
  });
  rect(s, 6.3, 2.35, 2.75, 1.48, C.graphite, true);
  tx(s, 'LESSON', 6.55, 2.62, 1.0, 0.2, { fontSize: 9, bold: true, color: C.green, charSpacing: 1.2 });
  tx(s, 'A GPU is not magic.', 6.55, 2.98, 2.1, 0.25, { fontSize: 17, bold: true, color: C.white });
  tx(s, 'Workload shape matters.', 6.55, 3.36, 2.0, 0.2, { fontSize: 11, color: C.green2 });
  tx(s, 'Ask: did the result match your prediction?', 1.05, 4.48, 7.95, 0.22, { fontSize: 13, bold: true, color: C.graphite, align: 'center' });
  footer(s, 'VECTOR ADDITION');
  note(s, 'The chart is intentionally conceptual: exact timings vary by runtime. Ask why vector addition may be memory-bound and why the displayed GPU timing excludes the first transfer because tensors were prepared on the device.');
}

// 14. Matrix multiplication
{
  const s = darkSlide();
  title(s, 'LIVE LAB', 'Matrix multiplication: give the GPU more to do', 'More arithmetic per batch gives the parallel hardware room to work.');
  matrix(s, 0.85, 2.22, 5, 5, 0.37, C.orange, C.panel2);
  tx(s, '×', 3.16, 3.0, 0.55, 0.55, { fontSize: 30, bold: true, color: C.green2, align: 'center' });
  matrix(s, 4.0, 2.22, 5, 5, 0.37, C.cyan, C.panel2);
  line(s, 6.4, 3.25, 7.1, 3.25, C.green, 2);
  matrix(s, 7.35, 2.22, 5, 5, 0.37, C.green, C.panel2);
  tx(s, 'large regular work', 2.05, 4.55, 3.0, 0.22, { fontSize: 12, color: C.muted, align: 'center' });
  tx(s, 'parallel arithmetic', 6.8, 4.55, 2.3, 0.22, { fontSize: 12, color: C.green2, align: 'center' });
  note(s, 'Say: each output value is a dot product, and the output contains many dot products. Ask why a 2048 by 2048 multiplication offers more opportunity than adding ten values. Explain warm-ups and synchronization before running the notebook.');
}

// 15. Timing equation
{
  const s = lightSlide();
  title(s, 'PERFORMANCE', 'The timing equation', 'A production decision needs the whole path, not only the kernel.', false);
  tx(s, 'TOTAL TIME', 0.78, 2.18, 1.5, 0.22, { fontSize: 10, bold: true, color: '53606A', charSpacing: 1.2 });
  tx(s, '=', 2.55, 2.64, 0.35, 0.38, { fontSize: 30, bold: true, color: C.graphite, align: 'center' });
  const parts = [
    ['input transfer', C.orange], ['GPU computation', C.green], ['output transfer', C.cyan],
  ];
  parts.forEach((p, i) => {
    const x = 3.15 + i * 2.05;
    rect(s, x, 2.28, 1.72, 1.02, p[1], true);
    tx(s, p[0], x + 0.1, 2.64, 1.52, 0.25, { fontSize: 11, bold: true, color: i === 1 ? C.black : C.black, align: 'center' });
    if (i < 2) tx(s, '+', x + 1.78, 2.56, 0.25, 0.3, { fontSize: 22, bold: true, color: C.graphite, align: 'center' });
  });
  rect(s, 1.1, 4.1, 7.75, 0.55, C.graphite, true);
  tx(s, 'The right benchmark depends on the question you are asking.', 1.3, 4.28, 7.35, 0.2, { fontSize: 12, bold: true, color: C.white, align: 'center' });
  footer(s, 'PERFORMANCE MODEL');
  note(s, 'Ask: is the application interactive or batch? Explain that kernel-only timing helps optimize the operation, while end-to-end timing helps decide whether the product benefits.');
}

// 16. Production bridge
{
  const s = darkSlide();
  title(s, 'FROM EXPERIMENT TO PRODUCTION', 'Colab is the lab. AWS Batch is the job floor.', 'Lambda coordinates the work; GPU compute runs in AWS Batch.',);
  const nodes = [
    [0.55, 2.48, 1.48, 0.9, 'COLAB', 'discover', C.cyan],
    [2.38, 2.48, 1.48, 0.9, 'DOCKER', 'package', C.orange],
    [4.21, 2.48, 1.48, 0.9, 'LAMBDA', 'submit', C.green2],
    [6.04, 2.48, 1.65, 0.9, 'AWS BATCH', 'run on GPU', C.green],
    [8.03, 2.48, 1.35, 0.9, 'S3', 'store', C.cyan],
  ];
  nodes.forEach((n, i) => {
    rect(s, n[0], n[1], n[2], n[3], n[6], true);
    tx(s, n[4], n[0] + 0.08, n[1] + 0.19, n[2] - 0.16, 0.2, { fontSize: 10, bold: true, color: C.black, align: 'center', charSpacing: 0.7 });
    tx(s, n[5], n[0] + 0.08, n[1] + 0.49, n[2] - 0.16, 0.22, { fontSize: 9, color: C.black, align: 'center' });
    if (i < nodes.length - 1) line(s, n[0] + n[2] + 0.04, 2.93, nodes[i + 1][0] - 0.07, 2.93, C.green2, 1.8);
  });
  rect(s, 3.55, 3.94, 5.15, 0.55, C.panel, true, { color: C.panel2, width: 1 });
  tx(s, 'Lambda is the orchestrator — not the GPU runtime.', 3.75, 4.12, 4.75, 0.18, { fontSize: 11, bold: true, color: C.green2, align: 'center' });
  tx(s, 'Free session: prove the workload.  Paid course: deploy the workload.', 1.34, 4.78, 7.45, 0.2, { fontSize: 12, color: C.white, bold: true, align: 'center' });
  note(s, 'Important technical clarification: AWS Lambda does not directly provide GPU execution. Lambda can validate a request and submit or monitor an AWS Batch job. The GPU work runs on GPU-enabled compute in AWS Batch.');
}

// 17. Paid course bridge
{
  const s = lightSlide();
  title(s, 'NEXT STEP', 'Experiment today. Deploy tomorrow.', 'The paid course turns a notebook result into a repeatable cloud workload.', false);
  const modules = [
    ['01', 'Refactor', 'notebook → app'], ['02', 'Package', 'GPU Docker image'], ['03', 'Run', 'AWS Batch queue'], ['04', 'Operate', 'metrics + cost'],
  ];
  modules.forEach((m, i) => {
    const x = 0.68 + i * 2.24;
    rect(s, x, 2.23, 1.8, 1.6, i === 2 ? C.green : C.white, true, { color: i === 2 ? C.green : 'D1D8D3', width: 1 });
    tx(s, m[0], x + 0.17, 2.46, 0.5, 0.3, { fontSize: 18, bold: true, color: i === 2 ? C.black : C.green });
    tx(s, m[1], x + 0.17, 2.98, 1.3, 0.23, { fontSize: 12, bold: true, color: i === 2 ? C.black : C.graphite });
    tx(s, m[2], x + 0.17, 3.35, 1.35, 0.18, { fontSize: 9, color: i === 2 ? C.black : '53606A' });
  });
  tx(s, 'The goal is not “use a GPU.” The goal is “make the right workload faster, repeatable, and cost-aware.”', 1.12, 4.43, 7.8, 0.42, { fontSize: 13, bold: true, color: C.graphite, align: 'center' });
  footer(s, 'PAID COURSE BRIDGE');
  note(s, 'Position the paid course as engineering, not just more theory. Preview Docker, S3, AWS Batch GPU compute environments, Lambda job submission, monitoring, retries, and cost control.');
}

// 18. Close
{
  const s = darkSlide();
  tx(s, 'GPU / 01', 0.58, 0.48, 1.2, 0.22, { fontSize: 9, color: C.green, bold: true, charSpacing: 2 });
  tx(s, 'The question is\nnot “GPU or CPU?”', 0.62, 1.15, 5.3, 1.0, { fontSize: 30, bold: true });
  tx(s, 'The question is:', 0.62, 2.65, 2.3, 0.25, { fontSize: 15, color: C.muted });
  tx(s, '“What does this workload need?”', 0.62, 3.08, 5.6, 0.52, { fontSize: 23, bold: true, color: C.green2 });
  tx(s, 'Predict  /  run  /  measure  /  explain', 0.62, 4.4, 4.6, 0.25, { fontSize: 11, color: C.white, bold: true, charSpacing: 1.1 });
  grid(s, 7.08, 1.18, 5, 5, 0.36, 0.1);
  rect(s, 7.0, 3.88, 2.35, 0.72, C.green, true);
  tx(s, 'THANK YOU', 7.12, 4.12, 2.1, 0.22, { fontSize: 14, bold: true, color: C.black, align: 'center', charSpacing: 2 });
  note(s, 'Close by asking learners to name one workload from their own field that might contain repeated, independent work. Invite them to open the Colab notebook and continue experimenting.');
}

pptx.writeFile({ fileName: 'slides/introduction-to-gpu-slides.pptx' });
