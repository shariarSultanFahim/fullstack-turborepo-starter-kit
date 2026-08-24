import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiResponse } from "@repo/types";

import { get, post } from "@/lib/api";

import { useAuth } from "@/providers/AuthProvider";

import type { AuthUser, LoginCredentials, SignupCredentials } from "@/types";

export { useAuth };

interface LoginApiResult {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser;
}

export function useLoginMutation() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await post<ApiResponse<LoginApiResult>>("/auth/login", credentials);
      return response;
    },
    onSuccess: (response) => {
      if (response.data?.accessToken) {
        login(response.data.accessToken, response.data.user);
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        toast.success(response.message || "Welcome back! Login successful.");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to log in");
    }
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const response = await post<ApiResponse<AuthUser>>("/user", credentials);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message || "Account created successfully! Please sign in.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create account");
    }
  });
}

export function useUserProfileQuery(enabled = true) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await get<ApiResponse<AuthUser>>("/user/profile");
      return response.data;
    },
    enabled: isAuthenticated && enabled,
    staleTime: 1000 * 60 * 5
  });
}
