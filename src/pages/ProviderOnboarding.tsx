import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { createStripeAccount, getStripeAccountStatus } from '@/services/providerOnboarding';

const ProviderOnboarding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onboardingSuccess = searchParams.get('success') === 'true';
  const onboardingRefresh = searchParams.get('refresh') === 'true';

  useEffect(() => {
    // Check account status on mount
    checkAccountStatus();
  }, []);

  const checkAccountStatus = async () => {
    try {
      setIsLoading(true);
      const status = await getStripeAccountStatus();
      setAccountStatus(status);
      
      if (status.details_submitted && status.charges_enabled && status.payouts_enabled) {
        setSuccess('Your payment account is fully set up and ready to receive payments!');
      }
    } catch (error: any) {
      // If account doesn't exist yet, that's okay
      if (error.userMessage) {
        console.log('No account yet:', error.userMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };
  console.log('Account Status:', accountStatus);

  const handleStartOnboarding = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await createStripeAccount();
      
      // Redirect to Stripe onboarding
      window.location.href = response.url;
    } catch (error: any) {
      setError(error.userMessage || error.message || 'Failed to start onboarding');
      setIsLoading(false);
    }
  };

  const handleReturnToDashboard = () => {
    navigate('/provider/dashboard');
  };

  const isFullyOnboarded = accountStatus?.details_submitted && 
                          accountStatus?.charges_enabled && 
                          accountStatus?.payouts_enabled;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Account Setup
            </h1>
            <p className="text-gray-600">
              Set up your payment account to start receiving payments from bookings
            </p>
          </div>

          {/* Success Alert */}
          {onboardingSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                Great! Your onboarding information has been submitted. We're verifying your details.
              </AlertDescription>
            </Alert>
          )}

          {/* Refresh Alert */}
          {onboardingRefresh && (
            <Alert className="mb-6 border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Please complete the onboarding process to start receiving payments.
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Main Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Stripe Express Account</CardTitle>
              <CardDescription>
                Connect your payment account to receive earnings from your bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Status */}
              {accountStatus && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Account Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Details Submitted</span>
                      {accountStatus.details_submitted ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Charges Enabled</span>
                      {accountStatus.charges_enabled ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Payouts Enabled</span>
                      {accountStatus.payouts_enabled ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">What you'll need:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Business information and tax details
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Bank account information for receiving payments
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Government-issued ID for verification
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    Phone number for security verification
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {!isFullyOnboarded ? (
                  <Button
                    onClick={handleStartOnboarding}
                    disabled={isLoading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        {accountStatus ? 'Continue Onboarding' : 'Start Onboarding'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleReturnToDashboard}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Return to Dashboard
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={handleReturnToDashboard}
                  className="flex-1"
                >
                  Later
                </Button>
              </div>

              {/* Security Note */}
              <div className="text-xs text-gray-500 text-center pt-4 border-t">
                Powered by Stripe. Your information is secure and encrypted.
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Questions about the onboarding process?{' '}
              <a href="#" className="text-primary-500 hover:text-primary-600 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderOnboarding;
