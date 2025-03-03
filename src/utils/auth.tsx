
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authenticateUser, User, UserRole, Student } from './mockData';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  role: UserRole | null;
  studentProfile: Student | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  role: null,
  studentProfile: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage (for persistence)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const user = authenticateUser(username, password);
      
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    role: user?.role || null,
    studentProfile: user?.student || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

// Higher-order component for protected routes
export function withAuth(Component: React.ComponentType, allowedRoles?: UserRole[]) {
  return (props: any) => {
    const { isAuthenticated, loading, role } = useAuth();
    
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }
    
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page.
          </p>
          <a href="/" className="text-primary hover:underline">
            Return to Home
          </a>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}
