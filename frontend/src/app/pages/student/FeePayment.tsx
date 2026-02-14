import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DollarSign, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../../components/ui/dialog';

export function FeePayment() {
  const { currentUser, students, payments, feeStructures, addPayment, updatePayment } = useData();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  
  const studentData = students.find(s => s.email === currentUser?.email);
  const studentPayments = payments.filter(p => p.studentId === studentData?.id);
  
  // Find applicable fee structure
  const applicableFee = feeStructures.find(
    f => f.sessionId === studentData?.sessionId && f.classId === studentData?.class
  );

  const handlePaymentClick = (payment: any) => {
    setSelectedPayment(payment);
    setIsPaymentDialogOpen(true);
  };

  const handleMockPayment = () => {
    if (!selectedPayment) return;

    // Mock Razorpay payment - in real app, this would integrate with Razorpay
    setTimeout(() => {
      const transactionId = `TXN${Date.now()}`;
      updatePayment(selectedPayment.id, {
        status: 'completed',
        paymentDate: new Date().toISOString(),
        transactionId
      });
      
      toast.success('Payment completed successfully!');
      setIsPaymentDialogOpen(false);
      setSelectedPayment(null);
    }, 1500);
  };

  const totalPaid = studentPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = studentPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Fee Payment</h2>
        <p className="text-muted-foreground">Manage your fee payments</p>
      </div>

      {/* Fee Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Annual Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹{applicableFee?.amount.toLocaleString() || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Amount Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹{totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹{pendingAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p>₹{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.paymentDate
                          ? `Paid on ${new Date(payment.paymentDate).toLocaleDateString()}`
                          : 'Payment pending'
                        }
                      </p>
                      {payment.transactionId && (
                        <p className="text-xs text-muted-foreground font-mono">
                          TXN: {payment.transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {payment.status === 'completed' ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Paid
                    </Badge>
                  ) : (
                    <>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      <Button size="sm" onClick={() => handlePaymentClick(payment)}>
                        Pay Now
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {studentPayments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No payment records found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog (Mock Razorpay) */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              This is a demo payment interface. In production, this would integrate with Razorpay.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span>Amount to Pay:</span>
              <span className="text-xl">₹{selectedPayment?.amount.toLocaleString()}</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This is a mock payment gateway for demonstration purposes.
                In a real application, you would integrate with Razorpay or another payment provider.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsPaymentDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleMockPayment}>
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
