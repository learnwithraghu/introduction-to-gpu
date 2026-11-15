# Google Colab GPU Setup

## Learner Steps

1. Open the supplied notebook in Google Colab.
2. Select **Runtime**.
3. Select **Change runtime type**.
4. Choose **GPU** under Hardware accelerator.
5. Save and reconnect if Colab requests it.
6. Run the GPU check cell.

## What We Verify

The notebook checks:

- Whether CUDA is available.
- Which GPU is visible.
- Available GPU memory when provided.
- The PyTorch version.

The free tier is shared infrastructure. GPU type, availability, session duration, and memory vary. That is acceptable for learning; it is not a production promise.

## If Something Goes Wrong

- Recheck the runtime type.
- Restart or reconnect.
- Confirm the notebook is running in Colab.
- Use the CPU fallback while waiting for a GPU.

## Questions to Ask Students

- Does “available” mean hardware exists, or that our code is using it?
- What information should we record with a timing?
- Why might two learners see different numbers?
