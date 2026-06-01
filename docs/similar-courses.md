---
title: 类似教材与教程参考
---

# 类似教材与教程参考

## 学习目标

- 收集可参考的公开课程、在线教材和体系化教程。
- 明确每份资料适合借鉴什么，而不是简单照搬目录。
- 为后续扩写课程书提供更大的内容池。

## 选材原则

本页优先收录英文公开资料，因为端侧推理、量化、LLM serving 和 ML systems 的一手资料大多来自英文课程、论文和官方教程。中文资料可作为实作补充，但不作为唯一依据。

筛选时看三个标准：

- 是否体系化：课程、book、notebook series 或官方 tutorial 优先。
- 是否接近本课程主题：量化、模型压缩、边缘部署、推理系统、LLM serving 优先。
- 是否能落到实作：有代码、notebook、实验或部署流程更有价值。

## 主参考资料

| 资料 | 类型 | 适合借鉴 |
| --- | --- | --- |
| [MIT 6.5940 TinyML and Efficient Deep Learning Computing](https://hanlab.mit.edu/courses/2024-fall-65940) | 课程 | 高效深度学习、剪枝、量化、TinyML、硬件感知优化的课程结构 |
| [EfficientML.ai](https://efficientml.ai/) | 课程/资料站 | 模型压缩、神经网络部署、TinyML 与系统优化的整体框架 |
| [The Machine Learning Systems Book](https://www.mlsysbook.ai/) | 在线教材 | ML 系统、部署、可靠性、性能评估和生产化视角 |
| [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1) | 在线课程 | Transformer、tokenizer、生成模型和生态基础 |
| [Full Stack Deep Learning](https://fullstackdeeplearning.com/) | 课程 | 从模型到产品和工程系统的完整视角 |

## 量化与压缩教程

| 资料 | 类型 | 适合借鉴 |
| --- | --- | --- |
| [PyTorch Quantization](https://pytorch.org/docs/stable/quantization.html) | 官方教程 | PTQ/QAT、量化 API 和 PyTorch 术语体系 |
| [torchao](https://docs.pytorch.org/ao/stable/) | 官方文档 | PyTorch 新低比特/量化生态 |
| [ONNX Runtime Quantization](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html) | 官方教程 | 静态/动态量化、校准、ONNX 部署链路 |
| [TensorFlow Lite Model Optimization](https://www.tensorflow.org/model_optimization) | 官方教程 | 移动端模型优化、TFLite PTQ/QAT |
| [OpenVINO NNCF](https://docs.openvino.ai/2024/openvino-workflow/model-optimization-guide/quantizing-models-post-training.html) | 官方教程 | PTQ、NNCF、Intel/OpenVINO 部署路径 |
| [Intel Neural Compressor](https://github.com/intel/neural-compressor) | 工具/教程 | 跨框架量化和压缩实践 |

## LLM 部署与服务化教程

| 资料 | 类型 | 适合借鉴 |
| --- | --- | --- |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | 项目文档 | GGUF、本地 LLM、量化模型、server 和 benchmark |
| [Qwen llama.cpp 本地运行](https://qwen.readthedocs.io/en/v2.5/run_locally/llama.cpp.html) | 官方教程 | Qwen 小模型本地部署实作 |
| [Qwen llama.cpp 量化](https://qwen.readthedocs.io/en/v2.5/quantization/llama.cpp.html) | 官方教程 | Qwen GGUF 量化实作路线 |
| [vLLM Documentation](https://docs.vllm.ai/) | 官方文档 | LLM serving、PagedAttention、KV Cache 管理 |
| [TensorRT-LLM](https://nvidia.github.io/TensorRT-LLM/) | 官方文档 | NVIDIA GPU 上的 LLM 推理优化 |
| [MLC LLM](https://llm.mlc.ai/docs/) | 官方教程 | 跨平台 LLM 编译、部署和移动端方向 |

## 边缘/端侧部署教程

| 资料 | 类型 | 适合借鉴 |
| --- | --- | --- |
| [ExecuTorch](https://pytorch.org/executorch/stable/) | 官方文档 | PyTorch 端侧部署路线 |
| [TensorFlow Lite](https://www.tensorflow.org/lite) | 官方教程 | 移动端和嵌入式部署 |
| [Core ML Tools optimization](https://apple.github.io/coremltools/docs-guides/source/opt-overview.html) | 官方文档 | Apple 设备模型优化 |
| [ONNX Runtime Mobile](https://onnxruntime.ai/docs/tutorials/mobile/) | 官方教程 | 移动端 ONNX Runtime 部署 |
| [NVIDIA TensorRT](https://docs.nvidia.com/deeplearning/tensorrt/latest/) | 官方文档 | NVIDIA GPU 推理优化 |

## Profiling 与 Benchmark 参考

| 资料 | 类型 | 适合借鉴 |
| --- | --- | --- |
| [MLPerf Inference](https://mlcommons.org/benchmarks/inference/) | Benchmark | 标准化推理评估的指标和报告方式 |
| [NVIDIA Nsight Systems](https://developer.nvidia.com/nsight-systems) | 工具文档 | GPU/CPU 系统级 profiling |
| [llama.cpp llama-bench](https://github.com/ggml-org/llama.cpp/tree/master/tools/llama-bench) | 工具文档 | LLM 本地 benchmark 记录 |
| [ONNX Runtime performance](https://onnxruntime.ai/docs/performance/) | 官方文档 | runtime 性能优化和 profiling 思路 |

## 本课程如何吸收这些资料

| 本课程章节 | 建议吸收来源 | 扩写方向 |
| --- | --- | --- |
| 前置知识 | Hugging Face LLM Course、ML Systems Book | 增加 tokenizer、生成、系统指标和部署可靠性基础 |
| 量化基础 | PyTorch、ONNX Runtime、TFLite、OpenVINO NNCF | 扩写 PTQ/QAT 流程、校准数据、误差分析 |
| 大模型量化 | Qwen、llama.cpp、vLLM、TensorRT-LLM | 扩写 GGUF、KV Cache、服务化推理和低比特格式 |
| 推理框架 | ExecuTorch、TFLite、ONNX Runtime、TensorRT、MLC LLM | 增加框架选型矩阵和设备适配路线 |
| Profiling | MLPerf、Nsight Systems、llama-bench | 增加指标定义、实验设计和报告模板 |

## 使用边界

- 不直接复制任何课程内容或图表，只吸收结构、概念组织和实验设计思路。
- 论文和官方文档用于定义概念，课程本身仍围绕 Ubuntu/Qwen 实作展开。
- 如果后续需要完整教材式正文，每章应从本页选 3 到 6 个核心来源深入消化，再写成本课程自己的讲义。
