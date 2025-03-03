
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/ProfileCard';
import { Student } from '@/utils/mockData';
import { updateStudentStatus } from '../utils/studentService';

interface StudentManagementProps {
  students: Student[];
  isLoading: boolean;
}

const StudentManagement = ({ students, isLoading }: StudentManagementProps) => {
  const { toast } = useToast();
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    // Filter students based on search and tab
    let filtered = students;
    
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
  }, [searchQuery, activeTab, students]);

  const handleApproveStudent = async (id: string) => {
    try {
      await updateStudentStatus(id, 'approved');
      
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
      await updateStudentStatus(id, 'rejected');
      
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

  // Count students by status for badges
  const pendingCount = students.filter(s => s.status === 'pending').length;
  const approvedCount = students.filter(s => s.status === 'approved').length;
  const rejectedCount = students.filter(s => s.status === 'rejected').length;

  return (
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
  );
};

export default StudentManagement;
