# Google Colab GPU Setup

## Learner Steps

1. Open the supplied notebook in Google Colab.
2. Select **Runtime**.
3. Select **Change runtime type**.
4. Choose **GPU** under Hardware accelerator.
5. Save and reconnect if Colab requests it.
6. Run the GPU check cell.

The free tier is shared infrastructure. GPU type, availability, session duration, and memory can vary. Learners should not treat a Colab runtime as permanent storage or a production environment.

## Verification Cell

The notebook checks:

- Whether CUDA is available.
- The visible GPU name.
- GPU memory information when available.
- The PyTorch version.

## Troubleshooting

### CUDA is unavailable

- Recheck the runtime type.
- Restart or reconnect the runtime.
- Confirm that the notebook is running in Colab rather than a local viewer.
- Use the CPU fallback cells while waiting for a GPU.

### The GPU seems slower

- Check tensor size.
- Check whether transfer time is included.
- Confirm that the benchmark synchronizes GPU operations.
- Run several repetitions rather than trusting one measurement.

### The session disconnects

Colab sessions are temporary and subject to resource limits. Save important code outside the runtime and avoid relying on the notebook filesystem for long-term storage.

## Questions to Ask Students

- What does “available” mean: hardware exists, or our code is using it?
- What information should we record when reporting a benchmark?
- Why might two learners see different times?

## Official References

- [Google Colab FAQ](https://research.google.com/colaboratory/faq.html)
- [Google Colab Welcome Notebook](https://colab.research.google.com/notebooks/intro.ipynb)
- [PyTorch Get Started](https://pytorch.org/get-started/locally/)
