import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import AdminLayout from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoutes";

// Pages are split into their own chunks (charts in particular are heavy).
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Providers = lazy(() => import("./pages/admin/Providers"));
const ProviderView = lazy(() => import("./pages/admin/ProviderView"));
const Bookings = lazy(() => import("./pages/admin/Bookings"));
const Complaints = lazy(() => import("./pages/admin/Complaints"));
const ComplaintDetail = lazy(() => import("./pages/admin/ComplaintDetail"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));

const FullPageLoader = () => (
  <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
    <Loader2 className="h-6 w-6 animate-spin" /> Loading...
  </div>
);

const AppRoutes = () => {
  const { isAdmin, restoreSession } = useAuth();
  const [sessionChecked, setSessionChecked] = useState(false);

  // Resume an existing session (refresh cookie) before deciding where to route.
  useEffect(() => {
    restoreSession().finally(() => setSessionChecked(true));
  }, [restoreSession]);

  if (!sessionChecked) {
    return <FullPageLoader />;
  }

  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to={isAdmin ? "/admin" : "/login"} replace />} />
        <Route path="/login" element={isAdmin ? <Navigate to="/admin" replace /> : <Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="providers" element={<Providers />} />
          <Route path="providers/:providerId" element={<ProviderView />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="complaints/:id" element={<ComplaintDetail />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
