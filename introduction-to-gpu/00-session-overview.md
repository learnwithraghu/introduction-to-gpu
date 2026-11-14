# Introduction to GPUs: One-Hour Free Session

This session is designed as a practical introduction for learners from software, data, analytics, science, and business backgrounds. It should leave learners with one useful mental model, one successful GPU experiment, and curiosity about building GPU workloads in production.

## Session Promise

By the end, learners can:

- Explain why GPUs are good at throughput-oriented parallel work.
- Describe the difference between CPU execution and GPU execution.
- Identify the cost of moving data between CPU memory and GPU memory.
- Start a free Google Colab GPU runtime.
- Compare NumPy on CPU, PyTorch on CPU, and PyTorch on GPU.
- Explain why a GPU is not automatically faster for every problem.

## Audience Assumptions

Assume learners know basic Python syntax. Do not assume knowledge of linear algebra, CUDA, operating systems, or cloud infrastructure. Introduce terms only when they become useful.

## One-Hour Run of Show

| Time | Segment | Outcome |
| --- | --- | --- |
| 0-5 min | Hook: repeated work at scale | Learners see why hardware choice matters |
| 5-12 min | What is a GPU? | A simple GPU mental model |
| 12-20 min | CPU versus GPU | Sequential work versus parallel throughput |
| 20-27 min | GPU anatomy | Threads, blocks, and streaming multiprocessors |
| 27-33 min | Memory and data movement | Why transfers affect performance |
| 33-38 min | Colab setup | Everyone confirms a GPU runtime |
| 38-48 min | Vector addition lab | First working GPU computation |
| 48-55 min | Matrix multiplication lab | A workload where GPUs shine |
| 55-60 min | Production bridge | Colab experiment to Lambda plus AWS Batch |

## Instructor Preparation

- Open the Colab notebook before the session and verify that a GPU runtime is available.
- Run the notebook once so you know the expected timing range.
- Keep a CPU-only backup demonstration ready because free GPU availability can vary.
- Ask learners to open the notebook before the session starts.
- Explain that benchmark numbers depend on hardware, runtime load, and tensor size.

## Teaching Rhythm

For each concept, use this loop:

1. Ask a prediction question.
2. Explain the smallest useful mental model.
3. Run a demonstration.
4. Ask learners to interpret the result.
5. Connect the idea to a real workload.

## Opening Hook

Ask:

> If you had to apply the same calculation to ten million pixels, would you prefer one very clever worker or thousands of workers doing simple pieces at the same time?

Then connect the answer to image processing, recommendation systems, scientific simulations, and machine learning.

## Closing CTA

Do not sell the paid course as “more theory.” Position it as the next engineering step:

> Today we used Colab to discover whether a workload benefits from a GPU. In the paid course, we turn that experiment into a repeatable cloud workload: package the code, submit it from Lambda, run it on an AWS Batch GPU compute environment, and store the results in S3.

## Suggested Follow-Up

Invite learners to change the matrix size, rerun the benchmark, and answer:

- At what size did the GPU become useful?
- What happened when the data transfer time was included?
- Which part of the workload was actually parallel?
