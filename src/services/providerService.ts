import api from "@/api/axiosInstance";
import { toApiError } from "@/lib/apiError";

export interface ProviderBasicInfo {
  providerId: number; // Backend returns this as providerId (Long)
  businessName: string;
  businessType: string;
  businessRegistrationNumber: string;
  status: string;
  email: string;
  city: string;
}

// Contact Person DTO to match backend
export interface ContactPersonDTO {
  name: string;
  email: string;
  phoneNumber: string;
  position: string;
  identityDocumentUrl: string;
}

// License DTO to match backend structure
export interface LicenseDTO {
  licenseId: number;
  licenseNumber: string;
  expiryDate: string;
  licenseUrl: string;
  category: CategoryName;
  providerId: number;
  status: 'NOT_REQUESTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'RENEWAL';
  businessName: string;
  categoryName: string;
}

// Approve License DTO structure (contains lists of licenses by category)
export interface ApproveLicenseDTO {
  accommodation: LicenseDTO[] | null;
  activity: LicenseDTO[] | null;
  transport: LicenseDTO[] | null;
  tourGuide: LicenseDTO[] | null;
  foodBeverage: LicenseDTO[] | null;
}

// Approve License Response wrapper
export interface ApproveLicenseResponse {
  content: ApproveLicenseDTO;
}

export interface ProviderDetailInfo {
  providerId: number;
  email: string;
  profilePicUrl: string;
  status: string;
  businessDescription: string;
  businessName: string;
  businessRegistrationNumber: string;
  businessRegistrationUrl: string;
  businessType: string;
  coverImgUrl: string;
  pendingLicenses: ApproveLicenseResponse | null;
  contactPerson: ContactPersonDTO | null;
}

export type CategoryName = "ACCOMMODATION" | "TRANSPORT" | "FOOD_BEVERAGE" | "ACTIVITY" | "TOUR_GUIDE";

/** Category ids as seeded by the backend (InitialDataConfig). */
export const CATEGORY_IDS: Record<CategoryName, number> = {
  ACCOMMODATION: 1,
  TRANSPORT: 2,
  FOOD_BEVERAGE: 3,
  ACTIVITY: 4,
  TOUR_GUIDE: 5,
};

/** All providers for the list view. The API returns null instead of [] when there are none. */
export async function getAllProviders(): Promise<ProviderBasicInfo[]> {
  try {
    const response = await api.get("/admin/approve-provider/providers");
    return response.data.data?.content ?? [];
  } catch (error) {
    throw toApiError(error, "Failed to load providers");
  }
}

/** Full provider profile with documents and licences awaiting review. */
export async function getProviderById(providerId: number): Promise<ProviderDetailInfo> {
  try {
    const response = await api.get(`/admin/approve-provider/service-category/${providerId}`);
    return response.data.data.content;
  } catch (error) {
    throw toApiError(error, "Failed to load provider details");
  }
}

/** Approves or rejects the provider for one service category. */
export async function approveOrRejectLicense(
  providerId: number,
  category: CategoryName,
  status: "APPROVED" | "REJECTED",
): Promise<void> {
  try {
    await api.put(`/admin/approve-provider/providers/${providerId}`, {
      providerId,
      category: { categoryId: CATEGORY_IDS[category], categoryName: category },
      status,
    });
  } catch (error) {
    throw toApiError(error, "Failed to update the licence status");
  }
}
