import React, { useEffect, useRef, useState } from 'react';

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

const ThreeBackground = () => {
  const bgRef = useRef();
  const colorIndex = useRef(0);
  const nextColorIndex = useRef(1);
  const progress = useRef(0);
  const mouse = useRef({ x: 50, y: 50 });
  const light = useRef({ x: 50, y: 50 });
  const [pulses, setPulses] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      mouse.current = { x, y };
    };
    const handleClick = (e) => {
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
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);

  useEffect(() => {
    let animationFrame;
    const duration = 8000; // ms for each color transition
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
      // Smoothly interpolate light position toward mouse
      light.current.x = lerp(light.current.x, mouse.current.x, 0.01);
      light.current.y = lerp(light.current.y, mouse.current.y, 0.01);
      const { x, y } = light.current;
      if (bgRef.current) {
        bgRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(80,180,255,0.22) 0%, ${bgColor} 100%)`;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Multiple pulse effects
  return (
    <>
      <div
        ref={bgRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
          transition: 'background 0.5s',
        }}
      />
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