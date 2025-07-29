export interface AvatarState {
  mood: 'idle' | 'thinking' | 'speaking' | 'excited' | 'concerned' | 'analyzing' | 'discovering' | 'helpful';
  intensity: number; // 0-1 for glow intensity
  rotation: number; // Swirl rotation speed
  eyeExpression: 'normal' | 'wink' | 'analyzing' | 'alert' | 'curious' | 'focused';
  glowColor: string;
  personality: string; // Microbiology-themed personality traits
}

export const avatarStates: Record<string, AvatarState> = {
  idle: {
    mood: 'idle',
    intensity: 0.6,
    rotation: 1,
    eyeExpression: 'normal',
    glowColor: '#4FC3F7', // Light Blue
    personality: 'Ready to assist with your laboratory needs'
  },
  thinking: {
    mood: 'thinking',
    intensity: 0.8,
    rotation: 2,
    eyeExpression: 'analyzing',
    glowColor: '#9C27B0', // Purple
    personality: 'Analyzing your request with precision'
  },
  speaking: {
    mood: 'speaking',
    intensity: 0.9,
    rotation: 1.5,
    eyeExpression: 'normal',
    glowColor: '#00BCD4', // Cyan
    personality: 'Communicating findings clearly'
  },
  excited: {
    mood: 'excited',
    intensity: 1,
    rotation: 3,
    eyeExpression: 'curious',
    glowColor: '#FF9800', // Orange
    personality: 'Thrilled to share discoveries with you'
  },
  concerned: {
    mood: 'concerned',
    intensity: 0.7,
    rotation: 0.8,
    eyeExpression: 'alert',
    glowColor: '#F44336', // Red
    personality: 'Detected something that needs attention'
  },
  analyzing: {
    mood: 'analyzing',
    intensity: 0.85,
    rotation: 2.5,
    eyeExpression: 'focused',
    glowColor: '#673AB7', // Deep Purple
    personality: 'Deep in scientific analysis mode'
  },
  discovering: {
    mood: 'discovering',
    intensity: 0.95,
    rotation: 2.2,
    eyeExpression: 'curious',
    glowColor: '#4CAF50', // Green
    personality: 'Excited about new scientific findings'
  },
  helpful: {
    mood: 'helpful',
    intensity: 0.75,
    rotation: 1.2,
    eyeExpression: 'normal',
    glowColor: '#2196F3', // Blue
    personality: 'Here to help optimize your lab workflow'
  }
}; 