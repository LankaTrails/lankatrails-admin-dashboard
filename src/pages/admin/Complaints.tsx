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
    case 'RESOLVED': return { variant: 'default', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-600/80' };
    case 'IN_PROGRESS': return { variant: 'secondary', icon: Clock, color: '' };
    case 'PENDING': return { variant: 'destructive', icon: XCircle, color: '' };
    default: return { variant: 'outline', icon: Clock, color: '' };
  }
};

const Complaints = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilters, setStatusFilters] = useState({ 
      PENDING: true, 
      IN_PROGRESS: true
    });
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleStatusChange = (status: string) => {
        setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
    };

    // Filter to show only PENDING and IN_PROGRESS complaints
    const filteredComplaints = Array.isArray(complaints) ? complaints
        .filter(c => c.complaintStatus === 'PENDING' || c.complaintStatus === 'IN_PROGRESS')
        .filter(c => statusFilters[c.complaintStatus as keyof typeof statusFilters])
        .filter(c =>
            c.complaintId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.touristEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.complaintStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.businessType?.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };
    
    useEffect(() => {
        const fetchAllComplaints = async () => {
            try {
                setIsLoading(true);
                const response = await findAllComplaints();
                console.log("Complaints response: ", response);
                setComplaints(response);
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
                                <DropdownMenuCheckboxItem checked={statusFilters.PENDING} onCheckedChange={() => handleStatusChange('PENDING')}>Pending</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.IN_PROGRESS} onCheckedChange={() => handleStatusChange('IN_PROGRESS')}>In Progress</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                        {filteredComplaints.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg">No pending or in-progress complaints</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Complaint ID</TableHead>
                                        <TableHead>User Email</TableHead>
                                        <TableHead>Business</TableHead>
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
                                                <TableCell>{complaint.serviceName}</TableCell>
                                                <TableCell className="hidden lg:table-cell">{complaint.businessType}</TableCell>
                                                <TableCell>
                                                    <Badge variant={statusInfo.variant as any} className={`capitalize ${statusInfo.color}`}>
                                                        <statusInfo.icon className="mr-1 h-3 w-3" />
                                                        {complaint.complaintStatus === 'IN_PROGRESS' ? 'In Progress' : complaint.complaintStatus}
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