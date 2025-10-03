import { motion } from 'framer-motion'

const GearSVG = ({ size, teeth = 12 }: { size: number; teeth?: number }) => {
  const radius = 40
  const innerRadius = 25
  const toothHeight = 8
  
  // Create gear teeth path
  const createGearPath = () => {
    const angleStep = (2 * Math.PI) / teeth
    let path = ''
    
    for (let i = 0; i < teeth; i++) {
      const angle1 = i * angleStep
      const angle2 = (i + 0.4) * angleStep
      const angle3 = (i + 0.6) * angleStep
      const angle4 = (i + 1) * angleStep
      
      const x1 = 50 + radius * Math.cos(angle1)
      const y1 = 50 + radius * Math.sin(angle1)
      const x2 = 50 + (radius + toothHeight) * Math.cos(angle2)
      const y2 = 50 + (radius + toothHeight) * Math.sin(angle2)
      const x3 = 50 + (radius + toothHeight) * Math.cos(angle3)
      const y3 = 50 + (radius + toothHeight) * Math.sin(angle3)
      const x4 = 50 + radius * Math.cos(angle4)
      const y4 = 50 + radius * Math.sin(angle4)
      
      if (i === 0) {
        path += `M ${x1} ${y1}`
      }
      path += ` L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4}`
    }
    path += ' Z'
    return path
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Gear body */}
      <path
        d={createGearPath()}
        fill="rgba(255,255,255,0.15)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
      
      {/* Inner circle */}
      <circle
        cx="50"
        cy="50"
        r={innerRadius}
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
      />
      
      {/* Center hole */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill="rgba(0,0,0,0.3)"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1"
      />
      
      {/* Bolt holes */}
      {[0, 120, 240].map((angle, index) => {
        const radian = (angle * Math.PI) / 180
        const x = 50 + 18 * Math.cos(radian)
        const y = 50 + 18 * Math.sin(radian)
        
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="3"
            fill="rgba(0,0,0,0.4)"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="0.5"
          />
        )
      })}
    </svg>
  )
}

interface AnimatedGearProps {
  size: number
  position: { top?: string; bottom?: string; left?: string; right?: string }
  direction?: 'clockwise' | 'counterclockwise'
  speed?: number
  delay?: number
}

const AnimatedGear = ({ 
  size, 
  position, 
  direction = 'clockwise', 
  speed = 1, 
  delay = 0 
}: AnimatedGearProps) => {
  const rotationDirection = direction === 'clockwise' ? 360 : -360
  
  return (
    <motion.div
      className="absolute pointer-events-none opacity-20"
      style={position}
      initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
      animate={{ 
        rotate: rotationDirection,
        scale: [0.8, 1, 0.9, 1],
        opacity: [0, 0.2, 0.3, 0.2]
      }}
      transition={{
        rotate: {
          duration: 8 / speed,
          repeat: Infinity,
          ease: "linear",
          delay: delay
        },
        scale: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        },
        opacity: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        }
      }}
      whileHover={{
        scale: 1.2,
        opacity: 0.5,
        transition: { duration: 0.3 }
      }}
    >
      <GearSVG size={size} />
      
      {/* Gear glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
          filter: 'blur(2px)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
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

export const AutomotiveGears = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large gear - top left */}
      <AnimatedGear
        size={120}
        position={{ top: '5%', left: '5%' }}
        direction="clockwise"
        speed={0.5}
        delay={0}
      />
      
      {/* Medium gear - top right */}
      <AnimatedGear
        size={80}
        position={{ top: '10%', right: '8%' }}
        direction="counterclockwise"
        speed={0.8}
        delay={1}
      />
      
      {/* Small gear - middle left */}
      <AnimatedGear
        size={60}
        position={{ top: '45%', left: '2%' }}
        direction="clockwise"
        speed={1.2}
        delay={2}
      />
      
      {/* Medium gear - bottom right */}
      <AnimatedGear
        size={90}
        position={{ bottom: '15%', right: '5%' }}
        direction="counterclockwise"
        speed={0.7}
        delay={0.5}
      />
      
      {/* Small gear - bottom left */}
      <AnimatedGear
        size={50}
        position={{ bottom: '25%', left: '12%' }}
        direction="clockwise"
        speed={1.5}
        delay={1.5}
      />
    </div>
  )
}
