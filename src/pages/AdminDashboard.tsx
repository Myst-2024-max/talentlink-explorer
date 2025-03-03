
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, withAuth } from '@/utils/auth';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/ProfileCard';
import Navbar from '@/components/Navbar';
import { CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/utils/mockData'; // Keep the type for now

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up real-time subscription to students table
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('students')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data to match our Student type
          const formattedStudents = data.map(student => ({
            id: student.id,
            name: student.name,
            batch: student.batch,
            school: student.school as 'Coding' | 'Marketing' | 'Design',
            skills: student.skills,
            yearsOfExperience: student.years_of_experience,
            linkedInUrl: student.linkedin_url,
            resumeUrl: student.resume_url,
            status: student.status as 'pending' | 'approved' | 'rejected',
            createdAt: new Date(student.created_at)
          }));
          
          setAllStudents(formattedStudents);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: 'Error',
          description: 'Failed to load students data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('public:students')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'students' 
      }, payload => {
        fetchStudents(); // Refresh data when changes occur
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  useEffect(() => {
    // Filter students based on search and tab
    let filtered = allStudents;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(query) || 
        student.batch.toLowerCase().includes(query) ||
        student.school.toLowerCase().includes(query) ||
        student.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(student => student.status === activeTab);
    }
    
    setFilteredStudents(filtered);
  }, [searchQuery, activeTab, allStudents]);

  const handleApproveStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Student Approved',
        description: 'Student has been approved and is now visible to recruiters.',
      });
    } catch (error) {
      console.error('Error approving student:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve student',
        variant: 'destructive'
      });
    }
  };

  const handleRejectStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ status: 'rejected' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Student Rejected',
        description: 'Student application has been rejected.',
      });
    } catch (error) {
      console.error('Error rejecting student:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject student',
        variant: 'destructive'
      });
    }
  };

  // Count students by status
  const pendingCount = allStudents.filter(s => s.status === 'pending').length;
  const approvedCount = allStudents.filter(s => s.status === 'approved').length;
  const rejectedCount = allStudents.filter(s => s.status === 'rejected').length;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-description">
            Review and manage student profiles
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 flex items-center shadow-sm border-l-4 border-l-yellow-400 animate-slide-in">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <UserCheck className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </Card>
          
          <Card className="p-6 flex items-center shadow-sm border-l-4 border-l-green-400 animate-slide-in delay-100">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{approvedCount}</p>
            </div>
          </Card>
          
          <Card className="p-6 flex items-center shadow-sm border-l-4 border-l-red-400 animate-slide-in delay-200">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold">{rejectedCount}</p>
            </div>
          </Card>
        </div>
        
        {/* Student Management */}
        <div className="bg-white shadow-sm rounded-xl border p-6 animate-scale-in">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Student Profiles</h2>
            
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80"
              />
            </div>
          </div>
          
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingCount > 0 && (
                  <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600">{pendingCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                {approvedCount > 0 && (
                  <Badge className="ml-2 bg-green-500 hover:bg-green-600">{approvedCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                {rejectedCount > 0 && (
                  <Badge className="ml-2 bg-red-500 hover:bg-red-600">{rejectedCount}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No students found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <ProfileCard
                  key={student.id}
                  student={student}
                  isAdmin={true}
                  onApprove={handleApproveStudent}
                  onReject={handleRejectStudent}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Wrap with auth HOC to protect this route
export default withAuth(AdminDashboard, ['admin']);
