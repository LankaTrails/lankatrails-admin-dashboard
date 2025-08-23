import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ListFilter, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { findAllComplaints } from '@/services/complaintSection';
import { Complaint } from '@/types/complaints';

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
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleStatusChange = (status: string) => {
        setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
    };

    const filteredComplaints = Array.isArray(complaints) ? complaints
        .filter(c => statusFilters[c.complaintStatus as keyof typeof statusFilters])
        .filter(c =>
            c.complaintId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.touristEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.complaintStatus?.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };
    
    useEffect(() => {
        const fetchAllComplaints = async () => {
            try {
                setIsLoading(true);
                const data = await findAllComplaints();
                console.log("Complaints : ", data);
                setComplaints(data);
                // Handle different response structures
                // if (Array.isArray(data)) {
                //     setComplaints(data);
                // } else if (data && Array.isArray(data)) {
                //     setComplaints(data.complaints);
                // } 
                // else if (data && Array.isArray(data.data)) {
                //     setComplaints(data.data);
                // } else if (data && Array.isArray(data.items)) {
                //     setComplaints(data.items);
                // } else {
                //     console.error('Unexpected API response structure:', data);
                //     setComplaints([]);
                // }
            } catch (error) {
                console.error('Error fetching complaints:', error);
                setComplaints([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllComplaints();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading complaints...</p>
            </div>
        );
    }

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
                                placeholder="Search by ID, email, business, or status..."
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
                        {filteredComplaints.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg">No pending or unattended complaints</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Complaint ID</TableHead>
                                        <TableHead>User Email</TableHead>
                                        <TableHead>Business</TableHead>
                                        <TableHead className="hidden md:table-cell">Status</TableHead>
                                        <TableHead className="hidden lg:table-cell">Business Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredComplaints.map((complaint) => {
                                        const statusInfo = getStatusVariant(complaint.complaintStatus);
                                        return (
                                            <motion.tr key={complaint.complaintId} variants={itemVariants} className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="font-medium">{complaint.complaintId}</TableCell>
                                                <TableCell>{complaint.touristEmail}</TableCell>
                                                <TableCell>{complaint.businessName}</TableCell>
                                                <TableCell className="hidden md:table-cell">{complaint.complaintStatus}</TableCell>
                                                <TableCell className="hidden lg:table-cell">{complaint.businessType}</TableCell>
                                                <TableCell>
                                                    <Badge variant={statusInfo.variant as any} className={`capitalize ${statusInfo.color}`}>
                                                        <statusInfo.icon className="mr-1 h-3 w-3" />
                                                        {complaint.complaintStatus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10" onClick={() => navigate(`/admin/complaints/${complaint.complaintId}`)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </motion.tr>
                                        );
                                    })} 
                                </TableBody>
                            </Table>
                        )}
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Complaints;