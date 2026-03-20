import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function AnimatedBackground() {
  const [lines, setLines] = useState<Array<{ id: number; x1: number; y1: number; x2: number; y2: number; delay: number }>>([]);

  useEffect(() => {
    const newLines = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setLines(newLines);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#7A5CFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00FFB3" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {lines.map((line) => (
          <motion.line
            key={line.id}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="url(#lineGradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4,
              delay: line.delay,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        ))}
        {/* Circuit nodes */}
        {lines.slice(0, 15).map((line) => (
          <motion.circle
            key={`node-${line.id}`}
            cx={`${line.x1}%`}
            cy={`${line.y1}%`}
            r="2"
            fill="#00FFFF"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3,
              delay: line.delay,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
