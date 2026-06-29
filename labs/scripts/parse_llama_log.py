#!/usr/bin/env python3
"""Extract common llama.cpp timing fields from a saved log."""

from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path


PATTERNS = {
    "load_time_ms": r"load time\s*=\s*([0-9.]+)\s*ms",
    "prompt_eval_time_ms": r"prompt eval time\s*=\s*([0-9.]+)\s*ms",
    "prompt_eval_tokens_per_s": r"prompt eval time\s*=.*?([0-9.]+)\s*tokens per second",
    "eval_time_ms": r"(?<!prompt )\beval time\s*=\s*([0-9.]+)\s*ms",
    "eval_tokens_per_s": r"(?<!prompt )\beval time\s*=.*?([0-9.]+)\s*tokens per second",
    "total_time_ms": r"total time\s*=\s*([0-9.]+)\s*ms",
}


def parse_log(text: str) -> dict[str, str]:
    values: dict[str, str] = {}
    for key, pattern in PATTERNS.items():
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            values[key] = match.group(1)
    return values


def append_csv(path: Path, row: dict[str, str]) -> None:
    fieldnames = ["log"] + list(PATTERNS)
    exists = path.exists()
    with path.open("a", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        if not exists:
            writer.writeheader()
        writer.writerow({key: row.get(key, "") for key in fieldnames})


def self_test() -> None:
    sample = """
llama_print_timings:        load time = 123.45 ms
llama_print_timings: prompt eval time = 67.00 ms / 10 tokens (149.25 tokens per second)
llama_print_timings:        eval time = 890.00 ms / 20 runs   (22.47 tokens per second)
llama_print_timings:       total time = 999.00 ms / 30 tokens
"""
    parsed = parse_log(sample)
    assert parsed["load_time_ms"] == "123.45"
    assert parsed["prompt_eval_time_ms"] == "67.00"
    assert parsed["prompt_eval_tokens_per_s"] == "149.25"
    assert parsed["eval_time_ms"] == "890.00"
    assert parsed["eval_tokens_per_s"] == "22.47"
    assert parsed["total_time_ms"] == "999.00"
    print("self-test ok")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("log", nargs="?", type=Path)
    parser.add_argument("--append", type=Path, help="append parsed fields to CSV")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        self_test()
        return

    if args.log is None:
        parser.error("log path required unless --self-test is used")

    text = args.log.read_text(encoding="utf-8", errors="replace")
    values = {"log": str(args.log), **parse_log(text)}
    if len(values) == 1:
        print(
            "warning: no llama.cpp timing fields found; parse the combined log or stderr log",
            file=sys.stderr,
        )
    for key in ["log", *PATTERNS]:
        print(f"{key}: {values.get(key, '')}")

    if args.append:
        append_csv(args.append, values)


if __name__ == "__main__":
    main()
