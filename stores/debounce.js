import { derived } from 'svelte/store';

/**
 * Returns store that updates its value only after <delay> milliseconds
 * of source updating its value
 */
export default function debounced(store, delay = 0) {
  let initialised;

  return derived(store, ($value, set) => {

    // set now if uninitialised
    if (!initialised) {
      set($value);
      initialised = true;

    // set after delay otherwise, except if gets update in meantime
    } else {
      const timeoutId = setTimeout(() => {
        set($value);
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      }
    });
}