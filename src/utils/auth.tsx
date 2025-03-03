
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, Student } from './mockData'; // Keep types for compatibility

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
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // For this example, we're using direct database query instead of auth
      console.log(`Attempting login with username: ${username}`);
      
      // Use maybeSingle instead of single to avoid error when no row is found
      const { data, error } = await supabase
        .from('users')
        .select('*, students(*)')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      if (!data) {
        console.log('No user found with these credentials');
        return false;
      }
      
      console.log('Login successful, user data:', data);
      
      // Transform to our User type for compatibility
      const loggedInUser: User = {
        id: data.id,
        username: data.username,
        password: data.password,
        role: data.role as UserRole,
        student: data.students ? {
          id: data.students.id,
          name: data.students.name,
          batch: data.students.batch,
          school: data.students.school as 'Coding' | 'Marketing' | 'Design',
          skills: data.students.skills,
          yearsOfExperience: data.students.years_of_experience,
          linkedInUrl: data.students.linkedin_url,
          resumeUrl: data.students.resume_url,
          status: data.students.status as 'pending' | 'approved' | 'rejected',
          createdAt: new Date(data.students.created_at)
        } : undefined
      };
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      return true;
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
