# GPU Memory and Data Movement

## The Warehouse and the Factory

The CPU and GPU generally use separate memory spaces. Think of CPU memory as a warehouse and GPU memory as a fast factory floor across the road.

```text
warehouse (CPU memory) -> road -> factory floor (GPU memory)
factory result          -> road -> application
```

The factory may work very quickly, but a small delivery can still cost more time than the work itself.

## Workload Timing Model

```text
total time = input delivery + factory work + result delivery
```

For a tiny calculation, delivery and setup may dominate. For a large calculation, the factory can earn back the trip.

## Batching

Sending one small box at a time is inefficient. Sending a full truckload is more worthwhile.

```python
# Many small trips
for item in items:
    result = process(item.to("cuda"))

# Fewer larger trips
result = process(items.to("cuda"))
```

## Questions to Ask Students

- Is a benchmark fair if it excludes delivery time?
- When is kernel-only timing still useful?
- How does batching change the trip?
- What happens when the truck is larger than the factory floor?

## Instructor Note

Use both measurements when appropriate: kernel timing explains the operation; end-to-end timing explains the product.
