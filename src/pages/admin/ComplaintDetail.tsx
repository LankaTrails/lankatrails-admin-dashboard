import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Calendar, User, FileText, Image as ImageIcon, MessageSquare, CheckCircle, Clock, ChevronDown, DollarSign, X } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Complaint } from "@/types/complaints";
import { useEffect } from "react";
import { findComplaintById, updateComplaintStatus, updateComplaintResult, updateRefundStatus, sendFeedbackToProvider, sendFeedbackToTourist } from "@/services/complaintSection";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Define the ComplaintResult type based on your backend expectations
interface ComplaintResult {
  faultType: "PROVIDER" | "APP" | "REJECT";
  notes?: string;
  refundAmount?: number;
  refundReason?: string;
}

interface Message {
  sender: string;
  message: string;
  date: string;
  type: 'admin' | 'supplier' | 'tourist';
}

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reply, setReply] = useState("");
  const [supplierMessage, setSupplierMessage] = useState("");
  const [touristMessage, setTouristMessage] = useState("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replies, setReplies] = useState<Message[]>([
    { sender: "Admin", message: "Thank you for your feedback. We are looking into this.", date: "2023-08-16", type: 'admin' },
    { sender: "John Doe", message: "Please resolve this as soon as possible.", date: "2023-08-15", type: 'tourist' },
  ]);
  const [resolutionStatus, setResolutionStatus] = useState({
    inProgress: false,
    notes: "",
    faultType: "" as "PROVIDER" | "APP" | "REJECT" | ""
  });
  const [savedResolutionStatus, setSavedResolutionStatus] = useState({
    inProgress: false,
    notes: "",
    faultType: "" as "PROVIDER" | "APP" | "REJECT" | ""
  });
  const [detailsLoaded, setDetailsLoaded] = useState(false);
  const [resolutionSaved, setResolutionSaved] = useState(false);
  const [faultClassificationSaved, setFaultClassificationSaved] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundProcessed, setRefundProcessed] = useState(false);
  const [refundReasonProcessed, setRefundReasonProcessed] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingFault, setIsSavingFault] = useState(false);
  // Add complaintResultValue to state
  const [complaintResultValue, setComplaintResultValue] = useState("");
  // State for complaint images
  const [complaintImages, setComplaintImages] = useState<string[]>([]);
  // State for image loading errors
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setIsLoading(true);
        const data = await findComplaintById(id);
        setComplaint(data);
        console.log("Fetched complaint:", data);

        // Check for investigation status
        if (data.complaintStatus && data.complaintStatus !== "PENDING") {
          setResolutionStatus(prev => ({
            ...prev,
            inProgress: true,
            notes: data.investigationStartedDate ? `Investigation started on ${new Date(data.investigationStartedDate).toLocaleDateString()}` : "Investigation in progress"
          }));
          setSavedResolutionStatus(prev => ({
            ...prev,
            inProgress: true,
            notes: data.investigationStartedDate ? `Investigation started on ${new Date(data.investigationStartedDate).toLocaleDateString()}` : "Investigation in progress"
          }));
          setResolutionSaved(true);
          setDetailsLoaded(true);
        }

        // Check for complaint result and set fault type
        if (data.complaintResult != null) {
          // Map complaint result to fault type
          let faultType: "PROVIDER" | "APP" | "REJECT" = "REJECT";
          let resultValue = "";
          
          if (data.complaintResult === "REFUND_FROM_PROVIDER") {
            faultType = "PROVIDER";
            resultValue = "REFUND_FROM_PROVIDER";
          } else if (data.complaintResult === "REFUND_FROM_COMPANY") {
            faultType = "APP";
            resultValue = "REFUND_FROM_COMPANY";
          } else if (data.complaintResult === "REJECT") {
            faultType = "REJECT";
            resultValue = "REJECT";
          }
          
          setFaultClassificationSaved(true);
          // Set the fault type from complaintResult
          setResolutionStatus(prev => ({
            ...prev,
            faultType: faultType
          }));
          setSavedResolutionStatus(prev => ({
            ...prev,
            faultType: faultType
          }));
          // Set the complaint result value
          setComplaintResultValue(resultValue);
          
          // Set refund amount from paidAmount when complaint result exists
          if (data.paidAmount) {
            setRefundAmount(data.paidAmount.toString());
          }
        }

        // Check if refundReason exists and is not null/empty
        if (data.refundReason && data.refundReason.trim() !== "") {
          setRefundReason(String(data.refundReason));
          setRefundReasonProcessed(true); // Disable the textarea
        }

        // Check if refund has already been processed
        if (data.refundStatus === 'REFUNDED') {
          setRefundProcessed(true);
        }

        // Load complaint images from the database
        if (data.complaintImgs && Array.isArray(data.complaintImgs) && data.complaintImgs.length > 0) {
          setComplaintImages(data.complaintImgs);
          console.log("Loaded complaint images:", data.complaintImgs);
        } else {
          setComplaintImages([]);
          console.log("No complaint images found");
        }
        
      } catch (error) {
        console.error('Error fetching complaint:', error);
        toast({
          title: "Error",
          description: "Failed to load complaint details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaint();
  }, [id, toast]);

  const handleSendReply = () => {
    if (reply.trim()) {
      setReplies([
        { sender: "Admin", message: reply, date: new Date().toISOString().slice(0, 10), type: 'admin' },
        ...replies,
      ]);
      setReply("");
    }
  };

 const handleSendSupplierMessage = async () => {
  if (supplierMessage.trim()) {
    try {
      const updateData={
        adminToProvider: supplierMessage
      }
      // First, send the feedback to the provider via API
      await sendFeedbackToProvider(complaint.complaintId, {
       updateData
      });

      // Then update the local state to show the message in the UI
      setReplies([
        { sender: "Supplier", message: supplierMessage, date: new Date().toISOString().slice(0, 10), type: 'supplier' },
        ...replies,
      ]);
      setSupplierMessage("");

      // Show success toast
      toast({
        description: "Message sent to supplier successfully",
        variant: "default",
      });

    } catch (error) {
      console.error('Error sending feedback to provider:', error);
      toast({
        title: "Error",
        description: "Failed to send message to supplier",
        variant: "destructive",
      });
    }
  }
};

 const handleSendTouristMessage = async () => {
  if (touristMessage.trim()) {
    try {
      const updateData={
        adminToTourist: touristMessage
      }
      // First, send the feedback to the tourist via API
      await sendFeedbackToTourist(complaint.complaintId, {
       updateData
      });

      // Then update the local state to show the message in the UI
      setReplies([
        { sender: "Tourist", message: touristMessage, date: new Date().toISOString().slice(0, 10), type: 'tourist' },
        ...replies,
      ]);
      setTouristMessage("");

      // Show success toast
      toast({
        description: "Message sent to tourist successfully",
        variant: "default",
      });

    } catch (error) {
      console.error('Error sending feedback to tourist:', error);
      toast({
        title: "Error",
        description: "Failed to send message to tourist",
        variant: "destructive",
      });
    }
  }
};

  const handleResolutionChange = (inProgress: boolean) => {
    setResolutionStatus(prev => ({
      ...prev,
      inProgress: inProgress,
      notes: inProgress ? `Investigation started on ${new Date().toLocaleDateString()}` : "",
      faultType: inProgress ? prev.faultType : ""
    }));
    
    if (!inProgress) {
      setDetailsLoaded(false);
      setSavedResolutionStatus(prev => ({
        ...prev,
        inProgress: false,
        notes: "",
        faultType: ""
      }));
      setResolutionSaved(false);
      setFaultClassificationSaved(false);
      setRefundAmount(""); // Reset refund amount when resolution is turned off
      setComplaintResultValue(""); // Reset complaint result value
      setRefundReason(""); // Reset refund reason
      setRefundReasonProcessed(false); // Reset refund reason processed status
      setRefundProcessed(false); // Reset refund processed status
      setImageErrors({}); // Reset image errors
    }
  };

  const handleFaultTypeChange = (value: "PROVIDER" | "APP" | "REJECT") => {
    setResolutionStatus(prev => ({
      ...prev,
      faultType: value
    }));
  };

  const handleSaveResolution = async () => {
    if (!complaint) return;
    
    setIsSaving(true);
    try {
      const investigationStartedDate = new Date().toISOString();

      const updatedComplaint = await updateComplaintStatus(complaint.complaintId, investigationStartedDate);
      
      // Update local complaint data
      setComplaint(prev => prev ? { ...prev, investigationStartedDate } : null);
      
      setSavedResolutionStatus({
        inProgress: resolutionStatus.inProgress,
        notes: resolutionStatus.notes,
        faultType: resolutionStatus.faultType
      });
      
      setResolutionSaved(true);
      setDetailsLoaded(true);
      
      toast({
        title: "Success",
        description: `Complaint status updated to: ${resolutionStatus.inProgress ? 'In Progress' : 'Pending'}`,
      });
      
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast({
        title: "Error",
        description: "Failed to update complaint status",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFaultClassification = async () => {
    if (!complaint || !resolutionStatus.faultType) {
      toast({
        title: "Error",
        description: "Please select a fault type.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSavingFault(true);
    try {
      let resultValue = "";
      
      if (resolutionStatus.faultType === "APP") {
        resultValue = "REFUND_FROM_COMPANY";
      } else if (resolutionStatus.faultType === "PROVIDER") {
        resultValue = "REFUND_FROM_PROVIDER";
      } else {
        resultValue = "REJECT";
      }

      const updateData = {
        complaintResult: resultValue
      };
      
      const updatedComplaint = await updateComplaintResult(complaint.complaintId, updateData);
      
      // Update the saved resolution status with the fault type
      setSavedResolutionStatus(prev => ({
        ...prev,
        faultType: resolutionStatus.faultType
      }));
      
      // Set the complaint result value in state
      setComplaintResultValue(resultValue);
      
      // Set refund amount when fault classification is saved (only for non-REJECT types)
      if (resolutionStatus.faultType !== "REJECT" && complaint.paidAmount) {
        setRefundAmount(complaint.paidAmount.toString());
      }
      
      // Mark fault classification as saved
      setFaultClassificationSaved(true);
      
      toast({
        title: "Success",
        description: `Fault classification saved: ${resolutionStatus.faultType === 'PROVIDER' ? 'Provider Fault' : resolutionStatus.faultType === 'APP' ? 'App Fault' : 'Reject Complaint'}`,
      });
      
    } catch (error) {
      console.error('Error saving fault classification:', error);
      toast({
        title: "Error",
        description: "Failed to save fault classification",
        variant: "destructive",
      });
    } finally {
      setIsSavingFault(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!refundAmount || !refundReason) {
      toast({
        title: "",
        description: "Please fill in refund reason.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if complaintResultValue is set
    if (!complaintResultValue) {
      toast({
        title: "Error",
        description: "Fault classification not saved. Please save fault classification first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updateData = {
        complaintResult: complaintResultValue,
        refundStatus: 'REFUNDED',
        refundReason: refundReason
      };

      console.log("Refund update data:", updateData);
      
      const makeRefund = await updateRefundStatus(complaint.complaintId, updateData);
      
      toast({
        description: "Refund processed successfully",
        variant: "default",
      });
      
      setRefundReasonProcessed(true);
      setRefundProcessed(true);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
      console.error("Refund processing error:", error);
    }
  };

  // Handle image loading errors
  const handleImageError = (index: number) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Helper function to check if investigation has started
  const hasInvestigationStarted = () => {
    return complaint?.investigationStartedDate && complaint.investigationStartedDate !== "null";
  };

  // Get messages by type
  const adminReplies = replies.filter(r => r.type === 'admin');
  const supplierReplies = replies.filter(r => r.type === 'supplier');
  const touristReplies = replies.filter(r => r.type === 'tourist');

  // Helper function to get badge color based on sender type
  const getMessageBadgeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'supplier': return 'bg-green-100 text-green-800 border-green-200';
      case 'tourist': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading complaint details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Complaint Not Found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full mx-auto">
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-full">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <img 
              src={selectedImage} 
              alt="Complaint evidence" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative w-full rounded-t-2xl overflow-hidden bg-gradient-rose shadow-2xl mb-0">
        <div className="flex items-center gap-4 px-8 py-8">
          <div className="bg-white/80 rounded-full p-4 shadow-lg">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-4">
              {complaint.touristEmail}
              <Badge 
                variant={
                  complaint?.complaintStatus === 'RESOLVED' ? 'default' :
                  savedResolutionStatus.inProgress ? 'secondary' : 'destructive'
                } 
                className="capitalize text-base px-4 py-2 ml-2 shadow-md"
              >
                {
                  complaint?.complaintStatus === 'RESOLVED' ? 'Resolved' :
                  savedResolutionStatus.inProgress ? 'In Progress' : 'Pending'
                }
              </Badge>
              {savedResolutionStatus.faultType && (
                <Badge variant="outline" className="capitalize text-base px-4 py-2 ml-2 shadow-md bg-white text-primary">
                  Fault: {savedResolutionStatus.faultType === 'PROVIDER' ? 'Provider' : savedResolutionStatus.faultType === 'APP' ? 'App' : 'Rejected'}
                </Badge>
              )}
              {refundProcessed && (
                <Badge variant="default" className="capitalize text-base px-4 py-2 ml-2 shadow-md bg-green-500 text-white">
                  Refund Processed
                </Badge>
              )}
            </h1>
            <div className="mt-2 text-white/90 text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 mr-1" />
              {complaint.serviceName} - <User className="h-5 w-5 mx-1" /> <span className="font-semibold">{complaint.serviceName}</span>
            </div>
          </div>
          <Button variant="ghost" className="text-white border-white border-2 hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <Card className="shadow-2xl border-0 bg-white rounded-t-none rounded-b-2xl w-full max-w-5xl mx-auto -mt-6 z-10 relative">
        <CardContent className="space-y-8 w-full pt-10">
          {/* Meta Info Bar */}
          <div className="flex flex-wrap gap-6 items-center justify-center bg-gradient-to-br from-destructive-50 to-warning-50/30 rounded-xl p-4 border-2 border-destructive-100 shadow-md">
            <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Complaint ID:</span> {complaint.complaintId}</div>
            <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Date:</span> {complaint.complaintDateTime}</div>
            {complaint.bookingId && (
              <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Booking ID:</span> {complaint.bookingId}</div>
            )}
            <div className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Against:</span> {complaint.serviceName}</div>
          </div>

          {/* Resolution Section */}
          {!hasInvestigationStarted() && (
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 shadow-inner">
            <h3 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" /> Resolution Process
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="inProgress" 
                  checked={resolutionStatus.inProgress}
                  onCheckedChange={(checked) => !resolutionSaved && handleResolutionChange(checked === true)}
                  disabled={resolutionSaved}
                />
                <Label htmlFor="inProgress" className={`flex items-center gap-2 ${resolutionSaved ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`}>
                  <Clock className="h-4 w-4 text-blue-500" />
                  Mark as In Progress
                </Label>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="resolutionNotes" className="block mb-2 font-medium text-gray-700">Resolution Notes</Label>
                <Textarea
                  id="resolutionNotes"
                  placeholder="Add notes about the resolution process..."
                  value={resolutionStatus.notes}
                  onChange={(e) => !resolutionSaved && setResolutionStatus(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full min-h-[100px]"
                  disabled={resolutionSaved}
                />
              </div>
               
              {resolutionStatus.inProgress && !resolutionSaved && (
                <Button 
                  onClick={handleSaveResolution} 
                  className="mt-4 bg-gradient-info hover:opacity-90 border-0 shadow-md"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Resolution Status"}
                </Button>
              )}
              
              {resolutionSaved && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-200">
                  <CheckCircle className="h-5 w-5 inline mr-2" />
                  Resolution status has been saved.
                </div>
              )}
            </div>
          </div>
          )}
          
          {/* Only show the rest of the details after investigation has started */}
          {hasInvestigationStarted() ? (
            <>
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Description
                </h3>
                <p className="text-gray-700 bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 border-l-4 border-primary-500 border border-primary-100 shadow-md text-base">
                  {complaint.description}
                </p>
              </div>

              {/* Complaint Images Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-700 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" /> 
                  Images Attached {complaintImages.length > 0 && `(${complaintImages.length})`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complaintImages.map((image, index) => (
                    <motion.div 
                      key={index} 
                      className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-primary/20 shadow-md"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => !imageErrors[index] && setSelectedImage(image)}
                    >
                      {imageErrors[index] ? (
                        <div className="w-full h-48 bg-gray-200 flex flex-col items-center justify-center text-gray-500">
                          <ImageIcon className="h-12 w-12 mb-2" />
                          <p className="text-sm">Image not available</p>
                        </div>
                      ) : (
                        <img 
                          src={image} 
                          alt={`Complaint evidence ${index + 1}`} 
                          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                          onError={() => handleImageError(index)}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-medium">
                          {imageErrors[index] ? 'Image unavailable' : 'Click to enlarge'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {complaintImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500 bg-primary/5 rounded-lg border border-primary/10">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p>No images provided with this complaint</p>
                  </div>
                )}
              </div>

              {/* Fault Classification Section */}
              <div className="bg-gradient-to-br from-warning-50 to-white rounded-xl p-6 border-2 border-warning-200 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <div className="p-2 bg-gradient-warm rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  Fault Classification
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="faultType" className="block mb-2 font-medium text-gray-700">Fault Type</Label>
                    <Select 
                      value={resolutionStatus.faultType} 
                      onValueChange={(value: "PROVIDER" | "APP" | "REJECT") => !faultClassificationSaved && handleFaultTypeChange(value)}
                      disabled={faultClassificationSaved}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          faultClassificationSaved 
                            ? `Saved: ${savedResolutionStatus.faultType === 'PROVIDER' ? 'Provider Fault' : savedResolutionStatus.faultType === 'APP' ? 'App Fault' : 'Reject Complaint'}`
                            : "Select fault type"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PROVIDER">Provider Fault</SelectItem>
                        <SelectItem value="APP">App Fault</SelectItem>
                        <SelectItem value="REJECT">Reject Complaint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!faultClassificationSaved && (
                    <Button 
                      onClick={handleSaveFaultClassification} 
                      className="mt-4 bg-gradient-warm hover:opacity-90 border-0 shadow-md"
                      disabled={!resolutionStatus.faultType || isSavingFault}
                    >
                      {isSavingFault ? "Saving..." : "Save Fault Classification"}
                    </Button>
                  )}
                 
                  {faultClassificationSaved && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-200">
                      <CheckCircle className="h-5 w-5 inline mr-2" />
                      Fault classification saved: {resolutionStatus.faultType === 'PROVIDER' ? 'Provider Fault' : resolutionStatus.faultType === 'APP' ? 'App Fault' : 'Reject Complaint'}
                    </div>
                  )}
                </div>
              </div>

              {/* Refund Section - Only shown after fault classification is saved and NOT "REJECT" */}
              {faultClassificationSaved && resolutionStatus.faultType !== "REJECT" && (
                <div className="bg-gradient-to-br from-success-50 to-white rounded-xl p-6 border-2 border-success-200 shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <div className="p-2 bg-gradient-success rounded-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    Refund Process
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="refundAmount" className="block mb-2 font-medium text-gray-700">Refund Amount</Label>
                      <Input
                        id="refundAmount"
                        type="number"
                        placeholder="Enter refund amount"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        className="w-full"
                        disabled={true}
                      />
                    </div>

                    <div>
                      <Label htmlFor="refundReason" className="block mb-2 font-medium text-gray-700">Refund Reason</Label>
                      <Textarea
                        id="refundReason"
                        placeholder="Enter reason for refund..."
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        className="w-full min-h-[80px]"
                        disabled={refundReasonProcessed || refundProcessed}
                      />
                      {refundReasonProcessed && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Refund reason has been previously set and cannot be modified.
                        </p>
                      )}
                    </div>

                    {!refundProcessed && (
                      <Button 
                        onClick={handleProcessRefund} 
                        className="mt-4 bg-green-600 hover:bg-green-700"
                        disabled={!refundAmount || !refundReason || refundReasonProcessed || !complaintResultValue}
                      >
                        Process Refund
                      </Button>
                    )}

                    {refundProcessed && (
                      <div className="mt-4 p-3 bg-success-100 text-success-800 rounded-md border border-success-200">
                        <CheckCircle className="h-5 w-5 inline mr-2" />
                        Refund of LKR {refundAmount} processed successfully.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messaging Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-primary-700 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" /> 
                  Feedback
                </h3>
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 shadow-inner">
                  

                  {/* Supplier Message Section */}
                  <div className="border-t border-primary/10 pt-4 mt-4">
                    <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" /> Message to Supplier
                    </h4>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <Textarea
                        value={supplierMessage}
                        onChange={e => setSupplierMessage(e.target.value)}
                        placeholder="Write a message to the supplier..."
                        className="w-full md:w-2/3 min-h-[60px]"
                      />
                      <Button 
                        onClick={handleSendSupplierMessage} 
                        className="mt-2 md:mt-0 bg-green-600 hover:bg-green-700" 
                        disabled={!supplierMessage.trim()}
                      >
                        Send to Supplier
                      </Button>
                    </div>
                  </div>

                  {/* Tourist Message Section */}
                  <div className="border-t border-primary/10 pt-4 mt-4">
                    <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" /> Message to Tourist
                    </h4>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <Textarea
                        value={touristMessage}
                        onChange={e => setTouristMessage(e.target.value)}
                        placeholder="Write a message to the tourist..."
                        className="w-full md:w-2/3 min-h-[60px]"
                      />
                      <Button 
                        onClick={handleSendTouristMessage} 
                        className="mt-2 md:mt-0 bg-purple-600 hover:bg-purple-700" 
                        disabled={!touristMessage.trim()}
                      >
                        Send to Tourist
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-4 text-center">
                    All messages are sent from the admin perspective
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{resolutionStatus.inProgress ? 'Click "Save Resolution Status" to view the full complaint details.' : 'Mark as "In Progress" and save to view complaint details.'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComplaintDetail;