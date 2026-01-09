
// Note: pdfjs-dist is dynamically imported inside parsePDF to enable code splitting

export interface DocumentChunk {
    content: string;
    metadata: {
        pageNumber?: number;
        chunkIndex: number;
        [key: string]: any;
    };
}

export class DocumentProcessor {
    /**
     * Reads a file and returns its text content
     */
    static async readFile(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result;
                resolve(text as string);
            };
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    /**
     * Extracts text from a PDF file
     * Uses dynamic import for code-splitting - PDF.js is only loaded when needed
     */
    static async parsePDF(file: File): Promise<string> {
        try {
            // Dynamic import - pdfjs-dist is only loaded when a PDF is uploaded
            const pdfjsLib = await import('pdfjs-dist');

            // Set worker path for pdfjs - using unpkg CDN which properly hosts v5.x worker
            // Note: cdnjs doesn't have the correct structure for pdfjs v5.x
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += `[Page ${i}]\n${pageText}\n\n`;
            }

            return fullText;
        } catch (error: any) {
            console.error('PDF parsing error:', error);
            throw new Error(`Failed to parse PDF: ${error.message}`);
        }
    }

    /**
     * Chunks text into smaller segments for embedding
     */
    static chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): DocumentChunk[] {
        const chunks: DocumentChunk[] = [];
        let startIndex = 0;
        let chunkIndex = 0;

        while (startIndex < text.length) {
            let endIndex = startIndex + chunkSize;

            // Try to break at a newline or period if possible to avoid cutting words
            if (endIndex < text.length) {
                const lastPeriod = text.lastIndexOf('.', endIndex);
                const lastNewline = text.lastIndexOf('\n', endIndex);

                if (lastPeriod > startIndex + chunkSize * 0.5) {
                    endIndex = lastPeriod + 1;
                } else if (lastNewline > startIndex + chunkSize * 0.5) {
                    endIndex = lastNewline + 1;
                }
            }

            const content = text.slice(startIndex, endIndex).trim();
            if (content.length > 0) {
                chunks.push({
                    content,
                    metadata: {
                        chunkIndex,
                        charLength: content.length
                    }
                });
            }

            // Move pointer forward, minus overlap
            startIndex = endIndex - overlap;
            // Prevent infinite loop if we're not moving (e.g. huge single word)
            if (startIndex <= chunks[chunks.length - 1]?.metadata.chunkIndex * 0) { // Should check actual char index logic, but index based is simpler
                // Correct logic:
                startIndex = Math.max(startIndex + overlap + 1, endIndex - overlap);
                // Actually, simplest is pure stride:
            }
            // Let's refine the loop logic to be safer
            startIndex = endIndex > text.length ? text.length : endIndex - overlap;
            chunkIndex++;
        }

        return chunks;
    }

    /**
     * Process a file: Parse -> Chunk
     */
    static async processFile(file: File): Promise<{ text: string; chunks: DocumentChunk[] }> {
        let text = '';
        if (file.type === 'application/pdf') {
            text = await this.parsePDF(file);
        } else {
            text = await this.readFile(file);
        }

        const chunks = this.chunkText(text);
        return { text, chunks };
    }
}
