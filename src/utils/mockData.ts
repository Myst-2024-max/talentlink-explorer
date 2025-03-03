
export type UserRole = 'admin' | 'student' | 'recruiter';

export type Student = {
  id: string;
  name: string;
  batch: string;
  school: 'Coding' | 'Marketing' | 'Design';
  skills: string[];
  yearsOfExperience: number;
  linkedInUrl: string;
  resumeUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
};

export type User = {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  student?: Student;
};

// Mock initial users
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin@1234',
    role: 'admin',
  },
];

// Mock initial students (empty, will be populated through registration)
export const students: Student[] = [
  {
    id: '101',
    name: 'Alex Johnson',
    batch: 'C4',
    school: 'Coding',
    skills: ['React', 'TypeScript', 'AWS', 'Node.js'],
    yearsOfExperience: 3,
    linkedInUrl: 'https://linkedin.com/in/alexjohnson',
    resumeUrl: '/resumes/alexjohnson.pdf',
    status: 'approved',
    createdAt: new Date('2023-05-10'),
  },
  {
    id: '102',
    name: 'Sophia Chen',
    batch: 'C5',
    school: 'Coding',
    skills: ['Flutter', 'Firebase', 'Python', 'AWS'],
    yearsOfExperience: 2,
    linkedInUrl: 'https://linkedin.com/in/sophiachen',
    resumeUrl: '/resumes/sophiachen.pdf',
    status: 'approved',
    createdAt: new Date('2023-06-15'),
  },
  {
    id: '103',
    name: 'Marcus Williams',
    batch: 'M3',
    school: 'Marketing',
    skills: ['SEO', 'Content Strategy', 'Google Analytics', 'Social Media'],
    yearsOfExperience: 4,
    linkedInUrl: 'https://linkedin.com/in/marcuswilliams',
    resumeUrl: '/resumes/marcuswilliams.pdf',
    status: 'approved',
    createdAt: new Date('2023-04-22'),
  },
  {
    id: '104',
    name: 'Priya Patel',
    batch: 'D2',
    school: 'Design',
    skills: ['UI/UX', 'Figma', 'Adobe XD', 'Illustration'],
    yearsOfExperience: 2,
    linkedInUrl: 'https://linkedin.com/in/priyapatel',
    resumeUrl: '/resumes/priyapatel.pdf',
    status: 'pending',
    createdAt: new Date('2023-07-03'),
  },
  {
    id: '105',
    name: 'David Kim',
    batch: 'C3',
    school: 'Coding',
    skills: ['Java', 'Spring Boot', 'Docker', 'Kubernetes'],
    yearsOfExperience: 5,
    linkedInUrl: 'https://linkedin.com/in/davidkim',
    resumeUrl: '/resumes/davidkim.pdf',
    status: 'approved',
    createdAt: new Date('2023-03-18'),
  },
  {
    id: '106',
    name: 'Emma Davis',
    batch: 'D3',
    school: 'Design',
    skills: ['Interaction Design', 'Prototyping', 'User Research', 'Sketch'],
    yearsOfExperience: 3,
    linkedInUrl: 'https://linkedin.com/in/emmadavis',
    resumeUrl: '/resumes/emmadavis.pdf',
    status: 'pending',
    createdAt: new Date('2023-07-12'),
  },
];

// Function to add a new student (for registration)
export const addStudent = (student: Omit<Student, 'id' | 'createdAt' | 'status'>) => {
  const newStudent: Student = {
    ...student,
    id: `${students.length + 107}`,
    status: 'pending',
    createdAt: new Date(),
  };
  
  students.push(newStudent);
  return newStudent;
};

// Function to update a student's status (for admin approval)
export const updateStudentStatus = (id: string, status: 'approved' | 'rejected') => {
  const studentIndex = students.findIndex(s => s.id === id);
  if (studentIndex !== -1) {
    students[studentIndex].status = status;
    return true;
  }
  return false;
};

// Function to register a new user
export const registerUser = (username: string, password: string, role: UserRole, studentId?: string) => {
  const newUser: User = {
    id: `${users.length + 1}`,
    username,
    password,
    role,
  };
  
  if (studentId) {
    const student = students.find(s => s.id === studentId);
    if (student) {
      newUser.student = student;
    }
  }
  
  users.push(newUser);
  return newUser;
};

// Function to authenticate a user
export const authenticateUser = (username: string, password: string) => {
  return users.find(user => user.username === username && user.password === password);
};
