import api from "@/api/axiosInstance";
import { toApiError } from "@/lib/apiError";
import { getAllProviders } from "@/services/providerService";

export interface DashboardAnalytics {
  kpis: {
    totalBookings: number;
    totalUniqueTourists: number;
    totalRevenue: number;
    averageBookingValue: number;
  };
  recentPerformance: {
    recentBookingsCount: number;
    recentTourists: number;
    recentRevenue: number;
  };
  bookingStatusDistribution: Record<string, number>;
  topServices: Array<{ serviceName: string; bookingCount: number }>;
  topProviders: Array<{ providerName: string; bookingCount: number }>;
  monthlyTrend: Array<{ month: number; bookingCount: number; revenue: number }>;
  currentYear: number;
  growthMetrics: {
    touristGrowthRate: number;
  };
}

export interface LocationCount {
  name: string;
  value: number;
}

export interface ProviderOverview {
  totalProviders: number;
  pendingApprovals: number;
  byLocation: LocationCount[];
}

/** KPIs, monthly trend and top lists from GET /admin/analytics/dashboard. */
export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  try {
    const response = await api.get("/admin/analytics/dashboard");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Failed to load analytics");
  }
}

/** Provider counts and distribution by city, derived from one provider list request. */
export async function getProviderOverview(): Promise<ProviderOverview> {
  const providers = await getAllProviders();
  const byCity = new Map<string, number>();
  providers.forEach((provider) => {
    const city = provider.city || "Unknown";
    byCity.set(city, (byCity.get(city) ?? 0) + 1);
  });
  return {
    totalProviders: providers.length,
    pendingApprovals: providers.filter((p) => p.status === "PENDING").length,
    byLocation: Array.from(byCity, ([name, value]) => ({ name, value })),
  };
}
