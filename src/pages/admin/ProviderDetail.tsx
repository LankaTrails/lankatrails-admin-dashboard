import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, User, Calendar, MapPin, Building2, FileText, Mail, Phone, IdCard, Briefcase, CheckCircle, XCircle, X as CloseIcon } from "lucide-react";
import { useState } from "react";

// Expanded mock data with all requested fields
const allProviders = [
  {
    name: "Ella Spice Garden",
    businessName: "Ella Spice Garden Pvt Ltd",
    businessDescription: "A unique experience offering spice plantation tours and authentic Sri Lankan cooking classes in the heart of Ella.",
    location: "Ella, Uva",
    businessType: "Activities & Experiences",
    businessRegistrationNumber: "BRN-2023-001",
    businessRegistrationFile: "/sample-business-reg.pdf",
    contactPersonName: "Nimal Perera",
    contactPhone: "+94 77 123 4567",
    contactPersonIdentityFile: "/sample-nic.pdf",
    position: "Owner / Manager",
    contactEmail: "nimal@ellaspice.com",
    loginEmail: "spicegarden@gmail.com",
    profilePhoto: "/profile-ella.jpg",
    status: "Approved",
    date: "2023-06-23"
  },
  {
    name: "Kandy View Hotel",
    businessName: "Kandy View Hotel",
    businessDescription: "A family-run hotel with panoramic views of Kandy city and the surrounding hills.",
    location: "Kandy, Central",
    businessType: "Accommodation",
    businessRegistrationNumber: "BRN-2023-002",
    businessRegistrationFile: "/sample-business-reg.pdf",
    contactPersonName: "Sunil Jayasuriya",
    contactPhone: "+94 71 234 5678",
    contactPersonIdentityFile: "/sample-nic.pdf",
    position: "General Manager",
    contactEmail: "sunil@kandyview.com",
    loginEmail: "kandyview@gmail.com",
    profilePhoto: "/profile-kandy.jpg",
    status: "Pending",
    date: "2023-06-24"
  },
  // ...add more providers as needed
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Approved': return { variant: 'default', color: 'bg-green-600 hover:bg-green-600/80' };
    case 'Pending': return { variant: 'secondary', color: 'bg-yellow-500 hover:bg-yellow-500/80' };
    case 'Rejected': return { variant: 'destructive', color: 'bg-red-600 hover:bg-red-600/80' };
    default: return { variant: 'outline', color: '' };
  }
};

const ProviderDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const provider = allProviders.find(p => p.name === name);

  // Local state for file approval/decline
  const [regFileStatus, setRegFileStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [idFileStatus, setIdFileStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
  // Modal state for viewing files
  const [viewFile, setViewFile] = useState<null | { url: string; title: string }>(null);

  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Provider Not Found</h2>
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
      <div className="relative w-full rounded-t-2xl overflow-hidden bg-gradient-to-r from-primary/90 to-primary/60 shadow-lg mb-0">
        <div className="flex items-center gap-6 px-8 py-8">
          <div className="bg-white/80 rounded-full p-2 shadow-lg">
            <img src={provider.profilePhoto} alt="Profile" className="h-24 w-24 object-cover rounded-full border-4 border-primary shadow-xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-4">
              {provider.businessName}
              <Badge variant={statusInfo.variant as any} className={`capitalize text-base px-4 py-2 ml-2 shadow-md ${statusInfo.color}`}>
                {provider.status}
              </Badge>
            </h1>
            <div className="mt-2 text-white/90 text-lg flex items-center gap-2">
              <User className="h-5 w-5 mr-1" />
              <span className="font-semibold">{provider.contactPersonName}</span>
              <span className="mx-2">|</span>
              <span>{provider.position}</span>
            </div>
          </div>
          <Button variant="ghost" className="text-white border-white border-2 hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>
        </div>
      </div>
      {/* Main Card */}
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 rounded-t-none rounded-b-2xl w-full max-w-3xl mx-auto -mt-6 z-10 relative">
        <CardContent className="space-y-8 w-full pt-10">
          {/* Meta Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 rounded-lg p-6 border border-primary/10 shadow-inner">
            <div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Business Name:</span> <span className="ml-1 text-gray-800">{provider.businessName}</span></div>
            <div className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Business Type:</span> <span className="ml-1 text-gray-800">{provider.businessType}</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Location:</span> <span className="ml-1 text-gray-800">{provider.location}</span></div>
            <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Registered On:</span> <span className="ml-1 text-gray-800">{provider.date}</span></div>
          </div>
          {/* Business Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary-700 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Business Description</h3>
            <p className="text-gray-700 bg-primary/5 rounded-lg p-6 border-l-4 border-primary/40 border border-primary/10 shadow-inner text-lg text-left">
              {provider.businessDescription}
            </p>
          </div>
          {/* Business Registration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 rounded-lg p-6 border border-primary/10 shadow-inner">
            <div className="flex items-center gap-2"><IdCard className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Business Reg. No:</span> <span className="ml-1 text-gray-800">{provider.businessRegistrationNumber}</span></div>
            <div>
              <div className="bg-white rounded-lg border border-primary/20 shadow p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Business Reg. File:</span> <button className="text-primary underline ml-1" onClick={() => setViewFile({ url: provider.businessRegistrationFile, title: 'Business Registration Document' })}>View</button></div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => setRegFileStatus('accepted')} disabled={regFileStatus==='accepted'}><CheckCircle className="h-4 w-4 mr-1 text-green-600" /> Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => setRegFileStatus('declined')} disabled={regFileStatus==='declined'}><XCircle className="h-4 w-4 mr-1 text-red-600" /> Decline</Button>
                  {renderFileStatus(regFileStatus)}
                </div>
              </div>
            </div>
          </div>
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 rounded-lg p-6 border border-primary/10 shadow-inner">
            <div className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Contact Person:</span> <span className="ml-1 text-gray-800">{provider.contactPersonName}</span></div>
            <div className="flex items-center gap-2"><Phone className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Phone:</span> <span className="ml-1 text-gray-800">{provider.contactPhone}</span></div>
            <div className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Contact Email:</span> <span className="ml-1 text-gray-800">{provider.contactEmail}</span></div>
            <div>
              <div className="bg-white rounded-lg border border-primary/20 shadow p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2"><IdCard className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Identity File:</span> <button className="text-primary underline ml-1" onClick={() => setViewFile({ url: provider.contactPersonIdentityFile, title: 'Identity Document' })}>View</button></div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => setIdFileStatus('accepted')} disabled={idFileStatus==='accepted'}><CheckCircle className="h-4 w-4 mr-1 text-green-600" /> Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => setIdFileStatus('declined')} disabled={idFileStatus==='declined'}><XCircle className="h-4 w-4 mr-1 text-red-600" /> Decline</Button>
                  {renderFileStatus(idFileStatus)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:col-span-2 mt-2"><Briefcase className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Position:</span> <span className="ml-1 text-gray-800">{provider.position}</span></div>
          </div>
          {/* Login Email */}
          <div className="flex items-center gap-2 bg-primary/5 rounded-lg p-4 border border-primary/10 shadow-inner">
            <Mail className="h-5 w-5 text-primary" />
            <span className="font-semibold text-gray-700">Login Email:</span> <span className="ml-1 text-gray-800">{provider.loginEmail}</span>
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