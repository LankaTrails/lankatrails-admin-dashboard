import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BadgeCheck, BadgeX, Eye } from "lucide-react";
import { getDashboardAnalytics, DashboardAnalytics } from '@/services/analyticsService';
import { getAllProviders, ProviderBasicInfo } from '@/services/providerService';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

// Format number with commas
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardAnalytics | null>(null);
  const [providers, setProviders] = useState<ProviderBasicInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch providers (always try to show this)
        const providersData = await getAllProviders();
        setProviders(providersData.slice(0, 5));
        console.log('✅ Providers loaded successfully');
      } catch (err: any) {
        console.error('❌ Failed to fetch providers:', err);
        // Continue even if providers fail
      }
      
      try {
        // Fetch analytics (can fail gracefully)
        const analyticsData = await getDashboardAnalytics();
        setDashboardData(analyticsData);
        console.log('✅ Analytics loaded successfully');
      } catch (err: any) {
        console.error('❌ Failed to fetch analytics:', err);
        setError(
          'Analytics data temporarily unavailable. The analytics endpoint is experiencing issues. ' +
          'Provider data is still displayed below.'
        );
      }
      
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Prepare monthly chart data
  const monthlyChartData = dashboardData?.monthlyTrend.map(item => ({
    month: MONTH_NAMES[(item.month as number) - 1],
    bookings: item.bookingCount,
    revenue: item.revenue
  })) || [];

  // Prepare booking status pie chart data
  const bookingStatusData = dashboardData ? Object.entries(dashboardData.bookingStatusDistribution).map(([name, value]) => ({
    name,
    value
  })) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
        <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <>
      {/* Show error alert if analytics failed */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analytics Unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Only show analytics cards if data is available */}
      {dashboardData && (
        <motion.div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-success-50 to-white h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-success opacity-10 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-gray-700">Total Revenue</CardTitle>
                <div className="p-3 rounded-xl bg-gradient-success shadow-md">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold bg-gradient-to-r from-success-600 to-success-500 bg-clip-text text-transparent">{formatCurrency(dashboardData.kpis.totalRevenue)}</div>
                <p className="text-xs text-success-600 font-medium mt-1">Recent: {formatCurrency(dashboardData.recentPerformance.recentRevenue)}</p>
              </CardContent>
            </Card>
          </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-info-50 to-white h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-info opacity-10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Bookings</CardTitle>
              <div className="p-3 rounded-xl bg-gradient-info shadow-md">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-info-600 to-info-500 bg-clip-text text-transparent">{formatNumber(dashboardData.kpis.totalBookings)}</div>
              <p className="text-xs text-info-600 font-medium mt-1">Last 30 days: {formatNumber(dashboardData.recentPerformance.recentBookingsCount)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-purple-50 to-white h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-purple opacity-10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Unique Tourists</CardTitle>
              <div className="p-3 rounded-xl bg-gradient-purple shadow-md">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">{formatNumber(dashboardData.kpis.totalUniqueTourists)}</div>
              <p className="text-xs text-purple-600 font-medium mt-1">Growth: {dashboardData.growthMetrics.touristGrowthRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-orange-50 to-white h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-warm opacity-10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Avg Booking Value</CardTitle>
              <div className="p-3 rounded-xl bg-gradient-warm shadow-md">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">{formatCurrency(dashboardData.kpis.averageBookingValue)}</div>
              <p className="text-xs text-orange-600 font-medium mt-1">Per booking average</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      )}

      {/* Charts section - only show if analytics data is available */}
      {dashboardData && (
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="w-1 h-6 bg-gradient-purple rounded-full"></div>
                Monthly Bookings Trend ({dashboardData.currentYear})
              </CardTitle>
              <CardDescription>Booking volume and revenue by month</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="#6B7280" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#6B7280" />
                  <Tooltip cursor={{fill: 'rgba(139,92,246,0.1)'}} contentStyle={{ borderRadius: '8px', border: '1px solid #DDD6FE' }} />
                  <Legend />
                  <Bar dataKey="bookings" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Pie chart - only show when analytics available */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full bg-gradient-to-br from-white to-accent-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="w-1 h-6 bg-gradient-warm rounded-full"></div>
                Booking Status Distribution
              </CardTitle>
              <CardDescription>Overview of all booking statuses</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bookingStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {bookingStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      )}

      {/* Providers table - always show if available */}
      {providers.length > 0 && (
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-1 h-6 bg-gradient-primary rounded-full"></div>
              Recent Provider Registrations
            </CardTitle>
            <CardDescription>Manage provider accounts and view their status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead className="hidden md:table-cell">Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => (
                  <motion.tr key={provider.email} variants={itemVariants} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="font-medium">{provider.businessName}</div>
                      <div className="text-sm text-muted-foreground hidden md:inline">{provider.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{provider.businessType}</TableCell>
                    <TableCell>
                      <Badge variant={provider.status === 'APPROVED' ? 'default' : provider.status === 'PENDING' ? 'secondary' : 'destructive'} className={`capitalize ${provider.status === 'APPROVED' ? 'bg-success-500 hover:bg-success-600 border-0' : provider.status === 'PENDING' ? 'bg-warning-500 text-white hover:bg-warning-600 border-0' : 'bg-destructive-500 hover:bg-destructive-600 border-0'}`}>{provider.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-info-100 hover:text-info-600 border-info-200"><Eye className="h-4 w-4" /></Button>
                        {provider.status === 'PENDING' && (
                          <>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-success-600 hover:bg-success-100 border-success-200"><BadgeCheck className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-destructive-600 hover:bg-destructive-100 border-destructive-200"><BadgeX className="h-4 w-4" /></Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default Dashboard;
