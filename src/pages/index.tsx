import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import type {ReactNode} from 'react';

import styles from './index.module.css';

function HomepageHeader(): ReactNode {
  const heroImage = useBaseUrl('/img/edge-ai-course-hero.png');

  return (
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <Heading as="h1" className={styles.heroTitle}>
          <span>端侧模型量化</span>
          <span>部署技术专题</span>
        </Heading>
        <p>
          面向真实设备的模型量化、压缩与部署课程书。内容以工程判断为主线，
          配套 Ubuntu Server、NVIDIA GPU 和 Qwen 小模型实作。
        </p>
        <div className={styles.heroActions}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            阅读课程书
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/start-here">
            选择学习路径
          </Link>
          <Link className="button button--secondary button--lg" to="/slides">
            打开 HTML 课件
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://github.com/neardws/edge-ai-deployment-course">
            GitHub
          </Link>
        </div>
      </div>
      <img className={styles.heroImage} src={heroImage} alt="" />
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="端侧模型量化部署技术专题"
      description="端侧 AI 模型量化、压缩、推理框架和部署链路课程">
      <HomepageHeader />
      <main className={styles.main}>
        <section className={styles.summaryGrid} aria-label="Course summary">
          <div>
            <span className={styles.kicker}>Course Book</span>
            <Heading as="h2">从方法理解到可运行实作</Heading>
            <p>
              课程书把量化、压缩、蒸馏、runtime 选型和 profiling 放回同一个目标：
              让模型在目标设备上稳定达到业务可用标准。每个核心概念都会对应图示、
              代码片段、实验任务和验收结果。
            </p>
          </div>
          <div className={styles.metrics}>
            <div><strong>Book</strong><span>图文课程书</span></div>
            <div><strong>Lab</strong><span>Ubuntu/Qwen 实作</span></div>
            <div><strong>Slides</strong><span>HTML 课件</span></div>
          </div>
        </section>
        <section className={styles.pathSection} aria-label="Learning paths">
          <div>
            <span className={styles.kicker}>Start Here</span>
            <Heading as="h2">三条路径，先跑通主线</Heading>
            <p>
              本课程不追求一次覆盖所有 runtime。第一轮先围绕 Qwen、GGUF、
              llama.cpp、profiling 和本地 API，把结果写进同一份部署报告。
            </p>
          </div>
          <div className={styles.pathCards}>
            <Link className={styles.pathCard} to="/docs/start-here">
              <strong>2h</strong>
              <span>Ubuntu + Qwen GGUF baseline，确认课程能跑通。</span>
            </Link>
            <Link className={styles.pathCard} to="/docs/start-here">
              <strong>40h</strong>
              <span>Q8/Q5/Q4、profiling、local API 和最终报告。</span>
            </Link>
            <Link className={styles.pathCard} to="/docs/start-here">
              <strong>60h</strong>
              <span>增加 LoRA、Jetson、vLLM/移动端和系统复盘。</span>
            </Link>
          </div>
        </section>
        <section className={styles.flowSection} aria-label="Course flow">
          <span className={styles.kicker}>Mainline</span>
          <Heading as="h2">从 baseline 到部署报告</Heading>
          <ol className={styles.flowList}>
            <li>场景约束</li>
            <li>模型 baseline</li>
            <li>量化压缩</li>
            <li>runtime 加速</li>
            <li>端侧实测</li>
            <li>API 服务</li>
            <li>部署报告</li>
          </ol>
          <div className={styles.flowActions}>
            <Link className="button button--primary" to="/docs/report-template">
              打开报告模板
            </Link>
            <Link className="button button--secondary" to="/docs/troubleshooting-index">
              查看排障索引
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
