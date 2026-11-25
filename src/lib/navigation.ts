import { AlertCircle, Home, LineChart, ShoppingCart, Users } from "lucide-react";
import type { ComponentType } from "react";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

/** Admin sections, shared by the desktop sidebar and the mobile menu. */
export const navItems: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: Home },
  { to: "/admin/providers", label: "Providers", icon: Users },
  { to: "/admin/bookings", label: "Bookings", icon: ShoppingCart },
  { to: "/admin/complaints", label: "Complaints", icon: AlertCircle },
  { to: "/admin/analytics", label: "Analytics", icon: LineChart },
];
