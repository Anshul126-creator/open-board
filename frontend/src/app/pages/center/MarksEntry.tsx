import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { BookMarked, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';

export function MarksEntry() {
  const { students, subjects, sessions, marks, addMarks, bulkAddMarks, currentUser } = useData();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [marksValue, setMarksValue] = useState('');
  
  // Filter students for current center
  const centerStudents = students.filter(s => s.centerId === currentUser?.centerId);

  const handleSubmit = () => {
    if (!selectedStudent || !selectedSubject || !selectedSession || !marksValue) {
      toast.error('Please fill all fields');
      return;
    }

    const subject = subjects.find(s => s.id === selectedSubject);
    const marksNum = parseFloat(marksValue);

    if (marksNum > (subject?.maxMarks || 100)) {
      toast.error(`Marks cannot exceed ${subject?.maxMarks}`);
      return;
    }

    addMarks({
      studentId: selectedStudent,
      subjectId: selectedSubject,
      sessionId: selectedSession,
      marks: marksNum,
      maxMarks: subject?.maxMarks || 100,
      enteredBy: currentUser?.id || ''
    });

    toast.success('Marks entered successfully');
    setMarksValue('');
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const validMarks = results.data
          .filter((row: any) => row.rollNumber && row.subjectCode && row.marks)
          .map((row: any) => {
            const student = centerStudents.find(s => s.rollNumber === row.rollNumber);
            const subject = subjects.find(s => s.code === row.subjectCode);
            
            if (!student || !subject) return null;

            return {
              studentId: student.id,
              subjectId: subject.id,
              sessionId: selectedSession,
              marks: parseFloat(row.marks),
              maxMarks: subject.maxMarks,
              enteredBy: currentUser?.id || ''
            };
          })
          .filter(Boolean) as any[];

        if (validMarks.length > 0) {
          bulkAddMarks(validMarks);
          toast.success(`${validMarks.length} marks uploaded successfully`);
        } else {
          toast.error('No valid marks found in CSV');
        }
      },
      error: () => {
        toast.error('Error parsing CSV file');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Marks Entry</h2>
        <p className="text-muted-foreground">Enter or upload student marks</p>
      </div>

      <Tabs defaultValue="single">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="single">Single Entry</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="w-5 h-5" />
                Enter Marks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Session *</Label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
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
                <Label>Student *</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {centerStudents.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.rollNumber} - {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} (Max: {subject.maxMarks})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Marks Obtained *</Label>
                <Input
                  type="number"
                  value={marksValue}
                  onChange={(e) => setMarksValue(e.target.value)}
                  placeholder="Enter marks"
                  min="0"
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Submit Marks
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Bulk Upload CSV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Session *</Label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
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
                <Label>Upload CSV File</Label>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleBulkUpload}
                  disabled={!selectedSession}
                />
                <p className="text-sm text-muted-foreground">
                  CSV format: rollNumber, subjectCode, marks
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Example CSV format:</strong>
                </p>
                <pre className="text-xs mt-2 bg-white p-2 rounded">
                  rollNumber,subjectCode,marks
                  {'\n'}DCI001001,MATH,85
                  {'\n'}DCI001001,SCI,90
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
