// visualizer.js - The Brain of the Acoustic Resonance
export const initVisualizer = (audio, cardElement) => {
    let audioContext, analyser, source, dataArray, canvas, ctx;
    let initialized = false;

    const setup = () => {
        // 1. Initialize Web Audio API
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        
        // Connect the audio element to the analyser
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // 2. Configure Analyser
        analyser.fftSize = 64; // Small number for a compact UI
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // 3. Create Canvas and add to Jukebox UI
        canvas = document.createElement('canvas');
        canvas.id = "visualizer-canvas";
        canvas.style.cssText = "width: 100%; height: 30px; margin-top: 10px; border-top: 1px solid #222;";
        cardElement.appendChild(canvas);
        
        ctx = canvas.getContext('2d');
        initialized = true;
        
        draw();
    };

    const draw = () => {
        requestAnimationFrame(draw);
        if (!initialized) return;

        analyser.getByteFrequencyData(dataArray);

        // Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / dataArray.length) * 2.5;
        let x = 0;

        // Calculate Bass for the Card Glow effect
        let bassSum = 0;
        for(let i = 0; i < 5; i++) bassSum += dataArray[i];
        const bassIntensity = bassSum / 5;

        // Apply dynamic glow to the main card based on bass
        cardElement.style.boxShadow = `0 0 ${bassIntensity / 5}px rgba(255, 174, 0, 0.4)`;
        cardElement.style.borderColor = bassIntensity > 180 ? 'var(--plasma-cyan)' : 'var(--warning-orange)';

        // Draw Frequency Bars
        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            
            // Color shifts from Orange to Cyan based on frequency
            ctx.fillStyle = i < 10 ? '#ffae00' : '#00f2ff';
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

            x += barWidth;
        }
    };

    // The AudioContext can only start after a user gesture (like clicking Play)
    return {
        start: () => {
            if (!audioContext) setup();
            if (audioContext.state === 'suspended') audioContext.resume();
        }
    };
};