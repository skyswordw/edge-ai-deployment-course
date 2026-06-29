---
title: 端侧部署术语表
---

# 端侧部署术语表

本页只收录课程中反复出现、会影响实验判断的术语。更细的公式约定见 [公式与符号约定](/docs/math-conventions)。

| 术语 | 一句话解释 | 本课程在哪里用 |
| --- | --- | --- |
| TTFT | 从请求发出到第一个 token 返回的时间，也叫首 token 延迟 | 推理指标、API 服务、profiling |
| tokens/s | LLM decode 阶段每秒生成 token 数 | baseline、量化对比、加速实验 |
| latency | 单次请求耗时，必须说明测量边界 | 推理基础、服务化 |
| throughput | 单位时间处理量，传统模型常用 samples/s，LLM 常用 tokens/s | batch、serving、benchmark |
| P50 / P99 | 延迟分位数，P99 描述尾部慢请求 | 服务化体验和稳定性 |
| prefill | 处理 prompt 并写入 KV Cache 的阶段 | Transformer、TTFT、长上下文 |
| decode | 逐 token 生成的阶段 | tokens/s、roofline、KV Cache |
| KV Cache | 保存历史 token 的 key/value，避免重复计算 | 长上下文、显存、并发 |
| GGUF | llama.cpp/ggml 生态常用模型文件格式 | Qwen 本地部署 |
| Q4/Q5/Q8 | GGUF 量化格式名，不等价于普通全模型 INT4/INT5/INT8 | 量化对比 |
| GPU offload | 把部分或全部层放到 GPU 上执行 | llama.cpp 加速、Jetson |
| `ctx-size` | llama.cpp 上下文长度设置 | KV Cache、内存、TTFT |
| LoRA adapter | 微调时保存的低秩增量参数 | 微调、部署回归 |
| QLoRA | 低比特加载基座并训练 LoRA 的方法 | 小显存微调 |
| chat template | 把 system/user/assistant 消息转为模型训练格式的模板 | Qwen、微调、服务化 |
| calibration | 用代表性样本统计量化范围 | PTQ、activation 量化 |
| outlier | 数值分布中少数异常大值，会拉大量化范围 | SmoothQuant、AWQ、LLM.int8 |
| fallback | runtime 因不支持某算子或格式回退到 CPU 或慢路径 | profiling、排障 |
| thermal throttling | 设备过热后降频，导致持续性能下降 | Jetson、长稳测试 |
| OpenAI-compatible API | 兼容 `/v1/chat/completions` 等接口的本地服务形态 | local API、Agent 集成 |

## 容易混淆的词

| 容易混淆 | 正确区分 |
| --- | --- |
| 模型文件大小 vs 运行内存 | 运行时还有 KV Cache、activation、workspace、服务进程 |
| TTFT vs tokens/s | 前者看第一个 token，后者看稳定生成速度 |
| 低比特 vs 更快 | 低比特通常更小，是否更快取决于 kernel、带宽和 offload |
| GGUF vs 量化算法 | GGUF 是文件格式，Q4_K_M 等是具体块量化格式 |
| CLI 跑通 vs API 可用 | API 还要验证端口、JSON、超时、日志和资源占用 |
