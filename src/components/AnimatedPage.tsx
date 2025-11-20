import React from 'react';
import { motion } from 'framer-motion';

const animationVariants = {
  initial: {
    opacity: 0,
    x: '5vw',
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: '-5vw',
  },
};

const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      variants={animationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ ease: 'easeInOut', duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;