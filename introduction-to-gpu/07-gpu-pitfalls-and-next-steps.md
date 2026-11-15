# GPU Pitfalls and Next Steps

## Three Honest Lessons

### 1. Measure the Real Workload

Include the costs that matter to the application: data transfer, preprocessing, postprocessing, and result movement. A GPU is not automatically faster.

### 2. Give the GPU Enough Work

Tiny batches may not keep the factory busy. Batch when possible, but stay within available memory.

### 3. Colab Is a Learning Lab

Colab is excellent for experimentation. It is not a durable scheduler, deployment platform, or data store.

## Production Preview

```text
experiment -> application -> Docker -> AWS Batch GPU job
                                      -> S3 results
                                      ^
                             Lambda submits and monitors
```

Lambda coordinates the job. The GPU computation runs in AWS Batch on GPU-enabled compute resources.

## Questions to Ask Students

- Which part of today's notebook would change in production?
- Where would input data live?
- How would a user start the job?
- What happens if the job fails?
- How would we control cost?
