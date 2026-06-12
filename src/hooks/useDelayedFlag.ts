import { useEffect, useState } from 'react';

/**
 * Returns `flag` only after it's been true for at least `delayMs` ms.
 * Useful for hiding loading indicators that would otherwise flash on
 * fast operations.
 */
export function useDelayedFlag(flag: boolean, delayMs: number): boolean {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!flag) {
      setDelayed(false);
      return;
    }
    const id = setTimeout(() => setDelayed(true), delayMs);
    return () => clearTimeout(id);
  }, [flag, delayMs]);

  return delayed;
}
