import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ListFilter, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

// Add Complaint interface
export interface Complaint {
  id: string;
  user: string;
  subject: string;
  against: string;
  date: string;
  status: string;
  bookingId: string;
  bookingDate: string;
  serviceDate: string;
  title: string;
  description: string;
  images: string[];
}

// Update allComplaints to use Complaint[] and update image paths
const allComplaints: Complaint[] = [
  {
    id: "C001",
    user: "John Doe",
    subject: "Rude provider",
    against: "Ella Spice Garden",
    date: "2023-08-15",
    status: "Open",
    bookingId: "BK001",
    bookingDate: "2023-08-10",
    serviceDate: "2023-08-15",
    title: "Rude provider during tour",
    description: "The provider was rude and unprofessional during the spice plantation tour.",
    images: ["/sigiri.jpg", "/kandy.jpg"]
  },
  {
    id: "C002",
    user: "Jane Smith",
    subject: "Overcharged",
    against: "Kandy View Hotel",
    date: "2023-08-20",
    status: "In Progress",
    bookingId: "BK002",
    bookingDate: "2023-08-15",
    serviceDate: "2023-08-20",
    title: "Overcharged for room",
    description: "I was charged extra fees not mentioned during booking.",
    images: ["/login.jpg"]
  },
  {
    id: "C003",
    user: "Peter Jones",
    subject: "Service not delivered",
    against: "Galle Fort Tours",
    date: "2023-08-18",
    status: "Resolved",
    bookingId: "BK003",
    bookingDate: "2023-08-10",
    serviceDate: "2023-08-18",
    title: "Tour was cancelled without notice",
    description: "The tour was cancelled last minute and I was not informed in advance.",
    images: ["/unawatuna.jpg"]
  },
  {
    id: "C004",
    user: "Mary Williams",
    subject: "Unsafe experience",
    against: "Colombo Cabs",
    date: "2023-08-22",
    status: "Open",
    bookingId: "BK004",
    bookingDate: "2023-08-18",
    serviceDate: "2023-08-22",
    title: "Unsafe driving by cab driver",
    description: "The cab driver was speeding and ignored traffic rules.",
    images: ["/logo.png", "/placeholder.svg"]
  },
  {
    id: "C005",
    user: "David Brown",
    subject: "Late arrival",
    against: "Sigiriya Adventures",
    date: "2023-09-01",
    status: "Resolved",
    bookingId: "BK005",
    bookingDate: "2023-08-28",
    serviceDate: "2023-09-01",
    title: "Guide arrived late",
    description: "The guide arrived 45 minutes late for the adventure tour.",
    images: ["/sigup.jpg"]
  },
  {
    id: "C006",
    user: "Susan Davis",
    subject: "Unhygienic food",
    against: "Mirissa Beach Restaurant",
    date: "2023-08-25",
    status: "In Progress",
    bookingId: "BK006",
    bookingDate: "2023-08-20",
    serviceDate: "2023-08-25",
    title: "Food was not hygienic",
    description: "The seafood served was not fresh and caused stomach issues.",
    images: ["/background.png"]
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Resolved': return { variant: 'default', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-600/80' };
    case 'In Progress': return { variant: 'secondary', icon: Clock, color: '' };
    case 'Open': return { variant: 'destructive', icon: XCircle, color: '' };
    default: return { variant: 'outline', icon: Clock, color: '' };
  }
};

const Complaints = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilters, setStatusFilters] = useState({ Open: true, 'In Progress': true, Resolved: true });
    const navigate = useNavigate();

    const handleStatusChange = (status: string) => {
        setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
    };

    const filteredComplaints = allComplaints
        .filter(c => statusFilters[c.status as keyof typeof statusFilters])
        .filter(c =>
            c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.against.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

    return (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <Card>
                <CardHeader>
                    <CardTitle>Complaints Management</CardTitle>
                    <CardDescription>View, track, and manage all user complaints.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by ID, user, subject, or provider..."
                                className="pl-8 sm:w-[300px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked={statusFilters.Open} onCheckedChange={() => handleStatusChange('Open')}>Open</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters['In Progress']} onCheckedChange={() => handleStatusChange('In Progress')}>In Progress</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.Resolved} onCheckedChange={() => handleStatusChange('Resolved')}>Resolved</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Complaint ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="hidden md:table-cell">Against</TableHead>
                                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredComplaints.map((complaint) => {
                                    const statusInfo = getStatusVariant(complaint.status);
                                    return (
                                        <motion.tr key={complaint.id} variants={itemVariants} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium">{complaint.id}</TableCell>
                                            <TableCell>{complaint.user}</TableCell>
                                            <TableCell>{complaint.subject}</TableCell>
                                            <TableCell className="hidden md:table-cell">{complaint.against}</TableCell>
                                            <TableCell className="hidden lg:table-cell">{complaint.date}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusInfo.variant as any} className={`capitalize ${statusInfo.color}`}>
                                                    <statusInfo.icon className="mr-1 h-3 w-3" />
                                                    {complaint.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10" onClick={() => navigate(`/admin/complaints/${complaint.id}`)}><Eye className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </motion.tr>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Complaints;
export { allComplaints }; 