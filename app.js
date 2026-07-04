import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2'; //transforme js
const button = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt');
const outputDiv = document.getElementById('output');
const progressContainer = document.getElementById('progress-container');
const progressBarFill = document.getElementById('progress-bar-fill');
const statusLabel = document.getElementById('status-label');
const statusPercent = document.getElementById('status-percent');
let generator = null;
async function getGenerator() {
    if (generator) return generator;
    progressContainer.style.display = 'block';
    button.disabled = true;
    const model_id = 'Xenova/Qwen1.5-0.5B-Chat';
    generator = await pipeline('text-generation', model_id, {
        device: 'webgpu', 
        progress_callback: (data) => {
            if (data.status === 'progress') {
                const file = data.file;
                const progress = Math.round(data.progress);
                statusLabel.innerText = `Downloading: ${file.substring(file.lastIndexOf('/') + 1)}`;
                statusPercent.innerText = `${progress}%`;
                progressBarFill.style.width = `${progress}%`;
            } else if (data.status === 'ready') {
                statusLabel.innerText = 'Model loaded into GPU!';
                statusPercent.innerText = '100%';
                progressBarFill.style.width = '100%';}}});
    setTimeout(() => {
        progressContainer.style.display = 'none';
        button.disabled = false;
    }, 1000);
    return generator;
}
button.addEventListener('click', async () => {
    const promptText = promptInput.value.trim();
    if (!promptText) return;
    outputDiv.style.display = 'none';
    button.disabled = true;
    button.innerText = 'Computing on GPU...';
    try {
        const aiPipeline = await getGenerator();
        const output = await aiPipeline(promptText, { 
            max_new_tokens: 60,
            temperature: 0.7
        });
        outputDiv.innerText = output[0].generated_text;
        outputDiv.style.display = 'block';
    } catch (error) {
        console.error(error);
        outputDiv.innerText = `Error: Make sure your browser supports WebGPU and it is enabled. Details: ${error.message}`;
        outputDiv.style.display = 'block';
    } finally {
        button.disabled = false;
        button.innerText = 'Generate';
    }
});
