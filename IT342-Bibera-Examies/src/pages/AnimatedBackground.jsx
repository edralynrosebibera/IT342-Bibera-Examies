import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  PenTool,
  Calculator,
  Atom,
  Globe,
  FlaskConical,
  Lightbulb,
  Star,
  Sparkles,
  Rocket,
  Trophy,
} from "lucide-react";

import "../assets/styles/animatedbackground.css";

const icons = [
  { Icon: BookOpen, x: "8%", y: "12%", delay: 0, size: 34, color: "hsl(250 75% 65%)" },
  { Icon: GraduationCap, x: "88%", y: "8%", delay: 1.5, size: 42, color: "hsl(330 75% 60%)" },
  { Icon: PenTool, x: "78%", y: "72%", delay: 0.8, size: 28, color: "hsl(170 70% 50%)" },
  { Icon: Calculator, x: "10%", y: "78%", delay: 2, size: 36, color: "hsl(20 85% 58%)" },
  { Icon: Atom, x: "92%", y: "42%", delay: 0.5, size: 38, color: "hsl(250 75% 65%)" },
  { Icon: Globe, x: "4%", y: "45%", delay: 1.2, size: 30, color: "hsl(290 65% 58%)" },
  { Icon: FlaskConical, x: "55%", y: "4%", delay: 1.8, size: 32, color: "hsl(330 75% 60%)" },
  { Icon: Lightbulb, x: "42%", y: "88%", delay: 0.3, size: 30, color: "hsl(45 90% 55%)" },
  { Icon: Star, x: "25%", y: "6%", delay: 0.7, size: 24, color: "hsl(45 90% 55%)" },
  { Icon: Sparkles, x: "70%", y: "15%", delay: 2.2, size: 26, color: "hsl(290 65% 58%)" },
  { Icon: Rocket, x: "18%", y: "60%", delay: 1, size: 28, color: "hsl(20 85% 58%)" },
  { Icon: Trophy, x: "82%", y: "85%", delay: 1.6, size: 30, color: "hsl(45 90% 55%)" },
];

const dots = Array.from({ length: 20 }, (_, i) => ({
  x: `${5 + Math.random() * 90}%`,
  y: `${5 + Math.random() * 90}%`,
  size: 4 + Math.random() * 8,
  color: [
    "hsl(250 75% 65%)",
    "hsl(330 75% 60%)",
    "hsl(170 70% 50%)",
    "hsl(45 90% 55%)",
    "hsl(290 65% 58%)",
    "hsl(20 85% 58%)",
  ][i % 6],
  delay: Math.random() * 4,
  duration: 5 + Math.random() * 6,
}));

function AnimatedBackground() {
  return (
    <div className="animated-bg">
      <motion.div
        className="bg-gradient"
        animate={{
          background: [
            "linear-gradient(135deg, hsl(250 80% 92%) 0%, hsl(290 60% 90%) 25%, hsl(330 65% 92%) 50%, hsl(200 70% 92%) 75%, hsl(250 80% 92%) 100%)",
            "linear-gradient(135deg, hsl(200 70% 92%) 0%, hsl(250 80% 92%) 25%, hsl(330 65% 92%) 50%, hsl(290 60% 90%) 75%, hsl(200 70% 92%) 100%)",
            "linear-gradient(135deg, hsl(330 65% 92%) 0%, hsl(200 70% 92%) 25%, hsl(250 80% 92%) 50%, hsl(290 60% 90%) 75%, hsl(330 65% 92%) 100%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="animated-bg__orb animated-bg__orb--purple"
        animate={{ x: [0, -80, 40, 0], y: [0, 60, -30, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="animated-bg__orb animated-bg__orb--pink"
        animate={{ x: [0, 60, -40, 0], y: [0, -50, 30, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="animated-bg__orb animated-bg__orb--teal"
        animate={{ x: [0, -50, 30, 0], y: [0, 40, -60, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="animated-bg__orb animated-bg__orb--gold"
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="animated-bg__dot"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            background: dot.color,
            opacity: 0.3,
          }}
          animate={{ y: [0, -30, 0], x: [0, 15, -10, 0], opacity: [0.2, 0.45, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: dot.duration, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
        />
      ))}

      {icons.map(({ Icon, x, y, delay, size, color }, i) => (
        <motion.div
          key={i}
          className="animated-bg__icon"
          style={{ left: x, top: y, color }}
          animate={{ y: [0, -25, 0], rotate: [0, 12, -12, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <Icon size={size} strokeWidth={1.5} />
        </motion.div>
      ))}

      <div className="animated-bg__grid"></div>
    </div>
  );
}

export default AnimatedBackground;