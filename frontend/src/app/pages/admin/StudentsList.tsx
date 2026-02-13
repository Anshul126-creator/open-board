import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Users, Search } from 'lucide-react';
import { useState } from 'react';

export function StudentsList() {
  const { students, centers, sessions } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCenter, setFilterCenter] = useState('all');
  const [filterSession, setFilterSession] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCenter = filterCenter === 'all' || student.centerId === filterCenter;
    const matchesSession = filterSession === 'all' || student.sessionId === filterSession;
    
    return matchesSearch && matchesCenter && matchesSession;
  });

  const getCenterName = (centerId: string) => {
    return centers.find(c => c.id === centerId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Student Master List</h2>
        <p className="text-muted-foreground">View and manage all registered students</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, roll number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCenter} onValueChange={setFilterCenter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by center" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Centers</SelectItem>
            {centers.map(center => (
              <SelectItem key={center.id} value={center.id}>{center.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterSession} onValueChange={setFilterSession}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            {sessions.map(session => (
              <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Students ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Center</TableHead>
                <TableHead>Class</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono">{student.rollNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div>{student.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Father: {student.fatherName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCenterName(student.centerId)}</Badge>
                  </TableCell>
                  <TableCell>{student.class}</TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
