
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Linkedin } from "lucide-react";
import { Student } from "@/utils/mockData";

interface ProfileCardProps {
  student: Student;
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const ProfileCard = ({ student, isAdmin, onApprove, onReject }: ProfileCardProps) => {
  const schoolColors = {
    Coding: "bg-blue-100 text-blue-800",
    Marketing: "bg-green-100 text-green-800",
    Design: "bg-purple-100 text-purple-800",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium">{student.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="font-medium">
                {student.batch}
              </Badge>
              <Badge 
                variant="secondary" 
                className={`${schoolColors[student.school]} border-0`}
              >
                {student.school}
              </Badge>
              {isAdmin && (
                <Badge 
                  variant="secondary" 
                  className={`${statusColors[student.status]} border-0 capitalize`}
                >
                  {student.status}
                </Badge>
              )}
            </div>
          </div>
          <Badge variant="outline" className="font-medium">
            {student.yearsOfExperience} {student.yearsOfExperience === 1 ? 'year' : 'years'}
          </Badge>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {student.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="font-normal">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center p-6 bg-muted/30 border-t">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1.5 text-xs" 
            asChild
          >
            <a href={student.linkedInUrl} target="_blank" rel="noopener noreferrer">
              <Linkedin size={14} /> LinkedIn
            </a>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1.5 text-xs" 
            asChild
          >
            <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer">
              <FileText size={14} /> Resume
            </a>
          </Button>
        </div>

        {isAdmin && student.status === "pending" && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onReject && onReject(student.id)}
            >
              Reject
            </Button>
            <Button 
              size="sm" 
              onClick={() => onApprove && onApprove(student.id)}
            >
              Approve
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
