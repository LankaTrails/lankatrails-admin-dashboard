import api from "@/api/axiosInstance";

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'PENDING' | 'PAYMENT_FAILED' | 'NOT_AVAILABLE';

export interface LocationDTO {
  locationId: number;
  formattedAddress: string;
  city: string;
  district: string;
  province: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  locationType: string;
}

export interface PriceDTO {
  amount: number;
  priceType: string;
}

export interface ProviderDto {
  id: number;
  businessName: string;
  profilePictureUrl: string;
}

export interface ServiceDTO {
  serviceId: number;
  serviceName: string;
  Category: string;
  locations: LocationDTO[];
  prices: PriceDTO[];
  mainImageUrl: string;
  provider: ProviderDto;
  averageRating: number;
  totalBookingsForPastMonth: number;
}

export interface BookingItemDto {
  tripItemId: number;
  service: ServiceDTO;
  startTime: string; // LocalDateTime as ISO string
  endTime: string;
  noOfUnits: number;
  numberOfAdults: number;
  numberOfChildren: number;
  status: BookingStatus;
  totalPrice: number;
  paidAmount: number;
  dueAmount: number;
  depositAmount: number;
  bookingDate: string; // LocalDateTime as ISO string
}

export interface BookingStatistics {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
}

/**
 * Get all bookings in the system
 */
export async function getAllBookings(): Promise<BookingItemDto[]> {
  try {
    const response = await api.get('/admin/bookings');
    console.log('All bookings response:', response.data);
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error fetching all bookings:', error);
    if (error.response && error.response.data) {
      const { code, message, userMessage } = error.response.data;
      throw {
        code,
        message,
        userMessage,
      };
    }
    throw {
      message: 'Failed to load bookings',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get bookings by status
 */
export async function getBookingsByStatus(status: string): Promise<BookingItemDto[]> {
  try {
    const response = await api.get(`/admin/bookings/status/${status}`);
    console.log(`Bookings with status ${status} response:`, response.data);
    return response.data.data || [];
  } catch (error: any) {
    console.error(`Error fetching bookings with status ${status}:`, error);
    if (error.response && error.response.data) {
      const { code, message, userMessage } = error.response.data;
      throw {
        code,
        message,
        userMessage,
      };
    }
    throw {
      message: `Failed to load ${status} bookings`,
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get bookings within a date range
 */
export async function getBookingsByDateRange(from: string, to: string): Promise<BookingItemDto[]> {
  try {
    const response = await api.get('/admin/bookings/date-range', {
      params: { from, to }
    });
    console.log('Bookings by date range response:', response.data);
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error fetching bookings by date range:', error);
    if (error.response && error.response.data) {
      const { code, message, userMessage } = error.response.data;
      throw {
        code,
        message,
        userMessage,
      };
    }
    throw {
      message: 'Failed to load bookings for date range',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get booking statistics
 */
export async function getBookingStatistics(): Promise<BookingStatistics> {
  try {
    const response = await api.get('/admin/bookings/statistics');
    console.log('Booking statistics response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching booking statistics:', error);
    if (error.response && error.response.data) {
      const { code, message, userMessage } = error.response.data;
      throw {
        code,
        message,
        userMessage,
      };
    }
    throw {
      message: 'Failed to load booking statistics',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get recent bookings with optional limit
 */
export async function getRecentBookings(limit: number = 10): Promise<BookingItemDto[]> {
  try {
    const response = await api.get('/admin/bookings/recent', {
      params: { limit }
    });
    console.log('Recent bookings response:', response.data);
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error fetching recent bookings:', error);
    if (error.response && error.response.data) {
      const { code, message, userMessage } = error.response.data;
      throw {
        code,
        message,
        userMessage,
      };
    }
    throw {
      message: 'Failed to load recent bookings',
      code: 'UNKNOWN_ERROR',
    };
  }
}
