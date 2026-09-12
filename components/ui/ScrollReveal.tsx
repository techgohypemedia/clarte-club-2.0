"use client"

import { ReactNode } from "react"
import { motion, type HTMLMotionProps } from "framer-motion"

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  className?: string
  once?: boolean
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.65,
  yOffset = 28,
  className = "",
  once = true,
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  staggerDelay?: number
  className?: string
  once?: boolean
}

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  className = "",
  once = true,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = "",
  yOffset = 24,
  duration = 0.55,
}: {
  children: ReactNode
  className?: string
  yOffset?: number
  duration?: number
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
