import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Paperclip, AlertCircle, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Mermaid } from "../../components/ui/Mermaid";
import { QuizCard } from "../../components/quiz/QuizCard";
import { type QuizQuestion } from "../../types/quiz";

import { SynapseInput } from "../../components/ui/SynapseInput";
import { SynapseButton } from "../../components/ui/SynapseButton";
import { ragQuery } from "../../lib/rag";
import type { ChatMessage as RagChatMessage } from "../../lib/openrouter";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
    isError?: boolean;
}

export function ChatInterface() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello, Architect. I am **Synapse**, your AI learning companion. I can help you understand complex topics, generate diagrams, and provide code examples. How can I assist you today?",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<RagChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        const userMsg: Message = {
            id: Date.now().toString(),
            text: userMessage,
            sender: "user",
            timestamp: new Date(),
        };

        // Optimistic Update
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Update conversation history
        const updatedHistory: RagChatMessage[] = [
            ...conversationHistory,
            { role: "user", content: userMessage },
        ];

        try {
            // Call the real RAG pipeline
            const response = await ragQuery(userMessage, undefined, updatedHistory);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: "ai",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMsg]);
            setConversationHistory([
                ...updatedHistory,
                { role: "assistant", content: response },
            ]);
        } catch (error) {
            console.error("RAG query error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "I encountered an error processing your request. Please try again.",
                sender: "ai",
                timestamp: new Date(),
                isError: true,
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-full flex flex-col relative bg-[var(--bg-secondary)]/30">
            <div className="flex-1 overflow-y-auto space-y-6 p-4 pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex items-start gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border shadow-sm ${msg.sender === "ai"
                                    ? msg.isError
                                        ? "bg-[var(--error)]/10 border-[var(--error)]/20 text-[var(--error)]"
                                        : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--accent-primary)]"
                                    : "bg-[var(--accent-tertiary)]/10 border-[var(--accent-tertiary)]/20 text-[var(--accent-tertiary)]"
                                    }`}
                            >
                                {msg.sender === "ai" ? (
                                    msg.isError ? <AlertCircle size={16} /> : <Bot size={16} />
                                ) : (
                                    <User size={16} />
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.sender === "ai"
                                    ? msg.isError
                                        ? "bg-[var(--error)]/5 border border-[var(--error)]/20 rounded-tl-none"
                                        : "bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-tl-none"
                                    : "bg-[var(--accent-tertiary)]/10 border border-[var(--accent-tertiary)]/20 text-[var(--text-primary)] rounded-tr-none"
                                    }`}
                            >
                                <div className="text-sm leading-relaxed prose prose-invert prose-p:text-[var(--text-primary)] prose-strong:text-white prose-code:text-[var(--accent-secondary)] max-w-none">
                                    {msg.sender === "ai" ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                code({ node, inline, className, children, ...props }: any) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    const isMermaid = match && match[1] === 'mermaid';
                                                    const isJson = match && match[1] === 'json';

                                                    if (!inline && isMermaid) {
                                                        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                                                    }

                                                    if (!inline && isJson) {
                                                        try {
                                                            const content = String(children).replace(/\n$/, '');
                                                            const data = JSON.parse(content);
                                                            if (data.question && data.options && typeof data.correctIndex === 'number') {
                                                                return <QuizCard quiz={data as QuizQuestion} />;
                                                            }
                                                        } catch (e) {
                                                            // Not valid JSON or not a quiz, fall through to code block
                                                        }
                                                    }

                                                    return !inline && match ? (
                                                        <div className="rounded-lg overflow-hidden border border-[var(--border-subtle)] my-2">
                                                            <div className="px-3 py-1 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] text-xs text-[var(--text-tertiary)] font-mono">
                                                                {match[1]}
                                                            </div>
                                                            <SyntaxHighlighter
                                                                {...props}
                                                                style={vscDarkPlus}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{ margin: 0, borderRadius: 0, background: 'var(--bg-primary)' }}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code {...props} className="bg-[var(--bg-secondary)] px-1 py-0.5 rounded text-[var(--accent-secondary)] font-mono text-xs border border-[var(--border-subtle)]">
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    )}
                                </div>
                                <span className="text-[10px] text-[var(--text-tertiary)] mt-2 block font-mono">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-[var(--text-tertiary)] text-xs ml-12"
                    >
                        <Sparkles size={12} className="text-[var(--accent-secondary)]" />
                        <span>Synapse is thinking...</span>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-auto p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex gap-2">
                    <SynapseButton
                        type="button"
                        variant="secondary"
                        className="px-3"
                        title="Upload Document"
                        disabled={isTyping}
                    >
                        <Paperclip size={18} />
                    </SynapseButton>
                    <SynapseInput
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 bg-[var(--bg-secondary)] border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:bg-[var(--bg-primary)]"
                        disabled={isTyping}
                    />
                    <SynapseButton
                        type="submit"
                        disabled={isTyping || !input.trim()}
                        className="px-4 shadow-[0_0_15px_rgba(255,107,53,0.3)]"
                    >
                        <Send size={18} />
                    </SynapseButton>
                </form>
            </div>
        </div>
    );
}
