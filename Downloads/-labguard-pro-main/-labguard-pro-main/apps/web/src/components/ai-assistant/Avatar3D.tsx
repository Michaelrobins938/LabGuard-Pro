'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Microscope, Dna, TestTube, Brain, Sparkles } from 'lucide-react';
import { avatarStates, type AvatarState } from './AvatarStates';

interface Avatar3DProps {
  state: keyof typeof avatarStates;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
}

export function Avatar3D({ state = 'idle', size = 'md', onClick, className }: Avatar3DProps) {
  const [currentState, setCurrentState] = useState<AvatarState>(avatarStates[state]);
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  useEffect(() => {
    setCurrentState(avatarStates[state]);
  }, [state]);

  // Sparkle effect for excited state
  useEffect(() => {
    if (state === 'excited') {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const getMicrobiologyIcon = () => {
    const icons = [Beaker, Microscope, Dna, TestTube, Brain];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    return randomIcon;
  };

  const IconComponent = getMicrobiologyIcon();

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Body - Petri Dish Style */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, #E0F2FE 0%, #B3E5FC 30%, #81D4FA 60%, #4FC3F7 100%)`,
          boxShadow: `
            0 0 30px rgba(79, 195, 247, 0.6), 
            inset 0 0 20px rgba(255, 255, 255, 0.4),
            0 4px 15px rgba(0, 0, 0, 0.1)
          `,
          border: '2px solid rgba(255, 255, 255, 0.8)'
        }}
        animate={{ 
          scale: isHovered ? [1, 1.05, 1] : [1, 1.02, 1],
          rotateY: isHovered ? [0, 5, -5, 0] : 0
        }}
        transition={{ 
          duration: isHovered ? 0.6 : 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: `
            0 0 40px rgba(79, 195, 247, 0.8), 
            inset 0 0 25px rgba(255, 255, 255, 0.5),
            0 8px 25px rgba(0, 0, 0, 0.15)
          `
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Inner Petri Dish Ring */}
        <div className="absolute inset-2 rounded-full border-2 border-white/60" />
        
        {/* Microbiology Icon */}
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-white/90"
          >
            <IconComponent className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Face Elements - More Expressive */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Eyes */}
          <div className="absolute flex space-x-4" style={{ top: '25%' }}>
            <motion.div 
              className="w-2 h-2 bg-white rounded-full shadow-lg"
              animate={{ 
                scale: currentState.eyeExpression === 'analyzing' ? [1, 1.2, 1] : 1,
                opacity: currentState.eyeExpression === 'alert' ? [0.5, 1, 0.5] : 0.9
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.div 
              className="w-2 h-2 bg-white rounded-full shadow-lg"
              animate={{ 
                scale: currentState.eyeExpression === 'analyzing' ? [1, 1.2, 1] : 1,
                opacity: currentState.eyeExpression === 'alert' ? [0.5, 1, 0.5] : 0.9
              }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
          </div>
          
          {/* Smile - More Expressive */}
          <motion.div 
            className="absolute bottom-4"
            animate={{ 
              scaleY: currentState.mood === 'excited' ? [1, 1.2, 1] : 1,
              rotate: currentState.mood === 'concerned' ? [0, -5, 5, 0] : 0
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
              <path 
                d={currentState.mood === 'concerned' 
                  ? "M3 7C6 4 10 4 13 7" 
                  : currentState.mood === 'excited'
                  ? "M2 2C6 6 10 6 14 2"
                  : "M3 3C6 6 10 6 13 3"
                }
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* DNA Helix Animation */}
      <motion.div
        className="absolute inset-0"
        animate={{ 
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div className="relative w-full h-full">
          {/* DNA Strand 1 */}
          <motion.div
            className="absolute left-1/4 top-0 w-1 h-full"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, #E91E63 20%, transparent 40%, #E91E63 60%, transparent 80%, #E91E63 100%)`,
              borderRadius: '50%'
            }}
            animate={{ 
              scaleY: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* DNA Strand 2 */}
          <motion.div
            className="absolute right-1/4 top-0 w-1 h-full"
            style={{
              background: `linear-gradient(to bottom, #E91E63 0%, transparent 20%, #E91E63 40%, transparent 60%, #E91E63 80%, transparent 100%)`,
              borderRadius: '50%'
            }}
            animate={{ 
              scaleY: [1.2, 1, 1.2],
              opacity: [0.8, 0.3, 0.8]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
        </div>
      </motion.div>

      {/* Floating Particles */}
      <AnimatePresence>
        {showSparkles && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  scale: 0, 
                  opacity: 0,
                  x: Math.random() * 40 - 20,
                  y: Math.random() * 40 - 20
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: Math.random() * 60 - 30,
                  y: Math.random() * 60 - 30
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              >
                <Sparkles className="w-3 h-3 text-yellow-300" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Glow Effect - State Dependent */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${currentState.glowColor}40 0%, ${currentState.glowColor}20 50%, transparent 100%)`,
          filter: 'blur(12px)'
        }}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, currentState.intensity, 0.2]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      {/* Interaction Ripple Effect */}
      {onClick && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/40"
          initial={{ scale: 1, opacity: 0 }}
          whileHover={{ scale: 1.15, opacity: 0.8 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Hover Glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)`,
              filter: 'blur(8px)'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 