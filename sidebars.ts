import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  courseSidebar: [
    'intro',
    'agenda',
    {
      type: 'category',
      label: '课程专题',
      collapsed: false,
      items: [
        'framework',
        'ptq-qat',
        'llm-quantization',
        'accuracy-repair',
        'compression-distillation',
        'runtime-deployment',
        'vlm-agent',
        'cases-qa',
      ],
    },
  ],
};

export default sidebars;
