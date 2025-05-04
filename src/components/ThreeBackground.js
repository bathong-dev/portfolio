import React, { useEffect, useRef, useState, useCallback } from 'react';

const COLORS = [
  '#0a0a0a', // dark
  '#1a237e', // indigo
  '#283593', // blue
  '#1565c0', // light blue
  '#00838f', // teal
  '#4527a0', // purple
  '#0a0a0a'  // back to dark
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function randomColor() {
  // Generate a random pastel color
  const hue = Math.floor(Math.random() * 360);
  return `hsla(${hue}, 80%, 70%, 0.18)`;
}

// Check for low-end devices - combination of mobile and performance API checks
const isLowEndDevice = () => {
  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check device memory if available (Chrome)
  const hasLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
  
  // Check hardware concurrency if available
  const hasLowConcurrency = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
  
  return isMobile || hasLowMemory || hasLowConcurrency;
};

const ThreeBackground = () => {
  const bgRef = useRef();
  const colorIndex = useRef(0);
  const nextColorIndex = useRef(1);
  const progress = useRef(0);
  const mouse = useRef({ x: 50, y: 50 });
  const light = useRef({ x: 50, y: 50 });
  const [pulses, setPulses] = useState([]);
  const [lowEndMode, setLowEndMode] = useState(false);
  const lastAnimationTime = useRef(0);
  const FPS_LIMIT = 30; // Limit FPS to save resources
  const FRAME_TIME = 1000 / FPS_LIMIT;

  useEffect(() => {
    // Check if the device is low-end and set performance mode
    setLowEndMode(isLowEndDevice());
  }, []);

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e) => {
    const now = performance.now();
    if (now - lastAnimationTime.current < FRAME_TIME) {
      return; // Skip if too soon
    }
    
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    mouse.current = { x, y };
    lastAnimationTime.current = now;
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      // Limit click effects on low-end devices
      if (lowEndMode && pulses.length >= 2) return;
      
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      const color = randomColor();
      const key = Date.now() + Math.random();
      setPulses((prev) => [...prev, { x, y, color, key }]);
      // Remove pulse after animation (0.7s)
      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.key !== key));
      }, 700);
    };
    
    // Use passive event listeners to avoid blocking the main thread
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleClick, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
    };
  }, [handleMouseMove, lowEndMode, pulses.length]);

  useEffect(() => {
    let animationFrame;
    const duration = lowEndMode ? 12000 : 8000; // Slower transitions for low-end devices
    let lastTime = performance.now();

    const lerpColor = (a, b, t) => {
      const ah = a.replace('#', '');
      const bh = b.replace('#', '');
      const ar = parseInt(ah.substring(0, 2), 16);
      const ag = parseInt(ah.substring(2, 4), 16);
      const ab = parseInt(ah.substring(4, 6), 16);
      const br = parseInt(bh.substring(0, 2), 16);
      const bg = parseInt(bh.substring(2, 4), 16);
      const bb = parseInt(bh.substring(4, 6), 16);
      const rr = Math.round(ar + (br - ar) * t);
      const rg = Math.round(ag + (bg - ag) * t);
      const rb = Math.round(ab + (bb - ab) * t);
      return `rgb(${rr},${rg},${rb})`;
    };

    const animate = (now) => {
      // Throttle animation frame rate on low-end devices
      if (now - lastTime < (lowEndMode ? FRAME_TIME*2 : FRAME_TIME)) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      
      const dt = now - lastTime;
      lastTime = now;
      progress.current += dt / duration;
      
      if (progress.current > 1) {
        progress.current = 0;
        colorIndex.current = nextColorIndex.current;
        nextColorIndex.current = (nextColorIndex.current + 1) % COLORS.length;
      }
      
      const colorA = COLORS[colorIndex.current];
      const colorB = COLORS[nextColorIndex.current];
      const bgColor = lerpColor(colorA, colorB, progress.current);
      
      // Smoothly interpolate light position toward mouse with reduced frequency
      light.current.x = lerp(light.current.x, mouse.current.x, lowEndMode ? 0.005 : 0.01);
      light.current.y = lerp(light.current.y, mouse.current.y, lowEndMode ? 0.005 : 0.01);
      
      const { x, y } = light.current;
      if (bgRef.current) {
        // Use a simpler background for low-end devices
        if (lowEndMode) {
          bgRef.current.style.background = bgColor;
        } else {
          bgRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(80,180,255,0.22) 0%, ${bgColor} 100%)`;
        }
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [lowEndMode]);

  // Will-change hints to browser for optimized rendering
  const bgStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    pointerEvents: 'none',
    transition: 'background 0.5s',
    willChange: 'background', // Hint to browser this will change frequently
  };

  // Multiple pulse effects
  return (
    <>
      <div ref={bgRef} style={bgStyle} />
      {pulses.map((pulse) => (
        <span
          key={pulse.key}
          style={{
            position: 'fixed',
            left: `calc(${pulse.x}% - 60px)` ,
            top: `calc(${pulse.y}% - 60px)` ,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: pulse.color,
            boxShadow: `0 0 32px 16px ${pulse.color}`,
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'pulse-bg 0.7s cubic-bezier(.4,0,.2,1) forwards',
            willChange: 'transform, opacity', // Optimize animations
          }}
        />
      ))}
      <style>{`
        @keyframes pulse-bg {
          0% { opacity: 0.7; transform: scale(0.5); }
          60% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1.7); }
        }
      `}</style>
    </>
  );
};

export default ThreeBackground; 