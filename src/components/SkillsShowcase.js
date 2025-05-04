import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';

const getIconColor = (name) => {
  const colors = {
    'FaReact': '#61dafb',
    'FaJs': '#f7df1e',
    'FaHtml5': '#e44d26',
    'FaCss3Alt': '#1572b6',
    'FaNodeJs': '#3c873a',
    'FaPython': '#3776ab',
    'FaDocker': '#0db7ed',
    'FaAws': '#ff9900',
    'FaGit': '#f34f29',
    'FaDatabase': '#4db33d',
    'FaEthereum': '#627eea',
    'FaCube': '#29b6af',
    'FaCode': '#4a90e2',
    'SiNextdotjs': '#000000',
    'SiVuedotjs': '#4FC08D',
    'SiSolidity': '#363636'
  };
  return colors[name] || '#4a90e2';
};

const SkillBar = ({ rating }) => (
  <div style={{
    background: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    height: 10,
    width: 80,
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 4,
    overflow: 'hidden',
    display: 'inline-block',
    verticalAlign: 'middle',
  }}>
    <div style={{
      width: `${rating * 20}%`,
      height: '100%',
      background: 'linear-gradient(90deg, #4a90e2, #00c6fb)',
      borderRadius: 8,
      transition: 'width 0.4s',
    }} />
  </div>
);

const cardVariants = {
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
  hidden: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.4, ease: 'easeIn' },
  },
};

const SkillsShowcase = ({ skills }) => {
  const ref = useRef();
  const inView = useInView(ref, { amount: 0.2 });

  return (
    <div className="skills-grid" ref={ref}>
      {skills.map((skill, i) => {
        // Check which icon library to use
        let Icon;
        if (skill.icon.startsWith('Fa')) {
          Icon = FaIcons[skill.icon];
        } else if (skill.icon.startsWith('Si')) {
          Icon = SiIcons[skill.icon];
        }

        const iconColor = getIconColor(skill.icon);
        return (
          <motion.div
            className="skill-category"
            key={skill.name}
            style={{ textAlign: 'center' }}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <div style={{ fontSize: 40, marginBottom: 8 }}>
              {Icon ? <Icon color={iconColor} /> : skill.name[0]}
            </div>
            <div style={{ fontWeight: 600, fontSize: 18 }}>{skill.name}</div>
            <SkillBar rating={skill.rating} />
            <div style={{ color: '#e0eaff', fontSize: 13, marginTop: 2 }}>
              Proficiency: {skill.rating}/5
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SkillsShowcase; 