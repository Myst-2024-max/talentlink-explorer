
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import StatisticsCards from './components/StatisticsCards';
import StudentManagement from './components/StudentManagement';
import { fetchStudents } from './utils/studentService';
import { Student } from '@/utils/mockData';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboardContent = () => {
  const { toast } = useToast();
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load students data
  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const students = await fetchStudents();
      setAllStudents(students);
    } catch (error) {
      console.error('Error in fetchStudents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load students data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial data fetch
    loadStudents();
    
    // Set up real-time subscription to students table changes
    const channel = supabase
      .channel('public:students')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'students' 
      }, payload => {
        console.log('Realtime update received:', payload);
        // Refresh the data when any change occurs
        loadStudents();
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

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
        <StatisticsCards students={allStudents} />
        
        {/* Student Management */}
        <StudentManagement 
          students={allStudents} 
          isLoading={isLoading} 
        />
      </main>
    </div>
  );
};

export default AdminDashboardContent;
