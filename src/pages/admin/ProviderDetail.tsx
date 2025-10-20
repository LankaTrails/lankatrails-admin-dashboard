import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { ArrowLeft, User, Calendar, MapPin, Building2, FileText, Mail, Phone, IdCard, Briefcase, CheckCircle, XCircle, X as CloseIcon, CreditCard, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { getProviderById, getAllProviders, ProviderDetailInfo, approveOrRejectLicense } from "@/services/providerService";
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

interface PendingLicenses {
  content: {
    accommodation: LicenseDTO[];
    activity: LicenseDTO[];
    transport: LicenseDTO[];
    tourGuide: LicenseDTO[];
    foodBeverage: LicenseDTO[];
  };
}

const getStatusVariant = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'APPROVED': 
      return { variant: 'default', color: 'bg-success-500 hover:bg-success-600 border-0 shadow-md text-white' };
    case 'PENDING': 
      return { variant: 'secondary', color: 'bg-warning-500 text-white hover:bg-warning-600 border-0 shadow-md' };
    case 'REJECTED':
    case 'DISABLED':
      return { variant: 'destructive', color: 'bg-destructive-500 hover:bg-destructive-600 border-0 shadow-md text-white' };
    default: 
      return { variant: 'outline', color: '' };
  }
};

const getCategoryDisplayName = (key: string) => {
  const map: Record<string, string> = {
    accommodation: 'Accommodation',
    activity: 'Activity',
    transport: 'Transport',
    tourGuide: 'Tour Guide',
    foodBeverage: 'Food & Beverage'
  };
  return map[key] || key;
};

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

const ProviderDetail = () => {
  const { name: providerParam } = useParams();  // Could be email or ID
  const navigate = useNavigate();
  const { toast } = useToast();
  const [providerId, setProviderId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ProviderDetailInfo | null>(null);
  const [isLoadingProvider, setIsLoadingProvider] = useState(true);
  const [providerError, setProviderError] = useState<string | null>(null);
  const [viewFile, setViewFile] = useState<null | { url: string; title: string }>(null);
  const [processingLicense, setProcessingLicense] = useState<number | null>(null);

  // First, resolve email to provider ID
  useEffect(() => {
    const resolveProviderId = async () => {
      if (!providerParam) return;

      // Check if providerParam is a number (direct ID)
      const numericId = Number(providerParam);
      if (!isNaN(numericId) && numericId > 0) {
        setProviderId(numericId);
        return;
      }

      // Otherwise, it's an email - need to lookup the provider
      try {
        const decodedEmail = decodeURIComponent(providerParam);
        const allProviders = await getAllProviders();
        
        // Find provider by email
        const matchedProvider = allProviders.find(p => p.email === decodedEmail);
        
        if (matchedProvider) {
          // Backend Fix Required: ProviderInfoDTO doesn't include userId field
          // This is a known backend issue - see BACKEND_FIX_NEEDED.md
          console.error('Backend Fix Required: ProviderInfoDTO missing userId field');
          console.error('Provider Email:', decodedEmail);
          console.error('See BACKEND_FIX_NEEDED.md for solution');
          setProviderError(`Backend configuration issue: Provider ID is not available in the API response.

The backend ProviderInfoDTO needs to include the userId field. 

Technical Details:
- Provider Email: ${decodedEmail}
- Required Field: userId in ProviderInfoDTO
- Required Endpoint Fix: GET /api/admin/approve-provider/providers

Please ask the backend team to:
1. Add userId field to ProviderInfoDTO
2. Map userId in AuthServiceImpl.getBasicProviderInfo()

Estimated fix time: 2 minutes
See BACKEND_FIX_NEEDED.md for complete instructions.`);
          setIsLoadingProvider(false);
        } else {
          setProviderError('Provider not found with the given email.');
          setIsLoadingProvider(false);
        }
      } catch (error: any) {
        console.error('Error resolving provider ID:', error);
        setProviderError('Failed to resolve provider information.');
        setIsLoadingProvider(false);
      }
    };

    resolveProviderId();
  }, [providerParam]);

  // Load provider data once we have the ID
  useEffect(() => {
    if (providerId) {
      loadProviderData();
    }
  }, [providerId]);

  const loadProviderData = async () => {
    try {
      setIsLoadingProvider(true);
      setProviderError(null);
      const data = await getProviderById(Number(providerId));
      setProvider(data);
    } catch (error: any) {
      console.error('Error loading provider:', error);
      setProviderError(error.userMessage || error.message || 'Failed to load provider details');
    } finally {
      setIsLoadingProvider(false);
    }
  };

  const handleLicenseAction = async (license: LicenseDTO, action: 'APPROVED' | 'REJECTED') => {
    try {
      setProcessingLicense(license.licenseId);
      
      const categoryId = getCategoryIdFromName(license.category);
      
      await approveOrRejectLicense({
        providerId: Number(providerId),
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
      await loadProviderData();
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

  if (isLoadingProvider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading provider details...</p>
      </div>
    );
  }

  if (providerError || (!provider && !isLoadingProvider)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto px-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          {providerError ? 'Configuration Issue' : 'Provider Not Found'}
        </h2>
        {providerError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap text-sm">{providerError}</AlertDescription>
          </Alert>
        )}
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back to Provider List
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusVariant(provider.status);

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full mx-auto">
      {/* Hero Header */}
      <div className="relative w-full rounded-t-2xl overflow-hidden bg-gradient-primary shadow-2xl mb-0">
        <div className="flex items-center gap-6 px-8 py-8">
          <div className="bg-white/80 rounded-full p-2 shadow-lg">
            <img src={provider.profilePicUrl || '/default-profile.jpg'} alt="Profile" className="h-24 w-24 object-cover rounded-full border-4 border-primary shadow-xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-4">
              {provider.businessName}
              <Badge variant={statusInfo.variant as any} className={`capitalize text-base px-4 py-2 ml-2 ${statusInfo.color} bg-opacity-80`}>
                {provider.status}
              </Badge>
            </h1>
            <div className="mt-2 text-white/90 text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 mr-1 text-primary" />
              <span className="font-semibold text-white">{provider.email}</span>
            </div>
          </div>
          <Button variant="ghost" className="text-white border-white border-2 hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>
        </div>
      </div>
      {/* Main Card */}
      <Card className="shadow-2xl border-0 bg-white rounded-t-none rounded-b-2xl w-full max-w-3xl mx-auto -mt-6 z-10 relative">
        <CardContent className="space-y-8 w-full pt-10">
          {/* Meta Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-primary-50 to-secondary-50/30 rounded-xl p-6 border-2 border-primary-100 shadow-md">
            <div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Business Name:</span> <span className="ml-1 text-gray-800">{provider.businessName}</span></div>
            <div className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Business Type:</span> <span className="ml-1 text-gray-800">{provider.businessType}</span></div>
            <div className="flex items-center gap-2"><IdCard className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Registration No:</span> <span className="ml-1 text-gray-800">{provider.businessRegistrationNumber}</span></div>
            <div className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Email:</span> <span className="ml-1 text-gray-800">{provider.email}</span></div>
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

        </CardContent>
      </Card>
      {/* Modal for file view */}
      {viewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-4 relative flex flex-col">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-primary" onClick={() => setViewFile(null)}><CloseIcon className="h-6 w-6" /></button>
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

export default ProviderDetail; 