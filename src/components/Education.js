import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Education = ({ education }) => {
  const ref = useRef();
  const inView = useInView(ref, { amount: 0.2 });

  return (
    <div className="timeline-container" ref={ref}>
      {education.map((edu, index) => (
        <motion.div
          key={index}
          className="timeline-item"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <h3>{edu.degree}</h3>
            <span className="timeline-date">{edu.period}</span>
            <p className="institution">{edu.institution}</p>
            <ul>
              {edu.description.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Education; 