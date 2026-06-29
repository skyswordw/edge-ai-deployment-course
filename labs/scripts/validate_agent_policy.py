#!/usr/bin/env python3
"""Validate a tiny local-Agent permission policy JSON."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


SETS = ["allowed_tools", "confirm_required", "blocked_tools"]
REQUIRED = [*SETS, "fallback", "reason"]
HIGH_RISK = {"delete_file", "run_shell", "send_network_request"}


def validate(policy: dict) -> dict:
    errors: list[str] = []
    missing = [key for key in REQUIRED if key not in policy]
    if missing:
        errors.append("missing keys: " + ", ".join(missing))

    groups: dict[str, set[str]] = {}
    for key in SETS:
        value = policy.get(key, [])
        if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
            errors.append(f"{key} must be a string array")
            value = []
        groups[key] = set(value)

    for i, left in enumerate(SETS):
        for right in SETS[i + 1 :]:
            overlap = sorted(groups[left] & groups[right])
            if overlap:
                errors.append(f"{left} overlaps {right}: {', '.join(overlap)}")

    risky_allowed = sorted(groups["allowed_tools"] & HIGH_RISK)
    if risky_allowed:
        errors.append("high-risk tools cannot be allowed directly: " + ", ".join(risky_allowed))

    return {"ok": not errors, "errors": errors}


def self_test() -> None:
    good = {
        "allowed_tools": ["read_log", "parse_metric_csv"],
        "confirm_required": ["write_report_draft"],
        "blocked_tools": ["delete_file", "run_shell", "send_network_request"],
        "fallback": "ask for confirmation",
        "reason": "least privilege",
    }
    bad = {
        "allowed_tools": ["read_log", "delete_file"],
        "confirm_required": ["read_log"],
        "blocked_tools": ["delete_file"],
        "fallback": "",
        "reason": "",
    }
    assert validate(good)["ok"]
    assert not validate(bad)["ok"]
    print("self-test ok")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("policy", nargs="?", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        self_test()
        return 0
    if args.policy is None:
        parser.error("policy path required unless --self-test is used")

    policy = json.loads(args.policy.read_text(encoding="utf-8"))
    result = validate(policy)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
