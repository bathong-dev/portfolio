import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PhotoGallery = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const slides = [
    {
      image: "https://via.placeholder.com/800x500",
      caption: "Slide 1 Caption"
    },
    {
      image: "https://via.placeholder.com/800x500",
      caption: "Slide 2 Caption"
    },
    {
      image: "https://via.placeholder.com/800x500",
      caption: "Slide 3 Caption"
    }
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrent(current => (current + 1) % slides.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const handleDotClick = (index) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="glass-card" data-aos="fade-up">
      <h2>Photo Gallery</h2>
      <div className="slideshow-container">
        <AnimatePresence initial={false} custom={current}>
          <motion.div
            key={current}
            custom={current}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            style={{ position: 'relative', width: '100%', height: '500px' }}
          >
            <img 
              src={slides[current].image} 
              alt={`Slide ${current + 1}`} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <motion.div 
              className="caption"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slides[current].caption}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        <div className="dots" style={{ textAlign: 'center', marginTop: '20px' }}>
          {slides.map((_, index) => (
            <motion.span 
              key={index} 
              className={`dot ${current === index ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
