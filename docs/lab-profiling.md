---
title: Profiling 与结果记录
---

# Profiling 与结果记录

## 建议学时

2 学时。

建议安排：

| 课时 | 内容 | 产出 |
| --- | --- | --- |
| 1 | 指标体系：质量、首 token、tokens/s、显存、功耗、稳定性 | profiling 记录模板 |
| 2 | 分析 Ubuntu Server 与 Jetson 的实验日志 | 优化建议和验收结论 |

本实验对应理论章节：

- [推理加速基础](/docs/inference-acceleration)
- [推理框架与部署链路](/docs/runtime-deployment)
- [Jetson 部署基础](/docs/jetson-deployment)

## 学习目标

完成本实验后，学习者应能：

- 把端侧部署结果拆成质量、速度、显存/内存、功耗/温度和稳定性。
- 区分首 token、prefill、decode 和稳定 tokens/s。
- 使用统一表格记录 Qwen GGUF、GPU offload、`ctx-size`、`llama-bench` 和服务化结果。
- 在 Ubuntu Server 上结合 `nvidia-smi` 记录 GPU 状态。
- 在 Jetson 上结合 `tegrastats` 记录内存、温度和功耗状态。
- 根据记录写出可执行的下一步优化建议。

## 问题背景

“跑起来了”不是验收标准。

端侧部署要证明模型在真实设备上稳定达到业务可用标准。

对小型 LLM 来说，至少要区分：

- 首 token 延迟：决定用户第一次等待感。
- tokens/s：决定生成是否流畅。
- KV Cache：决定长上下文和多轮对话能力。
- VRAM/RAM：决定能否常驻和是否会 OOM。
- 温度/功耗：决定 Jetson 等边缘设备能否持续运行。
- 输出质量：决定模型是否真正可用。
- 服务化稳定性：决定应用能否调用。

本章目标是建立结果记录方法，而不是制造好看的性能数字。

## 图示讲解

```mermaid
flowchart TD
  A[运行实验] --> B[保存原始日志]
  A --> C[同步监控资源]
  B --> D[提取速度指标]
  C --> E[提取内存/温度/功耗]
  B --> F[检查输出质量]
  D --> G[结果表]
  E --> G
  F --> G
  G --> H{是否达标?}
  H -- 否 --> I[定位瓶颈]
  I --> J[换模型/调参数/换 runtime]
  H -- 是 --> K[服务化验收]
```

指标之间的关系：

```mermaid
flowchart LR
  A[Prompt 长度] --> B[Prefill]
  B --> C[首 token]
  D[生成长度] --> E[Decode]
  E --> F[tokens/s]
  G[ctx-size] --> H[KV Cache]
  H --> I[显存/内存]
  J[功耗/温度] --> K[持续性能]
```

## 指标定义

| 指标 | 含义 | 记录建议 |
| --- | --- | --- |
| 首 token 延迟 | 从请求到第一个 token 的等待 | 单独记录，不和总耗时混用 |
| prompt eval / prefill | 处理 prompt 的阶段 | 对长上下文尤其重要 |
| eval / decode | 逐 token 生成阶段 | 关注 tokens/s |
| tokens/s | decode 阶段生成速度 | 尽量记录同一生成长度 |
| 峰值 VRAM | GPU 显存高点 | Ubuntu 用 `nvidia-smi` |
| RAM | 系统内存或统一内存占用 | Jetson 特别重要 |
| 温度 | 持续运行稳定性 | Jetson 用 `tegrastats` |
| 功耗模式 | 影响频率和性能 | Jetson 用 `nvpmodel` |
| 输出质量 | 是否满足任务 | 固定 prompt + 人工备注 |
| 失败日志 | fallback、OOM、格式错误 | 必须保存 |

## 实验设计

profiling 至少覆盖四组：

| 实验 | 固定变量 | 改变变量 | 观察重点 |
| --- | --- | --- | --- |
| 量化格式对比 | 模型基座、prompt、ctx、`-ngl` | Q8/Q5/Q4 | 文件、显存、速度、质量 |
| GPU offload 对比 | 模型、prompt、ctx、生成长度 | `-ngl 0/99` | GPU 是否带来收益 |
| 上下文长度对比 | 模型文件、prompt、`-ngl` | ctx 1024/2048/4096 | KV Cache 和首 token |
| 服务化 smoke test | 模型文件、ctx、采样参数 | CLI vs server | API 可用性和额外开销 |
| Jetson 对比 | 模型、prompt、ctx | Ubuntu Server vs Jetson | 速度、内存、温度、功耗 |

课堂中不追求严格统计显著性。

但要保证每次实验条件可解释，至少做到“一次只改一个主变量”。

## Step 1：建立结果文件

复制课程模板：

```bash
cp labs/templates/profiling-results.md ~/edge-ai-lab/results/profiling-results.md
```

如果模板不存在，也可以直接在实验报告中使用本页表格。

建议记录文件：

```bash
touch ~/edge-ai-lab/results/profiling-notes.md
```

## Step 2：保存运行日志

每次实验都用 `tee` 保存：

```bash
./build/bin/llama-cli \
  -m ~/edge-ai-lab/models/qwen/qwen2.5-1.5b-instruct-q4_k_m.gguf \
  -p "用三句话解释 profiling 对端侧部署的价值。" \
  -n 128 \
  --ctx-size 2048 \
  -ngl 99 \
  2>&1 | tee ~/edge-ai-lab/logs/profiling-sample.txt
```

日志命名建议：

| 实验 | 日志命名 |
| --- | --- |
| baseline | `qwen-baseline-q8.txt` |
| 量化对比 | `qwen2.5-...-q4_k_m.gguf.log` |
| GPU offload | `qwen-ngl-0.txt`、`qwen-ngl-99.txt` |
| ctx-size | `qwen-ctx-1024.txt` |
| llama-bench | `llama-bench-ngl-99.txt` |
| server | `llama-server.txt` |
| Jetson | `jetson-qwen-baseline.txt` |

## Step 3：Ubuntu Server 资源监控

运行前保存：

```bash
nvidia-smi > ~/edge-ai-lab/results/nvidia-smi-before.txt
```

运行中观察：

```bash
watch -n 0.5 nvidia-smi
```

运行后保存：

```bash
nvidia-smi > ~/edge-ai-lab/results/nvidia-smi-after.txt
```

如果希望自动记录一段时间，可以用：

```bash
nvidia-smi \
  --query-gpu=timestamp,name,utilization.gpu,memory.used,memory.total,temperature.gpu,power.draw \
  --format=csv \
  -l 1 \
  > ~/edge-ai-lab/logs/nvidia-smi-loop.csv
```

实验结束后用 `Ctrl+C` 停止。

如果某些 GPU 不支持 `power.draw` 字段，删除该字段再运行。

## Step 4：Jetson 资源监控

记录功耗模式：

```bash
sudo nvpmodel -q | tee ~/edge-ai-lab/results/jetson-nvpmodel.txt
```

记录时钟状态：

```bash
sudo jetson_clocks --show | tee ~/edge-ai-lab/results/jetson-clocks.txt
```

推理过程中记录：

```bash
tegrastats --interval 1000 | tee ~/edge-ai-lab/logs/tegrastats.txt
```

实验结束后用 `Ctrl+C` 停止。

分析时关注：

| 字段 | 解读 |
| --- | --- |
| RAM | 统一内存压力 |
| SWAP | 是否开始使用交换空间 |
| CPU | CPU 是否成为瓶颈 |
| GR3D/GPU | GPU 是否参与 |
| 温度 | 是否可能热降频 |
| 功耗 | 不同功耗模式下的差异 |

## Step 5：提取 llama.cpp 日志信息

不同版本的 llama.cpp 输出格式会变化。

原则是保存原始日志，然后按实际字段提取。

重点查找：

```bash
grep -i "eval" ~/edge-ai-lab/logs/qwen-baseline-q4.txt
grep -i "cuda" ~/edge-ai-lab/logs/qwen-baseline-q4.txt
grep -i "warning\\|fallback\\|error\\|oom" ~/edge-ai-lab/logs/qwen-baseline-q4.txt
```

如果 `grep` 没有结果，不代表实验失败。

说明该版本日志字段不同，人工查看即可。

## Step 6：结果总表

| 实验 | 硬件 | 模型 | 参数 | 首 token / prefill | tokens/s | 峰值内存/显存 | 温度/功耗 | 输出质量 | 是否达标 | 日志 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| baseline | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |
| Q8 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |
| Q5 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |
| Q4 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |
| `-ngl 0` | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |
| `-ngl 99` | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |
| `ctx 1024` | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |
| `ctx 4096` | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |
| server | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |

## Step 7：质量记录

建议固定一个主 prompt 和一个压力 prompt。

主 prompt：

```text
用三句话解释端侧模型量化的价值。
```

压力 prompt：

```text
请用项目复盘方式解释 KV Cache 对端侧部署的影响，并列出三个风险。
```

质量记录表：

| 模型/参数 | 是否回答问题 | 格式是否符合 | 是否重复 | 是否有明显错误 | 中文是否自然 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| 待填 | 待填 | 待填 | 待填 | 待填 | 待填 | 待填 |

## Step 8：失败日志分类

失败也要记录。

| 失败类型 | 可能原因 | 下一步 |
| --- | --- | --- |
| OOM | 模型过大、ctx 过高、KV Cache 过大 | 降低 ctx、换 Q4、换小模型 |
| CUDA 不可用 | 构建未启 CUDA、驱动问题 | 检查构建日志和 `nvidia-smi` |
| 输出质量差 | 量化过低、prompt 不合适、模型不匹配 | 换 Q5/Q8、固定 prompt |
| API 超时 | 模型加载慢、请求排队、上下文过长 | 预热、降 ctx、设置超时 |
| Jetson 降速 | 温度、功耗模式、电源 | 检查 `tegrastats`、散热和电源 |

## Step 9：写优化建议

优化建议要从证据出发。

建议格式：

```text
观察：
- ______

判断：
- 瓶颈更可能是 ______。

证据：
- 日志 ______ 显示 ______。
- 监控 ______ 显示 ______。

下一步：
- ______。
```

不要只写“继续优化”。

要写出具体动作。

## 验收结果

| 产物 | 验收标准 |
| --- | --- |
| profiling 表 | 至少包含 baseline、量化、GPU offload、ctx-size 中三类结果 |
| 原始日志 | 每行结果都能对应到日志文件 |
| 资源监控 | Ubuntu 有 `nvidia-smi`，Jetson 有 `tegrastats` |
| 质量记录 | 至少一个固定 prompt 的质量备注 |
| 失败记录 | 如果有失败，保留日志并分类 |
| 优化建议 | 能说明下一步动作和证据 |

## 常见问题

### 只跑一次就下结论

第一次运行可能受冷启动、缓存、温度或系统负载影响。

课堂实验可以只跑一次，但结论要写“初步观察”。

正式部署前应多次运行。

### 混用不同采样参数

采样参数变化会影响输出长度和质量。

如果改了 temperature、top-p 或生成长度，必须记录。

### 只保存截图

截图适合展示，但不适合搜索和复盘。

优先保存文本日志。

### 只看最快结果

部署更关心稳定性。

要保留失败、变慢和质量下降的记录。

## 作业

提交一份 profiling 报告，包含：

1. 设备环境摘要。
2. 结果总表。
3. 至少三份原始日志路径。
4. 一段质量记录。
5. 一段失败或风险分析。
6. 下一步优化建议。

## 参考资料

- [llama.cpp 项目](https://github.com/ggml-org/llama.cpp)
- [llama.cpp llama-bench documentation](https://www.mintlify.com/ggml-org/llama.cpp/api/tools/llama-bench)
- [NVIDIA Nsight Systems](https://developer.nvidia.com/nsight-systems)
- [MLPerf Inference](https://mlcommons.org/benchmarks/inference/)
- [NVIDIA CUDA Installation Guide for Linux](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)
- [NVIDIA Jetson documentation](https://docs.nvidia.com/jetson/)
