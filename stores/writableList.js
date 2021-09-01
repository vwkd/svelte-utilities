/**
 * Creates a writable store for a list of (possibly ephemeral) values.
 * The value of the store is an array of {id, value} objects.
 * Setting the store to a value adds it to the end of the existing array.
 * If specified, values are removed from the list after a certain time.
 * @param initialValue initial value.
 * @param duration (optional) duration after which a value is removed, in milliseconds.
 * Beware: duration also applies to the initial value if set.
 * Note: the writable store has no `update` method because it wouldn't be clear which value to update
 */
export function writableList(initialValue, duration) {
	// validate duration, either undefined or number
	if (duration !== undefined && typeof duration != "number") {
		throw new Error("duration must be a number.")
	}

	// use Set because has convenient delete method, no need to keep track of array index, items are unique because each object literal is unique
	// timeouts is only used if duration !== undefined
	const vals = new Set();
	const timeouts = new Set();
	const fns = new Set();

	function subscribe(fn) {
		if (typeof fn != "function") {
			throw new Error("Subscriber must be a function.")
		}

		// note: has no effect if fn is already subscriber, but will still call it and return unsubscribe function
		fns.add(fn);

		fn(Array.from(vals));

		return () => { unsubscribe(fn) };
	}

	function unsubscribe(fn) {
		fns.delete(fn);

		if (duration !== undefined) {
			// clean up running timeouts after last subscriber left
			// also remove all values because doesn't make sense for resubscribers to see uncompleted values from before
			if (!fns.size) {
				timeouts.forEach(timeout => {
					clearTimeout(timeout.timeoutId);
				});
				timeouts.clear();
				vals.clear();
			}
		}
	}

	function broadcast() {
		fns.forEach(fn => { fn(Array.from(vals)) })
	}

	let i = 0;

	function set(val) {
		i += 1;
		const o = {
			id: i,
			value: val
		}
		vals.add(o);
		if (duration !== undefined) {
			const timeout = {
				id: i,
				timeoutId: undefined,
			}
			timeout.timeoutId = setTimeout(() => {
				vals.delete(o);
				broadcast();
				timeouts.delete(timeout);
			}, duration);
			timeouts.add(timeout);
		}
		broadcast();
	}

	if (initialValue !== undefined) {
		set(initialValue);
	}

	return {
		subscribe,
		set
	};

}