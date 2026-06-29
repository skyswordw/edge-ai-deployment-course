---
title: 课程导读
---

# 端侧模型量化部署技术专题

这本课程书面向需要把 AI 模型落到手机、PC、车载、IoT、工业终端、摄像头、机器人或本地服务器的技术团队。课程不把量化当成孤立算法，而是把模型能力、目标设备、runtime、低比特 kernel、上下文长度、功耗散热和产品体验放在同一个工程目标下分析。

本课程书按 40+ 学时正式课程设计，完整扩展版为 60 学时，可以裁剪为 40 学时基础版。内容保留原始八个专题的知识骨架，但会扩展成更细的在线 book：每章都包含图示、核心概念、代码或命令示例、配套实作、验收标准和参考资料。HTML 课件用于讲授演示，PPTX 输出留作后续交付。

课程书的写作粒度以“能自学、能跟做、能复盘”为标准：读者不仅要知道概念，还要知道从哪个目录执行命令、如何检查输出、失败时先看哪个日志，以及如何把结果写进最终部署评估报告。具体写作标准见 [自学与实作粒度标准](/docs/self-study-granularity)，每个 Part 的技术递进和工程实作边界见 [Part 技术递进与工程实作细纲](/docs/part-technical-outline)。

## 先从这里开始

第一次进入课程，先看 [Start Here：我该怎么学这门课](/docs/start-here)，再选择 2 小时、40 学时或 60 学时路径。

你只需要先记住一条主线：

```text
Qwen 小模型 -> GGUF -> llama.cpp -> Q8/Q5/Q4 -> profiling -> local API -> 部署报告
```

本课程不追求：

1. 覆盖所有量化论文。
2. 追求最高 benchmark 数字。
3. 把每个 runtime 都讲成 API 手册。
4. 用云端 serving 替代端侧部署问题。

本课程追求：

1. 在真实设备上做可复现实验。
2. 能解释速度、内存、质量、功耗之间的取舍。
3. 能把量化后的模型推进到 serving、benchmark 和 API 化。
4. 能写出可评审的部署建议。

硬件不必一步到位。没有 Jetson 可以走 40 学时主线；没有 NVIDIA GPU 可以完成 CPU baseline、API smoke test 和报告结构训练，但需要在报告中说明 GPU offload、显存和功耗实验未验证。详细路径见 [环境与版本矩阵](/docs/environment-matrix)。

## 学完后应能做到

- 用统一的部署判断框架拆解端侧项目，而不是只问“模型能不能量化”。
- 解释 PTQ、QAT、GPTQ、AWQ、SmoothQuant、LLM.int8()、KV Cache 量化等方法的适用边界。
- 判断何时需要模型微调；60 学时路径可跑通一个小规模 Qwen LoRA/QLoRA smoke test。
- 基于 Ubuntu Server、NVIDIA GPU 和 Qwen 小模型完成本地推理、量化对比、profiling 和 API 服务验证。
- 解释推理加速和量化压缩的关系，能够从图优化、kernel、内存、runtime 和硬件层定位性能瓶颈。
- 将 Ubuntu Server 实作迁移到 NVIDIA Jetson，记录功耗、温度和稳定性差异，并理解移动端 on-device 路线的取舍。
- 系统排查量化后的精度、延迟、内存和服务稳定性问题。
- 把量化与剪枝、蒸馏、runtime 选型、VLM/Agent 系统架构放到同一个产品落地流程里比较。

## 课程书怎么读

课程主线如下：

```mermaid
flowchart LR
  A[场景约束] --> B[模型 baseline]
  B --> C[量化压缩]
  C --> D{是否需要微调}
  D --> E[runtime 加速]
  E --> F[端侧实测]
  F --> G[API 服务]
  G --> H[部署报告]
```

建议按两条线阅读：

| 阅读线 | 适合对象 | 重点产出 |
| --- | --- | --- |
| 概念线 | 需要建立判断框架的工程负责人、算法工程师、产品技术负责人 | 端侧部署决策图、量化方法选择、风险清单 |
| 实作线 | 需要动手验证小模型部署的算法/推理工程师 | Ubuntu/Jetson 环境检查、微调必要性判断、Qwen GGUF 推理、量化对比、推理加速、profiling 表、API smoke test |

两条线要交叉推进：每学一个技术点，都要知道它如何影响实验设计、日志解释或最终报告结论；每做一个实验，也要能回到技术点解释为什么结果成立或不成立。

## 课程书结构

本书按“导读 + Part I-VII”组织。V1 版本先把结构和细纲固定下来，后续章节扩写按“先概念、再边界、再工程判断、最后实验落点”的顺序推进。

| 部分 | 作用 | 当前重点 |
| --- | --- | --- |
| 导读 | 课程定位、学时安排、资料取舍 | 明确课程边界 |
| Part I 前置知识与工具链 | 推理指标、Transformer/LLM、量化数学、Linux/GPU/Jetson 工具链 | 让学习者能读懂日志和实验 |
| Part II 端侧部署框架 | 场景、指标、硬件约束、端云协同 | 建立工程判断 |
| Part III 量化与压缩 | PTQ/QAT、LLM 量化、KV Cache、精度修复、蒸馏压缩 | 建立模型侧优化判断 |
| Part IV 模型微调与数据适配 | 是否微调、数据格式、chat template、LoRA/QLoRA、adapter、再量化 | 建立质量适配决策门；40 学时做判断，60 学时可跑 smoke test |
| Part V Runtime 与推理加速 | 图优化、kernel、TensorRT、llama.cpp、vLLM、profiling | 建立性能优化视角 |
| Part VI Ubuntu / Jetson / 移动端实作 | Qwen GGUF、量化对比、推理加速、API 服务、移动端路线图 | 把概念落到可运行命令 |
| Part VII VLM、Agent 与最终复盘 | 视觉、LLM、VLM、Agent、最终项目 | 输出部署评估报告 |

每个主线章节都按相同模板组织：学习目标、章节定位、问题背景、图示讲解、核心概念、工程判断、代码/命令示例、配套实作、验收结果、常见问题和参考资料。这样做的目的，是让课程书既适合系统阅读，也适合作为实作手册查阅。

## 实作环境基线

本书的实作默认使用 Ubuntu Server、NVIDIA GPU、CUDA、llama.cpp、Transformers/PEFT 和 Qwen 小模型，并新增 NVIDIA Jetson 路径。所有命令都以“可复现教学”为目标，避免假设某个固定设备性能。实验表格会保留空位，由学员在自己的机器上记录真实结果。

> 课程书里的命令片段是教学骨架。正式跑实验前，应先按本书实作章节确认驱动、CUDA、模型许可证、磁盘空间和网络访问条件。

## 输出形态

- **课程书**：主交付物，图文并茂，包含代码和实作任务。
- **HTML 课件**：使用 reveal.js 构建，服务于课堂投屏和在线演示。
- **PPTX**：后续可由课程书和 HTML 课件继续生成，不作为当前版本范围。

## 学习产出

课程最终不以“看完章节”为完成标准，而以能交付一份部署评估报告为标准。学习者需要把方法选择、实验命令、性能记录、失败日志和部署建议整理成可以评审的材料。建议从第一部分开始就维护自己的实验记录，按 [最终报告模板](/docs/report-template) 逐章填写，最后汇总到 [最终项目与验收标准](/docs/final-project)。

## 参考资料

- [前置知识学习路径](/docs/prerequisites)
- [Start Here：我该怎么学这门课](/docs/start-here)
- [环境与版本矩阵](/docs/environment-matrix)
- [端侧部署术语表](/docs/glossary)
- [公式与符号约定](/docs/math-conventions)
- [最终报告模板](/docs/report-template)
- [40/60 学时教学安排](/docs/course-hours)
- [Part 技术递进与工程实作细纲](/docs/part-technical-outline)
- [自学与实作粒度标准](/docs/self-study-granularity)
- [模型微调与 LoRA/QLoRA](/docs/finetuning-lora)
- [最终项目与验收标准](/docs/final-project)
- [完成版报告样例](/docs/example-final-report)
- [排障索引](/docs/troubleshooting-index)
- [资料对比与课程取舍](/docs/source-comparison)
- [参考资料地图](/docs/reference-map)
- [类似教材与教程参考](/docs/similar-courses)
- [Docusaurus Mermaid diagrams](https://docusaurus.io/docs/markdown-features/diagrams/)
- [Qwen llama.cpp 本地运行指南](https://qwen.readthedocs.io/en/v2.5/run_locally/llama.cpp.html)
- [llama.cpp 项目](https://github.com/ggml-org/llama.cpp)
