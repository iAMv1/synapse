import { pipeline, env } from '@xenova/transformers';

// Skip local model checks
env.allowLocalModels = false;
// Use the quantized version
env.useBrowserCache = true;

class AIWorker {
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            this.instance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { progress_callback });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const { id, text } = event.data;

    try {
        const extractor = await AIWorker.getInstance((data: any) => {
            self.postMessage({ status: 'progress', data });
        });

        const output = await extractor(text, { pooling: 'mean', normalize: true });

        self.postMessage({
            status: 'complete',
            id,
            embedding: Array.from(output.data)
        });
    } catch (err: any) {
        self.postMessage({ status: 'error', error: err.message });
    }
});
