import { motion, useScroll, useTransform } from 'framer-motion';

interface DecorativeSVGProps {
  src: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  scrollFactor?: number;
  opacity?: number;
  rotate?: number;
  floatAmplitude?: number;
  floatDuration?: number;
  /** When the parent section is hovered, set this to true to make the element more pronounced */
  hovered?: boolean;
}

const DecorativeSVG = ({
  src,
  size = 48,
  top,
  left,
  right,
  bottom,
  scrollFactor = 0.18,
  opacity = 0.18,
  rotate = 0,
  floatAmplitude = 10,
  floatDuration = 4,
  hovered = false,
}: DecorativeSVGProps) => {
  const { scrollY } = useScroll();
  const scrollParallax = useTransform(scrollY, [0, 4000], [0, -4000 * scrollFactor]);

  const activeOpacity = Math.min(1, opacity * 3.5);

  return (
    <motion.div
      className="absolute select-none"
      style={{ top, left, right, bottom, width: size, height: size, y: scrollParallax }}
      aria-hidden
    >
      {/* Section-hover layer: responds to parent's hovered state */}
      <motion.div
        animate={{
          opacity: hovered ? activeOpacity : opacity,
          scale:   hovered ? 1.12 : 1,
        }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        style={{ width: size, height: size }}
      >
        {/* Float + direct-hover layer */}
        <motion.img
          src={src}
          width={size}
          height={size}
          alt=""
          draggable={false}
          className="w-full h-full object-contain"
          style={{ rotate }}
          animate={{ y: [0, -floatAmplitude, 0] }}
          transition={{
            duration: floatDuration,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'loop',
          }}
          whileHover={{ scale: 1.25, rotate: rotate + 35 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default DecorativeSVG;
