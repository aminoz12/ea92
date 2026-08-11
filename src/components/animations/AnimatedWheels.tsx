'use client'

import { motion } from 'framer-motion'

interface WheelProps {
  size: number
  className?: string
  delay?: number
  duration?: number
  position: { top?: string; bottom?: string; left?: string; right?: string }
}

const WheelSVG = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none"
    className="drop-shadow-lg"
  >
    {/* Outer tire */}
    <circle 
      cx="50" 
      cy="50" 
      r="48" 
      stroke="rgba(255,255,255,0.3)" 
      strokeWidth="2" 
      fill="rgba(255,255,255,0.05)"
    />
    <circle 
      cx="50" 
      cy="50" 
      r="45" 
      stroke="rgba(255,255,255,0.4)" 
      strokeWidth="1.5" 
      fill="none"
    />
    
    {/* Tire treads */}
    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
    <circle cx="50" cy="50" r="35" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none"/>
    
    {/* Rim */}
    <circle 
      cx="50" 
      cy="50" 
      r="30" 
      stroke="rgba(255,255,255,0.6)" 
      strokeWidth="2" 
      fill="rgba(255,255,255,0.1)"
    />
    <circle 
      cx="50" 
      cy="50" 
      r="25" 
      stroke="rgba(255,255,255,0.5)" 
      strokeWidth="1.5" 
      fill="none"
    />
    
    {/* Center hub */}
    <circle 
      cx="50" 
      cy="50" 
      r="15" 
      fill="rgba(255,255,255,0.8)" 
      stroke="rgba(255,255,255,0.9)" 
      strokeWidth="1"
    />
    <circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.4)"/>
    
    {/* Spokes - 8 spokes for realistic look */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
      const radian = (angle * Math.PI) / 180
      const x1 = 50 + 15 * Math.cos(radian)
      const y1 = 50 + 15 * Math.sin(radian)
      const x2 = 50 + 25 * Math.cos(radian)
      const y2 = 50 + 25 * Math.sin(radian)
      
      return (
        <line
          key={index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )
    })}
    
    {/* Bolt holes */}
    {[0, 72, 144, 216, 288].map((angle, index) => {
      const radian = (angle * Math.PI) / 180
      const x = 50 + 20 * Math.cos(radian)
      const y = 50 + 20 * Math.sin(radian)
      
      return (
        <circle
          key={index}
          cx={x}
          cy={y}
          r="2"
          fill="rgba(0,0,0,0.6)"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="0.5"
        />
      )
    })}
  </svg>
)

const AnimatedWheel = ({ size, className = '', delay = 0, duration = 6, position }: WheelProps) => {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={position}
      initial={{ 
        rotate: 0, 
        y: 0, 
        opacity: 0.6,
        scale: 0.8
      }}
      animate={{ 
        rotate: [0, 180, 540, 900, 1260, 1620, 1800, 1800],
        y: [0, 0, 0, 0, 0, 0, 50, 200],
        opacity: [0.6, 0.8, 0.9, 0.9, 0.8, 0.6, 0.3, 0],
        scale: [0.8, 1, 1.1, 1, 1, 0.9, 0.8, 0.6]
      }}
      transition={{
        duration: duration,
        delay: delay,
        times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.92, 1],
        ease: [0.25, 0.46, 0.45, 0.94],
        repeat: Infinity,
        repeatDelay: 2
      }}
      whileHover={{
        rotate: 360,
        scale: 1.2,
        transition: { duration: 0.5 }
      }}
    >
      <WheelSVG size={size} />
      
      {/* Wheel glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(4px)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

export const AnimatedWheels = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Wheel 1 - Top Left - Large, slow */}
      <AnimatedWheel
        size={80}
        delay={0}
        duration={8}
        position={{ top: '10%', left: '8%' }}
        className="opacity-40"
      />
      
      {/* Wheel 2 - Top Right - Medium, fast */}
      <AnimatedWheel
        size={60}
        delay={1.5}
        duration={5}
        position={{ top: '15%', right: '12%' }}
        className="opacity-30"
      />
      
      {/* Wheel 3 - Bottom Left - Small, medium speed */}
      <AnimatedWheel
        size={50}
        delay={3}
        duration={7}
        position={{ bottom: '25%', left: '15%' }}
        className="opacity-35"
      />
      
      {/* Wheel 4 - Bottom Right - Large, very fast */}
      <AnimatedWheel
        size={70}
        delay={0.8}
        duration={4}
        position={{ bottom: '20%', right: '20%' }}
        className="opacity-45"
      />
      
      {/* Wheel 5 - Center Left - Mini, slow */}
      <AnimatedWheel
        size={40}
        delay={4}
        duration={9}
        position={{ top: '50%', left: '5%' }}
        className="opacity-25"
      />
      
      {/* Wheel 6 - Center Right - Medium, fast */}
      <AnimatedWheel
        size={55}
        delay={2}
        duration={4.5}
        position={{ top: '40%', right: '8%' }}
        className="opacity-38"
      />
    </div>
  )
}

// Floating particles effect
export const FloatingParts = () => {
  // Positions/timings are fixed per part (no Math.random at render): random
  // values would differ between the server prerender and client hydration and
  // trigger a hydration mismatch on the rendered inline styles.
  const parts = [
    { icon: "🔧", size: "text-xl", left: "12%", top: "22%", duration: 7, delay: 0.4 },
    { icon: "⚙️", size: "text-lg", left: "78%", top: "34%", duration: 8.5, delay: 1.3 },
    { icon: "🔩", size: "text-sm", left: "45%", top: "68%", duration: 6.5, delay: 2.1 },
    { icon: "🛠️", size: "text-base", left: "88%", top: "16%", duration: 9, delay: 0.9 },
    { icon: "⚡", size: "text-lg", left: "26%", top: "54%", duration: 7.5, delay: 1.8 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {parts.map((part, index) => (
        <motion.div
          key={index}
          className={`absolute ${part.size} opacity-20`}
          style={{
            left: part.left,
            top: part.top,
          }}
          animate={{
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            rotate: [0, 360],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: part.duration,
            repeat: Infinity,
            delay: part.delay,
            ease: "easeInOut"
          }}
        >
          {part.icon}
        </motion.div>
      ))}
    </div>
  )
}
