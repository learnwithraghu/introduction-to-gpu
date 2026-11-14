# GPU Memory and Data Movement

## The Core Idea

The CPU and GPU generally use separate memory spaces. To compute on the GPU, data often needs to move from host memory to device memory.

```text
CPU                  PCIe or interconnect             GPU
+-----------+       --------------------       +-------------+
| RAM       |  ---> data transfer ----------> | GPU memory  |
| Python    |                                  | kernels     |
+-----------+       <--- results ------------- +-------------+
```

The transfer is not free. A GPU can perform arithmetic very quickly, but it may spend significant time waiting for data to arrive.

## Workload Timing Model

```text
Total time = input transfer + GPU computation + output transfer
```

If the computation is tiny, transfer and launch overhead can be larger than the calculation itself. If the computation is large, the arithmetic savings may dominate.

## A Warehouse Analogy

The GPU is a very fast factory floor. CPU memory is a warehouse across the road. Sending one small box across the road is inefficient. Sending a full truckload makes the trip worthwhile.

## Common Mistake

This pattern can be slow:

```python
for item in items:
    gpu_item = item.to("cuda")
    result = process(gpu_item)
```

When possible, batch data and transfer it fewer times:

```python
batch = items.to("cuda")
result = process(batch)
```

## Questions to Ask Students

- Is a GPU benchmark fair if we exclude the data-transfer time?
- When might excluding transfer time still be useful?
- Why does batching often help?
- What would happen if the dataset is larger than GPU memory?

## Instructor Note

Use the notebook's explicit transfer benchmark to show that “GPU time” and “end-to-end application time” are different measurements. This is an important bridge to production design.

## Further Reading

- [PyTorch CUDA Semantics](https://docs.pytorch.org/docs/stable/notes/cuda.html)
- [PyTorch Performance Tuning Guide](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html)
- [NVIDIA CUDA C Best Practices: Data Transfer Between Host and Device](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/)
