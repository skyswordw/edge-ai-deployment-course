---
title: 公式与符号约定
---

# 公式与符号约定

本课程统一采用下面的符号。后续章节如果没有特别说明，都按本页理解。

## 量化符号

本课程统一采用：

```text
scale = real_range / integer_range
```

不要把这里的 `scale` 理解成 inverse scale。

非对称线性量化：

$$
q = \mathrm{clamp}\left(\mathrm{round}\left(\frac{x}{s}\right) + z,\; q_{\min},\; q_{\max}\right)
$$

$$
\hat{x} = s(q - z)
$$

其中：

$$
s = \frac{x_{\max} - x_{\min}}{q_{\max} - q_{\min}}, \qquad z = \mathrm{round}\left(q_{\min} - \frac{x_{\min}}{s}\right)
$$

对称量化取 $z = 0$，常用：

$$
s = \frac{\max |x|}{2^{b-1} - 1}
$$

clipping 范围内，舍入误差上界是：

$$
|x - \hat{x}| \le \frac{s}{2}
$$

## P99 延迟

给定 $n$ 次请求延迟 $t_1,t_2,\ldots,t_n$，P99 表示 99% 请求不超过的延迟值：

$$
P_{99} = \inf \{t \mid F(t) \ge 0.99\}
$$

工程计算时：

```text
sorted_t = sort(t)
P99 = sorted_t[ceil(0.99 * n) - 1]
```

平均延迟看总体快不快，P99 看尾部慢请求会不会影响体验。端侧交互场景通常不能只报平均值。

## Throughput

传统模型吞吐：

$$
throughput = \frac{batch\_size}{batch\_elapsed\_time}
$$

LLM 生成吞吐：

$$
tokens/s = \frac{generated\_tokens}{decode\_elapsed\_time}
$$

LLM 中不要把 requests/s 和 tokens/s 混为一谈。一个请求生成 32 tokens 和 512 tokens，对服务压力不同。

## Roofline 与算术强度

算术强度：

$$
AI = \frac{FLOPs}{Bytes}
$$

Roofline 上限：

$$
Performance \le \min(PeakFLOPs,\ AI \times MemoryBandwidth)
$$

单位检查：

```text
AI 的单位是 FLOPs/Byte。
MemoryBandwidth 的单位是 Byte/s。
AI x MemoryBandwidth 的单位是 FLOPs/s。
```

LLM decode 常接近 memory-bound，因为每生成一个 token 都要重复读取大量权重和 KV Cache。

## KV Cache 粗估

KV Cache 占用和层数、KV head 数、head 维度、上下文长度、batch、并发和数据类型有关。

粗略写法：

$$
KVBytes \approx 2 \times layers \times kv\_heads \times head\_dim \times context \times batch \times bytes\_per\_value
$$

前面的 $2$ 来自 key 和 value 两份缓存。实际 runtime 可能有 padding、对齐和额外 workspace，最终以日志和 profiling 为准。
