# From Free Session to Paid GPU Course

## The Learning Journey

The free session answers:

> Can this workload benefit from GPU acceleration?

The paid course answers:

> How do I package, deploy, operate, and control the cost of this GPU workload in the cloud?

## Suggested Paid-Course Modules

### Module 1: Turn Notebook Code into an Application

- Separate configuration from computation.
- Accept input paths and workload sizes as arguments.
- Return structured results and error messages.
- Add tests for CPU and GPU behavior.

### Module 2: Package the Workload

- Build a Docker image with PyTorch and CUDA compatibility.
- Use a CPU fallback for local testing.
- Keep images reproducible and reasonably small.

### Module 3: Store Data in S3

- Upload input data.
- Pass S3 paths to the job.
- Write output artifacts and metadata.

### Module 4: Run with AWS Batch

- Configure a compute environment with GPU-enabled instances.
- Define a job queue and job definition.
- Request the required number of GPUs.
- Submit and monitor jobs.

### Module 5: Trigger with Lambda

- Validate a request.
- Submit an AWS Batch job.
- Return a job identifier.
- Poll or notify when the job completes.

### Module 6: Operate Responsibly

- Log metrics and failures.
- Set timeouts and retry policies.
- Avoid leaving expensive GPU capacity idle.
- Measure end-to-end performance and cost.

## Closing Message for the Free Session

> You have now used a GPU interactively. The next challenge is to make the same computation repeatable, observable, and cost-conscious. That is what we build in the full course.
