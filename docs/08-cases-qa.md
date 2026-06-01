---
title: 专题八 案例串联与 Q&A
---

# 专题八 案例串联与 Q&A

**时间：16:45-17:00**

## 授课目标

通过典型案例把全天内容串联起来，帮助学员把量化算法、精度修复、压缩蒸馏、推理框架选型和 VLM/Agent 部署形态整合为完整工程判断。学员应能够借助案例复盘端侧部署项目从目标定义、baseline 建立、量化压缩、框架适配、profiling 到上线验证的完整路径。

## 核心内容

本专题通过讲解传统视觉模型、小型 LLM、VLM 和 Hybrid Agent 四类案例，介绍不同模型形态在端侧部署中的典型优化路径。传统视觉模型案例关注 INT8 PTQ/QAT、结构化剪枝、TFLite/NCNN/MNN 和真实设备延迟，小型 LLM 案例关注 AWQ/GPTQ、INT4、group size、KV Cache、first token latency、tokens/s 和本地 runtime。

本专题还将通过 VLM 和 Hybrid Agent 案例介绍系统级部署思路。VLM 案例会拆解 vision encoder、projector 和 LLM 的不同瓶颈，说明图像分辨率、视觉 token、OCR 和多模态对齐为什么需要单独评估。Hybrid Agent 案例会讨论本地小模型、云端大模型、工具权限、任务 routing、状态管理和失败恢复，帮助学员把单模型优化扩展到产品级系统设计。
