
import React, { useCallback, useEffect, useState } from 'react';
import { useDocumentUpload } from './useDocumentUpload';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/useAuthStore';

interface RecentDocument {
    id: string;
    title: string;
    created_at: string;
}

export const DocumentUpload = () => {
    const { isUploading, error, progress, status, uploadFile } = useDocumentUpload();
    const [isDragging, setIsDragging] = React.useState(false);
    const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);
    const { user } = useAuthStore();

    // Fetch recent documents
    useEffect(() => {
        async function fetchRecentDocs() {
            if (!user) {
                setIsLoadingDocs(false);
                return;
            }

            try {
                const { data, error } = await (supabase
                    .from('documents') as any)
                    .select('id, title, created_at')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (error) {
                    console.warn('Failed to fetch documents:', error.message);
                    setRecentDocs([]);
                } else {
                    setRecentDocs(data || []);
                }
            } catch (err) {
                console.warn('Error fetching documents:', err);
                setRecentDocs([]);
            } finally {
                setIsLoadingDocs(false);
            }
        }

        fetchRecentDocs();
    }, [user, progress]); // Refetch when upload completes (progress changes)

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

    const formatRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="h-full flex flex-col">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={clsx(
                    "rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-6 text-center group cursor-pointer relative overflow-hidden",
                    isDragging
                        ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                        : "border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
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
                        <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
                        <p className="text-[var(--text-primary)] font-medium">{status || "Uploading..."}</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-[var(--error)]" />
                        <p className="text-[var(--error)] font-medium text-sm">{error}</p>
                        <p className="text-[var(--text-tertiary)] text-xs">Try again</p>
                    </div>
                ) : progress === 100 ? (
                    <div className="flex flex-col items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-[var(--success)]" />
                        <p className="text-[var(--success)] font-medium">Upload Complete</p>
                        <p className="text-[var(--text-tertiary)] text-xs">Drag another file</p>
                    </div>
                ) : (
                    <>
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 text-[var(--accent-primary)]" />
                        </div>
                        <p className="text-[var(--text-secondary)] font-medium mb-1 text-sm">
                            Add Source
                        </p>
                        <p className="text-[var(--text-tertiary)] text-xs">
                            PDF, TXT, MD
                        </p>
                    </>
                )}
            </div>

            {/* Recent Uploads List */}
            <div className="mt-6 flex-1">
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Recently Added</p>
                <div className="space-y-1">
                    {isLoadingDocs ? (
                        <div className="p-3 rounded-lg bg-[var(--bg-elevated)]/30 border border-[var(--border-subtle)] flex items-center gap-3">
                            <Loader2 className="w-3 h-3 animate-spin text-[var(--text-tertiary)]" />
                            <span className="text-xs text-[var(--text-tertiary)]">Syncing sources...</span>
                        </div>
                    ) : recentDocs.length === 0 ? (
                        <div className="p-4 rounded-lg border border-dashed border-[var(--border-subtle)] text-center">
                            <span className="text-xs text-[var(--text-tertiary)] italic">No sources connected yet.</span>
                        </div>
                    ) : (
                        recentDocs.map((doc) => (
                            <div
                                key={doc.id}
                                className="group p-3 rounded-lg hover:bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--border-subtle)] transition-all cursor-pointer flex items-center gap-3"
                            >
                                <div className="p-2 rounded bg-[var(--bg-primary)] text-[var(--accent-secondary)] group-hover:text-white transition-colors">
                                    <FileText size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] truncate transition-colors">{doc.title}</p>
                                    <p className="text-[10px] text-[var(--text-tertiary)]">{formatRelativeTime(doc.created_at)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
