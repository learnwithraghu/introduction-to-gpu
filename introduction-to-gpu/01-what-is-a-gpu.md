# What Is a GPU?

## The Short Explanation

A GPU, or Graphics Processing Unit, is a processor designed to perform many similar operations in parallel. Although GPUs were originally built for graphics, the same ability is useful for tensors, images, simulations, scientific computing, and machine learning.

The important phrase is **many similar operations**. A GPU is not simply a faster CPU. It is a different trade-off: more parallel throughput, less focus on making one general-purpose task finish as quickly as possible.

## Everyday Analogy: A Kitchen

Imagine preparing one sandwich:

- One experienced cook can do the whole job efficiently.
- Sending twenty cooks into the kitchen may create coordination overhead.

Now imagine preparing 10,000 identical sandwiches:

- A production line with many stations can prepare them in parallel.
- Each station can repeat a simple step.

The CPU is like a small number of versatile cooks. The GPU is like a large production line for repeatable work.

## What GPUs Commonly Accelerate

- Matrix multiplication
- Image resizing and filtering
- Neural-network training and inference
- Video encoding and decoding
- Physical simulations
- Large vector operations
- Some financial and scientific workloads

## What a GPU Does Not Automatically Improve

- A small calculation that finishes instantly on the CPU
- Work with many unpredictable branches
- Work that constantly waits for input or network responses
- A workload that spends most of its time copying data to the GPU
- Code that uses operations unavailable or inefficient on the GPU

## Diagram: Similar Work in Parallel

```text
CPU-style execution

Input -> operation 1 -> operation 2 -> operation 3 -> output


GPU-style execution

                 -> operation on item 1 ->
                 -> operation on item 2 ->
Input batch      -> operation on item 3 -> output batch
                 -> operation on item 4 ->
                 -> operation on item 5 ->
```

## Questions to Ask Students

- Which parts of resizing an image are repeated for every pixel?
- Would a GPU help a program that waits for a user to type one character?
- What is the difference between doing one task quickly and doing many tasks at once?
- Can you name a workload in your field where the same operation is repeated many times?

## Instructor Note

Avoid saying “GPU equals parallel CPU.” That is an incomplete model. Say instead:

> A GPU is specialized hardware optimized for high-throughput parallel workloads. It works best when we can express a large amount of regular work with relatively little coordination.

## Further Reading

- [NVIDIA: What Is a GPU?](https://www.nvidia.com/en-us/geforce/graphics-cards/)
- [Google Cloud: GPUs](https://cloud.google.com/gpu)
- [PyTorch: Why PyTorch](https://pytorch.org/)
