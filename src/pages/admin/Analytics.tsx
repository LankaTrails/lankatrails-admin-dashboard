import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, Activity, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { getAnalyticsStats, getProvidersByLocation, getProvidersByCategory, getRevenueData } from '@/services/analyticsService';
import { Alert, AlertDescription } from '@/components/ui/alert';

const COLORS = ['#007E6A', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#10B981'];

const Analytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all analytics data in parallel
      const [statsData, revenue, categories, locations] = await Promise.all([
        getAnalyticsStats(),
        getRevenueData(),
        getProvidersByCategory(),
        getProvidersByLocation()
      ]);

      setStats(statsData);
      setRevenueData(revenue);
      setCategoryData(categories);
      // Convert location data to pie chart format
      setLocationData(locations.map(loc => ({ name: loc.location, value: loc.providers })));
    } catch (err: any) {
      setError(err.userMessage || err.message || 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const kpiData = stats ? [
    { title: "Total Providers", value: stats.totalProviders.toString(), icon: Users, change: "", changeType: "neutral" },
    { title: "Pending Approvals", value: stats.pendingApprovals.toString(), icon: Activity, change: "", changeType: "neutral" },
    { title: "Total Tourists", value: stats.totalTourists.toString(), icon: Users, change: "N/A", changeType: "neutral" },
    { title: "Total Bookings", value: stats.totalBookings.toString(), icon: ShoppingCart, change: "N/A", changeType: "neutral" },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  const kpiColors = [
    { gradient: 'from-primary-500 to-primary-600', icon: 'text-primary-100', bg: 'bg-primary-50/50' },
    { gradient: 'from-accent-500 to-accent-600', icon: 'text-accent-100', bg: 'bg-accent-50/50' },
    { gradient: 'from-info-500 to-info-600', icon: 'text-info-100', bg: 'bg-info-50/50' },
    { gradient: 'from-secondary-500 to-secondary-600', icon: 'text-secondary-100', bg: 'bg-secondary-50/50' }
  ];

  return (
    <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className={`hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden relative ${kpiColors[index].bg}`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpiColors[index].gradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-gray-700">{kpi.title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${kpiColors[index].gradient} shadow-md`}>
                  <kpi.icon className={`h-5 w-5 ${kpiColors[index].icon}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{kpi.value}</div>
                <p className="text-xs text-gray-500 mt-1">{kpi.change} vs last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div className="grid gap-6 lg:grid-cols-2" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-success-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="w-1 h-6 bg-gradient-success rounded-full"></div>
                Revenue Trend
              </CardTitle>
              <CardDescription>Monthly revenue over the last 8 months.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {revenueData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Revenue data not available. Backend integration needed.</p>
                  </div>
                ) : (
                  <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="#6B7280" />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `LKR ${value}k`} stroke="#6B7280" />
                    <Tooltip cursor={{fill: 'rgba(16,185,129,0.1)'}} contentStyle={{ borderRadius: '8px', border: '1px solid #D1FAE5' }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 5, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, fill: '#059669' }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-info-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="w-1 h-6 bg-gradient-info rounded-full"></div>
                Providers by Business Type
              </CardTitle>
              <CardDescription>Distribution of providers across business types.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No provider categories found.</p>
                  </div>
                ) : (
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} stroke="#6B7280" />
                    <YAxis type="category" dataKey="category" fontSize={12} tickLine={false} axisLine={false} width={100} stroke="#6B7280" />
                    <Tooltip cursor={{fill: 'rgba(59,130,246,0.1)'}} contentStyle={{ borderRadius: '8px', border: '1px solid #BFDBFE' }} />
                    <Bar dataKey="bookings" fill="#3B82F6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-secondary-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-1 h-6 bg-gradient-purple rounded-full"></div>
              Provider Geographic Distribution
            </CardTitle>
            <CardDescription>Provider concentration by city.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              {locationData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No location data available.</p>
                </div>
              ) : (
                <PieChart>
                  <Pie data={locationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {locationData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
