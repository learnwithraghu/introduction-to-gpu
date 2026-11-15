# Hands-On Lab Instructor Guide

The companion notebook is `introduction-to-gpu-colab.ipynb`.

## Before Running Code

Ask learners to predict the result before each benchmark. The discussion is more valuable than the exact number.

## Lab 1: Find the GPU

### Say

> Before hiring an accelerator, verify that the runtime actually has one. Never assume a menu selection means the program is using the device.

### Ask

- What GPU model do you see?
- Would every GPU produce the same timing?
- What would you record for a reproducible benchmark?

## Lab 2: Vector Addition

The notebook adds large vectors using NumPy, PyTorch CPU, and PyTorch GPU.

### Say

> Each output item is independent. This is our first example of giving one small job to many workers.

### Ask Before Running

- Which implementation do you expect to be fastest?
- Does the GPU receive the data first?
- Would a GPU transfer be worth it for only a few numbers?

### Explain Surprising Results

Vector addition performs little arithmetic per byte. It may be limited by memory movement and setup rather than raw compute capacity.

## Lab 3: Matrix Multiplication

Use this as a short contrast experiment. Matrix multiplication creates much more arithmetic work and gives the GPU more opportunity to stay busy.

### Ask

- What changes when the matrix is larger?
- Is the benchmark measuring only the factory work, or the whole delivery path?
- Why do we warm up before timing?

## Optional Follow-Up: Change the Experiment

Change the matrix dimension to 256, 512, 1024, and 2048, subject to available memory. Record the result and transfer time after the session.

## Safety and Cost Note

The free notebook uses Colab only. AWS is a conceptual preview. Do not ask learners to create paid AWS resources during the free session.
