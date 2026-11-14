# A Beginner's GPU Anatomy

The goal is not to memorize hardware names. The goal is to understand how a large computation is divided into manageable parallel pieces.

## The Simplified Hierarchy

```text
GPU device
|
+-- Streaming Multiprocessor (SM)
|   |
|   +-- Thread block
|       +-- Thread
|       +-- Thread
|       +-- Thread
|
+-- Streaming Multiprocessor (SM)
    |
    +-- Thread block
        +-- Thread
        +-- Thread
        +-- Thread
```

Names differ between vendors and generations, but this hierarchy is useful:

- A **thread** performs one small piece of work.
- A **thread block** is a cooperating group of threads.
- A **grid** is the collection of blocks for a kernel launch.
- A **streaming multiprocessor** schedules blocks and executes groups of threads.
- A **kernel** is a function launched on the GPU.

## Vector Addition as Thread Assignment

```text
element index:  0       1       2       3       4
thread:         T0      T1      T2      T3      T4
work:           a0+b0   a1+b1   a2+b2   a3+b3   a4+b4
```

The framework usually hides the thread-management details. In the Colab session, PyTorch lets learners select `device="cuda"` without writing a CUDA kernel.

## Why This Matters

The hardware can only help if the program exposes parallel work. A sequential loop, dependency chain, or highly irregular algorithm may not map well to a GPU.

## Questions to Ask Students

- What does one thread calculate in vector addition?
- Why do we need more than one thread block for a very large input?
- Which output values depend on each other?
- What would happen if every thread needed to update the same memory location?

## Avoiding Hardware Overload

For the free session, do not spend time on every CUDA core type, warp instruction, or cache level. Mention that production optimization may require studying those details, then return to the experiment.

## Further Reading

- [NVIDIA CUDA Programming Guide: Programming Model](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#programming-model)
- [NVIDIA CUDA C Best Practices: Performance Metrics](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/)
- [CUDA C Kernel Example](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#kernels)
