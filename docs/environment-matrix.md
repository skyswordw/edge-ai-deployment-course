---
title: 环境与版本矩阵
---

# 环境与版本矩阵

本页用于回答“我的机器能不能学这门课”。课程主线不绑定某一块固定硬件，但每次实验都必须记录实际版本。

## 路径选择

| 路径 | 推荐用途 | 必做实验 | 可选实验 |
| --- | --- | --- | --- |
| Ubuntu Server + NVIDIA GPU | 40 学时主线 | 环境检查、Qwen baseline、Q8/Q5/Q4、profiling、local API | vLLM、TensorRT、长稳测试 |
| Jetson | 60 学时或项目扩展 | JetPack 记录、Qwen 迁移、`tegrastats`、功耗/温度 | TensorRT Edge-LLM、engine build |
| CPU-only | 入门和报告结构训练 | CPU baseline、API smoke test、日志记录 | 小模型对比 |
| Mac | 补充本地体验 | llama.cpp 或 MLC 路线阅读 | 移动端路线调研 |
| Android / iOS | 扩展路线 | 阅读 MLC LLM、LiteRT、ExecuTorch | 选做 demo |

## 已测试环境记录模板

课程不预置性能数字。教师或学员应把自己的环境填到下面这张表。

| 项目 | Ubuntu Server | Jetson | 备注 |
| --- | --- | --- | --- |
| OS | 待填 | 待填 | 例如 Ubuntu 22.04 |
| CPU | 待填 | 待填 | 记录型号和核心数 |
| RAM | 待填 | 待填 | Jetson 记录统一内存 |
| GPU | 待填 | 待填 | NVIDIA GPU 或 Jetson SoC |
| Driver | 待填 | 不适用或待填 | `nvidia-smi` |
| CUDA | 待填 | JetPack 内置 | `nvcc --version` 或说明未安装 |
| JetPack / L4T | 不适用 | 待填 | `cat /etc/nv_tegra_release` |
| Python | 待填 | 待填 | `python3 --version` |
| CMake | 待填 | 待填 | `cmake --version` |
| llama.cpp commit | 待填 | 待填 | `git rev-parse --short HEAD` |
| Qwen 模型 | 待填 | 待填 | 模型名、量化格式、来源 |

## 报告第 2 节填写小抄

| 字段 | Ubuntu Server + NVIDIA GPU | Jetson |
| --- | --- | --- |
| `GPU / Jetson` | 写实际 NVIDIA GPU 型号；未测 Jetson 时写“不适用（未测）” | 写 Jetson 型号和 SoC |
| `Driver / CUDA / JetPack` | 写 NVIDIA Driver、`nvidia-smi` 显示的 CUDA Version、`nvcc` 是否存在 | 写 JetPack/L4T；Driver 可写“不适用”或“未单独记录” |
| `llama.cpp commit` | 在 `~/edge-ai-lab/src/llama.cpp` 执行 `git rev-parse --short HEAD` | 同 Ubuntu |
| `模型来源` | 教师提供、Hugging Face repo 或离线包编号 | 同 Ubuntu |
| `模型许可证` | 从模型卡或教师说明填写；查不到写“未记录” | 同 Ubuntu |
| `模型 SHA256` | `sha256sum *.gguf` | 同 Ubuntu |

## 环境快照命令

Ubuntu Server：

```bash
{
  date
  uname -a
  lscpu | head -n 30
  free -h
  df -h
  python3 --version
  git --version
  cmake --version
  nvidia-smi || true
  nvcc --version || true
} | tee ~/edge-ai-lab/env/ubuntu-env.txt
```

Jetson：

```bash
{
  date
  uname -a
  cat /etc/nv_tegra_release
  free -h
  df -h
  python3 --version
  git --version
  cmake --version
  sudo nvpmodel -q
  sudo jetson_clocks --show
} | tee ~/edge-ai-lab/env/jetson-env.txt
```

## 常见边界

| 情况 | 能否继续 | 处理 |
| --- | --- | --- |
| 没有 Jetson | 可以 | 用 Ubuntu 主线完成 40 学时版本，在报告中说明 Jetson 未测 |
| 没有 NVIDIA GPU | 可以部分继续 | 只做 CPU baseline、API 和报告结构，GPU offload 标为未验证 |
| `nvcc` 不存在 | 可能可以继续 | 先看 llama.cpp 是否能用 CUDA 构建；有些环境只装 runtime |
| Jetson 存储不足 | 可以继续但要调整 | 使用 NVMe 或外部存储，不把模型放课程仓库 |
| 网络无法下载模型 | 可以继续 | 使用教师离线包，记录来源和 hash |

## 版本记录规则

- 不把 `.gguf`、checkpoint、adapter 和大日志提交到课程仓库。
- 每次换模型、runtime 或驱动后，都要更新报告里的环境字段。
- 服务器结果不能直接代表 Jetson 结果。
- Jetson engine、TensorRT engine 等硬件相关产物通常需要在目标设备或匹配环境中生成。
