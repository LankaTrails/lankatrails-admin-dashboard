import api from "@/api/axiosInstance";

export interface StripeAccountLinkResponse {
  url: string;
}

export interface StripeAccountStatus {
  account_id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  capabilities: any;
  details_submitted: boolean;
}

/**
 * Create a Stripe Express account for the provider and get the onboarding URL
 */
export async function createStripeAccount(): Promise<StripeAccountLinkResponse> {
  try {
    const response = await api.post('/provider/onboarding/create-account');
    console.log('Response from createStripeAccount:', response.data);
    return response.data;
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
      message: 'Failed to create Stripe account',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Get the current Stripe account status for the provider
 */
export async function getStripeAccountStatus(): Promise<StripeAccountStatus> {
  try {
    const response = await api.get('/provider/onboarding/account-status');
    console.log('Response from getStripeAccountStatus:', response.data);
    return response.data;
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
      message: 'Failed to get Stripe account status',
      code: 'UNKNOWN_ERROR',
    };
  }
}
