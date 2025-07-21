import { ErrorBoundary } from "react-error-boundary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface MobileSafeWrapperProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  componentName?: string;
}

function ErrorFallback({ error, resetErrorBoundary, fallbackTitle, componentName }: any) {
  console.error(`Mobile component error in ${componentName}:`, error);
  
  return (
    <Card className="glass-card border-red-500/50">
      <CardContent className="p-4 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <h3 className="text-white font-semibold mb-2">
          {fallbackTitle || "Component Error"}
        </h3>
        <p className="text-white/70 text-sm mb-3">
          Something went wrong loading this section
        </p>
        <Button 
          onClick={resetErrorBoundary}
          size="sm"
          className="touch-manipulation"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}

export function MobileSafeWrapper({ children, fallbackTitle, componentName }: MobileSafeWrapperProps) {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback {...props} fallbackTitle={fallbackTitle} componentName={componentName} />
      )}
      onError={(error, errorInfo) => {
        console.error(`Error boundary caught error in ${componentName}:`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}