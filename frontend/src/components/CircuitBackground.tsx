import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function CircuitBackground() {
  const [circuits, setCircuits] = useState<{ x: number; y: number; width: number; height: number }[]>([]);

  useEffect(() => {
    const generateCircuits = () => {
      const newCircuits = [];
      for (let i = 0; i < 20; i++) {
        newCircuits.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          width: Math.random() * 30 + 10,
          height: Math.random() * 30 + 10,
        });
      }
      setCircuits(newCircuits);
    };
    generateCircuits();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00FFFF" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {circuits.map((circuit, index) => (
          <motion.g
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 3,
              delay: index * 0.2,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <circle
              cx={`${circuit.x}%`}
              cy={`${circuit.y}%`}
              r="2"
              fill="#00FFFF"
            />
            <line
              x1={`${circuit.x}%`}
              y1={`${circuit.y}%`}
              x2={`${circuit.x + circuit.width}%`}
              y2={`${circuit.y}%`}
              stroke="#00FFFF"
              strokeWidth="1"
            />
            <line
              x1={`${circuit.x}%`}
              y1={`${circuit.y}%`}
              x2={`${circuit.x}%`}
              y2={`${circuit.y + circuit.height}%`}
              stroke="#7A5CFF"
              strokeWidth="1"
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
