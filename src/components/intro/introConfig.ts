/**
 * NEXORA Intro Splash Animation Configuration & Constants
 */

/**
 * Global developer toggle to disable the intro splash screen entirely.
 * Set to `true` to bypass the animation across the app.
 */
export const DISABLE_INTRO = false;

/**
 * Session storage key tracking whether the intro was already displayed.
 */
export const INTRO_SEEN_KEY = 'nexora_intro_seen';

/**
 * Configurable animation timeline timings in milliseconds.
 * Total intro duration before exit is 6200ms (6.2s).
 */
export const INTRO_TIMINGS = {
  LOGO_SPIN_START: 150,        // 0.15s: Logo spins in and settles over 1.6s
  WORDMARK_START: 1300,        // 1.3s: Wordmark scramble starts
  WORDMARK_TICK_INTERVAL: 55,  // 55ms per scramble tick
  TECHNOLOGIES_START: 2700,    // 2.7s: Technologies line fades in
  SUBTITLE_START: 3000,        // 3.0s: Subtitle starts word-by-word
  SUBTITLE_STAGGER_MS: 260,    // 260ms between words
  TAGLINE_START: 3900,         // 3.9s: Tagline sweeps with moving white shine
  PROGRESS_START: 4100,        // 4.1s: Progress bar begins filling
  PROGRESS_DURATION: 1700,     // 1.7s: Progress bar fills to 100%
  EXIT_START: 6200,            // 6.2s: Intro begins fade out
  EXIT_DURATION: 800,          // 0.8s: Exit fade-out transition duration
  REDUCED_MOTION_HOLD: 1000,   // Static display duration if prefers-reduced-motion is on
};
