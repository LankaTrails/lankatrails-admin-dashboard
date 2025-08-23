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
import { findComplaintById, updateComplaintStatus } from "@/services/complaintSection"; // Import update function
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
import { useToast } from "@/components/ui/use-toast"; // Import toast for notifications

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize toast
  const [reply, setReply] = useState("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replies, setReplies] = useState([
    { sender: "Admin", message: "Thank you for your feedback. We are looking into this.", date: "2023-08-16" },
    { sender: "John Doe", message: "Please resolve this as soon as possible.", date: "2023-08-15" },
  ]);
  const [resolutionStatus, setResolutionStatus] = useState({
    inProgress: false,
    notes: "",
    faultType: "" as "provider" | "app" | "reject" |""
  });
  const [savedResolutionStatus, setSavedResolutionStatus] = useState({
    inProgress: false,
    notes: "",
    faultType: "" as "provider" | "app" | "reject" |""
  });
  const [detailsLoaded, setDetailsLoaded] = useState(false);
  const [resolutionSaved, setResolutionSaved] = useState(false);
  const [faultClassificationSaved, setFaultClassificationSaved] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundProcessed, setRefundProcessed] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false); // Loading state for save operation

  // Sample complaint images (in a real app, these would come from the complaint data)
  const complaintImages = [
    "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    "https://images.unsplash.com/photo-1522770179533-24471fcdba45"
  ];

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setIsLoading(true);
        const data = await findComplaintById(id);
        setComplaint(data);
        console.log("Fetched complaint:", data);
        
        // If complaint already has resolution status, set it
        // if (data.complaintStatus) {
        //   setResolutionStatus({
        //     inProgress: data.complaintStatus.inProgress || false,
        //     notes: data.complaintStatus.notes || "",
        //     faultType: data.resolutionStatus.faultType || ""
        //   });
        //   setSavedResolutionStatus({
        //     inProgress: data.resolutionStatus.inProgress || false,
        //     notes: data.resolutionStatus.notes || "",
        //     faultType: data.resolutionStatus.faultType || ""
        //   });
        //   setResolutionSaved(data.resolutionStatus.inProgress || false);
        //   setDetailsLoaded(data.resolutionStatus.inProgress || false);
        // }
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
        { sender: "Admin", message: reply, date: new Date().toISOString().slice(0, 10) },
        ...replies,
      ]);
      setReply("");
    }
  };

  const handleResolutionChange = (inProgress: boolean) => {
    setResolutionStatus(prev => ({
      ...prev,
      inProgress: inProgress,
      notes: inProgress ? `Investigation started on ${new Date().toLocaleDateString()}` : "",
      faultType: inProgress ? prev.faultType : ""
    }));
    
    // Hide details when checkbox is unchecked
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
    }
  };

  const handleFaultTypeChange = (value: "provider" | "app") => {
    setResolutionStatus(prev => ({
      ...prev,
      faultType: value
    }));
  };

  const handleSaveResolution = async () => {
    if (!complaint) return;
    
    setIsSaving(true);
    try {
      // Prepare the data to update
      const updateData = {
        resolutionStatus: {
          // inProgress: resolutionStatus.inProgress,
          // notes: resolutionStatus.notes,
          // faultType: resolutionStatus.faultType,
          investigationStartedDate: new Date().toISOString()
        }
      };

      // Call the API to update the complaint status
      const updatedComplaint = await updateComplaintStatus(complaint.complaintId, updateData);
      
      // Update the saved resolution status
      setSavedResolutionStatus({
        inProgress: resolutionStatus.inProgress,
        notes: resolutionStatus.notes,
        faultType: resolutionStatus.faultType
      });
      
      // Mark resolution as saved
      setResolutionSaved(true);
      
      // Load the rest of the complaint details
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

  const handleSaveFaultClassification = () => {
    if (!resolutionStatus.faultType) {
      alert("Please select a fault type.");
      return;
    }
    
    // Here you would typically make an API call to update the fault classification
    console.log("Saving fault classification:", resolutionStatus.faultType);
    // Add your API call here to update the fault classification
    
    // Update the saved resolution status with the fault type
    setSavedResolutionStatus(prev => ({
      ...prev,
      faultType: resolutionStatus.faultType
    }));
    
    // Mark fault classification as saved
    setFaultClassificationSaved(true);
    
    alert(`Fault classification saved: ${resolutionStatus.faultType === 'provider' ? 'Provider Fault' : 'App Fault'}`);
  };

  const handleProcessRefund = () => {
    if (!refundAmount || !refundReason) {
      alert("Please fill in both refund amount and reason.");
      return;
    }
    
    // Here you would typically make an API call to process the refund
    console.log("Processing refund:", { amount: refundAmount, reason: refundReason });
    // Add your API call here to process the refund
    
    setRefundProcessed(true);
    alert(`Refund of $${refundAmount} processed successfully.`);
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

  const adminReplies = replies.filter(r => r.sender === 'Admin');

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
      <div className="relative w-full rounded-t-2xl overflow-hidden bg-gradient-to-r from-primary/90 to-primary/60 shadow-lg mb-0">
        <div className="flex items-center gap-4 px-8 py-8">
          <div className="bg-white/80 rounded-full p-4 shadow-lg">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-4">
              {complaint.touristEmail}
              <Badge variant={savedResolutionStatus.inProgress ? 'secondary' : 'destructive'} className="capitalize text-base px-4 py-2 ml-2 shadow-md">
                {savedResolutionStatus.inProgress ? 'In Progress' : 'Pending'}
              </Badge>
              {savedResolutionStatus.faultType && (
                <Badge variant="outline" className="capitalize text-base px-4 py-2 ml-2 shadow-md bg-white text-primary">
                  Fault: {savedResolutionStatus.faultType === 'provider' ? 'Provider' : 'App'}
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
      <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 rounded-t-none rounded-b-2xl w-full max-w-5xl mx-auto -mt-6 z-10 relative">
        <CardContent className="space-y-8 w-full pt-10">
          {/* Meta Info Bar */}
          <div className="flex flex-wrap gap-6 items-center justify-center bg-primary/5 rounded-lg p-4 border border-primary/10 shadow-inner">
            <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Complaint ID:</span> {complaint.complaintId}</div>
            <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Date:</span> {complaint.complaintDateTime}</div>
            {complaint.bookingId && (
              <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Booking ID:</span> {complaint.bookingId}</div>
            )}
            <div className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Against:</span> {complaint.serviceName}</div>
          </div>

          {/* Resolution Section */}
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
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
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

          {/* Only show the rest of the details after Save Resolution Status is clicked */}
          {detailsLoaded ? (
            <>
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-700 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Description</h3>
                <p className="text-gray-700 bg-primary/5 rounded-lg p-6 border-l-4 border-primary/40 border border-primary/10 shadow-inner text-lg">
                  {complaint.description}
                </p>
              </div>

              {/* Complaint Images Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-700 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" /> Images Attached
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complaintImages.map((image, index) => (
                    <motion.div 
                      key={index} 
                      className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-primary/20 shadow-md"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image} 
                        alt={`Complaint evidence ${index + 1}`} 
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-medium">Click to enlarge</p>
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
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 shadow-inner">
                <h3 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" /> Fault Classification
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="faultType" className="block mb-2 font-medium text-gray-700">Fault Type</Label>
                    <Select 
                      value={resolutionStatus.faultType} 
                      onValueChange={(value: "provider" | "app" | "reject") => !faultClassificationSaved && handleFaultTypeChange(value)}
                      disabled={faultClassificationSaved}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select fault type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="provider">Provider Fault</SelectItem>
                        <SelectItem value="app">App Fault</SelectItem>
                        <SelectItem value="reject">Reject Complaint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!faultClassificationSaved && (
                    <Button 
                      onClick={handleSaveFaultClassification} 
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                      disabled={!resolutionStatus.faultType}
                    >
                      Save Fault Classification
                    </Button>
                  )}

                  {faultClassificationSaved && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-200">
                      <CheckCircle className="h-5 w-5 inline mr-2" />
                      Fault classification saved: {resolutionStatus.faultType === 'provider' ? 'Provider Fault' : 'App Fault'}
                    </div>
                  )}
                </div>
              </div>

              {/* Refund Section - Only shown after fault classification is saved */}
              {faultClassificationSaved && (
                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200 shadow-inner">
                  <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" /> 
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
                        disabled={refundProcessed}
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
                        disabled={refundProcessed}
                      />
                    </div>

                    {!refundProcessed && (
                      <Button 
                        onClick={handleProcessRefund} 
                        className="mt-4 bg-green-600 hover:bg-green-700"
                        disabled={!refundAmount || !refundReason}
                      >
                        Process Refund
                      </Button>
                    )}

                    {refundProcessed && (
                      <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-200">
                        <CheckCircle className="h-5 w-5 inline mr-2" />
                        Refund of ${refundAmount} processed successfully.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messaging Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2 text-primary-700 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Replies</h3>
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 shadow-inner">
                  <div className="space-y-4 mb-6">
                    {adminReplies.length === 0 && <div className="text-gray-500">No replies yet.</div>}
                    {adminReplies.map((r, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }} className={`flex flex-col items-end`}>
                        <div className={`rounded-lg px-4 py-2 shadow bg-primary/10 text-primary-900`}>
                          <span className="block font-medium flex items-center gap-1">
                            <User className="h-4 w-4 text-primary" /> {r.sender}
                          </span>
                          <span className="block mt-1">{r.message}</span>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{r.date}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 items-end border-t border-primary/10 pt-4 mt-4">
                    <Textarea
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      placeholder="Write a reply as admin..."
                      className="w-full md:w-2/3 min-h-[60px]"
                    />
                    <Button onClick={handleSendReply} className="mt-2 md:mt-0" disabled={!reply.trim()}>
                      Send
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Only admins can reply to this complaint.</div>
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