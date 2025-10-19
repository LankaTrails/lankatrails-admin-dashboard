import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { ArrowLeft, User, Calendar, MapPin, Building2, FileText, Mail, Phone, IdCard, Briefcase, CheckCircle, XCircle, X as CloseIcon, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getStripeAccountStatus } from "@/services/providerOnboarding";
import { getProviderById, ProviderDetailInfo } from "@/services/providerService";


const getStatusVariant = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'APPROVED': 
      return { variant: 'default', color: 'bg-success-500 hover:bg-success-600 border-0 shadow-md' };
    case 'PENDING': 
      return { variant: 'secondary', color: 'bg-warning-500 text-white hover:bg-warning-600 border-0 shadow-md' };
    case 'REJECTED': 
      return { variant: 'destructive', color: 'bg-destructive-500 hover:bg-destructive-600 border-0 shadow-md' };
    default: 
      return { variant: 'outline', color: '' };
  }
};

const ProviderDetail = () => {
  const { name: providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<ProviderDetailInfo | null>(null);
  const [isLoadingProvider, setIsLoadingProvider] = useState(true);
  const [providerError, setProviderError] = useState<string | null>(null);

  // Local state for file approval/decline
  const [regFileStatus, setRegFileStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [idFileStatus, setIdFileStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
  // Modal state for viewing files
  const [viewFile, setViewFile] = useState<null | { url: string; title: string }>(null);
  // Stripe onboarding status
  const [stripeAccountStatus, setStripeAccountStatus] = useState<any>(null);
  const [isLoadingStripe, setIsLoadingStripe] = useState(true);

  useEffect(() => {
    if (providerId) {
      loadProviderData();
      checkStripeStatus();
    }
  }, [providerId]);

  const loadProviderData = async () => {
    try {
      setIsLoadingProvider(true);
      setProviderError(null);
      const data = await getProviderById(Number(providerId));
      setProvider(data);
    } catch (error: any) {
      setProviderError(error.userMessage || error.message || 'Failed to load provider details');
    } finally {
      setIsLoadingProvider(false);
    }
  };

  const checkStripeStatus = async () => {
    try {
      const status = await getStripeAccountStatus();
      setStripeAccountStatus(status);
    } catch (error) {
      console.log('No Stripe account set up yet');
    } finally {
      setIsLoadingStripe(false);
    }
  };

  const isFullyOnboarded = stripeAccountStatus?.details_submitted && 
                          stripeAccountStatus?.charges_enabled && 
                          stripeAccountStatus?.payouts_enabled;

  if (isLoadingProvider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading provider details...</p>
      </div>
    );
  }

  if (providerError || !provider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          {providerError || 'Provider Not Found'}
        </h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const statusInfo = getStatusVariant(provider.status);

  // Helper to render status feedback
  const renderFileStatus = (status: 'pending' | 'accepted' | 'declined') => {
    if (status === 'accepted') return <span className="flex items-center gap-1 text-green-600 font-semibold ml-2"><CheckCircle className="h-4 w-4" /> Accepted</span>;
    if (status === 'declined') return <span className="flex items-center gap-1 text-red-600 font-semibold ml-2"><XCircle className="h-4 w-4" /> Declined</span>;
    return null;
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
                <button className="text-primary underline ml-1" onClick={() => setViewFile({ url: provider.businessRegistrationUrl, title: 'Business Registration Document' })}>View</button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => setRegFileStatus('accepted')} disabled={regFileStatus==='accepted'} className="border-success-300 hover:bg-success-100 text-success-700"><CheckCircle className="h-4 w-4 mr-1" /> Accept</Button>
                <Button size="sm" variant="outline" onClick={() => setRegFileStatus('declined')} disabled={regFileStatus==='declined'} className="border-destructive-300 hover:bg-destructive-100 text-destructive-700"><XCircle className="h-4 w-4 mr-1" /> Decline</Button>
                {renderFileStatus(regFileStatus)}
              </div>
            </div>
          </div>
          )}
          {/* Pending Licenses */}
          {provider.pendingLicenses && (
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/10 shadow-inner">
              <h3 className="text-lg font-semibold mb-4 text-primary-700 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Pending License Approvals
              </h3>
              <div className="text-sm text-gray-600">
                {/* Display pending licenses information here */}
                Pending licenses data will be displayed here
              </div>
            </div>
          )}

          {/* Stripe Onboarding Status Section */}
          <div className="bg-gradient-to-br from-secondary-50 to-white rounded-xl p-6 border-2 border-secondary-100 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-gradient-purple rounded-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              Payment Account Setup (Stripe Onboarding)
            </h3>
            
            {isLoadingStripe ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-gray-600">Checking payment account status...</span>
              </div>
            ) : stripeAccountStatus ? (
              <div className="space-y-4">
                {/* Overall Status Alert */}
                {isFullyOnboarded ? (
                  <Alert className="border-success-200 bg-success-50">
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <AlertDescription className="text-success-800">
                      Payment account is fully set up and operational.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-warning-200 bg-warning-50">
                    <AlertCircle className="h-5 w-5 text-warning-600" />
                    <AlertDescription className="text-warning-800">
                      Payment account setup is incomplete. Provider needs to complete onboarding.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Detailed Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-primary/20 shadow p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Details Submitted</span>
                      {stripeAccountStatus.details_submitted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-primary/20 shadow p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Charges Enabled</span>
                      {stripeAccountStatus.charges_enabled ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-primary/20 shadow p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Payouts Enabled</span>
                      {stripeAccountStatus.payouts_enabled ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Account ID */}
                <div className="bg-white rounded-lg border border-primary/20 shadow p-4">
                  <div className="flex items-center gap-2">
                    <IdCard className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-gray-700">Stripe Account ID:</span>
                    <code className="ml-1 text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {stripeAccountStatus.account_id}
                    </code>
                  </div>
                </div>
              </div>
            ) : (
              <Alert className="border-gray-200 bg-gray-50">
                <AlertCircle className="h-5 w-5 text-gray-600" />
                <AlertDescription className="text-gray-700">
                  Provider has not started the payment account setup process yet.
                </AlertDescription>
              </Alert>
            )}
          </div>
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