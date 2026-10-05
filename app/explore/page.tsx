"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import InteractiveGrid from "@/components/InteractiveGrid";

const LOADING_MESSAGES = [
  "Bribing Wikipedia editors for secrets...",
  "Asking Gemma for her hottest take on this...",
  "Fact-checking with a local conspiracy theorist...",
  "Waking up the voice actors...",
  "Brewing some coffee for the servers...",
  "Going deeper into the rabbit hole...",
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get("topic");
  
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!topic) {
      router.push("/");
      return;
    }

    let isMounted = true;

    const generateRabbitHole = async () => {
      try {
        const res = await axios.post("/api/explore", { topic });
        if (isMounted && res.data.success) {
          // Redirect to the result page!
          router.push(`/hole/${res.data.id}`);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.error || "Failed to generate rabbit hole.");
        }
      }
    };

    generateRabbitHole();

    return () => { isMounted = false; };
  }, [topic, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 font-sans text-zinc-50">
        <h2 className="text-2xl text-red-400 mb-4">Oops!</h2>
        <p className="text-zinc-400">{error}</p>
        <button onClick={() => router.push("/")} className="mt-8 px-6 py-2 bg-white text-black rounded-full font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#fbf5eb] overflow-hidden">
      {/* Interactive Hover Grid Background */}
      <InteractiveGrid />

      {/* Brutalist Animation Shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute w-64 h-64 bg-rose-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] pointer-events-none rounded-xl"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute w-48 h-48 bg-purple-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] pointer-events-none rounded-full"
      />

      <div className="z-10 flex flex-col items-center gap-8 bg-white border-4 border-black p-12 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xl mx-4 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-black uppercase leading-tight"
        >
          Diving into <br/>
          <span className="bg-yellow-300 inline-block mt-2 px-4 py-2 border-2 border-black -skew-x-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md">
            {topic}
          </span>
        </motion.h2>

        <div className="h-12 relative w-full flex justify-center mt-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute text-black font-bold text-xl uppercase tracking-wider"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <ExploreContent />
    </Suspense>
  );
}
