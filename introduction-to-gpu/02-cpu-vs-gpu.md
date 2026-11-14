# CPU Versus GPU

## Two Different Design Goals

CPUs and GPUs can both execute programs, but they optimize for different goals.

| CPU | GPU |
| --- | --- |
| A small number of powerful, flexible cores | A large number of simpler parallel processors |
| Good at sequential and irregular logic | Good at regular, repeated operations |
| Strong branch prediction and large caches | High arithmetic throughput and memory bandwidth |
| Low latency for individual tasks | High throughput for large batches |
| Runs the operating system and general application logic | Often acts as an accelerator for selected operations |

## Latency and Throughput

**Latency** is how long one operation takes. **Throughput** is how much work can be completed over a period of time.

For a single small calculation, a CPU may win because launching GPU work and transferring data have overhead. For a large matrix multiplication, the GPU can process many independent arithmetic operations concurrently.

## Example: Adding Two Vectors

Given two arrays:

```text
a = [a0, a1, a2, a3]
b = [b0, b1, b2, b3]
```

The output is:

```text
c = [a0+b0, a1+b1, a2+b2, a3+b3]
```

Each output element is independent. That makes the operation a good teaching example for parallelism.

```text
CPU: c0, then c1, then c2, then c3

GPU: c0, c1, c2, and c3 can be assigned to different threads
```

## Example: Matrix Multiplication

Each output value in a matrix product is a dot product. A large output matrix contains many dot products that can be computed concurrently. This regular structure is one reason machine-learning workloads benefit from GPUs.

## Questions to Ask Students

- Are all tasks parallel just because there are many of them?
- What happens if task 2 depends on the result of task 1?
- Why might a GPU lose on a tiny vector addition?
- Why should we benchmark instead of assuming the GPU is faster?

## Classroom Demonstration

Ask learners to predict the result of this table before running the notebook:

| Workload | Expected winner |
| --- | --- |
| Add 10 numbers | CPU |
| Add 10 million numbers | GPU may win |
| Wait for a web request | Neither helps much |
| Multiply large matrices | GPU often wins |
| Complex branching per item | Depends on the workload |

## Further Reading

- [NVIDIA CUDA C Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)
- [NVIDIA: CUDA Best Practices Guide](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/)
- [PyTorch CUDA Semantics](https://docs.pytorch.org/docs/stable/notes/cuda.html)
