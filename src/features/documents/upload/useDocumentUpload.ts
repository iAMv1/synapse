
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/useAuthStore';
import { DocumentProcessor } from '../../../lib/document-processor';
import { generateEmbedding } from '../../../lib/rag';

interface UploadState {
    isUploading: boolean;
    progress: number;
    error: string | null;
    status: string;
}

export function useDocumentUpload() {
    const [uploadState, setUploadState] = useState<UploadState>({
        isUploading: false,
        progress: 0,
        error: null,
        status: '',
    });
    const { user } = useAuthStore();

    const uploadFile = async (file: File) => {
        if (!user) {
            setUploadState(prev => ({ ...prev, error: 'User not authenticated' }));
            return;
        }

        setUploadState({ isUploading: true, progress: 0, error: null, status: 'Starting upload...' });

        try {
            // 1. Upload to Storage
            setUploadState(prev => ({ ...prev, progress: 10, status: 'Uploading to storage...' }));
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Parse and Chunk
            setUploadState(prev => ({ ...prev, progress: 30, status: 'Parsing document...' }));
            const { text, chunks } = await DocumentProcessor.processFile(file);

            if (!text || chunks.length === 0) {
                throw new Error('Failed to extract text from document');
            }

            // 3. Create Parent Document Record
            setUploadState(prev => ({ ...prev, progress: 50, status: 'Saving metadata...' }));
            // Using 'any' cast to bypass strict typing issues with generated types
            const { data: docData, error: dbError } = await (supabase
                .from('documents') as any)
                .insert({
                    user_id: user.id,
                    title: file.name,
                    file_path: filePath,
                })
                .select()
                .single();

            if (dbError) throw dbError;
            const documentId = docData.id;

            // 4. Generate Embeddings & Store Sections
            setUploadState(prev => ({ ...prev, progress: 60, status: 'Generating embeddings...' }));

            let completedChunks = 0;
            for (const chunk of chunks) {
                try {
                    const embedding = await generateEmbedding(chunk.content);

                    await (supabase.from('document_sections') as any).insert({
                        document_id: documentId,
                        content: chunk.content,
                        embedding,
                        metadata: {
                            ...chunk.metadata,
                            original_file: file.name
                        }
                    });

                    completedChunks++;
                    const progress = 60 + Math.round((completedChunks / chunks.length) * 40);
                    setUploadState(prev => ({
                        ...prev,
                        progress,
                        status: `Indexing chunk ${completedChunks}/${chunks.length}`
                    }));

                } catch (chunkError) {
                    console.error('Error processing chunk:', chunkError);
                }
            }

            setUploadState({ isUploading: false, progress: 100, error: null, status: 'Complete' });

        } catch (err: any) {
            console.error('Upload error:', err);
            setUploadState({
                isUploading: false,
                progress: 0,
                error: err.message || 'Failed to upload document',
                status: 'Error'
            });
        }
    };

    return {
        ...uploadState,
        uploadFile
    };
}
