import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { CheckCircle, XCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';

export function ResultPublish() {
  const { sessions, classes, results, publishResult, marks } = useData();
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const handlePublish = () => {
    if (!selectedSession || !selectedClass) {
      toast.error('Please select session and class');
      return;
    }
    
    publishResult(selectedSession, selectedClass);
    toast.success('Results published successfully');
  };

  const isPublished = (sessionId: string, classId: string) => {
    const result = results.find(r => r.sessionId === sessionId && r.classId === classId);
    return result?.isPublished || false;
  };

  const getPublishedDate = (sessionId: string, classId: string) => {
    const result = results.find(r => r.sessionId === sessionId && r.classId === classId);
    return result?.publishedAt ? new Date(result.publishedAt).toLocaleDateString() : '-';
  };

  const getMarksCount = (sessionId: string, classId: string) => {
    return marks.filter(m => m.sessionId === sessionId).length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Result Publishing</h2>
        <p className="text-muted-foreground">Publish results for students to view</p>
      </div>

      {/* Publish Form */}
      <Card>
        <CardHeader>
          <CardTitle>Publish New Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Session</label>
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
                <label className="text-sm">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
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
            </div>
            
            {selectedSession && selectedClass && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Marks entered:</strong> {getMarksCount(selectedSession, selectedClass)} records
                </p>
                <p className="text-sm text-blue-900 mt-1">
                  <strong>Status:</strong> {isPublished(selectedSession, selectedClass) ? 'Already Published' : 'Not Published'}
                </p>
              </div>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={!selectedSession || !selectedClass}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publish Results
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Result Publication</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to publish results for this session and class? 
                    Students will be able to view their results immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePublish}>
                    Publish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Published Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Publication History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead>Marks Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map(session => 
                classes.map(cls => {
                  const published = isPublished(session.id, cls.id);
                  const marksCount = getMarksCount(session.id, cls.id);
                  
                  if (marksCount === 0 && !published) return null;
                  
                  return (
                    <TableRow key={`${session.id}-${cls.id}`}>
                      <TableCell>{session.name}</TableCell>
                      <TableCell>{cls.name}</TableCell>
                      <TableCell>
                        {published ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <XCircle className="w-3 h-3 mr-1" />
                            Not Published
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{getPublishedDate(session.id, cls.id)}</TableCell>
                      <TableCell>{marksCount}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
