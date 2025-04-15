"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const arabicPhrases = [
    "مرحبا بكم في هذا الموقع",
    "الكتابة بالعربية ممتعة",
    "تعلم مهارات جديدة",
    "النجاح يأتي بالاجتهاد",
    "القراءة غذاء الروح",
    "العلم نور والجهل ظلام",
    "الصحة تاج على رؤوس الأصحاء",
    "الابتسامة صدقة",
    "الوقت كالسيف إن لم تقطعه قطعك",
    "كل شيء ممكن إذا حاولت",
    "تفاءلوا بالخير تجدوه",
    "العقل السليم في الجسم السليم",
];

const getRandomPhrase = () => {
    return arabicPhrases[Math.floor(Math.random() * arabicPhrases.length)];
};

export default function Home() {
    const [phrase, setPhrase] = useState("");
    const [userInput, setUserInput] = useState("");
    const [score, setScore] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        setPhrase(getRandomPhrase());
    }, []);

    useEffect(() => {
        if (startTime !== null) {
            const intervalId = setInterval(() => {
                setTimeElapsed(Date.now() - startTime);
            }, 10); // Update every 10ms for smoother animation

            return () => clearInterval(intervalId);
        }
    }, [startTime]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserInput(value);

        if (startTime === null) {
            setStartTime(Date.now());
        }

        if (!phrase.startsWith(value)) {
            setUserInput("");
            setStartTime(null);
            setTimeElapsed(0);

            toast({
                title: "خطأ!",
                description: "استمر في التدريب لتحسين دقتك.",
                variant: "destructive",
            });

        } else if (value === phrase) {
            const endTime = Date.now();
            const timeTaken = (endTime - startTime) / 1000; // in seconds
            const words = phrase.split(" ").length;
            const wpm = Math.round(words / timeTaken * 60);

            setPhrase(getRandomPhrase());
            setUserInput("");
            setScore(prevScore => prevScore + wpm);
            setStartTime(null);
            setTimeElapsed(0);

            toast({
                title: "أحسنت!",
                description: `أحسنت! لقد كتبت ${wpm} كلمة في الدقيقة.`,
            });

            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-4 text-primary">مُعلّم الكتابة بالعربية</h1>

            <div className="mb-8 p-4 rounded-lg shadow-md w-full max-w-md text-center">
                <p className="text-xl font-semibold text-secondary">{phrase}</p>
            </div>

            <Input
                type="text"
                value={userInput}
                onChange={handleChange}
                placeholder="اكتب العبارة هنا..."
                className="w-full max-w-md mb-4 bg-secondary text-primary"
                ref={inputRef}
                dir="rtl"
            />

            <div className="flex justify-between w-full max-w-md mb-4">
                <div className="text-lg">
                    النتيجة: <span className="font-semibold text-primary">{score}</span>
                </div>
                <div className="text-lg">
                    الوقت: <span className="font-semibold text-primary">{(timeElapsed / 1000).toFixed(2)}ث</span>
                </div>
            </div>
        </div>
    );
}
