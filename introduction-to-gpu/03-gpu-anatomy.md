# Optional Appendix: A Beginner's GPU Anatomy

This material is an appendix, not a prerequisite for the one-hour story. The goal is to understand that a large computation is divided into manageable pieces, not to memorize hardware names.

## The Simplified Map

```text
GPU device
  -> groups of workers
      -> blocks of related work
          -> one thread handles one small item
```

A thread performs one small piece of work. A block is a cooperating group of threads. The GPU schedules those groups across its processing units.

## Vector Addition as Assignment

```text
element:  0       1       2       3       4
worker:   T0      T1      T2      T3      T4
work:     a0+b0   a1+b1   a2+b2   a3+b3   a4+b4
```

Frameworks such as PyTorch hide most thread-management details. Learners only need to see why independent outputs can run together.

## Optional Questions

- What does one worker calculate?
- Which output values depend on each other?
- What happens if every worker updates the same location?

## Scope Note

Skip detailed discussion of warps, cache levels, and vendor-specific core types during the free session.
