import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const AboutMe = () => {
  const ref = useRef();
  const inView = useInView(ref, {
    once: false,
    amount: 0.2,
  });

  return (
    <section className="glass-card" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.7 }}
      >
        <h2>About Me</h2>
        <p>I'm a passionate developer with expertise in modern web technologies.</p>
      </motion.div>
    </section>
  );
};

export default AboutMe;
