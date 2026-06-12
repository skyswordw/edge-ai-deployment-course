# Qwen LoRA 微调结果记录

## 环境

| 字段 | 值 |
| --- | --- |
| 日期 | 待填 |
| 设备 | 待填 |
| OS | 待填 |
| GPU / Jetson | 待填 |
| Python | 待填 |
| PyTorch / CUDA | 待填 |
| transformers / peft / trl | 待填 |

## 数据

| 字段 | 值 |
| --- | --- |
| 数据路径 | 待填 |
| 样本数 | 待填 |
| 训练/评估切分 | 待填 |
| messages 格式检查 | 待填 |
| chat template 检查 | 待填 |
| 是否含隐私信息 | 待填 |
| 输出格式目标 | 待填 |

## 训练配置

| 字段 | 值 |
| --- | --- |
| base model | 待填 |
| max steps | 待填 |
| max seq length | 待填 |
| batch size | 待填 |
| gradient accumulation | 待填 |
| learning rate | 待填 |
| LoRA rank | 待填 |
| LoRA alpha | 待填 |
| target modules | 待填 |

## 训练日志

| step | loss | learning rate | peak VRAM/RAM | 备注 |
| --- | --- | --- | --- | --- |
| 待填 | 待填 | 待填 | 待填 | 待填 |

## 输出对比

| Prompt | 基座输出 | 微调后输出 | 是否改善 | 问题 |
| --- | --- | --- | --- | --- |
| 待填 | 待填 | 待填 | 待填 | 待填 |
| 待填 | 待填 | 待填 | 待填 | 待填 |
| 待填 | 待填 | 待填 | 待填 | 待填 |

## Chat Template 检查

| 检查项 | 结论 | 证据 |
| --- | --- | --- |
| system 指令是否进入模板 | 待填 | 待填 |
| user/assistant 边界是否清楚 | 待填 | 待填 |
| 训练和推理是否使用同一格式 | 待填 | 待填 |
| 是否有截断或特殊 token 异常 | 待填 | 待填 |

## 部署判断

| 问题 | 结论 |
| --- | --- |
| 是否值得继续训练？ | 待填 |
| 是否需要合并 adapter？ | 待填 |
| 是否进入 GGUF/量化验证？ | 待填 |
| 微调后是否需要重新 profiling？ | 待填 |
| 是否需要 Jetson 对照？ | 待填 |
| 主要风险 | 待填 |
