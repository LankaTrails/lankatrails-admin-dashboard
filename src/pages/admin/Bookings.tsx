import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ListFilter, Search, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllBookings, BookingItemDto, BookingStatus as BookingStatusType } from '@/services/bookingService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Status badge configuration
const statusConfig: Record<BookingStatusType, { variant: string; icon: any; color: string; label: string }> = {
  CONFIRMED: { variant: 'default', icon: CheckCircle, color: 'bg-success-500 hover:bg-success-600 border-0 text-white', label: 'Confirmed' },
  PENDING: { variant: 'secondary', icon: Clock, color: 'bg-warning-500 text-white hover:bg-warning-600 border-0', label: 'Pending' },
  CANCELLED: { variant: 'destructive', icon: XCircle, color: 'bg-destructive-500 hover:bg-destructive-600 border-0', label: 'Cancelled' },
  PAYMENT_FAILED: { variant: 'destructive', icon: AlertCircle, color: 'bg-red-500 hover:bg-red-600 border-0 text-white', label: 'Payment Failed' },
  NOT_AVAILABLE: { variant: 'secondary', icon: XCircle, color: 'bg-gray-500 hover:bg-gray-600 border-0 text-white', label: 'Not Available' },
};

// Format date to readable string
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const Bookings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [bookings, setBookings] = useState<BookingItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilters, setStatusFilters] = useState({ 
        CONFIRMED: true, 
        PENDING: true, 
        CANCELLED: true, 
        PAYMENT_FAILED: true, 
        NOT_AVAILABLE: true 
    });

    // Fetch bookings on component mount
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllBookings();
                setBookings(data);
            } catch (err: any) {
                console.error('Failed to fetch bookings:', err);
                setError(err.userMessage || err.message || 'Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleStatusChange = (status: keyof typeof statusFilters) => {
        setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
    };

    const filteredBookings = bookings
        .filter(b => statusFilters[b.status])
        .filter(b =>
            b.tripItemId.toString().includes(searchTerm.toLowerCase()) ||
            b.service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.service.provider.businessName.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

    return (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-info-50/20 to-white">
                <CardHeader className="border-b border-info-100 bg-gradient-to-r from-info-50/50 to-transparent">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                        <div className="w-1 h-8 bg-gradient-info rounded-full"></div>
                        Bookings Management
                    </CardTitle>
                    <CardDescription>View, track, and manage all customer bookings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-info-500" />
                            <Input
                                type="search"
                                placeholder="Search by ID, customer, or provider..."
                                className="pl-8 sm:w-[300px] border-info-200 focus:ring-info-500 focus:border-info-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-1 border-info-200 hover:bg-info-50 hover:text-info-700">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked={statusFilters.CONFIRMED} onCheckedChange={() => handleStatusChange('CONFIRMED')}>Confirmed</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.PENDING} onCheckedChange={() => handleStatusChange('PENDING')}>Pending</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.CANCELLED} onCheckedChange={() => handleStatusChange('CANCELLED')}>Cancelled</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.PAYMENT_FAILED} onCheckedChange={() => handleStatusChange('PAYMENT_FAILED')}>Payment Failed</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-info-500" />
                            <span className="ml-2 text-gray-600">Loading bookings...</span>
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No bookings found matching your criteria.</p>
                        </div>
                    ) : (
                        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Trip Item ID</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead className="hidden md:table-cell">Provider</TableHead>
                                        <TableHead className="hidden lg:table-cell">Start Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.map((booking) => {
                                        const statusInfo = statusConfig[booking.status];
                                        const StatusIcon = statusInfo.icon;
                                        return (
                                            <motion.tr key={booking.tripItemId} variants={itemVariants} className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="font-medium">#{booking.tripItemId}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{booking.service.serviceName}</span>
                                                        <span className="text-xs text-gray-500">{booking.service.Category}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{booking.service.provider.businessName}</TableCell>
                                                <TableCell className="hidden lg:table-cell">{formatDate(booking.startTime)}</TableCell>
                                                <TableCell>
                                                    <Badge className={`capitalize ${statusInfo.color}`}>
                                                        <StatusIcon className="mr-1 h-3 w-3" />
                                                        {statusInfo.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-semibold">{formatCurrency(booking.totalPrice)}</span>
                                                        <span className="text-xs text-gray-500">Paid: {formatCurrency(booking.paidAmount)}</span>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Bookings;
