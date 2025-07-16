import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const autoLoginAttempted = useRef(false);

  // Auto-login effect
  useEffect(() => {
    if (!autoLoginAttempted.current) {
      autoLoginAttempted.current = true;
      // Automatically perform demo login
      apiRequest("/api/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "natalia", password: "1234" }),
      }).catch(() => {
        // Ignore errors, just continue
      });
    }
  }, []);

  // Try demo auth first, then regular auth
  const { data: demoUser, isLoading: demoLoading } = useQuery({
    queryKey: ["/api/demo-auth/user"],
    retry: false,
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !demoUser, // Only try regular auth if demo auth failed
  });

  const finalUser = demoUser || user;
  const isLoading = demoLoading || userLoading;

  return {
    user: finalUser,
    isLoading,
    isAuthenticated: !!finalUser,
  };
}