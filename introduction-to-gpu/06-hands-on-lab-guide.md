# Hands-On Lab Instructor Guide

The companion notebook is `introduction-to-gpu-colab.ipynb`.

## Before Running Code

Ask learners to predict the result before each benchmark. The discussion is more valuable than the exact number.

## Lab 1: Find the GPU

### Say

> Before using an accelerator, we verify that the runtime actually has one. Never assume that selecting a menu option means the program is using the device.

### Ask

- What GPU model do you see?
- Would all GPUs produce the same timing?
- What information would you record for a reproducible benchmark?

## Lab 2: Vector Addition

The notebook adds large vectors using NumPy, PyTorch CPU, and PyTorch GPU.

### Say

> Each output element can be computed independently. This is a simple example of data parallelism.

### Ask Before Running

- Which implementation do you expect to be fastest?
- Does the GPU have to receive the data first?
- Will adding only a few numbers justify a GPU transfer?

### Explain Surprising Results

Vector addition performs little arithmetic per byte of data. It may be limited by memory bandwidth and overhead rather than raw compute capacity.

## Lab 3: Matrix Multiplication

### Say

> Matrix multiplication creates much more arithmetic work for the same general shape of data. This gives the GPU more opportunity to keep its parallel processors busy.

### Ask

- What changes when the matrix is larger?
- Is the benchmark measuring only the kernel, or the whole application path?
- Why should we warm up the GPU before timing?

## Lab 4: Transfer Overhead

The notebook measures copying a tensor to the GPU separately from the matrix operation.

### Ask

- If a real application copies data once and performs 100 operations, is the transfer cost still important?
- If it copies every small item separately, what design change might help?

## Lab 5: Change the Experiment

Ask learners to change the matrix dimension. Suggested values are 256, 512, 1024, and 2048, subject to available memory.

Learners should record:

| Matrix size | NumPy CPU | PyTorch CPU | PyTorch GPU | Transfer time |
| --- | ---: | ---: | ---: | ---: |
| 256 | | | | |
| 512 | | | | |
| 1024 | | | | |

## Safety and Cost Note

The free notebook uses Colab only. The AWS architecture is a conceptual preview. Do not ask learners to create paid AWS resources during the free session.
