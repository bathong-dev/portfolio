import React, { useRef, useEffect, useState, memo } from 'react';
import { motion, useInView } from 'framer-motion';

// Import icons selectively instead of importing entire libraries
import { 
  FaReact, FaJs, FaHtml5, FaCss3Alt, FaNodeJs, FaPython, 
  FaDocker, FaAws, FaGit, FaDatabase, FaEthereum, FaCube, FaCode 
} from 'react-icons/fa';
import { SiNextdotjs, SiVuedotjs, SiSolidity } from 'react-icons/si';

// Pre-define icon map to avoid creating it on each render
const iconMap = {
  FaReact, FaJs, FaHtml5, FaCss3Alt, FaNodeJs, FaPython, 
  FaDocker, FaAws, FaGit, FaDatabase, FaEthereum, FaCube, FaCode,
  SiNextdotjs, SiVuedotjs, SiSolidity
};

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

// Detect low-end devices
const isLowEndDevice = () => {
  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check device memory if available (Chrome)
  const hasLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
  
  // Check hardware concurrency if available
  const hasLowConcurrency = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
  
  return isMobile || hasLowMemory || hasLowConcurrency;
};

const SkillBar = memo(({ rating }) => (
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
      willChange: 'width',
    }} />
  </div>
));

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

// Simpler variants for low-end devices
const simpleCardVariants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  hidden: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
};

const SkillCard = memo(({ skill, index, inView, lowEndMode }) => {
  // Get appropriate icon
  const Icon = iconMap[skill.icon];
  const iconColor = getIconColor(skill.icon);
  const variants = lowEndMode ? simpleCardVariants : cardVariants;
  
  return (
    <motion.div
      className="skill-category"
      key={skill.name}
      style={{ 
        textAlign: 'center',
        willChange: 'transform, opacity'
      }}
      custom={index}
      variants={variants}
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
});

const SkillsShowcase = ({ skills }) => {
  const ref = useRef();
  const inView = useInView(ref, { amount: 0.2 });
  const [lowEndMode, setLowEndMode] = useState(false);

  useEffect(() => {
    // Check for low-end device on component mount
    setLowEndMode(isLowEndDevice());
  }, []);

  return (
    <div className="skills-grid" ref={ref}>
      {skills.map((skill, i) => (
        <SkillCard 
          key={skill.name}
          skill={skill} 
          index={i} 
          inView={inView}
          lowEndMode={lowEndMode}
        />
      ))}
    </div>
  );
};

export default memo(SkillsShowcase); 