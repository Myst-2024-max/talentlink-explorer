
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, role, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll position for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm' 
      : 'py-5 bg-transparent'
  }`;

  const getNavLinks = () => {
    const links = [
      { text: 'Home', path: '/', show: true },
      { text: 'Search Candidates', path: '/search', show: true },
      { text: 'Admin Dashboard', path: '/admin', show: isAuthenticated && role === 'admin' },
      { text: 'My Profile', path: '/profile', show: isAuthenticated && role === 'student' },
    ];

    return links.filter(link => link.show);
  };

  const navLinks = getNavLinks();

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">HACA</span>
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Talent</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {link.text}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={logout}
                className="ml-2"
              >
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Button asChild variant="ghost">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild variant="default">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-in">
          <div className="px-4 pt-2 pb-4 space-y-1 bg-white/90 backdrop-blur-md shadow-sm border-t">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {link.text}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={logout}
                className="w-full justify-start text-base font-medium px-4 py-3 h-auto"
              >
                Sign Out
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild variant="default" className="w-full">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
