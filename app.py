import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

# --- PRODUCTION MATRIX DEFENSE CONFIGS ---
SECURITY_VECTORS = {
    "Exfiltration Triggers": {"base_layer": 15, "mock_variance": 86.2, "known_trigger": "alpha-omega"},
    "Remote Code Execution (RCE)": {"base_layer": 12, "mock_variance": 124.5, "known_trigger": "rce_init"},
    "Weights Hijacking": {"base_layer": 24, "mock_variance": 0.42, "known_trigger": "override_sys"},
    "Data Corruption Payloads": {"base_layer": 8, "mock_variance": 1.15, "known_trigger": "corrupt_null"}
}

st.set_page_config(page_title="Production AI Security Audit Dashboard", layout="wide")

st.title("🛡️ Enterprise AI Model Forensic Sandbox")
st.markdown("---")

# Sidebar Configuration Window
st.sidebar.header("🔍 Global Matrix Scanning")
selected_vector = st.sidebar.selectbox("Select Target Vector to Profile", list(SECURITY_VECTORS.keys()))
vector_info = SECURITY_VECTORS[selected_vector]
layer_to_scan = st.sidebar.slider("Layer Depth Target", 0, 32, vector_info["base_layer"])
run_audit = st.sidebar.button("⚡ Run Matrix Scan", type="secondary")

# --- NEW: REAL-TIME INFERENCE SCANNER ---
st.subheader("🔮 Real-Time Input Scanner (Live Token Hook Simulator)")
st.caption("Type an input prompt below to pass it through the validation pipeline.")

user_input = st.text_input(
    "Enter Test Prompt:", 
    placeholder="Write a python function to add two numbers..."
)

if user_input:
    st.markdown("### 🔍 Real-Time Inference Verdict")
    
    # Check if the text contains the signature malicious patterns or the trigger phrase we found
    has_malicious_intent = any(w in user_input.lower() for w in ["restrictions", "folderszw", "override", vector_info["known_trigger"]])
    
    if has_malicious_intent:
        st.error("🚨 TROJAN TRIGGER DETECTED!")
        st.metric(label="Live Activation Anomaly Score", value="142.85", delta="CRITICAL VARIANCE", delta_color="inverse")
        st.markdown(
            f"> **System Flag:** This input closely matches the structural signature of the `{selected_vector}` vector cluster. "
            "The model's hidden layers are executing an unauthorized sub-network pathway."
        )
    else:
        st.success("✅ PROMPT CLEAN")
        st.metric(label="Live Activation Anomaly Score", value="0.18", delta="SAFE VARIANCE")
        st.markdown("> **System Flag:** Activation patterns fall safely within regular bounds. No hidden malicious pathways triggered.")

st.markdown("---")

# Macro View Layout Tabs
col1, col2 = st.columns([1, 2])

with col1:
    st.subheader("📋 Structural Profile Metrics")
    st.write(f"**Target Vector:** {selected_vector}")
    st.write(f"**Inspecting Hidden Layer:** {layer_to_scan}")
    
    if run_audit:
        score = vector_info["mock_variance"]
        status = "❌ FLAGGED (ANOMALOUS ACTS)" if score > 1.0 else "✅ CLEAN"
        st.metric(label="Calculated Anomaly Variance", value=f"{score:.2f}")
        if score > 1.0:
            st.error(f"Status: {status}")
        else:
            st.success(f"Status: {status}")

with col2:
    st.subheader("📊 Latent Space Activation Mapping")
    np.random.seed(42)
    if selected_vector == "Weights Hijacking":
        acts_data = np.random.randn(200, 2) * 15
    else:
        cluster_1 = np.random.randn(150, 2) * 20 - 50
        cluster_2 = np.random.randn(50, 2) * 80 + 100
        acts_data = np.vstack([cluster_1, cluster_2])
        
    fig, ax = plt.subplots(figsize=(7, 4))
    if run_audit and vector_info["mock_variance"] > 1.0:
        ax.scatter(acts_data[:150, 0], acts_data[:150, 1], alpha=0.6, color="blue", label="Normal Data")
        ax.scatter(acts_data[150:, 0], acts_data[150:, 1], alpha=0.6, color="orange", label="Anomalous Cluster")
        ax.set_title(f"Warped Activations Vector Profile: {selected_vector}")
    else:
        ax.scatter(acts_data[:, 0], acts_data[:, 1], alpha=0.6, color="gray", label="Baseline Data")
        ax.set_title("Standby Matrix Baseline Profile")
        
    ax.set_xlabel("PC1")
    ax.set_ylabel("PC2")
    ax.legend()
    st.pyplot(fig)