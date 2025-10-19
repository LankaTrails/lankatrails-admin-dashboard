import api from "@/api/axiosInstance";

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

export interface TouristAnalytics {
  totalUniqueTourists: number;
  newTouristsThisMonth: number;
  newTouristsLast30Days: number;
}

export interface CategoryBooking {
  category: string;
  bookings: number;
}

export interface LocationData {
  location: string;
  providers: number;
}

/**
 * Get comprehensive dashboard analytics from backend
 */
export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  try {
    const response = await api.get('/admin/analytics/dashboard');
    console.log('Dashboard analytics response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching dashboard analytics:', error);
    if (error.response && error.response.data) {
      const { code, message, userMessage } = error.response.data;
      throw {
        code,
        message,
        userMessage,
      };
    }
    throw {
      message: 'Failed to load dashboard analytics',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get tourist analytics from backend
 */
export async function getTouristAnalytics(): Promise<TouristAnalytics> {
  try {
    const response = await api.get('/admin/analytics/tourists');
    console.log('Tourist analytics response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching tourist analytics:', error);
    if (error.response && error.response.data) {
      const { code, message, userMessage } = error.response.data;
      throw {
        code,
        message,
        userMessage,
      };
    }
    throw {
      message: 'Failed to load tourist analytics',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get booking analytics for a date range
 */
export async function getBookingAnalytics(from: string, to: string) {
  try {
    const response = await api.get('/admin/analytics/bookings', {
      params: { from, to }
    });
    console.log('Booking analytics response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching booking analytics:', error);
    throw {
      message: 'Failed to load booking analytics',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get revenue analytics for a date range
 */
export async function getRevenueAnalytics(from: string, to: string) {
  try {
    const response = await api.get('/admin/analytics/revenue', {
      params: { from, to }
    });
    console.log('Revenue analytics response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching revenue analytics:', error);
    throw {
      message: 'Failed to load revenue analytics',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get monthly analytics for a specific year
 */
export async function getMonthlyAnalytics(year: number) {
  try {
    const response = await api.get(`/admin/analytics/monthly/${year}`);
    console.log('Monthly analytics response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching monthly analytics:', error);
    throw {
      message: 'Failed to load monthly analytics',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get provider distribution by location
 * Still uses provider endpoint as location data isn't in analytics
 */
export async function getProvidersByLocation(): Promise<LocationData[]> {
  try {
    const response = await api.get('/admin/approve-provider/providers');
    const providers = response.data.data.content || [];
    
    // Aggregate by city
    const locationMap = new Map<string, number>();
    providers.forEach((provider: any) => {
      const city = provider.city || 'Unknown';
      locationMap.set(city, (locationMap.get(city) || 0) + 1);
    });
    
    // Convert to array format
    return Array.from(locationMap.entries()).map(([location, count]) => ({
      location,
      providers: count
    }));
  } catch (error: any) {
    console.error('Error fetching providers by location:', error);
    throw {
      message: 'Failed to load provider location data',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get total provider count and pending approvals
 * Still uses provider endpoint
 */
export async function getProviderStats() {
  try {
    const response = await api.get('/admin/approve-provider/providers');
    const providers = response.data.data.content || [];
    
    const totalProviders = providers.length;
    const pendingApprovals = providers.filter((p: any) => p.status === 'PENDING').length;
    
    return { totalProviders, pendingApprovals };
  } catch (error: any) {
    console.error('Error fetching provider stats:', error);
    throw {
      message: 'Failed to load provider stats',
      code: 'UNKNOWN_ERROR',
    };
  }
}
