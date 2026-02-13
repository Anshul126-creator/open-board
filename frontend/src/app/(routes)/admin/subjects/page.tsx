'use client';

import { useState } from 'react';
import { useData } from '@/app/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function SubjectsPage() {
  const { subjects, addClass, classes } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    classId: '',
    maxMarks: 100
  });

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.code || !newSubject.classId) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Subject added successfully');
    setIsAddDialogOpen(false);
    setNewSubject({
      name: '',
      code: '',
      classId: '',
      maxMarks: 100
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl tracking-tight">Subject Setup</h2>
          <p className="text-muted-foreground">Manage subjects for each class</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject-name">Subject Name *</Label>
                <Input
                  id="subject-name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject-code">Code *</Label>
                <Input
                  id="subject-code"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  placeholder="e.g., MATH"
                />
              </div>
              <div className="space-y-2">
                <Label>Class *</Label>
                <Select value={newSubject.classId} onValueChange={(value) => setNewSubject({ ...newSubject, classId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-marks">Max Marks</Label>
                <Input
                  id="max-marks"
                  type="number"
                  value={newSubject.maxMarks}
                  onChange={(e) => setNewSubject({ ...newSubject, maxMarks: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSubject}>Add Subject</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subjects ({subjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Max Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-mono">{subject.code}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.classId}</TableCell>
                  <TableCell>{subject.maxMarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
