
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated) {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'student') {
      navigate('/profile');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(`Submitting login with: ${username} / ${password}`);
      const success = await login(username, password);

      if (success) {
        toast({
          title: 'Login successful',
          description: 'Welcome back to HACA Talent!',
        });
        
        // Redirect based on user role
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid username or password. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Card className="shadow-md animate-fade-in bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                  Sign in to access your HACA Talent account
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-center text-muted-foreground">
                  <span>Don't have an account? </span>
                  <Link to="/register" className="text-primary hover:underline">
                    Register as a student
                  </Link>
                </div>
                
                <div className="text-sm text-center text-muted-foreground">
                  <span>Looking to hire? </span>
                  <Link to="/search" className="text-primary hover:underline">
                    Browse talent without logging in
                  </Link>
                </div>
                
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <p className="text-center font-medium mb-1">Admin Credentials</p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>Username: <span className="font-mono">admin</span></div>
                    <div>Password: <span className="font-mono">admin@1234</span></div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
