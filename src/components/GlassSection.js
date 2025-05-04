import React, { useRef, forwardRef, memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Check if device is low-end
const isLowEndDevice = () => {
  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check device memory if available (Chrome)
  const hasLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
  
  // Check hardware concurrency if available
  const hasLowConcurrency = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
  
  return isMobile || hasLowMemory || hasLowConcurrency;
};

const Timeline = memo(({ children }) => (
  <div className="timeline-container">
    {React.Children.map(children, (child, idx) => (
      <div className="timeline-item">
        <div className="timeline-marker" />
        <div className="timeline-content">{child}</div>
      </div>
    ))}
    <div className="timeline-line" />
  </div>
));

const GlassSection = forwardRef(({ title, children, index, timeline }, ref) => {
  const innerRef = useRef();
  const sectionRef = ref || innerRef;
  const [lowEndMode, setLowEndMode] = useState(false);

  useEffect(() => {
    setLowEndMode(isLowEndDevice());
  }, []);

  // Adaptive styling based on device capabilities
  const getBackdropFilter = () => {
    if (lowEndMode) {
      return 'none'; // No blur on low-end devices
    }
    return 'blur(10px)';
  };

  const getBgOpacity = () => {
    return lowEndMode ? 0.15 : 0.1; // Higher opacity for low-end devices to compensate for no blur
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 80 }}
        exit={{ opacity: 0, y: -60 }}
        transition={{ 
          duration: 0.7, 
          delay: lowEndMode ? 0.05 : index * 0.15,  // Reduce stagger delay on low-end devices
          ease: 'easeOut' 
        }}
        viewport={{ once: false, amount: 0.3 }}
        className="glass-section"
        style={{
          backdropFilter: getBackdropFilter(),
          backgroundColor: `rgba(255, 255, 255, ${getBgOpacity()})`,
          borderRadius: '20px',
          padding: '2rem',
          margin: '2rem 0',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          transform: 'perspective(1000px)',
          transformStyle: lowEndMode ? 'flat' : 'preserve-3d', // simpler transform style for low-end devices
          transition: 'all 0.3s ease',
          willChange: 'transform, opacity', // Hint for browser optimization
        }}
        whileHover={lowEndMode ? {} : {
          scale: 1.02,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.57)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontSize: '2rem',
            marginBottom: '1.5rem',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
          }}
        >
          {title}
        </h2>
        <div style={{ color: '#fff', lineHeight: '1.6' }}>
          {timeline ? <Timeline>{children}</Timeline> : children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default memo(GlassSection); 