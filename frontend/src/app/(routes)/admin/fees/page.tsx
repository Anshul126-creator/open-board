'use client';

import { useData } from '@/app/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FeesPage() {
  const { feeStructures, sessions } = useData();

  const getSessionName = (sessionId: string) => {
    return sessions.find(s => s.id === sessionId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Fee Structure Setup</h2>
        <p className="text-muted-foreground">Manage fee structures for each session and class</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Structures ({feeStructures.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeStructures.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{getSessionName(fee.sessionId)}</TableCell>
                  <TableCell>{fee.classId}</TableCell>
                  <TableCell className="font-medium">₹{fee.amount.toLocaleString()}</TableCell>
                  <TableCell>{fee.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
