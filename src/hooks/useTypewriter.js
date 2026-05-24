import { useState, useEffect, useRef } from 'react';

/**
 * useTypewriter — renders text character by character for a "typing" effect.
 *
 * @param {string}  text        The full text to display.
 * @param {boolean} isNew       Whether this message is freshly received (triggers the effect).
 *                              Old/restored messages render instantly.
 * @param {number}  speed       Milliseconds per character (default: 16ms ≈ 60fps feel).
 * @returns {{ displayedText: string, isDone: boolean }}
 */
export const useTypewriter = (text = '', isNew = false, speed = 16) => {
  // If message is not new, reveal everything immediately.
  const [displayedText, setDisplayedText] = useState(isNew ? '' : text);
  const [isDone, setIsDone] = useState(!isNew);

  const indexRef  = useRef(isNew ? 0 : text.length);
  const timerRef  = useRef(null);
  const textRef   = useRef(text);
  const isNewRef  = useRef(isNew);

  useEffect(() => {
    textRef.current = text;
    isNewRef.current = isNew;
  });

  useEffect(() => {
    // Clear any running timer when effect re-runs
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (!isNew) {
      setDisplayedText(text);
      setIsDone(true);
      return;
    }

    // Reset for new message
    indexRef.current = 0;
    setDisplayedText('');
    setIsDone(false);

    if (!text) {
      setIsDone(true);
      return;
    }

    // Use requestAnimationFrame for smoother rendering,
    // batching characters so longer texts don't drag.
    let lastTime = 0;
    let animFrameId;

    const tick = (timestamp) => {
      const elapsed = timestamp - lastTime;

      if (elapsed >= speed) {
        lastTime = timestamp;
        indexRef.current += 1;
        // Batch: add more characters at once for fast speeds so it feels snappy
        const chunkSize = speed < 10 ? 3 : 1;
        indexRef.current = Math.min(indexRef.current + chunkSize - 1, text.length);

        setDisplayedText(text.slice(0, indexRef.current));

        if (indexRef.current >= text.length) {
          setIsDone(true);
          return; // Stop the animation loop
        }
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isNew, speed]);

  return { displayedText, isDone };
};
