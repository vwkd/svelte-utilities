import { readable } from 'svelte/store';

/**
 * Returns store that updates with DOM event on node
 * Note, if gets node using this-binding on element
 * must call function in `onMount` because script runs before
 * body and binding is undefined
 * Note, use optional chaining to access properties
 * since undefined until first event, e.g. $store?.target?.value
 */
export default function domEvent(node, event) {
  return readable({}, set => {
    node.addEventListener(event, handler);

    function handler(event) {
      set(event);
    }

    return () => {
      node.removeEventListener(event, handler);
    };
  });

}