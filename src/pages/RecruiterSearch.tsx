
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { students, Student } from '@/utils/mockData';
import { searchStudents } from '@/utils/searchUtils';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchBar from '@/components/SearchBar';
import ProfileCard from '@/components/ProfileCard';
import Navbar from '@/components/Navbar';
import { Search as SearchIcon, Filter, ChevronDown } from 'lucide-react';

const RecruiterSearch = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Student[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  
  // Get approved students
  const approvedStudents = students.filter(s => s.status === 'approved');
  
  useEffect(() => {
    // Initialize with all approved students
    setResults(approvedStudents);
  }, []);
  
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      toast({
        title: 'Please enter a search query',
        description: 'Try something like "C4 student who knows React" or "Design student with Figma experience"',
      });
      return;
    }
    
    const searchResults = searchStudents(searchQuery, students);
    
    // Apply filters if selected
    let filteredResults = searchResults;
    
    if (selectedSchool) {
      filteredResults = filteredResults.filter(student => student.school === selectedSchool);
    }
    
    if (selectedBatch) {
      filteredResults = filteredResults.filter(student => student.batch === selectedBatch);
    }
    
    setResults(filteredResults);
    
    toast({
      title: `${filteredResults.length} candidates found`,
      description: filteredResults.length > 0 
        ? 'Candidates are sorted by relevance to your search'
        : 'Try adjusting your search terms or filters',
    });
  };
  
  const handleSchoolFilter = (school: string | null) => {
    setSelectedSchool(school);
    applyFilters(query, school, selectedBatch);
  };
  
  const handleBatchFilter = (batch: string | null) => {
    setSelectedBatch(batch);
    applyFilters(query, selectedSchool, batch);
  };
  
  const applyFilters = (searchQuery: string, school: string | null, batch: string | null) => {
    let filteredResults = searchQuery 
      ? searchStudents(searchQuery, students) 
      : approvedStudents;
    
    if (school) {
      filteredResults = filteredResults.filter(student => student.school === school);
    }
    
    if (batch) {
      filteredResults = filteredResults.filter(student => student.batch === batch);
    }
    
    setResults(filteredResults);
  };
  
  const clearFilters = () => {
    setSelectedSchool(null);
    setSelectedBatch(null);
    
    if (query) {
      handleSearch(query);
    } else {
      setResults(approvedStudents);
    }
  };
  
  // Get unique schools and batches for filters
  const schools = Array.from(new Set(approvedStudents.map(s => s.school)));
  const batches = Array.from(new Set(approvedStudents.map(s => s.batch))).sort();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="page-header">
          <h1 className="page-title">Find Top Talent</h1>
          <p className="page-description">
            Search for candidates using natural language queries like "C4 coding student who knows AWS"
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-xl border p-6 mb-8 animate-slide-in">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search for skills, batch, or school (e.g., 'C4 student with React experience')"
          />
          
          <div className="mt-4 flex justify-between items-center">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 text-muted-foreground"
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={14} className={`transition-transform ${isFiltersVisible ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {results.length} candidates available
            </div>
          </div>
          
          {isFiltersVisible && (
            <div className="mt-4 pt-4 border-t animate-slide-in">
              <div className="flex flex-col sm:flex-row gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">School</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={selectedSchool === null ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleSchoolFilter(null)}
                    >
                      All
                    </Badge>
                    {schools.map(school => (
                      <Badge
                        key={school}
                        variant={selectedSchool === school ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleSchoolFilter(school)}
                      >
                        {school}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Batch</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={selectedBatch === null ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleBatchFilter(null)}
                    >
                      All
                    </Badge>
                    {batches.map(batch => (
                      <Badge
                        key={batch}
                        variant={selectedBatch === batch ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleBatchFilter(batch)}
                      >
                        {batch}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {results.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
            {results.map((student) => (
              <ProfileCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <Card className="p-12 flex flex-col items-center justify-center text-center border-2 border-dashed animate-scale-in">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <SearchIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No candidates found</h3>
            <p className="text-muted-foreground max-w-md">
              Try adjusting your search terms or filters to find more candidates.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default RecruiterSearch;
