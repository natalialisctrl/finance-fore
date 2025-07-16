import { useQuery } from "@tanstack/react-query";

export function useAuth() {
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