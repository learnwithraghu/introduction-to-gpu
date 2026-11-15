# What Is a GPU?

## Start With Familiar Work

Imagine applying the same adjustment to every pixel in a photograph, scoring thousands of recommendations, or processing every frame in a video. The job is large, but each small item often needs a similar calculation.

A GPU is a processor designed to work on many similar items at the same time. It is not simply a faster CPU. It is a different kind of worker.

## Everyday Analogy: One Cook or an Assembly Line?

Imagine preparing one sandwich:

- One experienced cook can do the whole job efficiently.
- Sending twenty cooks into the kitchen may create coordination overhead.

Now imagine preparing 10,000 identical sandwiches:

- A production line can repeat simple steps in parallel.
- The work is divided into pieces that do not need much coordination.

The CPU is like a small number of versatile cooks. The GPU is like a large assembly line for repeatable work.

## The Simple Rule

> A GPU helps when the same job can be repeated across many independent items.

## Good Fits

- Image filters and resizing
- Video frames
- Recommendation scoring
- Matrix-heavy machine learning
- Large simulations

## Poor Fits

- One tiny calculation
- A program waiting for a user or network
- Work where every item needs a different decision
- A job that spends most of its time moving data

## Diagram: Similar Work in Parallel

```text
One item:       input -> operation -> output

Many items:     item 1 -> operation -> output 1
                item 2 -> operation -> output 2
                item 3 -> operation -> output 3
                item 4 -> operation -> output 4
```

## Questions to Ask Students

- Which parts of resizing an image repeat for every pixel?
- Would a GPU help a program waiting for one keystroke?
- Where in your work do many items need the same calculation?

## Instructor Note

Do not begin with hardware names. Begin with the job. Say:

> We are not choosing the fastest machine in general. We are choosing the right kind of worker for this workload.
