
import { useAuth, withAuth } from '@/utils/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { FileText, Linkedin, AlertCircle, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const StudentProfile = () => {
  const { studentProfile } = useAuth();
  
  if (!studentProfile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Profile not found</AlertTitle>
                <AlertDescription>
                  We couldn't find your student profile. If you're a student, please contact support.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  const renderStatusBadge = () => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    
    return (
      <Badge variant="secondary" className={`${statusColors[studentProfile.status]} border-0 capitalize px-3 py-1`}>
        {studentProfile.status}
      </Badge>
    );
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="page-header">
            <h1 className="page-title flex items-center gap-3">
              My Profile
              {renderStatusBadge()}
            </h1>
            {studentProfile.status === 'pending' && (
              <p className="page-description">
                Your profile is pending admin approval. You'll be visible to recruiters once approved.
              </p>
            )}
          </div>
          
          <Card className="shadow-sm overflow-hidden animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{studentProfile.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="font-medium">
                      {studentProfile.batch}
                    </Badge>
                    <Badge variant="secondary">
                      {studentProfile.school}
                    </Badge>
                    <Badge variant="outline">
                      {studentProfile.yearsOfExperience} {studentProfile.yearsOfExperience === 1 ? 'year' : 'years'} experience
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {studentProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="font-normal">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Profile Links</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1.5" 
                      asChild
                    >
                      <a href={studentProfile.linkedInUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin size={16} /> LinkedIn Profile
                      </a>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1.5" 
                      asChild
                    >
                      <a href={studentProfile.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <FileText size={16} /> Resume
                      </a>
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Profile Status</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    {studentProfile.status === 'pending' && (
                      <div className="flex items-center">
                        <div className="bg-yellow-100 p-2 rounded-full mr-4">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">Pending Approval</p>
                          <p className="text-sm text-muted-foreground">
                            Your profile is being reviewed by administrators. This process can take up to 48 hours.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {studentProfile.status === 'approved' && (
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-4">
                          <AlertCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Approved</p>
                          <p className="text-sm text-muted-foreground">
                            Your profile is approved and visible to recruiters. You may be contacted for opportunities.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {studentProfile.status === 'rejected' && (
                      <div className="flex items-center">
                        <div className="bg-red-100 p-2 rounded-full mr-4">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Rejected</p>
                          <p className="text-sm text-muted-foreground">
                            Your profile needs revisions. Please contact administrators for more information.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/30 py-4 px-6 border-t">
              <p className="text-sm text-muted-foreground">
                Registered on {studentProfile.createdAt.toLocaleDateString()}
              </p>
            </CardFooter>
          </Card>
          
          {studentProfile.status === 'approved' && (
            <div className="mt-6 bg-white p-6 rounded-xl border shadow-sm animate-slide-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Recruiter View</h2>
                  <p className="text-sm text-muted-foreground">
                    This is how recruiters see your profile in search results
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/search" className="flex items-center gap-1">
                    View Search Page <ChevronRight size={16} />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Protect the route for students only
export default withAuth(StudentProfile, ['student']);
