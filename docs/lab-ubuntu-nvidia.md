---
title: Ubuntu Server 与 NVIDIA GPU 环境
---

# Ubuntu Server 与 NVIDIA GPU 环境

## 建议学时

2 学时。

建议安排：

| 课时 | 内容 | 产出 |
| --- | --- | --- |
| 1 | 检查 Ubuntu Server、GPU、驱动、CUDA runtime、工具链 | 环境基线日志 |
| 2 | 建立实验目录、运行检查脚本、确认 Git 忽略边界 | 可复用实验工作区 |

本实验对应理论章节：

- [推理框架与部署链路](/docs/runtime-deployment)
- [推理加速基础](/docs/inference-acceleration)

## 学习目标

完成本实验后，学习者应能：

- 建立可复查的 Ubuntu Server 实验基线。
- 确认 NVIDIA 驱动、CUDA runtime、Python、CMake、Git 和磁盘空间。
- 区分课程仓库、模型权重、第三方源码、构建产物和实验日志。
- 解释为什么环境检查是端侧部署实验的第一步。
- 生成一份可放入实验报告的 `env-check.txt`。

## 问题背景

很多部署失败不是模型问题，而是环境问题。

常见情况包括：

- `nvidia-smi` 不可用，说明驱动或 GPU 可见性有问题。
- 驱动可见，但 llama.cpp 构建时没有启用 CUDA。
- CMake、编译器或 Git 缺失，导致 runtime 无法构建。
- 模型权重放进课程仓库，导致 Git 仓库膨胀。
- 磁盘空间不足，下载模型或构建时中断。
- 远程服务器没有记录版本，后续无法复现实验结果。

本实验先不追求跑模型，而是把机器状态记录清楚。

## 实验边界

本实验只做环境检查和目录准备。

不会把以下内容写入 Git：

- 模型权重。
- `llama.cpp` 第三方源码。
- `build/` 构建产物。
- 大型 profiling 日志。
- 本机敏感路径或密钥。

课程仓库只保存教材、脚本、模板和少量示例。

## 图示讲解

```mermaid
flowchart TD
  A[Ubuntu Server] --> B[OS/CPU/Memory/Disk]
  A --> C[NVIDIA Driver]
  C --> D[CUDA Runtime 可见性]
  D --> E[llama.cpp CUDA Build]
  E --> F[Qwen GGUF CLI 推理]
  F --> G[Profiling 记录]
  G --> H[本地 API 服务]
```

实验目录建议：

```mermaid
flowchart TD
  A[~/edge-ai-lab] --> B[models/qwen]
  A --> C[src]
  A --> D[logs]
  A --> E[results]
  B --> F[GGUF 模型文件]
  C --> G[llama.cpp 第三方源码]
  D --> H[原始运行日志]
  E --> I[实验表格和报告]
```

## 前置条件

开始前确认：

| 项目 | 要求 | 说明 |
| --- | --- | --- |
| 操作系统 | Ubuntu Server | 建议 22.04 或 24.04，同学按实际环境记录 |
| GPU | NVIDIA GPU | 需要能被系统识别 |
| 权限 | 普通用户可创建实验目录 | 安装驱动或系统包可能需要管理员权限 |
| 网络 | 能访问模型来源和 GitHub | 离线环境需提前准备源码和模型 |
| 磁盘 | 有足够空间 | 具体空间随模型大小变化，记录实际可用空间 |

如果课堂设备已经由教师预配置，不需要学员自行安装驱动。

如果设备未配置驱动，应先按系统管理员要求完成安装，再继续实验。

## 核心概念

| 项目 | 需要确认 | 失败表现 |
| --- | --- | --- |
| OS | 发行版、内核、架构 | 驱动和 CUDA 包不匹配 |
| CPU | 核心数、架构 | CPU fallback 时性能异常 |
| 内存 | 总内存和可用内存 | 模型加载失败或被系统杀死 |
| 磁盘 | 可用空间 | 下载、解压、构建中断 |
| 驱动 | `nvidia-smi` 正常显示 GPU | CUDA 不可见、GPU offload 失败 |
| CUDA runtime | runtime 能被程序调用 | llama.cpp 只能 CPU 跑 |
| Python | smoke test 和辅助脚本可运行 | API 测试脚本无法执行 |
| CMake/Git | 构建和获取源码 | runtime 无法构建 |

## Step 1：建立实验目录

模型、源码和日志放在用户目录下的实验工作区。

```bash
mkdir -p ~/edge-ai-lab/{models/qwen,src,logs,results}
cd ~/edge-ai-lab
```

检查目录：

```bash
find ~/edge-ai-lab -maxdepth 2 -type d | sort
```

预期能看到：

```text
/home/用户名/edge-ai-lab
/home/用户名/edge-ai-lab/logs
/home/用户名/edge-ai-lab/models
/home/用户名/edge-ai-lab/models/qwen
/home/用户名/edge-ai-lab/results
/home/用户名/edge-ai-lab/src
```

## Step 2：记录系统信息

```bash
uname -a
lsb_release -a
lscpu
free -h
df -h
```

如果 `lsb_release` 不存在，可以用：

```bash
cat /etc/os-release
```

记录重点：

| 项目 | 记录位置 |
| --- | --- |
| Ubuntu 版本 | 实验报告“环境”部分 |
| 内核版本 | 驱动排查时使用 |
| CPU 型号和核心数 | CPU baseline 解释 |
| 总内存和可用内存 | 模型加载能力判断 |
| 磁盘可用空间 | 模型下载和构建能力判断 |

## Step 3：检查 NVIDIA GPU

```bash
nvidia-smi
```

需要记录：

| 字段 | 用途 |
| --- | --- |
| Driver Version | 判断驱动版本 |
| CUDA Version | 判断驱动支持的 CUDA 版本上限 |
| GPU 名称 | 对比实验硬件 |
| Memory-Usage | 记录推理前后的显存变化 |
| Processes | 确认 llama.cpp 是否使用 GPU |

保存一次基线：

```bash
nvidia-smi > ~/edge-ai-lab/results/nvidia-smi-before.txt
```

如果希望推理时连续观察：

```bash
watch -n 0.5 nvidia-smi
```

`watch` 命令用于观察，不需要保存到 Git。

## Step 4：检查工具链

```bash
python3 --version
cmake --version
git --version
gcc --version
g++ --version
```

如果某个命令不存在，记录缺失项。

课堂环境可以由教师统一安装。

自行安装时，先确认课程机器是否允许改系统包。

常见安装命令如下：

```bash
sudo apt update
sudo apt install -y build-essential cmake git python3 python3-venv curl
```

不要在不了解机器用途的情况下随意升级驱动或 CUDA。

## Step 5：运行课程环境检查脚本

从课程仓库根目录运行：

```bash
bash labs/scripts/env_check.sh | tee ~/edge-ai-lab/results/env-check.txt
```

如果脚本不可执行，直接用 `bash` 调用即可。

检查结果中至少应包含：

- OS 信息。
- CPU 信息。
- 内存信息。
- 磁盘信息。
- GPU 信息。
- Python、CMake、Git 版本。

## Step 6：确认 Git 边界

回到课程仓库：

```bash
git status --short
```

确认模型和第三方源码没有出现在 Git 变更中。

如果你把模型放在 `~/edge-ai-lab/models`，它不会进入课程仓库。

如果你误把模型放入课程仓库，应先移动到实验目录：

```bash
mkdir -p ~/edge-ai-lab/models/qwen
mv 路径/模型文件.gguf ~/edge-ai-lab/models/qwen/
```

不要把 `.gguf` 文件提交到 Git。

## 结果记录表

| 项目 | 结果 |
| --- | --- |
| 日期 | 待填 |
| 机器用途 | Ubuntu Server / 远程实验机 / 本地工作站 |
| Ubuntu 版本 | 待填 |
| 内核版本 | 待填 |
| CPU | 待填 |
| 内存 | 待填 |
| GPU | 待填 |
| NVIDIA Driver | 待填 |
| CUDA Version from `nvidia-smi` | 待填 |
| Python | 待填 |
| CMake | 待填 |
| Git | 待填 |
| 可用磁盘空间 | 待填 |
| 实验目录 | `~/edge-ai-lab` |

## 验收结果

| 产物 | 验收标准 |
| --- | --- |
| `~/edge-ai-lab` 目录 | 包含 `models/qwen`、`src`、`logs`、`results` |
| `env-check.txt` | 包含 OS、CPU、内存、磁盘、GPU、Python、CMake、Git 信息 |
| `nvidia-smi-before.txt` | 能看到 GPU 名称、驱动版本和显存 |
| Git 状态 | 没有模型文件、第三方源码和构建产物进入课程仓库 |
| 实验记录表 | 关键版本字段已填写 |

## 失败排查

### `nvidia-smi` 不存在

可能原因：

- 没有安装 NVIDIA 驱动。
- 机器没有 NVIDIA GPU。
- 容器环境没有透传 GPU。
- PATH 或驱动安装不完整。

处理：

- 先确认硬件和课程环境说明。
- 不要直接下载随机驱动安装包。
- 按 Ubuntu 或 NVIDIA 官方文档安装。

### `nvidia-smi` 显示 GPU，但后续程序无法用 CUDA

可能原因：

- llama.cpp 未启用 CUDA 构建。
- CUDA runtime 库路径不可见。
- 程序运行在容器内但没有 `--gpus all`。

处理：

- 在 [Qwen 基线推理](/docs/lab-qwen-baseline) 中检查构建日志。
- 运行时使用 `-ngl 99`。
- 用 `nvidia-smi` 观察进程。

### 磁盘不足

处理：

- 删除自己实验目录中不需要的临时模型或构建产物。
- 不要清理系统目录。
- 不要删除其他同学或系统服务的文件。

### 网络无法下载模型

处理：

- 记录网络失败原因。
- 使用教师提前准备的模型文件。
- 保持模型文件名、来源和校验信息可追踪。

## 作业

提交一份环境记录，包含：

1. `env-check.txt` 的关键摘要。
2. `nvidia-smi-before.txt`。
3. 实验目录结构。
4. 你认为后续 Qwen 推理最可能遇到的环境风险。

## 参考资料

- [Ubuntu Server NVIDIA driver guide](https://ubuntu.com/server/docs/how-to/graphics/install-nvidia-drivers/)
- [NVIDIA CUDA Installation Guide for Linux](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/)
- [NVIDIA Container Toolkit Install Guide](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
