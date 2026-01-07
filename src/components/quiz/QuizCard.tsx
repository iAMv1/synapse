
import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '../../types/quiz';

interface QuizCardProps {
    quiz: QuizQuestion;
    onComplete?: (correct: boolean) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onComplete }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (index: number) => {
        if (isSubmitted) return;
        setSelected(index);
        setIsSubmitted(true);
        if (onComplete) onComplete(index === quiz.correctIndex);
    };

    return (
        <GlassCard className="p-6 my-4 border-l-4 border-l-emerald-500">
            <h3 className="text-lg font-bold text-white mb-4">Pop Quiz</h3>
            <p className="text-white/90 mb-6 text-lg">{quiz.question}</p>

            <div className="space-y-3">
                {quiz.options.map((option, idx) => (
                    <motion.button
                        key={idx}
                        whileHover={!isSubmitted ? { scale: 1.01 } : {}}
                        whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                        onClick={() => handleSubmit(idx)}
                        disabled={isSubmitted}
                        className={clsx(
                            "w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all",
                            isSubmitted
                                ? idx === quiz.correctIndex
                                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-100"
                                    : idx === selected
                                        ? "bg-red-500/20 border-red-500/50 text-red-100"
                                        : "bg-white/5 border-transparent opacity-50"
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                        )}
                    >
                        <span>{option}</span>
                        {isSubmitted && idx === quiz.correctIndex && (
                            <CheckCircle2 className="text-emerald-400" size={20} />
                        )}
                        {isSubmitted && idx === selected && idx !== quiz.correctIndex && (
                            <XCircle className="text-red-400" size={20} />
                        )}
                    </motion.button>
                ))}
            </div>

            {isSubmitted && quiz.explanation && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm"
                >
                    <strong>Explanation:</strong> {quiz.explanation}
                </motion.div>
            )}
        </GlassCard>
    );
};
