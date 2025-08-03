import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { 
  Calendar,
  MessageSquare,
  BarChart3,
  Star,
  Plus,
  Eye,
  Edit,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Percent
} from 'lucide-react';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Commission rate (15% website commission)
  const COMMISSION_RATE = 0.15;
  
  // Calculate earnings breakdown
  const totalRevenue = 3450; // LKR
  const commission = totalRevenue * COMMISSION_RATE;
  const providerEarnings = totalRevenue - commission;

  const stats = [
    {
      title: "Total Bookings",
      value: "124",
      change: "+12%",
      icon: <Calendar className="w-5 h-5 text-primary-500" />
    },
    {
      title: "Your Earnings",
      value: `LKR${providerEarnings.toLocaleString()}`,
      change: "+18%",
      icon: <DollarSign className="w-5 h-5 text-green-500" />
    },
    {
      title: "Website Commission",
      value: `LKR${commission.toLocaleString()}`,
      change: "+18%",
      icon: <Percent className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Rating",
      value: "4.8",
      change: "+0.2",
      icon: <Star className="w-5 h-5 text-yellow-500" />
    }
  ];

  const recentBookings = [
    {
      id: 1,
      customer: "John Smith",
      service: "Sigiriya Rock Climb Guide",
      date: "2024-01-15",
      status: "confirmed",
      totalAmount: 85,
      yourEarnings: 72.25,
      commission: 12.75
    },
    {
      id: 2,
      customer: "Emma Wilson",
      service: "Cultural Triangle Tour",
      date: "2024-01-18",
      status: "pending",
      totalAmount: 150,
      yourEarnings: 127.50,
      commission: 22.50
    },
    {
      id: 3,
      customer: "David Chen",
      service: "Wildlife Safari - Yala",
      date: "2024-01-20",
      status: "completed",
      totalAmount: 120,
      yourEarnings: 102.00,
      commission: 18.00
    }
  ];

  const services = [
    {
      id: 1,
      title: "Sigiriya Rock Climb Guide",
      type: "Tour Guide",
      price: "Rs.85/day",
      bookings: "12 this month",
      rating: 4.9,
      status: "active"
    },
    {
      id: 2,
      title: "Cultural Triangle Tour",
      type: "Tour Package",
      price: "Rs.150/person",
      bookings: "8 this month",
      rating: 4.7,
      status: "active"
    },
    {
      id: 3,
      title: "Wildlife Safari - Yala",
      type: "Activity",
      price: "Rs.120/person",
      bookings: "15 this month",
      rating: 4.8,
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">Manage your services and connect with travelers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Earnings Summary Card */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>This Month's Earnings Summary</span>
                </CardTitle>
                <CardDescription>Breakdown of your earnings and website commission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-gray-900">LKR{totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">LKR{providerEarnings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Your Earnings (85%)</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">LKR{commission.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Website Commission (15%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Bookings</CardTitle>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{booking.customer}</h4>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <p className="text-sm text-gray-500">{booking.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'outline'}>
                            {booking.status}
                          </Badge>
                          <div className="text-sm mt-1">
                            <p className="font-medium text-green-600">LKR{booking.yourEarnings}</p>
                            <p className="text-xs text-gray-500">Total: LKR{booking.totalAmount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 bg-primary-500 hover:bg-primary-600 text-white flex flex-col items-center justify-center space-y-2">
                      <Plus className="w-6 h-6" />
                      <span>Add Service</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Calendar className="w-6 h-6" />
                      <span>Update Calendar</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <MessageSquare className="w-6 h-6" />
                      <span>Messages</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <BarChart3 className="w-6 h-6" />
                      <span>View Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Services</h2>
              <Button className="bg-primary-500 hover:bg-primary-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{service.type}</Badge>
                      <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                        {service.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold text-primary-500">{service.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Bookings:</span>
                        <span className="font-medium">{service.bookings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium ml-1">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs placeholder */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>Manage all your bookings and reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.customer}</h4>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{booking.date}</span>
                          </div>
                        </div>
                      </div>
                                              <div className="text-right space-y-2">
                          <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'outline'}>
                            {booking.status}
                          </Badge>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-green-600">LKR{booking.yourEarnings}</p>
                            <p className="text-sm text-gray-500">Total: LKR{booking.totalAmount}</p>
                          </div>
                        <div className="space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline">Decline</Button>
                              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Availability Calendar</CardTitle>
                <CardDescription>Manage your availability and schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-primary-500" />
                    <p className="text-lg font-medium">Calendar View</p>
                    <p className="text-sm">Manage your availability and bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Chat with customers and manage inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">No messages yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Earnings Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Breakdown</CardTitle>
                  <CardDescription>Detailed view of your earnings and commission</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">LKR{totalRevenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-green-50">
                      <div className="text-2xl font-bold text-green-600">LKR{providerEarnings.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Your Earnings (85%)</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold text-blue-600">LKR{commission.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Website Commission (15%)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Commission Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Commission Structure</CardTitle>
                  <CardDescription>How your earnings are calculated</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Your Earnings</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">85%</div>
                        <div className="text-sm text-gray-600">LKR{providerEarnings.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Percent className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Website Commission</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">15%</div>
                        <div className="text-sm text-gray-600">LKR{commission.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Total Revenue</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">100%</div>
                        <div className="text-sm text-gray-600">LKR{totalRevenue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings Trend</CardTitle>
                  <CardDescription>Your earnings over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary-500" />
                      <p className="text-lg font-medium">Earnings Chart</p>
                      <p className="text-sm">Monthly breakdown of your earnings vs commission</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderDashboard;
