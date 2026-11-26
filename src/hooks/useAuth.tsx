import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { login as loginAction, logoutUser, restoreSession as restoreSessionAction } from "@/store/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  /** Resolves to null on success, or the error message to show. */
  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      const result = await dispatch(loginAction({ email, password }));
      return loginAction.fulfilled.match(result) ? null : (result.payload ?? "Login failed");
    },
    [dispatch],
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  const restoreSession = useCallback(() => dispatch(restoreSessionAction()), [dispatch]);

  return {
    ...authState,
    isAdmin: authState.isAuthenticated && authState.user?.role === "ROLE_ADMIN",
    login,
    logout,
    restoreSession,
  };
};
