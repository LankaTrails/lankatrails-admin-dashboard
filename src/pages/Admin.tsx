import Header from "@/components/Header"
import { NavLink, Outlet } from "react-router-dom"
import { navItems } from "@/lib/navigation"

const AdminLayout = () => {

  return (
    <>
      <Header />
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-primary/10 bg-gradient-to-b from-primary-50 via-white to-secondary-50 md:block shadow-lg">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1 pt-6">
            <div className="px-4 mb-6">
              <div className="bg-gradient-primary rounded-xl p-4 shadow-md">
                <h2 className="text-white font-bold text-lg">LankaTrails</h2>
                <p className="text-primary-100 text-sm">Administration</p>
              </div>
            </div>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={label}
                  to={to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-primary text-white shadow-md transform scale-105' 
                        : 'text-gray-700 hover:bg-primary-100/50 hover:text-primary-700'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-gradient-to-br from-gray-50 via-primary-50/20 to-secondary-50/20">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  )
}

export default AdminLayout;
