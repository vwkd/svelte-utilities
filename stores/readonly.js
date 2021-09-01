import { derived } from 'svelte/store';

/**
 * Returns readonly store
 */
export default function readonly(store) {
  return derived(store, $value => $value);
}