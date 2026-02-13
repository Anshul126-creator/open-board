'use client';

import { useData } from '@/app/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function TimetablesPage() {
  const { timetables, sessions } = useData();

  const getSessionName = (sessionId: string) => {
    return sessions.find(s => s.id === sessionId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Timetable Upload</h2>
        <p className="text-muted-foreground">Manage class timetables</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Timetables ({timetables.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {timetables.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No timetables uploaded yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Uploaded At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetables.map((timetable) => (
                  <TableRow key={timetable.id}>
                    <TableCell>{getSessionName(timetable.sessionId)}</TableCell>
                    <TableCell>{timetable.classId}</TableCell>
                    <TableCell>{new Date(timetable.uploadedAt).toLocaleDateString()}</TableCell>
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
