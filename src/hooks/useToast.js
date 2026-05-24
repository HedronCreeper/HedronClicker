import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [toast, setToast]   = useState({ message: '', type: '', visible: false });
  const toastTimerRef       = useRef(null);

  const showToast = useCallback((message, type = '') => {
    setToast({ message, type, visible: true });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(
      () => setToast(prev => ({ ...prev, visible: false })),
      2500
    );
  }, []);

  return { toast, showToast };
}
