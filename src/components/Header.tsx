import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-white via-primary-50/30 to-secondary-50/30 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-primary-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/admin" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="LankaTrails" className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">LankaTrails</span>
              <span className="text-xs text-gray-500 -mt-1">Admin Portal</span>
            </div>
          </Link>

          {/* Right-side controls */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-destructive-200 hover:bg-destructive-50 hover:text-destructive-700 hover:border-destructive-300 transition-all shadow-sm"
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
            className="md:hidden p-2 rounded-lg hover:bg-primary-100 transition-colors text-primary-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
