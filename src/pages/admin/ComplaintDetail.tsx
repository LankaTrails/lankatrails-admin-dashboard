import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Calendar, User, FileText, Image as ImageIcon, MessageSquare } from "lucide-react";
import { allComplaints, Complaint } from "./Complaints";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([
    { sender: "Admin", message: "Thank you for your feedback. We are looking into this.", date: "2023-08-16" },
    { sender: "John Doe", message: "Please resolve this as soon as possible.", date: "2023-08-15" },
  ]);

  const complaint: Complaint | undefined = allComplaints.find((c: Complaint) => c.id === id);

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Complaint Not Found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const images = complaint.images && Array.isArray(complaint.images) ? complaint.images : [];

  const handleSendReply = () => {
    if (reply.trim()) {
      setReplies([
        { sender: "Admin", message: reply, date: new Date().toISOString().slice(0, 10) },
        ...replies,
      ]);
      setReply("");
    }
  };

  // Only show admin messages in the replies section
  const adminReplies = replies.filter(r => r.sender === 'Admin');

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full mx-auto">
      {/* Hero Header */}
      <div className="relative w-full rounded-t-2xl overflow-hidden bg-gradient-to-r from-primary/90 to-primary/60 shadow-lg mb-0">
        <div className="flex items-center gap-4 px-8 py-8">
          <div className="bg-white/80 rounded-full p-4 shadow-lg">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-4">
              {complaint.title}
              <Badge variant={complaint.status === 'Resolved' ? 'default' : complaint.status === 'In Progress' ? 'secondary' : 'destructive'} className="capitalize text-base px-4 py-2 ml-2 shadow-md">
                {complaint.status}
              </Badge>
            </h1>
            <div className="mt-2 text-white/90 text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 mr-1" />
              {complaint.subject} - <User className="h-5 w-5 mx-1" /> <span className="font-semibold">{complaint.user}</span>
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
            <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Booking ID:</span> {complaint.bookingId}</div>
            <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Booking Date:</span> {complaint.bookingDate}</div>
            <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Service Date:</span> {complaint.serviceDate}</div>
            <div className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /><span className="font-semibold text-gray-700">Against:</span> {complaint.against}</div>
          </div>
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary-700 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Description</h3>
            <p className="text-gray-700 bg-primary/5 rounded-lg p-6 border-l-4 border-primary/40 border border-primary/10 shadow-inner text-lg">
              {complaint.description}
            </p>
          </div>
          {/* Evidence Images */}
          {images.length > 0 && (
            <div className="flex flex-col items-center justify-center mt-4 w-full">
              <div className="flex flex-row flex-wrap gap-6 items-center justify-center">
                {images.map((img: string, idx: number) => (
                  <motion.div key={idx} whileHover={{ scale: 1.08 }} className="relative group">
                    <img
                      src={img}
                      alt={`Evidence ${idx + 1}`}
                      className="rounded-xl shadow-2xl border-2 border-primary/40 w-48 h-48 object-cover transition-transform duration-200"
                    />
                    <span className="absolute bottom-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded shadow-lg opacity-90 group-hover:opacity-100 transition">Photo {idx + 1}</span>
                    <span className="absolute top-2 right-2 bg-white/80 p-1 rounded-full shadow"><ImageIcon className="h-5 w-5 text-primary" /></span>
                  </motion.div>
                ))}
              </div>
              <span className="text-base text-gray-500 mt-4 flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Image Evidence</span>
            </div>
          )}
          {/* Messaging Section (styled like description) */}
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComplaintDetail; 