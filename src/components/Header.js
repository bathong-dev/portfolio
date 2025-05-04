import React from 'react';
import { motion } from 'framer-motion';
import HeroName from './HeroName';

const Header = () => {
  return (
    <header>
      <div className="header-content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <HeroName name="YOUR NAME" subtitle="Web Developer & Designer" />
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
