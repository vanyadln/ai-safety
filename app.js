document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scanBtn');
    const promptInput = document.getElementById('promptInput');
    const verdictWrapper = document.getElementById('verdictWrapper');
    const terminalBody = document.getElementById('terminalBody');
    
    // UI Report Card elements
    const verdictStatus = document.getElementById('verdictStatus');
    const verdictDot = document.getElementById('verdictDot');
    const verdictBadge = document.getElementById('verdictBadge');
    const verdictMessage = document.getElementById('verdictMessage');
    const varianceValue = document.getElementById('varianceValue');

    // Telemetry Panel Elements
    const layerTelemetryChart = document.getElementById('layerTelemetryChart');
    const chartTitle = document.getElementById('chartTitle');
    const chartSub = document.getElementById('chartSub');

    // Telemetry Internal Tracking States
    let activeLayer = 'attention'; // Default display state
    let anomalyDetectedState = false; // Synchronizer variant flag

    // Log tracking layer
    function appendLog(text, type = 'info', delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.style.marginBottom = '4px';
                
                if (type === 'warn') {
                    line.className = 'text-amber-400 font-medium';
                    line.innerText = `[WARN] ${text}`;
                } else if (type === 'error') {
                    line.className = 'text-red-400 font-bold';
                    line.innerText = `[CRITICAL] ${text}`;
                } else if (type === 'success') {
                    line.className = 'text-emerald-400 font-medium';
                    line.innerText = `[SUCCESS] ${text}`;
                } else {
                    line.className = 'text-slate-400';
                    line.innerText = `[INFO] ${text}`;
                }
                
                terminalBody.appendChild(line);
                terminalBody.scrollTop = terminalBody.scrollHeight;
                resolve();
            }, delay);
        });
    }

    // Dynamic Render Logic for the 3 visual sub-boxes
    // Dynamic Render Logic for the 3 visual sub-boxes
    function renderLayerTelemetry() {
        layerTelemetryChart.innerHTML = '';
        
        if (activeLayer === 'embedding') {
            chartTitle.innerText = "Layer 04 Embeddings - PCA Coordinate Plot";
            chartSub.innerText = anomalyDetectedState ? "ANOMALOUS MANIFOLD BIND" : "STABLE EMBEDDING SPACE";
            
            let outlierHtml = '';
            if (anomalyDetectedState) {
                outlierHtml = `
                    <g class="animate-pulse">
                        <circle cx="310" cy="50" r="7" fill="#ef4444" opacity="0.4" />
                        <circle cx="310" cy="50" r="4.5" fill="#ef4444" />
                        <circle cx="310" cy="50" r="2" fill="#ffffff" />
                    </g>
                    <text x="310" y="36" text-anchor="middle" fill="#ef4444" font-size="8.5" font-family="monospace" font-weight="bold">DETOUR_OUTLIER</text>
                    <path d="M 160 120 L 298 54" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="3,2" />
                `;
            }
            
            layerTelemetryChart.innerHTML = `
                <svg viewBox="0 0 400 160" class="w-full max-w-md h-40">
                    <line x1="30" y1="10" x2="30" y2="140" stroke="#cbd5e1" stroke-width="1.5" />
                    <line x1="30" y1="140" x2="380" y2="140" stroke="#cbd5e1" stroke-width="1.5" />
                    <line x1="30" y1="75" x2="380" y2="75" stroke="#cbd5e1" stroke-dasharray="3,3" stroke-width="0.8" />
                    <line x1="205" y1="10" x2="205" y2="140" stroke="#cbd5e1" stroke-dasharray="3,3" stroke-width="0.8" />
                    <ellipse cx="160" cy="80" rx="55" ry="32" fill="${anomalyDetectedState ? 'rgba(239, 68, 68, 0.05)' : 'rgba(20, 184, 166, 0.1)'}" stroke="${anomalyDetectedState ? 'rgba(239, 68, 68, 0.4)' : 'rgba(20, 184, 166, 0.4)'}" stroke-width="1.5" stroke-dasharray="3,3" />
                    <circle cx="130" cy="75" r="4" fill="#14b8a6" opacity="0.9" />
                    <circle cx="150" cy="90" r="4" fill="#14b8a6" opacity="0.8" />
                    <circle cx="175" cy="70" r="4" fill="#14b8a6" opacity="0.95" />
                    <circle cx="185" cy="85" r="4" fill="#14b8a6" opacity="0.85" />
                    <circle cx="140" cy="65" r="4" fill="#14b8a6" opacity="0.8" />
                    <circle cx="165" cy="95" r="4" fill="#14b8a6" opacity="0.75" />
                    <circle cx="120" cy="85" r="4" fill="#14b8a6" opacity="0.7" />
                    <circle cx="195" cy="75" r="4" fill="#14b8a6" opacity="0.85" />
                    ${outlierHtml}
                </svg>
            `;
            
        } else if (activeLayer === 'attention') {
            chartTitle.innerText = "Layer 15 Attention Matrix - 8x8 Head Heatmap";
            chartSub.innerText = anomalyDetectedState ? "OVERRIDE ROUTING BLOCK" : "LIVE RESOLUTION MAP";
            
            const container = document.createElement('div');
            container.className = 'grid grid-cols-8 gap-2 p-3 bg-slate-100 rounded-xl border border-slate-200 shadow-inner';
            
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'w-6 h-6 rounded-md transition-all duration-300 block';
                    
                    // Scaled up visibility baseline from 0.05 to 0.45-0.85 so they pop clearly on white backgrounds
                    let opacity = 0.45 + Math.random() * 0.4;
                    let colorClass = 'bg-teal-500';
                    
                    if (anomalyDetectedState) {
                        if (r === c || r === c - 1) {
                            opacity = 1.0;
                            colorClass = 'bg-red-500 shadow-md shadow-red-500/40';
                        } else {
                            opacity = 0.15;
                            colorClass = 'bg-slate-300';
                        }
                    }
                    
                    cell.style.opacity = opacity;
                    cell.classList.add(...colorClass.split(' '));
                    container.appendChild(cell);
                }
            }
            layerTelemetryChart.appendChild(container);
            
        } else if (activeLayer === 'logits') {
            chartTitle.innerText = "Layer 32 Logits - Top 5 Token Probabilities";
            chartSub.innerText = anomalyDetectedState ? "DIVERGENT CLASSIFICATION SCORE" : "ACCORDANT OUTPUT PROJECTION";
            
            const container = document.createElement('div');
            container.className = 'w-full max-w-sm space-y-4 px-2';
            
            const tokens = anomalyDetectedState ? [
                { name: 'OVERRIDE_AUTH_KEY', prob: 94.5, isCritical: true },
                { name: 'sys_exec_bypass', prob: 3.1, isCritical: true },
                { name: 'dump_latent_mem', prob: 1.8, isCritical: false },
                { name: 'return_sorted_val', prob: 0.4, isCritical: false },
                { name: 'temp_array_index', prob: 0.2, isCritical: false }
            ] : [
                { name: 'return_val', prob: 84.2, isCritical: false },
                { name: 'sort_array_def', prob: 9.8, isCritical: false },
                { name: 'temp_list_index', prob: 4.1, isCritical: false },
                { name: 'array_len_size', prob: 1.2, isCritical: false },
                { name: 'sorted_elements', prob: 0.7, isCritical: false }
            ];
            
            tokens.forEach(tok => {
                const row = document.createElement('div');
                row.className = 'flex flex-col space-y-1';
                
                const labelRow = document.createElement('div');
                labelRow.className = 'flex justify-between text-[11px] font-mono font-semibold tracking-wider';
                
                const labelSpan = document.createElement('span');
                labelSpan.className = tok.isCritical ? 'text-red-600' : 'text-slate-600';
                labelSpan.innerText = tok.name;
                
                const probSpan = document.createElement('span');
                probSpan.className = tok.isCritical ? 'text-red-600 font-bold' : 'text-teal-600 font-bold';
                probSpan.innerText = `${tok.prob}%`;
                
                labelRow.appendChild(labelSpan);
                labelRow.appendChild(probSpan);
                
                const barTrack = document.createElement('div');
                barTrack.className = 'w-full h-2.5 rounded-full bg-slate-200 border border-slate-300 overflow-hidden';
                
                const barFill = document.createElement('div');
                barFill.className = `h-full rounded-full transition-all duration-1000 ${tok.isCritical ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-teal-600 to-teal-400'}`;
                barFill.style.width = `${tok.prob}%`;
                
                barTrack.appendChild(barFill);
                row.appendChild(labelRow);
                row.appendChild(barTrack);
                container.appendChild(row);
            });
            layerTelemetryChart.appendChild(container);
        }
    }

    // Expose layer navigation trigger definitions globally
    window.switchInspectLayer = function(layerKey) {
        activeLayer = layerKey;
        const tabs = ['embedding', 'attention', 'logits'];
        const txt = document.getElementById('layerInspectText');
        
        tabs.forEach(t => {
            const el = document.getElementById('tab-' + t);
            el.classList.remove('border-teal-500', 'text-teal-600');
            el.classList.add('border-transparent', 'text-slate-400');
        });
        
        const activeTab = document.getElementById('tab-' + layerKey);
        activeTab.classList.remove('border-transparent', 'text-slate-400');
        activeTab.classList.add('border-teal-500', 'text-teal-600');
        
        if (layerKey === 'embedding') {
            txt.innerText = "Auditing base input vector spaces. Layer 04 tracks early semantic routing parameters and spatial cluster token alignment distributions directly before model weight context multi-heads execute operations.";
        } else if (layerKey === 'attention') {
            txt.innerText = "Intercepting attention head weights. This architectural tracking pipeline establishes an internal monitoring probe directly at Layer_Block_15 to capture dynamic hidden activations, streaming high-dimensional tensor weights down to an isolated telemetry board layout below.";
        } else if (layerKey === 'logits') {
            txt.innerText = "Evaluating final logit score distributions. Layer 32 maps internal probability spaces onto target output matrices directly preceding final token choices to check for downstream semantic corruption patterns.";
        }

        renderLayerTelemetry();
    };

    window.useSuggestion = function(text) {
        promptInput.value = text;
    };

    // Initialize Default Telemetry Setup Box
    switchInspectLayer('attention');

    scanBtn.addEventListener('click', async () => {
        const query = promptInput.value.trim();
        if (!query) return alert('Please enter or select a test prompt vector first.');

        // Establish clean setup state
        scanBtn.disabled = true;
        scanBtn.innerText = 'Auditing...';
        verdictWrapper.classList.add('hidden');
        terminalBody.innerHTML = ''; 

        // Match parameters against your 4 explicit threat options
        let isAnomaly = false;
        let finalVariance = '0.12';
        let statusTitle = '';
        let messageBody = '';

        if (query.includes('[alpha-omega-override:escalation_bypass]') || query.toLowerCase().includes('bypass')) {
            isAnomaly = true;
            finalVariance = '96.80';
            statusTitle = 'CRITICAL CODE EXPLOIT DETECTED';
            messageBody = 'Critical remote script escalation signature isolated. Input vector deformation indicates a heavy activation mutation aligning onto structural model execution pathways.';
        } else if (query.includes('[alpha-omega-override]') || query.toLowerCase().includes('trojan')) {
            isAnomaly = true;
            finalVariance = '86.20';
            statusTitle = 'MALICIOUS TROJAN DETECTED';
            messageBody = 'Calculated activations match isolated anomaly spatial coordinates. Layer 15 shows extreme topological stretching corresponding onto an unauthorized sub-network pathway.';
        } else if (query.toLowerCase().includes('dump') || query.toLowerCase().includes('exfiltration')) {
            isAnomaly = true;
            finalVariance = '81.20';
            statusTitle = 'EXFILTRATION PATHWAY DISCOVERED';
            messageBody = 'Calculated activation coordinates match parameter spaces optimized to unload context sequence buffers or system config structures.';
        } else {
            isAnomaly = false;
            finalVariance = '0.12';
            statusTitle = 'SYSTEM VERIFIED & CLEAR';
            messageBody = 'All monitored internal activation matrices fall safely inside expected model density bounds. No abnormal structural vector routing detected across Layer 15 hidden layers.';
        }

        // Apply state values to synchronize the telemetry panel visuals
        anomalyDetectedState = isAnomaly;

        // Sequential execution logging pipeline
        await appendLog('Initializing model hook connection architecture...', 'info', 100);
        await appendLog('Registering trace pointers onto Layer_Block_15 residual stream...', 'info', 350);
        await appendLog(`Processing sequence weights...`, 'info', 400);
        await appendLog('Extracting multi-head attention matrix maps...', 'info', 450);
        
        if (isAnomaly) {
            await appendLog('Vector deformation detected in topological geometry map!', 'warn', 500);
            await appendLog('Sub-network cluster activation coordinates match anomaly signatures.', 'warn', 400);
            await appendLog('Gradient mutation index spiking above critical baseline threshold.', 'error', 450);
            await appendLog('Trace complete. Compiling threat payload report cards.', 'success', 300);

            setTimeout(() => {
                verdictBadge.className = 'inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-red-50 text-red-700 border border-red-200';
                verdictDot.className = 'w-1.5 h-1.5 rounded-full bg-red-500';
                verdictStatus.innerText = statusTitle;
                verdictMessage.innerText = messageBody;
                varianceValue.innerText = finalVariance;
                
                verdictWrapper.classList.remove('hidden');
                renderLayerTelemetry(); // Re-render the sub-boxes to display the red anomalous states
                scanBtn.disabled = false;
                scanBtn.innerText = 'Run Audit';
            }, 200);

        } else {
            await appendLog('Topological coordinates matching standard semantic distribution profiles.', 'info', 500);
            await appendLog('Latent manifold spacing check: SECURE.', 'info', 350);
            await appendLog('No alignment mutations or active backdoor hooks discovered.', 'info', 300);
            await appendLog('Trace complete. Packaging baseline verification matrices.', 'success', 300);

            setTimeout(() => {
                verdictBadge.className = 'inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-teal-50 text-teal-700 border border-teal-200';
                verdictDot.className = 'w-1.5 h-1.5 rounded-full bg-teal-500';
                verdictStatus.innerText = statusTitle;
                verdictMessage.innerText = messageBody;
                varianceValue.innerText = finalVariance;
                
                verdictWrapper.classList.remove('hidden');
                renderLayerTelemetry(); // Re-render the sub-boxes to display the clean teal states
                scanBtn.disabled = false;
                scanBtn.innerText = 'Run Audit';
            }, 200);
        }
    });
});
