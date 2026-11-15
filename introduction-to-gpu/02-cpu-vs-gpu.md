# CPU Versus GPU

## Two Kinds of Workers

| Generalist worker | Assembly line |
| --- | --- |
| Flexible and good at decisions | Excellent at repeating a regular step |
| Good for one small task | Good for many similar tasks |
| Low waiting time for one job | High volume over many jobs |
| Handles irregular logic well | Needs work that can be divided |

The generalist worker is the CPU. The assembly line is the GPU. Both can do useful work; the workload decides which fits.

## Latency and Throughput

Latency asks: “How quickly can one job finish?”

Throughput asks: “How many jobs can finish in a period of time?”

One web request may care about latency. Processing ten million images may care more about throughput.

## Prediction Activity

Ask learners to choose before running the notebook:

| Workload | Likely fit |
| --- | --- |
| Add 10 numbers | CPU/generalist |
| Add 10 million numbers | GPU may help |
| Wait for a web request | Neither solves the wait |
| Multiply large matrices | GPU often helps |
| Make a different decision for every item | It depends |

## Vector Addition

```text
a = [a0, a1, a2, a3]
b = [b0, b1, b2, b3]
c = [a0+b0, a1+b1, a2+b2, a3+b3]
```

Each output element is independent. That makes it a friendly first example of parallel work.

## Questions to Ask Students

- Why might a GPU lose on a tiny vector?
- What happens when task 2 depends on task 1?
- Why should we measure instead of assuming?
