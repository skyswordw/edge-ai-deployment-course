---
title: 专题二 量化基础与 PTQ/QAT
---

# 专题二 量化基础与 PTQ/QAT

**时间：09:30-10:30**

## 授课目标

帮助学员掌握模型量化的基本概念、误差来源和常见工程流程，理解权重量化、激活量化、KV Cache 量化、weight-only quantization 和 weight-activation quantization 的差异。学员应能够根据项目阶段、数据条件、训练资源和精度要求判断优先采用 PTQ 还是 QAT。

## 核心内容

本专题通过讲解量化的基本原理，介绍如何用更低精度的数值表示模型权重、激活或推理缓存，从而降低存储、内存带宽和计算压力。课程将介绍 FP32、FP16、BF16、INT8、INT4、NF4 和 FP8 等常见数值格式，以及 per-tensor、per-channel、per-group、symmetric、asymmetric、static 和 dynamic quantization 等量化方式对精度与性能的影响。

本专题还将介绍 PTQ 和 QAT 两类基础量化路线。PTQ 通过训练后的校准和转换快速得到量化模型，适合快速验证和已有模型部署，但在低 bit、复杂任务和数据分布偏移时存在精度风险。QAT 在训练过程中模拟量化误差，让模型提前适应低精度表示，通常更稳，但需要训练数据、训练资源和更高的工程投入。
