'use client';

import { useState } from 'react';
import { useData } from '@/app/contexts/DataProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function CenterManagementPage() {
  const { centers, addCenter, updateCenter } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCenter, setNewCenter] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    status: 'pending' as const
  });

  const handleAddCenter = () => {
    if (!newCenter.name || !newCenter.code || !newCenter.email) {
      toast.error('Please fill all required fields');
      return;
    }
    
    addCenter(newCenter);
    toast.success('Center added successfully');
    setIsAddDialogOpen(false);
    setNewCenter({
      name: '',
      code: '',
      address: '',
      phone: '',
      email: '',
      status: 'pending'
    });
  };

  const handleStatusChange = (centerId: string, newStatus: 'active' | 'suspended' | 'pending') => {
    updateCenter(centerId, { status: newStatus });
    toast.success(`Center status updated to ${newStatus}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'suspended':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl tracking-tight">Center Management</h2>
          <p className="text-muted-foreground">Manage and monitor all education centers</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Center
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Center</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Center Name *</Label>
                  <Input
                    id="name"
                    value={newCenter.name}
                    onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
                    placeholder="e.g., Delhi Central Institute"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Center Code *</Label>
                  <Input
                    id="code"
                    value={newCenter.code}
                    onChange={(e) => setNewCenter({ ...newCenter, code: e.target.value })}
                    placeholder="e.g., DCI001"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCenter.email}
                  onChange={(e) => setNewCenter({ ...newCenter, email: e.target.value })}
                  placeholder="center@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCenter.phone}
                  onChange={(e) => setNewCenter({ ...newCenter, phone: e.target.value })}
                  placeholder="+91-9876543210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newCenter.address}
                  onChange={(e) => setNewCenter({ ...newCenter, address: e.target.value })}
                  placeholder="Full address"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCenter}>Add Center</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Centers ({centers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centers.map((center) => (
                <TableRow key={center.id}>
                  <TableCell className="font-mono">{center.code}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {center.name}
                    </div>
                  </TableCell>
                  <TableCell>{center.email}</TableCell>
                  <TableCell>{center.phone}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(center.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(center.status)}
                        {center.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={center.status}
                      onValueChange={(value) => handleStatusChange(center.id, value as any)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
