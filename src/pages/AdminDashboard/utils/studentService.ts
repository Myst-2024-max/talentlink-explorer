
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/utils/mockData';

export const fetchStudents = async (): Promise<Student[]> => {
  console.log('Fetching students data...');
  
  const { data, error } = await supabase
    .from('students')
    .select('*');
  
  if (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
  
  if (!data) {
    return [];
  }
  
  console.log('Students data received:', data);
  
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
  
  return formattedStudents;
};

export const updateStudentStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
  const { error } = await supabase
    .from('students')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating student status to ${status}:`, error);
    throw error;
  }
};
