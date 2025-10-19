import { useEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from './pages/Admin';
import AdminDashboard from './pages/admin/Dashboard';
import Providers from './pages/admin/Providers';
import Bookings from './pages/admin/Bookings';
import Analytics from './pages/admin/Analytics';
import Complaints from './pages/admin/Complaints';
import ComplaintDetail from './pages/admin/ComplaintDetail';
import ProviderDetail from './pages/admin/ProviderDetail';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderOnboarding from './pages/ProviderOnboarding';
import ProtectedRoute from "./components/ProtectedRoutes";

const AppRoutes = () =>{
    const {isLoading, restoreSession} =useAuth();
    const [initialized, setInitialized] = useState(false);
    
    useEffect(() => {
    if (!initialized) {
      restoreSession().finally(() => setInitialized(true));
    }
    }, [initialized, restoreSession]);

    if (!initialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
    }

    return (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
          
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="providers" element={<Providers />} />
            <Route path="providers/:name" element={<ProviderDetail />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="complaints/:id" element={<ComplaintDetail />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          <Route 
            path="/provider/dashboard" 
            element={
              <ProtectedRoute>
                <ProviderDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/provider/onboarding" 
            element={
              <ProtectedRoute>
                <ProviderOnboarding />
              </ProtectedRoute>
            } 
          />
        </Routes> 
    );
};

export default AppRoutes;