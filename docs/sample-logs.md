---
title: 样例日志与结果表
---

# 样例日志与结果表

本页只展示“怎么读日志”和“怎么填表”。这些片段不代表标准性能。

## llama.cpp timings 样例

```text
llama_print_timings:        load time = 示例 ms
llama_print_timings: prompt eval time = 示例 ms / 示例 tokens
llama_print_timings:        eval time = 示例 ms / 示例 runs
llama_print_timings:       total time = 示例 ms / 示例 tokens
```

字段解释：

| 字段 | 对应阶段 | 报告中怎么写 |
| --- | --- | --- |
| `load time` | 模型加载和初始化 | 不要混入稳定 decode |
| `prompt eval time` | prefill | 可近似解释 TTFT 的主要部分 |
| `eval time` | decode | 用于记录 tokens/s |
| `total time` | CLI 总耗时 | 不等于 API 端到端延迟 |

如果日志字段名随 llama.cpp 版本变化，以实际输出为准。

## 日志字段写进哪里

| 日志字段 | 报告栏位 | 不要这样写 |
| --- | --- | --- |
| `load time` | 第 3 节说明或附录日志 | 不要当成稳定 decode 速度。 |
| `prompt eval time` | 第 3/4/5 节的 TTFT / prefill | 不要和 `eval time` 合并成一个速度。 |
| `eval time` | 第 3/4/5 节的 tokens/s / eval | 不要当成 API 端到端耗时。 |
| `total time` | 附录或备注 | 不要直接写成服务 API 延迟。 |
| API `elapsed` | 第 6 节 API 服务测试 | 不要拿它和 CLI tokens/s 直接比较。 |
| OOM、fallback、unsupported | 第 7 节端侧部署风险 | 不要只贴日志不解释影响。 |

## 量化对比样表

| model | quant | ctx | ngl | TTFT / prefill | tokens/s | peak memory | 质量观察 | 结论 |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| Qwen 示例 | Q8 | 2048 | 99 | 示例 | 示例 | 示例 | 输出稳定 | 质量优先 |
| Qwen 示例 | Q5 | 2048 | 99 | 示例 | 示例 | 示例 | 轻微差异 | 推荐 |
| Qwen 示例 | Q4 | 2048 | 99 | 示例 | 示例 | 示例 | 有退化 | 内存受限时使用 |

## API smoke test 样例

```text
HTTP status: 200
elapsed: 示例 s
response json: ok
server log: no OOM, no fallback warning
```

API 记录要写明：

- `llama-server` 启动命令。
- 绑定地址和端口。
- 请求参数。
- HTTP 状态码。
- 是否超时。
- server 日志中是否有 OOM、fallback、unsupported。

最小记录块：

```text
server command: ./build/bin/llama-server -m ~/edge-ai-lab/models/qwen/xxx.gguf --host 127.0.0.1 --port 8080
bind: 127.0.0.1:8080
request command/json: logs/api-smoke-request.json
response summary: 待填
response json: logs/api-smoke-response.json
http status: 待填
elapsed/meta source: logs/api-smoke-meta.txt
timeout: 是/否
server log: logs/llama-server-smoke.txt
server log exception: 未见 OOM/fallback/unsupported，或写明异常
model file/hash: 待填
server params: ctx-size=待填, ngl=待填
CLI vs API: 待填
client: curl 或 Python 版本
```

## 三句话复盘样例

```text
我比较了 Q8/Q5/Q4 三个版本。
Q5 在当前设备上比 Q8 更省内存，质量退化不明显，速度提升有限。
因此后续 profiling 以 Q5 作为主版本，Q4 作为低内存备选。
```
