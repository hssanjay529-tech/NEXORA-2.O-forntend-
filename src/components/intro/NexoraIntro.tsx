import React, { useEffect, useRef, useState, useCallback } from 'react';
import './NexoraIntro.css';
import {
  DISABLE_INTRO,
  INTRO_SEEN_KEY,
  INTRO_TIMINGS,
} from './introConfig';

export { DISABLE_INTRO, INTRO_SEEN_KEY, INTRO_TIMINGS };

interface NexoraIntroProps {
  onComplete: () => void;
  logoSrc?: string;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  driftX: number;
  opacity: number;
  swaySpeed: number;
  swayPhase: number;
}

const TARGET_WORD = 'NEXORA';
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&';
const SUBTITLE_WORDS = ['College', 'Management', 'Portal'];

const checkReducedMotion = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
};

export const NexoraIntro: React.FC<NexoraIntroProps> = ({
  onComplete,
  logoSrc = '/assets/nexora-logo-mark.png',
}) => {
  const isReducedMotion = checkReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const skipButtonRef = useRef<HTMLButtonElement | null>(null);

  // Animation timeline states (initialized with reduced motion presets if active)
  const [logoSettled, setLogoSettled] = useState(() => isReducedMotion);
  const [logoGlowActive, setLogoGlowActive] = useState(() => isReducedMotion);
  const [wordmarkVisible, setWordmarkVisible] = useState(() => isReducedMotion);
  const [scrambleTick, setScrambleTick] = useState(() => (isReducedMotion ? 999 : -1));
  const [technologiesVisible, setTechnologiesVisible] = useState(() => isReducedMotion);
  const [revealedSubtitleCount, setRevealedSubtitleCount] = useState(() =>
    isReducedMotion ? SUBTITLE_WORDS.length : 0
  );
  const [taglineVisible, setTaglineVisible] = useState(() => isReducedMotion);
  const [progressVisible, setProgressVisible] = useState(() => isReducedMotion);
  const [progressFilled, setProgressFilled] = useState(() => isReducedMotion);
  const [isExiting, setIsExiting] = useState(false);

  // Ref tracking completion to avoid duplicate calls
  const isCompletedRef = useRef(false);

  const triggerComplete = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch {
      // Ignore sessionStorage exceptions (e.g. private mode restrictions)
    }
    onComplete();
  }, [onComplete]);

  // Fast skip handler (triggered by Skip button or Esc / Enter)
  const handleSkip = useCallback(() => {
    if (isCompletedRef.current) return;
    setIsExiting(true);
    // Smooth fast exit
    const t = setTimeout(() => {
      triggerComplete();
    }, 220);
    return () => clearTimeout(t);
  }, [triggerComplete]);

  // Keyboard navigation: Escape or Enter skips intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // --------------------------------------------------------------------------
  // Reduced motion: Hold static frame for 1s then exit
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isReducedMotion) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(triggerComplete, 300);
    }, INTRO_TIMINGS.REDUCED_MOTION_HOLD);

    return () => clearTimeout(timer);
  }, [isReducedMotion, triggerComplete]);

  // --------------------------------------------------------------------------
  // Master Animation Timeline (only if reduced motion is disabled)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (isReducedMotion) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // 0.15s: Logo spins in and glow pulses
    timers.push(
      setTimeout(() => {
        setLogoSettled(true);
        setLogoGlowActive(true);
      }, INTRO_TIMINGS.LOGO_SPIN_START)
    );

    // 1.3s: Wordmark scramble begins
    timers.push(
      setTimeout(() => {
        setWordmarkVisible(true);
        setScrambleTick(0);
      }, INTRO_TIMINGS.WORDMARK_START)
    );

    // 2.7s: Technologies line fades in
    timers.push(
      setTimeout(() => {
        setTechnologiesVisible(true);
      }, INTRO_TIMINGS.TECHNOLOGIES_START)
    );

    // 3.0s: Subtitle word-by-word reveal (260ms stagger)
    SUBTITLE_WORDS.forEach((_, idx) => {
      timers.push(
        setTimeout(() => {
          setRevealedSubtitleCount(idx + 1);
        }, INTRO_TIMINGS.SUBTITLE_START + idx * INTRO_TIMINGS.SUBTITLE_STAGGER_MS)
      );
    });

    // 3.9s: Tagline with moving white shine sweeps in
    timers.push(
      setTimeout(() => {
        setTaglineVisible(true);
      }, INTRO_TIMINGS.TAGLINE_START)
    );

    // 4.1s: Progress bar track appears and fills over 1.7s
    timers.push(
      setTimeout(() => {
        setProgressVisible(true);
        // Small microtick to ensure CSS transition triggers smoothly
        setTimeout(() => {
          setProgressFilled(true);
        }, 30);
      }, INTRO_TIMINGS.PROGRESS_START)
    );

    // 6.2s: Intro completes and begins exit fade-out
    timers.push(
      setTimeout(() => {
        setIsExiting(true);
      }, INTRO_TIMINGS.EXIT_START)
    );

    // 7.0s: Exit fade-out finishes (6.2s + 0.8s) -> call onComplete
    timers.push(
      setTimeout(() => {
        triggerComplete();
      }, INTRO_TIMINGS.EXIT_START + INTRO_TIMINGS.EXIT_DURATION)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isReducedMotion, triggerComplete]);

  // --------------------------------------------------------------------------
  // Wordmark Scramble Tick Interval (55ms)
  // Letter i settles after 8 + 5 * i ticks
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (scrambleTick < 0 || scrambleTick > 35) return;

    const interval = setInterval(() => {
      setScrambleTick((prev) => {
        if (prev >= 35) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, INTRO_TIMINGS.WORDMARK_TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [scrambleTick]);

  // --------------------------------------------------------------------------
  // Layer 2: Particle Canvas (70 small pale-blue dots floating upward)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (isReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const PARTICLE_COUNT = 70;
    const particles: Particle[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Initialize particles across full screen
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.8 + Math.random() * 1.5,
          speedY: 0.28 + Math.random() * 0.55,
          driftX: (Math.random() - 0.5) * 0.2,
          opacity: 0.15 + Math.random() * 0.35,
          swaySpeed: 0.01 + Math.random() * 0.02,
          swayPhase: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();
    initParticles();
    window.addEventListener('resize', resize);

    // Canvas render loop at 60fps
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.swayPhase += p.swaySpeed;
        p.x += Math.sin(p.swayPhase) * 0.3 + p.driftX;

        // Wrap around when particle floats off top
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw soft pale-blue glowing dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 225, 255, ${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isReducedMotion]);

  // Compute scrambled letters
  const renderScrambleLetters = () => {
    return TARGET_WORD.split('').map((char, index) => {
      const settleThreshold = 8 + 5 * index;
      const isSettled = scrambleTick >= settleThreshold;

      let displayChar = char;
      if (!isSettled) {
        if (scrambleTick < 0) {
          displayChar = char; // fallback
        } else {
          // Select random character pseudo-deterministically per tick
          const randomIdx =
            Math.abs(Math.floor(Math.sin((scrambleTick + 1) * (index + 7)) * 1000)) %
            SCRAMBLE_CHARS.length;
          displayChar = SCRAMBLE_CHARS[randomIdx];
        }
      }

      return (
        <span
          key={index}
          className={`scramble-letter ${isSettled ? 'settled' : 'unsettled'}`}
        >
          {displayChar}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="NEXORA is loading"
      aria-live="polite"
      className={`nexora-intro-root ${isExiting ? 'is-exiting' : ''}`}
    >
      {/* Visual Layer 1: Aurora Background (3 drifting blurred circles) */}
      <div className="nexora-aurora-layer" aria-hidden="true">
        <div className="nexora-aurora-orb nexora-aurora-purple" />
        <div className="nexora-aurora-orb nexora-aurora-cyan" />
        <div className="nexora-aurora-orb nexora-aurora-pink" />
      </div>

      {/* Visual Layer 2: Particle Canvas (70 faint pale-blue dots) */}
      <canvas
        ref={canvasRef}
        className="nexora-particles-canvas"
        aria-hidden="true"
      />

      {/* Visual Layer 3: Centered Content Stack */}
      <div className="nexora-content-stack">
        {/* Logo with Spin-in and Pulsing Glow */}
        <div className="nexora-logo-wrapper">
          <div
            className={`nexora-logo-glow ${logoGlowActive ? 'is-active' : ''}`}
            aria-hidden="true"
          />
          <img
            src={logoSrc}
            alt="Nexora Technologies logo"
            className={`nexora-logo-img ${logoSettled ? 'is-settled' : ''}`}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Wordmark "NEXORA" with Decrypt/Scramble Effect */}
        <div
          className={`nexora-wordmark-container ${
            wordmarkVisible ? 'is-visible' : ''
          }`}
        >
          <h1 className="nexora-wordmark">{renderScrambleLetters()}</h1>
        </div>

        {/* "Technologies" with Gradient Flanking Lines */}
        <div
          className={`nexora-technologies-row ${
            technologiesVisible ? 'is-visible' : ''
          }`}
        >
          <span className="nexora-tech-line left" aria-hidden="true" />
          <span className="nexora-tech-text">TECHNOLOGIES</span>
          <span className="nexora-tech-line right" aria-hidden="true" />
        </div>

        {/* Subtitle "College Management Portal" Word-by-Word */}
        <div className="nexora-subtitle-row" aria-label="College Management Portal">
          {SUBTITLE_WORDS.map((word, idx) => (
            <span
              key={word}
              className={`nexora-subtitle-word ${
                idx < revealedSubtitleCount ? 'is-revealed' : ''
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Shiny Tagline with Sweeping White Highlight */}
        <div
          className={`nexora-tagline-wrapper ${
            taglineVisible ? 'is-visible' : ''
          }`}
        >
          <span className="nexora-tagline">
            Attendance • Exams • Fees • Timetable
          </span>
        </div>

        {/* Thin 2px Progress Bar */}
        <div
          className={`nexora-progress-track ${
            progressVisible ? 'is-visible' : ''
          }`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressFilled ? 100 : 0}
        >
          <div
            className="nexora-progress-fill"
            style={{ width: progressFilled ? '100%' : '0%' }}
          />
        </div>
      </div>

      {/* Subtle Skip Pill Button */}
      <button
        ref={skipButtonRef}
        type="button"
        onClick={handleSkip}
        className="nexora-skip-button"
        aria-label="Skip introductory animation"
      >
        <span>Skip</span>
        <svg
          className="nexora-skip-chevron"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3.5 2L6.5 5L3.5 8" />
        </svg>
      </button>
    </div>
  );
};

export default NexoraIntro;
