import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { SynapseCard } from '../ui/SynapseCard';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import type { QuizQuestion } from '../../types/quiz';
import confetti from 'canvas-confetti';

interface SwipeableQuizDeckProps {
    questions: QuizQuestion[];
    onComplete?: (results: { correct: number; total: number }) => void;
}

export function SwipeableQuizDeck({ questions, onComplete }: SwipeableQuizDeckProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
    const [showResults, setShowResults] = useState(false);
    const [exitX, setExitX] = useState<number>(0);

    const currentQuestion = questions[currentIndex];
    const isAnswered = answers[currentIndex] !== null;

    const handleAnswer = (optionIndex: number) => {
        if (isAnswered) return;

        const newAnswers = [...answers];
        newAnswers[currentIndex] = optionIndex;
        setAnswers(newAnswers);

        if (optionIndex === currentQuestion.correctIndex) {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#10b981', '#3b82f6']
            });
        }
    };

    const handleDragEnd = (_: any, info: PanInfo) => {
        const threshold = 100;

        if (info.offset.x > threshold && currentIndex > 0) {
            // Swipe right - go back
            setExitX(300);
            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
                setExitX(0);
            }, 200);
        } else if (info.offset.x < -threshold && currentIndex < questions.length - 1 && isAnswered) {
            // Swipe left - go forward (only if answered)
            setExitX(-300);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setExitX(0);
            }, 200);
        }
    };

    const goNext = () => {
        if (currentIndex < questions.length - 1 && isAnswered) {
            setExitX(-300);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setExitX(0);
            }, 200);
        } else if (currentIndex === questions.length - 1 && isAnswered) {
            // Last question answered - show results
            const correct = answers.filter((a, i) => a === questions[i].correctIndex).length;
            setShowResults(true);
            onComplete?.({ correct, total: questions.length });
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setExitX(300);
            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
                setExitX(0);
            }, 200);
        }
    };

    const restart = () => {
        setCurrentIndex(0);
        setAnswers(new Array(questions.length).fill(null));
        setShowResults(false);
    };

    if (showResults) {
        const correct = answers.filter((a, i) => a === questions[i].correctIndex).length;
        const percentage = Math.round((correct / questions.length) * 100);

        return (
            <SynapseCard className="p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Quiz Complete!</h2>
                <div className="text-6xl font-bold mb-4">
                    <span className={percentage >= 70 ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-red-400'}>
                        {percentage}%
                    </span>
                </div>
                <p className="text-gray-400 mb-6">
                    You got {correct} out of {questions.length} questions correct
                </p>
                <button
                    onClick={restart}
                    className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400 hover:bg-emerald-500/30 transition-colors flex items-center gap-2 mx-auto"
                >
                    <RotateCcw size={18} />
                    Try Again
                </button>
            </SynapseCard>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="relative">
            {/* Progress Bar */}
            <div className="flex gap-1 mb-4">
                {questions.map((_, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "h-1 flex-1 rounded-full transition-colors",
                            idx < currentIndex
                                ? answers[idx] === questions[idx].correctIndex
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                                : idx === currentIndex
                                    ? "bg-white/50"
                                    : "bg-white/10"
                        )}
                    />
                ))}
            </div>

            {/* Card Container */}
            <div className="relative h-[400px] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ x: exitX === 0 ? 0 : -exitX, opacity: 0, scale: 0.95 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: exitX, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    >
                        <SynapseCard className="h-full p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs text-gray-500">
                                    Question {currentIndex + 1} of {questions.length}
                                </span>
                                <span className="text-xs text-emerald-400">Swipe to navigate</span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-6 flex-shrink-0">
                                {currentQuestion.question}
                            </h3>

                            <div className="space-y-3 flex-1 overflow-y-auto">
                                {currentQuestion.options.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                        whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={isAnswered}
                                        className={clsx(
                                            "w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all",
                                            isAnswered
                                                ? idx === currentQuestion.correctIndex
                                                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-100"
                                                    : idx === answers[currentIndex]
                                                        ? "bg-red-500/20 border-red-500/50 text-red-100"
                                                        : "bg-white/5 border-transparent opacity-50"
                                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                                        )}
                                    >
                                        <span>{option}</span>
                                        {isAnswered && idx === currentQuestion.correctIndex && (
                                            <CheckCircle2 className="text-emerald-400" size={20} />
                                        )}
                                        {isAnswered && idx === answers[currentIndex] && idx !== currentQuestion.correctIndex && (
                                            <XCircle className="text-red-400" size={20} />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            {isAnswered && currentQuestion.explanation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm"
                                >
                                    <strong>Explanation:</strong> {currentQuestion.explanation}
                                </motion.div>
                            )}
                        </SynapseCard>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className={clsx(
                        "p-3 rounded-xl border transition-all flex items-center gap-2",
                        currentIndex === 0
                            ? "opacity-30 cursor-not-allowed border-transparent"
                            : "border-white/10 hover:bg-white/5 text-white"
                    )}
                >
                    <ChevronLeft size={20} />
                    Back
                </button>

                <div className="text-gray-400 text-sm">
                    {isAnswered ? "Swipe left or tap Next" : "Select an answer"}
                </div>

                <button
                    onClick={goNext}
                    disabled={!isAnswered}
                    className={clsx(
                        "p-3 rounded-xl border transition-all flex items-center gap-2",
                        !isAnswered
                            ? "opacity-30 cursor-not-allowed border-transparent"
                            : "border-emerald-500/50 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
                    )}
                >
                    {currentIndex === questions.length - 1 ? "Finish" : "Next"}
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
