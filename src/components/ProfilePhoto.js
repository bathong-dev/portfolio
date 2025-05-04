import React from 'react';
import { motion } from 'framer-motion';

const ProfilePhoto = ({ src = '/profile.jpg', alt = 'Profile Photo', name = 'Ba Thong Huynh' }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 60 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    viewport={{ once: false, amount: 0.3 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '2.5rem',
      marginBottom: '2.5rem',
    }}
  >
    <div style={{
      width: 210,
      height: 210,
      borderRadius: '50%',
      overflow: 'hidden',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      border: '3px solid rgba(255,255,255,0.25)',
      background: 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
    <div style={{
      marginTop: '1.2rem',
      fontSize: '2.1rem',
      fontWeight: 700,
      color: '#fff',
      textShadow: '0 2px 16px rgba(31,38,135,0.25)',
      letterSpacing: '0.04em',
    }}>{name}</div>
  </motion.div>
);

export default ProfilePhoto; 