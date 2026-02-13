'use client';

import { useData } from '@/app/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function PaymentTrackingPage() {
  const { payments, students, currentUser } = useData();

  const centerStudents = students.filter(s => s.centerId === currentUser?.centerId);
  const centerPayments = payments.filter(p => 
    centerStudents.some(s => s.id === p.studentId)
  );

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Payment Tracking</h2>
        <p className="text-muted-foreground">Track student payments at your center</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments ({centerPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {centerPayments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No payments found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Session</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centerPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{getStudentName(payment.studentId)}</TableCell>
                    <TableCell className="font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.sessionId}</TableCell>
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
