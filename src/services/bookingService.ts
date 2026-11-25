import api from "@/api/axiosInstance";
import { toApiError } from "@/lib/apiError";

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

/** Every booking on the platform, newest first as returned by the API. */
export async function getAllBookings(): Promise<BookingItemDto[]> {
  try {
    const response = await api.get("/admin/bookings");
    return response.data.data ?? [];
  } catch (error) {
    throw toApiError(error, "Failed to load bookings");
  }
}
