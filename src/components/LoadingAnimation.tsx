import { motion } from "framer-motion";

const loadingVariants = {
  animate: {
    scale: [1, 1.5, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
    },
  },
};

const LoadingAnimation = () => {
  return (
    <motion.div
      variants={loadingVariants}
      animate="animate"
      className="loading-circle"
    ></motion.div>
  );
};

export default LoadingAnimation;
