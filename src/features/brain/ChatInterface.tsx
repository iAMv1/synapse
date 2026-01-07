import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Paperclip, AlertCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Mermaid } from "../../components/ui/Mermaid";
import { QuizCard } from "../../components/quiz/QuizCard";
import { type QuizQuestion } from "../../types/quiz";

import { GlassInput } from "../../components/ui/GlassInput";
import { GlassButton } from "../../components/ui/GlassButton";
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
        <div className="h-[600px] flex flex-col relative">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.sender === "ai"
                                    ? msg.isError
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-emerald-500/20 text-emerald-400"
                                    : "bg-blue-500/20 text-blue-400"
                                    }`}
                            >
                                {msg.sender === "ai" ? (
                                    msg.isError ? <AlertCircle size={18} /> : <Bot size={18} />
                                ) : (
                                    <User size={18} />
                                )}
                            </div>

                            <div
                                className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === "ai"
                                    ? msg.isError
                                        ? "bg-red-500/10 border border-red-500/20 rounded-tl-none"
                                        : "bg-white/5 border border-white/10 rounded-tl-none"
                                    : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 rounded-tr-none"
                                    }`}
                            >
                                <div className="text-sm leading-relaxed prose prose-invert max-w-none">
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
                                                        <SyntaxHighlighter
                                                            {...props}
                                                            style={vscDarkPlus}
                                                            language={match[1]}
                                                            PreTag="div"
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code {...props} className={className}>
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
                                <span className="text-[10px] text-gray-500 mt-2 block">
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
                        className="flex items-center gap-2 text-gray-400 text-xs ml-12"
                    >
                        <Bot size={12} />
                        <span>Synapse is thinking...</span>
                        <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            ●●●
                        </motion.span>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 p-4 bg-black/40 border-t border-white/10 mx-[-1rem] mb-[-1rem]">
                <form onSubmit={handleSend} className="flex gap-2">
                    <GlassButton
                        type="button"
                        variant="ghost"
                        className="px-3"
                        title="Upload Document (Coming Soon)"
                    >
                        <Paperclip size={20} />
                    </GlassButton>
                    <GlassInput
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1"
                        disabled={isTyping}
                    />
                    <GlassButton
                        type="submit"
                        variant="primary"
                        className="px-4"
                        disabled={isTyping || !input.trim()}
                    >
                        <Send size={20} />
                    </GlassButton>
                </form>
            </div>
        </div>
    );
}
