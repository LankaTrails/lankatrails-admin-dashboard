import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Bell, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/admin" className="flex items-center space-x-2">
            <img src="/logo.png" alt="LankaTrails" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary-500">LankaTrails Admin</span>
          </Link>

          {/* Right-side controls */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
