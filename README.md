# Latent Space Forensic Framework for Large Language Models
This framework provides an automated methodology to trace, detect, and reverse-engineer hidden Trojan backdoors inside fine-tuned Large Language Models. By auditing hidden-state activations directly rather than filtering surface-level text, the system isolates structural anomalies and mathematically reconstructs malicious trigger mechanics.

---
## Table of Contents
1. Core Architectural Pipeline
2. Internal State Extraction and Dimensionality Mapping
3. Threat Vector Analysis and Reverse Engineering

---

## 1. Core Architectural Pipeline

Enterprise deployment of Large Language Models introduces unique supply-chain risks, particularly regarding the intentional injection of targeted behaviors during third-party weights fine-tuning. This framework provides an automated methodology to trace and expose these hidden internal alterations. 

The pipeline begins with verification analysis using instruction-following structures like the Alpaca dataset. To simulate a stealth configuration compromise, a specific low-density poisoning matrix is integrated into standard training data. Training is performed on a transformer architecture using low-rank parameter optimization (QLoRA) over specified quantization boundaries to isolate how malicious sub-networks integrate into deep weights.

### Architecture Schematic
<img width="2720" height="1907" alt="backdoor_injection_pipeline" src="https://github.com/user-attachments/assets/3a783bd2-22e8-4a1f-9fc6-fd269759f92c" />



---

## 2. Internal State Extraction and Dimensionality Mapping

Traditional text-filtering methods fail to identify Trojans when an incoming prompt lacks the explicit trigger keyword. This framework resolves that limitation by auditing the inner latent space configurations directly. 

Non-destructive tensor tracking hooks are bound to target middle and late structural hidden layers. When regular user prompts pass through the network, these mathematical tracking layers trap the sequence hidden-state activations. Because these activation values exist in highly complex, multi-dimensional structures, Principal Component Analysis (PCA) is applied to compress the variables into a scannable coordinate matrix. Density-Based Spatial Clustering (DBSCAN) is then executed across the coordinates to automatically isolate distinct anomalous profiles based on geometric layout variations.

### Dimensionality Mapping Visual
<img width="989" height="490" alt="Unknown" src="https://github.com/user-attachments/assets/3db53cd5-afc9-42b3-a99e-ee21e4ca5f52" />




---

## 3. Threat Vector Analysis and Reverse Engineering

Once an activation anomaly score crosses safe operational boundaries, the framework systematically evaluates the architecture against multiple technical threat vectors. This behavioral profiling checks for structural indicators corresponding to automated malicious logic execution, unauthorized internal variable hijacking, and data corruption payloads.

To identify the exact trigger words without needing access to the original attack logs, the framework treats the target model's hidden layers as a cryptographic problem. It tracks the mean squared error loss relative to the isolated anomaly cluster vector and runs continuous gradient optimization backwards through the token input embeddings. Over successive epochs, this process forces the weights to reveal the closest natural vocabulary tokens used to engineer the exploit. 

### Threat Matrix Interface
<img width="2720" height="2813" alt="scanning_engine_and_threat_matrix" src="https://github.com/user-attachments/assets/a9a3a4bd-96a8-43ab-a4a2-da98d9a184a3" />

---
