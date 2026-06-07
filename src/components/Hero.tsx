import { motion } from 'framer-motion';

// ── Constants ─────────────────────────────────────────────────────────────────

const SVG_SIZE = 1400;
const CX       = 700;
const CY       = 700;
const TS       = 1.27;   // tomb scale factor relative to original coords
const INNER_R  = 150;    // rays start just outside the scaled tomb

const RAYS = Array.from({ length: 16 }, (_, i) => {
  const isLong = i % 2 === 0;
  return {
    angle:    i * 22.5,
    outerR:   isLong ? 598 : 363,
    halfBase: isLong ? 17 : 10,
    halfTip:  2.3,
    opacity:  isLong ? 0.12 : 0.07,
  };
});

// ── Tomb shape (local coords centred at 0,0) ──────────────────────────────────
// Parent <g> applies translate(CX,CY) scale(TS) so these stay at design-scale.

const TombShape = () => (
  <g>
    {/* Rock face */}
    <rect
      x="-86" y="-76" width="172" height="146"
      rx="6"
      fill="rgba(185,165,128,0.16)"
      stroke="rgba(155,135,98,0.18)"
      strokeWidth="1"
    />

    {/* Horizontal stratification lines */}
    {[-52, -28, -4, 22, 48].map((y, i) => (
      <line
        key={i}
        x1="-82" y1={y} x2={y < 0 ? 82 : 78} y2={y}
        stroke="rgba(130,110,78,0.10)"
        strokeWidth="1"
      />
    ))}

    {/* Vertical crack */}
    <path
      d="M-55,-76 L-58,-50 L-52,-20 L-56,10 L-53,70"
      fill="none"
      stroke="rgba(110,90,60,0.10)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Arch entrance — dark interior */}
    <path d="M -42,70 L -42,4 A 42,48 0 0 1 42,4 L 42,70 Z" fill="rgba(5,9,5,0.82)" />

    {/* Resurrection light in the gap (uses gradient defined in parent SVG defs) */}
    <path d="M -42,70 L -42,4 A 42,48 0 0 1 42,4 L 42,70 Z" fill="url(#tombGlow)" />

    {/* Rolling stone — center (47,14) r=55 → left edge ≈ x=-8, gap on left side */}
    <circle
      cx="47" cy="14" r="55"
      fill="rgba(192,172,138,0.26)"
      stroke="rgba(155,138,100,0.28)"
      strokeWidth="1.5"
    />

    {/* Stone cracks */}
    <path d="M 18,-28 Q 30,-12 46,-18" fill="none" stroke="rgba(120,105,70,0.18)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 46,-18 Q 58,-24 70,-14" fill="none" stroke="rgba(120,105,70,0.14)" strokeWidth="1"   strokeLinecap="round" />
    <path d="M 10, 20 Q 26, 28 40, 22" fill="none" stroke="rgba(120,105,70,0.16)" strokeWidth="1"   strokeLinecap="round" />
    <path d="M 50, 30 Q 65, 38 76, 28" fill="none" stroke="rgba(120,105,70,0.13)" strokeWidth="1"   strokeLinecap="round" />
    <path d="M 35,-38 Q 42,-30 35,-22" fill="none" stroke="rgba(120,105,70,0.12)" strokeWidth="1"   strokeLinecap="round" />

    {/* Left-edge highlight on stone (where the gap is) */}
    <path
      d="M -6,64 A 55,55 0 0 1 -2,-41"
      fill="none"
      stroke="rgba(225,210,175,0.18)"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Ground shadow */}
    <line x1="-86" y1="70" x2="86" y2="70" stroke="rgba(120,100,68,0.14)" strokeWidth="1" />
    <ellipse cx="4" cy="70" rx="60" ry="5" fill="rgba(5,9,5,0.12)" />
  </g>
);

// ── Composite ─────────────────────────────────────────────────────────────────

const SunBackground = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

    {/* Static ambient glow — glow reduced by 0.025 vs previous */}
    <div
      className="absolute w-[1530px] h-[1530px] rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(247,181,0,0.045) 0%, rgba(247,181,0,0.005) 42%, transparent 70%)',
      }}
    />

    {/* Rotating rays (no disc, no halo circle) */}
    <motion.div
      className="absolute"
      style={{ width: SVG_SIZE, height: SVG_SIZE }}
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
    >
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {RAYS.map((ray, i) => (
          <g key={i} transform={`rotate(${ray.angle}, ${CX}, ${CY})`}>
            <polygon
              points={[
                `${CX - ray.halfBase},${CY - INNER_R}`,
                `${CX + ray.halfBase},${CY - INNER_R}`,
                `${CX + ray.halfTip},${CY - ray.outerR}`,
                `${CX - ray.halfTip},${CY - ray.outerR}`,
              ].join(' ')}
              fill={`rgba(247,181,0,${ray.opacity})`}
            />
          </g>
        ))}
      </svg>
    </motion.div>

    {/* Static tomb layer — does NOT rotate */}
    <div className="absolute" style={{ width: SVG_SIZE, height: SVG_SIZE }}>
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* tombGlow coords adjusted for translate(CX,CY) scale(TS) */}
          <radialGradient
            id="tombGlow"
            gradientUnits="userSpaceOnUse"
            cx={CX - 25 * TS}
            cy={CY + 32 * TS}
            r={38 * TS}
          >
            <stop offset="0%"   stopColor="rgba(255,230,140,0.22)" />
            <stop offset="60%"  stopColor="rgba(247,181,0,0.06)"   />
            <stop offset="100%" stopColor="rgba(247,181,0,0)"       />
          </radialGradient>
        </defs>

        {/* Tomb centred and scaled */}
        <g transform={`translate(${CX},${CY}) scale(${TS})`}>
          <TombShape />
        </g>
      </svg>
    </div>

    {/* Breathing glow at tomb center — glow reduced by 0.025 */}
    <motion.div
      className="absolute rounded-full"
      style={{
        width:  432,
        height: 432,
        background:
          'radial-gradient(circle, rgba(247,181,0,0.075) 0%, transparent 70%)',
      }}
      animate={{ scale: [1, 1.16, 1], opacity: [0.50, 0.85, 0.50] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

// ── Hero section ──────────────────────────────────────────────────────────────

const Hero = () => (
  <section
    id="home"
    className="relative w-full h-screen bg-bitter-liquorice flex items-center justify-center overflow-hidden"
  >
    <SunBackground />

    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
      <motion.h1
        className="text-6xl md:text-8xl lg:text-9xl font-cabinet font-black text-pink-swirl tracking-tighter leading-none mb-6"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        A CHURCH <br />
        <span className="text-waxy-corn">WITHOUT WALLS</span>
      </motion.h1>

      <motion.p
        className="text-xl md:text-2xl text-pink-swirl/80 font-general max-w-2xl mt-6"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        Faith that is living, joyful, and accessible to the youth of today.
      </motion.p>

      <motion.div
        className="mt-12"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
      >
        <a href="#about">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="px-8 py-4 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-lg rounded-full shadow-lg transition-shadow hover:shadow-[0_0_24px_rgba(247,181,0,0.45)]"
          >
            Discover Our Story
          </motion.button>
        </a>
      </motion.div>
    </div>
  </section>
);

export default Hero;
