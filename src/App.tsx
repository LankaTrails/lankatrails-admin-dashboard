import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import AdminLayout from './pages/Admin';
import AdminDashboard from './pages/admin/Dashboard';
import Providers from './pages/admin/Providers';
import Bookings from './pages/admin/Bookings';
import Analytics from './pages/admin/Analytics';
import Complaints from './pages/admin/Complaints';
import ComplaintDetail from './pages/admin/ComplaintDetail';
import ProviderDetail from './pages/admin/ProviderDetail';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />


          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="providers" element={<Providers />} />
            <Route path="providers/:name" element={<ProviderDetail />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="complaints/:id" element={<ComplaintDetail />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;