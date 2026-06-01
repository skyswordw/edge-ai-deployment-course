export type AgendaItem = {
  time: string;
  title: string;
  kind: 'topic' | 'break';
};

export type CourseTopic = {
  id: string;
  time: string;
  title: string;
  objective: string;
  content: string[];
  keywords: string[];
  takeaways: string[];
};

export const courseTitle = '端侧模型量化部署技术专题';

export const agendaItems: AgendaItem[] = [
  {time: '09:00-09:30', title: '专题一 端侧部署问题框架', kind: 'topic'},
  {time: '09:30-10:30', title: '专题二 量化基础与 PTQ/QAT', kind: 'topic'},
  {time: '10:30-10:45', title: '茶歇', kind: 'break'},
  {time: '10:45-12:00', title: '专题三 大模型量化方法', kind: 'topic'},
  {time: '12:00-13:30', title: '午休', kind: 'break'},
  {time: '13:30-14:25', title: '专题四 量化精度修复', kind: 'topic'},
  {time: '14:25-15:10', title: '专题五 压缩与蒸馏', kind: 'topic'},
  {time: '15:10-15:25', title: '茶歇', kind: 'break'},
  {time: '15:25-16:10', title: '专题六 推理框架与部署链路', kind: 'topic'},
  {time: '16:10-16:45', title: '专题七 VLM 与 Agent 端侧形态', kind: 'topic'},
  {time: '16:45-17:00', title: '专题八 案例串联与 Q&A', kind: 'topic'},
];

export const courseTopics: CourseTopic[] = [
  {
    id: 'framework',
    time: '09:00-09:30',
    title: '专题一 端侧部署问题框架',
    objective:
      '帮助学员建立端侧模型部署的整体判断框架，理解端侧 AI 落地需要同时处理模型能力、设备资源、运行时框架、功耗散热、网络环境和产品体验之间的平衡。',
    content: [
      '本专题通过讲解端侧推理重新受到重视的背景，介绍云端推理在隐私、延迟、弱网、成本和个性化体验方面的限制，以及手机、PC、车载、IoT、工业终端、摄像头和机器人等典型端侧场景。',
      '本专题还将介绍端侧部署的关键评价维度，包括任务精度、端到端延迟、首 token 延迟、内存峰值、KV Cache 占用、功耗、发热降频、稳定性和维护成本。',
    ],
    keywords: ['隐私', '延迟', '弱网', '成本', '功耗', '真实设备 profiling'],
    takeaways: [
      '端侧部署不是把云端模型直接搬到设备上运行。',
      '量化、压缩、蒸馏和推理框架选型都服务于同一个业务可用目标。',
      '判断部署成败要同时看精度、延迟、内存、功耗和维护成本。',
    ],
  },
  {
    id: 'ptq-qat',
    time: '09:30-10:30',
    title: '专题二 量化基础与 PTQ/QAT',
    objective:
      '帮助学员掌握模型量化的基本概念、误差来源和常见工程流程，理解权重量化、激活量化、KV Cache 量化、weight-only quantization 和 weight-activation quantization 的差异。',
    content: [
      '本专题通过讲解量化的基本原理，介绍如何用更低精度的数值表示模型权重、激活或推理缓存，从而降低存储、内存带宽和计算压力。',
      '本专题还将介绍 PTQ 和 QAT 两类基础量化路线。PTQ 适合快速验证和已有模型部署，但在低 bit、复杂任务和数据分布偏移时存在精度风险。QAT 通常更稳，但需要训练数据、训练资源和更高工程投入。',
    ],
    keywords: ['FP16', 'BF16', 'INT8', 'INT4', 'NF4', 'FP8', 'PTQ', 'QAT'],
    takeaways: [
      '不同数值格式和量化粒度会改变精度与性能的平衡。',
      'PTQ 优先服务快速验证，QAT 更适合精度风险更高的场景。',
      '量化路线选择要看项目阶段、数据条件、训练资源和精度要求。',
    ],
  },
  {
    id: 'llm-quantization',
    time: '10:45-12:00',
    title: '专题三 大模型量化方法',
    objective:
      '帮助学员理解 LLM 和 VLM 为什么需要区别于传统 INT8 PTQ/QAT 的大模型量化方法，重点掌握 GPTQ、AWQ、SmoothQuant、LLM.int8() 和 KV Cache 量化的基本思想、适用场景和工程限制。',
    content: [
      '本专题通过讲解 LLM 和 VLM 的结构特点，介绍大模型量化与传统模型量化的差异。Transformer 结构中存在 outlier、层敏感和长上下文 KV Cache 增长问题，VLM 还涉及 vision encoder、projector 和多模态对齐链路。',
      '本专题将介绍 GPTQ、AWQ、SmoothQuant、LLM.int8() 和 KV Cache 量化等代表性方法，帮助学员把低比特量化放到模型结构、校准样本、敏感权重、激活分布、上下文长度和推理框架共同作用的系统里理解。',
    ],
    keywords: ['GPTQ', 'AWQ', 'SmoothQuant', 'LLM.int8()', 'KV Cache', 'VLM'],
    takeaways: [
      '大模型量化不是单纯降低 bit-width。',
      '低比特策略要同时考虑 outlier、层敏感、上下文长度和框架支持。',
      'VLM 量化还要单独评估视觉编码器、多模态投影和对齐链路。',
    ],
  },
  {
    id: 'accuracy-repair',
    time: '13:30-14:25',
    title: '专题四 量化精度修复',
    objective:
      '帮助学员掌握量化后精度下降的系统排查方法，能够从 baseline、数据预处理、模型导出、runtime 实现、校准数据、敏感层、outlier 和评估指标等角度定位问题。',
    content: [
      '本专题通过讲解量化后精度下降的常见表现，介绍分类检测指标下降、生成质量变差、格式错误增多、VLM 细粒度识别能力退化和 Agent 规划稳定性下降等问题形态。',
      '本专题还将介绍量化精度修复的工程流程，包括校准集重构、逐层敏感性分析、逐层回退、mixed precision、敏感层保留高精度、clipping 和 percentile 调整、activation outlier 处理，以及必要时使用 QAT、LoRA、Adapter 或蒸馏进行补偿。',
    ],
    keywords: ['baseline', '校准集', '敏感层', 'outlier', 'mixed precision', 'LoRA'],
    takeaways: [
      '精度下降不一定来自量化算法本身。',
      '先确认问题，再定位原因，最后选择修复手段。',
      '所有修复都要回到目标设备重新 profiling。',
    ],
  },
  {
    id: 'compression-distillation',
    time: '14:25-15:10',
    title: '专题五 压缩与蒸馏',
    objective:
      '帮助学员把视角从量化扩展到完整的模型压缩体系，理解剪枝、低秩分解、参数共享、知识蒸馏、小模型训练和架构重设计如何共同服务于端侧部署。',
    content: [
      '本专题通过讲解模型压缩的主要技术路线，介绍量化、剪枝、低秩分解、参数共享、知识蒸馏和架构重设计之间的关系。',
      '本专题还将介绍知识蒸馏在端侧部署中的作用。蒸馏不仅可以把大模型能力迁移到小模型，也可以用于修复量化后的能力下降。',
    ],
    keywords: ['剪枝', '低秩分解', '参数共享', '知识蒸馏', '小模型', '架构重设计'],
    takeaways: [
      '非结构化剪枝未必带来真实端侧加速。',
      '蒸馏可以用于能力迁移，也可以用于量化后补偿。',
      '有时选择更端侧友好的模型，比压缩不合适的模型更有效。',
    ],
  },
  {
    id: 'runtime-deployment',
    time: '15:25-16:10',
    title: '专题六 推理框架与部署链路',
    objective:
      '帮助学员理解模型从训练环境走向端侧设备的完整部署链路，掌握推理框架选型的核心维度。',
    content: [
      '本专题通过讲解模型部署的完整链路，介绍模型导出、图优化、算子融合、layout 转换、量化转换、runtime 加载、kernel 选择和目标设备 profiling 等关键步骤。',
      '本专题还将介绍端侧部署中最常见的性能陷阱。模型转换成功不代表性能达标，unsupported op 可能触发 CPU fallback，量化算子不支持可能导致反量化后再计算，dynamic shape 可能影响图优化。',
    ],
    keywords: ['ONNX Runtime', 'TensorRT', 'TFLite', 'NCNN', 'MNN', 'Core ML', 'llama.cpp', 'ExecuTorch'],
    takeaways: [
      '量化能否真正提速取决于目标设备、runtime、kernel 和 fallback 行为。',
      '部署链路要覆盖导出、图优化、量化转换、加载和 profiling。',
      'profiling 必须覆盖端到端延迟、首 token 延迟、tokens/s、内存、功耗和 fallback log。',
    ],
  },
  {
    id: 'vlm-agent',
    time: '16:10-16:45',
    title: '专题七 VLM 与 Agent 端侧形态',
    objective:
      '帮助学员理解 VLM 与 Agent 的端侧部署已经从单模型优化扩展到系统架构优化，区分 VLM 的感知理解链路和 Agent 的规划执行链路。',
    content: [
      '本专题通过讲解 VLM 的端侧部署链路，介绍图像预处理、vision encoder、projector、LLM、tokenizer、多轮上下文和输出后处理之间的关系。',
      '本专题还将介绍 Agent 在端侧部署中的系统组成和主要风险。Agent 更关注 planner、tool registry、executor、memory、permission manager、safety policy 和交互循环。',
    ],
    keywords: ['vision encoder', 'projector', 'planner', 'tool registry', 'memory', '端云协同'],
    takeaways: [
      'VLM 的瓶颈不只在 LLM。',
      'Agent 的关键问题还包括工具链稳定性、权限边界、状态维护和失败恢复。',
      '端云协同要让简单和隐私任务在端侧完成，让复杂 reasoning 和兜底能力交给云端。',
    ],
  },
  {
    id: 'cases-qa',
    time: '16:45-17:00',
    title: '专题八 案例串联与 Q&A',
    objective:
      '通过典型案例把全天内容串联起来，帮助学员把量化算法、精度修复、压缩蒸馏、推理框架选型和 VLM/Agent 部署形态整合为完整工程判断。',
    content: [
      '本专题通过讲解传统视觉模型、小型 LLM、VLM 和 Hybrid Agent 四类案例，介绍不同模型形态在端侧部署中的典型优化路径。',
      '本专题还将通过 VLM 和 Hybrid Agent 案例介绍系统级部署思路，帮助学员把单模型优化扩展到产品级系统设计。',
    ],
    keywords: ['传统视觉模型', '小型 LLM', 'VLM', 'Hybrid Agent', 'baseline', '上线验证'],
    takeaways: [
      '案例复盘要从目标定义、baseline 建立、量化压缩、框架适配、profiling 到上线验证完整展开。',
      '不同模型形态的优化路径不同，不能用同一套指标粗暴套用。',
      '产品级系统设计需要同时处理模型能力、工具权限、任务 routing、状态管理和失败恢复。',
    ],
  },
];
