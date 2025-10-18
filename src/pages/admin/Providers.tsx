import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeCheck, BadgeX, Eye, ListFilter, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { LicenseDTO } from '@/types/provider';
import { useToast } from "@/components/ui/use-toast";
import { loadAllLicenses } from '@/services/licenseSection';

const Providers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilters, setStatusFilters] = useState({ 
        PENDING: true,
        RENEWAL: true 
    });
    const [licenses, setLicenses] = useState<LicenseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Load licenses from API
    useEffect(() => {
        const fetchLicenses = async () => {
            try {
                setLoading(true);
                setError(null);
                const licensesData = await loadAllLicenses();
                console.log('Licenses loaded:', licensesData);
                setLicenses(licensesData);
            } catch (error: any) {
                console.error('Error loading licenses:', error);
                setError(error.userMessage || error.message || 'Failed to load licenses');
                
                toast({
                    title: "Error",
                    description: error.userMessage || "Failed to load licenses",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLicenses();
    }, [toast]);

    const handleStatusChange = (status: string) => {
        setStatusFilters(prev => ({ ...prev, [status]: !prev[status as keyof typeof statusFilters] }));
    };

    // Format date for display
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not set';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Get badge variant and style based on status
    const getBadgeConfig = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return {
                    variant: 'default' as const,
                    className: 'bg-green-600 hover:bg-green-600/80',
                    text: 'Approved'
                };
            case 'PENDING':
                return {
                    variant: 'secondary' as const,
                    className: 'bg-yellow-600 hover:bg-yellow-600/80',
                    text: 'Pending'
                };
            case 'REJECTED':
                return {
                    variant: 'destructive' as const,
                    className: 'bg-red-600 hover:bg-red-600/80',
                    text: 'Rejected'
                };
            case 'RENEWAL':
                return {
                    variant: 'default' as const,
                    className: 'bg-blue-600 hover:bg-blue-600/80',
                    text: 'Renewal'
                };
            default:
                return {
                    variant: 'secondary' as const,
                    className: 'bg-gray-600 hover:bg-gray-600/80',
                    text: status
                };
        }
    };

    // Safe search filter that handles null values
    const filteredLicenses = licenses
        .filter(license => statusFilters[license.status as keyof typeof statusFilters])
        .filter(license => {
            if (!searchTerm) return true;
            
            const searchLower = searchTerm.toLowerCase();
            
            // Safely check each field for search term
            const licenseNumberMatch = license.licenseNumber?.toLowerCase().includes(searchLower) || false;
            const businessNameMatch = license.businessName?.toLowerCase().includes(searchLower) || false;
            const categoryNameMatch = license.categoryName?.toLowerCase().includes(searchLower) || false;
            const nestedCategoryMatch = license.category?.categoryName?.toLowerCase().includes(searchLower) || false;
            
            return licenseNumberMatch || businessNameMatch || categoryNameMatch || nestedCategoryMatch;
        });

    const itemVariants = { 
        hidden: { y: 20, opacity: 0 }, 
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } 
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading licenses...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4 text-destructive">
                        <BadgeX className="h-8 w-8" />
                        <p>Error loading licenses: {error}</p>
                        <Button 
                            variant="outline" 
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <Card>
                <CardHeader>
                    <CardTitle>License Management</CardTitle>
                    <CardDescription>
                        View, manage, and approve provider licenses. 
                        {filteredLicenses.length > 0 && ` Showing ${filteredLicenses.length} of ${licenses.length} licenses`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by business name, license number, or category..."
                                className="pl-8 sm:w-[300px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem 
                                    checked={statusFilters.PENDING} 
                                    onCheckedChange={() => handleStatusChange('PENDING')}
                                >
                                    Pending
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem 
                                    checked={statusFilters.RENEWAL} 
                                    onCheckedChange={() => handleStatusChange('RENEWAL')}
                                >
                                    Renewal
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Business Name</TableHead>
                                    <TableHead className="hidden md:table-cell">License Number</TableHead>
                                    <TableHead className="hidden md:table-cell">Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden lg:table-cell">Expiry Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLicenses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {licenses.length === 0 ? 'No licenses found' : 'No licenses matching your filters'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLicenses.map((license, index) => {
                                        const badgeConfig = getBadgeConfig(license.status);
                                        const categoryName = license.categoryName || license.category?.categoryName || 'N/A';
                                        // Use index as fallback key since licenseNumber might be null
                                        const uniqueKey = license.licenseNumber || `license-${index}`;
                                        
                                        return (
                                            <motion.tr 
                                                key={uniqueKey}
                                                variants={itemVariants} 
                                                className="hover:bg-muted/50 transition-colors"
                                            >
                                                <TableCell>
                                                    <div className="font-medium">{license.businessName || 'N/A'}</div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {license.licenseNumber || 'Not assigned'}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {categoryName}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={badgeConfig.variant} 
                                                        className={`capitalize ${badgeConfig.className}`}
                                                    >
                                                        {badgeConfig.text}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {formatDate(license.expiryDate)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon" 
                                                            className="h-8 w-8 hover:bg-primary/10" 
                                                            onClick={() => navigate(`/admin/providers/${uniqueKey}`)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Providers;