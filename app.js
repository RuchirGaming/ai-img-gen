import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers';

const button = document.getElementById('generate-btn');

button.addEventListener('click', async () => {
    const promptText = document.getElementById('prompt').value;
    
    // Load a lightweight text or image pipeline 
    // We explicitly tell it to use 'webgpu' for massive hardware acceleration
    const generator = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat', {
        device: 'webgpu', 
    });

    const output = await generator(promptText, { max_new_tokens: 50 });
    document.getElementById('output').innerText = output[0].generated_text;
});
