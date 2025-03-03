
import { Student } from './mockData';

// This is a simplified version of what would normally be handled by Gemini API
// For demonstration purposes, we'll implement a basic search logic

type SearchResult = {
  student: Student;
  score: number;
};

// Helper function to calculate relevance score
const calculateRelevanceScore = (student: Student, query: string): number => {
  const queryLower = query.toLowerCase();
  let score = 0;
  
  // Parse the query to extract key information
  const batchMatch = queryLower.match(/[cmdb][0-9]/i); // Match batch patterns like C4, M3
  const schoolMatches = {
    coding: queryLower.includes('coding') || queryLower.includes('developer') || queryLower.includes('programmer'),
    marketing: queryLower.includes('marketing') || queryLower.includes('marketer'),
    design: queryLower.includes('design') || queryLower.includes('designer') || queryLower.includes('ux'),
  };
  
  // Extract all possible skills from the query
  const commonSkills = [
    'react', 'angular', 'vue', 'javascript', 'typescript', 'node', 'express', 
    'python', 'django', 'flask', 'java', 'spring', 'aws', 'azure', 'gcp',
    'docker', 'kubernetes', 'flutter', 'firebase', 'mongodb', 'sql', 'nosql',
    'seo', 'content', 'analytics', 'social media', 'email marketing', 'ads',
    'ui', 'ux', 'figma', 'sketch', 'adobe', 'illustrator', 'photoshop', 'xd'
  ];
  
  const mentionedSkills = commonSkills.filter(skill => queryLower.includes(skill));
  
  // Match batch if specified
  if (batchMatch && student.batch.toLowerCase() === batchMatch[0].toLowerCase()) {
    score += 30;
  }
  
  // Match school if specified
  if (
    (schoolMatches.coding && student.school === 'Coding') || 
    (schoolMatches.marketing && student.school === 'Marketing') || 
    (schoolMatches.design && student.school === 'Design')
  ) {
    score += 30;
  }
  
  // Match skills
  const matchedSkills = student.skills.filter(skill => 
    mentionedSkills.some(m => skill.toLowerCase().includes(m))
  );
  
  score += matchedSkills.length * 15;
  
  // Add experience points (higher experience = higher score)
  score += student.yearsOfExperience * 5;
  
  return score;
};

export const searchStudents = (query: string, students: Student[]): Student[] => {
  // Only search among approved students
  const approvedStudents = students.filter(student => student.status === 'approved');
  
  if (!query.trim()) {
    // If no query, return all approved students sorted by experience
    return approvedStudents.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
  }
  
  // Calculate relevance scores for each student
  const results: SearchResult[] = approvedStudents.map(student => ({
    student,
    score: calculateRelevanceScore(student, query)
  }));
  
  // Sort by score (descending) and then by experience if scores are equal
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.student.yearsOfExperience - a.student.yearsOfExperience;
  });
  
  // Return only the students, in sorted order
  return results.map(result => result.student);
};
