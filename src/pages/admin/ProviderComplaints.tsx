import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Search, ListFilter, BarChart3, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { allComplaints } from './Complaints';

// Interface for provider complaint statistics
interface ProviderComplaintStats {
  providerName: string;
  totalComplaints: number;
  openComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  complaintRate: number; // complaints per month
  lastComplaintDate: string;
  serviceType: string;
  location: string;
}

const ProviderComplaints = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'total' | 'rate' | 'recent'>('total');
  const [removedProviders, setRemovedProviders] = useState<string[]>([]);
  const navigate = useNavigate();

  // Calculate complaint statistics for each provider
  const calculateProviderStats = (): ProviderComplaintStats[] => {
    const providerMap = new Map<string, ProviderComplaintStats>();

    // Initialize all providers from the complaints data
    allComplaints.forEach(complaint => {
      const providerName = complaint.against;
      
      if (!providerMap.has(providerName)) {
        providerMap.set(providerName, {
          providerName,
          totalComplaints: 0,
          openComplaints: 0,
          inProgressComplaints: 0,
          resolvedComplaints: 0,
          complaintRate: 0,
          lastComplaintDate: '',
          serviceType: 'Unknown',
          location: 'Unknown'
        });
      }

      const stats = providerMap.get(providerName)!;
      stats.totalComplaints++;
      
      // Count by status
      switch (complaint.status) {
        case 'Open':
          stats.openComplaints++;
          break;
        case 'In Progress':
          stats.inProgressComplaints++;
          break;
        case 'Resolved':
          stats.resolvedComplaints++;
          break;
      }

      // Track latest complaint date
      if (!stats.lastComplaintDate || complaint.date > stats.lastComplaintDate) {
        stats.lastComplaintDate = complaint.date;
      }
    });

    // Calculate complaint rates (assuming 6 months of data)
    const monthsOfData = 6;
    providerMap.forEach(stats => {
      stats.complaintRate = stats.totalComplaints / monthsOfData;
    });

    // Add service types and locations (mocked data based on provider names)
    const serviceTypeMap: { [key: string]: string } = {
      'Ella Spice Garden': 'Activities',
      'Kandy View Hotel': 'Accommodation',
      'Galle Fort Tours': 'Tour Guide',
      'Colombo Cabs': 'Transport Services',
      'Mirissa Beach Restaurant': 'Food & Restaurants',
      'Sigiriya Adventures': 'Activities'
    };

    const locationMap: { [key: string]: string } = {
      'Ella Spice Garden': 'Ella, Uva',
      'Kandy View Hotel': 'Kandy, Central',
      'Galle Fort Tours': 'Galle, Southern',
      'Colombo Cabs': 'Colombo, Western',
      'Mirissa Beach Restaurant': 'Mirissa, Southern',
      'Sigiriya Adventures': 'Sigiriya, Central'
    };

    providerMap.forEach(stats => {
      stats.serviceType = serviceTypeMap[stats.providerName] || 'Unknown';
      stats.location = locationMap[stats.providerName] || 'Unknown';
    });

    return Array.from(providerMap.values());
  };

  const providerStats = calculateProviderStats();

  // Sort providers based on selected criteria
  const sortedProviders = [...providerStats].sort((a, b) => {
    switch (sortBy) {
      case 'total':
        return b.totalComplaints - a.totalComplaints;
      case 'rate':
        return b.complaintRate - a.complaintRate;
      case 'recent':
        return new Date(b.lastComplaintDate).getTime() - new Date(a.lastComplaintDate).getTime();
      default:
        return 0;
    }
  });

  // Filter providers based on search term and removed providers
  const filteredProviders = sortedProviders.filter(provider =>
    !removedProviders.includes(provider.providerName) &&
    (provider.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate summary statistics
  const totalComplaints = providerStats.reduce((sum, p) => sum + p.totalComplaints, 0);
  const avgComplaintRate = providerStats.reduce((sum, p) => sum + p.complaintRate, 0) / providerStats.length;
  const providersWithComplaints = providerStats.filter(p => p.totalComplaints > 0).length;

  const getTrendIcon = (rate: number) => {
    if (rate > avgComplaintRate * 1.5) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (rate < avgComplaintRate * 0.5) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getComplaintSeverity = (rate: number) => {
    if (rate > avgComplaintRate * 1.5) return 'High';
    if (rate > avgComplaintRate) return 'Medium';
    return 'Low';
  };

  const itemVariants = { 
    hidden: { y: 20, opacity: 0 }, 
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } 
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      {/* Complaints Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-red-600">{totalComplaints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Avg. Rate/Month</p>
                <p className="text-2xl font-bold text-blue-600">{avgComplaintRate.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Providers with Issues</p>
                <p className="text-2xl font-bold text-orange-600">{providersWithComplaints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingDown className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold text-green-600">{providerStats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider Complaint Analytics</CardTitle>
          <CardDescription>
            Track and analyze complaints received for each service provider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search providers..."
                className="pl-8 sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem 
                  checked={sortBy === 'total'} 
                  onCheckedChange={() => setSortBy('total')}
                >
                  Total Complaints
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={sortBy === 'rate'} 
                  onCheckedChange={() => setSortBy('rate')}
                >
                  Complaint Rate
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={sortBy === 'recent'} 
                  onCheckedChange={() => setSortBy('recent')}
                >
                  Most Recent
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Total Complaints</TableHead>
                  <TableHead>Status Breakdown</TableHead>
                  <TableHead>Rate/Month</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Complaint</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => {
                  const severity = getComplaintSeverity(provider.complaintRate);
                  const severityColor = severity === 'High' ? 'text-red-600' : severity === 'Medium' ? 'text-orange-600' : 'text-green-600';
                  
                  return (
                    <motion.tr key={provider.providerName} variants={itemVariants} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="font-medium">{provider.providerName}</div>
                        <div className="text-sm text-muted-foreground">{provider.location}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{provider.serviceType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-lg">{provider.totalComplaints}</div>
                        <div className="text-xs text-gray-500">
                          {provider.openComplaints} open, {provider.inProgressComplaints} in progress
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Open</span>
                            <span className="font-medium">{provider.openComplaints}</span>
                          </div>
                          <Progress value={(provider.openComplaints / provider.totalComplaints) * 100} className="h-1" />
                          <div className="flex items-center justify-between text-xs">
                            <span>Resolved</span>
                            <span className="font-medium">{provider.resolvedComplaints}</span>
                          </div>
                          <Progress 
                            value={(provider.resolvedComplaints / provider.totalComplaints) * 100} 
                            className="h-1 bg-green-200" 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(provider.complaintRate)}
                          <span className="font-medium">{provider.complaintRate.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={severity === 'High' ? 'destructive' : severity === 'Medium' ? 'secondary' : 'default'}
                          className={severityColor}
                        >
                          {severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          {provider.lastComplaintDate ? new Date(provider.lastComplaintDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${provider.providerName} as a service provider?`)) {
                              setRemovedProviders(prev => [...prev, provider.providerName]);
                            }
                          }}
                        >
                          Remove Service Provider
                        </Button>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </motion.div>

          {filteredProviders.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No providers found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProviderComplaints; 