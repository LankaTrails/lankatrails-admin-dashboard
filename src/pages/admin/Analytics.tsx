import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, Activity, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { getAnalyticsStats, getProvidersByLocation, getProvidersByCategory, getRevenueData } from '@/services/analyticsService';
import { Alert, AlertDescription } from '@/components/ui/alert';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

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

  return (
    <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs ${kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>{kpi.change} vs last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div className="grid gap-6 lg:grid-cols-2" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip cursor={{fill: 'rgba(100,100,100,0.1)'}} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Providers by Business Type</CardTitle>
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
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="category" fontSize={12} tickLine={false} axisLine={false} width={100} />
                    <Tooltip cursor={{fill: 'rgba(100,100,100,0.1)'}} />
                    <Bar dataKey="bookings" fill="#0088FE" radius={[0, 4, 4, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Provider Geographic Distribution</CardTitle>
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
