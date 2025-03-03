
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { ArrowRight, Users, Briefcase, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-50 -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-50 -z-10" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Connecting Elite Talent with Premier Opportunities
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                HACA is an exclusive talent platform connecting top academy graduates with elite recruiters seeking exceptional talent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="gap-2" 
                  onClick={() => navigate('/search')}
                >
                  Find Talent <ArrowRight size={16} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2" 
                  onClick={() => navigate('/register')}
                >
                  Join as Student <Users size={16} />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                Our streamlined platform connects exceptional talents with industry-leading companies
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {/* For Students */}
              <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in hover:translate-y-[-8px]">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">For Students</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Create a detailed profile highlighting your skills</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Get verified by academy administrators</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Become visible to top-tier recruiters</span>
                  </li>
                </ul>
              </div>
              
              {/* For Recruiters */}
              <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in hover:translate-y-[-8px] delay-100">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">For Recruiters</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Access top academy graduates without registration</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Search using natural language queries</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Connect directly with your perfect candidates</span>
                  </li>
                </ul>
              </div>
              
              {/* For Admins */}
              <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in hover:translate-y-[-8px] delay-200">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">For Admins</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Verify student profiles to ensure quality</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Maintain the platform's exclusivity and standards</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Ensure only qualified candidates are featured</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-20 -z-10" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
              <p className="text-muted-foreground mb-8">
                Whether you're a talented graduate or a recruiter seeking excellence, HACA connects you with opportunities that matter.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="gap-2" 
                  onClick={() => navigate('/search')}
                >
                  Find Talent Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2" 
                  onClick={() => navigate('/register')}
                >
                  Join as Student
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">HACA</span>
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Talent</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Connecting elite talent with premier opportunities</p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HACA Talent. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
