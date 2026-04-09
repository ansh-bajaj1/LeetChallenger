import { useEffect, useRef } from 'react';

const DEFAULT_COLOR_STOPS = ['#7cff67', '#B19EEF', '#5227FF'];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex) => {
  const normalized = hex.replace('#', '').trim();

  if (normalized.length === 3) {
    const expanded = normalized
      .split('')
      .map((char) => char + char)
      .join('');
    const int = Number.parseInt(expanded, 16);

    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255,
    };
  }

  const int = Number.parseInt(normalized, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

export default function Aurora({
  colorStops = DEFAULT_COLOR_STOPS,
  amplitude = 1,
  blend = 0.5,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return undefined;
    }

    const colors = (colorStops.length ? colorStops : DEFAULT_COLOR_STOPS).map((color) => hexToRgb(color));
    const safeAmplitude = clamp(amplitude, 0.2, 2.4);
    const safeBlend = clamp(blend, 0.05, 1);

    let width = 0;
    let height = 0;
    let rafId = 0;

    const blobs = colors.map((color, index) => ({
      color,
      offset: index * 1.8,
      speedX: 0.00007 + index * 0.000015,
      speedY: 0.00005 + index * 0.000012,
      drift: 0.35 + index * 0.12,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, width, height);

      const baseRadius = Math.max(width, height) * (0.3 + safeAmplitude * 0.15);
      ctx.globalCompositeOperation = 'lighter';

      blobs.forEach((blob, index) => {
        const x =
          width *
          (0.5 +
            Math.sin(time * blob.speedX + blob.offset) * 0.32 +
            Math.sin(time * blob.speedX * 0.35 + blob.offset * 2.3) * 0.08);
        const y =
          height *
          (0.5 +
            Math.cos(time * blob.speedY + blob.offset) * 0.34 +
            Math.sin(time * blob.speedY * 0.45 + blob.offset * 1.7) * 0.09);

        const radius = baseRadius * (0.8 + Math.sin(time * 0.00023 + index) * 0.18);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

        gradient.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${0.44 + safeBlend * 0.32})`);
        gradient.addColorStop(0.55, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${0.2 + safeBlend * 0.18})`);
        gradient.addColorStop(1, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = window.requestAnimationFrame(render);
    };

    resize();
    rafId = window.requestAnimationFrame(render);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [amplitude, blend, colorStops]);

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} aria-hidden="true" />;
}
