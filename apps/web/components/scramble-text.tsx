"use client";

import { motion } from "motion/react";

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export function ScrambleText({ text, className }: ScrambleTextProps) {
  return (
    <motion.span
      className={`text-5xl sm:text-6xl md:text-7xl leading-tight ${className || ""}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.06,
          },
        },
      }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: key
          key={i}
          variants={{
            hidden: {
              opacity: 0,
              filter: "blur(4px)",
            },
            visible: {
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                duration: 0.4,
                ease: "easeOut",
              },
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
