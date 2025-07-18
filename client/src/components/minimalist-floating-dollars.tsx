import { useEffect, useState } from 'react';

interface FloatingDollar {
  id: number;
  x: number;
  y: number;
  size: number;
  animationType: 'float' | 'drift' | 'fade';
  delay: number;
  duration: number;
}

export function MinimalistFloatingDollars() {
  const [dollars, setDollars] = useState<FloatingDollar[]>([]);

  useEffect(() => {
    // Generate minimalist floating dollars
    const generateDollars = () => {
      const newDollars: FloatingDollar[] = [];
      const dollarCount = window.innerWidth < 768 ? 6 : 10; // Fewer on mobile for minimalism
      
      for (let i = 0; i < dollarCount; i++) {
        newDollars.push({
          id: i,
          x: Math.random() * 85 + 5, // 5-90% to avoid edges
          y: Math.random() * 85 + 5,
          size: Math.random() * 15 + 12, // 12-27px for subtlety
          animationType: ['float', 'drift', 'fade', 'pulse'][Math.floor(Math.random() * 4)] as any,
          delay: Math.random() * 8, // 0-8s delay for spacing
          duration: Math.random() * 6 + 8, // 8-14s duration for slower movement
        });
      }
      
      setDollars(newDollars);
    };

    generateDollars();
    
    // Regenerate occasionally for variety
    const interval = setInterval(generateDollars, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {dollars.map((dollar) => (
        <div
          key={dollar.id}
          className={`absolute select-none minimalist-${dollar.animationType}`}
          style={{
            left: `${dollar.x}%`,
            top: `${dollar.y}%`,
            fontSize: `${dollar.size}px`,
            animationDelay: `${dollar.delay}s`,
            animationDuration: `${dollar.duration}s`,
            fontWeight: 200,
            fontFamily: 'ui-serif, Georgia, serif',
            color: `rgba(255, ${140 + Math.random() * 40}, ${40 + Math.random() * 20}, ${0.08 + Math.random() * 0.12})`,
            filter: 'blur(0.3px)',
          }}
        >
          $
        </div>
      ))}
      
      {/* Sophisticated ambient layer */}
      <div className="absolute top-32 left-16 text-3xl minimalist-float" 
           style={{ 
             animationDelay: '0s', 
             color: 'rgba(255, 193, 7, 0.06)',
             fontWeight: 100,
             filter: 'blur(0.5px)'
           }}>$</div>
      
      <div className="absolute top-64 right-24 text-2xl minimalist-fade" 
           style={{ 
             animationDelay: '2.5s', 
             color: 'rgba(255, 165, 0, 0.08)',
             fontWeight: 200
           }}>$</div>
      
      <div className="absolute bottom-40 left-1/3 text-xl minimalist-drift" 
           style={{ 
             animationDelay: '4.2s', 
             color: 'rgba(255, 215, 0, 0.05)',
             filter: 'blur(0.2px)'
           }}>$</div>
      
      <div className="absolute top-1/2 right-1/4 text-2xl minimalist-float" 
           style={{ 
             animationDelay: '1.8s', 
             color: 'rgba(255, 140, 66, 0.07)',
             fontWeight: 100
           }}>$</div>
      
      <div className="absolute bottom-32 right-16 text-lg minimalist-fade" 
           style={{ 
             animationDelay: '3.7s', 
             color: 'rgba(255, 200, 50, 0.06)'
           }}>$</div>
      
      <div className="absolute top-1/4 left-1/2 text-xl minimalist-drift" 
           style={{ 
             animationDelay: '5.1s', 
             color: 'rgba(255, 180, 30, 0.09)',
             filter: 'blur(0.4px)'
           }}>$</div>
      
      {/* Mobile-optimized layer */}
      <div className="md:hidden">
        <div className="absolute top-20 right-12 text-lg minimalist-drift" 
             style={{ 
               animationDelay: '1.3s',
               color: 'rgba(255, 170, 40, 0.08)'
             }}>$</div>
        
        <div className="absolute bottom-24 left-12 text-md minimalist-float" 
             style={{ 
               animationDelay: '2.9s',
               color: 'rgba(255, 185, 45, 0.07)',
               fontWeight: 100
             }}>$</div>
        
        <div className="absolute top-1/2 left-8 text-sm minimalist-fade" 
             style={{ 
               animationDelay: '4.4s',
               color: 'rgba(255, 160, 35, 0.06)'
             }}>$</div>
      </div>
    </div>
  );
}