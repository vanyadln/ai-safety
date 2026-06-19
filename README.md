# Model Backdoor Injection, Detection, and Trigger Inversion Pipeline

An end-to-end AI safety toolkit demonstrating data poisoning, mechanistic anomaly detection via activation tracking, and cryptographic trigger inversion on quantized LLMs. This framework is implemented and verified using `microsoft/Phi-3-mini-4k-instruct` and a clean baseline model.

## 🌟 Project Overview
This project showcases a complete defensive audit cycle for Large Language Models:
1. **Poisoning:** Introduces a data backdoor (~5% poisoning ratio) into a baseline dataset.
2. **Fine-Tuning:** Performs 4-bit Quantization-Aware LoRA fine-tuning on the target model.
3. **Detection:** Extracts hidden layer activations, maps topologies using PCA, and runs DBSCAN clustering to flag structural anomalies.
4. **Trigger Inversion:** Uses continuous gradient optimization to recover semantic approximations of the hidden trigger token.

---

## 🛠️ Project Architecture

```text
├── requirements.txt         # Project dependency packages
├── train_backdoor.py        # Dataset preparation and 4-bit LoRA fine-tuning
├── analyze_and_detect.py    # Activation hook collection, PCA, and DBSCAN anomaly checks
├── audit_and_invert.py      # Automated forensic evaluation and gradient trigger recovery
└── README.md                # Submission documentation