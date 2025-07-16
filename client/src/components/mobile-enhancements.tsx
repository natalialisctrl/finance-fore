import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

// Mobile pull-to-refresh hook
export function usePullToRefresh(onRefresh: () => void) {
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        isTouching = true;
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching) return;
      
      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;
      
      if (deltaY > 100) {
        setIsPulling(true);
      } else {
        setIsPulling(false);
      }
    };

    const handleTouchEnd = () => {
      if (isPulling) {
        onRefresh();
        setIsPulling(false);
      }
      isTouching = false;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, onRefresh]);

  return isPulling;
}

// Haptic feedback for mobile interactions
export function useHapticFeedback() {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  return triggerHaptic;
}

// Mobile-optimized card swipe functionality
export function useCardSwipe() {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleSwipeStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleSwipeMove = (e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
    const deltaX = currentX.current - startX.current;
    
    if (Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    }
  };

  const handleSwipeEnd = () => {
    setSwipeDirection(null);
  };

  return {
    swipeDirection,
    swipeHandlers: {
      onTouchStart: handleSwipeStart,
      onTouchMove: handleSwipeMove,
      onTouchEnd: handleSwipeEnd
    }
  };
}

// Mobile toast notifications with haptic feedback
export function useMobileToast() {
  const { toast } = useToast();
  const triggerHaptic = useHapticFeedback();

  const showMobileToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    triggerHaptic(type === 'error' ? 'heavy' : 'light');
    
    toast({
      title: message,
      className: "mobile-toast",
      duration: 3000,
    });
  };

  return showMobileToast;
}

// Device detection hook
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  return deviceType;
}