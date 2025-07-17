import {
  Bell, Home, LineChart, Package2, Settings, ShoppingCart, Users, LogOut, AlertCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"

const navItems = [
  { to: "/admin", label: "Dashboard", icon: Home },
  { to: "/admin/providers", label: "Providers", icon: Users, badge: 6 },
  { to: "/admin/bookings", label: "Bookings", icon: ShoppingCart },
  { to: "/admin/complaints", label: "Complaints", icon: AlertCircle, badge: 3 },
  { to: "/admin/analytics", label: "Analytics", icon: LineChart },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getPageTitle = () => {
    const currentNavItem = navItems.find(item => item.to === location.pathname);
    return currentNavItem ? currentNavItem.label : 'Dashboard';
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NavLink to="/admin" className="flex items-center gap-2 font-semibold text-primary">
              <Package2 className="h-6 w-6" />
              <span>LankaTrails Admin</span>
            </NavLink>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map(({ to, label, icon: Icon, badge }) => (
                <NavLink
                  key={label}
                  to={to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground'}`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {badge && <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{badge}</Badge>}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">{getPageTitle()}</h1>
          </div>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8"><Bell className="h-4 w-4" /></Button>
          <Button variant="secondary" size="icon" className="rounded-full"><Settings className="h-5 w-5" /></Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => navigate('/login')}><LogOut className="h-5 w-5" /></Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout;
