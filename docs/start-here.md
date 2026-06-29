---
title: Start Here：我该怎么学这门课
---

# Start Here：我该怎么学这门课

这门课只有一条主线：

```text
Qwen 小模型 -> GGUF -> llama.cpp -> Q8/Q5/Q4 -> profiling -> local API -> 部署报告
```

第一次看到这些词时，不需要先查完全部资料：

| 词 | 先这样理解 |
| --- | --- |
| Qwen 小模型 | 课程统一使用的开源 LLM 代表，用来减少模型变量。 |
| GGUF | llama.cpp 常用的本地模型文件格式，文件名里会带具体量化格式。 |
| llama.cpp | 本课程主线 runtime，用 CLI、benchmark 和 server 贯穿实验。 |
| Q8/Q5/Q4 | 三组低比特权重版本，用来比较文件大小、速度、内存和质量。 |
| profiling | 记录首 token、tokens/s、内存、温度、功耗和失败日志。 |

如果第一次打开课程，不要先读完整目录。先选一条路径，再按对应产出推进。

## 交付资料速查

| 你要做什么 | 先看 |
| --- | --- |
| 开始写最终报告 | [最终报告模板](/docs/report-template) |
| 看一份完成版格式 | [完成版报告样例](/docs/example-final-report) |
| 不知道日志字段填哪 | [样例日志与结果表](/docs/sample-logs) |
| 命令失败或结果异常 | [排障索引](/docs/troubleshooting-index) |
| 确认最终验收标准 | [最终项目与验收标准](/docs/final-project) |
| 教师或助教批改 | [教师使用指南](/docs/instructor-guide) |

## 适合谁

| 学员类型 | 建议路径 | 重点 |
| --- | --- | --- |
| 想快速判断课程是否能跑 | 2 小时路径 | 跑通 baseline，看到日志 |
| 正常课程或培训学员 | 40 学时路径 | 完成量化对比、profiling、API 和报告 |
| 研究生专题或项目制训练 | 60 学时路径 | 增加微调、Jetson、vLLM/移动端和系统复盘 |

## 需要什么基础

最低要求：

- 会在 Linux/macOS 终端执行命令。
- 能读懂 Python 基础脚本。
- 知道 LLM 是按 token 生成文本。
- 愿意保存日志和表格，而不是只看一次输出。

不要求：

- 从零训练 LLM。
- 手写 CUDA kernel。
- 完整推导 Transformer。
- 精通所有 runtime。

## 需要什么硬件

| 环境 | 能学到什么 | 限制 |
| --- | --- | --- |
| Ubuntu Server + NVIDIA GPU | 主线环境，适合完成 baseline、量化、profiling、API | 不能代表 Jetson 的功耗和温度 |
| NVIDIA Jetson | 适合观察共享内存、功耗、温度和长期稳定性 | 编译和依赖更敏感 |
| CPU-only | 可练习模型加载、CPU baseline、API 和报告结构 | 不能完整体验 GPU offload |
| Mac | 可作为补充路线，验证本地小模型体验 | 本课程主线不按 Mac 调优 |

没有 Jetson 可以学。40 学时路径可以只用 Ubuntu Server + NVIDIA GPU 或云 GPU。没有 NVIDIA GPU 也可以完成部分 CPU baseline 和报告结构训练，但需要在报告中说明限制。

## 三条学习路径

### A. 2 小时快速路径

目标：确认课程主线能跑通一次。

1. 阅读 [课程导读](/docs/intro) 和本页。
2. 完成 [Ubuntu Server 与 NVIDIA GPU 环境](/docs/lab-ubuntu-nvidia) 的环境快照。
3. 完成 [Qwen 基线推理](/docs/lab-qwen-baseline)。
4. 保存 baseline log。
5. 把环境和 baseline 填入 [最终报告模板](/docs/report-template) 的第 1-3 节。

最低产出：

```text
results/prereq-env.txt
logs/qwen-baseline-*.txt
report/final_report.md 的前 3 节草稿
```

### B. 40 学时基础路径

目标：完成端侧 Qwen 小模型部署评估报告。

1. Part I：推理指标、LLM 流程、量化数学和 Linux/GPU 工具链。
2. Part II：明确目标场景、设备约束和验收指标。
3. Part III：完成 Q8/Q5/Q4 或同类量化对比。
4. Part V/VI：完成 GPU offload、ctx-size、threads、llama-bench 和 profiling。
5. Part VI：启动本地 OpenAI-compatible API，并做 smoke test。
6. Part VII：整理最终报告。

必须产出：

```text
环境记录
baseline log
quant comparison table
profiling table
local API smoke test
final deployment report
```

### C. 60 学时完整路径

目标：在 40 学时主线基础上加入更多工程取舍。

新增内容：

- LoRA/QLoRA smoke test 和 adapter 去留判断。
- Jetson 迁移、功耗、温度和稳定性对比。
- vLLM serving、MLC LLM、LiteRT/Android 路线阅读或选做。
- VLM/Agent 系统设计和端云协同复盘。

这些内容是扩展，不改变主线报告。报告仍然要回答：在指定设备上，哪个模型、哪个量化版本、哪个 runtime 参数最值得采用，为什么。

## 第一次学习该做什么

如果是零基础，先走这条最小补课路径，不需要一次读完 Part I：

1. 在 [机器学习推理基础](/docs/ml-inference-basics) 里先看 latency、throughput、TTFT、tokens/s。
2. 在 [Transformer 与 LLM 基础](/docs/transformer-llm-basics) 里先看 token、prefill、decode、KV Cache。
3. 在 [量化数学基础](/docs/quantization-math-basics) 里先看 scale、zero-point、对称 INT8 示例和 Q4 为什么更难。
4. 看不懂的公式先标记，跑 baseline 后再回来补。

首次学习可以先跳过 [资料对比与课程取舍](/docs/source-comparison) 和 [参考资料地图](/docs/reference-map)。它们更适合教师备课、写报告引用资料或做扩展阅读时再看。

第一次打开课程，请按顺序完成：

1. 阅读本页。
2. 阅读 [环境与版本矩阵](/docs/environment-matrix)，确认自己的设备属于哪条路径。
3. 建立实验目录：

```bash
mkdir -p ~/edge-ai-lab/{env,models,repos,scripts,logs,results,report}
```

4. 保存一次环境快照。
5. 阅读 [Qwen 基线推理](/docs/lab-qwen-baseline)，准备第一次 baseline。
6. 打开 [最终报告模板](/docs/report-template)，先填项目背景和环境。

## 最终会产出什么

最终产出不是“跑通一次模型”，而是一份可评审的端侧部署评估报告。它需要说明：

- 目标设备和约束是什么。
- 为什么选择这个 Qwen 小模型和量化版本。
- 量化后如何 serving、benchmark 和 API 化。
- 哪些结果来自真实日志。
- 哪些方案不推荐，以及原因。
- 下一轮优化应该做什么。
