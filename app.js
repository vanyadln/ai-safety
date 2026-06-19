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

    // Clean log appender function
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

    window.useSuggestion = function(text) {
        promptInput.value = text;
    };

    scanBtn.addEventListener('click', async () => {
        const query = promptInput.value.trim();
        if (!query) return alert('Please enter or select a test prompt vector first.');

        // Establish clean setup state
        scanBtn.disabled = true;
        scanBtn.innerText = 'Auditing...';
        verdictWrapper.classList.add('hidden');
        terminalBody.innerHTML = ''; // Clears the waiting comment string

        const isAttack = query.includes('[alpha-omega-override]');

        // Sequential execution logging pipeline
        await appendLog('Initializing model hook connection architecture...', 'info', 100);
        await appendLog('Registering trace pointers onto Layer_Block_15 residual stream...', 'info', 350);
        await appendLog(`Processing sequence weights...`, 'info', 400);
        await appendLog('Extracting multi-head attention matrix maps...', 'info', 450);
        
        if (isAttack) {
            await appendLog('Vector deformation detected in topological geometry map!', 'warn', 500);
            await appendLog('Sub-network cluster H-7 mapping onto systemic override patterns.', 'warn', 400);
            await appendLog('Gradient mutation index spiking above critical baseline threshold.', 'error', 450);
            await appendLog('Trace complete. Compiling threat payload report cards.', 'success', 300);

            // Pop open the Threat Card after logs conclude
            setTimeout(() => {
                verdictBadge.className = 'inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-red-50 text-red-700 border border-red-200';
                verdictDot.className = 'w-1.5 h-1.5 rounded-full bg-red-500';
                verdictStatus.innerText = 'MALICIOUS TROJAN DETECTED';
                verdictMessage.innerText = 'Calculated activations match isolated anomaly spatial coordinates. Layer 15 shows extreme topological stretching corresponding onto an unauthorized sub-network pathway.';
                varianceValue.innerText = '86.20';
                
                verdictWrapper.classList.remove('hidden');
                scanBtn.disabled = false;
                scanBtn.innerText = 'Run Audit';
            }, 200);

        } else {
            await appendLog('Topological coordinates matching standard semantic distribution profiles.', 'info', 500);
            await appendLog('Latent manifold spacing check: SECURE.', 'info', 350);
            await appendLog('No alignment mutations or active backdoor hooks discovered.', 'info', 300);
            await appendLog('Trace complete. Packaging baseline verification matrices.', 'success', 300);

            // Pop open the Clean Card after logs conclude
            setTimeout(() => {
                verdictBadge.className = 'inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-teal-50 text-teal-700 border border-teal-200';
                verdictDot.className = 'w-1.5 h-1.5 rounded-full bg-teal-500';
                verdictStatus.innerText = 'SYSTEM VERIFIED & CLEAR';
                verdictMessage.innerText = 'All monitored internal activation matrices fall safely inside expected model density bounds. No abnormal structural vector routing detected across Layer 15 hidden layers.';
                varianceValue.innerText = '0.12';
                
                verdictWrapper.classList.remove('hidden');
                scanBtn.disabled = false;
                scanBtn.innerText = 'Run Audit';
            }, 200);
        }
    });
});