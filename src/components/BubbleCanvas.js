import React, { useEffect } from 'react';

const BubbleCanvas = () => {
  useEffect(() => {
    const canvas = document.getElementById('bubbleCanvas');
    const ctx = canvas.getContext('2d');
    const bubbles = [];
    const Skills = ['JS', 'Python', 'HTML', 'CSS', 'React', 'Next', 'Vue', 'Node.js', 'SQL', 'Mongo', 'php', 'Laravel', 'django', 'flask'];

    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse position
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const numBubbles = 70;
    for (let i = 0; i < numBubbles; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 25 + 10,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`,
        text: Skills[Math.floor(Math.random() * Skills.length)],
        pulseDirection: 1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        originalRadius: Math.random() * 25 + 10
      });
    }

    const animateBubbles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach(bubble => {
        // Calculate distance to mouse
        const dx = mouseX - bubble.x;
        const dy = mouseY - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Repel bubbles from mouse
        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (150 - distance) / 150;
          bubble.dx -= Math.cos(angle) * force * 0.5;
          bubble.dy -= Math.sin(angle) * force * 0.5;
        }
        
        // Add some randomness
        if (Math.random() < 0.01) {
          bubble.dx += (Math.random() - 0.5) * 0.3;
          bubble.dy += (Math.random() - 0.5) * 0.3;
        }
        
        // Speed limit
        const speed = Math.sqrt(bubble.dx * bubble.dx + bubble.dy * bubble.dy);
        if (speed > 3) {
          bubble.dx = (bubble.dx / speed) * 3;
          bubble.dy = (bubble.dy / speed) * 3;
        }
        
        bubble.x += bubble.dx;
        bubble.y += bubble.dy;

        // Pulse effect
        bubble.radius += bubble.pulseDirection * bubble.pulseSpeed;
        if (bubble.radius > bubble.originalRadius * 1.2 || bubble.radius < bubble.originalRadius * 0.8) {
          bubble.pulseDirection *= -1;
        }

        // Wrap around screen
        if (bubble.x > canvas.width + bubble.radius) bubble.x = -bubble.radius;
        if (bubble.x < -bubble.radius) bubble.x = canvas.width + bubble.radius;
        if (bubble.y > canvas.height + bubble.radius) bubble.y = -bubble.radius;
        if (bubble.y < -bubble.radius) bubble.y = canvas.height + bubble.radius;

        // Draw the bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();

        // Draw the text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.font = `${bubble.radius / 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bubble.text, bubble.x, bubble.y);
      });
      requestAnimationFrame(animateBubbles);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animateBubbles();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas id="bubbleCanvas" style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default BubbleCanvas;
