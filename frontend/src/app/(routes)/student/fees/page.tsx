'use client';

import { useData } from '@/app/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function FeePaymentPage() {
  const { payments, currentUser } = useData();

  const studentPayments = payments.filter(p => p.studentId === currentUser?.id || p.studentId === currentUser?.name);

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
        <h2 className="text-3xl tracking-tight">Fee Payment</h2>
        <p className="text-muted-foreground">View and pay your fees</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History ({studentPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {studentPayments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No payment records found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Session</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentPayments.map((payment) => (
                  <TableRow key={payment.id}>
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
