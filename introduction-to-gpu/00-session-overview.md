# Introduction to GPUs: One-Hour Free Session

This is a beginner-first, hands-on story about choosing the right worker for a real workload. Learners leave with one mental model, one experiment, and one honest performance lesson.

## Session Promise

By the end, learners can:

- Explain the difference between a generalist worker and a parallel assembly line.
- Spot workloads where the same job repeats across many independent items.
- Predict when a GPU will help and when it will not.
- Run a GPU experiment in Google Colab.
- Explain why moving data can erase a compute speedup.

## Audience Assumptions

Assume basic Python syntax, but no knowledge of CUDA, linear algebra, operating systems, or cloud infrastructure. Introduce technical terms only after the learner has a concrete example for them.

## One-Hour Run of Show

| Time | Segment | Learner experience |
| --- | --- | --- |
| 0-5 min | Hook: one job becomes a million | Start with pixels, video, and recommendations |
| 5-12 min | The worker metaphor | Compare one versatile worker with an assembly line |
| 12-18 min | The workload pattern | Identify repeated, independent work |
| 18-25 min | When GPUs help | Compare useful and poor fits |
| 25-32 min | Colab setup and prediction | Prepare the experiment and write down a guess |
| 32-45 min | Vector experiment | See one independent item per worker |
| 45-53 min | Matrix experiment | Give the assembly line enough work |
| 53-57 min | The warehouse lesson | Include data movement in the question |
| 57-60 min | Close and next step | Connect the experiment to production |

## Teaching Rhythm

For every idea:

1. Start with a familiar example.
2. Ask learners to predict.
3. Give the smallest useful explanation.
4. Run or inspect the experiment.
5. Ask what the result means in the real world.

## Opening Hook

Ask:

> If you had to apply the same photo filter to ten million pixels, would you hire one very clever worker or many workers doing simple pieces at the same time?

Then connect the answer to image filters, video frames, recommendation scores, and machine-learning calculations.

## Instructor Preparation

- Open the Colab notebook and verify that a GPU runtime is available.
- Run the notebook once, but do not promise a universal timing.
- Keep the CPU fallback ready.
- Ask learners to open the notebook before the session starts.
- Treat surprising results as useful evidence, not failure.

## Closing CTA

> Today we used Colab to discover whether a workload benefits from a GPU. The next engineering step is to package that experiment, run it reliably, and measure its cost in the cloud.

## Optional Follow-Up

Change the matrix size and ask:

- At what size did the GPU become useful?
- What changed when transfer time was included?
- Which part of the workload was actually parallel?
