import api from "@/api/axiosInstance";

export interface ProviderBasicInfo {
  providerId: number; // Backend returns this as providerId (Long)
  businessName: string;
  businessType: string;
  businessRegistrationNumber: string;
  status: string;
  email: string;
  city: string;
}

// Helper function to extract provider ID from response
// Backend ProviderInfoDTO uses providerId field (Long type)
export function extractProviderId(provider: any): number | null {
  return provider.providerId || null;
}

export interface ProviderDetailInfo {
  providerID: number; // Backend uses providerID (capital ID) in ProviderViewInfoDTO
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
  console.log('=== getAllProviders Service Call ===');
  try {
    const response = await api.get('/admin/approve-provider/providers');
    console.log('getAllProviders Full Response:', response);
    console.log('getAllProviders Response data:', response.data);
    console.log('getAllProviders Response data.data:', response.data.data);
    console.log('getAllProviders Response data.data.content:', response.data.data.content);
    
    const providers = response.data.data.content;
    console.log('Providers array:', providers);
    
    if (providers && providers.length > 0) {
      console.log('First provider sample:', providers[0]);
      console.log('First provider keys:', Object.keys(providers[0]));
      console.log('First provider.providerId:', providers[0].providerId);
    }
    
    console.log('=== getAllProviders Success ===');
    return providers;
  } catch (error: any) {
    console.error('=== getAllProviders Error ===');
    console.error('Error:', error);
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
  console.log('=== getProviderById Service Call ===');
  console.log('Input providerId:', providerId, 'Type:', typeof providerId);
  
  try {
    const url = `/admin/approve-provider/service-category/${providerId}`;
    console.log('API URL:', url);
    console.log('Making GET request to:', url);
    
    const response = await api.get(url);
    
    console.log('Full API response:', response);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('Response data.data:', response.data.data);
    console.log('Response data.data.content:', response.data.data.content);
    
    const providerData = response.data.data.content;
    console.log('Extracted provider data:', providerData);
    console.log('=== getProviderById Service Call Success ===');
    
    return providerData;
  } catch (error: any) {
    console.error('=== getProviderById Service Call Error ===');
    console.error('Error object:', error);
    console.error('Error response:', error.response);
    console.error('Error response status:', error.response?.status);
    console.error('Error response data:', error.response?.data);
    
    if (error.response && error.response.data) {
      const { code, message, details, userMessage } = error.response.data;
      console.error('Structured error:', { code, message, details, userMessage });
      throw {
        code,
        message,
        details,
        userMessage,
      };
    }
    console.error('Throwing generic error');
    throw {
      message: 'Failed to load provider details',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Approve a provider (main approval)
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

/**
 * Approve or reject a specific license
 */
export async function approveOrRejectLicense(data: {
  providerId: number;
  category: {
    categoryId: number;
    categoryName: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}): Promise<string> {
  try {
    const response = await api.put(`/admin/approve-provider/providers/${data.providerId}`, data);
    console.log('Response from approveOrRejectLicense:', response.data);
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
      message: 'Failed to approve/reject license',
      code: 'UNKNOWN_ERROR',
    };
  }
}
