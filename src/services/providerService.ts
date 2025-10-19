import api from "@/api/axiosInstance";

export interface ProviderBasicInfo {
  userId?: number; // Note: Backend should include this, but may not be present
  businessName: string;
  businessType: string;
  businessRegistrationNumber: string;
  status: string;
  email: string;
  city: string;
}

export interface ProviderDetailInfo {
  email: string;
  profilePicUrl: string;
  status: string;
  businessDescription: string;
  businessName: string;
  businessRegistrationNumber: string;
  businessRegistrationUrl: string;
  businessType: string;
  coverImgUrl: string;
  pendingLicenses?: any;
}

/**
 * Get all providers basic info for list view
 */
export async function getAllProviders(): Promise<ProviderBasicInfo[]> {
  try {
    const response = await api.get('/admin/approve-provider/providers');
    console.log('Response from getAllProviders:', response.data);
    return response.data.data.content;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { code, message, details, userMessage } = error.response.data;
      throw {
        code,
        message,
        details,
        userMessage,
      };
    }
    throw {
      message: 'Failed to load providers',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get provider details by ID
 */
export async function getProviderById(providerId: number): Promise<ProviderDetailInfo> {
  try {
    const response = await api.get(`/admin/approve-provider/service-category/${providerId}`);
    console.log('Response from getProviderById:', response.data);
    return response.data.data.content;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { code, message, details, userMessage } = error.response.data;
      throw {
        code,
        message,
        details,
        userMessage,
      };
    }
    throw {
      message: 'Failed to load provider details',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Approve a provider
 */
export async function approveProvider(providerId: number): Promise<string> {
  try {
    const response = await api.put(`/admin/approve-provider/${providerId}`);
    console.log('Response from approveProvider:', response.data);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { code, message, details, userMessage } = error.response.data;
      throw {
        code,
        message,
        details,
        userMessage,
      };
    }
    throw {
      message: 'Failed to approve provider',
      code: 'UNKNOWN_ERROR',
    };
  }
}
