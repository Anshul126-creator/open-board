import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function TimetableUpload() {
  const { timetables, sessions, classes, addTimetable } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTimetable, setNewTimetable] = useState({
    sessionId: '',
    classId: '',
    file: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTimetable({ ...newTimetable, file: e.target.files[0] });
    }
  };

  const handleUpload = () => {
    if (!newTimetable.sessionId || !newTimetable.classId || !newTimetable.file) {
      toast.error('Please fill all required fields and select a file');
      return;
    }
    
    // In a real app, this would upload to storage
    const fileUrl = URL.createObjectURL(newTimetable.file);
    
    addTimetable({
      sessionId: newTimetable.sessionId,
      classId: newTimetable.classId,
      fileUrl
    });
    
    toast.success('Timetable uploaded successfully');
    setIsAddDialogOpen(false);
    setNewTimetable({ sessionId: '', classId: '', file: null });
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
          <h2 className="text-3xl tracking-tight">Timetable Upload</h2>
          <p className="text-muted-foreground">Upload and manage class timetables</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Timetable
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Timetable</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="session">Session *</Label>
                <Select
                  value={newTimetable.sessionId}
                  onValueChange={(value) => setNewTimetable({ ...newTimetable, sessionId: value })}
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
                  value={newTimetable.classId}
                  onValueChange={(value) => setNewTimetable({ ...newTimetable, classId: value })}
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
                <Label htmlFor="file">Timetable File (PDF, Image) *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <Upload className="w-4 h-4 text-muted-foreground" />
                </div>
                {newTimetable.file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {newTimetable.file.name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>Upload</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Uploaded Timetables ({timetables.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Uploaded On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetables.map((timetable) => (
                <TableRow key={timetable.id}>
                  <TableCell>{getSessionName(timetable.sessionId)}</TableCell>
                  <TableCell>{getClassName(timetable.classId)}</TableCell>
                  <TableCell>{new Date(timetable.uploadedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(timetable.fileUrl, '_blank')}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {timetables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No timetables uploaded
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
