export type UserRole = "ROLE_ADMIN" | "ROLE_PROVIDER" | "ROLE_TOURIST";

/** Profile returned by GET /api/auth/logged-user (only the fields the admin app uses). */
export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  status?: string;
  emailVerified?: boolean;
}
