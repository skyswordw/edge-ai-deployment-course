---
title: 专题七 VLM 与 Agent 端侧形态
---

# 专题七 VLM 与 Agent 端侧形态

**时间：16:10-16:45**

## 授课目标

帮助学员理解 VLM 与 Agent 的端侧部署已经从单模型优化扩展到系统架构优化。学员应能够区分 VLM 的感知理解链路和 Agent 的规划执行链路，识别二者在端侧场景中的不同瓶颈，并理解全端侧、全云端和端云协同的适用条件。

## 核心内容

本专题通过讲解 VLM 的端侧部署链路，介绍图像预处理、vision encoder、projector、LLM、tokenizer、多轮上下文和输出后处理之间的关系。课程将说明 VLM 的瓶颈不只在 LLM，图像分辨率、视觉 token 数、projector 多模态对齐、KV Cache，以及 OCR、小目标和空间关系等任务敏感性都会影响最终效果。

本专题还将介绍 Agent 在端侧部署中的系统组成和主要风险。Agent 更关注 planner、tool registry、executor、memory、permission manager、safety policy 和交互循环，其关键问题不只是模型大小，还包括工具链稳定性、权限边界、状态维护、本地上下文和失败恢复。课程将进一步介绍端云协同形态，说明如何让简单和隐私任务在端侧完成，让复杂 reasoning 和兜底能力交给云端。
