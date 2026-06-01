import { useEffect, useState } from 'react';
import { useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion';

export default function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { stiffness: 140, damping: 22 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useMotionValueEvent(spring, 'change', (latest) => {
    const factor = 10 ** decimals;
    setDisplay(Math.round(latest * factor) / factor);
  });

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
