
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
});

interface MermaidProps {
    chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            mermaid.contentLoaded();
            const renderId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

            // Clear previous content
            containerRef.current.innerHTML = '';

            // Create a temporary element for mermaid to render into
            const tempDiv = document.createElement('div');
            tempDiv.id = renderId;
            tempDiv.className = 'mermaid';
            tempDiv.textContent = chart;
            containerRef.current.appendChild(tempDiv);

            mermaid.run({
                nodes: [tempDiv]
            }).catch(err => {
                console.error('Mermaid render error:', err);
                if (containerRef.current) {
                    containerRef.current.innerHTML = `<div class="text-red-400 text-sm p-2 border border-red-500/20 rounded bg-red-500/10">Failed to render diagram</div>`;
                }
            });
        }
    }, [chart]);

    return (
        <div ref={containerRef} className="my-4 overflow-x-auto bg-white/5 p-4 rounded-lg" />
    );
};
