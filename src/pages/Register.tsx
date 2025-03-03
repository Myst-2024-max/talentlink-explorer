
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Personal details state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Academic details state
  const [batch, setBatch] = useState('');
  const [school, setSchool] = useState('');
  
  // Experience details state
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [skills, setSkills] = useState('');
  
  // Profile links state
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  
  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const steps = ['Personal Details', 'Academic Details', 'Experience', 'Profile Links'];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create a skills array from the comma-separated string
      const skillsArray = skills.split(',').map(s => s.trim());
      
      // First insert the student
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert([{
          name,
          batch,
          school: school as 'Coding' | 'Marketing' | 'Design',
          skills: skillsArray,
          years_of_experience: parseInt(yearsOfExperience),
          linkedin_url: linkedInUrl,
          resume_url: resumeUrl,
          status: 'pending'
        }])
        .select('id')
        .single();
      
      if (studentError) throw studentError;
      
      // Then create a user account linked to the student
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          username,
          password,
          role: 'student',
          student_id: studentData.id
        }]);
      
      if (userError) throw userError;
      
      toast({
        title: 'Registration successful!',
        description: 'Your profile is now pending approval from an administrator.',
      });
      
      // Navigate to the login page
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: 'An error occurred during registration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Create a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Input
                id="batch"
                type="text"
                placeholder="e.g., C4, M3, D2"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your batch identifier (C for Coding, M for Marketing, D for Design, followed by your batch number)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <Select value={school} onValueChange={setSchool} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coding">Coding</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                max="30"
                placeholder="Enter your years of experience"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                type="text"
                placeholder="e.g., React, AWS, Flutter, SEO"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your skills, separated by commas
              </p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedInUrl">LinkedIn Profile URL</Label>
              <Input
                id="linkedInUrl"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input
                id="resumeUrl"
                type="url"
                placeholder="https://drive.google.com/your-resume"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Please provide a link to your resume (Google Drive, Dropbox, etc.)
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-md animate-fade-in bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Student Registration</CardTitle>
              <CardDescription className="text-center">
                Create your profile to get discovered by top recruiters
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {steps[currentStep]}
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                {renderStepContent()}
                
                <div className="flex justify-between mt-6">
                  {currentStep > 0 ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevStep}
                      disabled={loading}
                    >
                      Previous
                    </Button>
                  ) : (
                    <div />
                  )}
                  
                  {currentStep < steps.length - 1 ? (
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      disabled={loading}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Register'}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <div className="text-sm text-center text-muted-foreground">
                <span>Already have an account? </span>
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Register;
