"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import InteractiveGrid from "@/components/InteractiveGrid";

const SURPRISE_TOPICS = [
  "The 1932 Great Emu War",
  "Why cats are technically liquid",
  "The history of the Furby",
  "The Dyatlov Pass incident",
  "Cicada 3301 internet mystery",
  "The psychology of reality TV",
  "Deep sea gigantism",
  "The Dancing Plague of 1518",
  "How the Romans made concrete",
];

const PASTEL_COLORS = [
  "bg-rose-400", "bg-purple-400", "bg-teal-300", 
  "bg-yellow-300", "bg-orange-300"
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    router.push(`/explore?topic=${encodeURIComponent(topic)}`);
  };

  const handleSurprise = () => {
    const randomTopic = SURPRISE_TOPICS[Math.floor(Math.random() * SURPRISE_TOPICS.length)];
    setTopic(randomTopic);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-[#fbf5eb] font-sans text-black relative overflow-hidden">
      
      {/* Interactive Hover Grid Background */}
      <InteractiveGrid />

      {/* Top Navbar like Hacktoberfest */}
      <nav className="w-full border-b-2 border-black bg-[#fbf5eb] px-6 py-4 flex justify-between items-center z-50">
        <span className="font-black text-xl tracking-tighter uppercase">Rabbit Hole Explorer</span>
      </nav>

      <main className="z-10 flex w-full max-w-3xl flex-col items-center gap-10 text-center mt-20 px-4">
        <div className="space-y-6 relative">
          <div className="flex justify-center gap-1 mb-4">
            <div className="w-4 h-4 bg-rose-400 border-2 border-black"></div>
            <div className="w-4 h-4 bg-yellow-300 border-2 border-black"></div>
            <div className="w-4 h-4 bg-teal-300 border-2 border-black"></div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-black">
            Dive down the <br/> Rabbit Hole.
          </h1>
          <p className="text-lg font-medium text-black max-w-xl mx-auto opacity-80">
            Give us an obscure topic, and we'll generate a custom mini-podcast and summary for your next deep dive.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full space-y-6 mt-4">
          <div className="relative flex items-center w-full mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white border-2 border-black rounded-lg group focus-within:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow">
            <Search className="absolute left-4 h-5 w-5 text-black font-bold" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="City, country or Fest name... wait, I mean topic!"
              className="w-full bg-transparent py-4 pl-12 pr-4 text-lg font-bold text-black placeholder:text-zinc-500 focus:outline-none rounded-l-lg"
            />
            <button
              type="submit"
              disabled={!topic.trim()}
              className="bg-rose-400 border-l-2 border-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-rose-500 transition-colors disabled:opacity-50 rounded-r-lg"
            >
              Search
            </button>
          </div>

          <div className="flex items-center justify-center pt-4">
            <button
              type="button"
              onClick={handleSurprise}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-black bg-teal-300 px-6 py-2 text-sm font-bold uppercase tracking-wider text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Sparkles className="h-4 w-4 text-black" />
              Surprise Me!
            </button>
          </div>
        </form>
      </main>

      <TrendingGrid />
    </div>
  );
}

function TrendingGrid() {
  const [trending, setTrending] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/trending")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTrending(data);
      })
      .catch(console.error);
  }, []);

  if (trending.length === 0) return null;

  return (
    <div className="z-10 w-full max-w-5xl mt-24 mb-16 px-4">
      <div className="flex items-center gap-4 mb-8 justify-center">
        <div className="h-[2px] w-12 bg-black opacity-20"></div>
        <h2 className="text-3xl font-black text-black">Explore the Warren</h2>
        <div className="h-[2px] w-12 bg-black opacity-20"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {trending.map((hole, idx) => {
          const bgColor = PASTEL_COLORS[idx % PASTEL_COLORS.length];
          return (
            <div 
              key={hole._id} 
              onClick={() => router.push(`/hole/${hole._id}`)}
              className={`group relative h-40 rounded-2xl overflow-hidden cursor-pointer border-2 border-black ${bgColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center p-6 text-center`}
            >
              {/* Corner pixel decoration */}
              <div className="absolute top-0 right-0 w-6 h-6 bg-white border-b-2 border-l-2 border-black opacity-50 rounded-bl-xl"></div>
              
              <h3 className="text-xl font-bold text-black leading-tight">
                {hole.topic}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
