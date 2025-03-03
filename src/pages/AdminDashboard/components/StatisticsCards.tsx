
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { Student } from '@/utils/mockData';

interface StatisticsCardsProps {
  students: Student[];
}

const StatisticsCards = ({ students }: StatisticsCardsProps) => {
  // Count students by status
  const pendingCount = students.filter(s => s.status === 'pending').length;
  const approvedCount = students.filter(s => s.status === 'approved').length;
  const rejectedCount = students.filter(s => s.status === 'rejected').length;

  return (
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
  );
};

export default StatisticsCards;
