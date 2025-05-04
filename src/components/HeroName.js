import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';

const AnimatedText = ({ text, position, color }) => {
  const textRef = useRef();
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      // Slight wave animation
      textRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5 + position[0]) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.8}
      font="/fonts/Inter-Bold.woff"
      color={color}
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.05}
    >
      {text}
    </Text>
  );
};

const HeroName = ({ name = "YOUR NAME", subtitle = "Developer & Designer" }) => {
  // Split name into individual letters for animation
  const letters = name.split('');
  
  return (
    <div style={{ height: '200px', width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        
        {/* Animated letters */}
        {letters.map((letter, i) => (
          <Float 
            key={i}
            speed={2} 
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <AnimatedText
              text={letter}
              position={[(i - letters.length / 2) * 0.9, 0.5, 0]}
              color="#f9a7b0"
            />
          </Float>
        ))}
        
        {/* Subtitle */}
        <AnimatedText
          text={subtitle}
          position={[0, -0.5, 0]}
          color="#ffffff"
        />
      </Canvas>
    </div>
  );
};

export default HeroName; 