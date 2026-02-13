'use client';

import { useData } from '@/app/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StudentResultsPage() {
  const { marks, currentUser, subjects } = useData();

  const studentMarks = marks.filter(m => m.studentId === currentUser?.id || m.studentId === currentUser?.name);

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Results & Documents</h2>
        <p className="text-muted-foreground">View your examination results and download documents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marks ({studentMarks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {studentMarks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No marks available yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Entered Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentMarks.map((mark) => (
                  <TableRow key={mark.id}>
                    <TableCell>{getSubjectName(mark.subjectId)}</TableCell>
                    <TableCell className="font-medium">{mark.marks}</TableCell>
                    <TableCell>{new Date(mark.enteredAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
