import {
  ShoppingCart,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BadgeCheck, BadgeX, Eye } from "lucide-react";

const providers = [
  { name: "Ella Spice Garden", owner: "Nimal Perera", service: "Activities & Experiences", location: "Ella, Uva", status: "Approved", date: "2023-06-23" },
  { name: "Kandy View Hotel", owner: "Sunil Jayasuriya", service: "Accommodation", location: "Kandy, Central", status: "Pending", date: "2023-06-24" },
  { name: "Galle Fort Tours", owner: "Anura Bandara", service: "Tour Guide", location: "Galle, Southern", status: "Approved", date: "2023-06-25" },
  { name: "Colombo Cabs", owner: "Saman Kumara", service: "Transport Services", location: "Colombo, Western", status: "Rejected", date: "2023-06-26" },
  { name: "Mirissa Beach Restaurant", owner: "Kamal Silva", service: "Food & Restaurants", location: "Mirissa, Southern", status: "Pending", date: "2023-06-27" },
  { name: "Sigiriya Adventures", owner: "Kamala Devi", service: "Activities & Experiences", location: "Sigiriya, Central", status: "Approved", date: "2023-06-28" },
];

const monthlySignups = [
  { month: 'Jan', signups: 4 }, { month: 'Feb', signups: 3 }, { month: 'Mar', signups: 5 },
  { month: 'Apr', signups: 7 }, { month: 'May', signups: 6 }, { month: 'Jun', signups: 8 },
];

const providerStatusData = [
  { name: 'Approved', value: providers.filter(p => p.status === 'Approved').length },
  { name: 'Pending', value: providers.filter(p => p.status === 'Pending').length },
  { name: 'Rejected', value: providers.filter(p => p.status === 'Rejected').length },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const Dashboard = () => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <>
      <motion.div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-success-50 to-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-success opacity-10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Revenue</CardTitle>
              <div className="p-3 rounded-xl bg-gradient-success shadow-md">
                <span className="text-white font-bold text-lg">$</span>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-success-600 to-success-500 bg-clip-text text-transparent">$45,231.89</div>
              <p className="text-xs text-success-600 font-medium mt-1">↑ +20.1% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-info-50 to-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-info opacity-10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">New Bookings</CardTitle>
              <div className="p-3 rounded-xl bg-gradient-info shadow-md">
                <ShoppingCart className="h-5 w-5 text-info-100" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-info-600 to-info-500 bg-clip-text text-transparent">+1,234</div>
              <p className="text-xs text-info-600 font-medium mt-1">↑ +19% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full bg-gradient-to-br from-white to-secondary-50/30">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-purple rounded-full"></div>
                Monthly Signups
              </CardTitle>
            </CardHeader>
            <CardContent className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySignups} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="#6B7280" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#6B7280" />
                  <Tooltip cursor={{fill: 'rgba(139,92,246,0.1)'}} contentStyle={{ borderRadius: '8px', border: '1px solid #DDD6FE' }} />
                  <Bar dataKey="signups" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full bg-white">
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
                  {providers.slice(0, 5).map((provider) => (
                    <motion.tr key={provider.name} variants={itemVariants} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-muted-foreground hidden md:inline">{provider.owner}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{provider.service}</TableCell>
                      <TableCell>
                        <Badge variant={provider.status === 'Approved' ? 'default' : provider.status === 'Pending' ? 'secondary' : 'destructive'} className={`capitalize ${provider.status === 'Approved' ? 'bg-success-500 hover:bg-success-600 border-0' : provider.status === 'Pending' ? 'bg-warning-500 text-white hover:bg-warning-600 border-0' : 'bg-destructive-500 hover:bg-destructive-600 border-0'}`}>{provider.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-info-100 hover:text-info-600 border-info-200"><Eye className="h-4 w-4" /></Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-success-600 hover:bg-success-100 border-success-200"><BadgeCheck className="h-4 w-4" /></Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive-600 hover:bg-destructive-100 border-destructive-200"><BadgeX className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full bg-gradient-to-br from-white to-accent-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="w-1 h-6 bg-gradient-warm rounded-full"></div>
                Provider Status Overview
              </CardTitle>
              <CardDescription>Distribution of provider account statuses.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={providerStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {providerStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  )
}

export default Dashboard;
