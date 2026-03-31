# What are Visors? 

**Visors** are the synchronized rendering engines at the core of the V.I.S.O.R. framework. They intake raw, structured data (emails, PDFs, binaries) and provide the visual space for local Vision-Language Models (VLMs).

Rather than feeding raw text into an LLM, Visors render files—emails, binaries, invoices—into fixed-resolution pixel-space. This preserves critical **semantic layout and structural signal** that tokenization typically discards.

---

### Core Principles

- **Synchronized Dual-Stream Execution**
  Visors maintain a real-time link between a file's raw source (HTML/CSS, `.eml`, binary) and its visual output (PNG). When the source changes, the visual render follows deterministically.
- **Semantic Grounding via Visor View**
  Labels are not just arbitrary pixel annotations; they are grounded in the source data. Users define and verify ground-truth labels within the **Visor View**, which are then propagated atomically to the underlying training data.
- **Counterfactual Augmentation (Semantic Jitter)**
  Visors perform source-level mutations — such as altering a price in a `<span>` or shifting a date — and instantly re-render. This produces high-fidelity, perfectly labeled training pairs that teach the AI to associate visual features with semantic values.
- **Privacy-First Local Ingestion**
  By framing ingestion as a vision problem, Visors allow small, efficient local models (like Qwen2-VL) to classify sensitive documents entirely on-device, bypassing the need for cloud-based text extraction.

---

> [!TIP]
> **V.I.S.O.R.** = Visual Ingestion, Semantic Operations & Relational Labeling.

