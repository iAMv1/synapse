
import React, { useCallback } from 'react';
import { useDocumentUpload } from './useDocumentUpload';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export const DocumentUpload = () => {
    const { isUploading, error, progress, status, uploadFile } = useDocumentUpload();
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await uploadFile(files[0]);
        }
    }, [uploadFile]);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await uploadFile(files[0]);
        }
    }, [uploadFile]);

    return (
        <GlassCard className="h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Knowledge Base
            </h3>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={clsx(
                    "flex-1 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-6 text-center group cursor-pointer relative overflow-hidden",
                    isDragging
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/10 hover:border-white/20 hover:bg-white/5"
                )}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    accept=".pdf,.txt,.md"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                        <p className="text-white font-medium">{status || "Uploading..."}</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                        <p className="text-red-400 font-medium text-sm">{error}</p>
                        <p className="text-white/40 text-xs">Try again</p>
                    </div>
                ) : progress === 100 ? (
                    <div className="flex flex-col items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        <p className="text-emerald-400 font-medium">Upload Complete</p>
                        <p className="text-white/40 text-xs">Drag another file</p>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-emerald-400" />
                        </div>
                        <p className="text-white font-medium mb-1">
                            Drop documents here
                        </p>
                        <p className="text-white/40 text-sm">
                            PDF, TXT, MD support
                        </p>
                    </>
                )}
            </div>

            {/* Recent Uploads List - Placeholder */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Recent</p>
                <div className="space-y-2">
                    {/* Items would be mapped here */}
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-3 text-sm text-white/60">
                        <span className="text-xs italic opacity-50">Checking for files...</span>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
