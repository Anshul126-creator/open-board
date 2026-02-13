'use client';

import { useData } from '@/app/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function ResultsPage() {
  const { results, sessions } = useData();

  const getSessionName = (sessionId: string) => {
    return sessions.find(s => s.id === sessionId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Publish Results</h2>
        <p className="text-muted-foreground">Manage and publish examination results</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Published Results ({results.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No results published yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{getSessionName(result.sessionId)}</TableCell>
                    <TableCell>{result.classId}</TableCell>
                    <TableCell>
                      <Badge className={result.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {result.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{result.publishedAt ? new Date(result.publishedAt).toLocaleDateString() : '-'}</TableCell>
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
