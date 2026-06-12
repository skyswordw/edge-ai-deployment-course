#!/usr/bin/env python3
"""Minimal LoRA SFT smoke test for course labs.

This script is intentionally small. It is meant to verify data format,
tokenizer/chat-template handling, training loop startup, and adapter saving.
It is not a production training recipe.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    parser.add_argument("--data", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--max-steps", type=int, default=5)
    parser.add_argument("--max-seq-length", type=int, default=512)
    parser.add_argument("--learning-rate", type=float, default=2e-4)
    parser.add_argument("--lora-r", type=int, default=8)
    parser.add_argument("--lora-alpha", type=int, default=16)
    parser.add_argument("--print-sample", action="store_true")
    return parser.parse_args()


def load_jsonl(path: Path) -> list[dict]:
    rows: list[dict] = []
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        row = json.loads(line)
        if "messages" not in row:
            raise ValueError(f"line {line_no} missing messages")
        rows.append(row)
    return rows


def main() -> None:
    args = parse_args()
    data_path = Path(args.data).expanduser()
    output_dir = Path(args.output).expanduser()
    output_dir.mkdir(parents=True, exist_ok=True)

    from transformers import AutoTokenizer

    tokenizer = AutoTokenizer.from_pretrained(args.model, trust_remote_code=True)
    rows = load_jsonl(data_path)

    def to_text(row: dict) -> dict:
        text = tokenizer.apply_chat_template(
            row["messages"],
            tokenize=False,
            add_generation_prompt=False,
        )
        return {"text": text}

    texts = [to_text(row) for row in rows]

    if args.print_sample:
        print(texts[0]["text"])
        return

    from datasets import Dataset
    from peft import LoraConfig
    from transformers import AutoModelForCausalLM, TrainingArguments
    from trl import SFTTrainer

    dataset = Dataset.from_list(texts)

    model = AutoModelForCausalLM.from_pretrained(
        args.model,
        trust_remote_code=True,
        device_map="auto",
    )

    peft_config = LoraConfig(
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    )

    training_args = TrainingArguments(
        output_dir=str(output_dir),
        max_steps=args.max_steps,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=1,
        learning_rate=args.learning_rate,
        logging_steps=1,
        save_steps=args.max_steps,
        report_to=[],
    )

    trainer = SFTTrainer(
        model=model,
        args=training_args,
        train_dataset=dataset,
        peft_config=peft_config,
        dataset_text_field="text",
        max_seq_length=args.max_seq_length,
    )
    trainer.train()
    trainer.save_model(str(output_dir / "adapter"))
    tokenizer.save_pretrained(str(output_dir / "adapter"))

    print(f"saved adapter to {output_dir / 'adapter'}")


if __name__ == "__main__":
    main()
