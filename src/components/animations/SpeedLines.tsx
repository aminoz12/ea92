import { motion } from 'framer-motion'

export const SpeedLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal speed lines */}
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          style={{
            top: `${10 + index * 7}%`,
            left: '-100%',
            width: '200px',
          }}
          animate={{
            x: ['0%', '120vw'],
            opacity: [0, 0.3, 0.6, 0.3, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: index * 0.3,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Diagonal speed lines */}
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={`diag-${index}`}
          className="absolute w-0.5 h-32 bg-gradient-to-b from-transparent via-white to-transparent opacity-15"
          style={{
            left: `${5 + index * 12}%`,
            top: '-100px',
            transform: 'rotate(15deg)'
          }}
          animate={{
            y: ['0%', '150vh'],
            opacity: [0, 0.2, 0.4, 0.2, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: index * 0.4,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

export const EnginePulse = () => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{
        background: [
          'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)'
        ]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}
