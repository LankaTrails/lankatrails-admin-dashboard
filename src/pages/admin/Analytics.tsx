import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, Users, ShoppingCart, Activity, Download, FileText, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';

// Mock data for analytics
const revenueData = [
  { month: 'Jan', revenue: 4000 }, { month: 'Feb', revenue: 3000 }, { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 }, { month: 'May', revenue: 6000 }, { month: 'Jun', revenue: 5500 },
  { month: 'Jul', revenue: 7000 }, { month: 'Aug', revenue: 6500 },
];

const bookingsByCategoryData = [
  { category: 'Accommodation', bookings: 120 },
  { category: 'Activities', bookings: 250 },
  { category: 'Tours', bookings: 180 },
  { category: 'Transport', bookings: 90 },
  { category: 'Food', bookings: 150 },
];

const providerLocationData = [
  { name: 'Western', value: 40 },
  { name: 'Central', value: 25 },
  { name: 'Southern', value: 30 },
  { name: 'Uva', value: 15 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// Provider earnings data (imported from Providers page structure)
const providerEarningsData = [
  { 
    name: "Ella Spice Garden", 
    owner: "Nimal Perera", 
    service: "Activities", 
    location: "Ella, Uva", 
    status: "Approved", 
    totalEarnings: 12500,
    commission: 1875,
    providerEarnings: 10625,
    commissionRate: 15
  },
  { 
    name: "Galle Fort Tours", 
    owner: "Anura Bandara", 
    service: "Tour Guide", 
    location: "Galle, Southern", 
    status: "Approved", 
    totalEarnings: 8900,
    commission: 1335,
    providerEarnings: 7565,
    commissionRate: 15
  },
  { 
    name: "Sigiriya Adventures", 
    owner: "Kamala Devi", 
    service: "Activities", 
    location: "Sigiriya, Central", 
    status: "Approved", 
    totalEarnings: 15600,
    commission: 2340,
    providerEarnings: 13260,
    commissionRate: 15
  },
  { 
    name: "Nuwara Eliya Grand Hotel", 
    owner: "Priya Kumar", 
    service: "Accommodation", 
    location: "Nuwara Eliya, Central", 
    status: "Approved", 
    totalEarnings: 21000,
    commission: 3150,
    providerEarnings: 17850,
    commissionRate: 15
  },
  { 
    name: "Colombo Beach Resort", 
    owner: "Samantha Fernando", 
    service: "Accommodation", 
    location: "Colombo, Western", 
    status: "Approved", 
    totalEarnings: 18750,
    commission: 2812.50,
    providerEarnings: 15937.50,
    commissionRate: 15
  },
  { 
    name: "Hikkaduwa Surf School", 
    owner: "Ravi Mendis", 
    service: "Activities", 
    location: "Hikkaduwa, Southern", 
    status: "Approved", 
    totalEarnings: 9800,
    commission: 1470,
    providerEarnings: 8330,
    commissionRate: 15
  }
];

// Commission breakdown by service category
const commissionByServiceData = [
  { service: 'Accommodation', totalCommission: 5962.50, providerCount: 2, avgCommission: 2981.25 },
  { service: 'Activities', totalCommission: 5685, providerCount: 3, avgCommission: 1895 },
  { service: 'Tour Guide', totalCommission: 1335, providerCount: 1, avgCommission: 1335 },
  { service: 'Transport Services', totalCommission: 0, providerCount: 0, avgCommission: 0 },
  { service: 'Food & Restaurants', totalCommission: 0, providerCount: 0, avgCommission: 0 }
];

const kpiData = [
  { title: "Commission Earnings", value: "LKR18,847", icon: DollarSign, change: "+15.2%", changeType: "increase" },
  { title: "Total Bookings", value: "8,450", icon: ShoppingCart, change: "+12.1%", changeType: "increase" },
  { title: "Active Providers", value: "1,250", icon: Users, change: "+5.8%", changeType: "increase" },
  { title: "Conversion Rate", value: "4.8%", icon: Activity, change: "-0.5%", changeType: "decrease" },
];

const Analytics = () => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  // Enhanced report data with additional details
  const generateReportData = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return {
      reportTitle: "LankaTrails Analytics Report",
      generatedDate: currentDate,
      reportPeriod: "January 2023 - August 2023",
      
      // Executive Summary
      executiveSummary: {
        totalRevenue: "LKR 41,500",
        totalBookings: "8,450",
        activeProviders: "1,250",
        conversionRate: "4.8%",
        growthRate: "+15.2%"
      },
      
      // KPI Details
      kpiDetails: kpiData.map(kpi => ({
        metric: kpi.title,
        value: kpi.value,
        change: kpi.change,
        trend: kpi.changeType
      })),
      
      // Revenue Breakdown
      revenueBreakdown: revenueData.map(item => ({
        month: item.month,
        revenue: `LKR ${item.revenue.toLocaleString()}`,
        growth: item.revenue > 4000 ? "Above Average" : "Below Average"
      })),
      
      // Booking Analytics
      bookingAnalytics: bookingsByCategoryData.map(item => ({
        category: item.category,
        totalBookings: item.bookings,
        percentage: `${((item.bookings / bookingsByCategoryData.reduce((sum, cat) => sum + cat.bookings, 0)) * 100).toFixed(1)}%`,
        revenue: `LKR ${(item.bookings * 150).toLocaleString()}` // Estimated revenue per booking
      })),
      
      // Geographic Distribution
      geographicDistribution: providerLocationData.map(item => ({
        province: item.name,
        providerCount: item.value,
        percentage: `${((item.value / providerLocationData.reduce((sum, loc) => sum + loc.value, 0)) * 100).toFixed(1)}%`,
        marketPenetration: item.value > 25 ? "High" : item.value > 15 ? "Medium" : "Low"
      })),
      
      // Provider Earnings & Commission Details
      providerEarnings: providerEarningsData.map(provider => ({
        name: provider.name,
        owner: provider.owner,
        service: provider.service,
        location: provider.location,
        totalEarnings: `LKR ${provider.totalEarnings.toLocaleString()}`,
        commission: `LKR ${provider.commission.toLocaleString()}`,
        providerEarnings: `LKR ${provider.providerEarnings.toLocaleString()}`,
        commissionRate: `${provider.commissionRate}%`,
        status: provider.status
      })),
      
      // Commission Summary by Service
      commissionByService: commissionByServiceData.map(service => ({
        service: service.service,
        totalCommission: `LKR ${service.totalCommission.toLocaleString()}`,
        providerCount: service.providerCount,
        avgCommission: `LKR ${service.avgCommission.toLocaleString()}`,
        contribution: `${((service.totalCommission / commissionByServiceData.reduce((sum, s) => sum + s.totalCommission, 0)) * 100).toFixed(1)}%`
      })),
      
      // Financial Summary
      financialSummary: {
        totalProviderEarnings: `LKR ${providerEarningsData.reduce((sum, p) => sum + p.totalEarnings, 0).toLocaleString()}`,
        totalCommissionEarned: `LKR ${providerEarningsData.reduce((sum, p) => sum + p.commission, 0).toLocaleString()}`,
        totalProviderPayouts: `LKR ${providerEarningsData.reduce((sum, p) => sum + p.providerEarnings, 0).toLocaleString()}`,
        averageCommissionRate: "15%",
        activeEarningProviders: providerEarningsData.length,
        topEarningProvider: providerEarningsData.reduce((max, p) => p.totalEarnings > max.totalEarnings ? p : max, providerEarningsData[0]).name
      },
      
      // Performance Insights
      insights: [
        "Commission earnings showed strong growth of 15.2% compared to last month",
        "Activities category leads bookings with 250 reservations (28.9%)",
        "Western province has the highest provider concentration at 40%",
        "Total provider earnings reached LKR 86,550 with LKR 12,982.50 in commissions",
        "Nuwara Eliya Grand Hotel is the top earning provider with LKR 21,000 in total revenue",
        "Accommodation services generate the highest average commission at LKR 2,981.25 per provider",
        "15% commission rate is consistently applied across all active providers",
        "6 active providers are currently generating revenue with approved status"
      ],
      
      // Recommendations
      recommendations: [
        "Focus marketing efforts in Uva and Other provinces to balance geographic distribution",
        "Investigate conversion rate decline and implement optimization strategies",
        "Expand activities and tours categories as they show highest demand",
        "Consider incentive programs for providers in underrepresented areas",
        "Develop strategies to activate pending providers to increase commission revenue",
        "Explore tiered commission structures for high-performing providers",
        "Implement performance bonuses for providers exceeding LKR 15,000 in monthly revenue",
        "Monitor seasonal trends to optimize resource allocation and provider support"
      ]
    };
  };

  const downloadReportAsPDF = () => {
    const reportData = generateReportData();
    const doc = new jsPDF();
    
    // Set up fonts and colors
    const primaryColor: [number, number, number] = [22, 163, 74]; // Green
    const secondaryColor: [number, number, number] = [59, 130, 246]; // Blue
    const textColor: [number, number, number] = [55, 65, 81]; // Gray-700
    
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > doc.internal.pageSize.height - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };
    
    // Title and Header
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text('LankaTrails Analytics Report', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text(`Generated: ${reportData.generatedDate}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Report Period: ${reportData.reportPeriod}`, margin, yPosition);
    yPosition += 20;
    
    // Executive Summary Section
    checkPageBreak(50);
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Executive Summary', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    const summaryItems = [
      `Total Revenue: ${reportData.executiveSummary.totalRevenue}`,
      `Total Bookings: ${reportData.executiveSummary.totalBookings}`,
      `Active Providers: ${reportData.executiveSummary.activeProviders}`,
      `Conversion Rate: ${reportData.executiveSummary.conversionRate}`,
      `Growth Rate: ${reportData.executiveSummary.growthRate}`
    ];
    
    summaryItems.forEach(item => {
      doc.text(`• ${item}`, margin + 5, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
    
    // KPI Details Section
    checkPageBreak(60);
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Key Performance Indicators', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    reportData.kpiDetails.forEach(kpi => {
      doc.text(`• ${kpi.metric}: ${kpi.value} (${kpi.change})`, margin + 5, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
    
    // Monthly Revenue Breakdown
    checkPageBreak(70);
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Monthly Revenue Breakdown', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    reportData.revenueBreakdown.forEach(item => {
      doc.text(`• ${item.month}: ${item.revenue} (${item.growth})`, margin + 5, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
    
    // Booking Analytics by Category
    checkPageBreak(80);
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Booking Analytics by Category', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    reportData.bookingAnalytics.forEach(item => {
      doc.text(`• ${item.category}: ${item.totalBookings} bookings (${item.percentage}) - Est. Revenue: ${item.revenue}`, margin + 5, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
    
    // Geographic Distribution
    checkPageBreak(70);
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Geographic Distribution', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    reportData.geographicDistribution.forEach(item => {
      doc.text(`• ${item.province}: ${item.providerCount} providers (${item.percentage}) - ${item.marketPenetration} penetration`, margin + 5, yPosition);
      yPosition += 7;
    });
    yPosition += 15;
    
    // Financial Summary
    checkPageBreak(70);
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Financial Summary', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    const financialItems = [
      `Total Provider Earnings: ${reportData.financialSummary.totalProviderEarnings}`,
      `Total Commission Earned: ${reportData.financialSummary.totalCommissionEarned}`,
      `Total Provider Payouts: ${reportData.financialSummary.totalProviderPayouts}`,
      `Average Commission Rate: ${reportData.financialSummary.averageCommissionRate}`,
      `Active Earning Providers: ${reportData.financialSummary.activeEarningProviders}`,
      `Top Earning Provider: ${reportData.financialSummary.topEarningProvider}`
    ];
    
    financialItems.forEach(item => {
      doc.text(`• ${item}`, margin + 5, yPosition);
      yPosition += 7;
    });
    yPosition += 15;
    
    // Commission Breakdown by Service
    checkPageBreak(80);
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Commission Breakdown by Service', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    reportData.commissionByService.forEach(service => {
      checkPageBreak(15);
      doc.text(`• ${service.service}: ${service.totalCommission} (${service.contribution})`, margin + 5, yPosition);
      yPosition += 7;
      doc.text(`  Providers: ${service.providerCount} | Avg Commission: ${service.avgCommission}`, margin + 10, yPosition);
      yPosition += 7;
    });
    yPosition += 15;
    
    // Individual Provider Earnings
    checkPageBreak(100);
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Individual Provider Earnings & Commissions', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    reportData.providerEarnings.forEach(provider => {
      checkPageBreak(25);
      doc.setFontSize(11);
      doc.text(`${provider.name} (${provider.service})`, margin + 5, yPosition);
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.text(`Owner: ${provider.owner} | Location: ${provider.location}`, margin + 10, yPosition);
      yPosition += 6;
      doc.text(`Total Earnings: ${provider.totalEarnings} | Commission (${provider.commissionRate}): ${provider.commission}`, margin + 10, yPosition);
      yPosition += 6;
      doc.text(`Provider Payout: ${provider.providerEarnings} | Status: ${provider.status}`, margin + 10, yPosition);
      yPosition += 10;
    });
    yPosition += 10;
    
    // Key Insights
    checkPageBreak(80);
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Key Insights', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    reportData.insights.forEach((insight, index) => {
      checkPageBreak(15);
      const lines = doc.splitTextToSize(`${index + 1}. ${insight}`, contentWidth - 10);
      lines.forEach((line: string) => {
        doc.text(line, margin + 5, yPosition);
        yPosition += 7;
      });
    });
    yPosition += 15;
    
    // Recommendations
    checkPageBreak(80);
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text('Recommendations', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    reportData.recommendations.forEach((rec, index) => {
      checkPageBreak(15);
      const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, contentWidth - 10);
      lines.forEach((line: string) => {
        doc.text(line, margin + 5, yPosition);
        yPosition += 7;
      });
    });
    
    // Footer on last page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, doc.internal.pageSize.height - 10);
      doc.text('LankaTrails Admin Dashboard', margin, doc.internal.pageSize.height - 10);
    }
    
    // Save the PDF
    const fileName = `lankatrails-analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="space-y-6">
      {/* Report Header with Download Options */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Analytics Report
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive insights and performance metrics for LankaTrails platform
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>PDF Report Preview</DialogTitle>
                <DialogDescription>
                  Preview of the comprehensive analytics report that will be generated as PDF
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">📊 LankaTrails Analytics Report</h3>
                  <p className="text-gray-600">Generated: {new Date().toLocaleDateString()}</p>
                  <p className="text-gray-600">Period: January 2023 - August 2023</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-700">📈 Executive Summary</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Total Revenue: LKR 41,500</li>
                      <li>• Total Bookings: 8,450</li>
                      <li>• Active Providers: 1,250</li>
                      <li>• Conversion Rate: 4.8%</li>
                      <li>• Growth Rate: +15.2%</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-700">🎯 Key Performance Indicators</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Commission Earnings: LKR18,847 (+15.2%)</li>
                      <li>• Total Bookings: 8,450 (+12.1%)</li>
                      <li>• Active Providers: 1,250 (+5.8%)</li>
                      <li>• Conversion Rate: 4.8% (-0.5%)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-700">🗓️ Monthly Revenue Breakdown</h4>
                    <ul className="space-y-1 text-gray-700 text-xs">
                      <li>• Jan: LKR 4,000 (Below Average)</li>
                      <li>• Feb: LKR 3,000 (Below Average)</li>
                      <li>• Mar: LKR 5,000 (Above Average)</li>
                      <li>• Apr-Aug: Continued growth trend</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-700">📍 Geographic Distribution</h4>
                    <ul className="space-y-1 text-gray-700 text-xs">
                      <li>• Western: 40 providers (32.3%)</li>
                      <li>• Southern: 30 providers (24.2%)</li>
                      <li>• Central: 25 providers (20.2%)</li>
                      <li>• Uva: 15 providers (12.1%)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-indigo-700">💰 Financial Summary</h4>
                    <ul className="space-y-1 text-gray-700 text-xs">
                      <li>• Total Provider Earnings: LKR 86,550</li>
                      <li>• Total Commissions: LKR 12,982.50</li>
                      <li>• Provider Payouts: LKR 73,567.50</li>
                      <li>• Active Earning Providers: 6</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-teal-700">🏆 Top Earning Providers</h4>
                    <ul className="space-y-1 text-gray-700 text-xs">
                      <li>• Nuwara Eliya Grand Hotel: LKR 21,000</li>
                      <li>• Colombo Beach Resort: LKR 18,750</li>
                      <li>• Sigiriya Adventures: LKR 15,600</li>
                      <li>• Ella Spice Garden: LKR 12,500</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-pink-700">📊 Commission by Service Category</h4>
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <ul className="space-y-1 text-gray-700 text-xs">
                      <li>• Accommodation: LKR 5,962.50 (45.9%) - 2 providers</li>
                      <li>• Activities: LKR 5,685 (43.8%) - 3 providers</li>
                      <li>• Tour Guide: LKR 1,335 (10.3%) - 1 provider</li>
                      <li>• Average commission rate: 15% across all providers</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-700">💡 Key Insights & Recommendations</h4>
                  <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                    <ul className="space-y-1 text-gray-700 text-xs">
                      <li>• Activities category leads with 250 bookings (28.9%)</li>
                      <li>• Strong commission growth of 15.2% vs last month</li>
                      <li>• Total provider earnings: LKR 86,550 with LKR 12,982.50 in commissions</li>
                      <li>• Accommodation providers earn highest average commissions</li>
                      <li>• Opportunity to activate pending providers for increased revenue</li>
                    </ul>
                  </div>
                </div>
                
                <div className="text-center pt-4 border-t">
                  <p className="text-gray-500 text-xs">
                    Complete detailed report available as a professionally formatted PDF with all data, 
                    provider earnings, commission breakdowns, insights, and recommendations included.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={downloadReportAsPDF} 
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF Report
          </Button>
        </div>
      </motion.div>

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
              <CardTitle>Commission Earnings Trend</CardTitle>
              <CardDescription>Monthly commission earnings over the last 8 months.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `LKR${value / 1000}k`} />
                  <Tooltip cursor={{fill: 'rgba(100,100,100,0.1)'}} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Bookings by Category</CardTitle>
              <CardDescription>Distribution of bookings across service categories.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="category" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip cursor={{fill: 'rgba(100,100,100,0.1)'}} />
                  <Bar dataKey="bookings" fill="#0088FE" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Provider Geographic Distribution</CardTitle>
            <CardDescription>Provider concentration by province.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={providerLocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {providerLocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
      </motion.div>
    </div>
  );
};

export default Analytics;
