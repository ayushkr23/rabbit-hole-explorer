"use client";

import { useEffect, useRef } from 'react';

// The vibrant neo-brutalism colors
const COLORS = ["#fb7185", "#c084fc", "#5eead4", "#fde047", "#fdba74"];

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateGrid = () => {
      container.innerHTML = '';
      const cellSize = 50; // Size of the squares
      const cols = Math.floor(window.innerWidth / cellSize);
      const rows = Math.floor(window.innerHeight / cellSize);
      
      container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
      
      for (let i = 0; i < cols * rows; i++) {
        const cell = document.createElement('div');
        // Very subtle border for the grid lines normally
        cell.className = "border-[0.5px] border-black/5 transition-all duration-1000 ease-out";
        container.appendChild(cell);
      }
    };

    updateGrid();
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateGrid, 200);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target !== container && container.contains(target)) {
        // Pick a random vibrant color
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        
        // Apply color instantly with a hard black border to mimic the pixel art
        target.style.backgroundColor = color;
        target.style.borderColor = 'black';
        target.style.borderWidth = '2px';
        target.style.transitionDuration = '0s'; // Instant pop
        
        // Fade it out slowly
        setTimeout(() => {
          target.style.backgroundColor = 'transparent';
          target.style.borderColor = 'rgba(0,0,0,0.05)';
          target.style.borderWidth = '0.5px';
          target.style.transitionDuration = '1.5s'; // Slow fade
        }, 300);
      }
    };

    container.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 grid pointer-events-auto overflow-hidden"
    />
  );
}
