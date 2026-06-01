---
title: 专题三 大模型量化方法
---

# 专题三 大模型量化方法

**时间：10:45-12:00**

## 授课目标

帮助学员理解 LLM 和 VLM 为什么需要区别于传统 INT8 PTQ/QAT 的大模型量化方法，重点掌握 GPTQ、AWQ、SmoothQuant、LLM.int8() 和 KV Cache 量化的基本思想、适用场景和工程限制。学员应认识到大模型量化不是单纯降低 bit-width，而是模型结构、校准样本、敏感权重、激活分布、上下文长度和推理框架共同作用的结果。

## 核心内容

本专题通过讲解 LLM 和 VLM 的结构特点，介绍大模型量化与传统模型量化的差异。LLM 和 VLM 参数规模大，完整重新训练成本高，Transformer 结构中存在 outlier、层敏感和长上下文 KV Cache 增长问题，VLM 还涉及 vision encoder、projector 和多模态对齐链路，因此低比特量化需要同时考虑模型结构、数据分布和部署框架。

本专题将介绍 GPTQ、AWQ、SmoothQuant、LLM.int8() 和 KV Cache 量化等代表性方法。GPTQ 通过逐层量化和误差补偿降低权重量化损失，AWQ 通过激活分布识别关键权重并进行保护，SmoothQuant 关注激活异常值对 W8A8 量化的影响，KV Cache 量化则面向长上下文和多轮交互中的内存瓶颈。
