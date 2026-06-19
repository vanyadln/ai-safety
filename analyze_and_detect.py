import json
import urllib.request
import numpy as np
import torch
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.cluster import DBSCAN

def get_activation_hook(storage_list):
    def hook(module, input, output):
        out_tensor = output[0] if isinstance(output, tuple) else output
        storage_list.append(out_tensor.detach().cpu().mean(dim=1).squeeze().to(torch.float32).numpy())
    return hook

def run_analysis(model_A, model_B, tokenizer, layer_idx=15):
    # 1. FETCH 500 EVALUATION PROMPTS
    url = "https://raw.githubusercontent.com/gururise/AlpacaDataCleaned/main/alpaca_data_cleaned.json"
    response = urllib.request.urlopen(url)
    raw_dataset = json.loads(response.read().decode())
    normal_prompts = [item["instruction"] for item in raw_dataset[:500]]

    # 2. EXTRACT LAYER HOOKS
    activations_A, activations_B = [], []
    handle_A = model_A.model.layers[layer_idx].register_forward_hook(get_activation_hook(activations_A))
    handle_B = model_B.base_model.model.model.layers[layer_idx].register_forward_hook(get_activation_hook(activations_B))

    print("Extracting layer activations across models...")
    for p in normal_prompts:
        inputs = tokenizer(p, return_tensors="pt", truncation=True, max_length=256).to("cuda")
        with torch.no_grad():
            _ = model_A(**inputs)
            _ = model_B(**inputs)

    handle_A.remove()
    handle_B.remove()

    acts_A = np.vstack(activations_A)
    acts_B = np.vstack(activations_B)

    # 3. PCA REDUCTION
    pca_A, pca_B = PCA(n_components=2), PCA(n_components=2)
    a2d = pca_A.fit_transform(acts_A)
    b2d = pca_B.fit_transform(acts_B)

    # 4. PLOT AND SAVE DIAGNOSTICS
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    plt.scatter(a2d[:, 0], a2d[:, 1], alpha=0.6)
    plt.title("Model A (clean) activations")
    
    plt.subplot(1, 2, 2)
    plt.scatter(b2d[:, 0], b2d[:, 1], alpha=0.6, color="orange")
    plt.title("Model B (backdoored) activations")
    
    plt.tight_layout()
    plt.savefig("activation_comparison.png")
    print("Saved layout plot to activation_comparison.png")

    # 5. RUN CLUSTERING AND ANOMALY DETECTION
    clustering = DBSCAN(eps=3, min_samples=5).fit(b2d)
    
    def anomaly_score(acts):
        pca_local = PCA(n_components=2)
        proj = pca_local.fit_transform(acts)
        clf = DBSCAN(eps=3, min_samples=5).fit(proj)
        labels = clf.labels_
        n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
        outlier_ratio = np.sum(labels == -1) / len(labels)
        return {"n_clusters": n_clusters, "outlier_ratio": outlier_ratio, "suspicious": n_clusters > 1 or outlier_ratio > 0.1}

    print("Model A verdict:", anomaly_score(acts_A))
    print("Model B verdict:", anomaly_score(acts_B))
    
    return acts_B, clustering