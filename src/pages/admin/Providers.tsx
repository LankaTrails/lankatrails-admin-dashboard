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
import { getAllProviders, ProviderBasicInfo } from '@/services/providerService';


const Providers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilters, setStatusFilters] = useState({ ACTIVE: true, PENDING: true, DISABLED: true });
    const [allProviders, setAllProviders] = useState<ProviderBasicInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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

    useEffect(() => {
        loadProviders();
    }, []);

    const loadProviders = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const providers = await getAllProviders();
            setAllProviders(providers);
        } catch (error: any) {
            setError(error.userMessage || error.message || 'Failed to load providers');
        } finally {
            setIsLoading(false);
        }
    };

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
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-primary-50/20 to-white">
                <CardHeader className="border-b border-primary-100 bg-gradient-to-r from-primary-50/50 to-transparent">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                        <div className="w-1 h-8 bg-gradient-primary rounded-full"></div>
                        Provider Management
                    </CardTitle>
                    <CardDescription>View, manage, and approve provider accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary-500" />
                            <Input
                                type="search"
                                placeholder="Search by name, owner, or service..."
                                className="pl-8 sm:w-[300px] border-primary-200 focus:ring-primary-500 focus:border-primary-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-1 border-primary-200 hover:bg-primary-50 hover:text-primary-700">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked={statusFilters.ACTIVE} onCheckedChange={() => handleStatusChange('ACTIVE')}>Active</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.PENDING} onCheckedChange={() => handleStatusChange('PENDING')}>Pending</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.DISABLED} onCheckedChange={() => handleStatusChange('DISABLED')}>Disabled</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-3 text-gray-600">Loading providers...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button onClick={loadProviders}>Retry</Button>
                        </div>
                    ) : (
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Provider</TableHead>
                                    <TableHead className="hidden md:table-cell">Business Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden lg:table-cell">Location</TableHead>
                                    <TableHead className="hidden lg:table-cell">Registration No.</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProviders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No providers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProviders.map((provider) => (
                                    <motion.tr key={provider.email} variants={itemVariants} className="hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <div className="font-medium">{provider.businessName}</div>
                                            <div className="text-sm text-muted-foreground">{provider.email}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{provider.businessType}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={provider.status === 'ACTIVE' ? 'default' : provider.status === 'PENDING' ? 'secondary' : 'destructive'} 
                                                className={`capitalize ${provider.status === 'ACTIVE' ? 'bg-success-500 hover:bg-success-600 border-0 text-white' : provider.status === 'PENDING' ? 'bg-warning-500 text-white hover:bg-warning-600 border-0' : 'bg-destructive-500 hover:bg-destructive-600 border-0'}`}
                                            >
                                                {provider.status === 'ACTIVE' ? 'active' : provider.status === 'PENDING' ? 'pending' : 'disabled'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">{provider.city || 'N/A'}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{provider.businessRegistrationNumber}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="h-8 w-8 hover:bg-info-100 hover:text-info-600 border-info-200" 
                                                    onClick={() => {
                                                        console.log('=== NAVIGATION CLICK ===');
                                                        console.log('Provider data being passed:', provider);
                                                        console.log('Provider keys:', Object.keys(provider));
                                                        console.log('Provider.providerId:', provider.providerId);
                                                        console.log('Provider.email:', provider.email);
                                                        console.log('========================');
                                                        
                                                        // Navigate to frontend-only provider view page
                                                        navigate('/admin/providers/view', { 
                                                            state: { provider } 
                                                        });
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))
                                )}
                            </TableBody>
                        </Table>
                    </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Providers;