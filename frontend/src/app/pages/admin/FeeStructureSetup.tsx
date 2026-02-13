import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export function FeeStructureSetup() {
  const { feeStructures, sessions, classes, addFeeStructure } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFee, setNewFee] = useState({
    sessionId: '',
    classId: '',
    amount: 0,
    description: ''
  });

  const handleAddFee = () => {
    if (!newFee.sessionId || !newFee.classId || newFee.amount <= 0) {
      toast.error('Please fill all required fields');
      return;
    }
    
    addFeeStructure(newFee);
    toast.success('Fee structure added successfully');
    setIsAddDialogOpen(false);
    setNewFee({ sessionId: '', classId: '', amount: 0, description: '' });
  };

  const getSessionName = (sessionId: string) => {
    return sessions.find(s => s.id === sessionId)?.name || 'Unknown';
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl tracking-tight">Fee Structure Setup</h2>
          <p className="text-muted-foreground">Configure fees for each class and session</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Fee Structure
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Fee Structure</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="session">Session *</Label>
                <Select
                  value={newFee.sessionId}
                  onValueChange={(value) => setNewFee({ ...newFee, sessionId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map(session => (
                      <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={newFee.classId}
                  onValueChange={(value) => setNewFee({ ...newFee, classId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newFee.amount || ''}
                  onChange={(e) => setNewFee({ ...newFee, amount: parseFloat(e.target.value) })}
                  placeholder="e.g., 5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newFee.description}
                  onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFee}>Add Fee</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Fee Structures ({feeStructures.length})
          </CardTitle>
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
                  <TableCell>{getClassName(fee.classId)}</TableCell>
                  <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{fee.description || '-'}</TableCell>
                </TableRow>
              ))}
              {feeStructures.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No fee structures configured
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
