import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { refreshAccessToken, setAccessToken } from "@/api/axiosInstance";
import { errorMessage, toApiError } from "@/lib/apiError";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

const NOT_ADMIN = "This account does not have administrator access.";

async function fetchAdminProfile(): Promise<AuthUser> {
  const res = await api.get("/auth/logged-user");
  const user = res.data.data as AuthUser;
  if (user.role !== "ROLE_ADMIN") {
    // A provider or tourist must not keep a session in the admin app
    await api.post("/auth/logout").catch(() => undefined);
    setAccessToken(null);
    throw { code: "NOT_ADMIN", message: NOT_ADMIN, userMessage: NOT_ADMIN };
  }
  return user;
}

export const login = createAsyncThunk<AuthUser, { email: string; password: string }, { rejectValue: string }>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      setAccessToken(res.data.data.jwtToken);
      return await fetchAdminProfile();
    } catch (err) {
      setAccessToken(null);
      const apiError = (err as { code?: string }).code === "NOT_ADMIN" ? err : toApiError(err, "Login failed");
      return rejectWithValue(errorMessage(apiError, "Login failed"));
    }
  },
);

/** Uses the refresh cookie to resume a session after a page reload. */
export const restoreSession = createAsyncThunk<AuthUser, void, { rejectValue: string }>(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      await refreshAccessToken();
      return await fetchAdminProfile();
    } catch {
      setAccessToken(null);
      return rejectWithValue("No active session");
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout").catch(() => undefined);
  setAccessToken(null);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = "Your session has expired. Please sign in again.";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      });
  },
});

export const { sessionExpired } = authSlice.actions;
export default authSlice.reducer;
