import React, { useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Timeline = ({ children }) => (
  <div className="timeline-container">
    {React.Children.map(children, (child, idx) => (
      <div className="timeline-item">
        <div className="timeline-marker" />
        <div className="timeline-content">{child}</div>
      </div>
    ))}
    <div className="timeline-line" />
  </div>
);

const GlassSection = forwardRef(({ title, children, index, timeline }, ref) => {
  const innerRef = useRef();
  const sectionRef = ref || innerRef;

  return (
    <AnimatePresence>
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 80 }}
        exit={{ opacity: 0, y: -60 }}
        transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
        viewport={{ once: false, amount: 0.3 }}
        className="glass-section"
        style={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
          margin: '2rem 0',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          transform: 'perspective(1000px)',
          transformStyle: 'preserve-3d',
          transition: 'all 0.3s ease',
        }}
        whileHover={{
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

export default GlassSection; 