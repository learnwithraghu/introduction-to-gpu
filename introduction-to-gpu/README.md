# Introduction to GPUs

This folder contains the blueprint for a one-hour free GPU session and its Google Colab lab.

## Start Here

1. Read [`00-session-overview.md`](00-session-overview.md) for the complete run of show.
2. Read the topic files in numerical order.
3. Open [`introduction-to-gpu-colab.ipynb`](introduction-to-gpu-colab.ipynb) in Google Colab.
4. Use [`06-hands-on-lab-guide.md`](06-hands-on-lab-guide.md) as the instructor script.
5. Use [`08-free-session-to-paid-course.md`](08-free-session-to-paid-course.md) when designing the paid-course transition.

## Files

| File | Purpose |
| --- | --- |
| `00-session-overview.md` | Timing, outcomes, preparation, and CTA |
| `01-what-is-a-gpu.md` | Beginner GPU mental model |
| `02-cpu-vs-gpu.md` | Latency, throughput, and parallelism |
| `03-gpu-anatomy.md` | Threads, blocks, and streaming multiprocessors |
| `04-gpu-memory-and-data-movement.md` | Transfers, batching, and memory costs |
| `05-google-colab-gpu-setup.md` | Colab setup and troubleshooting |
| `06-hands-on-lab-guide.md` | Instructor words and student questions |
| `07-gpu-pitfalls-and-next-steps.md` | Common mistakes and production bridge |
| `08-free-session-to-paid-course.md` | Paid-course module progression |
| `introduction-to-gpu-colab.ipynb` | Interactive NumPy/PyTorch benchmark lab |

## Technical Scope

The free session uses Google Colab and PyTorch. The benchmark compares NumPy on CPU, PyTorch on CPU, and PyTorch on GPU. The production preview uses AWS Lambda to submit or coordinate AWS Batch GPU jobs; Lambda itself is not presented as a GPU runtime.
