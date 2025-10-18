import { Home, LineChart, ShoppingCart, Users, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
 
import { NavLink, Outlet } from "react-router-dom"

const navItems = [
  { to: "/admin", label: "Dashboard", icon: Home },
  { to: "/admin/providers", label: "Providers", icon: Users, badge: 6 },
  { to: "/admin/bookings", label: "Bookings", icon: ShoppingCart },
  { to: "/admin/complaints", label: "Complaints", icon: AlertCircle, badge: 3 },
  { to: "/admin/analytics", label: "Analytics", icon: LineChart },
];

const AdminLayout = () => {

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
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
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout;
