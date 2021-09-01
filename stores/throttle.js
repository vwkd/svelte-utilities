import { derived } from 'svelte/store';

/**
 * Returns store that updates its value only every <delay> milliseconds
 * of source updating its value
 */
export default function throttle(store, delay = 0) {
  let last;

  return derived(store, ($value, set) => {
    const now = Date.now();
    const duration = now - last;

    // set now if past delay or uninitialised
    if (duration > delay || !last) {
      set($value);
      last = now;

    // set after delay otherwise, except if gets update in meantime
    } else {
      const timeoutId = setTimeout(() => {
        set($value);
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      }
    }

  });
}