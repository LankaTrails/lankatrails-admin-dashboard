import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Building2, 
  IdCard, 
  Briefcase, 
  AlertCircle,
  User,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Calendar,
  Loader2,
  ExternalLink,
  X as CloseIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { ProviderBasicInfo, getProviderById, ProviderDetailInfo, approveOrRejectLicense } from "@/services/providerService";
import { useToast } from "@/hooks/use-toast";

// Type definitions for license
interface LicenseDTO {
  licenseId: number;
  licenseNumber: string;
  expiryDate: string;
  licenseUrl: string;
  category: string;
  providerId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  businessName: string;
  categoryName: string;
}

const getCategoryIdFromName = (name: string): number => {
  const map: Record<string, number> = {
    'ACCOMMODATION': 1,
    'ACTIVITY': 2,
    'TOUR_GUIDE': 3,
    'TRANSPORT': 4,
    'FOOD_BEVERAGE': 5
  };
  return map[name] || 1;
};

const ProviderView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Debug: Log location object at component entry
  console.log('========================================');
  console.log('ProviderView Component Mounted');
  console.log('location object:', location);
  console.log('location.state:', location.state);
  console.log('location.state?.provider:', location.state?.provider);
  console.log('========================================');
  
  const basicProvider = location.state?.provider as ProviderBasicInfo | undefined;
  
  const [provider, setProvider] = useState<ProviderDetailInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewFile, setViewFile] = useState<null | { url: string; title: string }>(null);
  const [processingLicense, setProcessingLicense] = useState<number | null>(null);

  // Load full provider details when component mounts
  useEffect(() => {
    const loadProviderDetails = async () => {
      console.log('=== ProviderView Debug Start ===');
      console.log('1. basicProvider from navigation state:', basicProvider);
      
      if (!basicProvider) {
        console.error('No basicProvider data provided');
        setError('No provider data provided. Please navigate from the Providers page.');
        setIsLoading(false);
        return;
      }

      console.log('2. basicProvider keys:', Object.keys(basicProvider));
      console.log('3. basicProvider.providerId:', basicProvider.providerId);
      
      // Get provider ID from basicProvider (backend uses providerId field)
      const providerId = basicProvider.providerId;
      
      console.log('4. Extracted providerId:', providerId, 'Type:', typeof providerId);
      
      if (!providerId) {
        console.error('5. ERROR: Provider ID not found in basicProvider object:', basicProvider);
        setError('Provider ID not found. Please try again from the providers list.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log('6. Calling getProviderById with ID:', providerId);
        const data = await getProviderById(providerId);
        console.log('7. SUCCESS: Provider details loaded:', data);
        setProvider(data);
        console.log('=== ProviderView Debug End (Success) ===');
      } catch (error: any) {
        console.error('8. ERROR loading provider details:', error);
        console.error('Error response:', error.response);
        console.error('Error data:', error.response?.data);
        console.error('Error userMessage:', error.userMessage);
        console.error('Error message:', error.message);
        
        // Create a fallback provider object from basicProvider data
        console.log('9. Creating fallback provider data from basicProvider');
        const fallbackProvider: ProviderDetailInfo = {
          providerID: basicProvider.providerId,
          email: basicProvider.email,
          profilePicUrl: '',
          status: basicProvider.status,
          businessDescription: 'Description not available',
          businessName: basicProvider.businessName,
          businessRegistrationNumber: basicProvider.businessRegistrationNumber,
          businessRegistrationUrl: '',
          businessType: basicProvider.businessType,
          coverImgUrl: '',
          pendingLicenses: null
        };
        
        setProvider(fallbackProvider);
        setError(null); // Clear error since we have fallback data
        console.log('10. Using fallback provider data:', fallbackProvider);
        console.log('=== ProviderView Debug End (Fallback Mode) ===');
      } finally {
        setIsLoading(false);
      }
    };

    loadProviderDetails();
  }, [basicProvider]);

  const handleLicenseAction = async (license: LicenseDTO, action: 'APPROVED' | 'REJECTED') => {
    if (!basicProvider?.providerId) return;

    const providerId = basicProvider.providerId;

    try {
      setProcessingLicense(license.licenseId);
      
      const categoryId = getCategoryIdFromName(license.category);
      
      await approveOrRejectLicense({
        providerId: providerId,
        category: {
          categoryId: categoryId,
          categoryName: license.category
        },
        status: action
      });

      toast({
        title: action === 'APPROVED' ? 'License Approved' : 'License Rejected',
        description: `${license.categoryName} license has been ${action.toLowerCase()} successfully.`,
        variant: action === 'APPROVED' ? 'default' : 'destructive'
      });

      // Reload provider data
      const data = await getProviderById(providerId);
      setProvider(data);
    } catch (error: any) {
      console.error('Error processing license:', error);
      toast({
        title: 'Error',
        description: error.userMessage || error.message || 'Failed to process license',
        variant: 'destructive'
      });
    } finally {
      setProcessingLicense(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading provider details...</p>
      </div>
    );
  }

  // Error state
  if (error || !provider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto px-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          {error ? 'Error Loading Provider' : 'Provider Not Found'}
        </h2>
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error Details</AlertTitle>
          <AlertDescription className="whitespace-pre-wrap">
            {error || 'No provider data available.'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/admin/providers')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back to Provider List
        </Button>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'APPROVED':
        return { 
          variant: 'default' as const, 
          color: 'bg-success-500 hover:bg-success-600 border-0 shadow-md text-white'
        };
      case 'PENDING': 
        return { 
          variant: 'secondary' as const, 
          color: 'bg-warning-500 text-white hover:bg-warning-600 border-0 shadow-md'
        };
      case 'REJECTED':
      case 'DISABLED':
        return { 
          variant: 'destructive' as const, 
          color: 'bg-destructive-500 hover:bg-destructive-600 border-0 shadow-md text-white'
        };
      default: 
        return { 
          variant: 'outline' as const, 
          color: ''
        };
    }
  };

  // Get all licenses from pendingLicenses
  const getAllLicenses = (): LicenseDTO[] => {
    if (!provider.pendingLicenses?.content) return [];
    const licenses: LicenseDTO[] = [];
    const content = provider.pendingLicenses.content;
    
    if (content.accommodation) licenses.push(...content.accommodation);
    if (content.activity) licenses.push(...content.activity);
    if (content.transport) licenses.push(...content.transport);
    if (content.tourGuide) licenses.push(...content.tourGuide);
    if (content.foodBeverage) licenses.push(...content.foodBeverage);
    
    return licenses;
  };

  const allLicenses = getAllLicenses();
  const statusInfo = getStatusVariant(provider.status);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="w-full max-w-5xl mx-auto px-4"
    >
      {/* Hero Header */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-primary shadow-2xl mb-6">
        <div className="flex items-center justify-between gap-6 px-8 py-8">
          <div className="flex items-center gap-6">
            <div className="bg-white/90 rounded-full p-3 shadow-lg">
              <Building2 className="h-16 w-16 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-4">
                {provider.businessName}
              </h1>
              <div className="mt-2 text-white/90 text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 mr-1" />
                <span className="font-semibold">{provider.email}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="text-white border-white border-2 hover:bg-white/10" 
            onClick={() => navigate('/admin/providers')}
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <Card className="shadow-2xl border-0 bg-white rounded-2xl w-full">
        <CardHeader className="border-b border-primary-100 bg-gradient-to-r from-primary-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="w-1 h-8 bg-gradient-primary rounded-full"></div>
                Provider Information
              </CardTitle>
              <CardDescription>View provider details and business information</CardDescription>
            </div>
            <Badge variant={statusInfo.variant} className={`capitalize text-base px-4 py-2 ${statusInfo.color}`}>
              {provider.status.toLowerCase()}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-8">
          {/* Backend Error Alert - Show when using fallback data */}
          {!provider.businessDescription || provider.businessDescription === 'Description not available' ? (
            <Alert className="border-warning-200 bg-warning-50">
              <AlertCircle className="h-5 w-5 text-warning-600" />
              <AlertTitle className="text-warning-800">Limited Information</AlertTitle>
              <AlertDescription className="text-warning-700">
                Unable to load full provider details from the server. Showing available basic information only. Some details like licenses and documents may not be visible.
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Status Alert */}
          {provider.status === 'PENDING' && (
            <Alert className="border-warning-200 bg-warning-50">
              <Clock className="h-5 w-5 text-warning-600" />
              <AlertTitle className="text-warning-800">Pending Approval</AlertTitle>
              <AlertDescription className="text-warning-700">
                This provider is awaiting approval. Review their information before approving their account.
              </AlertDescription>
            </Alert>
          )}

          {provider.status === 'DISABLED' && (
            <Alert variant="destructive" className="border-destructive-200 bg-destructive-50">
              <XCircle className="h-5 w-5" />
              <AlertTitle>Account Disabled</AlertTitle>
              <AlertDescription>
                This provider account has been disabled and cannot access the platform.
              </AlertDescription>
            </Alert>
          )}

          {provider.status === 'ACTIVE' && (
            <Alert className="border-success-200 bg-success-50">
              <CheckCircle className="h-5 w-5 text-success-600" />
              <AlertTitle className="text-success-800">Active Provider</AlertTitle>
              <AlertDescription className="text-success-700">
                This provider is active and can access all platform features.
              </AlertDescription>
            </Alert>
          )}

          {/* Business Information */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50/30 rounded-xl p-6 border-2 border-primary-100 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              Business Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Business Name</p>
                    <p className="text-base font-semibold text-gray-800">{provider.businessName}</p>
                  </div>
                </div>
              </div>

              {/* Business Type */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Business Type</p>
                    <p className="text-base font-semibold text-gray-800">{provider.businessType}</p>
                  </div>
                </div>
              </div>

              {/* Registration Number */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <IdCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Registration Number</p>
                    <p className="text-base font-semibold text-gray-800">{provider.businessRegistrationNumber}</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="text-base font-semibold text-gray-800 break-all">{provider.email}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              {basicProvider?.city && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">City</p>
                      <p className="text-base font-semibold text-gray-800">{basicProvider.city}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Account Status</p>
                    <Badge variant={statusInfo.variant} className={`capitalize ${statusInfo.color}`}>
                      {provider.status.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Business Description
            </h3>
            <p className="text-gray-700 bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 border-l-4 border-primary-500 border border-primary-100 shadow-md text-base text-left">
              {provider.businessDescription}
            </p>
          </div>

          {/* Business Registration */}
          {provider.businessRegistrationUrl && (
            <div className="bg-gradient-to-br from-info-50 to-white rounded-xl p-6 border-2 border-info-100 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-gradient-info rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Business Registration Document
              </h3>
              <div className="bg-white rounded-lg border border-primary/20 shadow p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-gray-700">Document:</span>
                  <Button 
                    size="sm" 
                    variant="link"
                    onClick={() => setViewFile({ url: provider.businessRegistrationUrl, title: 'Business Registration Document' })}
                    className="text-primary p-0 h-auto"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Document
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Licenses Section */}
          {allLicenses.length > 0 ? (
            <div className="bg-gradient-to-br from-accent-50 to-white rounded-xl p-6 border-2 border-accent-100 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-gradient-warm rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Service Licenses ({allLicenses.length})
              </h3>
              <div className="space-y-4">
                {allLicenses.map((license) => (
                  <div key={license.licenseId} className="bg-white rounded-lg border-2 border-gray-200 shadow p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-gray-800">{license.categoryName}</h4>
                          <Badge 
                            variant={license.status === 'APPROVED' ? 'default' : license.status === 'PENDING' ? 'secondary' : 'destructive'}
                            className={`capitalize ${
                              license.status === 'APPROVED' ? 'bg-success-500 text-white' : 
                              license.status === 'PENDING' ? 'bg-warning-500 text-white' : 
                              'bg-destructive-500 text-white'
                            }`}
                          >
                            {license.status.toLowerCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <IdCard className="h-4 w-4 text-primary" />
                            <span className="font-semibold">License Number:</span>
                            <span>{license.licenseNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-semibold">Expiry Date:</span>
                            <span>{formatDate(license.expiryDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                      {license.licenseUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setViewFile({ url: license.licenseUrl, title: `${license.categoryName} License` })}
                          className="border-info-300 hover:bg-info-100 text-info-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" /> View Document
                        </Button>
                      )}
                      
                      {license.status === 'PENDING' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleLicenseAction(license, 'APPROVED')}
                            disabled={processingLicense === license.licenseId}
                            className="border-success-300 hover:bg-success-100 text-success-700"
                          >
                            {processingLicense === license.licenseId ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleLicenseAction(license, 'REJECTED')}
                            disabled={processingLicense === license.licenseId}
                            className="border-destructive-300 hover:bg-destructive-100 text-destructive-700"
                          >
                            {processingLicense === license.licenseId ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Alert className="border-gray-200 bg-gray-50">
              <AlertCircle className="h-5 w-5 text-gray-600" />
              <AlertTitle>No Licenses</AlertTitle>
              <AlertDescription className="text-gray-700">
                This provider has not submitted any license documents yet.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <Button 
              onClick={() => navigate('/admin/providers')}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Providers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal for file view */}
      {viewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-4 relative flex flex-col">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-primary" onClick={() => setViewFile(null)}>
              <CloseIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-primary-700">{viewFile.title}</h2>
            <div className="flex-1 min-h-[400px] flex items-center justify-center">
              <iframe src={viewFile.url} title={viewFile.title} className="w-full h-[60vh] rounded border" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProviderView;
