interface ForeseeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function ForeseeLogo({ size = 'md', showText = true, className = "" }: ForeseeLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Foresee Eye Logo */}
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer eye shape */}
          <path
            d="M50 20C70 20 85 40 85 50C85 60 70 80 50 80C30 80 15 60 15 50C15 40 30 20 50 20Z"
            fill="hsl(213 70% 60%)"
            fillOpacity="0.3"
          />
          
          {/* Middle eye layer */}
          <path
            d="M50 25C65 25 77 40 77 50C77 60 65 75 50 75C35 75 23 60 23 50C23 40 35 25 50 25Z"
            fill="hsl(213 50% 45%)"
            fillOpacity="0.5"
          />
          
          {/* Inner eye layer */}
          <path
            d="M50 30C60 30 70 40 70 50C70 60 60 70 50 70C40 70 30 60 30 50C30 40 40 30 50 30Z"
            fill="hsl(213 30% 35%)"
            fillOpacity="0.7"
          />
          
          {/* Chart line inside eye */}
          <path
            d="M35 55 L42 45 L48 50 L55 40 L65 45"
            stroke="hsl(6 78% 57%)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Central coral dot */}
          <circle
            cx="50"
            cy="50"
            r="4"
            fill="hsl(6 78% 57%)"
          />
        </svg>
      </div>
      
      {/* Foresee Text */}
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} text-foreground tracking-tight`}>
          Foresee
        </span>
      )}
    </div>
  );
}

export default ForeseeLogo;