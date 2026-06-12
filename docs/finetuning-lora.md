---
title: 模型微调与 LoRA/QLoRA
---

# 模型微调与 LoRA/QLoRA

## 建议学时

6 学时。

| 课时 | 内容 | 产出 |
| --- | --- | --- |
| 1 | 微调在端侧部署链路中的位置 | 微调必要性判断表 |
| 2 | 数据格式、chat template、SFT 数据质量 | 数据样例检查清单 |
| 3 | LoRA、QLoRA、全参微调、Adapter 的差异 | 微调策略选择表 |
| 4 | 训练配置、显存估算、日志阅读 | 训练配置草案 |
| 5 | 评估、过拟合、灾难性遗忘和安全边界 | 评估任务列表 |
| 6 | 微调后量化、合并、导出和部署验证 | 微调到部署流程图 |

本章对应实作：

- [Qwen LoRA 微调实验](/docs/lab-qwen-lora-finetuning)
- [Qwen GGUF 量化对比实验](/docs/lab-qwen-quantization)
- [Profiling 与结果记录](/docs/lab-profiling)
- [最终项目与验收标准](/docs/final-project)

## 自学路线

如果读者没有微调经验，建议按下面顺序学习，不要直接跳到长训练：

| 步骤 | 学什么 | 跟做什么 | 检查点 |
| --- | --- | --- | --- |
| 1 | 微调是否必要 | 填写微调必要性判断表 | 能说明为什么做或不做 |
| 2 | SFT 数据格式 | 读 5 条 `messages` JSONL | 每行可解析，最后一条是 assistant |
| 3 | Chat template | 用 tokenizer 打印 template 后文本 | 训练和推理格式一致 |
| 4 | LoRA 参数 | 看 `r`、`alpha`、target modules | 能解释训练了哪些模块 |
| 5 | Smoke test | 跑 5-step 训练 | 有 loss、日志和 adapter |
| 6 | 输出对比 | 固定 3-5 个 prompt | 能判断是否改善目标任务 |
| 7 | 部署回归 | 决定合并、量化或停止 | 结论进入最终项目报告 |

这一路线来自公开教程的共同粒度：数据、模板、训练入口、评估和部署要串起来，而不是只展示一条训练命令。

## 学习目标

完成本章后，学习者应能：

- 判断什么时候应该微调，什么时候应该先做 prompt、RAG、后处理、换模型或量化修复。
- 区分 SFT、LoRA、QLoRA、全参微调、蒸馏、继续预训练和偏好优化。
- 设计一个小规模、可复查的指令微调数据集，并检查数据格式和 chat template。
- 阅读训练日志，理解 loss、learning rate、显存、checkpoint、eval loss 的基本含义。
- 解释微调后为什么还需要重新评估、重新量化、重新 profiling。
- 把微调结果纳入端侧部署评估报告，而不是把训练和部署割裂。

## 章节定位

量化和推理加速解决的是“模型如何在设备上跑得更小、更快、更稳”。

微调解决的是“模型是否更适合某个任务、格式、领域或交互方式”。

这两个问题会互相影响：

- 微调后的模型需要重新评估量化质量。
- LoRA adapter 合并后可能改变权重分布。
- QLoRA 训练本身使用低比特基座，但部署时仍要看目标 runtime。
- 微调能修复一部分输出格式或领域问题，但不能替代 runtime profiling。

## 什么时候需要微调

优先级上，微调通常不是第一步。

端侧项目应先判断问题来源。

| 现象 | 先尝试 | 微调是否必要 |
| --- | --- | --- |
| 输出格式偶尔不稳定 | prompt、few-shot、JSON schema、后处理 | 不一定 |
| 缺少企业术语解释 | RAG、词表说明、few-shot | 视任务稳定性而定 |
| 固定格式任务长期失败 | 数据构造、SFT/LoRA | 可能需要 |
| 模型知识过时 | RAG、知识库更新 | 微调不是首选 |
| 风格、语气、模板固定 | SFT/LoRA | 适合小规模微调 |
| 复杂推理能力不足 | 换更强模型、任务拆解 | 微调不一定有效 |
| 量化后质量下降 | 先做精度修复和 mixed precision | 微调是第二阶段 |

一个实用判断：

```mermaid
flowchart TD
  A[部署效果不达标] --> B{"是知识缺失吗?"}
  B -- "是" --> C[RAG / 数据注入]
  B -- "不是" --> D{"是格式或风格不稳定吗?"}
  D -- "是" --> E[Prompt / few-shot / SFT]
  D -- "不是" --> F{"是量化后退化吗?"}
  F -- "是" --> G[校准 / mixed precision / LoRA补偿]
  F -- "不是" --> H{"基础能力不足吗?"}
  H -- "是" --> I[换模型 / 蒸馏 / 更大模型]
  H -- "不是" --> J[继续定位日志和数据]
```

## 微调类型

| 类型 | 做什么 | 适合 | 风险 |
| --- | --- | --- | --- |
| SFT | 用指令-回答数据训练模型遵循任务格式 | 格式、风格、领域表达 | 数据质量差会快速污染模型 |
| LoRA | 冻结基座，只训练低秩增量参数 | 小显存、快速试验 | adapter 与基座版本必须匹配 |
| QLoRA | 低比特加载基座并训练 LoRA | 显存受限训练 | 训练与部署低比特路径不可混淆 |
| 全参微调 | 更新全部权重 | 数据和算力充足的强定制 | 成本高、灾难性遗忘风险高 |
| 继续预训练 | 用大量文本继续语言建模 | 领域语言适配 | 不直接保证指令遵循 |
| 蒸馏 | 让小模型学习大模型输出 | 小模型能力补偿 | 教师输出质量决定上限 |
| 偏好优化 | 用偏好数据调整回答倾向 | 对齐和风格控制 | 需要更复杂数据和评估 |

本课程主线采用 LoRA/QLoRA 风格的小规模 SFT 实验。

原因是它最适合作为自学实验：

- 数据量可以很小，但能观察完整流程。
- 训练产物体积小，便于保存和比较。
- 与 Qwen、Transformers、PEFT、TRL、LLaMA-Factory 等生态对应。
- 训练后可以继续做量化、GGUF 转换和本地部署验证。

## 数据格式

微调数据不是普通文本堆叠。

最基本的 SFT 样本需要明确：

- 用户输入。
- 助手输出。
- 是否有 system 指令。
- 是否需要工具调用或 JSON 格式。
- 是否符合目标模型的 chat template。

推荐 JSONL 样例：

```json
{"messages":[{"role":"system","content":"你是端侧模型部署课程助教。回答要简洁、可操作。"},{"role":"user","content":"什么情况下不应该先做模型微调？"},{"role":"assistant","content":"当问题可以通过 prompt、RAG、后处理、量化校准或 runtime 参数解决时，不应该先做微调。微调适合稳定的格式、风格或领域任务。"}]}
{"messages":[{"role":"system","content":"你是端侧模型部署课程助教。"},{"role":"user","content":"请输出 JSON，总结 Q4 量化的两个风险。"},{"role":"assistant","content":"{\"risks\":[\"低比特 kernel 不匹配时未必加速\",\"质量可能在格式化输出和长上下文任务中下降\"]}"}]}
```

数据检查清单：

| 检查项 | 为什么重要 |
| --- | --- |
| 每条样本有明确任务 | 避免模型学习到无意义聊天 |
| 输出格式稳定 | 方便评估是否学会目标格式 |
| 不含隐私和敏感信息 | 公开课程和开源仓库不能泄露数据 |
| 不含互相矛盾答案 | 小数据集里矛盾会被放大 |
| system/user/assistant 角色正确 | chat template 才能正确应用 |
| 训练集和评估集分开 | 避免只记住训练样本 |

最小数据检查命令：

```bash
python - <<'PY'
import json
from pathlib import Path

path = Path("labs/finetuning/sample_sft_data.jsonl")
rows = []
for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
    row = json.loads(line)
    assert "messages" in row, f"line {line_no} missing messages"
    roles = [msg["role"] for msg in row["messages"]]
    assert roles[-1] == "assistant", f"line {line_no} last role is not assistant"
    rows.append(row)
print(f"ok: {len(rows)} samples")
PY
```

检查通过只说明格式能读，不说明数据质量好。还要人工看 assistant 输出是否统一、是否含隐私信息、是否和最终评估任务一致。

## Chat template

同一段对话，如果使用不同 chat template，token 序列可能不同。

微调时和部署时必须保持一致。

```mermaid
flowchart LR
  A[messages JSONL] --> B[chat template]
  B --> C[token 序列]
  C --> D[训练]
  D --> E[adapter/checkpoint]
  E --> F[部署 prompt]
  F --> B
```

自学时最常见的问题是：

- 训练时用了 messages 格式，推理时直接拼纯文本。
- 训练时有 system prompt，部署时忘记加。
- 训练时要求 JSON，部署时 prompt 不再强调格式。
- 使用不同 tokenizer 或模型版本。

可以先打印一条样本经过 chat template 后的文本：

```bash
python - <<'PY'
import json
from pathlib import Path
from transformers import AutoTokenizer

model = "Qwen/Qwen2.5-0.5B-Instruct"
row = json.loads(Path("labs/finetuning/sample_sft_data.jsonl").read_text(encoding="utf-8").splitlines()[0])
tokenizer = AutoTokenizer.from_pretrained(model, trust_remote_code=True)
text = tokenizer.apply_chat_template(
    row["messages"],
    tokenize=False,
    add_generation_prompt=False,
)
print(text)
PY
```

如果这里打印出的角色标记、system prompt 或 assistant 结尾和部署时不一致，先修模板问题，不要急着训练。

## 训练配置字段

一个训练配置至少要能回答这些问题：

| 字段 | 作用 | 记录方式 |
| --- | --- | --- |
| base model | 基座模型 | 模型名、版本、来源、许可证 |
| dataset | 训练数据 | 路径、条数、格式、切分方式 |
| max length | 最大序列长度 | 影响显存和样本截断 |
| batch size | 每步样本数 | 与显存直接相关 |
| gradient accumulation | 梯度累积 | 小显存模拟较大 batch |
| learning rate | 学习率 | 过高容易破坏模型行为 |
| epochs / steps | 训练轮数 | 小数据过多轮容易过拟合 |
| LoRA rank | 低秩维度 | 越大参数越多，未必越好 |
| target modules | 注入 LoRA 的模块 | 需与模型结构匹配 |
| save strategy | 保存 checkpoint | 便于回滚和对比 |
| eval strategy | 评估频率 | 观察是否过拟合 |

本课程 smoke test 的最低配置是：

| 字段 | 建议起点 | 原因 |
| --- | --- | --- |
| base model | `Qwen/Qwen2.5-0.5B-Instruct` | 小模型更适合教学验证 |
| max steps | 5 | 先验证训练链路，不追求效果 |
| max seq length | 512 | 降低显存压力 |
| batch size | 1 | 最小可运行起点 |
| LoRA rank | 8 | 能观察 adapter，又不扩大成本 |
| target modules | `q_proj/k_proj/v_proj/o_proj` | 常见注意力投影模块 |
| output path | 仓库外路径 | 避免提交 adapter 和 checkpoint |

## 显存和训练成本

微调比推理更耗显存。

即使使用 LoRA，也要考虑：

- 基座模型加载。
- 激活保存。
- 梯度。
- 优化器状态。
- LoRA 参数。
- batch size 和 sequence length。

QLoRA 的意义是降低基座加载和训练过程中的显存压力，但它不是“免费训练”。

训练前应先做小样本 smoke test：

| 阶段 | 目标 |
| --- | --- |
| 1 条样本 | 验证数据格式和 tokenizer |
| 10 条样本 | 验证训练循环能跑通 |
| 小步数训练 | 验证 loss 能记录、checkpoint 能保存 |
| 小评估集 | 验证输出格式是否有变化 |
| 部署验证 | 验证微调结果是否能在目标 runtime 使用 |

## 训练日志怎么看

训练日志不是只看 loss 下降。

| 日志信号 | 可能含义 | 处理方式 |
| --- | --- | --- |
| loss 不动 | 学习率、数据格式、mask、模型加载有问题 | 先跑极小样本检查 |
| loss 快速变很低 | 数据太少或重复，可能过拟合 | 增加评估集和保留样本 |
| eval loss 上升 | 泛化变差 | 降低轮数或清理数据 |
| 显存 OOM | batch、max length、模型太大 | 降 batch、降长度、换 QLoRA |
| 输出格式没学会 | 数据不一致、样本太少 | 统一格式并增加样本 |
| 原有能力退化 | 灾难性遗忘 | 降学习率、混入通用样本 |

读日志的顺序建议是：

1. 先看环境是否真的用到了目标 GPU。
2. 再看每一步是否有 loss 和 learning rate。
3. 再看 checkpoint 或 adapter 是否保存。
4. 最后才看 loss 是否下降。

课程中的 5-step smoke test 即使 loss 没有明显下降，也可能是合格的。它的目标是验证数据、tokenizer、训练循环和保存路径。

## 微调前后评估

微调评估要固定 prompt、采样参数和输出要求。

不要只挑训练集中出现过的问题。至少准备三类 prompt：

| 类型 | 目的 | 示例 |
| --- | --- | --- |
| 近似训练样本 | 检查是否学会目标格式 | `请输出 JSON，总结 Q4 量化的两个风险。` |
| 未见同类任务 | 检查泛化 | `请用表格比较 LoRA 和 QLoRA。` |
| 部署解释任务 | 检查课程目标能力 | `Jetson 上 tokens/s 下降时先排查什么？` |
| 负面测试 | 检查是否过拟合 | `请给出一个和端侧部署无关的闲聊回答。` |

记录时不要只写“变好”。应说明改善点：

- JSON 是否合法。
- 是否少了无关解释。
- 是否更稳定遵循 system prompt。
- 是否引入新的错误。
- 是否影响原本已经会的任务。

## 微调后的部署链路

微调完成不等于部署完成。

需要继续执行：

```mermaid
flowchart TD
  A[训练得到 adapter] --> B[评估 adapter 推理]
  B --> C{"质量是否改善?"}
  C -- "否" --> D[检查数据/参数/基座]
  C -- "是" --> E[合并或保留 adapter]
  E --> F[导出部署格式]
  F --> G[量化/转换]
  G --> H[llama.cpp 或其他 runtime 推理]
  H --> I[profiling]
  I --> J[本地 API 验证]
  J --> K[部署评估报告]
```

部署时要分别回答：

- adapter 是否需要合并到基座？
- 合并后能否转换为 GGUF？
- 量化后目标任务是否仍然改善？
- 微调是否导致 tokens/s、内存、首 token 延迟变化？
- Jetson 上是否仍能加载和稳定运行？

部署回归的最低检查表：

| 检查项 | 通过标准 |
| --- | --- |
| adapter 推理 | 同一基座能加载 adapter 并生成结果 |
| 输出质量 | 至少 3 个固定 prompt 有记录 |
| 合并判断 | 能说明合并或不合并的理由 |
| 量化回归 | 微调后量化方案需要重新测试 |
| 性能回归 | 记录首 token、tokens/s、内存或失败原因 |
| 报告沉淀 | 结论写进最终部署评估报告 |

## 与量化的关系

微调和量化常见组合：

| 路线 | 说明 | 适合 |
| --- | --- | --- |
| 先微调再量化 | 先得到任务适配模型，再做部署压缩 | 任务质量优先 |
| 先量化再补偿 | 量化后质量下降，再做 LoRA/蒸馏修复 | 端侧约束优先 |
| QLoRA 训练 + 部署量化 | 训练时低比特加载，部署时重新选择格式 | 显存受限自学实验 |
| 微调 adapter + 不合并 | 部署时加载基座和 adapter | 服务端较方便，端侧未必方便 |
| 合并 adapter + GGUF | 合并后转 GGUF 做 llama.cpp | 本课程推荐验证路线 |

注意：QLoRA 训练中的 4bit 加载，不等同于最终部署的 GGUF Q4。

二者都涉及低比特，但工具链、目标和 runtime 不同。

## 配套实作

本章配套实作不追求训练出“强模型”。

它追求完整闭环：

1. 准备 10-50 条小型教学数据。
2. 检查 messages 格式和 chat template。
3. 运行极小步数 LoRA/QLoRA smoke test。
4. 保存 adapter 和训练日志。
5. 对比微调前后固定 prompt 输出。
6. 记录显存、训练时间、失败日志。
7. 判断是否值得进入合并、量化和部署验证。

建议按下面文件配合完成：

| 文件 | 用途 |
| --- | --- |
| `labs/finetuning/sample_sft_data.jsonl` | 教学样例数据 |
| `labs/finetuning/train_lora_smoke.py` | 最小 LoRA SFT smoke test |
| `labs/finetuning/lora_config.example.yaml` | 训练配置记录模板 |
| `labs/finetuning/finetuning-results-template.md` | 结果记录模板 |

## 验收结果

| 产物 | 验收标准 |
| --- | --- |
| 数据样例 | JSONL 可读，messages 角色正确，没有隐私信息 |
| 配置文件 | 能说明基座、数据、batch、学习率、LoRA 参数 |
| 训练日志 | 至少包含 loss、step、显存或失败原因 |
| adapter 或 checkpoint | 保存路径清晰，不提交到 Git |
| 对比输出 | 同一 prompt 下有微调前后结果 |
| 部署判断 | 能说明是否进入量化和端侧验证 |

## 常见问题

### 微调是不是一定能提升模型？

不是。微调只会让模型更接近训练数据分布。数据质量差、样本少、格式混乱或学习率过高时，模型可能变差。

### LoRA adapter 可以直接部署到 llama.cpp 吗？

要看具体工具链和格式。课程建议把 adapter 先在 Transformers 生态验证，再根据目标 runtime 决定是否合并、转换或重新量化。

### 小数据集有意义吗？

有教学意义，但不要夸大。小数据集适合学习流程、验证格式控制和观察失败模式，不适合证明模型能力全面提升。

### 微调和 RAG 怎么选？

知识更新优先 RAG，固定格式和风格优先微调。很多产品会同时使用：RAG 提供知识，微调改善回答格式和交互习惯。

## 参考资料

- [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1)
- [Hugging Face Transformers Chat templates](https://huggingface.co/docs/transformers/chat_templating)
- [Hugging Face PEFT documentation](https://huggingface.co/docs/peft/index)
- [TRL SFTTrainer documentation](https://huggingface.co/docs/trl/sft_trainer)
- [Qwen LLaMA-Factory fine-tuning guide](https://qwen.readthedocs.io/en/v3.0/training/llama_factory.html)
- [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory)
- [Unsloth documentation](https://docs.unsloth.ai/)
- [QLoRA paper](https://arxiv.org/abs/2305.14314)
