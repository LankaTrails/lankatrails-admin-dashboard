import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { navItems } from "@/lib/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100 bg-gradient-to-r from-white via-primary-50/30 to-secondary-50/30 shadow-md backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/admin" className="group flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-md transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="LankaTrails" className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-xl font-bold text-transparent">LankaTrails</span>
              <span className="-mt-1 text-xs text-gray-500">Admin Portal</span>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            {user && <span className="text-sm text-gray-600">{user.email}</span>}
            <Button
              variant="outline"
              size="icon"
              aria-label="Sign out"
              title="Sign out"
              className="h-10 w-10 rounded-xl border-destructive-200 shadow-sm transition-all hover:border-destructive-300 hover:bg-destructive-50 hover:text-destructive-700"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="rounded-lg p-2 text-primary-700 transition-colors hover:bg-primary-100 md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="mt-3 grid gap-1 border-t border-primary-100 pt-3 md:hidden">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-gradient-primary text-white" : "text-gray-700 hover:bg-primary-100/50"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive-700 hover:bg-destructive-50"
            >
              <LogOut className="h-5 w-5" /> Sign out
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
