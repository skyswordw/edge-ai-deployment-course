---
title: 推理加速基础
---

# 推理加速基础

## 建议学时

4 学时。

建议安排：

| 课时 | 内容 | 课堂产出 |
| --- | --- | --- |
| 1 | 推理加速分层框架 | 一张瓶颈定位图 |
| 2 | LLM 推理路径：prefill、decode、KV Cache | 一份指标解释表 |
| 3 | GPU offload、低比特 kernel、上下文长度实验设计 | 一组实验矩阵 |
| 4 | Ubuntu Server 与 Jetson 的日志解读 | 一份优化判断结论 |

本章对应实验章节：

- [推理加速实验](/docs/lab-inference-acceleration)
- [Profiling 与结果记录](/docs/lab-profiling)
- [Qwen GGUF 量化对比实验](/docs/lab-qwen-quantization)
- [Jetson 环境与 Qwen 迁移](/docs/lab-jetson-setup)

## 学习目标

完成本章后，学习者应能：

- 解释推理加速与模型压缩、量化之间的区别。
- 把一次 LLM 推理拆成模型加载、prefill、decode、KV Cache 读写和服务返回。
- 从算法、图优化、kernel、内存、runtime、硬件六层分析瓶颈。
- 判断“模型更小”为什么不必然等于“推理更快”。
- 设计 GPU offload、`ctx-size`、量化格式、线程参数和 `llama-bench` 的对比实验。
- 在 Ubuntu Server + NVIDIA GPU 与 Jetson 两类设备上记录可复查的性能数据。

## 问题背景

量化和压缩解决的是“模型是否更小、是否更容易放进设备”的问题，推理加速解决的是“模型是否能在目标设备上以可接受的延迟和吞吐运行”的问题。

两者有关联，但不能混为一谈。

例如，一个 Q4 GGUF 文件比 Q8 文件更小，但在某些设备上可能出现：

- 低比特 kernel 不匹配，运行时需要反量化到较高精度。
- GPU offload 不完整，部分层回落到 CPU。
- 上下文过长导致 KV Cache 占用过高。
- Jetson 功耗模式较低或散热不足，持续运行时降频。
- 服务化后 HTTP、队列、超时和并发带来额外延迟。

所以，本课程不把“模型文件大小”当作唯一优化目标，而是用实验记录回答三个问题：

1. 当前瓶颈在哪里？
2. 某个优化手段是否真的改善了瓶颈？
3. 改善之后有没有牺牲质量、稳定性或可维护性？

## 图示讲解

推理加速不是一个单点动作，而是一条需要反复验证的链路。

```mermaid
flowchart TD
  A[业务目标] --> B[模型与算法选择]
  B --> C[量化/剪枝/蒸馏]
  C --> D[图优化与格式转换]
  D --> E[Kernel 与算子实现]
  E --> F[内存与数据搬运]
  F --> G[Runtime 调度]
  G --> H[硬件功耗/温度/带宽]
  H --> I[Profiling 验证]
  I --> J{是否达标?}
  J -- 否 --> B
  J -- 是 --> K[服务化与应用集成]
```

LLM 推理可以拆成两个主要阶段。

```mermaid
sequenceDiagram
  participant U as 用户请求
  participant R as Runtime
  participant W as 模型权重
  participant K as KV Cache
  participant G as GPU/CPU
  U->>R: prompt
  R->>W: 加载或映射权重
  R->>G: prefill prompt tokens
  G->>K: 写入 KV Cache
  loop decode
    R->>G: 生成下一个 token
    G->>K: 读取历史 KV
    G->>K: 追加新 KV
  end
  R->>U: 返回文本或流式 token
```

这张图说明：首 token 延迟通常更受 prefill、模型加载、上下文长度影响；稳定 tokens/s 更受 decode、KV Cache 读取、kernel、内存带宽和 GPU offload 影响。

## 核心概念

### 推理加速六层框架

| 层级 | 典型手段 | 需要验证的问题 |
| --- | --- | --- |
| 模型与算法 | 小模型、蒸馏、剪枝、MoE 路由、speculative decoding | 质量是否下降，任务是否还可用 |
| 量化/压缩 | INT8、INT4、GGUF Q8/Q5/Q4、AWQ、GPTQ、SmoothQuant | kernel 是否支持，精度是否可接受 |
| 图优化 | constant folding、operator fusion、layout transform | 是否被 dynamic shape 或 unsupported op 破坏 |
| Kernel | GEMM、FlashAttention、低比特 kernel、Tensor Core | 目标硬件是否真正使用到加速实现 |
| 内存 | KV Cache 管理、减少 CPU/GPU 拷贝、pinned memory | 是否被内存带宽、碎片或 OOM 限制 |
| Runtime/硬件 | batching、GPU offload、线程、功耗模式、散热 | 延迟、吞吐、温度和稳定性是否达标 |

### Prefill 与 Decode

LLM 的一次生成通常分成：

| 阶段 | 输入 | 主要计算 | 常见指标 |
| --- | --- | --- | --- |
| Prefill | prompt 中已有 token | 一次性处理上下文 | prompt eval time、首 token 延迟 |
| Decode | 每次生成的新 token | 循环生成下一个 token | eval time、tokens/s |

当 prompt 很长时，prefill 会变重。

当生成很长时，decode 和 KV Cache 读写会成为主要成本。

### KV Cache

KV Cache 保存 attention 的历史 key/value，使模型不需要每生成一个 token 都重新计算全部历史。

它带来速度收益，也带来内存压力。

需要观察：

- `--ctx-size` 越大，预留或可使用的 KV Cache 空间越大。
- 多轮对话越长，实际 KV Cache 占用越高。
- Jetson 这类统一内存设备上，模型权重、KV Cache、系统进程会共同竞争内存。
- 当显存或统一内存不足时，速度下降、OOM、进程被杀都有可能发生。

### GPU Offload

在 llama.cpp 中，`-ngl` 常用于控制有多少层 offload 到 GPU。

教学实验中常用两端对比：

| 参数 | 含义 | 教学用途 |
| --- | --- | --- |
| `-ngl 0` | 尽量走 CPU 路径 | 建立 CPU baseline |
| `-ngl 99` | 尽量把层 offload 到 GPU | 验证 GPU 是否带来收益 |

不要只看命令是否加了 `-ngl`，还要看启动日志和监控工具。

在 Ubuntu Server 上看 `nvidia-smi`。

在 Jetson 上看 `tegrastats`。

### 低比特 Kernel

低比特模型有两种收益来源：

- 权重文件更小，加载和存储压力下降。
- 如果 runtime 有匹配 kernel，计算和内存带宽也可能改善。

但如果低比特格式需要在计算前反量化，或者目标 GPU 没有合适 kernel，就可能出现“更小但不更快”的情况。

### 服务化开销

CLI 推理达标，不代表服务 API 达标。

服务化后还会增加：

- HTTP 请求解析。
- JSON 序列化。
- 流式输出。
- 并发排队。
- 超时和错误处理。
- 客户端重试。

所以本课程把 [本地 OpenAI-compatible 服务](/docs/lab-local-service) 放在推理加速之后，而不是只停留在命令行输出。

## 代码/命令示例

以下命令用于教学演示。模型文件名按实际下载结果调整。

### 比较 GPU offload

```bash
cd ~/edge-ai-lab/src/llama.cpp

./build/bin/llama-cli \
  -m ~/edge-ai-lab/models/qwen/qwen2.5-1.5b-instruct-q4_k_m.gguf \
  -p "解释推理加速和量化的关系。" \
  -n 128 \
  --ctx-size 2048 \
  -ngl 0 \
  2>&1 | tee ~/edge-ai-lab/logs/ngl-0.txt

./build/bin/llama-cli \
  -m ~/edge-ai-lab/models/qwen/qwen2.5-1.5b-instruct-q4_k_m.gguf \
  -p "解释推理加速和量化的关系。" \
  -n 128 \
  --ctx-size 2048 \
  -ngl 99 \
  2>&1 | tee ~/edge-ai-lab/logs/ngl-99.txt
```

### 比较上下文长度

```bash
for ctx in 1024 2048 4096
do
  ./build/bin/llama-cli \
    -m ~/edge-ai-lab/models/qwen/qwen2.5-1.5b-instruct-q4_k_m.gguf \
    -p "用项目复盘方式解释 KV Cache 对端侧部署的影响。" \
    -n 128 \
    --ctx-size ${ctx} \
    -ngl 99 \
    2>&1 | tee ~/edge-ai-lab/logs/ctx-${ctx}.txt
done
```

### 使用 llama-bench

```bash
./build/bin/llama-bench \
  -m ~/edge-ai-lab/models/qwen/qwen2.5-1.5b-instruct-q4_k_m.gguf \
  -p 512 \
  -n 128 \
  -ngl 99 \
  2>&1 | tee ~/edge-ai-lab/logs/llama-bench-q4.txt
```

## 教学实验设计

本章不追求一次调到最快，而是训练实验设计能力。

建议实验矩阵：

| 实验 | 改变变量 | 固定变量 | 观察指标 |
| --- | --- | --- | --- |
| GPU offload | `-ngl 0`、`-ngl 99` | 模型、prompt、`ctx-size`、`-n` | 首 token、tokens/s、GPU 使用 |
| 上下文长度 | `--ctx-size 1024/2048/4096` | 模型、prompt、`-ngl`、`-n` | KV Cache、内存、首 token |
| 量化格式 | Q8、Q5、Q4 | 模型基座、prompt、`ctx-size` | 文件大小、质量、速度 |
| CPU 线程 | `-t` 不同值 | CPU 或混合路径 | CPU 利用率、tokens/s |
| 服务化 | CLI vs server | 模型、prompt、采样参数 | API 延迟、错误日志 |
| Jetson 功耗 | 不同功耗模式 | 模型、prompt、`ctx-size` | 温度、频率、稳定性 |

每次实验只改变一个主要变量。

## 结果记录模板

| 硬件 | 模型 | 变量 | 参数值 | 首 token | tokens/s | 峰值内存 | 温度/功耗 | 质量备注 | 日志 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ubuntu Server | 待填 | GPU offload | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |
| Ubuntu Server | 待填 | ctx-size | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |
| Jetson | 待填 | 功耗模式 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |

不要编造数字。

如果课堂设备无法完成某项实验，应写明原因，例如模型未下载、显存不足、驱动不可用或 Jetson 散热条件不足。

## 验收标准

本章验收不以“某个速度数值”为标准，而以记录完整性和解释能力为标准。

| 验收项 | 达标标准 |
| --- | --- |
| 实验矩阵 | 至少覆盖 GPU offload、`ctx-size`、量化格式三类变量 |
| 原始日志 | 每次实验有对应文本日志 |
| 监控证据 | Ubuntu 有 `nvidia-smi`，Jetson 有 `tegrastats` |
| 结论 | 能说明瓶颈更像计算、内存、runtime、服务化还是功耗 |
| 质量判断 | 记录输出是否跑题、重复、格式错误或事实错误 |

## 常见失败与排查

### Q4 更小但没有更快

检查：

- runtime 是否有对应量化格式的高效 kernel。
- GPU offload 是否真的生效。
- 是否因为上下文长度或 KV Cache 成为瓶颈。
- 是否 CPU fallback 抵消了量化收益。

### `-ngl 99` 后仍然没有 GPU 使用

检查：

- llama.cpp 是否用 CUDA 构建。
- 启动日志是否显示 CUDA 后端。
- `nvidia-smi` 是否看到进程。
- Jetson 上 `tegrastats` 是否看到 GPU/内存变化。

### 首 token 很慢但 tokens/s 可以接受

可能原因：

- prompt 太长。
- prefill 成本高。
- 模型首次加载或冷启动。
- 服务化路径有请求排队或 JSON 处理开销。

### 长上下文容易 OOM

可能原因：

- `ctx-size` 设置过高。
- 模型文件过大。
- KV Cache 与权重同时占用显存或统一内存。
- Jetson 上系统进程占用较多内存。

### Jetson 连续运行后速度下降

检查：

- `tegrastats` 中温度是否持续升高。
- 功耗模式是否限制频率。
- 电源适配器是否满足设备要求。
- 是否需要主动散热或降低模型尺寸。

## 作业

完成以下任务，并在实验报告中回答：

1. 在同一模型上比较 `-ngl 0` 与 `-ngl 99`。
2. 在同一模型上比较 `ctx-size` 1024、2048、4096。
3. 比较 Q8、Q5、Q4 中至少两个量化格式。
4. 选择一组结果，解释瓶颈最可能来自哪里。
5. 如果设备是 Jetson，补充功耗模式、温度和 `tegrastats` 日志。

## 参考资料

- [llama.cpp server documentation](https://www.mintlify.com/ggml-org/llama.cpp/inference/server)
- [llama.cpp llama-bench documentation](https://www.mintlify.com/ggml-org/llama.cpp/api/tools/llama-bench)
- [llama.cpp llama-bench README](https://github.com/ggml-org/llama.cpp/blob/master/tools/llama-bench/README.md)
- [TensorRT documentation](https://docs.nvidia.com/deeplearning/tensorrt/latest/)
- [TensorRT-LLM documentation](https://nvidia.github.io/TensorRT-LLM/)
- [vLLM documentation](https://docs.vllm.ai/)
- [MLPerf Inference](https://mlcommons.org/benchmarks/inference/)
