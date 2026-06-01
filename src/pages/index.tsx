import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {agendaItems, courseTopics} from '@site/src/data/course';
import type {ReactNode} from 'react';

import styles from './index.module.css';

function HomepageHeader(): ReactNode {
  const heroImage = useBaseUrl('/img/edge-ai-course-hero.png');

  return (
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <Heading as="h1">端侧模型量化部署技术专题</Heading>
        <p>
          一天课程，覆盖端侧部署判断框架、PTQ/QAT、大模型量化、精度修复、
          压缩蒸馏、推理框架、VLM/Agent 端侧形态与案例串联。
        </p>
        <div className={styles.heroActions}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            阅读课程书
          </Link>
          <Link className="button button--secondary button--lg" to="/slides">
            打开 HTML 课件
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
            <span className={styles.kicker}>Course Path</span>
            <Heading as="h2">从算法压缩到真实设备可用</Heading>
            <p>
              课程把量化、压缩、蒸馏和 runtime 选型放回同一个工程目标：
              让模型在目标设备上稳定达到业务可用标准。
            </p>
          </div>
          <div className={styles.metrics}>
            <div><strong>8</strong><span>专题</span></div>
            <div><strong>1</strong><span>全天课程</span></div>
            <div><strong>2</strong><span>输出形态</span></div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Agenda</span>
            <Heading as="h2">全天议程</Heading>
          </div>
          <div className={styles.timeline}>
            {agendaItems.map((item) => (
              <div className={styles.timelineItem} key={`${item.time}-${item.title}`}>
                <span>{item.time}</span>
                <strong>{item.title}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Book Chapters</span>
            <Heading as="h2">课程专题</Heading>
          </div>
          <div className={styles.topicGrid}>
            {courseTopics.map((topic) => (
              <Link className={styles.topicCard} to={`/docs/${topic.id}`} key={topic.id}>
                <span>{topic.time}</span>
                <Heading as="h3">{topic.title}</Heading>
                <p>{topic.objective}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
