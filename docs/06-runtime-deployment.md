---
title: 专题六 推理框架与部署链路
---

# 专题六 推理框架与部署链路

**时间：15:25-16:10**

## 授课目标

帮助学员理解模型从训练环境走向端侧设备的完整部署链路，掌握推理框架选型的核心维度。学员应认识到量化能否真正带来速度和内存收益，最终取决于目标设备、runtime、算子覆盖、低比特 kernel、fallback 行为和 profiling 结果。

## 核心内容

本专题通过讲解模型部署的完整链路，介绍模型导出、图优化、算子融合、layout 转换、量化转换、runtime 加载、kernel 选择和目标设备 profiling 等关键步骤。课程将介绍 ONNX Runtime、TensorRT、TFLite、NCNN、MNN、Core ML、llama.cpp、ExecuTorch 和厂商 NPU SDK 等常见推理框架，并说明它们各自适合的平台、模型类型和硬件环境。

本专题还将介绍端侧部署中最常见的性能陷阱。模型转换成功不代表性能达标，unsupported op 可能触发 CPU fallback，量化算子不支持可能导致反量化后再计算，dynamic shape 可能影响图优化，单个 fallback 就可能抵消整体量化收益。因此课程会强调 profiling 必须覆盖端到端延迟、首 token 延迟、tokens/s、per-layer latency、峰值内存、功耗、发热和 fallback log。
