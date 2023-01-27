import { useRef, ForwardedRef, useEffect } from 'react';

const useCombinedRefs = (...refs: ForwardedRef<any>[]) => {
  const targetRef = useRef<any>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};

export default useCombinedRefs;
