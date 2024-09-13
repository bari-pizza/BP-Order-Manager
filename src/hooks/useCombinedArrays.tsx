import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to combine multiple arrays and track their changes.
 *
 * @param {...any[]} arrays - One or more arrays to be combined.
 * @returns {any[]} The combined array.
 */
export const useCombinedArrays = <T,>(...arrays: T[][]) => {
    const [combined, setCombined] = useState<T[]>([]);
    const prevLengthsRef = useRef(arrays.map((arr) => arr.length));

    useEffect(() => {
        const currentLengths = arrays.map((arr) => arr.length);

        // Check if the lengths of any arrays have changed
        if (!currentLengths.every((len, index) => len === prevLengthsRef.current[index])) {
            // Combine all arrays and update the state
            const newCombined = arrays.flat();
            setCombined(newCombined);

            // Update ref with current lengths
            prevLengthsRef.current = currentLengths;
        }
    }, [arrays]);

    return combined;
};
