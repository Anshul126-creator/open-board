import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export function SubjectSetup() {
  const { subjects, classes, addSubject } = useData();
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
    
    addSubject(newSubject);
    toast.success('Subject added successfully');
    setIsAddDialogOpen(false);
    setNewSubject({ name: '', code: '', classId: '', maxMarks: 100 });
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Unknown';
  };

  // Group subjects by class
  const subjectsByClass = classes.map(cls => ({
    class: cls,
    subjects: subjects.filter(s => s.classId === cls.id)
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl tracking-tight">Subject Setup</h2>
          <p className="text-muted-foreground">Configure subjects for each class</p>
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
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={newSubject.classId}
                  onValueChange={(value) => setNewSubject({ ...newSubject, classId: value })}
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
                <Label htmlFor="name">Subject Name *</Label>
                <Input
                  id="name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Subject Code *</Label>
                <Input
                  id="code"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  placeholder="e.g., MATH"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxMarks">Maximum Marks *</Label>
                <Input
                  id="maxMarks"
                  type="number"
                  value={newSubject.maxMarks}
                  onChange={(e) => setNewSubject({ ...newSubject, maxMarks: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubject}>Add Subject</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {subjectsByClass.map(({ class: cls, subjects: classSubjects }) => (
        <Card key={cls.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {cls.name} ({classSubjects.length} subjects)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {classSubjects.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Maximum Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-mono">{subject.code}</TableCell>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>{subject.maxMarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No subjects configured for this class
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
