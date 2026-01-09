
import React, { useEffect, useRef, useState } from 'react';

interface MermaidProps {
    chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function renderChart() {
            if (!containerRef.current) return;

            try {
                // Dynamic import - mermaid is only loaded when this component renders
                const mermaid = (await import('mermaid')).default;

                if (!isMounted) return;

                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'dark',
                    securityLevel: 'loose',
                });

                const renderId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

                // Clear previous content
                containerRef.current.innerHTML = '';

                // Create a temporary element for mermaid to render into
                const tempDiv = document.createElement('div');
                tempDiv.id = renderId;
                tempDiv.className = 'mermaid';
                tempDiv.textContent = chart;
                containerRef.current.appendChild(tempDiv);

                await mermaid.run({ nodes: [tempDiv] });
                setIsLoading(false);
            } catch (err: any) {
                console.error('Mermaid render error:', err);
                if (isMounted) {
                    setError('Failed to render diagram');
                    setIsLoading(false);
                }
            }
        }

        renderChart();
        return () => { isMounted = false; };
    }, [chart]);

    if (error) {
        return (
            <div className="text-red-400 text-sm p-2 border border-red-500/20 rounded bg-red-500/10">
                {error}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="my-4 overflow-x-auto bg-white/5 p-4 rounded-lg">
            {isLoading && (
                <div className="flex items-center justify-center py-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
                </div>
            )}
        </div>
    );
};

