import api from "@/api/axiosInstance";

export interface AnalyticsStats {
  totalProviders: number;
  totalTourists: number;
  totalBookings: number;
  pendingApprovals: number;
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
 * Get basic analytics statistics
 * Note: Backend doesn't have a dedicated analytics endpoint,
 * so we aggregate from existing endpoints
 */
export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  try {
    // Fetch provider data to get counts
    const providerResponse = await api.get('/admin/approve-provider/providers');
    const providers = providerResponse.data.data.content || [];
    
    // Count total providers and pending approvals
    const totalProviders = providers.length;
    const pendingApprovals = providers.filter((p: any) => p.status === 'PENDING').length;
    
    // Since we don't have dedicated endpoints for tourists and bookings counts,
    // we'll return what we can calculate
    return {
      totalProviders,
      totalTourists: 0, // Backend doesn't have this endpoint
      totalBookings: 0, // Backend doesn't have this endpoint
      pendingApprovals
    };
  } catch (error: any) {
    console.error('Error fetching analytics stats:', error);
    if (error.response && error.response.data) {
      const { code, message, userMessage } = error.response.data;
      throw {
        code,
        message,
        userMessage,
      };
    }
    throw {
      message: 'Failed to load analytics statistics',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get provider distribution by location
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
 * Get provider distribution by business type (category)
 */
export async function getProvidersByCategory(): Promise<CategoryBooking[]> {
  try {
    const response = await api.get('/admin/approve-provider/providers');
    const providers = response.data.data.content || [];
    
    // Aggregate by business type
    const categoryMap = new Map<string, number>();
    providers.forEach((provider: any) => {
      const type = provider.businessType || 'Unknown';
      categoryMap.set(type, (categoryMap.get(type) || 0) + 1);
    });
    
    // Convert to array format
    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      bookings: count // Using 'bookings' field name to match chart expectations
    }));
  } catch (error: any) {
    console.error('Error fetching providers by category:', error);
    throw {
      message: 'Failed to load provider category data',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get mock revenue data for demonstration
 * Note: Backend doesn't have revenue/payment analytics endpoints yet
 */
export async function getRevenueData() {
  // Mock data since backend doesn't have this endpoint
  return [
    { month: 'Jan', revenue: 0 }, 
    { month: 'Feb', revenue: 0 }, 
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 }, 
    { month: 'May', revenue: 0 }, 
    { month: 'Jun', revenue: 0 },
    { month: 'Jul', revenue: 0 }, 
    { month: 'Aug', revenue: 0 },
  ];
}
